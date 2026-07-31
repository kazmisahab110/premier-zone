package com.pl.premier_zone.fantasy;

import com.pl.premier_zone.fantasy.dto.SquadPlayerRequest;
import com.pl.premier_zone.fantasy.dto.SquadPlayerResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fantasy-squad")
public class FantasySquadController {

    private final FantasySquadService fantasySquadService;

    public FantasySquadController(
            FantasySquadService fantasySquadService
    ) {
        this.fantasySquadService = fantasySquadService;
    }

    @GetMapping
    public List<SquadPlayerResponse> getSquad(
            Authentication authentication
    ) {
        return fantasySquadService.getSquad(
                authentication.getName()
        );
    }

    @PutMapping
    public List<SquadPlayerResponse> replaceSquad(
            Authentication authentication,
            @RequestBody List<SquadPlayerRequest> requests
    ) {
        return fantasySquadService.replaceSquad(
                authentication.getName(),
                requests
        );
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearSquad(Authentication authentication) {
        fantasySquadService.clearSquad(
                authentication.getName()
        );
    }
}