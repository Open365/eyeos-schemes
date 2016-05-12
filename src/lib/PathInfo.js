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

define([], function () {
	function PathInfo (eyeosPath, scheme, username, workgroupname) {
		this.eyeosPath = eyeosPath;
		this.scheme = scheme;
		this.username = username;
		this.workgroupName = workgroupname;
	}

	PathInfo.prototype.isUserPath = function () {
		return this.isUserHomePath() || this.scheme === 'network';
	};

	PathInfo.prototype.isUserHomePath = function () {
		return this.scheme === 'home';
	};

	PathInfo.prototype.isWorkgroupPath = function () {
		return this.scheme === 'workgroup';
	};

	PathInfo.prototype.isPrintPath = function () {
		return this.scheme === 'print';
	};

	PathInfo.prototype.getUsername = function () {
		if (this.isWorkgroupPath()) {
			throw new Error("path " + this.eyeosPath + " is not a user or print path");
		}
		if (!this.username) {
			throw new Error("Can't get original username for path " + this.eyeosPath);
		}
		return this.username;
	};

	PathInfo.prototype.getWorkGroupName = function () {
		if (!this.isWorkgroupPath()) {
			throw new Error("path " + this.eyeosPath + " is not a workgroup path");
		}
		return this.workgroupName;
	};

	PathInfo.prototype.getEyeosPath = function () {
		return this.eyeosPath;
	};

	PathInfo.prototype.getRelativePath = function () {
		if (!this.relativePath) {
			// relative path is the local part of the scheme. So
			// for an eyeosPath home:///foo/bar the relPath is /foo/bar
			var stripInitial = this.scheme.length + 3; // +3 for ://

			// for workgroups, the relative part does not include the name of the
			// workgroup
			if (this.isWorkgroupPath()) {
				stripInitial += this.getWorkGroupName().length + 1; // +1 for slash
			}
			return this.eyeosPath.substr(stripInitial);
		}
		return this.relativePath;
	};

	return PathInfo;
});
