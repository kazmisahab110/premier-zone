import apiClient from "./apiClient";

export async function getAllPlayers() {
    const response = await apiClient.get("/api/v1/player");
    return response.data;
}

export async function getPlayerByName(name) {
    const response = await apiClient.get("/api/v1/player", {
        params: { name }
    });

    return response.data;
}

export async function getTeams() {
    const response = await apiClient.get("/api/v1/player/teams");
    return response.data;
}

export async function getPlayersByTeam(teamName) {
    const response = await apiClient.get("/api/v1/player", {
        params: {
            team: teamName
        }
    });

    return response.data;
}

export async function getPlayersPage(
    page = 0,
    size = 24,
    search = "",
    team = "",
    position = ""
) {
    const response = await apiClient.get("/api/v1/player/paged", {
        params: {
            page,
            size,
            search,
            team,
            position
        }
    });

    return response.data;
}