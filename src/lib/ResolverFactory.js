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

define(['../settings', './Resolver', './pathJoin'], function (settings, Resolver, pathJoin) {
	function ResolverFactory () {

	}

	/**
	 *
	 * @param type
	 * @param options; a map containing diverse options that may be used in the
	 * construction of the resolver.
	 * @returns {Resolver}
	 */
	ResolverFactory.getResolver = function (type, options) {
		switch (type.toLowerCase()) {
			case 'cdn':
				return new Resolver(settings.cdnMap);
			case 'notify':
				return new Resolver(settings.notifyMap);
			case 'filesystem':
				var map = {};
				if (options && options.mountPoint) {
					for (var scheme in settings.notifyMap) {
						if (settings.notifyMap.hasOwnProperty(scheme)) {
							if (scheme[0] !== "_") {
								map[scheme] = pathJoin(options.mountPoint, settings.notifyMap[scheme]);
							} else {
								map[scheme] = settings.notifyMap[scheme];
							}
						}
					}
				} else {
					throw new Error("You need to pass a mountpoint to get the Resolver for " + type);
				}
				return new Resolver(map);

			default:
				throw new Error("Resolver for type " + type + " does not exist.");
		}
	};

	return ResolverFactory;
});
