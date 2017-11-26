ConnectFour.utilities = {
  getWindowSize: function() {
    'use strict';

    var winW = 630,
      winH = 460;

    console.log('Retreiving Window Size');

    if (document.body && document.body.offsetWidth) {
      winW = document.body.offsetWidth;
      winH = document.body.offsetHeight;
    }

    if (
      document.compatMode === 'CSS1Compat' &&
      document.documentElement &&
      document.documentElement.offsetWidth
    ) {
      winW = document.documentElement.offsetWidth;
      winH = document.documentElement.offsetHeight;
    }

    if (window.innerWidth && window.innerHeight) {
      winW = window.innerWidth;
      winH = window.innerHeight;
    }

    console.log('Window width = ' + winW);
    console.log('Window height = ' + winH);

    return { width: winW, height: winH };
  }, //Get window size

  resize: function() {
    'use strict';

    var dimensions = ConnectFour.utilities.getWindowSize(),
      tdwidth = 0;
    console.log('Resizing window.');

    //
    // Leave some padding.
    //
    dimensions.width =
      dimensions.height < dimensions.width
        ? dimensions.height - 100
        : dimensions.width - 100;
    tdwidth = dimensions.width / 7;

    console.log('Resize tds to: ' + tdwidth);

    ConnectFour.board.tdwidth = tdwidth;
    ConnectFour.board.tdheight = tdwidth;
    ConnectFour.board.width = (tdwidth + 4) * ConnectFour.board.columns;

    ConnectFour.board.redrawBoard();
  }, //end of resize

  startup: function() {
    'use strict';

    window.onresize = ConnectFour.utilities.resize;

    //
    // Handle logs.
    //
    if (ConnectFour.debug === 0) {
      console.log = function() {};
    }

    //
    // Resize the board.
    //
    this.resize();
  }
};
