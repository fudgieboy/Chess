ChessRTS.com

Multiplayer chess nodejs on AWS EC2 instance. 

Chess without turns designed in such a way that the grid can be expanded to 80 x 80, with multiple teams, and multiple players on each team, and pieces that can move freely with either cooldowns for the player, or cooldowns for the piece or both

Pinning works,
En croissant works,
Moving into a pinned position and blocking check works,
Blocking invalid moves works,
Double Check works (revealed attack that exposes king to two checks and forces a move)
Preventing pieces from blocking double check works

TODO: use bitflags for space occupancy
      king attacks aren't factored into checkmate yet
      broke castling
      program a bot by getting the next board state and calculating values of pieces
      
