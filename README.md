![Deloitte Digital](deloittedigital-logo-white.png)

# DDBreakpoints

Breakpoints SCSS and Less Mixin and JavaScript library, used to accelerate and simplify media query development during the development process of responsive pages.

The SCSS/Less and JS also allow for the ability to create static (non-responsive) stylesheets as well by setting a variable allowing backwards support for non responsive browsers/situations (like IE8, or when you need to import third party code that doesn't work responsively) easily.

- [Getting Started](#getting-started)
  - [Install via NPM](#install-via-npm)
  - [Migrating from SCSS v1.x to v2.x](#migrating-from-scss-v1x-to-v2x)
    - [Change the way you import the file](#change-the-way-you-import-the-file)
    - [Change the main mixin to use the new bp namespace](#change-the-main-mixin-to-use-the-new-bp-namespace)
  - [SCSS and Less](#scss-and-less)
    - [Importing the library](#importing-the-library)
    - [Usage](#usage)
      - [Getting a width from a breakpoint name](#getting-a-width-from-a-breakpoint-name)
    - [Options](#options)
      - [Flags](#flags)
      - [Breakpoints](#breakpoints)
        - [Custom Breakpoints list](#custom-breakpoints-list)
      - [Debug Mode](#debug-mode)
      - [Static Stylesheet Range](#static-stylesheet-range)
      - [Print Stylesheet Range](#print-stylesheet-range)
  - [JavaScript](#javascript)
    - [`.get()`](#-get---)
    - [`.is()`](#-is---)
    - [`.options()`](#-options---)
  - [Change log](#change-log)
- [Want to contribute?](#want-to-contribute-)
- [Key Contributors](#key-contributors)
- [Deloitte Digital Australia](#deloitte-digital-australia)
- [Background](#background)
- [Who is Deloitte Digital?](#who-is-deloitte-digital-)
- [LICENSE (BSD-3-Clause)](#license--bsd-3-clause-)

## Getting Started

### Install via NPM

To install via [npm](https://www.npmjs.com/), enter the following at the command line:

```bash
npm install ddbreakpoints
```

### Migrating from SCSS v1.x to v2.x

Be sure to read up on the new Sass Modules as most of the change in working style revolves around that.

#### Change the way you import the file

You should use `@use` instead of `@import`, and you'll need to `@use` it in each file where the mixin is used.

You will also need to provide options previously set using global variables when you first `@use` the library. See the [Options](#options) section for details.

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" as bp;
```

#### Change the main mixin to use the new bp namespace

Replace:

```scss
@include bp($min, $max:0, $property:width) {
    // your styles here
}
```

With:

```scss
@include bp.get($min, $max:0, $property:width) {
    // your styles here
}
```

### SCSS and Less

#### Importing the library

Import the SCSS/Less into your own project

***SCSS v2:***

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" as bp;
```

**Important**: *WIth the new SCSS module standard, you will need to import the library at the top of any file where it will be used.*

***SCSS v1:***

```scss
@import "~ddbreakpoints/lib/dd.breakpoints";
```

***Less:***

```less
@import "~ddbreakpoints/lib/dd.breakpoints.less"
```

#### Usage

At the most basic level, everything comes from a single mixin:

***SCSS v2:***

```scss
@include bp.get($min, $max:0, $property:width) {
    // your styles here
}
```

***SCSS v1:***

```scss
@include bp($min, $max:0, $property:width) {
    // your styles here
}
```

***Less:***

```less
.bp(@min, {
    // your styles here
}}
// or
.bp(@min, @max=0, {
    // your styles here
}}
```

The recommended usage for the mixin is to go mobile first:

***SCSS v2:***

```scss
.module {
    // base styles

    @include bp.get(m) {
        // medium styles
    }

    @include bp.get(l) {
        // large styles
    }

    @include bp.get(xl) {
        // extra large styles
        // not included in the static sheet
    }
}
```

***SCSS v1:***

```scss
.module {
    // base styles

    @include bp(m) {
        // medium styles
    }

    @include bp(l) {
        // large styles
    }

    @include bp(xl) {
        // extra large styles
        // not included in the static sheet
    }
}
```

***Less:***

```less
.module {
    // base styles

    .bp(m, {
        // medium styles
    });

    .bp(l, {
        // large styles
    });

    .bp(xl, {
        // extra large styles
        // not included in the static sheet
    });
}
```

But if you have to, you can go large first too:

***SCSS v2:***

```scss
.module {
    // desktop styles

    @include bp.get(0, l) {
        // large and below styles
    }

    @include bp.get(0, m) {
        // medium and below styles
        // not included in the static sheet
    }

    @include bp.get(0, s) {
        // small and below styles
        // not included in the static sheet
    }
}
```

***SCSS v1:***

```scss
.module {
    // desktop styles

    @include bp(0, l) {
        // large and below styles
    }

    @include bp(0, m) {
        // medium and below styles
        // not included in the static sheet
    }

    @include bp(0, s) {
        // small and below styles
        // not included in the static sheet
    }
}
```

***Less:***

```less
.module {
    // desktop styles

    .bp(0, l, {
        // large and below styles
    });

    .bp(0, m, {
        // medium and below styles
        // not included in the static sheet
    });

    .bp(0, s, {
        // small and below styles
        // not included in the static sheet
    });
}
```

You can even use pixel based widths mixed with breakpoint names.

***SCSS v2:***

```scss
.module {
    // base styles

    @include bp.get(300, m) {
        // between 300px (in ems) and medium breakpoint
        // not included in the static sheet
    }

    @include bp.get(m, 2000) {
        // between medium breakpoint and 2000px (in ems)
    }

    @include bp.get(200, 250) {
        // be as specific as you need
        // not included in the static sheet
    }
}
```

***SCSS v1:***

```scss
.module {
    // base styles

    @include bp(300, m) {
        // between 300px (in ems) and medium breakpoint
        // not included in the static sheet
    }

    @include bp(m, 2000) {
        // between medium breakpoint and 2000px (in ems)
    }

    @include bp(200, 250) {
        // be as specific as you need
        // not included in the static sheet
    }
}
```

***Less:***

```less
.module {
    // base styles

    .bp(300, m, {
        // between 300px (in ems) and medium breakpoint
        // not included in the static sheet
    });

    .bp(m, 2000, {
        // between medium breakpoint and 2000px (in ems)
    });

    .bp(200, 250, {
        // be as specific as you need
        // not included in the static sheet
    });
}
```

And you can also check against heights too

***SCSS v2:***

```scss
.module {
    // base styles

    @include bp.get(0, 500, height) {
        // between 0 and 500px high
        // height breakpoints are never included in the static sheet
    }

    @include bp.get-height(0, 500) {
        // exactly the same as above - shortcut
    }
}
```

***SCSS v1:***

```scss
.module {
    // base styles

    @include bp(0, 500, height) {
        // between 0 and 500px high
        // height breakpoints are never included in the static sheet
    }

    @include bph(0, 500) {
        // exactly the same as above - shortcut
    }
}
```

***Less:***

```less
.module {
    // base styles

    bph(0, 500, {
        // between 0 and 500px high
        // height breakpoints are never included in the static sheet
    });

    .bph(500, {
        // above 500px high
    });
}
```

##### Getting a width from a breakpoint name

*SCSS v2 Only:* By default this returns em, but you can set the optional second parameter to "rem" or "px".

***SCSS v2:***

```scss
.module {
    width: bp.get-width-from-bp(l);

    // be sure to escape the value when setting it to a CSS variable
    --module-width: #{bp.get-width-from-bp(xxl)};

    // return px instead of em
    --module-width-px: #{bp.get-width-from-bp(xxl, "px")};
}
```

#### Options

You can customise a number of options in the SCSS/Less. When doing this, if you're also using the JS library, make sure you update the values to match there as well.

##### Flags

Set these flags early in the document, they can be included after you include the breakpoint SCSS/Less file, however should be set before any usage of the mixin.

***SCSS v2:***

With v2, global variables are no longer used. These values are now passed into DD Breakpoints on the first time using `@use`. Subsequent uses of the library do not require the variables to be re-set.

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" with (
    $is-responsive: true,
    $base-font-size: 16
);
```

***SCSS v1:***

```scss
$IS_RESPONSIVE: true; // [boolean] tells the mixin to either export media queries or not
$FONT_BASE: 16; // [number] base font size (in px) of your site
```

***Less:***

```less
@IS_RESPONSIVE: true; // [boolean] tells the mixin to either export media queries or not
@FONT_BASE: 16; // [number] base font size (in px) of your site
```

##### Breakpoints

The default breakpoints can be updated simply by editing the following variables. These should be set *before* the mixin is included into the page for SCSS, and *after* the mixin is included into the page for Less.

These default values have been chosen because they are the most common screen resolutions that we normally support.

***SCSS v2:***

The new default breakpoints can be found below (we've added a couple of larger ones up to Full HD resolution).

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" with (
    $breakpoints: (
        xxs: 359,
        xs: 480,
        s: 640,
        m: 768,
        l: 1024,
        xl: 1244,
        xxl: 1410,
        xxxl: 1570,
        fhd: 1900,
    )
);
```

***SCSS v1:***

```scss
$bp-xxs-min: 359;
$bp-xs-min: 480;
$bp-s-min: 640;
$bp-m-min: 768; // iPad portrait
$bp-l-min: 1024; // iPad landscape
$bp-xl-min: 1244; // 1280px screen resolution minus scrollbars
$bp-xxl-min: 1410; // 1440px screen resolution minus scrollbars
```

***Less:***

```less
@bp-min-xxs: 359;
@bp-min-xs: 480;
@bp-min-s: 640;
@bp-min-m: 768; // iPad portrait
@bp-min-l: 1024; // iPad landscape
@bp-min-xl: 1244; // 1280px screen resolution minus scrollbars
@bp-min-xxl: 1410; // 1440px screen resolution minus scrollbars
```

###### Custom Breakpoints list

*SCSS Only:* You can also completely customise your list in SCSS only by setting the following:

***SCSS v2:***

With v2, setting custom breakpoints is much simpler. Pass in a map of the smallest breakpoint size in pixels from smallest to largest breakpoint, and the library will figure out the rest.

Add as many breakpoints as you like, and no need to set the maximum sizes anymore.

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" with (
    $breakpoints: (
        xxs: 359,
        xs: 480,
        s: 640,
        m: 768,
        l: 1024,
        xl: 1244,
        xxl: 1410,
        xxxl: 1570,
        fhd: 1900,
    )
);
```

***SCSS v1:***

```scss
// customised - max numbers are the next breakpoints min minus 1px
$bp-list-min: small 359, medium 768, large 1024, xlarge 1244;
$bp-list-max: small 767, medium 1023, large 1243;
```

You don't need to set a maximum of the highest breakpoint.

##### Debug Mode

*New in SCSS v2:* When debugging it's extremely helpful to know what breakpoint you're currently using. A small overlay can be added by using the `$dev-mode` properties on import.

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" with (
    $dev-mode: (
        enabled: false, // enable or disable the CSS output
        selector: "body::after", // set the selector (should be a psuedo element)
        position: top left, // set the vertical and horizontal position - valid combinations are one of top or bottom, and one of left or right (order doesn't matter)
        on-dark: false // by default it's black text on white, this property will switch it to white text on black
    )
);
```

##### Static Stylesheet Range

You can customise the static stylesheet range by setting the min size (should mostly be 0) and the max size range:

***SCSS v2:***

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" with (
    $static: (
        min: 0,
        max: 1244
    )
);
```

***SCSS v1:***

```scss
$bp-static-min: 0;
$bp-static-max: $bp-xl-max;
```

***Less:***

```less
@bp-min-static: unit(0, em);
@bp-max-static: unit(@bp-max-l / @FONT_BASE, em);
```

##### Print Stylesheet Range

*SCSS Only:* Similar to the static stylesheet range, SCSS allows for the ability to set a range for print styles as well:

***SCSS v2:***

```scss
@use "~ddbreakpoints/lib/dd.breakpoints" with (
    $print: (
        min: 0,
        max: 550
    )
);
```

***SCSS v1:***

```scss
$bp-print-min: 0 !default;
$bp-print-max: 550 !default;
```

### JavaScript

JSDoc documentation is published to [Doclets](https://doclets.io/DeloitteDigitalAPAC/DDBreakpoints).

The JS library is wrapped in a [UMD](https://github.com/umdjs/umd) module, so it will play nice if you are using webpack or a similar tool.

```js
// Browserify example
var bp = require('ddbreakpoints');
```

Otherwise, ```DD.bp``` is used as a namespace on the window object.

There are two main functions for the JS library.

#### `.get()`

Returns the media query as a string. Perfect for use with [enquire.js](http://wicky.nillia.ms/enquire.js/).

You can pass through the same values as the SCSS, however you can also pass through a single string of comma separated values which can be passed through dynamically like from `data-` attributes.

```javascript
DD.bp.get(min /* string || number */, max = 0 /* string || number */, property = 'width' /* string */);

// examples
DD.bp.get('s');
DD.bp.get('s', 'l');
DD.bp.get(0, 500);

// string notation
DD.bp.get('s,l');
```

There is also a shortcut function for height based media queries

```javascript
DD.bp.getHeight(min /* string || number */, max = 0 /* string || number */);
```

#### `.is()`

Returns a boolean indicating if the current viewport matches the requested media query. This uses `window.matchMedia().matches` so use a [polyfill](https://github.com/paulirish/matchMedia.js/) if you need one.

```javascript
DD.bp.is(min /* string || number */, max = 0 /* string || number */, property = 'width' /* string */);

// examples
DD.bp.is('s');
DD.bp.is('s', 'l');
DD.bp.is(0, 500);

// string notation
DD.bp.is('s,l');
```

There is also a shortcut function for height based media queries

```javascript
DD.bp.isHeight(min /* string || number */, max = 0 /* string || number */);
```

#### `.options()`

You can customise the JavaScript library by using the `options()` method.

```javascript
DD.bp.options(opts /* object */);
```

There are three customisable options:

- `baseFontSize` [number=16] Base font size of your site (browser default is normally 16px) this helps convert pixel widths to relative units for the media queries (using em units)
- `isResponsive` [boolean=true] Set to false if the site shouldn't get a responsive stylesheet (e.g. IE8 and below)
- `breakpoints` [Array] Use a custom list of name/pixel width breakpoints instead of the default in an array of `{ name: 'NAME', px: 000 }`

```javascript
DD.bp.options({
    baseFontSize: 16
    isResponsive: true,
    breakpoints: [
        { name: 'small', px: 400 },
        { name: 'medium', px: 800 },
        { name: 'large', px: 1200 }
    ]
});
```

Make sure to ensure that the values used here match the values used in the SCSS.

## Change log

`2.0.0` - April 2020

- **Major release**: Contains breaking changes and not backwards compatible due to the addition of support for [SASS Modules](https://sass-lang.com/blog/the-module-system-is-launched).
- Updated documentation to provide examples of the difference from 1.x to 2.x
- Only changes to the JS/Less libraries are including two additional default breakpoints to match the updated SCSS v2 default breakpoints
- **New feature (for SCSS v2 only):** There is now a debug feature to display a small overlay that informs the user which breakpoint is currently viewed

`1.1.1` - Feb 2017

- Updated `bower.json` version number.

`1.1.0` - Feb 2017

- Added .less version to the library + updated documentation with .less examples.
- Updated JS to use the [Universal Module Definition](https://github.com/umdjs/umd) wrapper, falls back to `window.DD.bp` if required. (Thanks to @jeffdowdle).

`1.0.6` - Oct 2016

- Added config section for the DXP FED framework to hook into.

`1.0.5` - July 2016

- Migrate GitHub organisation to: DeloitteDigitalAPAC.

`1.0.3` & `1.0.4` - September 2015

- Publish on npm.

`1.0.2` - March 2015

- Minor bug fix in options function, to allow setting of custom breakpoints.

`1.0.1` - Feb 2015

- Update to resolve issue with Bower getting an old tag

`1.0.0` - Feb 2015

- Public release
- Documentation
- Cleanup
- Automatic calculation of display logic for non-responsive stylesheets (previously was manual)
- Added height based breakpoints

`0.1.1` - July 2014

- Added support for inputting px based integers instead of just breakpoint names (suggested by @conhuynh)

`0.1.0` - June 2014

- Large rewrite
- Dynamically generate breakpoints without multiple IF statements
- Updated default number of breakpoints to 8
- Include printer support
- Changed the mixin name to `bp` to reduce RSI

`0.0.2` - August 2013

- Added check for responsive flag.
- Moved static and responsive code into a single mixin

`0.0.1` - May 2013

- Initial build. Inspired by http://css-tricks.com/naming-media-queries/

## Want to contribute?

- Got an amazing idea to make the plugin better?
- Found an annoying bug?

Please don't hesitate to raise an issue through GitHub or open a pull request to show off your fancy pants coding skills - we'll really appreciate it!

## Key Contributors

### Deloitte Digital Australia

- @dkeeghan
- @keeganstreet

## Background

The Breakpoints SCSS mixin and JavaScript library, which is made up of an SCSS Mixin and some JavaScript. We use this tool to accelerate our development process when creating responsive websites and webapps - it also helps us simplify consistency accross all of our projects.

We were inspired to create DDBreakpoints back in May 2013, as a result of Chris Coyier's CSS-Tricks article: [Naming Media Queries](http://css-tricks.com/naming-media-queries/).

As we built more responsive websites, our philosophy for creating responsive sites that don't look responsive (i.e. don't use a predictable standard grid) meant that we needed to add more and more breakpoints. While we always took a mobile-first approach, we would regularly find ourselves adding an "and-below" breakpoint for edge cases. This meant that our breakpoints mixin was getting overly large and repetitively complex.

Today, DDBreakpoints is used on almost every responsive project by Deloitte Digital in Australia... and now, it's available for your projects as well!

---

## Who is Deloitte Digital?

**Part Business. Part Creative. Part Technology. One hundred per cent digital.**

Pioneered in Australia, Deloitte Digital is committed to helping clients unlock the business value of emerging technologies. We provide clients with a full suite of digital services, covering digital strategy, user experience, content, creative, engineering and implementation across mobile, web and social media channels.

[http://www.deloittedigital.com/au](http://www.deloittedigital.com/au)

## LICENSE (BSD-3-Clause)

[View License](LICENSE)
