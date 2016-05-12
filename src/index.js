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

/**
 * "amdefine/intercept" is experimental. If "define" is not defined add the next snipped to each module:
 * 		if (typeof define !== 'function') { var define = require('amdefine')(module) }
 * and remove this require. More info: https://github.com/jrburke/amdefine
 */
//NOTE: If you need to do require of a moduled defined with requirejs, enable this.
//require('amdefine/intercept');

requirejs.config({
	nodeRequire: require,
	baseUrl: __dirname + "/lib/"
});


var ResolverFactory = requirejs('./ResolverFactory');

module.exports = ResolverFactory;
