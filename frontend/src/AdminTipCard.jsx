function AdminTipCard({
                          tip,
                          tipIdToDelete,
                          onUpdateStatus,
                          onUpdateVisibility,
                          onAskDelete,
                          onCancelDelete,
                          onDelete,
                          formatDate,
                      }) {
    return (
        <article className="tipCard">
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
                <strong>Stawka:</strong> {tip.stake}
            </p>

            <p>
                <strong>Data meczu:</strong> {formatDate(tip.matchDate)}
            </p>

            <p>
                <strong>Cena:</strong> {tip.price} PLN
            </p>

            <p>
                <strong>Premium:</strong> {tip.premium ? 'Tak' : 'Nie'}
            </p>

            <p>
                <strong>Widoczność:</strong>{' '}
                {tip.visible === false ? 'Ukryty' : 'Widoczny'}
            </p>

            <p>
                <strong>Analiza:</strong> {tip.analysis}
            </p>

            <div className="adminActions">
                <button
                    className="secondaryButton"
                    type="button"
                    onClick={() => onUpdateStatus(tip.id, 'PENDING')}
                >
                    Pending
                </button>

                <button
                    className="secondaryButton"
                    type="button"
                    onClick={() => onUpdateStatus(tip.id, 'WON')}
                >
                    Won
                </button>

                <button
                    className="secondaryButton"
                    type="button"
                    onClick={() => onUpdateStatus(tip.id, 'LOST')}
                >
                    Lost
                </button>

                <button
                    className="secondaryButton"
                    type="button"
                    onClick={() =>
                        onUpdateVisibility(tip.id, tip.visible === false)
                    }
                >
                    {tip.visible === false ? 'Pokaż' : 'Ukryj'}
                </button>

                {tipIdToDelete === tip.id ? (
                    <div className="deleteConfirmBox">
                        <p>Czy na pewno usunąć ten typ?</p>

                        <button
                            className="secondaryButton deleteButton"
                            type="button"
                            onClick={() => onDelete(tip.id)}
                        >
                            Potwierdź
                        </button>

                        <button
                            className="secondaryButton"
                            type="button"
                            onClick={onCancelDelete}
                        >
                            Anuluj
                        </button>
                    </div>
                ) : (
                    <button
                        className="secondaryButton deleteButton"
                        type="button"
                        onClick={() => onAskDelete(tip.id)}
                    >
                        Usuń
                    </button>
                )}
            </div>
        </article>
    )
}

export default AdminTipCard