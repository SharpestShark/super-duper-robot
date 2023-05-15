var player, computer, xBtn, myUpBtn, myDownBtn, myLeftBtn, myRightBtn, endMessage, restartBtn, restartBtnText, skullBtn, interactBtn, interactBtnText, car, dataURL;
var myObstacles = [];
var mySpeed = [];
var health, hpVis;
var speedT = 1;
// speed decrease timing variable:
// var timeSince;

function start() {
    player = new component(30,30,"red",10,120);
    computer = new component(30,30,"red",1200,((window.innerHeight - 20) / 2) || (scene.canvas.height / 2));
    computer.interacted = false;
    xBtn = new xBtn(0,0,10);
    health = new component(100,20,"green",10,(window.innerHeight - 40) || (scene.canvas.height - 40));
    health.value = 100;
    hpVis = new component("12px","Consolas","white",health.x + 2,health.y + 13.5,"text");
    hpVis.text = health.value.toString();
    skullBtn = new component(30,30,"Skull.png",10,(window.innerHeight - 100) || (scene.canvas.height - 100),"image");
    player.stat = new component("20px","Consolas","black",skullBtn.x,skullBtn.y - 20,"text");
    interactBtn = new longBtn(player.x + player.width,player.y + player.height,10);
    interactBtn.exist = false;
    interactBtnText = new component("20px","Consolas","black",interactBtn.x + 10,interactBtn.y + (interactBtn.height / 2),"text");
    interactBtnText.text = "[E] Interact";
    interactBtnText.exist = false;
    car = new carMake(30,30,"red",225,225);
    if (navigator.platform == 'iPad') {
        var x = 20;
        var y = 20;
        var m = 40;
        myUpBtn = new arrowBtn(x + m,y,10,270);
        myDownBtn = new arrowBtn(x + m,y + (2 * m),10,90);
        myLeftBtn = new arrowBtn(x,y + m,10,180);
        myRightBtn = new arrowBtn(x + (2 * m),y + m,10,0);
        interactBtnText = new component("18px","FontAwesome","black",interactBtn.x + 10,interactBtn.y + (interactBtn.height / 2),"text");
        interactBtnText.text = "\uf25a Interact";
        interactBtnText.exist = false;
    }
    scene.start();
}

var scene = {
    canvas: document.createElement("canvas"),
    allow: document.createAttribute("allow"),
    start: function() {
        this.canvas.width = window.innerWidth - 20;
        this.canvas.height = window.innerHeight - 20;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.allow.value = "fullscreen";
        this.canvas.setAttributeNode(this.allow);
        this.frameNo = 0;
        this.interval = setInterval(updateScene, 20);
        window.addEventListener('mousedown', function(e) {
            scene.x = e.pageX;
            scene.y = e.pageY;
        });
        window.addEventListener('mouseup', function(e) {
            scene.x = false;
            scene.y = false;
        });
        window.addEventListener('touchstart', function(e) {
            scene.x = e.pageX;
            scene.y = e.pageY;
        });
        window.addEventListener('touchend', function(e) {
            scene.x = false;
            scene.y = false;
        });
        window.addEventListener('keydown', function(e) {
            scene.keys = (scene.keys || []);
            scene.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function(e) {
            scene.keys[e.keyCode] = false;
        });
        window.addEventListener('touchmove', function(e) {
            scene.x = e.touches[0].screenX;
            scene.y = e.touches[0].screenY;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        endMessage = new component("45px","Consolas","black",300,300,"text");
        endMessage.text = "Game Over";
        restartBtnText = new component("20px","Consolas","black",300,350,"text");
        restartBtnText.text = "Restart?";
        restartBtn = new component(70,50,"rgba(20,20,20,0.4)",295,335);
        endMessage.update();
        restartBtnText.update();
        restartBtn.update();
        if (restartBtn.clicked()) {
            clearInterval(this.interval);
            scene.clear();
            // maybe add high score method (store to array, and use 'array.push(' then the score, and read/write the score, using text component, at the start. if the score is Not UNDEFINED)
            start();
        }
    }
};

function everyinterval(n) {
    if ((scene.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function component(width, height, color, x, y, type) {
    this.color = color;
    this.heal = 0;
    this.exist = true;
    this.damage = '5';
    this.type = type;
    this.sped = 0;
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
    this.update = function() {
        if (this.exist == true) {
            var ctx = scene.context;
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = this.color;
                ctx.fillText(this.text, this.x, this.y);
            } else if (type == "image") {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }
    ,
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
    }
    ,
    this.crashWith = function(otherobj) {
        var myleft, myright, mytop, mybottom, otherleft, otherright, othertop, otherbottom, crash;
        myleft = this.x;
        myright = this.x + (this.width);
        mytop = this.y;
        mybottom = this.y + (this.height);
        otherleft = otherobj.x;
        otherright = otherobj.x + (otherobj.width);
        othertop = otherobj.y;
        otherbottom = otherobj.y + (otherobj.height);
        if (this.exist == true) {
            crash = true;
        }
        if (((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) || (this.exist == false)) {
            crash = false;
        }
        return crash;
    }
    ;
}

function arrowBtn(x, y, r, angle) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angle = angle * Math.PI / 180;
    this.update = function() {
        ctx = scene.context;
        ctx.save();
        var tx, ty;
        if (angle == 90) {
            tx = this.x + (4 * r);
            x = 0;
            ty = this.y;
            y = 0;
        } else if (angle == 180) {
            tx = this.x + (4 * r);
            x = 0;
            ty = this.y + (4 * r);
            y = 0;
        } else if (angle == 270) {
            tx = this.x;
            x = 0;
            ty = this.y + (4 * r);
            y = 0;
        } else {
            tx = this.x;
            x = 0;
            y = 0;
            ty = this.y;
        }
        ctx.translate(tx, ty);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
        ctx.lineTo(x + (3 * r), y);
        ctx.arc(x + (3 * r), y + r, r, 1.5 * Math.PI, 0);
        ctx.lineTo(x + (4 * r), y + (3 * r));
        ctx.arc(x + (3 * r), y + (3 * r), r, 0, 0.5 * Math.PI);
        ctx.lineTo(x + r, y + (4 * r));
        ctx.arc(x + r, y + (3 * r), r, 0.5 * Math.PI, Math.PI);
        ctx.lineTo(x, y + r);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.beginPath();
        //inner arrow
        ctx.moveTo(x + r, y + r);
        ctx.lineTo(x + (2 * r), y + r);
        ctx.lineTo(x + (3 * r), y + (2 * r));
        ctx.lineTo(x + (2 * r), y + (3 * r));
        ctx.lineTo(x + r, y + (3 * r));
        ctx.lineTo(x + (2 * r), y + (2 * r));
        ctx.lineTo(x + r, y + r);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
        /*var imgData = ctx.getImageData(100,60,140,100);
	  ctx.save();
    ctx.rotate(this.angle);
    ctx.drawImage(imgData,this.x,this.y);
    ctx.restore();*/
    }
    ,
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
    ;
}

//measurements of apple: ctx.strokeRect(p1x - (1.7*mul),p1y - (1.3*mul),(p1x + (1.7*mul))-(p1x - (1.7*mul)),(endpy + mul)-(p1y - (.6*mul)));

function apple(x, y, scale) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.width = (x + (1.7 * scale)) - (x - (1.7 * scale));
    this.height = ((y + (2.5 * scale)) + scale) - (y - (0.6 * scale));
    this.heal = 0;
    this.exist = true;
    this.damage = '5';
    this.speedX = 0;
    this.speedY = 0;
    this.update = function() {
        if (this.exist == true) {
            ctx = scene.context;
            var mul = this.scale;
            var p1x = this.x;
            var p1y = this.y;
            var endpx = p1x;
            var endpy = p1y + (2.5 * mul);
            var bezCont1x = p1x - (2 * mul);
            var bezCont1y = p1y - mul;
            var bezCont2x = bezCont1x;
            var bezCont2y = endpy + mul;
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.bezierCurveTo(bezCont1x, bezCont1y, bezCont2x, bezCont2y, endpx, endpy);
            ctx.bezierCurveTo(p1x + (2 * mul), bezCont2y, p1x + (2 * mul), bezCont1y, p1x, p1y);
            ctx.fillStyle = "#ef1a00";
            ctx.fill();
            ctx.strokeStyle = "#ff1a00";
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#7d4f34";
            ctx.moveTo(p1x, p1y);
            ctx.quadraticCurveTo(p1x + (0.2 * mul), p1y - (1.1 * mul), p1x + (0.5 * mul), p1y - (1.1 * mul));
            ctx.stroke();
        }
    },
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
        var crash;
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        if (this.exist == true) {
            crash = true;
        }
        if (((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) || (this.exist == false)) {
            crash = false;
        }
        return crash;
    };
}

function longBtn(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.width = (10 * r);
    this.height = (4 * r);
    this.exist = true;
    this.update = function() {
        var ctx = scene.context;
        if (this.exist == true) {
            ctx.beginPath();
            ctx.arc(this.x + r, this.y + r, r, Math.PI, 1.5 * Math.PI);
            ctx.lineTo(this.x + (9 * r), this.y);
            ctx.arc(this.x + (9 * r), this.y + r, r, 1.5 * Math.PI, 0);
            ctx.lineTo(this.x + (10 * r), this.y + (3 * r));
            ctx.arc(this.x + (9 * r), this.y + (3 * r), r, 0, 0.5 * Math.PI);
            ctx.lineTo(this.x + r, this.y + (4 * r));
            ctx.arc(this.x + r, this.y + (3 * r), r, 0.5 * Math.PI, Math.PI);
            ctx.lineTo(this.x, this.y + r);
            ctx.fillStyle = 'rgb(80,80,80,0.3)';
            ctx.fill();
        }
    },
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
    };
}

function carMake(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = scene.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
}

function updateScene() {
    var x, y, scale, spedScale, isObstacle;
    for (var i = 0; i < myObstacles.length; i += 1) {
        if (player.crashWith(myObstacles[i]) && (myObstacles[i].exist == true)) {
            if ((health.width < 100) || (health.value < 100)) {
                if (myObstacles[i].heal == 1) {
                    health.value = health.width;
                    health.value += 5;
                    health.width = health.value;
                }
                if (health.value >= 50) {
                    health.color = "green";
                    hpVis.color = "#ffffff";
                }
            }
            myObstacles[i].exist = false;
        }
    }
    for (var i = 0; i < mySpeed.length; i += 1) {
        if (player.crashWith(mySpeed[i]) && (mySpeed[i].exist == true)) {
            if ((speedT >= 1) && (speedT <= 2)) {
                if (mySpeed[i].sped == 1) {
                    speedT += 0.2;
                    player.speedX = speedT;
                    player.speedY = speedT;
                }
                player.color = "blue";
                var s = [new Date().getSeconds()];
                var l = setInterval(clock, 1000);
                function clock() {
                    var timeSince;
                    if (l && ((((timeSince == null) && (timeSince < 5)) || (!timeSince)) && (speedT > 1))) {
                        timeSince = new Date().getSeconds() - s[0];
                        speedT -= 0.02;
                    } else if ((isFinite(timeSince)) && (timeSince = 5)) {
                        clearInterval(l);
                        console.log('yes');
                    }
                }
            }
            mySpeed[i].exist = false;
        }
    }
    var speedX, speedY;
    if ((player.crashWith(computer) == true) && (computer.interacted == false)) {
        speedT = 0;
        player.speedX = speedT,
        player.speedY = speedT;
        speedX = speedT,
        speedY = speedT;
        interactBtn.exist = true;
        interactBtnText.exist = true;
        if ((interactBtn && interactBtn.clicked()) || (scene.keys && (scene.keys[69]))) {
            computer.interacted = true;
            interactBtn.exist = false;
            interactBtnText.exist = false;
            openComputer(computer);
        }
    } else {
        speedX = 1,
        speedY = 1;
    }
    if ((player.crashWith(computer) == false) || (computer.interacted == false)) {
        interactBtn.exist = false;
        interactBtnText.exist = false;
    }
    scene.clear();
    scene.frameNo += 1;
    if (scene.frameNo == 1 || everyinterval(150)) {
        x = scene.canvas.width;
        y = scene.canvas.height;
        scale = Math.floor(Math.random() * (8 - 4) + 5);
        spedScale = Math.floor(Math.random() * (20) + 15);
        x -= Math.floor(Math.random() * (y + 1));
        y -= Math.floor(Math.random() * (y + 1));
        isObstacle = Math.round(Math.random());
        if (isObstacle == 1) {
            myObstacles.push(new apple(x,y,scale));
        } else if (isObstacle == 0) {
            mySpeed.push(new component(spedScale,spedScale,"coool.png",x,y,"image"));
        }

        if ((x >= (player.x - 20) && x <= (player.x + 20)) && (y >= (player.y - 20) && y <= (player.y + 20))) {
            this.heal = 0;
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].heal = 1;
        myObstacles[i].update();
    }
    for (var i = 0; i < mySpeed.length; i += 1) {
        mySpeed[i].sped = 1;
        mySpeed[i].update();
    }
    if (speedT < 1) {
        speedT = 1;
    }
    speedX = speedT,
    speedY = speedT,
    player.speedX = speedT,
    player.speedY = speedT;
    if (navigator.platform.startsWith('Win')) {
        if (scene.keys && (scene.keys[37] || scene.keys[65])) {
            computer.x += player.speedX;
            player.x -= player.speedX;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].x += speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].x += speedT;
                mySpeed[i].update();
            }
        }
        if (scene.keys && (scene.keys[39] || scene.keys[68])) {
            computer.x -= player.speedX;
            player.x += player.speedX;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].x -= speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].x -= speedT;
                mySpeed[i].update();
            }
        }
        if (scene.keys && (scene.keys[38] || scene.keys[87])) {
            computer.y += player.speedY;
            player.y -= player.speedY;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].y += speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].y += speedT;
                mySpeed[i].update();
            }
        }
        if (scene.keys && (scene.keys[40] || scene.keys[83])) {
            computer.y -= player.speedY;
            player.y += player.speedY;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].y -= speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].y -= speedT;
                mySpeed[i].update();
            }
        }
    }
    if (scene.x && scene.y) {
        if (myUpBtn && myUpBtn.clicked()) {
            computer.y += player.speedY;
            player.y -= player.speedY;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].y += speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].y += speedT;
                mySpeed[i].update();
            }
        }
        if (myDownBtn && myDownBtn.clicked()) {
            computer.y -= player.speedY;
            player.y += player.speedY;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].y -= speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].y -= speedT;
                mySpeed[i].update();
            }
        }
        if (myLeftBtn && myLeftBtn.clicked()) {
            computer.x += player.speedX;
            player.x -= player.speedX;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].x += speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].x += speedT;
                mySpeed[i].update();
            }
        }
        if (myRightBtn && myRightBtn.clicked()) {
            computer.x -= player.speedX;
            player.x += player.speedX;
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].x -= speedT;
                myObstacles[i].update();
            }
            for (i = 0; i < mySpeed.length; i += 1) {
                mySpeed[i].x -= speedT;
                mySpeed[i].update();
            }
        }
    }
    if (skullBtn.clicked()) {
        if (document.fullscreenElement != null) {
            openFullscreen();
        } else if (document.fullscreenElement) {
            closeFullscreen();
        }
    }
    doMap();
    if (navigator.platform == 'iPad') {
        myUpBtn.update();
        myDownBtn.update();
        myLeftBtn.update();
        myRightBtn.update();
    }
    if ((health.value <= 50) && (health.value > 25)) {
        health.color = "#ffea00";
        hpVis.color = "#000000";
    } else if ((health.value <= 25) && (health.value > 10)) {
        health.color = "#ff9900";
        hpVis.color = "#ffffff";
    } else if (health.value <= 10) {
        health.color = "red";
        hpVis.color = "#ffffff";
    }
    if ((health.width <= 15) || ((health.value <= 25) && (health.value > 10))) {
        hpVis.color = "#000000";
    }
    if (health.value <= 0) {
        health.value = 0;
        health.width = health.value;
        scene.stop();
    }
    if (computer.interacted == false) {
        health.update();
        hpVis.text = health.value.toString();
        hpVis.update();
        player.update();
        skullBtn.update();
        player.stat.text = speedT.toString();
        player.stat.update();
        computer.update();
    }
    if ((computer.interacted == true) && (xBtn.clicked() == true)) {
        if (xBtn.clicked() == true) {
            scene.clear();
            computer.interacted = false;
            xBtn.exist = false;
            var image = new Image();
            image.onload = function() {
                ctx.drawImage(image, 0, 0);
            }
            image.src = dataURL;
        }
        xBtn.update();
    }
    computer.update();
    scene.context.font = interactBtnText.width + " " + interactBtnText.height;
    interactBtnText.measureText = scene.context.measureText(interactBtnText.text);
    interactBtn.x = player.x + player.width;
    interactBtn.y = player.y + player.height;
    interactBtn.update();
    if (car && (player.crashWith(car)) && (scene.keys && (scene.keys[69]))) {
        car.moveAngle = 0;
        car.speed = 0;
        if (scene.keys && scene.keys[37]) {
            car.moveAngle = -1;
        }
        if (scene.keys && scene.keys[39]) {
            car.moveAngle = 1;
        }
        if (scene.keys && scene.keys[38]) {
            car.speed = 1;
        }
        if (scene.keys && scene.keys[40]) {
            car.speed = -1;
        }
        car.newPos();
        car.update();
    }
    /*scene.context.beginPath();
scene.context.moveTo(interactBtn.x,interactBtn.y);
scene.context.lineTo(interactBtn.x + interactBtn.width, interactBtn.y);
scene.context.moveTo(interactBtn.x,interactBtn.y + interactBtn.height);
scene.context.lineTo(interactBtn.x + interactBtn.width, interactBtn.y + interactBtn.height);
scene.context.moveTo(interactBtn.x,interactBtn.y + (interactBtn.height/2));
scene.context.lineTo(interactBtn.x + interactBtn.width, interactBtn.y + (interactBtn.height/2));
scene.context.moveTo(interactBtnText.x,interactBtnText.y - interactBtnText.measureText.actualBoundingBoxAscent);
scene.context.lineTo(interactBtnText.x + interactBtnText.measureText.width, interactBtnText.y - interactBtnText.measureText.actualBoundingBoxAscent);
scene.context.moveTo(interactBtnText.x,interactBtnText.y + interactBtnText.measureText.actualBoundingBoxDescent);
scene.context.lineTo(interactBtnText.x + interactBtnText.measureText.width, interactBtnText.y + interactBtnText.measureText.actualBoundingBoxDescent);
scene.context.stroke();*/
    interactBtnText.x = interactBtn.x + 10;
    interactBtnText.y = interactBtn.y + (interactBtn.height * 0.6);
    interactBtnText.update();
}

function openComputer(computer) {
    var x, y, width, height;
    x = 0;
    y = 0;
    width = ((scene.canvas.width * .8) || (window.innerWidth * .8));
    height = ((scene.canvas.height * .8) || (window.innerHeight * .8));
    computer.update = function() {
        var ctx = scene.context;
        if (computer.interacted == true) {
            dataURL = scene.canvas.toDataURL();
            ctx.clearRect(0, 0, scene.canvas.width, scene.canvas.height);
            xBtn.exist = true;
            ctx.fillStyle = "rgb(252, 252, 232)";
            ctx.strokeStyle = "#001aff";
            ctx.beginPath();
            ctx.fillRect(x, y, width, height);
            ctx.stroke();
            computer.x = x;
            computer.y = y;
            computer.width = width;
            computer.height = height;

        }
        xBtn.update();
    }
}
function xBtn(x, y, r) {
    this.exist = true;
    this.x = x;
    this.y = y;
    this.r = r;
    this.width = x + (4 * this.r);
    this.height = y + (4 * this.r);
    this.update = function() {
        var r = this.r;
        var ctx = scene.context;
        if (this.exist == true) {
            ctx.beginPath();
            ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
            ctx.lineTo(x + (3 * r), y);
            ctx.arc(x + (3 * r), y + r, r, 1.5 * Math.PI, 0);
            ctx.lineTo(x + (4 * r), y + (3 * r));
            ctx.arc(x + (3 * r), y + (3 * r), r, 0, 0.5 * Math.PI);
            ctx.lineTo(x + r, y + (4 * r));
            ctx.arc(x + r, y + (3 * r), r, 0.5 * Math.PI, Math.PI);
            ctx.lineTo(x, y + r);
            ctx.fillStyle = '#000';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + (1.25 * r), y + (.75 * r));
            ctx.lineTo(x + (2 * r), y + (1.5 * r));
            // ctx.lineTo(x+(.5*r),y+(1.5*r));
            ctx.lineTo(x + (2.75 * r), y + (.75 * r));
            // ctx.lineTo(x+(3.5*r),y+(2.5*r));
            ctx.lineTo(x + (3.25 * r), y + (1.25 * r));
            // ctx.lineTo(x+(2.5*r),y+(3.5*r));
            //right inner corner "<"
            ctx.lineTo(x + (2.5 * r), y + (2 * r));

            ctx.lineTo(x + (3.25 * r), y + (2.75 * r));
            ctx.lineTo(x + (2.75 * r), y + (3.25 * r));
            // bottom inner corner "^"
            ctx.lineTo(x + (2 * r), y + (2.5 * r));

            ctx.lineTo(x + (1.25 * r), y + (3.25 * r));
            ctx.lineTo(x + (.75 * r), y + (2.75 * r));
            // left inner corner ">"
            ctx.lineTo(x + (1.5 * r), y + (2 * r));

            ctx.lineTo(x + (.75 * r), y + (1.25 * r));
            ctx.lineTo(x + (1.25 * r), y + (.75 * r));

            ctx.fillStyle = "#ff0000";
            ctx.strokeStyle = "#fff";
            ctx.stroke();
            ctx.fill();
        }
    }
    ,
    this.clicked = function() {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom =  this.y + (this.height);
        var clicked = true;
        if ((mybottom < scene.y) || (mytop > scene.y) || (myright < scene.x) || (myleft > scene.x)) {
          clicked = false;
        }
        console.log(clicked);
        return clicked;
    }
}

function openFullscreen() {
    var elem = scene.canvas;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
}
