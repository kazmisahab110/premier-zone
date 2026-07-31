package com.pl.premier_zone.fantasy;

import com.pl.premier_zone.user.AppUser;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(
        name = "fantasy_selections",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_fantasy_user_player",
                        columnNames = {"user_id", "player_name"}
                )
        }
)
public class FantasySelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private AppUser user;

    @Column(
            name = "player_name",
            nullable = false,
            length = 150
    )
    private String playerName;

    @Column(
            name = "assigned_position",
            nullable = false,
            length = 10
    )
    private String assignedPosition;

    @Column(
            name = "added_at",
            nullable = false,
            updatable = false
    )
    private Instant addedAt;

    public FantasySelection() {
    }

    public FantasySelection(
            AppUser user,
            String playerName,
            String assignedPosition
    ) {
        this.user = user;
        this.playerName = playerName;
        this.assignedPosition = assignedPosition;
    }

    @PrePersist
    public void setCreationTime() {
        if (addedAt == null) {
            addedAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
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

    public Instant getAddedAt() {
        return addedAt;
    }
}