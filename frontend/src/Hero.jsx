function Hero({ currentUser }) {
    return (
        <section className="hero">
            <div className="container heroGrid">
                <div className="heroContent">
                    <p className="eyebrow">Premium betting intelligence</p>

                    <h1>Typy premium bez odkrywania kart przed zakupem.</h1>

                    <p className="heroText">
                        Widzisz zakres kursu i cenę. Pełny typ i dokładne spotkanie
                        odblokowują się dopiero po zakupie.
                    </p>

                    <div className="heroActions">
                        <a className="primaryButton" href="#offers">Zobacz oferty</a>
                        <a className="secondaryButton" href="#how-it-works">Jak to działa?</a>
                    </div>
                </div>

                <div className="heroPanel">
                    <p className="panelLabel">Status konta</p>

                    <div className="panelCard">
                        <span>Użytkownik</span>
                        <strong>{currentUser ? currentUser.firstName : 'Gość'}</strong>
                    </div>

                    <div className="panelCard">
                        <span>Rola</span>
                        <strong>{currentUser ? currentUser.role : 'Brak'}</strong>
                    </div>

                    <div className="panelCard">
                        <span>Dostęp</span>
                        <strong>{currentUser ? 'Aktywny token' : 'Zaloguj się'}</strong>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero