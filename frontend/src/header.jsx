function Header({ currentUser, isAdmin, onLogout }) {
    return (
        <header className="siteHeader">
            <div className="container nav">
                <a className="logo" href="/">
                    JS<span>Betting</span>
                </a>

                <nav className="navLinks">
                    <a href="#offers">Oferty</a>
                    <a href="#free-tip">Free Tip</a>
                    <a href="#my-tips">Moje typy</a>
                    <a href="#account">Konto</a>
                    {isAdmin && <a href="#admin">Admin</a>}
                    <a href="#how-it-works">Jak to działa</a>
                    <a href="#why-us">Dlaczego my</a>
                </nav>

                {currentUser ? (
                    <button className="ghostButton" onClick={onLogout}>
                        Wyloguj
                    </button>
                ) : (
                    <a className="ghostButton" href="#account">
                        Logowanie
                    </a>
                )}
            </div>
        </header>
    )
}

export default Header