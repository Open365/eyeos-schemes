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

requirejs.config({
	nodeRequire: require,
	baseUrl: __dirname + '/../lib'
});

var PathInfo = requirejs('./PathInfo');

suite('PathInfo', function () {
	var username = 'john.doe';

	setup(function () {

	});

	suite('home scheme', function () {
		var relativePath = '/Documents/foo.txt';
		var scheme = 'home';
		var eyeosPath = scheme + '://' + relativePath;
		var workgroup = undefined;

		var sut;
		setup(function () {
			sut = new PathInfo(eyeosPath, scheme, username, workgroup);
		});

		test('isUserPath returns true', function () {
			assert.isTrue(sut.isUserPath());
		});

		test('isWorkgroupPath returns false', function () {
			assert.isFalse(sut.isWorkgroupPath());
		});

		test('isPrintPath returns false', function () {
			assert.isFalse(sut.isPrintPath());
		});

		test('getUsername returns correct username', function () {
			assert.equal(sut.getUsername(), username);
		});

		test('getWorkGroupName throws exception', function () {
			assert.throws(function () {
				sut.getWorkGroupName();
			});
		});

		test('getEyeosPath returns correct eyeosPath', function () {
			assert.equal(sut.getEyeosPath(), eyeosPath);
		});

		test('getRelativePath returns correct relative path', function () {
			assert.equal(sut.getRelativePath(), relativePath);
		});
	});

	suite('workgroup scheme', function () {
		var scheme = 'workgroup';
		var relativePath = '/Documents/foo.txt';
		var workgroup = "some workgroup";
		var eyeosPath = scheme + ':///' + workgroup + relativePath;

		var sut;
		setup(function () {
			sut = new PathInfo(eyeosPath, scheme, username, workgroup);
		});

		test('isUserPath returns false', function () {
			assert.isFalse(sut.isUserPath());
		});

		test('isWorkgroupPath returns true', function () {
			assert.isTrue(sut.isWorkgroupPath());
		});

		test('isPrintPath returns false', function () {
			assert.isFalse(sut.isPrintPath());
		});

		test('getUsername throws exception', function () {
			assert.throws(function () {
				sut.getUsername();
			});
		});

		test('getWorkGroupName returns correct workgroup name', function () {
			assert.equal(sut.getWorkGroupName(), workgroup);
		});

		test('getEyeosPath returns correct eyeosPath', function () {
			assert.equal(sut.getEyeosPath(), eyeosPath);
		});

		test('getRelativePath returns correct relative path', function () {
			assert.equal(sut.getRelativePath(), relativePath);
		});
	});

	suite('print scheme', function () {
		var scheme = 'print';
		var relativePath = '/Documents/foo.txt';
		var eyeosPath = scheme + '://' + relativePath;
		var workgroup = undefined;

		var sut;
		setup(function () {
			sut = new PathInfo(eyeosPath, scheme, username, workgroup);
		});

		test('isUserPath returns false', function () {
			assert.isFalse(sut.isUserPath());
		});

		test('isWorkgroupPath returns false', function () {
			assert.isFalse(sut.isWorkgroupPath());
		});

		test('isPrintPath returns true', function () {
			assert.isTrue(sut.isPrintPath());
		});

		test('getUsername returns correct username', function () {
			assert.equal(sut.getUsername(), username);
		});

		test('getWorkGroupName throws exception', function () {
			assert.throws(function () {
				sut.getWorkGroupName();
			});
		});

		test('getEyeosPath returns correct eyeosPath', function () {
			assert.equal(sut.getEyeosPath(), eyeosPath);
		});

		test('getRelativePath returns correct relative path', function () {
			assert.equal(sut.getRelativePath(), relativePath);
		});
	});

	suite('without username', function () {
		var sut;

		setup(function () {
			sut = new PathInfo("home:///foo.txt", "home", undefined, undefined);
		});

		test('getUsername throws error if don\'t have username', function () {
			assert.throws(function () {
				sut.getUsername();
			});
		});
	});

	suite('#isUserHomePath', function () {
		var sut;

		setup(function () {

		});

		test('should return true if scheme is home', function () {
			sut = new PathInfo("home:///foo.txt", "home", undefined, undefined);
			assert.isTrue(sut.isUserHomePath());
		});

		test('should return false if scheme is not home', function () {
			sut = new PathInfo("home:///foo.txt", "network", undefined, undefined);
			assert.isFalse(sut.isUserHomePath());
		});
	});
});
