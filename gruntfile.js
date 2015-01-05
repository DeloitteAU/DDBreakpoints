'use strict';

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-gh-pages');

	grunt.initConfig({
		'gh-pages': {
			options: {
				base: 'docs'
			},
			src: ['**']
		}
	});

	grunt.registerTask('deploy', [
		'gh-pages-clean',
		'gh-pages'
	]);
};
