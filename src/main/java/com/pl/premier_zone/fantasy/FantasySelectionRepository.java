package com.pl.premier_zone.fantasy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FantasySelectionRepository
        extends JpaRepository<FantasySelection, Long> {

    List<FantasySelection> findAllByUserIdOrderByAddedAtAsc(Long userId);

    @Modifying
    @Query("""
            DELETE FROM FantasySelection selection
            WHERE selection.user.id = :userId
            """)
    void deleteAllForUser(@Param("userId") Long userId);
}