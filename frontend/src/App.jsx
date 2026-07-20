import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [currentUser, setCurrentUser] = useState(null)
    const [authMessage, setAuthMessage] = useState('')
    const [purchaseMessage, setPurchaseMessage] = useState('')
    const [myTips, setMyTips] = useState([])
    const [myTipsLoading, setMyTipsLoading] = useState(false)
    const [myTipsMessage, setMyTipsMessage] = useState('')

    const [freeTipStatus, setFreeTipStatus] = useState(null)
    const [freeTipLoading, setFreeTipLoading] = useState(false)
    const [freeTipMessage, setFreeTipMessage] = useState('')

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    })

    const [registerForm, setRegisterForm] = useState({
        email: '',
        firstName: '',
        password: '',
    })

    useEffect(() => {
        fetch('http://localhost:8080/offers/premium')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load offers')
                }

                return response.json()
            })
            .then((data) => {
                setOffers(data)
                setLoading(false)
            })
            .catch(() => {
                setError('Nie udało się pobrać ofert premium.')
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }

        fetch('http://localhost:8080/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    localStorage.removeItem('token')
                    throw new Error('Invalid token')
                }

                return response.json()
            })
            .then((data) => {
                setCurrentUser(data)
                loadMyTips()
                loadFreeTipStatus()
            })
            .catch(() => {
                setCurrentUser(null)
            })
    }, [])

    function handleLogin(event) {
        event.preventDefault()
        setAuthMessage('')

        fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginForm),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Login failed')
                }

                return response.json()
            })
            .then((data) => {
                localStorage.setItem('token', data.token)
                setCurrentUser(data)
                loadMyTips()
                loadFreeTipStatus()
                setAuthMessage('Logowanie udane.')
                setLoginForm({
                    email: '',
                    password: '',
                })
            })
            .catch(() => {
                setAuthMessage('Nie udało się zalogować.')
            })
    }

    function handleRegister(event) {
        event.preventDefault()
        setAuthMessage('')

        fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerForm),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Register failed')
                }

                return response.json()
            })
            .then((data) => {
                localStorage.setItem('token', data.token)
                setCurrentUser(data)
                loadMyTips()
                loadFreeTipStatus()
                setAuthMessage('Rejestracja udana.')
                setRegisterForm({
                    email: '',
                    firstName: '',
                    password: '',
                })
            })
            .catch(() => {
                setAuthMessage('Nie udało się zarejestrować.')
            })
    }

    function handleLogout() {
        localStorage.removeItem('token')
        setCurrentUser(null)
        setMyTips([])
        setMyTipsMessage('')
        setFreeTipStatus(null)
        setFreeTipMessage('')
        setAuthMessage('Wylogowano.')
    }

    function formatDate(value) {
        if (!value) {
            return 'Brak daty'
        }

        return new Date(value).toLocaleString('pl-PL', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    }

    function loadMyTips() {
        const token = localStorage.getItem('token')

        if (!token) {
            setMyTips([])
            return
        }

        setMyTipsLoading(true)
        setMyTipsMessage('')

        fetch('http://localhost:8080/users/me/my-tips/active', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load my tips')
                }

                return response.json()
            })
            .then((data) => {
                setMyTips(data)
                setMyTipsLoading(false)
            })
            .catch(() => {
                setMyTips([])
                setMyTipsMessage('Nie udało się pobrać moich typów.')
                setMyTipsLoading(false)
            })
    }

    function loadFreeTipStatus() {
        const token = localStorage.getItem('token')

        if (!token) {
            setFreeTipStatus(null)
            return
        }

        setFreeTipLoading(true)
        setFreeTipMessage('')

        fetch('http://localhost:8080/users/me/free-tip/status', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load free tip status')
                }

                return response.json()
            })
            .then((data) => {
                setFreeTipStatus(data)
                setFreeTipLoading(false)
            })
            .catch(() => {
                setFreeTipStatus(null)
                setFreeTipMessage('Nie udało się pobrać statusu darmowego typu.')
                setFreeTipLoading(false)
            })
    }

    function claimFreeTip() {
        const token = localStorage.getItem('token')

        if (!token || !currentUser) {
            setFreeTipMessage('Zaloguj się, żeby odebrać darmowy typ.')
            return
        }

        setFreeTipLoading(true)
        setFreeTipMessage('')

        fetch('http://localhost:8080/users/me/free-tip/claim', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to claim free tip')
                }

                return response.json()
            })
            .then(() => {
                setFreeTipMessage('Darmowy typ odebrany.')
                setFreeTipLoading(false)
                loadFreeTipStatus()
                loadMyTips()
            })
            .catch(() => {
                setFreeTipMessage('Nie udało się odebrać darmowego typu.')
                setFreeTipLoading(false)
                loadFreeTipStatus()
            })
    }





    function handlePurchase(tipId) {
        setPurchaseMessage('')

        const token = localStorage.getItem('token')

        if (!token || !currentUser) {
            setPurchaseMessage('Zaloguj się, żeby kupić typ.')
            return
        }

        fetch(`http://localhost:8080/purchases?tipId=${tipId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Purchase failed')
                }

                return response.json()
            })
            .then((data) => {
                setPurchaseMessage(`Zakup udany. ID zakupu: ${data.purchaseId}`)
                loadMyTips()
            })
            .catch(() => {
                setPurchaseMessage('Nie udało się kupić typu. Możliwe, że już go kupiłeś.')
            })
    }



    return (
        <div className="app">
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
                        <a href="#how-it-works">Jak to działa</a>
                        <a href="#why-us">Dlaczego my</a>
                    </nav>

                    {currentUser ? (
                        <button className="ghostButton" onClick={handleLogout}>
                            Wyloguj
                        </button>
                    ) : (
                        <a className="ghostButton" href="#account">
                            Logowanie
                        </a>
                    )}
                </div>
            </header>

            <main>
                <section className="hero">
                    <div className="container heroGrid">
                        <div className="heroContent">
                            <p className="eyebrow">Premium betting intelligence</p>

                            <h1>Typy premium bez odkrywania kart przed zakupem.</h1>

                            <p className="heroText">
                                Widzisz zakres kursu i cenę. Pełny typ, analiza i dokładne spotkanie
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

                <section className="section" id="offers">
                    <div className="container">
                        <div className="sectionHeader">
                            <p className="eyebrow">Dostępne teraz</p>
                            <h2>Oferty premium</h2>
                            <p>
                                Przed zakupem nie pokazujemy meczu, picka ani analizy.
                                Dzięki temu treść premium pozostaje zabezpieczona.
                            </p>
                        </div>

                        {loading && <p className="infoText">Ładowanie ofert...</p>}

                        {error && <p className="errorText">{error}</p>}

                        {!loading && !error && offers.length === 0 && (
                            <p className="infoText">Brak dostępnych ofert premium.</p>
                        )}

                        <div className="offersGrid">
                            {!loading && !error && offers.map((offer) => (
                                <article className="offerCard" key={offer.id}>
                                    <div className="offerTop">
                                        <p className="cardLabel">Oferta #{offer.id}</p>
                                        <span className="statusBadge">Premium</span>
                                    </div>

                                    <div>
                                        <p className="cardLabel">Zakres kursu</p>
                                        <h3>{offer.oddsRange}</h3>
                                    </div>

                                    <div>
                                        <p className="cardLabel">Cena</p>
                                        <p className="price">{offer.price} PLN</p>
                                    </div>

                                    <button
  className="primaryButton fullWidth"
  onClick={() => handlePurchase(offer.id)}
>
  Kup typ
</button>
                                </article>
                            ))}
                        </div>
                    </div>

                    {purchaseMessage && <p className="infoText">{purchaseMessage}</p>}
                    
                </section>

                <section className="section" id="free-tip">
                    <div className="container">
                        <div className="freeTipBox">
                            <div>
                                <p className="eyebrow">Free Tip</p>
                                <h2>Darmowy typ co 5 dni</h2>
                                <p>
                                    Zalogowany użytkownik może odebrać jeden darmowy typ raz na 5 dni.
                                    Darmowy typ trafia potem do sekcji „Moje typy”.
                                </p>
                            </div>

                            <div className="freeTipPanel">
                                {!currentUser && (
                                    <p className="infoText">Zaloguj się, żeby odebrać darmowy typ.</p>
                                )}

                                {currentUser && freeTipLoading && (
                                    <p className="infoText">Sprawdzanie statusu...</p>
                                )}

                                {currentUser && freeTipStatus && (
                                    <>
                                        <div className="panelCard">
                                            <span>Status</span>
                                            <strong>
                                                {freeTipStatus.canClaim ? 'Dostępny' : 'Niedostępny'}
                                            </strong>
                                        </div>

                                        {!freeTipStatus.canClaim && (
                                            <div className="panelCard">
                                                <span>Następny darmowy typ</span>
                                                <strong>{formatDate(freeTipStatus.nextAvailableAt)}</strong>
                                            </div>
                                        )}

                                        {freeTipStatus.message && (
                                            <p className="infoText">{freeTipStatus.message}</p>
                                        )}

                                        <button
                                            className="primaryButton fullWidth"
                                            onClick={claimFreeTip}
                                            disabled={!freeTipStatus.canClaim || freeTipLoading}
                                        >
                                            Odbierz darmowy typ
                                        </button>
                                    </>
                                )}

                                {freeTipMessage && <p className="infoText">{freeTipMessage}</p>}
                            </div>
                        </div>
                    </div>
                </section>


                <section className="section mutedSection" id="my-tips">
                    <div className="container">
                        <div className="sectionHeader">
                            <p className="eyebrow">Strefa użytkownika</p>
                            <h2>Moje typy</h2>
                            <p>
                                Tutaj zobaczysz typy kupione na swoim koncie. Analizy nie są wyświetlane.
                            </p>
                        </div>

                        {!currentUser && (
                            <p className="infoText">Zaloguj się, żeby zobaczyć swoje typy.</p>
                        )}

                        {currentUser && (
                            <>
                                <button className="secondaryButton refreshButton" onClick={loadMyTips}>
                                    Odśwież moje typy
                                </button>

                                {myTipsLoading && <p className="infoText">Ładowanie moich typów...</p>}

                                {myTipsMessage && <p className="errorText">{myTipsMessage}</p>}

                                {!myTipsLoading && myTips.length === 0 && (
                                    <p className="infoText">Nie masz jeszcze aktywnych typów.</p>
                                )}

                                <div className="myTipsGrid">
                                    {myTips.map((tip) => (
                                        <article className="myTipCard" key={tip.purchaseId}>
                                            <div className="offerTop">
                                                <p className="cardLabel">Zakup #{tip.purchaseId}</p>
                                                <span className="statusBadge">{tip.status}</span>
                                            </div>

                                            <div>
                                                <p className="cardLabel">Liga</p>
                                                <h3>{tip.league}</h3>
                                            </div>

                                            <div>
                                                <p className="cardLabel">Mecz</p>
                                                <p className="matchName">
                                                    {tip.homeTeam} vs {tip.awayTeam}
                                                </p>
                                            </div>

                                            <div className="tipDetailsGrid">
                                                <div>
                                                    <p className="cardLabel">Pick</p>
                                                    <p className="tipValue">{tip.pick}</p>
                                                </div>

                                                <div>
                                                    <p className="cardLabel">Kurs</p>
                                                    <p className="tipValue">{tip.odds}</p>
                                                </div>


                                                <div>
                                                    <p className="cardLabel">Cena</p>
                                                    <p className="tipValue">{tip.pricePaid} PLN</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="cardLabel">Data meczu</p>
                                                <p className="tipValue">{formatDate(tip.matchDate)}</p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>

                <section className="section mutedSection" id="account">
                    <div className="container">
                        <div className="sectionHeader">
                            <p className="eyebrow">Konto</p>
                            <h2>Logowanie i rejestracja</h2>
                            <p>
                                Zaloguj się, żeby kupować typy i później widzieć je w sekcji „Moje typy”.
                            </p>
                        </div>

                        {currentUser && (
                            <div className="accountBox">
                                <h3>Jesteś zalogowany</h3>
                                <p>Email: {currentUser.email}</p>
                                <p>Imię: {currentUser.firstName}</p>
                                <p>Rola: {currentUser.role}</p>
                                <button className="secondaryButton" onClick={handleLogout}>
                                    Wyloguj
                                </button>
                            </div>
                        )}

                        {!currentUser && (
                            <div className="authGrid">
                                <form className="authCard" onSubmit={handleLogin}>
                                    <h3>Logowanie</h3>

                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            value={loginForm.email}
                                            onChange={(event) =>
                                                setLoginForm({
                                                    ...loginForm,
                                                    email: event.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>

                                    <label>
                                        Hasło
                                        <input
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(event) =>
                                                setLoginForm({
                                                    ...loginForm,
                                                    password: event.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>

                                    <button className="primaryButton fullWidth" type="submit">
                                        Zaloguj
                                    </button>
                                </form>

                                <form className="authCard" onSubmit={handleRegister}>
                                    <h3>Rejestracja</h3>

                                    <label>
                                        Imię
                                        <input
                                            type="text"
                                            value={registerForm.firstName}
                                            onChange={(event) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    firstName: event.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>

                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            value={registerForm.email}
                                            onChange={(event) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    email: event.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>

                                    <label>
                                        Hasło
                                        <input
                                            type="password"
                                            value={registerForm.password}
                                            onChange={(event) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    password: event.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>

                                    <button className="primaryButton fullWidth" type="submit">
                                        Zarejestruj
                                    </button>
                                </form>
                            </div>
                        )}

                        {authMessage && <p className="infoText">{authMessage}</p>}
                    </div>
                </section>

                <section className="section mutedSection" id="how-it-works">
                    <div className="container">
                        <div className="sectionHeader">
                            <p className="eyebrow">Proces</p>
                            <h2>Jak to działa?</h2>
                        </div>

                        <div className="stepsGrid">
                            <div className="stepCard">
                                <span>01</span>
                                <h3>Wybierasz ofertę</h3>
                                <p>Przed zakupem widzisz tylko zakres kursu i cenę.</p>
                            </div>

                            <div className="stepCard">
                                <span>02</span>
                                <h3>Kupujesz dostęp</h3>
                                <p>Po zakupie typ zostaje przypisany do Twojego konta.</p>
                            </div>

                            <div className="stepCard">
                                <span>03</span>
                                <h3>Odbierasz analizę</h3>
                                <p>W sekcji „Moje typy” widzisz pełne szczegóły i status.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section" id="why-us">
                    <div className="container">
                        <div className="trustBox">
                            <div>
                                <p className="eyebrow">JS Betting</p>
                                <h2>Budowane jako realny produkt, nie tylko projekt do portfolio.</h2>
                            </div>

                            <div className="trustList">
                                <p>JWT i zabezpieczone konto użytkownika</p>
                                <p>Ukryte szczegóły typów przed zakupem</p>
                                <p>Darmowy typ tylko raz na 5 dni</p>
                                <p>Panel admina dla zarządzania typami</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container footerContent">
                    <p>© 2026 JS Betting</p>
                    <p>Premium betting tips platform</p>
                </div>
            </footer>
        </div>
    )
}

export default App

