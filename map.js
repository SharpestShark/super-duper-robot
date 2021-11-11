function doMap() {
var map = [];
var i;
var x = scene.canvas.width;
var y = scene.canvas.height;
var ctx = document.getElementsByTagName('canvas')[0].getContext("2d");
if (map.length == 0) {
  for (i = 0;map.length < 10; i++) {
    x -= Math.floor(Math.random()*(300+1));
    y -= Math.floor(Math.random()*(100+1));
    map.push({"x": x,"y": y});
  }
  window.localStorage.setItem('map',map);
} else {
  for (i = 0;i < 10;i++) {
    ctx.beginPath();
    if (i != 0) {
      ctx.lineTo(map[i].x,map[i].y);
    } else {
      ctx.moveTo(300,300);
    }
    ctx.stroke();
  }
  console.log(map);
  console.log(map[1].x);
}
}
