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

define(['./PathInfo'], function (PathInfo) {

	function _getEyeosPathFromRegExpMatches (wgIndex, scheme, matches) {
		var path = trimTrailingSlashes(matches.input.substr(matches[0].length)) || '/';
		if (path[0] != '/') {
			return false;
		}
		switch (scheme) {
			case 'home':
			case 'trash':
			case 'print':
			case 'network':
			case 'local':
				return scheme + '://' + path;

			case 'workgroup':
				return scheme + ':///' + matches[wgIndex] + path;

			default:
				return false;
		}
	}

	function trimTrailingSlashes (aPath) {
		return aPath.replace(/\/+$/g, '');
	}

	function _getScheme (eyeosPath) {
		var scheme = eyeosPath.split('://')[0];
		if (!this.map.hasOwnProperty(scheme)) {
			return false;
		}
		return scheme;
	}

	function _getNotifyPath (scheme) {
		var notifyPath = this.map[scheme];
		if (!notifyPath) {
			return false;
		}
		return notifyPath;
	}

	function Resolver (map, pathInfo) {
		var strRegex;
		this.map = map;
		this.PathInfo = pathInfo || PathInfo;
		this.schemeRegexes = {};
		for (var scheme in this.map) {
			if (this.map.hasOwnProperty(scheme) && scheme[0] !== "_") {
				strRegex = this.map[scheme].replace(/%USER%/g, '([^/]+)');
				this.schemeRegexes[scheme] = new RegExp(strRegex.replace(/%WORKGROUP%/g, '([^/]*)'));
			}
		}
	}

	Resolver.prototype.getPath = function (eyeosPath, eyeosUsername) {
		var scheme = _getScheme.call(this, eyeosPath);
		if (!scheme) {
			return false;
		}
		var notifyPath = _getNotifyPath.call(this, scheme);
		if (!notifyPath) {
			return false;
		}

		var parts = eyeosPath.split(/\/+/);
		var path;

		if (scheme === "workgroup") {
			var workgroupName = parts[1];
			notifyPath = notifyPath.replace('%WORKGROUP%', workgroupName);
			path = parts.slice(2).join('/');
		} else {
			path = parts.slice(1).join('/');
		}
		notifyPath = notifyPath.replace('%USER%', eyeosUsername) + '/' + path;
		return notifyPath;
	};

	Resolver.prototype.getEyeosPath = function (notifiedPath) {
		// can be:
		//     /users/john.doe/files/Documents/foo.doc
		//     /users/john.doe/files/
		//     /users/john.doe/workgroups/my workgroup/foo.doc
		//     /users/john.doe/workgroups/
		//     /users/john.doe/print/something.pdf
		//     /workgroups/my workgroup/foo.doc

		var matches;
		for (var scheme in this.schemeRegexes) {
			if (matches = this.schemeRegexes[scheme].exec(notifiedPath)) {
				return _getEyeosPathFromRegExpMatches(this.map._workgroupIndex, scheme, matches);
			}
		}
		return false;
	};

	Resolver.prototype.getSchemeList = function () {
		var schemes = [];
		for (var scheme in this.map) {
			if (this.map.hasOwnProperty(scheme) && scheme[0] !== "_") {
				schemes.push(scheme);
			}
		}
		return schemes;
	};

	Resolver.prototype.getPathInfo = function (path) {
		var matches;
		for (var scheme in this.schemeRegexes) {
			if (matches = this.schemeRegexes[scheme].exec(path)) {
				var eyeosPath = _getEyeosPathFromRegExpMatches(this.map._workgroupIndex, scheme, matches);
				if (eyeosPath) {
					return new this.PathInfo(eyeosPath, scheme, matches[this.map._usernameIndex], matches[this.map._workgroupIndex]);
				}
			}
		}
		return false;
	};

	Resolver.prototype.isEyeosPathEmpty = function (eyeosPath) {
		var index = 1,
			eyeosFilesPath, split;
		var scheme = _getScheme.call(this, eyeosPath);
		if (!scheme) {
			return false;
		}
		if (!_getNotifyPath.call(this, scheme)) {
			return false;
		}

		eyeosFilesPath = eyeosPath.substr(eyeosPath.indexOf("://") + 3);
		split = eyeosFilesPath.split("/");
		if (scheme === "workgroup") {
			index = 2;
		}
		return split[index].length === 0;
	};

	Resolver.prototype.isLocalScheme = function (path) {
		return this.schemeRegexes['local'].test(path);
	};


	return Resolver;
});
