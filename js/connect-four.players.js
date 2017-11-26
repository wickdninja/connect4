//
// Players Object
//

ConnectFour.players = {
  player1: {},
  player2: {},
  currentPlayer: {},
  automatedDelay: 500,

  getNewPlayerInfo: function() {
    'use strict';

    var obj_rtn;

    if (ConnectFour.players.player1.name === undefined) {
      obj_rtn = { id: 1, color: 'red' };
    } else {
      obj_rtn = { id: 2, color: 'black' };
    }

    return obj_rtn;
  },
  resetPlayers: function() {
    'use strict';

    ConnectFour.players.player1 = {};
    ConnectFour.players.player2 = {};
  },
  getPlayers: function() {
    'use strict';

    var name, playerOneType, playerTwoType;

    //Reset players.
    ConnectFour.players.resetPlayers();

    //
    // Get the player type for player 1.
    //
    playerOneType = document.getElementById('player1-type').value;
    playerTwoType = document.getElementById('player2-type').value;

    //
    // Player One Type
    //
    if (playerOneType === '1') {
      name = prompt('Enter your name: ');
      ConnectFour.players.player1 = new ConnectFour.classes.HumanPlayer(name);
    } else if (playerOneType === '2') {
      ConnectFour.players.player1 = new ConnectFour.classes.RandomPlayer(
        'Random Player'
      );
    } else {
      ConnectFour.players.player1 = new ConnectFour.classes.MyopicPlayer(
        'Myopic Player'
      );
    }

    //
    // Player Two Type
    //
    if (playerTwoType === '1') {
      name = prompt('Enter your name: ');
      ConnectFour.players.player2 = new ConnectFour.classes.HumanPlayer(name);
    } else if (playerTwoType === '2') {
      ConnectFour.players.player2 = new ConnectFour.classes.RandomPlayer(
        'Random Player'
      );
    } else {
      ConnectFour.players.player2 = new ConnectFour.classes.MyopicPlayer(
        'Myopic Player'
      );
    }

    if (
      ConnectFour.players.player1.type !== 1 &&
      ConnectFour.players.player2.type !== 1
    ) {
      ConnectFour.players.automatedDelay = 100;
    }

    //
    // Set the current player.
    //
    ConnectFour.players.currentPlayer = ConnectFour.players.player1;
  }, //end constructPlayer

  changeCurrentPlayer: function() {
    'use strict';

    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
      ConnectFour.board.player2span.className = 'turn';
      ConnectFour.board.player1span.className = '';
    } else {
      this.currentPlayer = this.player1;
      ConnectFour.board.player1span.className = 'turn';
      ConnectFour.board.player2span.className = '';
    }
  }
};

//
// Default Player Class
//
ConnectFour.classes.Player = function(name) {
  'use strict';

  this.name = name || 'Player';
  this.wins = 0;
  this.id = 0;
  this.color = 'red';
  this.type = 1;

  //
  // Called to initiate the player move.
  //
  this.makeMove = function() {
    alert('No valid makeMove function.');
  };

  //
  // Get the players ID.
  //
  this.getId = function() {
    return this.name + ' (' + this.color + ')';
  };

  this.setPlayerInfo = function() {
    var obj_info = ConnectFour.players.getNewPlayerInfo();
    this.id = obj_info.id;
    this.color = obj_info.color;
  };

  this.setPlayerInfo();
};

//
// Human Player Class
//
ConnectFour.classes.HumanPlayer = function(name) {
  'use strict';

  //
  // Define Constructor
  //
  this.construct = function() {
    this.type = 1;
    ConnectFour.classes.Player.call(this, name);
  };

  //
  // Run Constructor
  //
  this.construct();

  this.makeMove = function() {
    ConnectFour.board.clickable = true;
  };
};

ConnectFour.classes.HumanPlayer.prototype = new ConnectFour.classes.Player();

//
// Player - Random Player
//
ConnectFour.classes.RandomPlayer = function(name) {
  'use strict';

  //
  // Define the construct of this funciton.
  //
  this.construct = function() {
    ConnectFour.classes.Player.call(this, name);
    this.type = 2;
  };

  //
  // Call the construct of this class.
  //
  this.construct();

  //
  // Make move for random computer player.
  //
  this.makeMove = function() {
    //
    // Generate a random number that falls within the number of colums.
    //
    var column = Math.floor(Math.random() * ConnectFour.board.columns);

    setTimeout(function() {
      ConnectFour.board.addToken(column, 0);
    }, ConnectFour.players.automatedDelay);
  };
};

ConnectFour.classes.RandomPlayer.prototype = new ConnectFour.classes.Player();

//
// Player - Myopic Player
//
ConnectFour.classes.MyopicPlayer = function(name) {
  'use strict';

  //
  // Define the construct of this function.
  //
  this.construct = function() {
    ConnectFour.classes.Player.call(this, name);
    this.type = 3;
  };

  //
  // Call the construct of this class.
  //
  this.construct();

  //
  // Make move for random computer player.
  //
  this.makeMove = function() {
    var x,
      opposer,
      addTokenFn,
      column = Math.floor(Math.random() * ConnectFour.board.columns),
      row = 0;
    opposer =
      ConnectFour.players.player1 === this
        ? ConnectFour.players.player2
        : ConnectFour.players.player1;
    addTokenFn = function() {
      ConnectFour.board.addToken(x, row);
    };

    //Get jslint off my back.
    column++;
    column--;

    //Can I win?
    for (x = 0; x < ConnectFour.board.columns - 1; x++) {
      if (ConnectFour.board.isWinningMove(x)) {
        console.log('Found winning move!: ' + x + ' row: ' + row);

        setTimeout(
          'ConnectFour.board.addToken(' + x + ',' + row + ')',
          ConnectFour.players.automatedDelay
        );
        return 0;
      }
    }

    //Can they win?
    for (x = 0; x < ConnectFour.board.columns - 1; x++) {
      if (ConnectFour.board.isWinningMove(x, opposer)) {
        console.log('Found winning move!: ' + x + ' row: ' + row);

        setTimeout(
          'ConnectFour.board.addToken(' + x + ',' + row + ')',
          ConnectFour.players.automatedDelay
        );
        return 0;
      }
    }
    setTimeout(
      'ConnectFour.board.addToken(' + column + ',' + row + ')',
      ConnectFour.players.automatedDelay
    );
  };
};

ConnectFour.classes.MyopicPlayer.prototype = new ConnectFour.classes.Player();
