function OffersSection({
                           offers,
                           loading,
                           error,
                           purchaseMessage,
                           onPurchase,
                       }) {
    return (
        <section className="section" id="offers">
            <div className="container">
                <div className="sectionHeader">
                    <p className="eyebrow">Dostępne teraz</p>
                    <h2>Oferty premium</h2>
                    <p>
                        Przed zakupem nie pokazujemy meczu, picka ani dokładnego kursu.
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
                                type="button"
                                onClick={() => onPurchase(offer.id)}
                            >
                                Kup typ
                            </button>
                        </article>
                    ))}
                </div>
            </div>

            {purchaseMessage && <p className="infoText">{purchaseMessage}</p>}
        </section>
    )
}

export default OffersSection