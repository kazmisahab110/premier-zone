import { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import PlayersPage from "./pages/PlayersPage";
import PlayerDetailsPage from "./pages/PlayerDetailsPage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import FantasyTeamPage from "./pages/FantasyTeamPage";
import ComparePage from "./pages/ComparePage";

function getPrimaryPosition(player) {
    return player.pos?.split(",")[0].trim();
}

const positionLimits = {
    GK: 2,
    DF: 5,
    MF: 5,
    FW: 3,
};



function App() {
    const [fantasyPlayers, setFantasyPlayers] = useState(() => {
        try {
            const savedSquad = localStorage.getItem("fantasySquad");

            return savedSquad ? JSON.parse(savedSquad) : [];
        } catch (error) {
            console.error("Could not load fantasy squad:", error);
            return [];
        }
    });
    const [squadMessage, setSquadMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        try {
            localStorage.setItem(
                "fantasySquad",
                JSON.stringify(fantasyPlayers)
            );
        } catch (error) {
            console.error("Could not save fantasy squad:", error);
        }
    }, [fantasyPlayers]);

    useEffect(() => {

        if (!squadMessage) return;

        const timer = setTimeout(() => {
            setSquadMessage("");
        }, 3000);

        return () => clearTimeout(timer);

    }, [squadMessage]);

    function addFantasyPlayer(player, selectedPosition) {
        const alreadySelected = fantasyPlayers.some(
            (selectedPlayer) => selectedPlayer.name === player.name
        );

        if (alreadySelected) {
            return;
        }

        if (fantasyPlayers.length >= 15) {
            setMessageType("error");
            setSquadMessage("Your fantasy squad can only contain 15 players.");
            return;
        }

        const primaryPosition =
            selectedPosition || getPrimaryPosition(player);

        if (!primaryPosition || !positionLimits[primaryPosition]) {
            setMessageType("error");
            setSquadMessage("This player does not have a valid fantasy position.");
            return;
        }

        const selectedAtPosition = fantasyPlayers.filter(
            (selectedPlayer) =>
                selectedPlayer.selectedPosition === primaryPosition
        ).length;

        if (selectedAtPosition >= positionLimits[primaryPosition]) {
            setMessageType("error");
            setSquadMessage(
                `You can only select ${positionLimits[primaryPosition]} ${primaryPosition} players.`
            );
            return;
        }

        const playersFromClub = fantasyPlayers.filter(
            (selectedPlayer) => selectedPlayer.team === player.team
        ).length;

        if (playersFromClub >= 3) {
            setMessageType("error");
            setSquadMessage("Maximum of 3 players from one club.");
            return;
        }

        setFantasyPlayers((currentPlayers) => [
            ...currentPlayers,
            {
                ...player,
                selectedPosition: primaryPosition,
            },
        ]);

        setMessageType("success");

        setSquadMessage(
            `${player.name} added as ${primaryPosition}.`
        );
    }

    function removeFantasyPlayer(playerName) {

        setFantasyPlayers((currentPlayers) =>
            currentPlayers.filter(
                (player) => player.name !== playerName
            )
        );

        setMessageType("success");

        setSquadMessage(
            `${playerName} removed from your squad.`
        );

    }

    function clearFantasySquad() {
        setFantasyPlayers([]);
        setMessageType("success");
        setSquadMessage("Your fantasy squad has been cleared.");
    }

    return (
        <BrowserRouter>
            <Navbar fantasyCount={fantasyPlayers.length} />

            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/players"
                    element={
                        <PlayersPage
                            fantasyPlayers={fantasyPlayers}
                            onAddFantasyPlayer={addFantasyPlayer}
                            squadMessage={squadMessage}
                            messageType={messageType}
                        />
                    }
                />

                <Route
                    path="/players/:name"
                    element={<PlayerDetailsPage />}
                />

                <Route path="/compare" element={<ComparePage />} />

                <Route path="/teams" element={<TeamsPage />} />

                <Route
                    path="/teams/:teamName"
                    element={<TeamDetailsPage />}
                />

                <Route
                    path="/fantasy"
                    element={
                        <FantasyTeamPage
                            fantasyPlayers={fantasyPlayers}
                            onRemoveFantasyPlayer={removeFantasyPlayer}
                            onClearFantasySquad={clearFantasySquad}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;