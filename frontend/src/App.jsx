import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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
                setError('Could not load premium offers')
                setLoading(false)
            })
    }, [])

    return (
        <div className="app">
            <header className="hero">
                <div>
                    <p className="eyebrow">Premium betting tips</p>
                    <h1>JS Betting</h1>
                    <p className="heroText">
                        Hidden premium tips with transparent odds ranges and simple access after purchase.
                    </p>
                </div>
            </header>

            <main className="main">
                <section className="offersSection">
                    <div className="sectionHeader">
                        <p className="eyebrow">Available now</p>
                        <h2>Premium offers</h2>
                        <p>
                            Before purchase you only see the odds range and price. Full match details are unlocked after buying.
                        </p>
                    </div>

                    {loading && <p className="infoText">Loading offers...</p>}

                    {error && <p className="errorText">{error}</p>}

                    {!loading && !error && offers.length === 0 && (
                        <p className="infoText">No premium offers available.</p>
                    )}

                    <div className="offersGrid">
                        {!loading && !error && offers.map((offer) => (
                            <article className="offerCard" key={offer.id}>
                                <div>
                                    <p className="cardLabel">Odds range</p>
                                    <h3>{offer.oddsRange}</h3>
                                </div>

                                <div>
                                    <p className="cardLabel">Price</p>
                                    <p className="price">{offer.price} PLN</p>
                                </div>

                                <button className="primaryButton">Buy tip</button>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default App