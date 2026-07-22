function MyTipsSection({
                           currentUser,
                           myTips,
                           myTipsLoading,
                           myTipsMessage,
                           onRefresh,
                           formatDate,
                       }) {
    return (
        <section className="section" id="my-tips">
            <div className="container">
                <div className="sectionHeader">
                    <p className="eyebrow">Twoje konto</p>
                    <h2>Moje typy</h2>
                    <p>
                        Tutaj zobaczysz typy kupione na swoim koncie razem z meczem,
                        pickiem, kursem i statusem.
                    </p>
                </div>

                {!currentUser && (
                    <p className="infoText">
                        Zaloguj się, żeby zobaczyć swoje typy.
                    </p>
                )}

                {currentUser && (
                    <>
                        <button
                            className="secondaryButton"
                            type="button"
                            onClick={onRefresh}
                        >
                            Odśwież moje typy
                        </button>

                        {myTipsLoading && (
                            <p className="infoText">Ładowanie Twoich typów...</p>
                        )}

                        {myTipsMessage && (
                            <p className="errorText">{myTipsMessage}</p>
                        )}

                        {!myTipsLoading && myTips.length === 0 && (
                            <p className="infoText">
                                Nie masz jeszcze aktywnych typów.
                            </p>
                        )}

                        <div className="tipsGrid">
                            {myTips.map((tip) => (
                                <article className="tipCard" key={tip.purchaseId}>
                                    <div className="offerTop">
                                        <p className="cardLabel">{tip.league}</p>
                                        <span className="statusBadge">{tip.status}</span>
                                    </div>

                                    <h3>
                                        {tip.homeTeam} - {tip.awayTeam}
                                    </h3>

                                    <p>
                                        <strong>Pick:</strong> {tip.pick}
                                    </p>

                                    <p>
                                        <strong>Kurs:</strong> {tip.odds}
                                    </p>

                                    <p>
                                        <strong>Mecz:</strong> {formatDate(tip.matchDate)}
                                    </p>

                                    <p>
                                        <strong>Kupiono:</strong>{' '}
                                        {formatDate(tip.purchasedAt)}
                                    </p>

                                    <p>
                                        <strong>Cena:</strong> {tip.pricePaid} PLN
                                    </p>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default MyTipsSection