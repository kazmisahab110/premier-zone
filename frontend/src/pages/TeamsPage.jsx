import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeams } from "../api/playerApi";
import "../App.css";

function TeamsPage() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTeams() {
            try {
                const data = await getTeams();
                setTeams(data);
            } catch (err) {
                console.error(err);
                setError("Could not load teams.");
            } finally {
                setLoading(false);
            }
        }

        loadTeams();
    }, []);

    if (loading) {
        return <main className="page">Loading teams...</main>;
    }

    if (error) {
        return <main className="page">{error}</main>;
    }

    return (
        <main className="page">
            <header className="page-heading">
                <div>
                    <p className="eyebrow">Premier League clubs</p>
                    <h1>Teams</h1>
                    <p>Select a team to view its squad.</p>
                </div>

                <span className="player-count">{teams.length} teams</span>
            </header>

            <section className="team-grid">
                {teams.map((team) => (
                    <Link
                        key={team}
                        to={`/teams/${encodeURIComponent(team)}`}
                        className="team-card"
                    >
                        <h2>{team.replaceAll("-", " ")}</h2>
                        <span>View squad →</span>
                    </Link>
                ))}
            </section>
        </main>
    );
}

export default TeamsPage;