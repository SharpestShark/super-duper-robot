var map = [];
var i;
for (i = 0;i < 10;i++) {
  var x = scene.canvas.width;
  var y = scene.canvas.height;
  x -= Math.floor(Math.random()*(x+1));
  y -= Math.floor(Math.random()*(y+1));
  map.push(i + ': {"x": ' + x + ',"y": ' + y + '}');
}
console.log(map);
