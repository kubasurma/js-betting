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

    const [adminTips, setAdminTips] = useState([])
    const [adminTipsLoading, setAdminTipsLoading] = useState(false)
    const [adminTipsMessage, setAdminTipsMessage] = useState('')

    const [adminTipForm, setAdminTipForm] = useState({
        league: '',
        homeTeam: '',
        awayTeam: '',
        pick: '',
        odds: '',
        matchDate: '',
        price: '',
    })

    const [adminCreateMessage, setAdminCreateMessage] = useState('')

    const isAdmin = currentUser?.role === 'ADMIN'

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
        loadOffers()
    }, [])

    function loadOffers() {
        setLoading(true)
        setError('')

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
    }

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

                if (data.role === 'ADMIN') {
                    setTimeout(loadAdminTips, 0)
                }
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

                if (data.role === 'ADMIN') {
                    setTimeout(loadAdminTips, 0)
                }

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
        setAdminTips([])
        setAdminTipsMessage('')
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

    async function readErrorMessage(response, fallbackMessage) {
        const contentType = response.headers.get('content-type') || ''

        if (contentType.includes('application/json')) {
            try {
                const body = await response.json()

                return body.detail || body.message || fallbackMessage
            } catch {
                return fallbackMessage
            }
        }

        const text = await response.text()

        return text || fallbackMessage
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

    async function loadAdminTips() {
        const token = localStorage.getItem('token')

        if (!token) {
            setAdminTips([])
            return
        }

        setAdminTipsLoading(true)
        setAdminTipsMessage('')

        try {
            const response = await fetch('http://localhost:8080/admin/tips', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się pobrać typów admina.'
                )

                throw new Error(message)
            }

            const data = await response.json()

            setAdminTips(data)
        } catch (error) {
            setAdminTips([])
            setAdminTipsMessage(error.message)
        } finally {
            setAdminTipsLoading(false)
        }
    }

    function handleAdminTipFormChange(event) {
        const { name, value } = event.target

        setAdminTipForm({
            ...adminTipForm,
            [name]: value,
        })
    }

    async function handleCreatePremiumTip(event) {
        event.preventDefault()
        setAdminCreateMessage('')

        const token = localStorage.getItem('token')

        if (!token || !isAdmin) {
            setAdminCreateMessage('Tylko admin może dodać typ.')
            return
        }

        const payload = {
            league: adminTipForm.league,
            homeTeam: adminTipForm.homeTeam,
            awayTeam: adminTipForm.awayTeam,
            pick: adminTipForm.pick,
            odds: Number(adminTipForm.odds),
            stake: 1,
            matchDate: adminTipForm.matchDate,
            analysis: 'Brak analizy',
            status: 'PENDING',
            premium: true,
            price: Number(adminTipForm.price),
        }

        try {
            const response = await fetch('http://localhost:8080/admin/tips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się dodać typu.'
                )

                throw new Error(message)
            }

            setAdminCreateMessage('Typ premium został dodany.')

            setAdminTipForm({
                league: '',
                homeTeam: '',
                awayTeam: '',
                pick: '',
                odds: '',
                matchDate: '',
                price: '',
            })

            loadAdminTips()
            loadOffers()
        } catch (error) {
            setAdminCreateMessage(error.message)
        }
    }

    async function handleUpdateTipStatus(tipId, status) {
        const token = localStorage.getItem('token')

        if (!token || !isAdmin) {
            setAdminTipsMessage('Tylko admin może zmieniać status typu.')
            return
        }

        try {
            const response = await fetch(
                `http://localhost:8080/admin/tips/${tipId}/status?status=${status}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się zmienić statusu typu.'
                )

                throw new Error(message)
            }

            setAdminTipsMessage(`Status typu #${tipId} został zmieniony na ${status}.`)
            loadAdminTips()
            loadOffers()
        } catch (error) {
            setAdminTipsMessage(error.message)
        }
    }

    async function handleDeleteTip(tipId) {
        setAdminTipsMessage(`Próbuję usunąć typ #${tipId}...`)

        const token = localStorage.getItem('token')

        if (!token || !isAdmin) {
            setAdminTipsMessage('Tylko admin może usuwać typy.')
            return
        }

        try {
            const response = await fetch(`http://localhost:8080/admin/tips/${tipId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się usunąć typu.'
                )

                throw new Error(message)
            }

            setAdminTipsMessage(`Typ #${tipId} został usunięty.`)

            loadAdminTips()
            loadOffers()
        } catch (error) {
            setAdminTipsMessage(error.message)
        }
    }

    async function handlePurchase(tipId) {
        setPurchaseMessage('')

        const token = localStorage.getItem('token')

        if (!token || !currentUser) {
            setPurchaseMessage('Zaloguj się, żeby kupić typ.')
            return
        }

        try {
            const response = await fetch(`http://localhost:8080/purchases?tipId=${tipId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się kupić typu. Możliwe, że ten typ został już kupiony.'
                )

                throw new Error(message)
            }

            const data = await response.json()

            setPurchaseMessage(`Zakup udany. ID zakupu: ${data.purchaseId}`)
            loadMyTips()
        } catch (error) {
            setPurchaseMessage(error.message)
        }
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
                        {isAdmin && <a href="#admin">Admin</a>}
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

                {isAdmin && (
                    <section className="section" id="admin">
                        <div className="container">
                            <div className="adminBox">
                                <div>
                                    <p className="eyebrow">Admin</p>
                                    <h2>Panel administratora</h2>
                                    <p>
                                        Ta sekcja jest widoczna tylko dla użytkownika z rolą ADMIN.
                                        Tutaj będziemy zarządzać typami.
                                    </p>
                                </div>

                                <div className="adminStatusCard">
                                    <p className="cardLabel">Zalogowany admin</p>
                                    <h3>{currentUser.email}</h3>
                                    <p>Rola: {currentUser.role}</p>

                                    <button className="secondaryButton" onClick={loadAdminTips}>
                                        Odśwież typy
                                    </button>
                                </div>
                            </div>

                            <div className="adminCreatePanel">
                                <div className="sectionHeader">
                                    <p className="eyebrow">Create tip</p>
                                    <h2>Dodaj typ premium</h2>
                                    <p>
                                        Ten formularz tworzy pełny typ w backendzie. Publicznie użytkownik
                                        nadal zobaczy tylko zakres kursu i cenę.
                                    </p>
                                </div>

                                <form className="adminForm" onSubmit={handleCreatePremiumTip}>
                                    <label>
                                        Liga
                                        <input
                                            name="league"
                                            type="text"
                                            value={adminTipForm.league}
                                            onChange={handleAdminTipFormChange}
                                            required
                                        />
                                    </label>

                                    <label>
                                        Gospodarz
                                        <input
                                            name="homeTeam"
                                            type="text"
                                            value={adminTipForm.homeTeam}
                                            onChange={handleAdminTipFormChange}
                                            required
                                        />
                                    </label>

                                    <label>
                                        Gość
                                        <input
                                            name="awayTeam"
                                            type="text"
                                            value={adminTipForm.awayTeam}
                                            onChange={handleAdminTipFormChange}
                                            required
                                        />
                                    </label>

                                    <label>
                                        Pick
                                        <input
                                            name="pick"
                                            type="text"
                                            value={adminTipForm.pick}
                                            onChange={handleAdminTipFormChange}
                                            required
                                        />
                                    </label>

                                    <label>
                                        Kurs
                                        <input
                                            name="odds"
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            value={adminTipForm.odds}
                                            onChange={handleAdminTipFormChange}
                                            required
                                        />
                                    </label>

                                    <label>
                                        Cena PLN
                                        <input
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={adminTipForm.price}
                                            onChange={handleAdminTipFormChange}
                                            required
                                        />
                                    </label>

                                    <label className="wideField">
                                        Data meczu
                                        <input
                                            name="matchDate"
                                            type="datetime-local"
                                            value={adminTipForm.matchDate}
                                            onChange={handleAdminTipFormChange}
                                            required
                                        />
                                    </label>

                                    <button className="primaryButton fullWidth wideField" type="submit">
                                        Dodaj typ premium
                                    </button>
                                </form>

                                {adminCreateMessage && (
                                    <p className="infoText">{adminCreateMessage}</p>
                                )}
                            </div>

                            <div className="adminTipsPanel">
                                <div className="sectionHeader">
                                    <p className="eyebrow">Admin data</p>
                                    <h2>Wszystkie typy</h2>
                                    <p>
                                        Lista pochodzi z zabezpieczonego endpointu admina.
                                        Zwykły USER nie powinien mieć do niej dostępu.
                                    </p>
                                </div>

                                {adminTipsLoading && (
                                    <p className="infoText">Ładowanie typów admina...</p>
                                )}

                                {adminTipsMessage && (
                                    <p className="errorText">{adminTipsMessage}</p>
                                )}

                                {!adminTipsLoading && adminTips.length === 0 && (
                                    <p className="infoText">Brak typów do wyświetlenia.</p>
                                )}

                                <div className="adminTipsGrid">
                                    {adminTips.map((tip) => (
                                        <article className="adminTipCard" key={tip.id}>
                                            <div className="offerTop">
                                                <p className="cardLabel">Typ #{tip.id}</p>
                                                <span className="statusBadge">{tip.status}</span>
                                            </div>

                                            <div>
                                                <p className="cardLabel">Mecz</p>
                                                <h3>{tip.homeTeam} vs {tip.awayTeam}</h3>
                                            </div>

                                            <div className="tipDetailsGrid">
                                                <div>
                                                    <p className="cardLabel">Liga</p>
                                                    <p className="tipValue">{tip.league}</p>
                                                </div>

                                                <div>
                                                    <p className="cardLabel">Pick</p>
                                                    <p className="tipValue">{tip.pick}</p>
                                                </div>

                                                <div>
                                                    <p className="cardLabel">Kurs</p>
                                                    <p className="tipValue">{tip.odds}</p>
                                                </div>

                                                <div>
                                                    <p className="cardLabel">Premium</p>
                                                    <p className="tipValue">{tip.premium ? 'Tak' : 'Nie'}</p>
                                                </div>

                                                <div>
                                                    <p className="cardLabel">Cena</p>
                                                    <p className="tipValue">{tip.price} PLN</p>
                                                </div>

                                                <div>
                                                    <p className="cardLabel">Data meczu</p>
                                                    <p className="tipValue">{formatDate(tip.matchDate)}</p>
                                                </div>
                                            </div>
                                            <div className="adminStatusActions">
                                                <button
                                                    className="secondaryButton"
                                                    type="button"
                                                    onClick={() => handleUpdateTipStatus(tip.id, 'PENDING')}
                                                    disabled={tip.status === 'PENDING'}
                                                >
                                                    Pending
                                                </button>

                                                <button
                                                    className="secondaryButton"
                                                    type="button"
                                                    onClick={() => handleUpdateTipStatus(tip.id, 'WON')}
                                                    disabled={tip.status === 'WON'}
                                                >
                                                    Won
                                                </button>

                                                <button
                                                    className="secondaryButton"
                                                    type="button"
                                                    onClick={() => handleUpdateTipStatus(tip.id, 'LOST')}
                                                    disabled={tip.status === 'LOST'}
                                                >
                                                    Lost
                                                </button>

                                                <button
                                                    className="secondaryButton deleteButton"
                                                    type="button"
                                                    onClick={() => handleDeleteTip(tip.id)}
                                                >
                                                    Usuń
                                                </button>
                                            </div>

                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}




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

