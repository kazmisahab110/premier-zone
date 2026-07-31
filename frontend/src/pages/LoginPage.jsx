import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

function LoginPage() {
    const { login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function updateField(event) {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            await login(form);

            const destination =
                location.state?.from?.pathname ||
                "/account";

            navigate(destination, {
                replace: true
            });
        } catch (requestError) {
            console.error(requestError);

            setError(
                "The email or password is incorrect."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">Welcome back</p>
                <h1>Log in</h1>

                <p className="auth-introduction">
                    Access your Premier Zone account.
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <label>
                        Email

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={updateField}
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label>
                        Password

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={updateField}
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Logging in..."
                            : "Log In"}
                    </button>
                </form>

                <p className="auth-switch">
                    Need an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default LoginPage;