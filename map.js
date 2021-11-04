var map = [];
var i;
for (i = 0;i < 10;i++) {
  var x = Math.floor(Math.random()*(scene.canvas.height-200+1)+200);
  var y = Math.floor(Math.random()*(scene.canvas.height-200+1)+200);
  map.push(i + ': {"x": ' + x + ',"y": ' + y + '}');
}
console.log(map);
