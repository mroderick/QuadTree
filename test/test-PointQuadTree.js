/*
Copyright (c) 2012-2013 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org
*/
/*jslint white:true, plusplus:true */
/*global
    buster,
    assert,
    require,
    console,
    refute
*/
define(['PointQuadTree'], function(PointQuadTree){
    "use strict";

    var assert = buster.assert;

    buster.testCase( "PointQuadTree - API", {

        // API doumentation tests
        "must have set method" : function(){
            var qt = new PointQuadTree();
            assert.isFunction( qt.set );
        },

        "must have get method" : function(){
            var qt = new PointQuadTree();
            assert.isFunction( qt.get );
        },

        "must have remove method" : function(){
            var qt = new PointQuadTree();
            assert.isFunction( qt.remove );
        }
    });

    buster.testCase( "PointQuadTree instance", {

        "set method should return true" : function(){
            var qt = new PointQuadTree(),
                position = {
                    x : 1,
                    y : 1
                },
                value = 'blue',
                result = qt.set( position, value );

            assert( result );
        },

        "set method should overwrite existing value at a position" : function(){
            var qt = new PointQuadTree(),
                position = {
                    x : 1,
                    y : 1
                },
                valueRed = 'red',
                valueBlue = 'blue';

            qt.set( position, valueRed );
            assert.equals( qt.get( position ), valueRed );

            qt.set( position, valueBlue );
            assert.equals( qt.get( position ), valueBlue );
        },

        "get method should return the last inserted value for a position" : function(){
            var qt = new PointQuadTree(),
                position = {
                    x : 1,
                    y : 1
                },
                value = 'red';

            qt.set( position, value );

            assert.equals( qt.get( position ), value );
        },

        "get method should return undefined for non-existing index" : function(){

            var qt = new PointQuadTree(),
                position = {
                    x : 1,
                    y : 1
                },
                value = 'red',
                unusedPosition = {
                    x : 2,
                    y : 2
                };

            qt.set( position, value );

            assert.equals( qt.get( unusedPosition ), undefined );
        },

        "remove method must not fail on an empty PointQuadTree" : function(){
            var qt = new PointQuadTree(),
                position = {
                    x : 1,
                    y : 1
                };


            assert( qt.remove( position ) );
        },

        "remove method must not fail on unused positions" : function(){
            var qt = new PointQuadTree(),
                position = {
                    x : 1,
                    y : 1
                },
                unusedPosition = {
                    x : -1,
                    y : -1
                };

            qt.set( position, 'some value' );

            assert( qt.remove( unusedPosition ) );
        },

        "remove method should only remove the specified index" : function(){
            var qt = new PointQuadTree(),
                position1 = {
                    x : 1,
                    y : 1
                },
                value = 'SOME VALUE',
                ITERATIONS = 10,
                positions = [],
                i, p;

            qt.set( position1, value );

            // generate more positions that can be verified after removing the first one
            for ( i = 0; i < ITERATIONS; i++ ){
                p = {
                    x : i * 100,
                    y : i * 100
                };

                positions.push( p );
                qt.set( p, value );
            }

            qt.remove( position1 );

            assert.equals( qt.get( position1 ), undefined );

            positions.forEach( function( p ){
                assert.equals( qt.get( p ), value );
            });
        },

        "remove method should remove existing index" : function(){
            var qt = new PointQuadTree(),
                position = {
                    x : 1,
                    y : 1
                },
                value = 'red';

            qt.set( position, value );
            assert.equals( qt.get( position ), value );

            qt.remove( position );
            assert.equals( qt.get( position ), undefined );
        }
    });
});
