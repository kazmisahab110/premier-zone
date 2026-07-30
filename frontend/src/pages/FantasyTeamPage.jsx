function getPrimaryPosition(player) {
    return player.pos?.split(",")[0].trim();
}


function FantasyTeamPage({
                             fantasyPlayers,
                             onRemoveFantasyPlayer,
                             onClearFantasySquad
                         }) {
    const goalkeepers = fantasyPlayers.filter(
        (player) => player.selectedPosition === "GK"
    );

    const defenders = fantasyPlayers.filter(
        (player) => player.selectedPosition === "DF"
    );

    const midfielders = fantasyPlayers.filter(
        (player) => player.selectedPosition === "MF"
    );

    const forwards = fantasyPlayers.filter(
        (player) => player.selectedPosition === "FW"
    );

    const squadLimits = {
        GK: 2,
        DF: 5,
        MF: 5,
        FW: 3
    };

    const squadProgress = [
        {
            label: "Goalkeepers",
            code: "GK",
            current: goalkeepers.length
        },
        {
            label: "Defenders",
            code: "DF",
            current: defenders.length
        },
        {
            label: "Midfielders",
            code: "MF",
            current: midfielders.length
        },
        {
            label: "Forwards",
            code: "FW",
            current: forwards.length
        }
    ];

    const totalGoals = fantasyPlayers.reduce(
        (sum, player) => sum + (player.gls ?? 0),
        0
    );

    const totalAssists = fantasyPlayers.reduce(
        (sum, player) => sum + (player.ast ?? 0),
        0
    );

    function renderPositionGroup(title, players) {
        return (
            <section className="fantasy-position-group">
                <h2>
                    {title} <span>{players.length}</span>
                </h2>

                <div className="fantasy-player-grid">
                    {players.map((player) => (
                        <article
                            className="fantasy-player-card"
                            key={player.name}
                        >
                            <div>
                                <strong>{player.name}</strong>
                                <span>{player.team}</span>
                                <span>Playing as: {player.selectedPosition}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => onRemoveFantasyPlayer(player.name)}
                            >
                                Remove
                            </button>
                        </article>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <main className="page">
            <header className="page-heading">
                <div>
                    <p className="eyebrow">Fantasy manager</p>
                    <h1>Your Squad</h1>
                    <p>Select up to 15 Premier League players.</p>
                </div>


                <div className="fantasy-heading-actions">
        <span className="player-count">
            {fantasyPlayers.length}/15 players
        </span>

                    {fantasyPlayers.length > 0 && (
                        <button
                            type="button"
                            className="clear-squad-button"
                            onClick={onClearFantasySquad}
                        >
                            Clear Squad
                        </button>
                    )}
                </div>
            </header>

            <section className="fantasy-summary">
                <div>
                    <strong>{fantasyPlayers.length}</strong>
                    <span>Selected players</span>
                </div>

                <div>
                    <strong>{totalGoals}</strong>
                    <span>Total goals</span>
                </div>

                <div>
                    <strong>{totalAssists}</strong>
                    <span>Total assists</span>
                </div>
            </section>

            <section className="squad-progress">
                {squadProgress.map((position) => {
                    const limit = squadLimits[position.code];
                    const percentage = (position.current / limit) * 100;
                    const isComplete = position.current === limit;

                    return (
                        <div
                            className={`progress-card ${isComplete ? "complete" : ""}`}
                            key={position.code}
                        >
                            <div className="progress-heading">
                                <span>{position.label}</span>
                                <strong>
                                    {position.current}/{limit}
                                </strong>
                            </div>

                            <div className="progress-track">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(percentage, 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </section>

            {fantasyPlayers.length === 0 ? (
                <section className="fantasy-empty">
                    <h2>Your squad is empty</h2>
                    <p>
                        Go to the Players page and add players to your
                        fantasy team.
                    </p>
                </section>
            ) : (
                <>
                    {renderPositionGroup(
                        "Goalkeepers",
                        goalkeepers
                    )}

                    {renderPositionGroup(
                        "Defenders",
                        defenders
                    )}

                    {renderPositionGroup(
                        "Midfielders",
                        midfielders
                    )}

                    {renderPositionGroup(
                        "Forwards",
                        forwards
                    )}
                </>
            )}
        </main>
    );
}

export default FantasyTeamPage;