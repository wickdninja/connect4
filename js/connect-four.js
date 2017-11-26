var ConnectFour = {};
ConnectFour.classes = {};
ConnectFour.debug = 0;

ConnectFour.start = function() {
  'use strict';

  ConnectFour.players.getPlayers();
  ConnectFour.board.resetBoard();
  ConnectFour.utilities.startup();
};
