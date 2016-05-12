module.exports = function(grunt) {
	require("eyeos-gruntfile")(grunt, "eyeos-schemes");
	grunt.config('requirejs', {
		"options": {
			"baseUrl": "src/lib",
			"name": "ResolverFactory",
	        "optimize": "none",
	        "optimizeAllPluginResources": true,
	        "wrap": true,
			onBuildWrite: function (moduleName, path, contents) {
				//replace generated name on main "define" in order to use it by other libs
				return contents.replace(/'ResolverFactory',/g, '');
			}
		},
		"debug": {
			"options": {
				"out": "<%= dirs.dist %>-browser/<%= pkg.name %>.js"
			}
		},
		"release": {
			"options": {
				"out": "<%= dirs.dist %>-browser/<%= pkg.name %>.min.js",
				"optimize": "uglify"
			}
		}
	});
};
