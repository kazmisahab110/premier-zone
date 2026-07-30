package com.pl.premier_zone.player;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
@RestController
@RequestMapping(path = "api/v1/player")
@CrossOrigin(origins = "http://localhost:5173")
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<Player> getPlayers(
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String nation){

        if (team != null && position != null){
            return playerService.getPlayersByTeamAndPosition(team, position);
        }
        else if (team != null){
            return playerService.getPlayersFromTeam(team);
        }
        else if (name != null){
            return playerService.getPlayersByName(name);
        }
        else if (position != null){
            return playerService.getPlayersByPos(position);
        }
        else if (nation != null){
            return playerService.getPlayersByNation(nation);
        }else {
            return playerService.getPlayers();
        }
    }

    @GetMapping("/paged")
    public Page<Player> getPlayersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) String position
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        return playerService.getPlayersPaged(
                safePage,
                safeSize,
                name,
                team,
                position
        );
    }



    @GetMapping("/teams")
    public List<String> getTeams() {
        return playerService.getTeams();
    }

    @PostMapping
    public ResponseEntity<Player> addPlayer(@RequestBody Player player){
        Player createdPlayer = playerService.addPlayer(player);
        return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
    }


    @PutMapping
    public ResponseEntity<Player> updatePlayer(@RequestBody Player player){
        Player resultPlayer = playerService.updatePlayer(player);
        if (resultPlayer != null){
            return new ResponseEntity<>(resultPlayer, HttpStatus.OK);
        }
        else  {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{playerName}")
    public ResponseEntity<String> deletePlayer(@PathVariable String playerName){
        playerService.deletePlayer(playerName);
        return new ResponseEntity<>("Player deleted successfully", HttpStatus.OK);
    }
}
