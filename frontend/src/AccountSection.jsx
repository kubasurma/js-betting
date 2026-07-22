function AccountSection({
                            currentUser,
                            authMessage,
                            loginForm,
                            setLoginForm,
                            registerForm,
                            setRegisterForm,
                            onLogin,
                            onRegister,
                            onLogout,
                        }) {
    return (
        <section className="section mutedSection" id="account">
            <div className="container">
                <div className="sectionHeader">
                    <p className="eyebrow">Konto</p>
                    <h2>Logowanie i rejestracja</h2>
                    <p>
                        Zaloguj się, żeby kupować typy, odbierać Free Tip i widzieć
                        swoje aktywne typy.
                    </p>
                </div>

                {authMessage && (
                    <p className="infoText">{authMessage}</p>
                )}

                {currentUser ? (
                    <div className="accountBox">
                        <h3>Jesteś zalogowany</h3>

                        <p>
                            <strong>Imię:</strong> {currentUser.firstName}
                        </p>

                        <p>
                            <strong>Email:</strong> {currentUser.email}
                        </p>

                        <p>
                            <strong>Rola:</strong> {currentUser.role}
                        </p>

                        <button
                            className="secondaryButton"
                            type="button"
                            onClick={onLogout}
                        >
                            Wyloguj
                        </button>
                    </div>
                ) : (
                    <div className="formsGrid">
                        <form className="formCard" onSubmit={onLogin}>
                            <h3>Logowanie</h3>

                            <label>
                                Email
                                <input
                                    type="email"
                                    value={loginForm.email}
                                    onChange={(event) =>
                                        setLoginForm({
                                            ...loginForm,
                                            email: event.target.value,
                                        })
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Hasło
                                <input
                                    type="password"
                                    value={loginForm.password}
                                    onChange={(event) =>
                                        setLoginForm({
                                            ...loginForm,
                                            password: event.target.value,
                                        })
                                    }
                                    required
                                />
                            </label>

                            <button className="primaryButton" type="submit">
                                Zaloguj
                            </button>
                        </form>

                        <form className="formCard" onSubmit={onRegister}>
                            <h3>Rejestracja</h3>

                            <label>
                                Imię
                                <input
                                    type="text"
                                    value={registerForm.firstName}
                                    onChange={(event) =>
                                        setRegisterForm({
                                            ...registerForm,
                                            firstName: event.target.value,
                                        })
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    value={registerForm.email}
                                    onChange={(event) =>
                                        setRegisterForm({
                                            ...registerForm,
                                            email: event.target.value,
                                        })
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Hasło
                                <input
                                    type="password"
                                    value={registerForm.password}
                                    onChange={(event) =>
                                        setRegisterForm({
                                            ...registerForm,
                                            password: event.target.value,
                                        })
                                    }
                                    required
                                />
                            </label>

                            <button className="primaryButton" type="submit">
                                Zarejestruj
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </section>
    )
}

export default AccountSection