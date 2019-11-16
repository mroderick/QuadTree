"use strict";

var assert = require("@sinonjs/referee").assert;
var PointQuadTree = require("./index");

describe("PointQuadTree", function() {
    describe("#set", function() {
        it("returns true", function() {
            var qt = new PointQuadTree(),
                position = {
                    x: 1,
                    y: 1
                },
                value = "blue",
                result = qt.set(position, value);

            assert.isTrue(result);
        });

        it("overwrites existing value at a position", function() {
            var qt = new PointQuadTree(),
                position = {
                    x: 1,
                    y: 1
                },
                valueRed = "red",
                valueBlue = "blue";

            qt.set(position, valueRed);
            assert.equals(qt.get(position), valueRed);

            qt.set(position, valueBlue);
            assert.equals(qt.get(position), valueBlue);
        });
    });

    describe("#get", function() {
        it("returns the last inserted value for a position", function() {
            var qt = new PointQuadTree(),
                position = {
                    x: 1,
                    y: 1
                },
                value = "red";

            qt.set(position, value);

            assert.equals(qt.get(position), value);
        });

        it("returns undefined for non-existing index", function() {
            var qt = new PointQuadTree(),
                position = {
                    x: 1,
                    y: 1
                },
                value = "red",
                unusedPosition = {
                    x: 2,
                    y: 2
                };

            qt.set(position, value);

            assert.equals(qt.get(unusedPosition), undefined);
        });
    });

    describe("#remove", function() {
        it("must not fail on an empty PointQuadTree", function() {
            var qt = new PointQuadTree(),
                position = {
                    x: 1,
                    y: 1
                };

            assert(qt.remove(position));
        });

        it("must not fail on unused positions", function() {
            var qt = new PointQuadTree(),
                position = {
                    x: 1,
                    y: 1
                },
                unusedPosition = {
                    x: -1,
                    y: -1
                };

            qt.set(position, "some value");

            assert(qt.remove(unusedPosition));
        });

        it("removes only the specified index", function() {
            var qt = new PointQuadTree(),
                position1 = {
                    x: 1,
                    y: 1
                },
                value = "SOME VALUE",
                ITERATIONS = 10,
                positions = [],
                i,
                p;

            qt.set(position1, value);

            // generate more positions that can be verified after removing the first one
            for (i = 0; i < ITERATIONS; i++) {
                p = {
                    x: i * 100,
                    y: i * 100
                };

                positions.push(p);
                qt.set(p, value);
            }

            qt.remove(position1);

            assert.equals(qt.get(position1), undefined);

            positions.forEach(function(p) {
                assert.equals(qt.get(p), value);
            });
        });

        it("removes existing index", function() {
            var qt = new PointQuadTree(),
                position = {
                    x: 1,
                    y: 1
                },
                value = "red";

            qt.set(position, value);
            assert.equals(qt.get(position), value);

            qt.remove(position);
            assert.equals(qt.get(position), undefined);
        });
    });
});
