import AdminTipForm from './AdminTipForm'
import AdminTipCard from './AdminTipCard'

function AdminPanel({
                        isAdmin,
                        adminTips,
                        adminTipsLoading,
                        adminTipsMessage,
                        adminCreateMessage,
                        adminTipForm,
                        tipIdToDelete,
                        onFormChange,
                        onCreateTip,
                        onRefreshTips,
                        onUpdateStatus,
                        onUpdateVisibility,
                        onAskDelete,
                        onCancelDelete,
                        onDelete,
                        formatDate,
                    }) {
    if (!isAdmin) {
        return null
    }

    return (
        <section className="section mutedSection" id="admin">
            <div className="container">
                <div className="sectionHeader">
                    <p className="eyebrow">Panel admina</p>
                    <h2>Zarządzanie typami</h2>
                    <p>
                        Dodawaj nowe typy, zmieniaj statusy, ukrywaj oferty
                        i usuwaj typy, które nie zostały jeszcze kupione.
                    </p>
                </div>

                <AdminTipForm
                    adminTipForm={adminTipForm}
                    adminCreateMessage={adminCreateMessage}
                    onChange={onFormChange}
                    onSubmit={onCreateTip}
                />

                <div className="adminListHeader">
                    <h3>Lista typów</h3>

                    <button
                        className="secondaryButton"
                        type="button"
                        onClick={onRefreshTips}
                    >
                        Odśwież listę
                    </button>
                </div>

                {adminTipsLoading && (
                    <p className="infoText">Ładowanie typów admina...</p>
                )}

                {adminTipsMessage && (
                    <p className="errorText">{adminTipsMessage}</p>
                )}

                {!adminTipsLoading && adminTips.length === 0 && (
                    <p className="infoText">Brak typów w panelu admina.</p>
                )}

                <div className="tipsGrid">
                    {adminTips.map((tip) => (
                        <AdminTipCard
                            key={tip.id}
                            tip={tip}
                            tipIdToDelete={tipIdToDelete}
                            onUpdateStatus={onUpdateStatus}
                            onUpdateVisibility={onUpdateVisibility}
                            onAskDelete={onAskDelete}
                            onCancelDelete={onCancelDelete}
                            onDelete={onDelete}
                            formatDate={formatDate}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AdminPanel