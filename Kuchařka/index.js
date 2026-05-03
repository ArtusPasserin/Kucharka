const express = require('express'); 
const PORT_APP = process.env.PORT_APP || 3000;
const app = express();
const db = require("./db");
const path = require('path');

app.use(express.json());

app.listen(PORT_APP, () => {
    console.log(`Server běží na portu ${PORT_APP}`);
});

// ==========================================================================
app.get('/', (req, res) => {
    res.send('Vítejte v API kuchařky!');

    //res.sendFile(path.join(__dirname,"/index.html"))
});

// ==========================================================================
app.get('/recepty', (req, res) => {
    const sql = 'SELECT * FROM REC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Chyba při dotazu do DB:', err);
            return res.status(500).send('Chyba serveru při čtení databáze');
        }

        console.log('Data z databáze byla úspěšně načtena:');
        console.table(results);

        res.json(results);
    });
});

// ==========================================================================
app.get("/recepty/:id", (req, res) => {
    const receptId = req.params.id;
    const sql1 = "SELECT REC.nazev, REC.postup FROM REC WHERE id = ?";
    const sql2 = "SELECT ING.nazev, REC_ING.mnozstvi FROM ING, REC_ING WHERE ING.id = ING_id AND REC_id = ?";

    db.query(sql1, [receptId], (err, results1) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results1.length === 0) {
            return res.status(404).json({ message: 'Recept nebyl nalezen' });
        }

        db.query(sql2, [receptId], (err, results2) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results2.length === 0) {
                return res.status(404).json({ message: 'Recept nebyl nalezen' });
            }
        
            let vysledek = [];
            results2.forEach(element => {vysledek.push(element)});
            
            res.json({
                recept:results1[0],
                ingredience:vysledek
            });
        });
    });

});

// ==========================================================================
app.post('/vytvoreni', async (req, res) => {

    const { nazev, postup, ingredience } = req.body; 

    if (!nazev || nazev.trim().length < 2) {
    return res.status(400).json({ error: "Název receptu je povinný a musí mít aspoň 2 znaky." });
  }

  if (!ingredience || !Array.isArray(ingredience) || ingredience.length === 0) {
    return res.status(400).json({ error: "Recept musí obsahovat aspoň jednu ingredienci." });
  }

    try {
        const [resRecept] = await db.promise().query(
            'INSERT INTO REC (nazev, postup) VALUES (?, ?)', [nazev, postup]
        );
        const novyReceptId = resRecept.insertId;

        for (let položka of ingredience) {

            const normalizovanyNazev = položka.nazev.toLowerCase().trim();
            
            await db.promise().query(
                'INSERT IGNORE INTO ING (nazev) VALUES (?)', [normalizovanyNazev]
            );

            const [rows] = await db.promise().query(
                'SELECT id FROM ING WHERE nazev = ?', [normalizovanyNazev]
            );
            const ingId = rows[0].id;

            await db.promise().query(
                'INSERT INTO REC_ING (REC_id, ING_id, mnozstvi) VALUES (?, ?, ?)',
                [novyReceptId, ingId, položka.mnozstvi]
            );
            if (položka.nazev.trim().length < 2) {
                return res.status(400).json({ error: "Název ingredience musí mít aspoň 2 znaky." });
            }
            if (položka.mnozstvi.trim().length < 1) {
                return res.status(400).json({ error: "Množství ingredience je povinné." });
            }

        }

        res.json({ message: "Všechno se uložilo správně!" });

    } catch (err) {
        res.status(500).json({ chyba: err.message });
    }
});

// ==========================================================================
app.get("/hledani", (req, res) => {
    
    const { hledej } = req.body; 
    const vyhledavanyVyraz = `%${hledej}%`;
    const sql= 'SELECT REC.nazev, REC.postup FROM REC WHERE REC.nazev like ?';

    db.query(sql, [vyhledavanyVyraz], (err, results) => {
        if (err) {
            console.error('Chyba při dotazu do DB:', err);
            return res.status(500).send('Chyba serveru při čtení databáze');
        }
        if (results.length==0) {
            console.log('Nenašel jsem žádný recept');
            return res.status(200).send('Nenašel jsem žádný recept');
        }

        res.json(results);
    });

});

// ==========================================================================
app.post('/smazani', (req, res) => {

    const { receptId } = req.body;

    const receptIdCislo = Number(receptId);

    if (receptId === undefined || receptId === null || receptId === '' || Number.isNaN(receptIdCislo)) {
        return res.status(400).json({ error: "ID receptu je povinné, a musí být číslo." });
    }

    const sql1 = "delete from REC where id=?";
    const sql2 = "delete from REC_ING where REC_id=?";

    try {
        db.query (
            sql1, [receptIdCislo], (err, result)  => {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: 'Nepodařilo se smazat recept, nebo recept neexistuje.' });
            }
            else {

                db.query(
                    sql2, [receptIdCislo], (err, result)  => {
                    if (result.affectedRows == 0) {
                        return res.status(404).json({ message: 'Nepodařilo se smazat recept, nebo recept neexistuje.' });
                    }
                    else {
                        res.json({ message: "Všechno se smazalo správně!"});
                    }
                });

            } 
        })
    }
    catch (err) {
        res.status(500).json({ chyba: err.message });
    }
});

// ==========================================================================
app.post("/uprava/:id", async (req, res) => {
    const { id } = req.params;
    const { nazev, postup, ingredience } = req.body;

    const IdCislo = Number(id);

    if (id === undefined || id === null || id === '' || Number.isNaN(IdCislo)) {
        return res.status(400).json({ error: "ID receptu je povinné, a musí být číslo." });
    }

    if (!nazev || nazev.trim().length < 2) {
        return res.status(400).json({ error: "Název receptu je povinný a musí mít aspoň 2 znaky." });
    }

    if (!postup || postup.trim().length < 1) {
        return res.status(400).json({ error: "Postup receptu je povinný." });
    }

    try {
    const [result] = await db.promise().query(
      "UPDATE REC SET nazev = ?, postup = ? WHERE id = ?",
            [nazev, postup, IdCislo]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Recept nebyl nalezen, nebo neexistuje." });
    }

        if (Array.isArray(ingredience)) {
            await db.promise().query("DELETE FROM REC_ING WHERE REC_id = ?", [IdCislo]);

            for (const položka of ingredience) {
                if (!položka?.nazev || !položka?.mnozstvi) {
                    return res.status(400).json({ error: "Každá ingredience musí mít název a množství." });
                }

                const normalizovanyNazev = položka.nazev.toLowerCase().trim();

                await db.promise().query(
                    'INSERT IGNORE INTO ING (nazev) VALUES (?)',
                    [normalizovanyNazev]
                );

                const [rows] = await db.promise().query(
                    'SELECT id FROM ING WHERE nazev = ?',
                    [normalizovanyNazev]
                );

                const ingId = rows[0].id;

                await db.promise().query(
                    'INSERT INTO REC_ING (REC_id, ING_id, mnozstvi) VALUES (?, ?, ?)',
                    [IdCislo, ingId, položka.mnozstvi]
                );
            }
        }

    res.json({ message: "Recept byl úspěšně aktualizován" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});