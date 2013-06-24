(function () {
  var root = this;
  var window = root.window;
  var document = root.document;

  require = require || function (stuff, callback) {
    callback();
  };

  var MM = root.Melodicism = {};

  MM.init = function () {
    var canvas = document.getElementById('canvas');

    MM.Controller.init();
    MM.Canvas.init(canvas);
    MM.Audio.init();

    MM.Nodes.init();
    MM.Sounds.onload(MM.start);
    MM.Sounds.load();

    MM.Message.init();

    MM.puzzles = [];
    MM.loadPuzzle(0);
  };

  MM.start = function () {
    MM.Canvas.start()
    MM.Audio.start();
  };

  MM.loadPuzzle = function (number) {
    var name = MM.Puzzle.Config[number];

    require('puzzles/' + name, function () {
      MM.puzzle = MM.Puzzle.Puzzles[name].create();
      MM.puzzle.level = number;
    });
  };

  MM.loadNextPuzzle = function () {
    MM.loadPuzzle(MM.puzzle.level + 1);
  };

  require([
    'Util',
    'eventer',
    'controller',
    'canvas',
    'audio',
    'node',
    'sampler_node',
    'bounce_node',
    'drone_node',
    'nodes',
    'sounds',
    'message',
    'puzzle'
  ], MM.init);
}());

