/**
 * Breakpoints for JavaScript (ES6). Works with the Deloitte Digital SCSS @bp mixin and Less .bp mixin
 *
 * @namespace DDBreakpoints
 * @version 2.0.4
 * @copyright 2012-2021 Deloitte Digital Australia - http://www.deloittedigital.com/au
 * @author Deloitte Digital Australia deloittedigital@deloitte.com.au
 * @license BSD 3-Clause (http://opensource.org/licenses/BSD-3-Clause)
 *
 * @example
 * import DDBreakpoints from '@deloitte-digital-au/ddbreakpoints/lib/dd.breakpoints.es6';
 */

let _minBreakpoints;
let _maxBreakpoints;
let _options = {
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
		},
		{
			name: 'xxxl',
			px: 1570
		},
		{
			name: 'fhd',
			px: 1900
		}
	],
	staticRange: {
		min: 0,
		max: 'xl'
	}
};

/**
 * Sorts the breakpoints and assigns them to an associative array for more efficient lookup.
 * Immediately invoked on initialisation
 *
 * @memberof DDBreakpoints
 * @private
 */
const _initBreakpoints = function() {
	//sort the breakpoints into order of smallest to largest
	const sortedBreakpoints = _options.breakpoints.sort(function(a, b) {
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
	for (let i = 0, len = sortedBreakpoints.length, last = len - 1; i < len; i += 1) {
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
 * @memberof DDBreakpoints
 * @private
 * @param  {String|Number} min Number in pixels or string notation
 * @param  {String|Number} max Number in pixels or string notation
 * @return {Object} Object containing the min and max values parsed as a number
 */
const _parseMinMaxInputs = (min, max) => {
	const parseValue = (val) => {
		if (typeof (val) === 'string') {
			// Strip whitespace
			val = val.replace(/\s/g, '');

			// If val only contains digits, convert it to a number
			if (/^\d+$/.test(val)) {
				val = parseInt(val, 10);
			}
		}

		return val;
	};
	let bpArray;
	let resultMin = min;
	let resultMax = max || 0;

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
 * @memberof DDBreakpoints
 * @private
 * @param  {Number} px Number in pixels
 * @return {String} The converted number in em as a string
 */
const _pxToEms = (px) => {
	return px / _options.baseFontSize;
};

/**
 * Converts a breakpoint name/value (e.g. l) to the px variable then to ems
 *
 * @memberof DDBreakpoints
 * @private
 * @param  {String|Number} breakpoint Breakpoint name as a string, or as a number in pixels
 * @param  {Boolean} [isMax=false] Flag to determine if the min or max of the breakpoint needs to be used
 * @return {String} The converted number in em as a string
 */
const _bpToEms = (breakpoint, isMax = false) => {
	if (typeof (breakpoint) === 'number') {
		return _pxToEms(breakpoint);
	}

	const list = (isMax === true) ? _maxBreakpoints : _minBreakpoints;
	let ems = '0';

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
 * @memberof DDBreakpoints
 * @private
 * @param  {String|Number} min Breakpoint name as a string, as a number in pixels, or as string notation containing both breakpoints
 * @param  {String|Number} max Breakpoint name as a string, or as a number in pixels
 * @param  {Boolean} [property='width'] which property to check for (e.g. width or height)
 * @return {Boolean} If the breakpoint fits inside the static range or not
 */
const _bpIsValidForStatic = (min, max, property = 'width') => {
	if (property !== 'width') {
		return false;
	}

	const bpValidMin = _bpToEms(_options.staticRange.min);
	const bpValidMax = _bpToEms(_options.staticRange.max, true);
	const bps = _parseMinMaxInputs(min, max);
	const bpMin = _bpToEms(bps.min);
	const bpMax = _bpToEms(bps.max);

	// if max is 0 we have a min-and-above situation
	if (bps.max === 0) {
		// need to check that the min is greater than the valid min,
		// AND also that the min is less than the valid maximum
		if (bpMin >= bpValidMin && bpMin < bpValidMax) {
			return true;
		}

		return false;
	}

	// if min is 0 we have a max-and-below situation
	if (bps.min === 0) {
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
 * @memberof DDBreakpoints
 * @private
 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels
 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
 * @return {String} Media query string
 */
const _bpMin = function(min, property = 'width') {
	var bpMin = _bpToEms(min);

	return '(min-' + property + ': ' + bpMin + 'em)';
};

/**
 * Returns a max-width media query based on bp name or px
 *
 * @memberof DDBreakpoints
 * @private
 * @param  {String|Number} max Breakpoint name as a string, or as a number in pixels
 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
 * @return {String} Media query string
 */
const _bpMax = (max, property = 'width') => {
	return '(max-' + property + ': ' + _bpToEms(max, true) + 'em)';
};

/**
 * Returns a min-width and max-width media query based on bp name (can be the same bp name) or px
 *
 * @memberof DDBreakpoints
 * @private
 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels
 * @param  {String|Number} max Breakpoint name as a string, or as a number in pixels
 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
 * @return {String} Media query string
 */
const _bpBetween = (min, max, property = 'width') => {
	return '(min-' + property + ': ' + _bpToEms(min) + 'em) and (max-' + property + ': ' + _bpToEms(max, true) + 'em)';
};

/**
 * Breakpoint function that can take the input of a min and max
 * breakpoint by name or number (in px) along with a property
 * (like width or height) and returns the media query as a string
 *
 * @memberof DDBreakpoints
 * @example
 * // large and above
 * DDBreakpoints.get('l');
 *
 * @example
 * // 300px and above
 * DDBreakpoints.get(300);
 *
 * @example
 * // large and below
 * DDBreakpoints.get(0, 'l');
 *
 * @example
 * // 300px and below
 * DDBreakpoints.get(0, 300);
 *
 * @example
 * // Between small and large
 * DDBreakpoints.get('s', 'l');
 *
 * @example
 * // Between 100px and 300px
 * DDBreakpoints.get(100, 300);
 *
 * @example
 * // High resolution displays (can use 'hdpi' as well)
 * DDBreakpoints.get('retina');
 *
 * @example
 * // Can mix and match names and numbers - between 200px and xlarge
 * DDBreakpoints.get(200, 'xl');
 *
 * @example
 * // Between small and 960px
 * DDBreakpoints.get('s', 960);
 *
 * @example
 * // Can use a single string (no spaces) - useful for passing through from HTML to JS
 * DDBreakpoints.get('m,l');
 *
 * @example
 * // Can also mix names and numbers
 * DDBreakpoints.get('xs,1000');
 *
 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
 * @return {String} Media query string
 */
export const get = (min, max = 0, property = 'width') => {
	const bps = _parseMinMaxInputs(min, max);

	//check what type of bp it is
	if (bps.min === 'retina' || bps.min === 'hdpi') {
		return '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-device-pixel-ratio: 1.5)';
	} else if (bps.max === 0) {
		return _bpMin(bps.min, property);
	} else if (bps.min === 0) {
		return _bpMax(bps.max, property);
	} else {
		return _bpBetween(bps.min, bps.max, property);
	}
};

/**
 * Shortcut for the get() function that returns a height
 * based media query and returns the media query as a string
 *
 * @memberof DDBreakpoints
 * @example
 * // Height of 300px and above
 * DDBreakpoints.getHeight(300);
 *
 * @example
 * // Height of 300px and below
 * DDBreakpoints.getHeight(0, 300);
 *
 * @example
 * // Between 100px and 300px high
 * DDBreakpoints.getHeight(100, 300);
 *
 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
 * @return {String} Media query string
 */
export const getHeight = (min, max = 0) => {
	return get(min, max, 'height');
};

/**
 * Breakpoint function that takes the same inputs as get() but
 * instead of returning the media query as a string returns
 * if the current page matches that query as a boolean using
 * window.matchMedia(mq).matches
 *
 * @memberof DDBreakpoints
 * @example
 * // returns true if the page is between xs and s
 * DDBreakpoints.is('xs,s');
 * DDBreakpoints.is('xs','s');
 *
 * @example
 * // returns true if the page is between 0 and 300px wide
 * DDBreakpoints.is('0,300');
 * DDBreakpoints.is(0, 300);
 *
 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
 * @param  {String} [property='width'] Property to check using a media query. e.g. width or height
 * @return {Boolean}
 */
export const is = (min, max = 0, property = 'width') => {
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
 * @memberof DDBreakpoints
 * @example
 * // returns true if the page is between 0 and 300px high
 * DDBreakpoints.isHeight('0,300');
 * DDBreakpoints.isHeight(0, 300);
 *
 * @param  {String|Number} min Breakpoint name as a string, or as a number in pixels, or in comma separated string notation
 * @param  {String|Number} [max=0] Breakpoint name as a string, or as a number in pixels
 * @return {Boolean}
 */
export const isHeight = (min, max = 0) => {
	return is(min, max, 'height');
};

/**
 * Valid options for the Breakpoints array
 *
 * @typedef  {Object} DDBreakpointsOptionsArray
 * @property {String} name Name of the breakpoint e.g. 's', 'm', 'l'
 * @property {Number} px Number in px for the size of the breakpoint
 */

/**
 * Valid options for the Breakpoints library
 *
 * @typedef  {Object} DDBreakpointsOptions
 * @property {Number} [baseFontSize] Number in px to be used as a base font size in order to calculate em values
 * @property {DDBreakpointsOptionsArray[]} [breakpoints]
 */

/**
 * User updatable options
 *
 * @memberof DDBreakpoints
 * @example
 * // update the base font size only
 * DDBreakpoints.options({
 *   baseFontSize: 14
 * });
 *
 * @example
 * // update the breakpoints
 * DDBreakpoints.options({
 *   breakpoints: [
 *     { name: 'small', px: 400 },
 *     { name: 'medium', px: 800 },
 *     { name: 'large', px: 1200 }
 *   ]
 * });
 *
 * @param  {DDBreakpointsOptions} opts Options inside the library to be updated
 * @return {Boolean}
 */
export const options = (opts) => {
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

export default {
	get,
	getHeight,
	is,
	isHeight,
	options,
};
