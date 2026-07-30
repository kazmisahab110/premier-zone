import { useEffect, useMemo, useState } from "react";
import {
    getAllPlayers,
    getPlayersPage
} from "../api/playerApi";
import PlayerCard from "../components/PlayerCard";
import "../App.css";

function PlayersPage({
                         fantasyPlayers,
                         onAddFantasyPlayer,
                         squadMessage,
                         messageType
                     }) {
    const [players, setPlayers] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedTeam, setSelectedTeam] = useState("All");
    const [selectedPosition, setSelectedPosition] = useState("All");

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(24);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTeamOptions() {
            try {
                const data = await getAllPlayers();
                setAllPlayers(data);
            } catch (err) {
                console.error("Could not load team options:", err);
            }
        }

        loadTeamOptions();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        async function loadPlayersPage() {
            try {
                setLoading(true);
                setError("");

                const data = await getPlayersPage({
                    page: currentPage,
                    size: pageSize,
                    name: debouncedSearch,
                    team: selectedTeam,
                    position: selectedPosition
                });

                setPlayers(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? 0);
            } catch (err) {
                console.error(err);
                setError("Could not load player data.");
            } finally {
                setLoading(false);
            }
        }

        loadPlayersPage();
    }, [
        currentPage,
        pageSize,
        debouncedSearch,
        selectedTeam,
        selectedPosition
    ]);

    const teams = useMemo(() => {
        return [...new Set(allPlayers.map((player) => player.team))]
            .filter(Boolean)
            .sort();
    }, [allPlayers]);

    const firstResult =
        totalElements === 0
            ? 0
            : currentPage * pageSize + 1;

    const lastResult = Math.min(
        (currentPage + 1) * pageSize,
        totalElements
    );


    if (error) {
        return <div className="message error">{error}</div>;
    }

    return (
        <main className="page">
            <header className="hero">
                <div>
                    <p className="eyebrow">Premier League database</p>
                    <h1>Premier Zone</h1>
                    <p className="subtitle">
                        Search and compare Premier League players.
                    </p>
                </div>

                <span className="player-count">
    {totalElements} {totalElements === 1 ? "player" : "players"}
</span>
            </header>

            {squadMessage && (
                <div className={`squad-message ${messageType}`}>
                    {squadMessage}
                </div>
            )}

            <section className="filters">
                <input
                    type="search"
                    placeholder="Search player..."
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(0);
                    }}
                />

                <select
                    value={selectedTeam}
                    onChange={(event) => {
                        setSelectedTeam(event.target.value);
                        setCurrentPage(0);
                    }}
                >
                    <option value="All">All teams</option>

                    {teams.map((team) => (
                        <option key={team} value={team}>
                            {team}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedPosition}
                    onChange={(event) => {
                        setSelectedPosition(event.target.value);
                        setCurrentPage(0);
                    }}
                >
                    <option value="All">All positions</option>
                    <option value="GK">Goalkeepers</option>
                    <option value="DF">Defenders</option>
                    <option value="MF">Midfielders</option>
                    <option value="FW">Forwards</option>
                </select>
            </section>

            {loading && (
                <div className="pagination-loading">
                    Loading players...
                </div>
            )}

            {!loading && totalElements > 0 && (
                <div className="results-information">
                    Showing {firstResult}–{lastResult} of{" "}
                    {totalElements}{" "}
                    {totalElements === 1 ? "player" : "players"}
                </div>
            )}

            <section
                className={`player-grid ${loading ? "is-loading" : ""}`}
            >
                {players.map((player) => (
                    <PlayerCard
                        key={player.name}
                        player={player}
                        onAddFantasyPlayer={onAddFantasyPlayer}
                        isSelected={fantasyPlayers.some(
                            (selectedPlayer) =>
                                selectedPlayer.name === player.name
                        )}
                    />
                ))}
            </section>

            {totalPages > 1 && (
                <nav
                    className="pagination"
                    aria-label="Player pagination"
                >
                    <button
                        type="button"
                        disabled={currentPage === 0 || loading}
                        onClick={() => {
                            setCurrentPage((page) => page - 1);
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                        }}
                    >
                        ← Previous
                    </button>

                    <span>
            Page {currentPage + 1} of {totalPages}
        </span>

                    <button
                        type="button"
                        disabled={
                            currentPage >= totalPages - 1 ||
                            loading
                        }
                        onClick={() => {
                            setCurrentPage((page) => page + 1);
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                        }}
                    >
                        Next →
                    </button>
                </nav>
            )}

            {players.length === 0 && !loading && (
                <p className="empty-message">
                    No players match your filters.
                </p>
            )}
        </main>
    );
}

export default PlayersPage;