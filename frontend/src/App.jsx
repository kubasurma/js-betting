import { useEffect, useState } from 'react'

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
      <div>
        <header>
          <h1>JS Betting</h1>
          <p>Premium betting tips platform</p>
        </header>

        <main>
          <section>
            <h2>Premium offers</h2>

            {loading && <p>Loading offers...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && offers.length === 0 && (
                <p>No premium offers available.</p>
            )}

            {!loading && !error && offers.map((offer) => (
                <div key={offer.id}>
                  <p>Odds range: {offer.oddsRange}</p>
                  <p>Price: {offer.price} PLN</p>
                  <button>Buy tip</button>
                </div>
            ))}
          </section>
        </main>
      </div>
  )
}

export default App