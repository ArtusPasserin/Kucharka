function App() {
    const prazdnyRecept = {
        id: null,
        nazev: '',
        postup: '',
        ingredience: [{ nazev: '', mnozstvi: '' }]
    };

    const normalizujRecept = (recept) => {
        if (!recept) {
            return { ...prazdnyRecept, ingredience: [{ nazev: '', mnozstvi: '' }] };
        }

        const ingredience = Array.isArray(recept.ingredience) && recept.ingredience.length > 0
            ? recept.ingredience.map((polozka) => ({
                nazev: polozka.nazev ?? '',
                mnozstvi: polozka.mnozstvi ?? ''
            }))
            : [{ nazev: '', mnozstvi: '' }];

        return {
            id: recept.id ?? null,
            nazev: recept.nazev ?? '',
            postup: recept.postup ?? '',
            ingredience
        };
    };

    const [stranka, setStranka] = React.useState('menu');
    const [rezimReceptu, setRezimReceptu] = React.useState('view');
    const [recept, setRecept] = React.useState(normalizujRecept(null));
    const [loadingRecept, setLoadingRecept] = React.useState(false);

    const naObrazovku = (cil) => {
        if (cil === 'menu') {
            setStranka('menu');
            setRezimReceptu('view');
            setRecept(normalizujRecept(null));
            return;
        }

        if (cil === 'hledani') {
            setStranka('hledani');
            return;
        }

        if (cil === 'vytvoreni') {
            setRecept(normalizujRecept(null));
            setRezimReceptu('create');
            setStranka('recept');
        }
    };

    const nactiReceptPodleId = async (receptId) => {
        setLoadingRecept(true);

        try {
            const response = await fetch(`/recepty/${receptId}`);

            if (!response.ok) {
                throw new Error('Recept se nepodařilo načíst.');
            }

            const data = await response.json();

            setRecept({
                id: receptId,
                nazev: data.recept?.nazev ?? '',
                postup: data.recept?.postup ?? '',
                ingredience: Array.isArray(data.ingredience) && data.ingredience.length > 0
                    ? data.ingredience.map((polozka) => ({
                        nazev: polozka.nazev ?? '',
                        mnozstvi: polozka.mnozstvi ?? ''
                    }))
                    : [{ nazev: '', mnozstvi: '' }]
            });
            setRezimReceptu('view');
            setStranka('recept');
        } catch (error) {
            console.error(error);
            alert('Recept se nepodařilo načíst.');
        } finally {
            setLoadingRecept(false);
        }
    };

    const ulozRecept = async (formData) => {
        const ingredience = (formData.ingredience || [])
            .map((polozka) => ({
                nazev: (polozka.nazev ?? '').trim(),
                mnozstvi: (polozka.mnozstvi ?? '').trim()
            }))
            .filter((polozka) => polozka.nazev !== '' || polozka.mnozstvi !== '');

        if (!formData.nazev.trim()) {
            alert('Název receptu je povinný.');
            return false;
        }

        if (!formData.postup.trim()) {
            alert('Postup receptu je povinný.');
            return false;
        }

        if (ingredience.length === 0) {
            alert('Recept musí obsahovat alespoň jednu ingredienci.');
            return false;
        }

        const payload = {
            nazev: formData.nazev.trim(),
            postup: formData.postup.trim(),
            ingredience
        };

        try {
            const jeVytvareni = rezimReceptu === 'create' || !recept.id;
            const response = await fetch(jeVytvareni ? '/vytvoreni' : `/uprava/${recept.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const chyba = await response.json().catch(() => null);
                throw new Error(chyba?.error || chyba?.chyba || 'Uložení se nepodařilo.');
            }

            const vysledek = await response.json();
            const noveId = vysledek.id ?? recept.id ?? null;
            setRecept({
                id: noveId,
                nazev: payload.nazev,
                postup: payload.postup,
                ingredience: payload.ingredience
            });
            setRezimReceptu('view');
            setStranka('recept');
            return true;
        } catch (error) {
            console.error(error);
            alert(error.message || 'Uložení se nepodařilo.');
            return false;
        }
    };

    const smazRecept = async () => {
        if (!recept.id) {
            return;
        }

        const potvrzeni = window.confirm('Opravdu chceš tento recept smazat?');
        if (!potvrzeni) {
            return;
        }

        try {
            const response = await fetch('/smazani', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receptId: recept.id })
            });

            if (!response.ok) {
                const chyba = await response.json().catch(() => null);
                throw new Error(chyba?.message || chyba?.error || 'Mazání se nepodařilo.');
            }

            setRecept(normalizujRecept(null));
            setRezimReceptu('view');
            setStranka('hledani');
        } catch (error) {
            console.error(error);
            alert(error.message || 'Mazání se nepodařilo.');
        }
    };

    if (loadingRecept) {
        return (
            <div className="app-shell">
                <AppNavbar naObrazovku={naObrazovku} />
                <div className="loading-wrap">
                    <div className="loading-box">Načítám recept...</div>
                </div>
            </div>
        );
    }

    if (stranka === 'hledani') {
        return <ObrazovkaHledani naObrazovku={naObrazovku} naVyberReceptu={nactiReceptPodleId} />;
    }

    if (stranka === 'recept') {
        return (
            <ObrazovkaVytvoreni
                naObrazovku={naObrazovku}
                recept={recept}
                rezim={rezimReceptu}
                onSave={ulozRecept}
                onDelete={smazRecept}
            />
        );
    }

    return <ObrazovkaHlavni naObrazovku={naObrazovku} />;
}

// Spuštění Reactu do HTML divu s id="root"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);