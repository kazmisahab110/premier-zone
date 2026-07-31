package com.pl.premier_zone.fantasy.dto;

public class SquadPlayerRequest {

    private String playerName;
    private String assignedPosition;

    public SquadPlayerRequest() {
    }

    public SquadPlayerRequest(
            String playerName,
            String assignedPosition
    ) {
        this.playerName = playerName;
        this.assignedPosition = assignedPosition;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getAssignedPosition() {
        return assignedPosition;
    }

    public void setAssignedPosition(String assignedPosition) {
        this.assignedPosition = assignedPosition;
    }
}