import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPlayersByTeam } from "../api/playerApi";
import PlayerCard from "../components/PlayerCard";

function TeamDetailsPage() {
    const { teamName } = useParams();

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        async function loadPlayers() {
            const data = await getPlayersByTeam(teamName);
            setPlayers(data);
        }

        loadPlayers();
    }, [teamName]);

    const totalPlayers = players.length;

    const totalGoals = players.reduce(
        (sum, player) => sum + (player.gls ?? 0),
        0
    );

    const averageAge =
        totalPlayers > 0
            ? (
                players.reduce(
                    (sum, player) => sum + (player.age ?? 0),
                    0
                ) / totalPlayers
            ).toFixed(1)
            : 0;

    const topScorer = players.reduce(
        (best, player) =>
            !best || (player.gls ?? 0) > (best.gls ?? 0)
                ? player
                : best,
        null
    );

    const topAssister = players.reduce(
        (best, player) =>
            !best || (player.ast ?? 0) > (best.ast ?? 0)
                ? player
                : best,
        null
    );

    return (
        <main className="page">
            <h1>{teamName.replaceAll("-", " ")}</h1>

            <section className="team-summary">
                <div>
                    <strong>{totalPlayers}</strong>
                    <span>Players</span>
                </div>

                <div>
                    <strong>{totalGoals}</strong>
                    <span>Total Goals</span>
                </div>

                <div>
                    <strong>{averageAge}</strong>
                    <span>Average Age</span>
                </div>

                <div>
                    <strong>{topScorer?.name ?? "—"}</strong>
                    <span>Top Scorer</span>
                </div>

                <div>
                    <strong>{topAssister?.name ?? "—"}</strong>
                    <span>Top Assister</span>
                </div>
            </section>

            <div className="player-grid">
                {players.map((player) => (
                    <PlayerCard
                        key={player.name}
                        player={player}
                    />
                ))}
            </div>
        </main>
    );
}

export default TeamDetailsPage;