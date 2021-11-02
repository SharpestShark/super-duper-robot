var player, myObstacle, tree, rock, myUpBtn, myDownBtn, myLeftBtn, myRightBtn;
var myObstacles = [];
const obstacles = {
	"tree": {
		"width": "15",
		"height": "15",
		"color": "rgba(62, 128, 0, 0.5)",
		"x": "60",
		"y": "140"
	},
	"rock": {
		"width": "15",
		"height": "15",
		"color": "#131313",
		"x": "35",
		"y": "105"
	}
};
var background = {
	tree: new component(obstacles.tree.width,obstacles.tree.height,obstacles.tree.color,obstacles.tree.x,obstacles.tree.y),
	rock: new component(obstacles.rock.width,obstacles.rock.height,obstacles.rock.color,obstacles.rock.x,obstacles.rock.y),
}

function start() {
  player = new component(30, 30, "red", 10, 120);
  myObstacle = new component(10, 200, "green", 300, 120); 
  tree = background.tree;
  rock = background.rock;
	var x = 20;
	var y = 20;
	var m = 40;
  if (navigator.platform = 'iPad') {
      myUpBtn = new arrowBtn(x+m, y, 10);
      myDownBtn = new arrowBtn(x+m, y+(2*m), 10);
      myLeftBtn = new arrowBtn(x, y+m, 10);
      myRightBtn = new arrowBtn(x+(2*m), y+m, 10);
  }
  console.log(JSON.stringify(obstacles.tree));
  scene.start();
}

var scene = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 800;
    this.canvas.height = 1000;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateScene, 20);
    window.addEventListener('mousedown', function (e) {
      scene.x = e.pageX;
      scene.y = e.pageY;
    })
    window.addEventListener('mouseup', function (e) {
      scene.x = false;
      scene.y = false;
    })
    window.addEventListener('touchstart', function (e) {
      scene.x = e.pageX;
      scene.y = e.pageY;
    })
    window.addEventListener('touchend', function (e) {
      scene.x = false;
      scene.y = false;
    })
    window.addEventListener('keydown', function (e) {
      scene.keys = (scene.keys || []);
      scene.keys[e.keyCode] = true;
      console.log(e.keyCode);
    })
    window.addEventListener('keyup', function (e) {
      scene.keys[e.keyCode] = false;
    })
    window.addEventListener('touchmove', function (e) {
      scene.x = e.touches[0].screenX;
      scene.y = e.touches[0].screenY;
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

function everyinterval(n) {
  if ((scene.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y; 
  this.update = function(){
    ctx = scene.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.clicked = function() {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var clicked = true;
    if ((mybottom < scene.y) || (mytop > scene.y) || (myright < scene.x) || (myleft > scene.x)) {
      clicked = false;
    }
    return clicked;
  },
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

function arrowBtn(x,y,r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.update = function() {
    ctx = scene.context;
    ctx.beginPath();
    ctx.arc(x+r, y+r, r, Math.PI, 1.5 * Math.PI);
    ctx.lineTo(x+(3*r), y);
ctx.arc(x+(3*r), y+r, r,1.5 * Math.PI,0);
ctx.lineTo(x+(4*r),y+(3*r));
ctx.arc(x+(3*r), y+(3*r), r,0,.5 * Math.PI);
ctx.lineTo(x+r,y+(4*r));
ctx.arc(x+r, y+(3*r), r,.5 * Math.PI,Math.PI);
ctx.lineTo(x,y+r);
ctx.fillStyle = '#000';
ctx.fill();
ctx.beginPath();
//inner arrow
ctx.moveTo(x+r,y+r);
ctx.lineTo(x+(2*r),y+r);
ctx.lineTo(x+(3*r),y+(2*r));
ctx.lineTo(x+(2*r),y+(3*r));
ctx.lineTo(x+r,y+(3*r));
ctx.lineTo(x+(2*r),y+(2*r));
ctx.lineTo(x+r,y+r);
ctx.fillStyle = "#fff";
ctx.fill();
  }
  this.clicked = function() {
    var myleft = this.x;
    var myright = this.x + (4 * this.r);
    var mytop = this.y;
    var mybottom = this.y + (4 * this.r);
    var clicked = true;
    if ((mybottom < scene.y) || (mytop > scene.y) || (myright < scene.x) || (myleft > scene.x)) {
      clicked = false;
    }
    return clicked;
  }
}

function updateScene() {
var x, y, width, height, gap, minWidth, maxWidth, minHeight, maxHeight, minGap, maxGap;
  for (var i = 0; i < myObstacles.length; i += 1) {
    if (player.crashWith(myObstacles[i])) {
      scene.stop();
      return;
    } 
  }
  scene.clear();
  scene.frameNo += 1;
  if (scene.frameNo == 1 || everyinterval(150)) {
    x = scene.canvas.width;
    y = scene.canvas.height;
    minWidth = 20;
    maxWidth = 40;
    minHeight = 20;
    maxHeight = 40;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minHeight);
    minGap = 5;
    maxGap = 80;
    x -= Math.floor(Math.random()*(y+1));
    y -= Math.floor(Math.random()*(y+1));
    myObstacles.push(new component(width, height, "rgba(62, 128, 0, 0.5)", x, y));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  if (navigator.platform.startsWith('Win')) {
    player.speedX = 0;
    player.speedY = 0;
    if (scene.keys && scene.keys[37] || scene.keys[65]) {player.speedX = -1; }
    if (scene.keys && scene.keys[39] || scene.keys[68]) {player.speedX = 1; }
    if (scene.keys && scene.keys[38] || scene.keys[87]) {player.speedY = -1; }
    if (scene.keys && scene.keys[40] || scene.keys[83]) {player.speedY = 1; }
  }
  if (scene.x && scene.y) {
    if (myUpBtn.clicked()) {
      player.y -= 1;
    }
    if (myDownBtn.clicked()) {
      player.y += 1;
    }
    if (myLeftBtn.clicked()) {
      player.x += -1;
    }
    if (myRightBtn.clicked()) {
      player.x += 1;
    }
  }
  myUpBtn.update(); 
  myDownBtn.update(); 
  myLeftBtn.update(); 
  myRightBtn.update();
  myObstacle.update();
  player.update();
  tree.update();
  rock.update();
}

function moveup() {
  player.speedY -= 1; 
}

function movedown() {
  player.speedY += 1; 
}

function moveleft() {
  player.speedX -= 1;
}

function moveright() {
  player.speedX += 1;
}

function stopMove() {
  player.speedX = 0;
  player.speedY = 0; 
}
