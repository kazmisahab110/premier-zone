import { useEffect, useMemo, useState } from "react";
import { getAllPlayers } from "../api/playerApi";
import "../App.css";

function ComparePage() {
    const [players, setPlayers] = useState([]);
    const [firstPlayerName, setFirstPlayerName] = useState("");
    const [secondPlayerName, setSecondPlayerName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPlayers() {
            try {
                const data = await getAllPlayers();

                const realPlayers = data.filter(
                    (player) => player.name && player.name !== "Squad Total"
                );

                setPlayers(realPlayers);
            } catch (err) {
                console.error(err);
                setError("Could not load players for comparison.");
            } finally {
                setLoading(false);
            }
        }

        loadPlayers();
    }, []);

    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [players]);

    const firstPlayer = players.find(
        (player) => player.name === firstPlayerName
    );

    const secondPlayer = players.find(
        (player) => player.name === secondPlayerName
    );

    if (loading) {
        return <main className="page">Loading players...</main>;
    }

    if (error) {
        return <main className="page message error">{error}</main>;
    }

    return (
        <main className="page">
            <header className="page-heading compare-heading">
                <div>
                    <p className="eyebrow">Head-to-head</p>
                    <h1>Compare Players</h1>
                    <p>
                        Select two Premier League players to compare their
                        statistics.
                    </p>
                </div>
            </header>

            <section className="compare-selectors">
                <div>
                    <label htmlFor="first-player">Player one</label>

                    <select
                        id="first-player"
                        value={firstPlayerName}
                        onChange={(event) =>
                            setFirstPlayerName(event.target.value)
                        }
                    >
                        <option value="">Select a player</option>

                        {sortedPlayers.map((player) => (
                            <option
                                key={`first-${player.name}`}
                                value={player.name}
                                disabled={player.name === secondPlayerName}
                            >
                                {player.name} — {player.team}
                            </option>
                        ))}
                    </select>
                </div>

                <span className="compare-versus">VS</span>

                <div>
                    <label htmlFor="second-player">Player two</label>

                    <select
                        id="second-player"
                        value={secondPlayerName}
                        onChange={(event) =>
                            setSecondPlayerName(event.target.value)
                        }
                    >
                        <option value="">Select a player</option>

                        {sortedPlayers.map((player) => (
                            <option
                                key={`second-${player.name}`}
                                value={player.name}
                                disabled={player.name === firstPlayerName}
                            >
                                {player.name} — {player.team}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {firstPlayer && secondPlayer ? (
                <ComparisonResults
                    firstPlayer={firstPlayer}
                    secondPlayer={secondPlayer}
                />
            ) : (
                <section className="compare-empty">
                    <h2>Select two players</h2>
                    <p>
                        Their statistics will appear here in a side-by-side
                        comparison.
                    </p>
                </section>
            )}
        </main>
    );
}

function ComparisonResults({ firstPlayer, secondPlayer }) {
    const statistics = [
        { label: "Age", property: "age" },
        { label: "Matches", property: "mp" },
        { label: "Starts", property: "starts" },
        { label: "Minutes", property: "min" },
        { label: "Goals", property: "gls" },
        { label: "Assists", property: "ast" },
        { label: "Penalties", property: "pk" },
        { label: "Yellow cards", property: "crdy", lowerIsBetter: true },
        { label: "Red cards", property: "crdr", lowerIsBetter: true },
        { label: "xG", property: "xg" },
        { label: "xA", property: "xag" }
    ];

    function getWinner(firstValue, secondValue, lowerIsBetter = false) {
        const first = Number(firstValue ?? 0);
        const second = Number(secondValue ?? 0);

        if (first === second) {
            return "tie";
        }

        if (lowerIsBetter) {
            return first < second ? "first" : "second";
        }

        return first > second ? "first" : "second";
    }

    return (
        <section className="comparison-results">
            <div className="comparison-player-header">
                <div>
                    <span className="position">
                        {firstPlayer.pos || "N/A"}
                    </span>
                    <h2>{firstPlayer.name}</h2>
                    <p>{firstPlayer.team}</p>
                </div>

                <div>
                    <span className="position">
                        {secondPlayer.pos || "N/A"}
                    </span>
                    <h2>{secondPlayer.name}</h2>
                    <p>{secondPlayer.team}</p>
                </div>
            </div>

            <div className="comparison-table">
                {statistics.map((statistic) => {
                    const firstValue =
                        firstPlayer[statistic.property] ?? 0;

                    const secondValue =
                        secondPlayer[statistic.property] ?? 0;

                    const winner = getWinner(
                        firstValue,
                        secondValue,
                        statistic.lowerIsBetter
                    );

                    return (
                        <div
                            className="comparison-row"
                            key={statistic.property}
                        >
                            <strong
                                className={
                                    winner === "first"
                                        ? "comparison-winner"
                                        : ""
                                }
                            >
                                {firstValue}
                            </strong>

                            <span>{statistic.label}</span>

                            <strong
                                className={
                                    winner === "second"
                                        ? "comparison-winner"
                                        : ""
                                }
                            >
                                {secondValue}
                            </strong>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default ComparePage;