/* ------------- Queue Implementation ------------- */

function Queue() {
	this._oldestIndex = 1;
	this._newestIndex = 1;
	this._storage = {};
}

Queue.prototype.size = function() {
	return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
	this._storage[this._newestIndex] = data;
	this._newestIndex++;
};

Queue.prototype.dequeue = function() {
	var oldestIndex = this._oldestIndex,
		newestIndex = this._newestIndex,
		deletedData;

	if (oldestIndex !== newestIndex) {
		deletedData = this._storage[oldestIndex];
		delete this._storage[oldestIndex];
		this._oldestIndex++;

		return deletedData;
	}
};

/* ------------- Tree Structure ------------- */

function Node(xCoord, yCoord) {
	this.xCoord = xCoord;
	this.yCoord = yCoord;
	this.w = 30;
	this.h = 30;
	this.fill = 'rgba(0, 255, 0, 0.6)';
	this.parent = null;
	this.children = [];
	this.defaultText = true;
	this.text = "Input Text";
}

function Tree(xCoord, yCoord) {
	var node = new Node(xCoord, yCoord);
	this._root = node;
}

Tree.prototype.BFS = function(callback) {
	var queue = new Queue();
	queue.enqueue(this._root);
	var currentTree = queue.dequeue();

	while(currentTree) {
		for(var i = 0, length = currentTree.children.length; i < length; i++)
			queue.enqueue(currentTree.children[i]);
		callback(currentTree);
		currentTree = queue.dequeue();
	}
};

Tree.prototype.contains = function(callback, traversal) {
	traversal.call(this, callback);
};


Tree.prototype.addNew = function(xCoord, yCoord, parent) {
	var child = new Node(xCoord, yCoord);

	if(parent) {
		parent.children.push(child);
		child.parent = parent;
	} else {
		throw new Error('Cannot add node to non existent parent')
	}

	if(child.parent == this._root)
		child.fill = getRandomColour();
	else
		child.fill = parent.fill;

};

Tree.prototype.findNode = function(xCoord, yCoord) {
	var found = null;

	var callback = function(node) {
		if(node.xCoord == xCoord && node.yCoord == yCoord) {
            found = node;
        }
	};

	this.contains(callback, this.BFS);
	return found;
};

Tree.prototype.remove = function(xCoord, yCoord, xCoord_, yCoord_, traversal) {
	var tree = this,
		parent = null,
		childToRemove = null,
		index;

	var callback = function(node) {
		if(xCoord == xCoord_ && yCoord == yCoord_)
			parent = node;
	};

	this.contains(callback, traversal);

	if(parent) {
		index = findIndex(parent.children, data);
		if(index === undefined)
			throw new Error('Node to be removed does not exist');
		else
			childToRemove = parent.children.splice(index, 1);
	} else {
		throw new Error('Parent does not exist')
	}

	return childToRemove;
};

function findIndex(arr, xCoord, yCoord) {
	var index;

	for(var i = 0; i < arr.length; i++) {
		if(arr[i].xCoord === xCoord && arr[i].yCoord === yCoord)
			index = i;
	}

	return index;
}

/* ------------- Draw Tools ------------- */

function getRandomColour() {
    var letters = '0123456789ABCDEF';
    var colour = '#';
    for (var i = 0; i < 6; i++ ) {
        colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
}

Node.prototype.draw = function(ctx) {
    ctx.font = "15pt Helvetica";
    var text = ctx.measureText(this.text);
    //edit width to fit the text
	this.w = text.width + 5;
	ctx.fillStyle = this.fill;
	ctx.fillRect(this.xCoord, this.yCoord, this.w, this.h);
    ctx.fillStyle = "#fff";
    ctx.fillText(this.text, this.xCoord + 2, this.yCoord + 21);
	//stick line to closest edge

	if(this.parent != null) {

        // parent edge coordinates

        var pTopx = (this.parent.xCoord + (this.parent.w / 2));
        var pTopy = this.parent.yCoord;

        var pBottomx = pTopx;
        var pBottomy = (this.parent.yCoord + this.parent.h);

        var pLeftx = this.parent.xCoord;
        var pLefty = (this.parent.yCoord + (this.parent.h / 2));

        var pRightx = (this.parent.xCoord + this.parent.w);
        var pRighty = pLefty;

        // child edge coordinates

        var cTopx = (this.xCoord + (this.w / 2));
        var cTopy = this.yCoord;

        var cBottomx = cTopx;
        var cBottomy = (this.yCoord + this.h);

        var cLeftx = this.xCoord;
        var cLefty = (this.yCoord + (this.h / 2));

        var cRightx = (this.xCoord + this.w);
        var cRighty = cLefty;

        // final coordinates

		var px = null;
		var py = null;
		var cx = null;
		var cy = null;

		var hypP = [];
		var hypC = [];

		// calculations

		var pxCoords = [pTopx, pBottomx, pLeftx, pRightx];
		var pyCoords = [pTopy, pBottomy, pLefty, pRighty];
		var cxCoords = [cTopx, cBottomx, cLeftx, cRightx];
		var cyCoords = [cTopy, cBottomy, cLefty, cRighty];

		for(var i = 0; i < 4; i++) {
            var a = this.xCoord - pxCoords[i];
            var b = this.yCoord - pyCoords[i];
            var h = Math.sqrt((a * a) + (b * b));
            hypP.push(h);
        }

        for(var i = 0; i < 4; i++) {
            var a = cxCoords[i] - this.parent.xCoord;
            var b = cyCoords[i] - this.parent.yCoord;
            var h = Math.sqrt((a * a) + (b * b));
            hypC.push(h);
        }

        var minHypP = Math.min.apply(Math, hypP);
        var minHypC = Math.min.apply(Math, hypC);

        for(var i = 0; i < 4; i++) {
            var a = this.xCoord - pxCoords[i];
            var b = this.yCoord - pyCoords[i];
            var h = Math.sqrt((a * a) + (b * b));

            if(h == minHypP) {
            	px = pxCoords[i];
				py = pyCoords[i];
			}
        }

        for(var i = 0; i < 4; i++) {
            var a = cxCoords[i] - this.parent.xCoord;
            var b = cyCoords[i] - this.parent.yCoord;
            var h = Math.sqrt((a * a) + (b * b));

            if(h == minHypC) {
                cx = cxCoords[i];
                cy = cyCoords[i];
            }
        }

		// draw path

		ctx.beginPath();
		ctx.lineWdith="5";
		ctx.strokeStyle= this.parent.fill;
		ctx.moveTo(cx, cy);
		ctx.lineTo(px, py);
		ctx.stroke();
	}
};

Tree.prototype.drawTree = function(ctx) {
	var callback = function(node) {
            node.draw(ctx);
	};

	this.contains(callback, this.BFS);
};

Tree.prototype.selectNode = function(mx, my) {
	var selected = null;

	var callback = function(node) {
		if (node.containsCoords(mx, my)) {
				node.selected = true;
				selected = node;
		}
	};

	this.contains(callback, this.BFS);

	return selected;
};

Tree.prototype.returnSel = function() {
	var selNode = null;

	var callback = function(node) {
		if (node.selected = true) {
			selNode = node;
		}
	};

	this.contains(callback, this.BFS);

	return selNode;
};

Tree.prototype.inTree = function(mx, my) {
	var inTree = false;

	var callback = function(node) {
		if(node.containsCoords(mx, my))
			inTree = true;
	};

	this.contains(callback, this.BFS);

	return inTree;
};

Node.prototype.containsCoords = function(mx, my) {
	return (this.xCoord <= mx) && (this.xCoord + this.w >= mx) &&
	       (this.yCoord <= my) && (this.yCoord + this.h >= my);
};

/* ------------- Canvas State ------------- */

function CanvasState(canvas) {

	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');

	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
		this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
		this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'],10) || 0;
		this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'],10) || 0;
	}

	//fixed position bar fix
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;

	this.valid = false; //when set to true canvas will redraw 

	this.dragging = false;
	this.dragoffx = 0;
	this.dragoffy = 0;
	this.tree = null;
	this.sn = null;
	this.shiftdown = false;
	this.connectNode = null;
    var myState = this;

	/* ------------- Connection Handling ------------- */


    this.socket = io.connect('http://localhost:8080');

	this.socket.on('connectDraw', function(data) {
        myState.tree = new Tree(data.tree._root.xCoord, data.tree._root.yCoord);
        myState.valid = false;
    });

	this.socket.on('connectAddNode', function(data) {
		myState.connectNode = new Node(data.x, data.y);
		myState.connectNode.fill = data.fill;
		myState.connectNode.parent = myState.tree.findNode(data.px, data.py);
        myState.valid = false;
    });

    this.socket.on('connectAddCoords', function(data) {
        var currentNode = myState.tree.findNode(data.x, data.y);
		currentNode.xCoord = data.newX;
        currentNode.yCoord = data.newY;
        myState.valid = false;
    });

    this.socket.on('connectAddText', function(data) {
        var currentNode = myState.tree.findNode(data.x, data.y);
		currentNode.text = data.text;
        myState.valid = false;
    });

	/* ------------- Event Handling ------------- */

    canvas.addEventListener('selectstart', function(e) {
		e.preventDefault(); 
		return false;
	}, false);

	canvas.addEventListener('mousedown', function(e) {
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		var tree = myState.tree;

		//make sure the tree is not empty
		if(tree != null) {
			//check if the coordinates are in any of the nodes in the tree
			if(tree.inTree(mx, my)) {
				//get the selected node
                var selection = tree.selectNode(mx, my);
                myState.dragoffx = mx - selection.xCoord;
                myState.dragoffy = my - selection.yCoord;
                // these coordinates ensure that the selection can be moved smoothly
                myState.sn = selection;
                myState.dragging = true;
                myState.valid = false; //redraw
            }
		}
	}, true); 

	canvas.addEventListener('mousemove', function(e) {
		if(myState.dragging) {
			var mouse = myState.getMouse(e);

            //using values for smooth dragging that were calculated previously
			var oldX = myState.sn.xCoord;
			var oldY = myState.sn.yCoord;

			myState.sn.xCoord = mouse.x - myState.dragoffx;
			myState.sn.yCoord = mouse.y - myState.dragoffy;
			myState.valid = false; //redraw

            myState.socket.emit('connectAddCoords', {
                x: oldX,
                y: oldY,
				newX: myState.sn.xCoord,
				newY: myState.sn.yCoord
            });
        }
	}, true);

	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
	}, true);

	canvas.addEventListener('dblclick', function(e) {
		var mouse = myState.getMouse(e);

        //if the tree is currently empty, make a new tree and make its root the selection
		if(myState.tree == null) {
			myState.tree = new Tree(mouse.x - 10, mouse.y - 10); 
			myState.tree._root.selected = true;
			myState.sn = myState.tree.returnSel();
			myState.valid = false;
            myState.socket.emit('connectDraw', {
            	tree: myState.tree
        	});

        } else {
			myState.tree.addNew(mouse.x - 10, mouse.y - 10, myState.sn);
			myState.valid = false;

            myState.socket.emit('connectAddNode', {
                x: mouse.x - 10,
				y: mouse.y - 10,
				px: myState.sn.xCoord,
				py: myState.sn.yCoord,
				fill: myState.tree.findNode(mouse.x - 10, mouse.y - 10).fill
            });
        }
	}, true);

    document.addEventListener("keydown", function(e1) {
        if(e1.keyCode == 16) {
            myState.shiftdown = true;
        }
    }, true);

    document.addEventListener("keyup", function(e) {
        var letters = "abcdefghijklmnopqrstuvwxyz";
        var caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var word = [];
        var key = e.keyCode;

		if(key == 32) {
            var x = myState.sn;
            x.text += " ";
            myState.valid = false;

            myState.socket.emit('connectAddText', {
                x: x.xCoord,
                y: x.yCoord,
                text: x.text
            });
        }

        if (key == 16) {
            myState.shiftdown = false;
        }

        if (key > 64 && key < 91) {

            var x = myState.sn;

            if(x.defaultText) {
                x.text = "";
                x.defaultText = false;
            }

			if (myState.shiftdown) {
				x.text += caps.substring(key - 64, key - 65);
				myState.valid = false;
                myState.socket.emit('connectAddText', {
                    x: x.xCoord,
                    y: x.yCoord,
                    text: x.text
                });
			} else {
				x.text += letters.substring(key - 64, key - 65);
				myState.valid = false;
                myState.socket.emit('connectAddText', {
                    x: x.xCoord,
                    y: x.yCoord,
                    text: x.text
                });
			}
        }

        if(key == 8) {
        	var x = myState.sn;
            x.text = x.text.substring(0, x.text.length - 1);
            myState.valid = false;
            myState.socket.emit('connectAddText', {
                x: x.xCoord,
                y: x.yCoord,
                text: x.text
            });
		}


    }, true);

	//outline for currently selected node


	this.selectionColor = '#CC0000';
	this.selectionWidth = 2;
	this.interval = 30;
	setInterval(function() {
		myState.draw();
	}, myState.interval);
}

/* ------------- Drawing ------------- */


CanvasState.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

CanvasState.prototype.draw = function() {
	// redraw if in an invalid state
	if(!this.valid) {
		var ctx = this.ctx;
		this.clear();

        if(this.connectNode) {
            this.tree.addNew(this.connectNode.xCoord, this.connectNode.yCoord, this.connectNode.parent);
            this.tree.findNode(this.connectNode.xCoord, this.connectNode.yCoord).fill = this.connectNode.fill;
            this.connectNode = null;
        }

        if(this.tree)
			this.tree.drawTree(ctx);

        //selection highlight

		if(this.sn != null) {
			ctx.strokeStyle = this.selectionColor;
			ctx.lineWidth = this.selectionWidth;
			var mySel = this.sn;
			ctx.strokeRect(mySel.xCoord, mySel.yCoord, mySel.w, mySel.h);
		}

		this.valid = true;
	}
};

CanvasState.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

	if(element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;

	return {x: mx, y: my};
};

/* ------------- Initialisation Function ------------- */

function init() {
	var s = new CanvasState(document.getElementById('canvas1'));
}