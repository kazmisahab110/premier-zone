import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/player";

export async function getAllPlayers() {
    const response = await axios.get(API_URL);
    return response.data;
}

export async function getPlayerByName(name) {
    const response = await axios.get(
        `http://localhost:8080/api/v1/player?name=${encodeURIComponent(name)}`
    );

    return response.data;
}

export async function getTeams() {
    const response = await axios.get(
        "http://localhost:8080/api/v1/player/teams"
    );

    return response.data;
}

export async function getPlayersByTeam(teamName) {
    const response = await axios.get(
        `http://localhost:8080/api/v1/player?team=${teamName}`
    );

    return response.data;
}

export async function getPlayersPage({
                                         page = 0,
                                         size = 24,
                                         name = "",
                                         team = "All",
                                         position = "All"
                                     }) {
    const response = await axios.get(
        "http://localhost:8080/api/v1/player/paged",
        {
            params: {
                page,
                size,

                // Do not send empty filters
                name: name.trim() || undefined,

                team:
                    team === "All"
                        ? undefined
                        : team,

                position:
                    position === "All"
                        ? undefined
                        : position
            }
        }
    );

    return response.data;
}