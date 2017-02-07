var http = require('http');
var fs = require('fs');

const PORT= process.env.PORT || 3000; 

fs.readFile('./public.index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});


(function () {
    var io;
    io = require('socket.io').listen(PORT);
    io.sockets.on('connection', function(socket) {
        socket.on('connectDraw', function(data) {
            socket.broadcast.emit('connectDraw', {
                tree: data.tree
            });
        });

        socket.on('connectAddNode', function (data) {
            socket.broadcast.emit('connectAddNode', {
                x: data.x,
                y: data.y,
                px: data.px,
                py: data.py,
                fill: data.fill
            });
        });

        socket.on('connectAddCoords', function (data) {
            socket.broadcast.emit('connectAddCoords', {
                x: data.x,
                y: data.y,
                newX: data.newX,
                newY: data.newY
            });
        });

        socket.on('connectAddText', function (data) {
            socket.broadcast.emit('connectAddText', {
                x: data.x,
                y: data.y,
                text: data.text
            });
        });
    });

}).call(this);
