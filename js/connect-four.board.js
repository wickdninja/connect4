//
// Define Token Object
//
ConnectFour.classes.Token = function(currentPlayer) {
  'use strict';
  this.player = currentPlayer.id;
};

//
// Define the board object.
//
ConnectFour.board = {
  columns: 7,
  rows: 6,
  board: [],
  player1span: {},
  player2span: {},
  tdwidth: 50,
  tdheight: 50,
  clickable: false,
  totalPlays: 0,

  addToken: function(column) {
    'use strict';

    var winningMove, lastMove;
    winningMove = lastMove = false;
    ConnectFour.board.clickable = false;

    //Is this column full?
    if (ConnectFour.board.columnIsFull(column)) {
      //The column was full.
      if (ConnectFour.players.currentPlayer.type === 1) {
        alert('This column is full, try another column.');
      }

      setTimeout(function() {
        ConnectFour.players.currentPlayer.makeMove();
      }, 1);
      return -1;
    }

    winningMove = ConnectFour.board.isWinningMove(column) ? true : false;
    console.log(
      'Adding token to: (' +
        column +
        ', ' +
        ConnectFour.board.getOpenSpot(column) +
        ')'
    );

    ConnectFour.board.board[column][
      ConnectFour.board.getOpenSpot(column)
    ] = new ConnectFour.classes.Token(ConnectFour.players.currentPlayer);
    ConnectFour.board.redrawBoard();
    ConnectFour.board.totalPlays++;

    if (
      ConnectFour.board.totalPlays ===
      ConnectFour.board.rows * ConnectFour.board.columns
    ) {
      lastMove = true;
    }

    if (winningMove) {
      ConnectFour.board.gameWinner();
    } else if (lastMove) {
      ConnectFour.board.drawGame();
    } else {
      //Switch players and make move.
      ConnectFour.players.changeCurrentPlayer();
      setTimeout(function() {
        ConnectFour.players.currentPlayer.makeMove();
      }, 1);
    }
  },
  columnIsFull: function(column) {
    'use strict';

    var rtn;

    //Check if the column is full.
    if (ConnectFour.board.board[column][ConnectFour.board.rows - 1] === null) {
      rtn = false;
    } else {
      rtn = true;
    }

    return rtn;
  },
  gameWinner: function() {
    'use strict';

    var x,
      y,
      winner = ConnectFour.players.currentPlayer;

    for (x = 0; x < this.columns; x++) {
      for (y = 0; y < this.rows; y++) {
        if (
          this.board[x][y] !== null &&
          this.board[x][y].player !== winner.id
        ) {
          if (winner.id === 1) {
            document.getElementById(x + 'x' + y).style.background =
              "url('images/blackloss.jpg'";
            document.getElementById(x + 'x' + y).style.backgroundSize = '100%';
          } else {
            document.getElementById(x + 'x' + y).style.background =
              "url('images/redloss.jpg'";
            document.getElementById(x + 'x' + y).style.backgroundSize = '100%';
          }
        }
      }
    }

    if (winner.id === ConnectFour.players.player1.id) {
      ConnectFour.players.player1.wins++;
      document.getElementById('player1-wins').innerHTML =
        ConnectFour.players.player1.wins;
    } else {
      ConnectFour.players.player2.wins++;
      document.getElementById('player2-wins').innerHTML =
        ConnectFour.players.player2.wins;
    }

    alert(winner.name + ' has won the game!');

    if (confirm('Play again?')) {
      this.resetBoard();
    } else {
      alert('Thanks for playing.');
      ConnectFour.players.player1.wins = 0;
      ConnectFour.players.player2.wins = 0;
      ConnectFour.board.clickable = false;
    }

    //alert(ConnectFour.players.currentPlayer.name+' has won the game!');
  },
  getOpenSpot: function(column) {
    'use strict';

    var row = 0;

    while (
      ConnectFour.board.board[column][row] !== null &&
      row < ConnectFour.board.rows
    ) {
      row++;
    }

    if (row >= ConnectFour.board.rows) {
      return -1;
    }

    return row;
  },
  resetBoard: function() {
    'use strict';

    var x,
      y,
      tds,
      trs,
      clicky = function() {
        if (ConnectFour.board.clickable === true) {
          ConnectFour.board.addToken(this.column, this.row);
        }
      };

    ConnectFour.board.totalPlays = 0;

    // Nullout board.
    for (x = 0; x < ConnectFour.board.columns; x++) {
      ConnectFour.board.board[x] = [];

      for (y = 0; y < ConnectFour.board.rows; y++) {
        ConnectFour.board.board[x][y] = null;
      }
    }

    // Add event handlers
    trs = document.getElementById('connect-four').getElementsByTagName('tr');

    for (y = 0; y < trs.length; y++) {
      // Table row.
      trs[y].id = 'row-' + y;
      tds = document.getElementById('row-' + y).getElementsByTagName('td');

      for (x = 0; x < tds.length; x++) {
        tds[x].row = ConnectFour.board.rows - 1 - y;
        tds[x].column = x;
        tds[x].id = tds[x].column + 'x' + tds[x].row;
        tds[x].style.background = 'transparent';
        tds[x].style.height = ConnectFour.board.tdheight + 'px';
        tds[x].style.width = ConnectFour.board.tdwidth + 'px';
        tds[x].onclick = clicky;
      }
    }

    // Display the Players
    ConnectFour.board.showPlayers();

    //Reset Scores
    document.getElementById('player1-wins').innerHTML =
      ConnectFour.players.player1.wins;
    document.getElementById('player2-wins').innerHTML =
      ConnectFour.players.player2.wins;

    //Reset Turns
    ConnectFour.players.currentPlayer = ConnectFour.players.player1;
    document.getElementById('player1').className = 'turn';
    document.getElementById('player2').className = '';

    // After the board is setup check to see if the first player is a computer player.
    ConnectFour.players.currentPlayer = ConnectFour.players.player1;
    ConnectFour.players.currentPlayer.makeMove();
  },
  redrawBoard: function() {
    'use strict';

    var x, y;

    document.getElementById('center').style.width =
      ConnectFour.board.width + 'px';

    for (x = 0; x < this.columns; x++) {
      for (y = 0; y < this.rows; y++) {
        // Include the heights and widths.
        document.getElementById(x + 'x' + y).style.height = this.tdwidth + 'px';
        document.getElementById(x + 'x' + y).style.width = this.tdwidth + 'px';
        console.log(this.tdwidth);
        if (this.board[x][y] !== null) {
          if (this.board[x][y].player === 1) {
            document.getElementById(x + 'x' + y).style.background =
              'url("images/redtoken.jpg") no-repeat center center';
            document.getElementById(x + 'x' + y).style.backgroundSize = '100%';
          } else {
            document.getElementById(x + 'x' + y).style.background =
              'url("images/blacktoken.jpg") no-repeat center center';
            document.getElementById(x + 'x' + y).style.backgroundSize = '100%';
          }
        }
      }
    }
  },
  isWinningMove: function(column, player) {
    'use strict';

    var x, consecutive, row, winner, startrow, startcolumn, playerObject;

    playerObject = player || ConnectFour.players.currentPlayer;

    player = player ? player.id : ConnectFour.players.currentPlayer.id;
    row = ConnectFour.board.getOpenSpot(column);
    winner = false;

    if (row === -1) {
      return false;
    }

    //Set the spot to the player.
    ConnectFour.board.board[column][row] = new ConnectFour.classes.Token(
      playerObject
    );
    //horizontal check.
    consecutive = 0;

    for (x = 0; x < ConnectFour.board.columns; x++) {
      if (
        this.board[x][row] !== null &&
        this.board[x][row] !== null &&
        this.board[x][row].player === player
      ) {
        consecutive++;

        if (consecutive > 3) {
          winner = true;
        }
      } else {
        consecutive = 0;
      }
    }

    //Check vertical.
    consecutive = 0;

    for (x = 0; x < ConnectFour.board.rows; x++) {
      if (
        ConnectFour.board.board[column][x] !== null &&
        ConnectFour.board.board[column][x] !== null &&
        ConnectFour.board.board[column][x].player === player
      ) {
        consecutive++;

        if (consecutive > 3) {
          winner = true;
        }
      } else {
        consecutive = 0;
      }
    }

    //Check diaganolly
    startrow = row - column < 0 ? 0 : row - column;
    startcolumn = column - row < 0 ? 0 : column - row;
    consecutive = 0;

    for (
      x = startrow;
      x < ConnectFour.board.rows && startcolumn < ConnectFour.board.columns;
      x++
    ) {
      if (
        ConnectFour.board.board[startcolumn][x] !== null &&
        ConnectFour.board.board[startcolumn][x] !== null &&
        ConnectFour.board.board[startcolumn][x].player === player
      ) {
        consecutive++;

        if (consecutive > 3) {
          winner = true;
        }
      } else {
        consecutive = 0;
      }

      startcolumn++;
    }

    //Check diaganolly
    startrow =
      row + column >= ConnectFour.board.rows
        ? ConnectFour.board.rows - 1
        : row + column;
    startcolumn =
      column - (ConnectFour.board.rows - 1 - row) < 0
        ? 0
        : column - (ConnectFour.board.rows - 1 - row);
    consecutive = 0;

    for (x = startrow; x > -1 && startcolumn < ConnectFour.board.columns; x--) {
      if (
        ConnectFour.board.board[startcolumn][x] !== null &&
        ConnectFour.board.board[startcolumn][x] !== null &&
        ConnectFour.board.board[startcolumn][x].player === player
      ) {
        consecutive++;

        if (consecutive > 3) {
          winner = true;
        }
      } else {
        consecutive = 0;
      }

      startcolumn++;
    }

    //Reset the spot to null.
    if (row !== -1) {
      ConnectFour.board.board[column][row] = null;
    }

    return winner;
  },
  showPlayers: function() {
    'use strict';

    this.player1span = document.getElementById('player1');
    this.player2span = document.getElementById('player2');

    this.player1span.innerHTML = ConnectFour.players.player1.name;
    this.player2span.innerHTML = ConnectFour.players.player2.name;
  },
  drawGame: function() {
    'use strict';

    alert('This is a draw game.');

    if (confirm('Play again?')) {
      this.resetBoard();
    } else {
      alert('Thanks for playing.');
      ConnectFour.players.player1.wins = 0;
      ConnectFour.players.player2.wins = 0;
      ConnectFour.board.clickable = false;
    }
  }
};
