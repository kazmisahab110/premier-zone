package com.pl.premier_zone.fantasy;

import com.pl.premier_zone.fantasy.dto.SquadPlayerRequest;
import com.pl.premier_zone.fantasy.dto.SquadPlayerResponse;
import com.pl.premier_zone.player.PlayerRepository;
import com.pl.premier_zone.user.AppUser;
import com.pl.premier_zone.user.AppUserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class FantasySquadService {

    private static final int MAX_SQUAD_SIZE = 15;

    private static final Set<String> ALLOWED_POSITIONS =
            Set.of("GK", "DF", "MF", "FW");

    private final FantasySelectionRepository fantasySelectionRepository;
    private final AppUserRepository appUserRepository;
    private final PlayerRepository playerRepository;

    public FantasySquadService(
            FantasySelectionRepository fantasySelectionRepository,
            AppUserRepository appUserRepository,
            PlayerRepository playerRepository
    ) {
        this.fantasySelectionRepository = fantasySelectionRepository;
        this.appUserRepository = appUserRepository;
        this.playerRepository = playerRepository;
    }

    @Transactional(readOnly = true)
    public List<SquadPlayerResponse> getSquad(String email) {
        AppUser user = findUser(email);

        return fantasySelectionRepository
                .findAllByUserIdOrderByAddedAtAsc(user.getId())
                .stream()
                .map(selection -> new SquadPlayerResponse(
                        selection.getPlayerName(),
                        selection.getAssignedPosition()
                ))
                .toList();
    }

    @Transactional
    public List<SquadPlayerResponse> replaceSquad(
            String email,
            List<SquadPlayerRequest> requests
    ) {
        AppUser user = findUser(email);

        validateSquad(requests);

        fantasySelectionRepository.deleteAllForUser(user.getId());
        fantasySelectionRepository.flush();

        List<FantasySelection> selections = requests
                .stream()
                .map(request -> new FantasySelection(
                        user,
                        request.getPlayerName().trim(),
                        normalizePosition(request.getAssignedPosition())
                ))
                .toList();

        fantasySelectionRepository.saveAll(selections);

        return selections
                .stream()
                .map(selection -> new SquadPlayerResponse(
                        selection.getPlayerName(),
                        selection.getAssignedPosition()
                ))
                .toList();
    }

    @Transactional
    public void clearSquad(String email) {
        AppUser user = findUser(email);
        fantasySelectionRepository.deleteAllForUser(user.getId());
        fantasySelectionRepository.flush();
    }

    private AppUser findUser(String email) {
        return appUserRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User account was not found."
                        )
                );
    }

    private void validateSquad(List<SquadPlayerRequest> requests) {
        if (requests == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Squad is required."
            );
        }

        if (requests.size() > MAX_SQUAD_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A fantasy squad cannot contain more than 15 players."
            );
        }

        Set<String> playerNames = new HashSet<>();

        for (SquadPlayerRequest request : requests) {
            if (
                    request == null ||
                            request.getPlayerName() == null ||
                            request.getPlayerName().isBlank()
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Every squad player must have a valid name."
                );
            }

            String playerName = request.getPlayerName().trim();

            if (!playerNames.add(playerName.toLowerCase())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A player cannot appear in the squad more than once."
                );
            }

            if (!playerRepository.existsById(playerName)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Player does not exist: " + playerName
                );
            }

            normalizePosition(request.getAssignedPosition());
        }
    }

    private String normalizePosition(String position) {
        if (position == null || position.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Every player must have an assigned position."
            );
        }

        String normalized = position.trim().toUpperCase();

        if (!ALLOWED_POSITIONS.contains(normalized)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Position must be GK, DF, MF, or FW."
            );
        }

        return normalized;
    }
}