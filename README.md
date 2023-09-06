[ChessRTS.com](http://chessrts.com:8080/)

Multiplayer MERN app on AWS EC2 instance using the websockets library.

Chess without turns designed in such a way that the grid can be expanded to 80 x 80, with multiple teams, and multiple players on each team, and pieces that can move freely with either cooldowns for the player, or cooldowns for the piece or both.

I designed this in such a way that I could use the experience to understand how to make more complex games like an multiplayer sonic/metroid type thing in the browser and eventually practice machine learning

Pinning works,
En croissant works,
Moving into a pinned position and blocking check works,
Blocking invalid moves works,
Double Check works (revealed attack that exposes king to two checks and forces a move)
Preventing pieces from blocking double check works

TODO: use bitflags for board state
      king attacks aren't factored into checkmate yet
      broken castling
      program a bot by getting the next board state and calculating values of pieces
      
