import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlayerByName } from "../api/playerApi";

function PlayerDetailsPage() {
    const { name } = useParams();

    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPlayer() {
            try {
                const data = await getPlayerByName(name);

                const playerData = Array.isArray(data) ? data[0] : data;
                setPlayer(playerData);
            } catch (err) {
                console.error(err);
                setError("Could not load this player.");
            } finally {
                setLoading(false);
            }
        }

        loadPlayer();
    }, [name]);

    if (loading) {
        return <main className="page">Loading player...</main>;
    }

    if (error || !player) {
        return (
            <main className="page">
                <p>{error || "Player not found."}</p>
                <Link to="/players">Back to players</Link>
            </main>
        );
    }

    return (
        <main className="page">
            <Link to="/players">← Back to players</Link>

            <section className="player-details">
                <div className="details-heading">
                    <span className="position">{player.pos || "N/A"}</span>
                    <p>{player.nation}</p>

                    <h1>{player.name}</h1>
                    <h2>{player.team}</h2>
                </div>

                <div className="details-grid">
                    <div>
                        <strong>{player.age ?? "—"}</strong>
                        <span>Age</span>
                    </div>

                    <div>
                        <strong>{player.mp ?? 0}</strong>
                        <span>Matches</span>
                    </div>

                    <div>
                        <strong>{player.starts ?? 0}</strong>
                        <span>Starts</span>
                    </div>

                    <div>
                        <strong>{player.min ?? 0}</strong>
                        <span>Minutes</span>
                    </div>

                    <div>
                        <strong>{player.gls ?? 0}</strong>
                        <span>Goals</span>
                    </div>

                    <div>
                        <strong>{player.ast ?? 0}</strong>
                        <span>Assists</span>
                    </div>

                    <div>
                        <strong>{player.pk ?? 0}</strong>
                        <span>Penalties</span>
                    </div>

                    <div>
                        <strong>{player.crdy ?? 0}</strong>
                        <span>Yellow cards</span>
                    </div>

                    <div>
                        <strong>{player.crdr ?? 0}</strong>
                        <span>Red cards</span>
                    </div>

                    <div>
                        <strong>{player.xg ?? 0}</strong>
                        <span>xG</span>
                    </div>

                    <div>
                        <strong>{player.xag ?? 0}</strong>
                        <span>xA</span>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default PlayerDetailsPage;