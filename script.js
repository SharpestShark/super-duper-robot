var player, tree, rock;
var obstacles = {
	"tree": {
		"width": "15",
		"height": "15",
		"color": "#030303",
		"x": "40",
		"y": "20"
	},
	"rock": {
		"width": "15",
		"height": "15",
		"color": "#ffffff",
		"x": "20",
		"y": "40"
	}
};


function start() {
  scene.start();
  player = new component(30, 30, "red", 10, 120);
  for (let object of obstacles) {
    var background = {
      tree: new component(object.tree.width,object.tree.height,object.tree.color,object.tree.x,object.tree.y),
      rock: new component(object.rock.width,object.rock.height,object.rock.color,object.rock.x,object.rock.y)
    }
  }
  tree = background.tree;
  rock = background.rock;
}

var scene = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 800;
    this.canvas.height = 1000;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateScene, 20);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y; 
  this.update = function(){
    ctx = scene.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function updateScene() {
  scene.clear();
  player.x += 1;
  player.update();
}
