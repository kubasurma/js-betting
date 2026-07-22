import { useEffect, useState } from 'react'
import { API_BASE_URL, getAuthHeaders, getToken, readErrorMessage } from './api'
import Header from './Header'
import Hero from './Hero'
import Footer from './Footer'
import HotItWorks from './HotItWorks.jsx'
import WhyUs from './WhyUs'
import OffersSection from './OffersSection'
import FreeTipSection from './FreeTipSection.jsx'
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
    const [tipIdToDelete, setTipIdToDelete] = useState(null)


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

        fetch(`${API_BASE_URL}/offers/premium`)
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
        const token = getToken()

        if (!token) {
            return
        }

        fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders(token),
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

        fetch(`${API_BASE_URL}/auth/login`, {
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

        fetch(`${API_BASE_URL}/auth/register`, {
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

    function loadMyTips() {
        const token = getToken()

        if (!token) {
            setMyTips([])
            return
        }

        setMyTipsLoading(true)
        setMyTipsMessage('')

        fetch(`${API_BASE_URL}/users/me/my-tips/active`, {
            headers: getAuthHeaders(token),
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
        const token = getToken()

        if (!token) {
            setFreeTipStatus(null)
            return
        }

        setFreeTipLoading(true)
        setFreeTipMessage('')

        fetch(`${API_BASE_URL}/users/me/free-tip/status`, {
            headers: getAuthHeaders(token),
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




    async function claimFreeTip() {
        const token = getToken()

        if (!token || !currentUser) {
            setFreeTipMessage('Zaloguj się, żeby odebrać darmowy typ.')
            return
        }

        setFreeTipLoading(true)
        setFreeTipMessage('')

        try {
            const response = await fetch(`${API_BASE_URL}/users/me/free-tip/claim`, {
                method: 'POST',
                headers: getAuthHeaders(token),
            })

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się odebrać darmowego typu.'
                )

                throw new Error(message)
            }

            setFreeTipMessage('Darmowy typ odebrany.')
            loadFreeTipStatus()
            loadMyTips()
        } catch (error) {
            setFreeTipMessage(error.message)
            loadFreeTipStatus()
        } finally {
            setFreeTipLoading(false)
        }
    }

    async function loadAdminTips() {
        const token = getToken()

        if (!token) {
            setAdminTips([])
            return
        }

        setAdminTipsLoading(true)
        setAdminTipsMessage('')

        try {
            const response = await fetch(`${API_BASE_URL}/admin/tips`, {
                headers: getAuthHeaders(token),
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

        const token = getToken()

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
            const response = await fetch(`${API_BASE_URL}/admin/tips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(token),
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
        const token = getToken()

        if (!token || !isAdmin) {
            setAdminTipsMessage('Tylko admin może zmieniać status typu.')
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/tips/${tipId}/status?status=${status}`,
                {
                    method: 'PATCH',
                    headers: getAuthHeaders(token),
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

    async function handleUpdateTipVisibility(tipId, visible) {
        const token = getToken()

        if (!token || !isAdmin) {
            setAdminTipsMessage('Tylko admin może zmieniać widoczność typów.')
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/admin/tips/${tipId}/visibility?visible=${visible}`,
                {
                    method: 'PATCH',
                    headers: getAuthHeaders(token),
                }
            )

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się zmienić widoczności typu.'
                )

                throw new Error(message)
            }

            setAdminTipsMessage(
                visible
                    ? `Typ #${tipId} jest ponownie widoczny.`
                    : `Typ #${tipId} został ukryty.`
            )

            loadAdminTips()
            loadOffers()
        } catch (error) {
            setAdminTipsMessage(error.message)
        }
    }

    async function handleDeleteTip(tipId) {
        setAdminTipsMessage(`Próbuję usunąć typ #${tipId}...`)

        const token = getToken()

        if (!token || !isAdmin) {
            setAdminTipsMessage('Tylko admin może usuwać typy.')
            setTipIdToDelete(null)
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/tips/${tipId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(token),
            })

            if (!response.ok) {
                const message = await readErrorMessage(
                    response,
                    'Nie udało się usunąć typu.'
                )

                throw new Error(message)
            }

            setAdminTipsMessage(`Typ #${tipId} został usunięty.`)
            setTipIdToDelete(null)

            loadAdminTips()
            loadOffers()
        } catch (error) {
            setAdminTipsMessage(error.message)
            setTipIdToDelete(null)
        }
    }

    async function handlePurchase(tipId) {
        setPurchaseMessage('')

        const token = getToken()

        if (!token || !currentUser) {
            setPurchaseMessage('Zaloguj się, żeby kupić typ.')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/purchases?tipId=${tipId}`, {
                method: 'POST',
                headers: getAuthHeaders(token),
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
            <Header
                currentUser={currentUser}
                isAdmin={isAdmin}
                onLogout={handleLogout}
            />

            <main>
                <Hero currentUser={currentUser} />

                <OffersSection
                    offers={offers}
                    loading={loading}
                    error={error}
                    purchaseMessage={purchaseMessage}
                    onPurchase={handlePurchase}
                />

                <FreeTipSection
                    currentUser={currentUser}
                    freeTipStatus={freeTipStatus}
                    freeTipLoading={freeTipLoading}
                    freeTipMessage={freeTipMessage}
                    onClaim={claimFreeTip}
                    formatDate={formatDate}
                />


                <section className="section mutedSection" id="my-tips">
                    <div className="container">
                        <div className="sectionHeader">
                            <p className="eyebrow">Strefa użytkownika</p>
                            <h2>Moje typy</h2>
                            <p>
                                Tutaj zobaczysz typy kupione na swoim koncie razem z meczem, pickiem,
                                kursem i statusem.
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
                                            <p>
                                                Widoczność:{' '}
                                                <strong>
                                                    {tip.visible === false ? 'Ukryty' : 'Widoczny'}
                                                </strong>
                                            </p>
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

                                                {tipIdToDelete === tip.id ? (
                                                    <div className="deleteConfirmBox">
                                                        <p>Czy na pewno usunąć typ #{tip.id}?</p>

                                                        <button
                                                            className="secondaryButton deleteButton"
                                                            type="button"
                                                            onClick={() => handleDeleteTip(tip.id)}
                                                        >
                                                            Potwierdź
                                                        </button>

                                                        <button
                                                            className="secondaryButton"
                                                            type="button"
                                                            onClick={() => setTipIdToDelete(null)}
                                                        >
                                                            Anuluj
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="secondaryButton deleteButton"
                                                        type="button"
                                                        onClick={() => setTipIdToDelete(tip.id)}
                                                    >
                                                        Usuń
                                                    </button>
                                                )}
                                                <button
                                                    className="secondaryButton"
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdateTipVisibility(tip.id, tip.visible === false)
                                                    }
                                                >
                                                    {tip.visible === false ? 'Pokaż' : 'Ukryj'}
                                                </button>
                                            </div>

                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <HotItWorks />

                <WhyUs />
            </main>

            <Footer />
        </div>
    )
}

export default App

