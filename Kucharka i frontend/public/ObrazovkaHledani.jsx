function ObrazovkaHledani(props) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [recipes, setRecipes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searched, setSearched] = React.useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const response = await fetch(`/hledani?hledej=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                setRecipes([]);
                return;
            }

            const data = await response.json();
            setRecipes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Chyba při hledání:', error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRecipeClick = (recipe) => {
        if (props.naVyberReceptu) {
            props.naVyberReceptu(recipe.id);
        }
    };

    return (
        <div className="app-shell">
            <AppNavbar naObrazovku={props.naObrazovku} />
            <div className="page-content">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Zadej název receptu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        Hledat
                    </button>
                </form>

                {loading && (
                    <div className="recipes-panel">
                        <p className="recipes-title">Hledání...</p>
                    </div>
                )}

                {searched && !loading && recipes.length > 0 && (
                    <div className="recipes-panel">
                        {recipes.map((recipe) => (
                            <button
                                type="button"
                                key={recipe.id}
                                className="recipe-button"
                                onClick={() => handleRecipeClick(recipe)}
                            >
                                {recipe.nazev}
                            </button>
                        ))}
                    </div>
                )}

                {searched && !loading && recipes.length === 0 && (
                    <div className="recipes-panel">
                        <p className="recipes-title">Žádné recepty nenalezeny</p>
                    </div>
                )}
            </div>
        </div>
    );
}