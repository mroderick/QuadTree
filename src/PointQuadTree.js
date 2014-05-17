/*
Copyright (c) 2012-2013 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org
*/
/*jslint white:true */
/*global
	define
*/
define(function(){
	'use strict';

	/**
	 *	Returns a String describing a "quad position" for a child position within a parent position
	 *	These are used for mapping into the NW, NE, SW and SW properties on the Node object
	 *	@example
	 *	getQuadrant( { x : 1, y : 1 }, { x : 1, y : 2 } ); => "NE"
	 */
	function getQuadrant( parent, child ){
		var longitude = child.x < parent.x ? 'W' : 'E',
			latitude  = child.y > parent.x ? 'N' : 'S',
			targetPos = String( latitude + longitude );

		return targetPos;
	}

	function isSamePosition( first, second ){
		return first.x === second.x && first.y === second.y;
	}


	function retrieve( root, position ){
		var positionFound = isSamePosition( root.position, position ),
			quadrant, quadrantNode, result;

		if ( positionFound ){
			result       = root;
		} else {
			quadrant     = getQuadrant( root.position, position );
			quadrantNode = root[quadrant];
			result       = quadrantNode && retrieve( quadrantNode, position );
		}

		return result;
	}

	function insert( root, node ){
		var positionFound = isSamePosition( root.position, node.position ),
			quadrant;

		if ( positionFound ){
			root.value = node.value;
		} else {
			quadrant = getQuadrant( root.position, node.position );

			if ( root[quadrant] === undefined ){
				root[quadrant] = node;
			} else {
				insert( root[quadrant], node );
			}
		}

		return true;
	}

	function getChildNodes(node){
		return [ node.NW, node.NE, node.SW, node.SE ].filter( function(o){
			return o !== undefined;
		});
	}

	// destroys a node at a given position by removing the reference from the parent node,
	// returning any orphaned nodes
	function destroy( root, position ){

		var quadrant = getQuadrant( root.position, position ),
			targetNode = root[quadrant],
			positionFound = targetNode && isSamePosition( targetNode.position, position ),
			result;

		if ( positionFound ){
			// save any orhpaned nodes
			result = getChildNodes( targetNode );

			// delete the reference to the node, freeing it up for garbage collection
			// (when this function exits)
			delete root[quadrant];

		} else if ( targetNode ) {
			result = destroy( targetNode, position );
		}

		return result;
	}

	// constructor
	function Node( position, value ){
		this.position = position;
		this.value = value;
	}

	/**
	 *	@constructor
	 */
	function PointQuadTree(){

		var self = this,
			root;

		/**
		 *	Sets the value for a specified position
		 *	@param (Object)	position    A position object
		 *	@param (any)    value       Any JavaScript value
		 */
		self.set = function set( position, value ){
			var node = new Node( position, value );

			// fixme: when setting undefined value, call the remove function and remove the node

			if ( !root ){
				root = node;
			} else {
				insert( root, node );
			}

			return true;
		};

		/**
		 *	Returns the value stored at specified position
		 *	@param (Object)	position     A position object
		 */
		self.get = function get( position ){
			var node = root && retrieve( root, position ),
				value = (node && node.value) || undefined;

			return value;
		};

		/**
		 *	Removes any value stored at specified position
		 *	@param (Object)	position     A position object
		 *	@returns (Boolean)
		 */
		self.remove = function remove( position ){
			var positionFound = root && isSamePosition( root.position, position ),
				orphans;

			if ( positionFound ){
				orphans = getChildNodes( root );
				root = undefined;
			} else {
				orphans = root && destroy( root, position );
			}

			// re-insert any orphaned nodes
			if ( orphans && orphans.length > 0 ){

				// if there is no root, make the first orphan the new root
				if ( !root ){
					root = orphans.shift();
				}

				// re-insert all remaining orphans
				orphans.forEach( function(o){ insert( root, o ); });
			}

			return true;
		};

		/**
		 *	Traverses entire tree, calling the passed fn for every node
		 *	@param (Object)	fn     A Function
		 *  TODO: write a example
		 */
		self.traverse = function traverse( fn ){
			function process(node){
				if (node){
					getChildNodes(node).forEach(function(child){
						process(child);
					});
					fn.call(self, node.position, node.value );
				}
			}

			process(root);
		};

		/**
		 *	Counts the number of nodes stored in the tree
		 *  @returns (Number)
		 */
		self.size = function size(){
			var treeSize = 0;

			self.traverse(function(){
				treeSize += 1;
			});

			return treeSize;
		};

		/**
		 *	Returns an Array of objects with position and value properties
		 *	@returns (Array)
		 *  TODO: Show a code example
		 */
		self.toArray = function toArray(){
			var arr = [];

			self.traverse(function(position, value){
				arr.push({
					position : position,
					value : value
				});
			});

			return arr;
		};
	}

	return PointQuadTree;
});