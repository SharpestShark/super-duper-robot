function map() {
var map = [];
var i;
var x = scene.canvas.width;
var y = scene.canvas.height;
var ctx = document.getElementsByTagName('canvas')[0].getContext("2d");
ctx.beginPath();
for (i = 0;i < 10;i++) {
  x -= Math.floor(Math.random()*(300+1));
  y -= Math.floor(Math.random()*(100+1));
  map.push(i + ': {"x": ' + x + ',"y": ' + y + '}');
  if (i != 0) {
    ctx.lineTo(map[i].x,map[i].y);
  } else {
    ctx.moveTo(300,100);
  }
}
ctx.stroke();
console.log(map);
  console.log(map[1]);
}
