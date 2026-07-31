import { useAuth } from "../auth/AuthContext";

function AccountPage() {
    const { user } = useAuth();

    return (
        <main className="page account-page">
            <header className="page-heading">
                <div>
                    <p className="eyebrow">
                        Your account
                    </p>

                    <h1>
                        Welcome, {user.displayName}
                    </h1>

                    <p>
                        Manage your Premier Zone profile
                        and saved fantasy squad.
                    </p>
                </div>
            </header>

            <section className="account-card">
                <div>
                    <span>Display name</span>
                    <strong>{user.displayName}</strong>
                </div>

                <div>
                    <span>Email</span>
                    <strong>{user.email}</strong>
                </div>

                <div>
                    <span>Role</span>
                    <strong>{user.role}</strong>
                </div>
            </section>
        </main>
    );
}

export default AccountPage;