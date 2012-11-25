
var jspath = {

	shortest_path: new Array(),

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



