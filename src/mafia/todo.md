- input is the number of mafia/town players to include in the game
- next we will create a personality for each player in parallel
- head to a router to determine if its night or day
- if its round 1, night the narrator will introduce the game
- there will be a subgraph for each phase

- night phase
- mafia will communicate with each other to decide who to kill
- they will vote for a player to kill
- voting will end when the mafia have reached a consensus

- the doctor will choose a target to save
- the detective will choose a target to investigate

- day phase
- the narrator will announce the results of the night phase
- the narrator will announce who was killed
- the narrator will announce who was saved
- all players will vote for a player to eliminate
- voting will end when the players have reached a consensus
- the player with the most votes will be eliminated
- the eliminated player will reveal their role
- we head to the next round

NOTE: where would i add the win checking logic?


voting flow

- randomly select a player to vote 
- check if there is a player with votes
- if there is a player, deicide if you want to vote for them or not
- if there is no player, decide who you want to vote for
- retry this process until everyone has voted