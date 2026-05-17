function ObrazovkaVytvoreni(props) {
    const [jeRezimCteni, setJeRezimCteni] = React.useState(props.rezim === 'create' ? false : true);
    const jeVytvareni = props.rezim === 'create';

    const pripravFormular = (recept) => {
        if (!recept) {
            return {
                id: null,
                nazev: '',
                postup: '',
                ingredience: [{ nazev: '', mnozstvi: '' }]
            };
        }

        return {
            id: recept.id ?? null,
            nazev: recept.nazev ?? '',
            postup: recept.postup ?? '',
            ingredience: Array.isArray(recept.ingredience) && recept.ingredience.length > 0
                ? recept.ingredience.map((polozka) => ({
                    nazev: polozka.nazev ?? '',
                    mnozstvi: polozka.mnozstvi ?? ''
                }))
                : [{ nazev: '', mnozstvi: '' }]
        };
    };

    const [formData, setFormData] = React.useState(() => pripravFormular(props.recept));

    React.useEffect(() => {
        setFormData(pripravFormular(props.recept));
        setJeRezimCteni(props.rezim === 'create' ? false : true);
    }, [props.recept?.id, props.rezim]);

    const nastavHodnotu = (pole, hodnota) => {
        setFormData((predchozi) => ({
            ...predchozi,
            [pole]: hodnota
        }));
    };

    const nastavIngredienci = (index, pole, hodnota) => {
        setFormData((predchozi) => {
            const ingredience = predchozi.ingredience.map((polozka, currentIndex) => (
                currentIndex === index ? { ...polozka, [pole]: hodnota } : polozka
            ));

            return {
                ...predchozi,
                ingredience
            };
        });
    };

    const pridejIngredienci = () => {
        setFormData((predchozi) => ({
            ...predchozi,
            ingredience: [...predchozi.ingredience, { nazev: '', mnozstvi: '' }]
        }));
    };

    const odeberIngredienci = (index) => {
        setFormData((predchozi) => {
            const ingredience = predchozi.ingredience.filter((_, currentIndex) => currentIndex !== index);

            return {
                ...predchozi,
                ingredience: ingredience.length > 0 ? ingredience : [{ nazev: '', mnozstvi: '' }]
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!props.onSave) {
            return;
        }
        const vysledek = await Promise.resolve(props.onSave(formData));

        if (vysledek !== false) {
            setJeRezimCteni(true);
        }
    };

    const handleEdit = () => {
        setJeRezimCteni(false);
    };

    const renderNazev = () => (
        <input
            className="recipe-title-input"
            type="text"
            value={formData.nazev}
            onChange={(event) => nastavHodnotu('nazev', event.target.value)}
            placeholder="Název receptu"
            readOnly={jeRezimCteni}
        />
    );

    return (
        <div className="app-shell">
            <AppNavbar naObrazovku={props.naObrazovku} />
            <form className="page-content recipe-form" onSubmit={handleSubmit}>
                <div className="recipe-title-card recipe-title-card--relative">
                    <div className="recipe-header-title">
                        {renderNazev()}
                    </div>

                    {formData.id && props.onDelete && (
                        <Dropdown align="end" className="recipe-dropdown">
                            <Dropdown.Toggle
                                as="button"
                                    type="button"
                                    variant="dark"
                                size="sm"
                                className="recipe-dropdown-toggle"
                                id="recipe-actions-dropdown"
                            >
                                ⋮
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="recipe-dropdown-menu">
                                <Dropdown.Item as="button" type="button" className="recipe-dropdown-delete-item" onClick={props.onDelete}>
                                    Smazat recept
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>

                <div className="section-card">
                    <div className="section-title">Postup</div>
                    <textarea
                        className="recipe-textarea"
                        value={formData.postup}
                        onChange={(event) => nastavHodnotu('postup', event.target.value)}
                        readOnly={jeRezimCteni}
                        placeholder="Popiš postup receptu"
                        rows="8"
                    />
                </div>

                <div className="section-card">
                    <div className="section-title-row">
                        <span className="section-title">Ingredience</span>
                        <span className="section-hint">Množství vlevo, ingredience vpravo</span>
                    </div>

                    <div className="ingredient-table-head">
                        <div>Množství</div>
                        <div>Ingredience</div>
                    </div>

                    <div className="ingredient-list">
                        {formData.ingredience.map((polozka, index) => (
                            <div className="ingredient-row" key={index}>
                                <input
                                    className="ingredient-input ingredient-amount"
                                    type="text"
                                    value={polozka.mnozstvi}
                                    onChange={(event) => nastavIngredienci(index, 'mnozstvi', event.target.value)}
                                    readOnly={jeRezimCteni}
                                    placeholder="např. 200 g"
                                />

                                <input
                                    className="ingredient-input ingredient-name"
                                    type="text"
                                    value={polozka.nazev}
                                    onChange={(event) => nastavIngredienci(index, 'nazev', event.target.value)}
                                    readOnly={jeRezimCteni}
                                    placeholder="např. mouka"
                                />

                                {!jeRezimCteni && (
                                    <button
                                        type="button"
                                        className="ingredient-remove-button"
                                        onClick={() => odeberIngredienci(index)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {!jeRezimCteni && (
                        <button
                            type="button"
                            className="add-ingredient-button"
                            onClick={pridejIngredienci}
                        >
                            Přidat ingredienci
                        </button>
                    )}
                </div>

                <div className="edit-row">
                    {jeRezimCteni ? (
                        // Režim čtení - tlačítko Upravit
                        <button
                            type="button"
                            className="edit-button edit-button--edit"
                            onClick={handleEdit}
                        >
                            Upravit recept
                        </button>
                    ) : (
                        // Režim úprav - tlačítka Uložit a Zrušit
                        <div className="edit-buttons-group">
                            <button 
                                type="submit" 
                                className="edit-button edit-button--save"
                            >
                                {jeVytvareni ? 'Uložit recept' : 'Uložit změny'}
                            </button>
                            <button 
                                type="button"
                                className="edit-button edit-button--cancel"
                                onClick={() => setJeRezimCteni(true)}
                            >
                                Zrušit
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

const Dropdown = ReactBootstrap.Dropdown;
