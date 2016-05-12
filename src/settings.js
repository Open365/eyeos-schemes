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

define(['pathJoin'], function (pathJoin) {
	var notifyMap = {
		trash: '/users/%USER%/files/.Trash',
		home: '/users/%USER%/files',
		workgroup: '/users/%USER%/workgroups/%WORKGROUP%',
		network: '/users/%USER%/networkdrives',
		print: '/users/%USER%/print',
		local: '/users/%USER%/local',
		// in the workgroup scheme, which placeholder is %WORKGROUP% (starting by 1)
		_workgroupIndex: 2,
		_usernameIndex: 1
	};

	var cdnMap = {
		home: '/userfiles',
		trash: '/userfiles/.Trash',
		workgroup: '/groupfiles/%WORKGROUP%',
		network: '/networkdrives',
		print: '/printfiles',
		local: '/localfiles',
		// in the workgroup scheme, which placeholder is %WORKGROUP% (starting by 1)
		_workgroupIndex: 1,
		// username not present in the mappings
		_usernameIndex: false
	};

	var settings = {
		// if you add another map, add the corresponding suite in Resolver.test.js!
		notifyMap: notifyMap,
		cdnMap: cdnMap
		// if you add another map, add the corresponding suite in Resolver.test.js!
	};

	return settings;
});
