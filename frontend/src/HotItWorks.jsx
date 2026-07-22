function HowItWorks() {
    return (
        <section className="section mutedSection" id="how-it-works">
            <div className="container">
                <div className="sectionHeader">
                    <p className="eyebrow">Proces</p>
                    <h2>Jak to działa?</h2>
                </div>

                <div className="stepsGrid">
                    <div className="stepCard">
                        <span>01</span>
                        <h3>Wybierasz ofertę</h3>
                        <p>Przed zakupem widzisz tylko zakres kursu i cenę.</p>
                    </div>

                    <div className="stepCard">
                        <span>02</span>
                        <h3>Kupujesz dostęp</h3>
                        <p>Po zakupie typ zostaje przypisany do Twojego konta.</p>
                    </div>

                    <div className="stepCard">
                        <span>03</span>
                        <h3>Odbierasz typ</h3>
                        <p>W sekcji „Moje typy” widzisz mecz, pick, kurs i status typu.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks