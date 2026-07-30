import { useState } from "react";
import { Link } from "react-router-dom";

function PlayerCard({
                        player,
                        onAddFantasyPlayer,
                        isSelected
                    }) {
    const availablePositions =
        player.pos?.split(",").map((position) => position.trim()) ?? [];

    const [selectedPosition, setSelectedPosition] = useState(
        availablePositions[0] ?? ""
    );

    return (
        <Link
            to={`/players/${encodeURIComponent(player.name)}`}
            className="player-card-link"
        >
            <article className="player-card">
                <div className="card-top">
          <span className="position">
            {player.pos || "N/A"}
          </span>

                    <span className="nation">
            {player.nation || "Unknown"}
          </span>
                </div>

                <h2>{player.name}</h2>
                <p className="team">{player.team}</p>

                <div className="stats">
                    <div>
                        <strong>{player.mp ?? 0}</strong>
                        <span>Matches</span>
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
                        <strong>{player.xg ?? 0}</strong>
                        <span>xG</span>
                    </div>
                </div>

                {onAddFantasyPlayer && (
                    <>
                        {availablePositions.length > 1 && (
                            <select
                                className="position-select"
                                value={selectedPosition}
                                onClick={(event) => event.preventDefault()}
                                onChange={(event) => {
                                    event.preventDefault();
                                    setSelectedPosition(event.target.value);
                                }}
                            >
                                {availablePositions.map((position) => (
                                    <option key={position} value={position}>
                                        Play as {position}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            type="button"
                            className="fantasy-add-button"
                            disabled={isSelected}
                            onClick={(event) => {
                                event.preventDefault();
                                onAddFantasyPlayer(player, selectedPosition);
                            }}
                        >
                            {isSelected
                                ? "Selected"
                                : "Add to Fantasy Team"}
                        </button>
                    </>
                )}
            </article>
        </Link>
    );
}

export default PlayerCard;