function ObrazovkaHlavni(props) {
    return (
    <div className="app-shell">
      <AppNavbar naObrazovku={props.naObrazovku} />
      <div className="menu-center">
        <ButtonGroup vertical size="lg" className="menu-group">
          <Button
            className="menu-button"
            onClick={() => props.naObrazovku('vytvoreni')}
          >
            Vytvořit recept
          </Button>
          <Button
            className="menu-button"
            onClick={() => props.naObrazovku('hledani')}
          >
            Vyhledat recept
          </Button>
        </ButtonGroup>
      </div>
    </div>
    );
}

const Button = ReactBootstrap.Button;
const ButtonGroup = ReactBootstrap.ButtonGroup;