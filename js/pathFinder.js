/*
    file name : pathFinder.js
    description : pathFinder object
	create date : 2017-07-21
	creator : saltgamer
*/
define(['class'],
	function (Class) {
	'use strict';
    var pathFinder = Class.extend({
		init : function (map) {
			this.map = map;
			this.grid = map.tileList;

			this.pathStart = [this.map.mapTileWidth, this.map.mapTileHeight];
			this.pathEnd = [0, 0];
			this.currentPath = [];
            this.ignored = [];

			this.maxWalkableTileNumber = 0;
			this.worldWidth = this.map.tileList.length,
			this.worldHeight = this.map.tileList.length;
			this.worldSize = this.worldWidth * this.worldHeight;
            console.log('=========================');
            console.log('--> worldSize: ', this.worldSize);
            console.log('=========================');
            
			// these return how far away a point is to another
			this.ManhattanDistance = function (Point, Goal) {	
				// linear movement - no diagonals - just cardinal directions (NSEW)
				return Math.abs(Point.x - Goal.x) + Math.abs(Point.y - Goal.y);
			};

			this.DiagonalDistance = function (Point, Goal) {	
				// diagonal movement - assumes diag dist is 1, same as cardinals
				return Math.max(Math.abs(Point.x - Goal.x), Math.abs(Point.y - Goal.y));
			};

			this.EuclideanDistance = function (Point, Goal) {	
				// diagonals are considered a little farther than cardinal directions
				// diagonal movement using Euclide (AC = sqrt(AB^2 + BC^2))
				// where AB = x2 - x1 and BC = y2 - y1 and AC will be [x3, y3]
				return Math.sqrt(Math.pow(Point.x - Goal.x, 2) + Math.pow(Point.y - Goal.y, 2));
			};

			// default: no diagonals (Manhattan)
			this.distanceLogic = this.ManhattanDistance;
			this.findNeighbours = function () {}; // empty
			/*
			// diagonals allowed but no sqeezing through cracks:
			var distanceLogic = DiagonalDistance;
			var findNeighbours = DiagonalNeighbours;

			// diagonals and squeezing through cracks allowed:
			var distanceLogic = DiagonalDistance;
			var findNeighbours = DiagonalNeighboursFree;

			// euclidean but no squeezing through cracks:
			var distanceLogic = EuclideanDistance;
			var findNeighbours = DiagonalNeighbours;

			// euclidean and squeezing through cracks allowed:
			var distanceLogic = EuclideanDistance;
			var findNeighbours = DiagonalNeighboursFree;
			*/


			// Neighbours functions, used by findNeighbours function
			// to locate adjacent available cells that aren't blocked

			// Returns every available North, South, East or West
			// cell that is empty. No diagonals,
			// unless distanceLogic function is not Manhattan
			this.Neighbours = function (x, y) {
				var	N = y - 1,
				S = y + 1,
				E = x + 1,
				W = x - 1,
				myN = N > -1 && this.canWalkHere(x, N),
				myS = S < this.worldHeight && this.canWalkHere(x, S),
				myE = E < this.worldWidth && this.canWalkHere(E, y),
				myW = W > -1 && this.canWalkHere(W, y),
				result = [];
				if (myN) result.push({x:x, y:N});
				if (myE) result.push({x:E, y:y});
				if (myS) result.push({x:x, y:S});
				if (myW) result.push({x:W, y:y});
				this.findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
				return result;
			};

			// returns every available North East, South East,
			// South West or North West cell - no squeezing through
			// "cracks" between two diagonals
			this.DiagonalNeighbours = function (myN, myS, myE, myW, N, S, E, W, result) {
				if (myN) {
					if (myE && this.canWalkHere(E, N)) result.push({x:E, y:N});
					if (myW && this.canWalkHere(W, N)) result.push({x:W, y:N});
				}
				if (myS) {
					if (myE && this.canWalkHere(E, S)) result.push({x:E, y:S});
					if (myW && this.canWalkHere(W, S)) result.push({x:W, y:S});
				}
			};

			// returns every available North East, South East,
			// South West or North West cell including the times that
			// you would be squeezing through a "crack"
			this.DiagonalNeighboursFree = function (myN, myS, myE, myW, N, S, E, W, result) {
				myN = N > -1;
				myS = S < this.worldHeight;
				myE = E < this.worldWidth;
				myW = W > -1;
				if (myE) {
					if (myN && this.canWalkHere(E, N)) result.push({x:E, y:N});
					if (myS && this.canWalkHere(E, S)) result.push({x:E, y:S});
				}
				if (myW) {
					if (myN && this.canWalkHere(W, N)) result.push({x:W, y:N});
					if (myS && this.canWalkHere(W, S)) result.push({x:W, y:S});
				}
			};

			
			// returns boolean value (world cell is available and open)
			this.canWalkHere = function (x, y) {
				return ((this.grid[x] != null) && (this.grid[x][y] != null) &&
				(this.grid[x][y] <= this.maxWalkableTileNumber));
			};

			// Node function, returns a new object with Node properties
			// Used in the calculatePath function to store route costs, etc.
			this.Node = function (Parent, Point) {
				var newNode = {
					// pointer to another Node object
					Parent:Parent,
					// array index of this Node in the world linear array
					value:Point.x + (Point.y * this.worldWidth),
					// the location coordinates of this Node
					x:Point.x,
					y:Point.y,
					// the heuristic estimated cost
					// of an entire path using this node
					f:0,
					// the distanceLogic cost to get
					// from the starting point to this node
					g:0
				};
				return newNode;
			};

			// Path function, executes AStar algorithm operations
			this.calculatePath = function () {
				// create Nodes from the Start and End x,y coordinates
				var	mypathStart = this.Node(null, {x:this.pathStart[0], y:this.pathStart[1]}),
					mypathEnd = this.Node(null, {x:this.pathEnd[0], y:this.pathEnd[1]}),
				// create an array that will contain all world cells
					AStar = new Array(this.worldSize),
				// list of currently open Nodes
					Open = [mypathStart],
				// list of closed Nodes
					Closed = [],
				// list of the final output array
					result = [],
				// reference to a Node (that is nearby)
					myNeighbours,
				// reference to a Node (that we are considering now)
					myNode,
				// reference to a Node (that starts a path in question)
					myPath,
				// temp integer variables used in the calculations
					length, max, min, i, j;
				// iterate through the open list until none are left
				while (length = Open.length) {
					max = this.worldSize;
					min = -1;
					for (i = 0; i < length; i++) {
						if (Open[i].f < max) {
							max = Open[i].f;
							min = i;
						}
					}
					// grab the next node and remove it from Open array
					myNode = Open.splice(min, 1)[0];
					// is it the destination node?
					if (myNode.value === mypathEnd.value) {
						myPath = Closed[Closed.push(myNode) - 1];
						do {
							result.push([myPath.x, myPath.y]);
						}
						while (myPath = myPath.Parent);
						// clear the working arrays
						AStar = Closed = Open = [];
						// we want to return start to finish
						result.reverse();
					
					} else {
						// find which nearby nodes are walkable
						myNeighbours = this.Neighbours(myNode.x, myNode.y);
						// test each one that hasn't been tried already
						for(i = 0, j = myNeighbours.length; i < j; i++) {
							myPath = this.Node(myNode, myNeighbours[i]);
							if (!AStar[myPath.value]) {
								// estimated cost of this particular route so far
								myPath.g = myNode.g + this.distanceLogic(myNeighbours[i], myNode);
								// estimated cost of entire guessed route to the destination
								myPath.f = myPath.g + this.distanceLogic(myNeighbours[i], mypathEnd);
								// remember this new path for testing above
								Open.push(myPath);
								// mark this node in the world graph as visited
								AStar[myPath.value] = true;
							}
						}
						// remember this route as having no more untested options
						Closed.push(myNode);
					}
				} // keep iterating until the Open list is empty
				return result;
			};

		},
        findPath: function(grid, entity, x, y, findIncomplete) {
        	var	path;
            this.pathStart = [entity.gridX, entity.gridY];
            this.pathEnd = [x, y];

            this.grid = grid;
        	this.applyIgnoreList_(true);
            path = this.calculatePath();
            this.currentPath = path;
//            if(path.length === 0 && findIncomplete === true) {
//                // If no path was found, try and find an incomplete one
//                // to at least get closer to destination.
//                path = this.findIncompletePath_(start, end);
//            }
        
            return path;
        },
//		findPath : function (pathStart, pathEnd) {
//			// actually calculate the a-star path!
//			// this returns an array of coordinates
//			// that is empty if no path is possible
//			return this.calculatePath();
//		},
		initPath : function () {
			this.currentPath = [];
			while (this.currentPath.length == 0) {
				this.pathStart = [Math.floor(Math.random() * this.worldWidth), 
				Math.floor(Math.random() * this.worldHeight)];
				this.pathEnd = [Math.floor(Math.random() * this.worldWidth), 
				Math.floor(Math.random() * this.worldHeight)];
			if (this.grid[this.pathStart[0]][this.pathStart[1]] == 0)
				this.currentPath = this.findPath(this.pathStart, this.pathEnd);
			}

		},
		drawPath : function () {
			// draw the path
			console.log('--> Current path length: ' + this.currentPath.length);
			this.spriteIndex = 0;
			for (var rp = 0; rp < this.currentPath.length; rp++) {
				switch (rp) {
					case 0:
						// spriteNum = 2; // start
						this.spriteIndex = 12;
						break;
					case this.currentPath.length - 1:
						// spriteNum = 3; // end
						this.spriteIndex = 13;
						break;
					default:
						// spriteNum = 4; // path node
						this.spriteIndex = 14;
						break;
				}

				// console.log('-=->', this.map.ctx.drawImage);
				// console.log(this.map.spriteSheet);

				this.map.ctx.drawImage(this.map.spriteSheet,
				this.spriteIndex * this.map.tileWidth, 0,
				this.map.tileWidth, this.map.tileHeight,
				this.currentPath[rp][0] * this.map.tileWidth,
				this.currentPath[rp][1] * this.map.tileHeight,
				this.map.tileWidth, this.map.tileHeight);
               
			}
		},
        ignoreEntity: function (entity) {
            if (entity) {
                this.ignored.push(entity);
            }
        },
        applyIgnoreList_: function (ignored) {
            var self = this, x, y, g;
            console.log('--> this.ignored: ', this.ignored);
            if (this.ignored.length > 0) {
                this.ignored.forEach(function (value, idx) {
                    
                    console.log('--> ', value);
                    x = value.isMoving() ? value.nextGridX : value.gridX;
                    y = value.isMoving() ? value.nextGridY : value.gridY;

                    if(x >= 0 && y >= 0) {
                        self.grid[y][x] = ignored ? 0 : 1;
                    }
                });
            } else {
                console.log('[!] ignored is empty!');
            }
            
        },
        clearIgnoreList: function () {
            this.applyIgnoreList_(false);
            this.ignored = [];
        }


	});

    return pathFinder;
});
