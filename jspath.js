
var jspath = {

	shortest_path: new Array(),
	nodes: new Array(),


	// pos -> A position. Ex.  { row: 7, col: 5 }
	// goal -> A position. Ex.  { row: 0, col: 0 }
	// parent -> A node
	node: function(pos, goal, parent) {

		var object = {};
		object.pos = pos;
		object.active = true;
		object.goal = goal;
		object.distance = jspath.calculate_distance(pos, goal);

		if ( parent != undefined ){
			object.steps = parent.steps + 1;
			object.parent = parent;
			object.weight = object.distance + object.steps;
		}

		return object;
	},

	/**
	* Creates and returns a 2 dimensional Array.
	*
	* @param {Integer} rows		The width of the new matrix.
	* @param {Integer} cols		The height of the new matrix.
	* @return {Array[Array]}	Returns the matrix.
	*/
	create_matrix: function(rows, cols){
		var matrix = new Array(rows);

		for( var row = 0; row < rows; row++) {
			matrix[row] = new Array(cols);
			for( var col = 0; col < cols; col++) {
				matrix[row][col] = '.';

			}
		}
		return matrix;
	},

	directions: function(){
		var dirs = new Array();
		dirs.push( {row: 0, col: -1 } );
		dirs.push( {row: 0, col: 1 } );
		dirs.push( {row: -1, col: 0 } );
		dirs.push( {row: 1, col: 0 } );

		return dirs;
	},

	calculate_distance: function(start, goal){
		var rows = goal.row - start.row;
		if ( rows < 0 ) {
			rows = rows * -1;
		}
		var cols = goal.col - start.col;
		if ( cols < 0 ) {
			cols = cols * -1;
		}
		return rows + cols;
	},

	at_goal: function(start, goal){
		if ( start.row == goal.row && start.col == goal.col ){
			return true;
		}
	},


	find_path2: function(matrix, start, goal){

		var node = jspath.node(start, goal, undefined);
		node.steps = 0;

		jspath.traverse(matrix, node, goal);

	},

	reverse_path: function(position){
		
		jspath.shortest_path.push(position.pos);
		if ( position.parent != undefined ){
			jspath.reverse_path(position.parent);
		}
	},

	node_exists: function(position){
		var found = false;

		// Check if we already have node in table
		$.each(jspath.nodes, function(){
			if ( this.pos.row == position.row && this.pos.col == position.col ){
				found = true;
			}	
		});
		return found;
	},

	traverse: function(matrix, position, goal){

		if ( jspath.at_goal(position.pos, goal) ) {
			console.log("We did it");
			jspath.reverse_path(position);
		} else {	

			//console.log("Looking at: " + position.pos.row + ", " + position.pos.col + ", " + position.weight);

			// Remove myself from jspath.nodes
			jspath.remove_node(position);

			// Add Nodes for this position
			$.each(jspath.directions(), function(){
				var row = position.pos.row + this.row;
				var col = position.pos.col + this.col;
				var pos = {row: row, col: col };

				if ( matrix[row] != undefined && matrix[row][col] == '.' && !jspath.node_exists(pos) ){
					var node = jspath.node(pos, goal, position);
					jspath.nodes.push(node);
				}
			});
		
			// Find the best node to work with 
			var next_node = jspath.lowest_weighted_node();

			if ( next_node != undefined ){
				if ( next_node.steps < 300 ){
					// Work it
					jspath.traverse(matrix, next_node, goal);
				}
			} else {
				console.log("no path found");
			}
		}
	},

	lowest_weighted_node: function(){
		var node = undefined;
		var weight = 0;

		$.each(jspath.nodes, function(){
			if ( this.active == true ) {
				if ( node == undefined || this.weight < weight ){
					node = this;
					weight = this.weight;
				}
			}
		});
		return node;
	},

	remove_node: function(node){
/*
		var index = undefined;
		for (var i = 0; i < jspath.nodes.length; i++){
			if ( jspath.nodes[i] === node ){
				index = i;
				break;
			}
		}
		if ( index != undefined ){
			jspath.nodes.splice(index, 1);
		}
*/
		node.active = false;
	},	

	find_path: function(matrix, start, goal){
		// Check if we are at goal
		if ( jspath.at_goal(start,goal) ){
			console.log("found it");
			return true;
		}

		var dirs = new Array();

		$.each(jspath.directions(),function(){
			var row = start.row + this.row;
			var col = start.col + this.col;
			var pos = {row: row, col: col };
			if ( matrix[row] != undefined && matrix[row][col] == '.' ){
				var distance = jspath.calculate_distance(pos, goal);
				dirs.push({distance: distance, pos: pos });
				matrix[row][col] = distance;
			}
		});

		while ( dirs.length > 0 ){
			var dir = jspath.shortest_dir(dirs);
			if( jspath.find_path(matrix, dir.pos, goal) == true ){
				jspath.shortest_path.push(dir.pos);
				return true;
			}
			jspath.remove_dir(dirs, dir);
		}
	},

	remove_dir: function(dirs, dir){
		var index = 0;
		for (var i = 0; i < dirs.length; i++){
			if ( dirs[i] === dir ){
				index = i;
			}
		}
		dirs.splice(index, 1);
	},

	shortest_dir: function(dirs){
		var shortest = undefined;
		var shortest_distance = 0;
		$.each(dirs, function(){
			if ( shortest == undefined || this.distance < shortest_distance ){
				shortest = this;
				shortest_distance = this.distance;
			}
		});
		return shortest;
	}
}



