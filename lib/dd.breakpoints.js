/**
 * Deloitte Digital global namespace for modules
 * @namespace DD
 */
;(function() {
	'use strict';

	window.DD = window.DD || {};

	/**
	 * Breakpoints for JavaScript. Works with the Deloitte Digital SCSS @bp mixin
	 *
	 * @namespace bp
	 * @memberof DD
	 * @version 1.0.0
	 * @copyright 2012-2014 Deloitte Digital Australia - http://www.deloittedigital.com/au
	 * @author Deloitte Digital Australia deloittedigital@deloitte.com.au
	 * @license BSD 3-Clause (http://opensource.org/licenses/BSD-3-Clause)
	 */
	window.DD.bp = (function() {
		var _minBreakpoints,
			_maxBreakpoints,
			_options = {
				isResponsive: true,
				baseFontSize: 16,
				breakpoints: [
					{
						name: 'xxs',
						px: 359
					},
					{
						name: 'xs',
						px: 480
					},
					{
						name: 's',
						px: 640
					},
					{
						name: 'm',
						px: 768
					},
					{
						name: 'l',
						px: 1024
					},
					{
						name: 'xl',
						px: 1244
					},
					{
						name: 'xxl',
						px: 1410
					}
				],
				staticRange: {
					min: 0,
					max: 'xl'
				}
			},
			_initBreakpoints,
			_parseMinMaxInputs,
			_pxToEms,
			_bpToEms,
			_bpIsValidForStatic,
			_bpMin,
			_bpMax,
			_bpBetween,
			get,
			getHeight,
			is,
			isHeight,
			options;

		/**
		 * Sorts the breakpoints and assigns them to an associative array for more efficient lookup.
		 * Immediately invoked on initialisation
		 *
		 * @memberof DD.bp
		 * @private
		 */
		_initBreakpoints = function() {
			//sort the breakpoints into order of smallest to largest
			var sortedBreakpoints = _options.breakpoints.sort(function(a, b) {
				// only sort if the correct objects are present
				if (a.px < b.px) {
					return -1;
				}

				if (a.px > b.px) {
					return 1;
				}

				return 0;
			});

			// reset the breakpoints
			_minBreakpoints = {};
			_maxBreakpoints = {};

			// loop through sorted breakpoints to generate a quick lookup object using the name as a key
			for (var i = 0, len = sortedBreakpoints.length, last = len - 1; i < len; i += 1) {
				_minBreakpoints[sortedBreakpoints[i].name] = parseInt(sortedBreakpoints[i].px, 10);

				// skip the last item in the list as we assume there is no maximum for the last
				if (i < last) {
					// the max breakpoint of the current size is the next breakpoints
					// width minus 1px so there is no overlap between breakpoints
					_maxBreakpoints[sortedBreakpoints[i].name] = parseInt(sortedBreakpoints[i + 1].px - 1, 10);
				}
			}
		};
		_initBreakpoints();

		/**
		 * Splits string syntax 'xs,m' into separate values 'xs' and 'm'
		 * Converts string '5' to numeric 5
		 *
		 * @memberof DD.bp
		 * @private
		 * @param  {String|Number} min Number in pixels or string notation
		 * @param  {String|Number} max Number in pixels or string notation
		 * @return {Object} Object containing the min and max values parsed as a number
		 */
		_parseMinMaxInputs = function(min, max) {
			var parseValue = function(val) {
					if (typeof (val) === 'string') {
						// Strip whitespace
						val = val.replace(/\s/g, '');

						// If val only contains digits, convert it to a number
						if (/^\d+$/.test(val)) {
							val = parseInt(val, 10);
						}
					}

					return val;
				},
				bpArray,
				resultMin = min,
				resultMax = max || 0;

			// check if it's using the string syntax, if so - split it
			if (typeof (min) === 'string' && min.indexOf(',') !== -1 && resultMax === 0) {
				bpArray = min.split(',');
				if (bpArray.length === 2) {
					resultMin = bpArray[0];
					resultMax = bpArray[1];
				}
			}

			return {
				min: parseValue(resultMin),
				max: parseValue(resultMax)
			};
		};

		/**
		 * Converts a number of pixels into em
		 *
		 * @memberof DD.bp
		 * @private
		 * @param  {Number} px Number in pixels
		 * @return {String} The converted number in em as a string
		 */
		_pxToEms = function(px) {
			return px / _options.baseFontSize;
		};

		/**
		 * Converts a breakpoint name/value (e.g. l) to the px variable then to ems
		 *
		 * @memberof DD.bp
		 * @private
		 * @param  {String|Number} breakpoint Breakpoint name as a string, or as a number in pixels
		 * @param  {Boolean} [isMax=false] Flag to determine if the min or max of the breakpoint needs to be used
		 * @return {String} The converted number in em as a string
		 */
		_bpToEms = function(breakpoint, isMax) {
			if (typeof (breakpoint) === 'number') {
				return _pxToEms(breakpoint);
			}

			var list = (isMax === true) ? _maxBreakpoints : _minBreakpoints,
				ems = '0';

			for (var key in list) {
				if (list.hasOwnProperty(key)) {
					if (breakpoint === key.toLowerCase()) {
						ems = _pxToEms(list[key]);
					}
				}
			}

			if (ems === '0') {
				console.warn('DD.bp: Breakpoint \'' + breakpoint + '\' doesn\'t exist - replacing with 0');
			}

			return ems;
		};

		/**
		 * Checks if the breakpoint provided falls inside the valid static min/max region
		 *
		 * @memberof DD.bp
		 * @private
		 * @param  {String|Number} min Breakpoint name as a string, as a number in pixels, or as string notation containing both breakpoints
		 * @param  {String|Number} max Breakpoint name as a string, or as a number in pixels
		 * @param  {Boolean} [property='width'] which property to check for (e.g. width or height)
		 * @return {Boolean} If the breakpoint fits inside the static range or not
		 */
		_bpIsValidForStatic = function(min, max, property) {
			if (typeof (property) !== 'string') {
				property = 'width'; //default to width based media query
			}

			if (property !== 'width') {
				return false;
			}

			var bpValidMin = _bpToEms(_options.staticRange.min),
				bpValidMax = _bpToEms(_options.staticRange.max, true),
				parsed = _parseMinMaxInputs(min, max),
				bpMin = _bpToEms(parsed.min),
				bpMax = _bpToEms(parsed.max);

			// if max is 0 we have a min-and-above situation
			if (parsed.max === 0) {
				// need to check that the min is greater than the valid min,
				// AND also that the min is less than the valid maximum
				if (bpMin >= bpValidMin && bpMin < bpValidMax) {
					return true;
				}

				return false;
			}

			// if min is 0 we have a max-and-below situation
			if (parsed.min === 0) {
				if (bpMax >= bpValidMax) {
					return true;
				}

				return false;
			}

			// if the min is above the valid max, or the max is below the valid min
			if (bpMin > bpValidMax || bpMax < bpValidMin) {
				return false;
			}

			// if the breakpoint is a bp-between (assumed because $max and $min aren't 0)
			// don't show if the max isn't above the valid max
			if (bpMax < bpValidMax) {
				return false;
			}

			return true;
		};

		/**
		 * Returns a min-width media query based on bp name or px
		 *
		 * @memberof DD.bp
		 * @private
		 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels
		 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
		 * @return {String} Media query string
		 */
		_bpMin = function(min, property) {
			var bpMin = _bpToEms(min),
				bpType = (typeof (property) === 'string') ? property : 'width';

			return '(min-' + bpType + ': ' + bpMin + 'em)';
		};

		/**
		 * Returns a max-width media query based on bp name or px
		 *
		 * @memberof DD.bp
		 * @private
		 * @param  {String|Number} max Breakpoint name as a string, or as a number in pixels
		 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
		 * @return {String} Media query string
		 */
		_bpMax = function(max, property) {
			var bpMax = _bpToEms(max, true),
				bpType = (typeof (property) === 'string') ? property : 'width';

			return '(max-' + bpType + ': ' + bpMax + 'em)';
		};

		/**
		 * Returns a min-width and max-width media query based on bp name (can be the same bp name) or px
		 *
		 * @memberof DD.bp
		 * @private
		 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels
		 * @param  {String|Number} max Breakpoint name as a string, or as a number in pixels
		 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
		 * @return {String} Media query string
		 */
		_bpBetween = function(min, max, property) {
			var bpMin = _bpToEms(min),
				bpMax = _bpToEms(max, true),
				bpType = (typeof (property) === 'string') ? property : 'width';

			return '(min-' + bpType + ': ' + bpMin + 'em) and (max-' + bpType + ': ' + bpMax + 'em)';
		};

		/**
		 * Breakpoint function that can take the input of a min and max
		 * breakpoint by name or number (in px) along with a property
		 * (like width or height) and returns the media query as a string
		 *
		 * @memberof DD.bp
		 * @example
		 * // large and above
		 * DD.bp.get('l');
		 *
		 * @example
		 * // 300px and above
		 * DD.bp.get(300);
		 *
		 * @example
		 * // large and below
		 * DD.bp.get(0, 'l');
		 *
		 * @example
		 * // 300px and below
		 * DD.bp.get(0, 300);
		 *
		 * @example
		 * // Between small and large
		 * DD.bp.get('s', 'l');
		 *
		 * @example
		 * // Between 100px and 300px
		 * DD.bp.get(100, 300);
		 *
		 * @example
		 * // High resolution displays (can use 'hdpi' as well)
		 * DD.bp.get('retina');
		 *
		 * @example
		 * // Can mix and match names and numbers - between 200px and xlarge
		 * DD.bp.get(200, 'xl');
		 *
		 * @example
		 * // Between small and 960px
		 * DD.bp.get('s', 960);
		 *
		 * @example
		 * // Can use a single string (no spaces) - useful for passing through from HTML to JS
		 * DD.bp.get('m,l');
		 *
		 * @example
		 * // Can also mix names and numbers
		 * DD.bp.get('xs,1000');
		 *
		 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
		 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
		 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
		 * @return {String} Media query string
		 */
		get = function(min, max, property) {
			var parsed = _parseMinMaxInputs(min, max),
				bpMin = parsed.min,
				bpMax = parsed.max;

			if (typeof (property) !== 'string') {
				property = 'width'; //default to width based media query
			}

			//check what type of bp it is
			if (bpMin === 'retina' || bpMin === 'hdpi') {
				return '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-device-pixel-ratio: 1.5)';
			} else if (bpMax === 0) {
				return _bpMin(bpMin, property);
			} else if (bpMin === 0) {
				return _bpMax(bpMax, property);
			} else {
				return _bpBetween(bpMin, bpMax, property);
			}
		};

		/**
		 * Shortcut for the get() function that returns a height
		 * based media query and returns the media query as a string
		 *
		 * @memberof DD.bp
		 * @example
		 * // Height of 300px and above
		 * DD.bp.getHeight(300);
		 *
		 * @example
		 * // Height of 300px and below
		 * DD.bp.getHeight(0, 300);
		 *
		 * @example
		 * // Between 100px and 300px high
		 * DD.bp.getHeight(100, 300);
		 *
		 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
		 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
		 * @return {String} Media query string
		 */
		getHeight = function(min, max) {
			return get(min, max, 'height');
		};

		/**
		 * Breakpoint function that takes the same inputs as get() but
		 * instead of returning the media query as a string returns
		 * if the current page matches that query as a boolean using
		 * window.matchMedia(mq).matches
		 *
		 * @memberof DD.bp
		 * @example
		 * // returns true if the page is between xs and s
		 * DD.bp.is('xs,s');
		 * DD.bp.is('xs','s');
		 *
		 * @example
		 * // returns true if the page is between 0 and 300px wide
		 * DD.bp.is('0,300');
		 * DD.bp.is(0, 300);
		 *
		 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
		 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
		 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
		 * @return {Boolean}
		 */
		is = function(min, max, property) {
			if (_options.isResponsive === false) {
				return _bpIsValidForStatic(min, max, property);
			}

			if (window.matchMedia) {
				return window.matchMedia(get(min, max, property)).matches;
			}

			console.warn('DD.bp: Match Media not supported by this browser. Consider adding a polyfill.');

			return false;
		};

		/**
		 * Shortcut for the is() function that returns a height
		 * based media query and returns the media query as a boolean
		 *
		 * @memberof DD.bp
		 * @example
		 * // returns true if the page is between 0 and 300px high
		 * DD.bp.isHeight('0,300');
		 * DD.bp.isHeight(0, 300);
		 *
		 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
		 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
		 * @return {Boolean}
		 */
		isHeight = function(min, max) {
			return is(min, max, 'height');
		};

		/**
		 * Valid options for the Breakpoints array
		 *
		 * @typedef  {Object} DD.bp.BreakpointOptions
		 * @property {String} name Name of the breakpoint e.g. 's', 'm', 'l'
		 * @property {Number} px Number in px for the size of the breakpoint
		 */

		/**
		 * Valid options for the Breakpoints library
		 *
		 * @typedef  {Object} DD.bp.Options
		 * @property {Number} [baseFontSize] Number in px to be used as a base font size in order to calculate em values
		 * @property {DD.bp.BreakpointOptions[]} [breakpoints]
		 */

		/**
		 * User updatable options
		 *
		 * @memberof DD.bp
		 * @example
		 * // update the base font size only
		 * DD.bp.options({
		 *   baseFontSize: 14
		 * });
		 *
		 * @example
		 * // update the breakpoints
		 * DD.bp.options({
		 *   breakpoints: [
		 *     { name: 'small', px: 400 },
		 *     { name: 'medium', px: 800 },
		 *     { name: 'large', px: 1200 }
		 *   ]
		 * });
		 *
		 * @param  {DD.bp.Options} opts Options inside the library to be updated
		 * @return {Boolean}
		 */
		options = function(opts) {
			if (typeof (opts.isResponsive) === 'boolean') {
				_options.isResponsive = opts.isResponsive;
			}

			if (typeof (opts.baseFontSize) === 'number') {
				_options.baseFontSize = opts.baseFontSize;
			}

			if (typeof (opts.breakpoints) === 'object' && opts.breakpoints.length > 0) {
				var isValid = true,
					bps = opts.breakpoints;

				// loop through the breakpoints to check validity
				for (var i = 0, len = bps.length; i < len; i += 1) {
					if ((bps[i].hasOwnProperty('name') && bps[i].hasOwnProperty('px')) === false) {
						isValid = false;
					}
				}

				if (isValid) {
					_options.breakpoints = opts.breakpoints;
					_initBreakpoints();
				} else {
					console.warn('DD.bp: Invalid breakpoints array entered. Please use the format {name: \'string\', px: number}');
					return false;
				}
			}

			return true;
		};

		return {
			get: get,
			getHeight: getHeight,
			is: is,
			isHeight: isHeight,
			options: options
		};
	}());

}());
