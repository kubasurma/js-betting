function FreeTipSection({
                            currentUser,
                            freeTipStatus,
                            freeTipLoading,
                            freeTipMessage,
                            onClaim,
                            formatDate,
                        }) {
    return (
        <section className="section mutedSection" id="free-tip">
            <div className="container">
                <div className="sectionHeader">
                    <p className="eyebrow">Darmowy typ</p>
                    <h2>Odbierz Free Tip raz na 5 dni</h2>
                    <p>
                        Zarejestrowani użytkownicy mogą odebrać darmowy typ z kursem
                        w zakresie 1.50 - 1.70.
                    </p>
                </div>

                <div className="freeTipBox">
                    {!currentUser && (
                        <p className="infoText">
                            Zaloguj się, żeby odebrać darmowy typ.
                        </p>
                    )}

                    {currentUser && freeTipLoading && (
                        <p className="infoText">Sprawdzanie statusu...</p>
                    )}

                    {currentUser && freeTipStatus && (
                        <>
                            <p className="infoText">{freeTipStatus.message}</p>

                            {!freeTipStatus.canClaim && freeTipStatus.nextAvailableAt && (
                                <p className="infoText">
                                    Następny darmowy typ:{' '}
                                    {formatDate(freeTipStatus.nextAvailableAt)}
                                </p>
                            )}

                            <button
                                className="primaryButton"
                                type="button"
                                disabled={!freeTipStatus.canClaim || freeTipLoading}
                                onClick={onClaim}
                            >
                                Odbierz darmowy typ
                            </button>
                        </>
                    )}

                    {freeTipMessage && (
                        <p className="infoText">{freeTipMessage}</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default FreeTipSection
export default FreeTipSection