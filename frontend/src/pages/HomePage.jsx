import { Link } from "react-router-dom";
import "../App.css";

function HomePage() {
    return (
        <main className="home-page">
            <section className="home-hero">
                <div className="home-hero-content">
                    <p className="eyebrow">
                        Premier League analytics platform
                    </p>

                    <h1>
                        Explore players.
                        <span> Build your squad.</span>
                    </h1>

                    <p className="home-description">
                        Search Premier League players, compare performances,
                        explore club squads and create your own fantasy team.
                    </p>

                    <div className="home-actions">
                        <Link
                            to="/players"
                            className="home-primary-button"
                        >
                            Browse Players
                        </Link>

                        <Link
                            to="/fantasy"
                            className="home-secondary-button"
                        >
                            Build Fantasy Team
                        </Link>
                    </div>
                </div>

                <div className="home-dashboard-preview">
                    <div className="preview-header">
                        <div>
                            <span className="preview-label">
                                Fantasy squad
                            </span>
                            <strong>Premier Zone XI</strong>
                        </div>

                        <span className="preview-status">
                            11/15
                        </span>
                    </div>

                    <div className="preview-stat-grid">
                        <div>
                            <strong>42</strong>
                            <span>Goals</span>
                        </div>

                        <div>
                            <strong>31</strong>
                            <span>Assists</span>
                        </div>

                        <div>
                            <strong>4</strong>
                            <span>Clubs</span>
                        </div>
                    </div>

                    <div className="preview-progress">
                        <div>
                            <span>Goalkeepers</span>
                            <strong>2/2</strong>
                        </div>
                        <div className="preview-track">
                            <span style={{ width: "100%" }} />
                        </div>
                    </div>

                    <div className="preview-progress">
                        <div>
                            <span>Defenders</span>
                            <strong>4/5</strong>
                        </div>
                        <div className="preview-track">
                            <span style={{ width: "80%" }} />
                        </div>
                    </div>

                    <div className="preview-progress">
                        <div>
                            <span>Midfielders</span>
                            <strong>3/5</strong>
                        </div>
                        <div className="preview-track">
                            <span style={{ width: "60%" }} />
                        </div>
                    </div>

                    <div className="preview-progress">
                        <div>
                            <span>Forwards</span>
                            <strong>2/3</strong>
                        </div>
                        <div className="preview-track">
                            <span style={{ width: "67%" }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-features">
                <Link to="/players" className="home-feature-card">
                    <span className="feature-number">01</span>
                    <h2>Player Database</h2>
                    <p>
                        Search and filter hundreds of Premier League players
                        by club, position and name.
                    </p>
                    <strong>Explore players →</strong>
                </Link>

                <Link to="/compare" className="home-feature-card">
                    <span className="feature-number">02</span>
                    <h2>Head-to-Head</h2>
                    <p>
                        Compare player statistics side by side and identify
                        strengths across key performance categories.
                    </p>
                    <strong>Compare players →</strong>
                </Link>

                <Link to="/teams" className="home-feature-card">
                    <span className="feature-number">03</span>
                    <h2>Club Squads</h2>
                    <p>
                        Browse every team and view its full squad, top scorer
                        and statistical summary.
                    </p>
                    <strong>View teams →</strong>
                </Link>

                <Link to="/fantasy" className="home-feature-card">
                    <span className="feature-number">04</span>
                    <h2>Fantasy Manager</h2>
                    <p>
                        Select a balanced 15-player squad while respecting
                        position and club limits.
                    </p>
                    <strong>Build your squad →</strong>
                </Link>
            </section>

            <section className="home-cta">
                <div>
                    <p className="eyebrow">Start exploring</p>
                    <h2>Build your Premier League squad today.</h2>
                    <p>
                        Browse the player database and create a team based on
                        real performance statistics.
                    </p>
                </div>

                <Link
                    to="/players"
                    className="home-primary-button"
                >
                    View All Players
                </Link>
            </section>
        </main>
    );
}

export default HomePage;