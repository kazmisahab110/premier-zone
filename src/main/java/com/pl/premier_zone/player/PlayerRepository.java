package com.pl.premier_zone.player;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, String> {

    void deleteByName(String playerName);

    Optional<Player> findByName(String name);

    @Query("SELECT p FROM Player p " +
            "WHERE (:name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:team = '' OR p.team = :team) " +
            "AND (:position = '' OR p.pos LIKE CONCAT('%', :position, '%'))")
    Page<Player> findPlayersPaged(
            @Param("name") String name,
            @Param("team") String team,
            @Param("position") String position,
            Pageable pageable
    );
}