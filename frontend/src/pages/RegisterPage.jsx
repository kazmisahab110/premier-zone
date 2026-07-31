import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        displayName: "",
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

            await register(form);

            navigate("/account");
        } catch (requestError) {
            console.error(requestError);

            setError(
                requestError.response?.data?.detail ||
                requestError.response?.data?.message ||
                "Could not create your account."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">Create an account</p>
                <h1>Join Premier Zone</h1>

                <p className="auth-introduction">
                    Create an account to save your fantasy squad.
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
                        Display name

                        <input
                            type="text"
                            name="displayName"
                            value={form.displayName}
                            onChange={updateField}
                            minLength="2"
                            maxLength="80"
                            required
                        />
                    </label>

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
                            minLength="8"
                            autoComplete="new-password"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already registered?{" "}
                    <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    );
}

export default RegisterPage;