var config = module.exports;

config["browser"] = {
	rootPath: "./",
	environment: "browser",

	libs : [
		'test/require-config.js',
		'src/lib/require-2.1.5.js'
	],

	sources: [
		"src/**/*.js"
	],

	tests: [
		"test/test-PointQuadTree.js"
	],

	extensions: [
		require("buster-amd")
	]
};