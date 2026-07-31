import apiClient from "./apiClient";

export async function getSavedFantasySquad() {
    const response = await apiClient.get(
        "/fantasy-squad"
    );

    return response.data;
}

export async function saveFantasySquad(players) {
    const requestBody = players.map((player) => ({
        playerName: player.name,
        assignedPosition: player.selectedPosition
    }));

    const response = await apiClient.put(
        "/fantasy-squad",
        requestBody
    );

    return response.data;
}

export async function clearSavedFantasySquad() {
    await apiClient.delete(
        "/fantasy-squad"
    );
}