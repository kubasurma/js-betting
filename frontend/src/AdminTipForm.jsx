function AdminTipForm({
                          adminTipForm,
                          adminCreateMessage,
                          onChange,
                          onSubmit,
                      }) {
    return (
        <form className="formCard adminForm" onSubmit={onSubmit}>
            <h3>Dodaj typ premium</h3>

            <label>
                Liga
                <input
                    type="text"
                    name="league"
                    value={adminTipForm.league}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Gospodarz
                <input
                    type="text"
                    name="homeTeam"
                    value={adminTipForm.homeTeam}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Gość
                <input
                    type="text"
                    name="awayTeam"
                    value={adminTipForm.awayTeam}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Pick
                <input
                    type="text"
                    name="pick"
                    value={adminTipForm.pick}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Kurs
                <input
                    type="number"
                    step="0.01"
                    name="odds"
                    value={adminTipForm.odds}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Stawka
                <input
                    type="number"
                    step="1"
                    name="stake"
                    value={adminTipForm.stake}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Data meczu
                <input
                    type="datetime-local"
                    name="matchDate"
                    value={adminTipForm.matchDate}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Analiza
                <textarea
                    name="analysis"
                    value={adminTipForm.analysis}
                    onChange={onChange}
                    required
                />
            </label>

            <label>
                Cena
                <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={adminTipForm.price}
                    onChange={onChange}
                    required
                />
            </label>

            <button className="primaryButton" type="submit">
                Dodaj typ
            </button>

            {adminCreateMessage && (
                <p className="infoText">{adminCreateMessage}</p>
            )}
        </form>
    )
}

export default AdminTipForm