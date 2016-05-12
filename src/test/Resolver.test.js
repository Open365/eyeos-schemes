/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var requirejs = require('requirejs');
var assert = require('chai').assert;
var sinon = require('sinon');

requirejs.config({
	nodeRequire: require,
	baseUrl: __dirname + '/../lib'
});

var settings = requirejs('../settings');
var Resolver = requirejs('./Resolver');
var PathInfo = requirejs('./PathInfo');

suite('Resolver', function () {
	var username = 'john.doe';
	var pathInfoSpy;
	var sut;

	setup(function () {
		pathInfoSpy = sinon.spy();
	});

	function getSuiteForGetPath (testData) {
		return function () {
			var path;
			var eyeosPath;
			for (var i = 0; i < testData.length; i++) {
				eyeosPath = testData[i].eyeosPath;
				path = testData[i].path;
				(function (input, output) {
					return test("returns correct result for input " + input, function () {
						var actual = sut.getPath(input, username);
						assert.equal(actual, output);
					});
				})(eyeosPath, path);
			};
		};
	}

	function getSuiteForGetEyeosPath (testData) {
		return function () {
			var path;
			var eyeosPath;
			for (var i = 0; i < testData.length; i++) {
				eyeosPath = testData[i].eyeosPath;
				path = testData[i].path;
				(function (input, output) {
					return test("returns correct result for input " + input, function () {
						var actual = sut.getEyeosPath(input);
						assert.equal(actual, output);
					});
				})(path, eyeosPath);

			}
		}
	}

	function getSuiteForGetPathInfo (testData) {
		return function () {
			var path;
			var eyeosPath;
			var pathInfoArgs;
			for (var i = 0; i < testData.length; i++) {
				path = testData[i].path;
				pathInfoArgs = testData[i].pathInfoExpectedArgs;
				(function (input, expectedArgs) {
					return test("Creates a new PathInfo object with the correct args for input " + input, function () {
						var actual = sut.getPathInfo(input);
						assert.deepEqual(pathInfoSpy.args[0], expectedArgs);
					});
				})(path, pathInfoArgs);

			}
		}
	}


	suite('(Notify Map)', function () {
		var testData = [
			{
				path: "/users/" + username + "/files/Documents/foo.doc",
				eyeosPath: "home:///Documents/foo.doc",
				pathInfoExpectedArgs: ["home:///Documents/foo.doc", "home", username, undefined]
			},
			{
				path: "/users/" + username + "/workgroups/my workgroup/foo.doc",
				eyeosPath: "workgroup:///my workgroup/foo.doc",
				pathInfoExpectedArgs: ["workgroup:///my workgroup/foo.doc", "workgroup", username, "my workgroup"]
			},
			{
				path: "/users/" + username + "/print/something.pdf",
				eyeosPath: "print:///something.pdf",
				pathInfoExpectedArgs: ["print:///something.pdf", "print", username, undefined]
			},
			{
				path: "/users/" + username + "/files/doh/lol",
				eyeosPath: "home:///doh/lol",
				pathInfoExpectedArgs: ["home:///doh/lol", "home", username, undefined]
			},
			{
				path: "/users/" + username + "/workgroups/doh/lol",
				eyeosPath: "workgroup:///doh/lol",
				pathInfoExpectedArgs: ["workgroup:///doh/lol", "workgroup", username, "doh"]
			},
			{
				path: "/users/" + username + "/files/.Trash/doh/lol",
				eyeosPath: "trash:///doh/lol",
				pathInfoExpectedArgs: ["trash:///doh/lol", "trash", username,undefined]
			},
			{
				path: "/users/" + username + "/files/",
				eyeosPath: "home:///",
				pathInfoExpectedArgs: ["home:///", "home", username, undefined]
			},
			{
				path: "/users/" + username + "/local/foo bar/baz.pdf",
				eyeosPath: "local:///foo bar/baz.pdf",
				pathInfoExpectedArgs: ["local:///foo bar/baz.pdf", "local", username, undefined]
			}
		];

		setup(function () {
			sut = new Resolver(settings.notifyMap, pathInfoSpy);
		});

		suite('#getPath', getSuiteForGetPath(testData));

		suite('#getEyeosPath', getSuiteForGetEyeosPath(testData));

		suite('#getPathInfo', getSuiteForGetPathInfo(testData));
	});

	suite('(CDN Map)', function () {
		var testData = [
			{
				path: "/userfiles/Documents/foo.doc",
				eyeosPath: "home:///Documents/foo.doc",
				pathInfoExpectedArgs: ["home:///Documents/foo.doc", "home", undefined, undefined]
			},
			{
				path: "/groupfiles/my workgroup/foo.doc",
				eyeosPath: "workgroup:///my workgroup/foo.doc",
				pathInfoExpectedArgs: ["workgroup:///my workgroup/foo.doc", "workgroup", undefined, "my workgroup"]
			},
			{
				path: "/printfiles/something.pdf",
				eyeosPath: "print:///something.pdf",
				pathInfoExpectedArgs: ["print:///something.pdf", "print", undefined, undefined]
			},
			{
				path: "/userfiles/doh/lol",
				eyeosPath: "home:///doh/lol",
				pathInfoExpectedArgs: ["home:///doh/lol", "home", undefined, undefined]
			},
			{
				path: "/groupfiles/doh/lol",
				eyeosPath: "workgroup:///doh/lol",
				pathInfoExpectedArgs: ["workgroup:///doh/lol", "workgroup", undefined, "doh"]
			},
			{
				path: "/localfiles/foo bar/baz.pdf",
				eyeosPath: "local:///foo bar/baz.pdf",
				pathInfoExpectedArgs: ["local:///foo bar/baz.pdf", "local", undefined, undefined]
			}
		];

		setup(function () {
			sut = new Resolver(settings.cdnMap, pathInfoSpy);
		});

		suite('#getPath', getSuiteForGetPath(testData));

		suite('#getEyeosPath', getSuiteForGetEyeosPath(testData));

		suite('#getPathInfo', getSuiteForGetPathInfo(testData));
	});

	suite('getSchemeList', function () {
		var map;
		var sut;

		setup(function () {
			map = {
				'foo': 'whatever',
				'bar': 'whatever',
				'_baz': 'not present'
			};

			sut = new Resolver(map, pathInfoSpy);
		});

		test('returns the correct schemeList', function () {
			var expected = ['foo', 'bar'];
			var actual = sut.getSchemeList();
			assert.deepEqual(actual, expected);
		});
	});

	suite('#getPath', function() {
		test('should return false if invalid scheme', function () {
			var realPath = sut.getPath('daskampdemeister');
			assert.isFalse(realPath);
		});
	});

	suite('#getEyeosPath', function () {
		test('should return false if invalid scheme', function () {
			assert.isFalse(sut.getEyeosPath('daskampdemeister'));
		});
	});

	suite('#getPathInfo', function () {
		setup(function () {
			sut = new Resolver(settings.notifyMap, PathInfo);
		});

		var TestCase = [
			{ path: "/fake/" },
			{ path: "/users/" + username + "/fake" },
			{ path: "/users/" + username },
			{ path: "/users/" + username + "/filesdoh" },
			{ path: "/users/" + username + "/printdoh" }
		];

		TestCase.forEach(function (info) {
			test('when path is invalid should return false', function () {
				var current = sut.getPathInfo(info.path);
				assert.isFalse(current);
			});
		});

		test('should return a PathInfo', function () {
			var path = "/users/" + username + "/workgroups/";
			var current = sut.getPathInfo(path);
			assert.instanceOf(current, PathInfo);
		});
	});

	suite("#isEyeosPathEmpty", function () {

		setup(function () {
			sut = new Resolver(settings.notifyMap, PathInfo);
		});

		var TestCase = [
			{ eyeosPath: "home:///", expected: true },
			{ eyeosPath: "home:///fake/fake", expected: false },
			{ eyeosPath: "workgroup:///fakeWorkgroup/" , expected: true },
			{ eyeosPath: "workgroup:///fakeWorkgroup/fake", expected: false }
		];

		TestCase.forEach(function (info) {
			test('when path is invalid should return false', function () {
				var current = sut.isEyeosPathEmpty(info.eyeosPath);
				assert.equal(current, info.expected);
			});
		});
	});

	suite("#isLocalScheme", function () {

		setup(function () {
			sut = new Resolver(settings.notifyMap, PathInfo);
		});

		var TestCase = [
			{ path: "/users/foo/files", expected: false },
			{ path: "/users/foo/print", expected: false },
			{ path: "/users/foo/workgroups/bar/" , expected: false },
			{ path: "/users/foo/local", expected: true }
		];

		TestCase.forEach(function (info) {
			test('when path ' + info.path + ' should return ' + info.expected, function () {
				var current = sut.isLocalScheme(info.path);
				assert.equal(current, info.expected);
			});
		});
	});
});
