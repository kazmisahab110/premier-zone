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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import ProtectedRoute from "./auth/ProtectedRoute";

import { useAuth } from "./auth/AuthContext";
import {
    getSavedFantasySquad,
    saveFantasySquad,
    clearSavedFantasySquad
} from "./api/fantasyApi";

import { getAllPlayers } from "./api/playerApi";


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

    const { isAuthenticated, authLoading } = useAuth();
    const [squadSyncing, setSquadSyncing] = useState(false);
    const [squadHydrated, setSquadHydrated] = useState(false);

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
        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {
            setSquadHydrated(false);
            return;
        }

        let cancelled = false;

        async function loadSavedSquad() {
            try {
                setSquadSyncing(true);
                setSquadHydrated(false);

                const [
                    savedSelections,
                    allPlayers
                ] = await Promise.all([
                    getSavedFantasySquad(),
                    getAllPlayers()
                ]);

                if (cancelled) {
                    return;
                }

                const playersByName = new Map(
                    allPlayers.map((player) => [
                        player.name,
                        player
                    ])
                );

                const hydratedPlayers = savedSelections
                    .map((selection) => {
                        const fullPlayer = playersByName.get(
                            selection.playerName
                        );

                        if (!fullPlayer) {
                            console.warn(
                                `Saved player was not found: ${selection.playerName}`
                            );

                            return null;
                        }

                        return {
                            ...fullPlayer,
                            selectedPosition:
                            selection.assignedPosition
                        };
                    })
                    .filter(Boolean);

                setFantasyPlayers(hydratedPlayers);

                console.log(
                    "Hydrated fantasy squad:",
                    hydratedPlayers
                );
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Could not load saved squad:",
                        error
                    );

                    setMessageType("error");
                    setSquadMessage(
                        "Your saved fantasy squad could not be loaded."
                    );
                }
            } finally {
                if (!cancelled) {
                    setSquadSyncing(false);
                    setSquadHydrated(true);
                }
            }
        }

        loadSavedSquad();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, authLoading]);

    useEffect(() => {

        if (!squadMessage) return;

        const timer = setTimeout(() => {
            setSquadMessage("");
        }, 3000);

        return () => clearTimeout(timer);

    }, [squadMessage]);

    async function persistFantasyTeam(updatedPlayers) {
        if (!isAuthenticated || !squadHydrated) {
            return;
        }

        try {
            setSquadSyncing(true);
            await saveFantasySquad(updatedPlayers);
        } catch (error) {
            console.error(
                "Unable to save fantasy squad:",
                error
            );

            setMessageType("error");
            setSquadMessage(
                "Your squad changed locally, but it could not be saved."
            );
        } finally {
            setSquadSyncing(false);
        }
    }

    function addFantasyPlayer(player, selectedPosition) {
        if (
            isAuthenticated &&
            (!squadHydrated || squadSyncing)
        ) {
            setMessageType("error");
            setSquadMessage(
                "Please wait while your saved squad loads."
            );
            return;
        }


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

        const updatedPlayers = [
            ...fantasyPlayers,
            {
                ...player,
                selectedPosition: primaryPosition,
            },
        ];

        setFantasyPlayers(updatedPlayers);
        persistFantasyTeam(updatedPlayers);

        setMessageType("success");

        setSquadMessage(
            `${player.name} added as ${primaryPosition}.`
        );
    }

    function removeFantasyPlayer(playerName) {
        const updatedPlayers = fantasyPlayers.filter(
            (player) => player.name !== playerName
        );

        setFantasyPlayers(updatedPlayers);
        persistFantasyTeam(updatedPlayers);

        setMessageType("success");
        setSquadMessage(
            `${playerName} removed from your squad.`
        );
    }

    async function clearFantasySquad() {
        setFantasyPlayers([]);

        if (isAuthenticated) {
            try {
                setSquadSyncing(true);
                await clearSavedFantasySquad();
            } catch (error) {
                console.error(
                    "Unable to clear saved fantasy squad:",
                    error
                );

                setMessageType("error");
                setSquadMessage(
                    "The local squad was cleared, but the saved squad could not be cleared."
                );

                return;
            } finally {
                setSquadSyncing(false);
            }
        }

        setMessageType("success");
        setSquadMessage(
            "Your fantasy squad has been cleared."
        );
    }

    return (
        <BrowserRouter>
            <Navbar fantasyCount={fantasyPlayers.length} />

            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <AccountPage />
                        </ProtectedRoute>
                    }
                />

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