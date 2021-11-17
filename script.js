var player, myObstacle, tree, rock, myUpBtn, myDownBtn, myLeftBtn, myRightBtn;
var myObstacles = [];
var health, hpVis;
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
  health = new component(100,20,"green", 10, 400);
  health.value = 100;
  hpVis = new component("12px", "Consolas", "white", 12, 413.5, "text");
  hpVis.text = health.value.toString();
  tree = background.tree;
  rock = background.rock;
	var x = 20;
	var y = 20;
	var m = 40;
  if (navigator.platform = 'iPad') {
      myUpBtn = new arrowBtn(x+m, y, 10, 270);
      myDownBtn = new arrowBtn(x+m, y+(2*m), 10, 90);
      myLeftBtn = new arrowBtn(x, y+m, 10, 180);
      myRightBtn = new arrowBtn(x+(2*m), y+m, 10, 0);
  }
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
    var EndMessage = new component("45px", "Consolas", "black", 300, 300, "text");
    EndMessage.text = "Game Over";
    var restartBtnText = new component("20px", "Consolas", "black", 300, 350, "text");
    restartBtnText.text = "Restart?";
    var restartBtn = new component(70, 50, "rgba(20,20,20,0.4", 295, 335);
    if (restartBtn.clicked = 1) {
      // maybe add high score method (store to array, and use 'array.push(' then the score, and read/write the score, using text component, at the start. if the score is Not UNDEFINED)
      this.start();
    }
  }
}

function everyinterval(n) {
  if ((scene.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function component(width, height, color, x, y, type) {
  this.color = color;
  this.exist = true;
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y; 
  this.update = function(){
    if (this.exist == true) {
      ctx = scene.context;
      if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
      } else if (type == "image") {
        ctx.drawImage(this.image, 
          this.x, 
          this.y,
          this.width, this.height);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
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
    if (this.exist == true) {
    var crash = true;
    }
    if (((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) || (this.exist == false)) {
      crash = false;
    }
    return crash;
  }
}

function arrowBtn(x,y,r,angle) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.angle = angle * Math.PI / 180;
  this.update = function() {
    ctx = scene.context;
    //ctx.save();
    var tx, ty;
    if (angle == 90) {
      tx = this.y;
      x = 0;
      ty = -this.x;
      y = 0;
    } else if (angle == 180) {
      tx = -this.x;
      x = 0;
      ty = -this.y;
      y = 0;
    } else if (angle == 270) {
      tx = -this.y;
      x = 0;
      ty = this.x;
      y = 0;
    } else {
      tx = 0;
      ty = 0;
    }
    //ctx.translate(tx,ty);
    //ctx.rotate(this.angle);
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
	  //ctx.restore();
    var imgData = ctx.getImageData(100,60,140,100);
	  ctx.save();
    ctx.rotate(this.angle);
    ctx.drawImage(imgData,this.x,this.y);
    ctx.restore();
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
    if (player.crashWith(myObstacles[i]) && (myObstacles[i].exist == true)) {
      if ((health.width < 100) || (health.value < 100)) {
        health.value = health.width;
        health.value += 5;
	health.width = health.value;
	      if (health.value >= 50) {
	        health.color = "green";
	      }
      }
      myObstacles[i].exist = false;
      if (health.value <= 0) {
	scene.stop();
      }
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
    myObstacles.push(new component(width, height, "PNG image 2.png", x, y, "image"));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
	  myObstacles[i].update();
  }
  var i;
  if (navigator.platform.startsWith('Win')) {
  if (scene.keys && (scene.keys[37] || scene.keys[65])) {
    player.x -= 1;
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += 1;
      myObstacles[i].update();
    }
  }
  if (scene.keys && (scene.keys[39] || scene.keys[68])) {
    player.x += 1;
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x -= 1;
      myObstacles[i].update();
    }
  }
  if (scene.keys && (scene.keys[38] || scene.keys[87])) {
    player.y -= 1;
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].y += 1;
      myObstacles[i].update();
    }
  }
  if (scene.keys && (scene.keys[40] || scene.keys[83])) {
    player.y += 1;
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].y -= 1;
      myObstacles[i].update();
    }
  }
}
  if (scene.x && scene.y) {
    if (myUpBtn.clicked()) {
      player.y -= 1;
      for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 1;
        myObstacles[i].update();
      }
    }
    if (myDownBtn.clicked()) {
      player.y += 1;
      for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y -= 1;
        myObstacles[i].update();
      }
    }
    if (myLeftBtn.clicked()) {
      player.x -= 1;
      for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += 1;
        myObstacles[i].update();
      }
    }
    if (myRightBtn.clicked()) {
      player.x += 1;
      for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 1;
        myObstacles[i].update();
      }
    }
  }
  doMap();
  myUpBtn.update(); 
  myDownBtn.update(); 
  myLeftBtn.update(); 
  myRightBtn.update();
  if ((health.value <= 50) && (health.value > 25)) {health.color = "#ffea00";hpVis.color = "#000000";} else if ((health.value <= 25) && (health.value > 10)) {health.color = "#ff9900";hpVis.color = "#ffffff";} else if (health.value <= 10) {health.color = "red";hpVis.color = "#ffffff";}
  if ((health.width <= 15) || ((health.value <= 25) && (health.value > 10))) {
    hpVis.color = "#000000";
  }
  health.update();
  hpVis.text = health.value.toString();
  hpVis.update();
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
