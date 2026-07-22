import { useEffect, useState } from 'react'
import { API_BASE_URL, getAuthHeaders, getToken, readErrorMessage } from './api'
import Header from './Header'
import Hero from './Hero'
import Footer from './Footer'
import HotItWorks from './HotItWorks.jsx'
import WhyUs from './WhyUs'
import OffersSection from './OffersSection'
import FreeTipSection from './FreeTipSection.jsx'
import MyTipsSection from './MyTipsSection.jsx'
import AccountSection from './AccountSection.jsx'
import AdminTipForm from './AdminTipForm.jsx'
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


                <MyTipsSection
                    currentUser={currentUser}
                    myTips={myTips}
                    myTipsLoading={myTipsLoading}
                    myTipsMessage={myTipsMessage}
                    onRefresh={loadMyTips}
                    formatDate={formatDate}
                />

                <AccountSection
                    currentUser={currentUser}
                    authMessage={authMessage}
                    loginForm={loginForm}
                    setLoginForm={setLoginForm}
                    registerForm={registerForm}
                    setRegisterForm={setRegisterForm}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onLogout={handleLogout}
                />

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

                                <AdminTipForm
                                    adminTipForm={adminTipForm}
                                    adminCreateMessage={adminCreateMessage}
                                    onChange={handleAdminTipFormChange}
                                    onSubmit={handleCreatePremiumTip}
                                />

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

