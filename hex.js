
function submitOnEnter(e) {
    keyboardKey = e.which || e.keyCode;
    if (keyboardKey == 13) {
        setFullColor();
    }
}
function numberValue(elmnt) {
    var val, x;
    val = Number(elmnt.value);
    if (val < 0) {val = 0;}
    if (val > 255) {val = 255;}
    val = toHex(val);
    x = document.getElementById(elmnt.id.substr(0, 3));
    x.value = val;
    setColor();
}
function toHex(n) {
    var hex = n.toString(16);
    while (hex.length < 2) {hex = "0" + hex; }
    return hex;
}
function clickRed(red) {
    var r = document.getElementById("r01");
    r.value = red;
    setColor();
}
function clickGreen(green) {
    var g = document.getElementById("g01");
    g.value = green;
    setColor();
}
function clickBlue(blue) {
    var b = document.getElementById("b01");
    b.value = blue;
    setColor();
}
function drawRedTable() {
    var x, i, n, g, b;
    g = "00";
    b = "00";
    x = "<table class='tableslider'>"
    x += "<tr>";
    n = 0;
    for (i = 0; i <= 255; i++) {
        n = toHex(i);
        x += "<td style='position:relative;padding:0;'><div class='pointer red' id='redpointer" + n + "'><div>" + n + "</div><i class='fa fa-caret-down'></i></div></td>";
    }
    x += "</tr>";
    x += "<tr>";
    n = 0;
    for (i = 0; i <= 255; i++) {
        n = toHex(i);
        x += "<td style='background-color:#" + n + g + b + ";height:22px;padding:0;' onmousemove='tooltip(0, \"" + n + "\")' onclick='clickRed(\"" + n + "\")'></td>";
    }
    x += "</tr>";
    x += "</table>";
    document.getElementById("redtable").innerHTML = x;
}
function drawGreenTable() {
    var x, i, r, b;
    r = "00";
    b = "00";
    x = "<table class='tableslider'>"
    x += "<tr>";
    for (i = 0; i <= 255; i++) {
        n = toHex(i);    
        x += "<td style='position:relative;padding:0;'><div class='pointer' id='greenpointer" + n + "'><div>" + n + "</div><i class='fa fa-caret-down'></i></div></td>";
    }
    x += "</tr>";
    x += "<tr>";
    for (i = 0; i <= 255; i++) {
        n = toHex(i);    
        x += "<td onmousemove='tooltip(1, \"" + n + "\")' onclick='clickGreen(\"" + n + "\")' style='padding:0;height:22px;background-color:#" + r + n + b + "'></td>";
    }
    x += "</tr></table>";
    document.getElementById("greentable").innerHTML = x;
}
function drawBlueTable() {
    var x, i, r, g;
    r = "00";
    g = "00";
    x = "<table class='tableslider'>"
    x += "<tr>";
    for (i = 0; i <= 255; i++) {
        n = toHex(i);    
        x += "<td style='position:relative;padding:0;'><div class='pointer' id='bluepointer" + n + "'><div>" + n + "</div><i class='fa fa-caret-down'></i></div></td>";
    }
    x += "</tr>";
    x += "<tr>";
    for (i = 0; i <= 255; i++) {
        n = toHex(i);
        x += "<td onmousemove='tooltip(2, \"" + n + "\")' onclick='clickBlue(\"" + n + "\")' style='padding:0;height:22px;background-color:#" + r + g + n + "'></td>";
    }
    x += "</tr></table>";
    document.getElementById("bluetable").innerHTML = x;
}
drawRedTable(0);
drawGreenTable(0);
drawBlueTable(0);
