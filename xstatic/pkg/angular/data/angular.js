/**
 * @license AngularJS v1.8.2
 * (c) 2010-2020 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window) {'use strict';
/* exported
  minErrConfig,
  errorHandlingConfig,
  isValidObjectMaxDepth
*/

var minErrConfig = {
  objectMaxDepth: 5,
  urlErrorParamsEnabled: true
};

/**
 * @ngdoc function
 * @name angular.errorHandlingConfig
 * @module ng
 * @kind function
 *
 * @description
 * Configure several aspects of error handling in AngularJS if used as a setter or return the
 * current configuration if used as a getter. The following options are supported:
 *
 * - **objectMaxDepth**: The maximum depth to which objects are traversed when stringified for error messages.
 *
 * Omitted or undefined options will leave the corresponding configuration values unchanged.
 *
 * @param {Object=} config - The configuration object. May only contain the options that need to be
 *     updated. Supported keys:
 *
 * * `objectMaxDepth`  **{Number}** - The max depth for stringifying objects. Setting to a
 *   non-positive or non-numeric value, removes the max depth limit.
 *   Default: 5
 *
 * * `urlErrorParamsEnabled`  **{Boolean}** - Specifies whether the generated error url will
 *   contain the parameters of the thrown error. Disabling the parameters can be useful if the
 *   generated error url is very long.
 *
 *   Default: true. When used without argument, it returns the current value.
 */
function errorHandlingConfig(config) {
  if (isObject(config)) {
    if (isDefined(config.objectMaxDepth)) {
      minErrConfig.objectMaxDepth = isValidObjectMaxDepth(config.objectMaxDepth) ? config.objectMaxDepth : NaN;
    }
    if (isDefined(config.urlErrorParamsEnabled) && isBoolean(config.urlErrorParamsEnabled)) {
      minErrConfig.urlErrorParamsEnabled = config.urlErrorParamsEnabled;
    }
  } else {
    return minErrConfig;
  }
}

/**
 * @private
 * @param {Number} maxDepth
 * @return {boolean}
 */
function isValidObjectMaxDepth(maxDepth) {
  return isNumber(maxDepth) && maxDepth > 0;
}


/**
 * @description
 *
 * This object provides a utility for producing rich Error messages within
 * AngularJS. It can be called as follows:
 *
 * var exampleMinErr = minErr('example');
 * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
 *
 * The above creates an instance of minErr in the example namespace. The
 * resulting error will have a namespaced error code of example.one.  The
 * resulting error will replace {0} with the value of foo, and {1} with the
 * value of bar. The object is not restricted in the number of arguments it can
 * take.
 *
 * If fewer arguments are specified than necessary for interpolation, the extra
 * interpolation markers will be preserved in the final string.
 *
 * Since data will be parsed statically during a build step, some restrictions
 * are applied with respect to how minErr instances are created and called.
 * Instances should have names of the form namespaceMinErr for a minErr created
 * using minErr('namespace'). Error codes, namespaces and template strings
 * should all be static strings, not variables or general expressions.
 *
 * @param {string} module The namespace to use for the new minErr instance.
 * @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
 *   error from returned function, for cases when a particular type of error is useful.
 * @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
 */

function minErr(module, ErrorConstructor) {
  ErrorConstructor = ErrorConstructor || Error;

  var url = 'https://errors.angularjs.org/"1.8.2"/';
  var regex = url.replace('.', '\\.') + '[\\s\\S]*';
  var errRegExp = new RegExp(regex, 'g');

  return function() {
    var code = arguments[0],
      template = arguments[1],
      message = '[' + (module ? module + ':' : '') + code + '] ',
      templateArgs = sliceArgs(arguments, 2).map(function(arg) {
        return toDebugString(arg, minErrConfig.objectMaxDepth);
      }),
      paramPrefix, i;

    // A minErr message has two parts: the message itself and the url that contains the
    // encoded message.
    // The message's parameters can contain other error messages which also include error urls.
    // To prevent the messages from getting too long, we strip the error urls from the parameters.

    message += template.replace(/\{\d+\}/g, function(match) {
      var index = +match.slice(1, -1);

      if (index < templateArgs.length) {
        return templateArgs[index].replace(errRegExp, '');
      }

      return match;
    });

    message += '\n' + url + (module ? module + '/' : '') + code;

    if (minErrConfig.urlErrorParamsEnabled) {
      for (i = 0, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
        message += paramPrefix + 'p' + i + '=' + encodeURIComponent(templateArgs[i]);
      }
    }

    return new ErrorConstructor(message);
  };
}

/* We need to tell ESLint what variables are being exported */
/* exported
  angular,
  msie,
  jqLite,
  jQuery,
  slice,
  splice,
  push,
  toString,
  minErrConfig,
  errorHandlingConfig,
  isValidObjectMaxDepth,
  ngMinErr,
  angularModule,
  uid,
  REGEX_STRING_REGEXP,
  VALIDITY_STATE_PROPERTY,

  lowercase,
  uppercase,
  nodeName_,
  isArrayLike,
  forEach,
  forEachSorted,
  reverseParams,
  nextUid,
  setHashKey,
  extend,
  toInt,
  inherit,
  merge,
  noop,
  identity,
  valueFn,
  isUndefined,
  isDefined,
  isObject,
  isBlankObject,
  isString,
  isNumber,
  isNumberNaN,
  isDate,
  isError,
  isArray,
  isFunction,
  isRegExp,
  isWindow,
  isScope,
  isFile,
  isFormData,
  isBlob,
  isBoolean,
  isPromiseLike,
  trim,
  escapeForRegexp,
  isElement,
  makeMap,
  includes,
  arrayRemove,
  copy,
  simpleCompare,
  equals,
  csp,
  jq,
  concat,
  sliceArgs,
  bind,
  toJsonReplacer,
  toJson,
  fromJson,
  convertTimezoneToLocal,
  timezoneToOffset,
  addDateMinutes,
  startingTag,
  tryDecodeURIComponent,
  parseKeyValue,
  toKeyValue,
  encodeUriSegment,
  encodeUriQuery,
  angularInit,
  bootstrap,
  getTestability,
  snake_case,
  bindJQuery,
  assertArg,
  assertArgFn,
  assertNotHasOwnProperty,
  getter,
  getBlockNodes,
  hasOwnProperty,
  createMap,
  stringify,
  UNSAFE_restoreLegacyJqLiteXHTMLReplacement,

  NODE_TYPE_ELEMENT,
  NODE_TYPE_ATTRIBUTE,
  NODE_TYPE_TEXT,
  NODE_TYPE_COMMENT,
  NODE_TYPE_DOCUMENT,
  NODE_TYPE_DOCUMENT_FRAGMENT
*/

////////////////////////////////////

/**
 * @ngdoc module
 * @name ng
 * @module ng
 * @installation
 * @description
 *
 * The ng module is loaded by default when an AngularJS application is started. The module itself
 * contains the essential components for an AngularJS application to function. The table below
 * lists a high level breakdown of each of the services/factories, filters, directives and testing
 * components available within this core module.
 *
 */

var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;

// The name of a form control's ValidityState property.
// This is used so that it's possible for internal tests to create mock ValidityStates.
var VALIDITY_STATE_PROPERTY = 'validity';


var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @private
 *
 * @description Converts the specified string to lowercase.
 * @param {string} string String to be converted to lowercase.
 * @returns {string} Lowercased string.
 */
var lowercase = function(string) {return isString(string) ? string.toLowerCase() : string;};

/**
 * @private
 *
 * @description Converts the specified string to uppercase.
 * @param {string} string String to be converted to uppercase.
 * @returns {string} Uppercased string.
 */
var uppercase = function(string) {return isString(string) ? string.toUpperCase() : string;};


var
    msie,             // holds major version number for IE, or NaN if UA is not IE.
    jqLite,           // delay binding since jQuery could be loaded after us.
    jQuery,           // delay binding
    slice             = [].slice,
    splice            = [].splice,
    push              = [].push,
    toString          = Object.prototype.toString,
    getPrototypeOf    = Object.getPrototypeOf,
    ngMinErr          = minErr('ng'),

    /** @name angular */
    angular           = window.angular || (window.angular = {}),
    angularModule,
    uid               = 0;

// Support: IE 9-11 only
/**
 * documentMode is an IE-only property
 * http://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx
 */
msie = window.document.documentMode;


/**
 * @private
 * @param {*} obj
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
 *                   String ...)
 */
function isArrayLike(obj) {

  // `null`, `undefined` and `window` are not array-like
  if (obj == null || isWindow(obj)) return false;

  // arrays, strings and jQuery/jqLite objects are array like
  // * jqLite is either the jQuery or jqLite constructor function
  // * we have to check the existence of jqLite first as this method is called
  //   via the forEach method when constructing the jqLite object in the first place
  if (isArray(obj) || isString(obj) || (jqLite && obj instanceof jqLite)) return true;

  // Support: iOS 8.2 (not reproducible in simulator)
  // "length" in obj used to prevent JIT error (gh-11508)
  var length = 'length' in Object(obj) && obj.length;

  // NodeList objects (with `item` method) and
  // other objects with suitable length characteristics are array-like
  return isNumber(length) && (length >= 0 && (length - 1) in obj || typeof obj.item === 'function');

}

/**
 * @ngdoc function
 * @name angular.forEach
 * @module ng
 * @kind function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
 * is the value of an object property or an array element, `key` is the object property key or
 * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
 *
 * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
 * using the `hasOwnProperty` method.
 *
 * Unlike ES262's
 * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
 * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
 * return the value provided.
 *
   ```js
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key) {
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender: male']);
   ```
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {Function} iterator Iterator function.
 * @param {Object=} context Object to become context (`this`) for the iterator function.
 * @returns {Object|Array} Reference to `obj`.
 */

function forEach(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (isArray(obj) || isArrayLike(obj)) {
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') {
      // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      // Slow path for objects which do not have a method `hasOwnProperty`
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}

function forEachSorted(obj, iterator, context) {
  var keys = Object.keys(obj).sort();
  for (var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}


/**
 * when using forEach the params are value, key, but it is often useful to have key, value.
 * @param {function(string, *)} iteratorFn
 * @returns {function(*, string)}
 */
function reverseParams(iteratorFn) {
  return function(value, key) {iteratorFn(key, value);};
}

/**
 * A consistent way of creating unique IDs in angular.
 *
 * Using simple numbers allows us to generate 28.6 million unique ids per second for 10 years before
 * we hit number precision issues in JavaScript.
 *
 * Math.pow(2,53) / 60 / 60 / 24 / 365 / 10 = 28.6M
 *
 * @returns {number} an unique alpha-numeric string
 */
function nextUid() {
  return ++uid;
}


/**
 * Set or clear the hashkey for an object.
 * @param obj object
 * @param h the hashkey (!truthy to delete the hashkey)
 */
function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  } else {
    delete obj.$$hashKey;
  }
}


function baseExtend(dst, objs, deep) {
  var h = dst.$$hashKey;

  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);
    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (isDate(src)) {
          dst[key] = new Date(src.valueOf());
        } else if (isRegExp(src)) {
          dst[key] = new RegExp(src);
        } else if (src.nodeName) {
          dst[key] = src.cloneNode(true);
        } else if (isElement(src)) {
          dst[key] = src.clone();
        } else {
          if (key !== '__proto__') {
            if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
            baseExtend(dst[key], [src], true);
          }
        }
      } else {
        dst[key] = src;
      }
    }
  }

  setHashKey(dst, h);
  return dst;
}

/**
 * @ngdoc function
 * @name angular.extend
 * @module ng
 * @kind function
 *
 * @description
 * Extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
 * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
 * by passing an empty object as the target: `var object = angular.extend({}, object1, object2)`.
 *
 * **Note:** Keep in mind that `angular.extend` does not support recursive merge (deep copy). Use
 * {@link angular.merge} for this.
 *
 * @param {Object} dst Destination object.
 * @param {...Object} src Source object(s).
 * @returns {Object} Reference to `dst`.
 */
function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}


/**
* @ngdoc function
* @name angular.merge
* @module ng
* @kind function
*
* @description
* Deeply extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
* to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
* by passing an empty object as the target: `var object = angular.merge({}, object1, object2)`.
*
* Unlike {@link angular.extend extend()}, `merge()` recursively descends into object properties of source
* objects, performing a deep copy.
*
* @deprecated
* sinceVersion="1.6.5"
* This function is deprecated, but will not be removed in the 1.x lifecycle.
* There are edge cases (see {@link angular.merge#known-issues known issues}) that are not
* supported by this function. We suggest using another, similar library for all-purpose merging,
* such as [lodash's merge()](https://lodash.com/docs/4.17.4#merge).
*
* @knownIssue
* This is a list of (known) object types that are not handled correctly by this function:
* - [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)
* - [`MediaStream`](https://developer.mozilla.org/docs/Web/API/MediaStream)
* - [`CanvasGradient`](https://developer.mozilla.org/docs/Web/API/CanvasGradient)
* - AngularJS {@link $rootScope.Scope scopes};
*
* `angular.merge` also does not support merging objects with circular references.
*
* @param {Object} dst Destination object.
* @param {...Object} src Source object(s).
* @returns {Object} Reference to `dst`.
*/
function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}



function toInt(str) {
  return parseInt(str, 10);
}

var isNumberNaN = Number.isNaN || function isNumberNaN(num) {
  // eslint-disable-next-line no-self-compare
  return num !== num;
};


function inherit(parent, extra) {
  return extend(Object.create(parent), extra);
}

/**
 * @ngdoc function
 * @name angular.noop
 * @module ng
 * @kind function
 *
 * @description
 * A function that performs no operations. This function can be useful when writing code in the
 * functional style.
   ```js
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   ```
 */
function noop() {}
noop.$inject = [];


/**
 * @ngdoc function
 * @name angular.identity
 * @module ng
 * @kind function
 *
 * @description
 * A function that returns its first argument. This function is useful when writing code in the
 * functional style.
 *
   ```js
   function transformer(transformationFn, value) {
     return (transformationFn || angular.identity)(value);
   };

   // E.g.
   function getResult(fn, input) {
     return (fn || angular.identity)(input);
   };

   getResult(function(n) { return n * 2; }, 21);   // returns 42
   getResult(null, 21);                            // returns 21
   getResult(undefined, 21);                       // returns 21
   ```
 *
 * @param {*} value to be returned.
 * @returns {*} the value passed in.
 */
function identity($) {return $;}
identity.$inject = [];


function valueFn(value) {return function valueRef() {return value;};}

function hasCustomToString(obj) {
  return isFunction(obj.toString) && obj.toString !== toString;
}


/**
 * @ngdoc function
 * @name angular.isUndefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
function isUndefined(value) {return typeof value === 'undefined';}


/**
 * @ngdoc function
 * @name angular.isDefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
function isDefined(value) {return typeof value !== 'undefined';}


/**
 * @ngdoc function
 * @name angular.isObject
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object';
}


/**
 * Determine if a value is an object with a null prototype
 *
 * @returns {boolean} True if `value` is an `Object` with a null prototype
 */
function isBlankObject(value) {
  return value !== null && typeof value === 'object' && !getPrototypeOf(value);
}


/**
 * @ngdoc function
 * @name angular.isString
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value) {return typeof value === 'string';}


/**
 * @ngdoc function
 * @name angular.isNumber
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
 *
 * If you wish to exclude these then you can use the native
 * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
 * method.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value) {return typeof value === 'number';}


/**
 * @ngdoc function
 * @name angular.isDate
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
function isDate(value) {
  return toString.call(value) === '[object Date]';
}


/**
 * @ngdoc function
 * @name angular.isArray
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
function isArray(arr) {
  return Array.isArray(arr) || arr instanceof Array;
}

/**
 * @description
 * Determines if a reference is an `Error`.
 * Loosely based on https://www.npmjs.com/package/iserror
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Error`.
 */
function isError(value) {
  var tag = toString.call(value);
  switch (tag) {
    case '[object Error]': return true;
    case '[object Exception]': return true;
    case '[object DOMException]': return true;
    default: return value instanceof Error;
  }
}

/**
 * @ngdoc function
 * @name angular.isFunction
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
function isFunction(value) {return typeof value === 'function';}


/**
 * Determines if a value is a regular expression object.
 *
 * @private
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
function isRegExp(value) {
  return toString.call(value) === '[object RegExp]';
}


/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
function isWindow(obj) {
  return obj && obj.window === obj;
}


function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}


function isFile(obj) {
  return toString.call(obj) === '[object File]';
}


function isFormData(obj) {
  return toString.call(obj) === '[object FormData]';
}


function isBlob(obj) {
  return toString.call(obj) === '[object Blob]';
}


function isBoolean(value) {
  return typeof value === 'boolean';
}


function isPromiseLike(obj) {
  return obj && isFunction(obj.then);
}


var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/;
function isTypedArray(value) {
  return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
}

function isArrayBuffer(obj) {
  return toString.call(obj) === '[object ArrayBuffer]';
}


var trim = function(value) {
  return isString(value) ? value.trim() : value;
};

// Copied from:
// http://docs.closure-library.googlecode.com/git/local_closure_goog_string_string.js.source.html#line1021
// Prereq: s is a string.
var escapeForRegexp = function(s) {
  return s
    .replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, '\\$1')
    // eslint-disable-next-line no-control-regex
    .replace(/\x08/g, '\\x08');
};


/**
 * @ngdoc function
 * @name angular.isElement
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a DOM element (or wrapped jQuery element).
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
 */
function isElement(node) {
  return !!(node &&
    (node.nodeName  // We are a direct element.
    || (node.prop && node.attr && node.find)));  // We have an on and find method part of jQuery API.
}

/**
 * @param str 'key1,key2,...'
 * @returns {object} in the form of {key1:true, key2:true, ...}
 */
function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) {
    obj[items[i]] = true;
  }
  return obj;
}


function nodeName_(element) {
  return lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

function includes(array, obj) {
  return Array.prototype.indexOf.call(array, obj) !== -1;
}

function arrayRemove(array, value) {
  var index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
  }
  return index;
}

/**
 * @ngdoc function
 * @name angular.copy
 * @module ng
 * @kind function
 *
 * @description
 * Creates a deep copy of `source`, which should be an object or an array. This functions is used
 * internally, mostly in the change-detection code. It is not intended as an all-purpose copy
 * function, and has several limitations (see below).
 *
 * * If no destination is supplied, a copy of the object or array is created.
 * * If a destination is provided, all of its elements (for arrays) or properties (for objects)
 *   are deleted and then all elements/properties from the source are copied to it.
 * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
 * * If `source` is identical to `destination` an exception will be thrown.
 *
 * <br />
 *
 * <div class="alert alert-warning">
 *   Only enumerable properties are taken into account. Non-enumerable properties (both on `source`
 *   and on `destination`) will be ignored.
 * </div>
 *
 * <div class="alert alert-warning">
 *   `angular.copy` does not check if destination and source are of the same type. It's the
 *   developer's responsibility to make sure they are compatible.
 * </div>
 *
 * @knownIssue
 * This is a non-exhaustive list of object types / features that are not handled correctly by
 * `angular.copy`. Note that since this functions is used by the change detection code, this
 * means binding or watching objects of these types (or that include these types) might not work
 * correctly.
 * - [`File`](https://developer.mozilla.org/docs/Web/API/File)
 * - [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
 * - [`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData)
 * - [`MediaStream`](https://developer.mozilla.org/docs/Web/API/MediaStream)
 * - [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)
 * - [`WeakMap`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
 * - [`getter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)/
 *   [`setter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)
 *
 * @param {*} source The source that will be used to make a copy. Can be any type, including
 *     primitives, `null`, and `undefined`.
 * @param {(Object|Array)=} destination Destination into which the source is copied. If provided,
 *     must be of the same type as `source`.
 * @returns {*} The copy or updated `destination`, if `destination` was specified.
 *
 * @example
  <example module="copyExample" name="angular-copy">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <form novalidate class="simple-form">
          <label>Name: <input type="text" ng-model="user.name" /></label><br />
          <label>Age:  <input type="number" ng-model="user.age" /></label><br />
          Gender: <label><input type="radio" ng-model="user.gender" value="male" />male</label>
                  <label><input type="radio" ng-model="user.gender" value="female" />female</label><br />
          <button ng-click="reset()">RESET</button>
          <button ng-click="update(user)">SAVE</button>
        </form>
        <pre>form = {{user | json}}</pre>
        <pre>leader = {{leader | json}}</pre>
      </div>
    </file>
    <file name="script.js">
      // Module: copyExample
      angular.
        module('copyExample', []).
        controller('ExampleController', ['$scope', function($scope) {
          $scope.leader = {};

          $scope.reset = function() {
            // Example with 1 argument
            $scope.user = angular.copy($scope.leader);
          };

          $scope.update = function(user) {
            // Example with 2 arguments
            angular.copy(user, $scope.leader);
          };

          $scope.reset();
        }]);
    </file>
  </example>
 */
function copy(source, destination, maxDepth) {
  var stackSource = [];
  var stackDest = [];
  maxDepth = isValidObjectMaxDepth(maxDepth) ? maxDepth : NaN;

  if (destination) {
    if (isTypedArray(destination) || isArrayBuffer(destination)) {
      throw ngMinErr('cpta', 'Can\'t copy! TypedArray destination cannot be mutated.');
    }
    if (source === destination) {
      throw ngMinErr('cpi', 'Can\'t copy! Source and destination are identical.');
    }

    // Empty the destination object
    if (isArray(destination)) {
      destination.length = 0;
    } else {
      forEach(destination, function(value, key) {
        if (key !== '$$hashKey') {
          delete destination[key];
        }
      });
    }

    stackSource.push(source);
    stackDest.push(destination);
    return copyRecurse(source, destination, maxDepth);
  }

  return copyElement(source, maxDepth);

  function copyRecurse(source, destination, maxDepth) {
    maxDepth--;
    if (maxDepth < 0) {
      return '...';
    }
    var h = destination.$$hashKey;
    var key;
    if (isArray(source)) {
      for (var i = 0, ii = source.length; i < ii; i++) {
        destination.push(copyElement(source[i], maxDepth));
      }
    } else if (isBlankObject(source)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in source) {
        destination[key] = copyElement(source[key], maxDepth);
      }
    } else if (source && typeof source.hasOwnProperty === 'function') {
      // Slow path, which must rely on hasOwnProperty
      for (key in source) {
        if (source.hasOwnProperty(key)) {
          destination[key] = copyElement(source[key], maxDepth);
        }
      }
    } else {
      // Slowest path --- hasOwnProperty can't be called as a method
      for (key in source) {
        if (hasOwnProperty.call(source, key)) {
          destination[key] = copyElement(source[key], maxDepth);
        }
      }
    }
    setHashKey(destination, h);
    return destination;
  }

  function copyElement(source, maxDepth) {
    // Simple values
    if (!isObject(source)) {
      return source;
    }

    // Already copied values
    var index = stackSource.indexOf(source);
    if (index !== -1) {
      return stackDest[index];
    }

    if (isWindow(source) || isScope(source)) {
      throw ngMinErr('cpws',
        'Can\'t copy! Making copies of Window or Scope instances is not supported.');
    }

    var needsRecurse = false;
    var destination = copyType(source);

    if (destination === undefined) {
      destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));
      needsRecurse = true;
    }

    stackSource.push(source);
    stackDest.push(destination);

    return needsRecurse
      ? copyRecurse(source, destination, maxDepth)
      : destination;
  }

  function copyType(source) {
    switch (toString.call(source)) {
      case '[object Int8Array]':
      case '[object Int16Array]':
      case '[object Int32Array]':
      case '[object Float32Array]':
      case '[object Float64Array]':
      case '[object Uint8Array]':
      case '[object Uint8ClampedArray]':
      case '[object Uint16Array]':
      case '[object Uint32Array]':
        return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);

      case '[object ArrayBuffer]':
        // Support: IE10
        if (!source.slice) {
          // If we're in this case we know the environment supports ArrayBuffer
          /* eslint-disable no-undef */
          var copied = new ArrayBuffer(source.byteLength);
          new Uint8Array(copied).set(new Uint8Array(source));
          /* eslint-enable */
          return copied;
        }
        return source.slice(0);

      case '[object Boolean]':
      case '[object Number]':
      case '[object String]':
      case '[object Date]':
        return new source.constructor(source.valueOf());

      case '[object RegExp]':
        var re = new RegExp(source.source, source.toString().match(/[^/]*$/)[0]);
        re.lastIndex = source.lastIndex;
        return re;

      case '[object Blob]':
        return new source.constructor([source], {type: source.type});
    }

    if (isFunction(source.cloneNode)) {
      return source.cloneNode(true);
    }
  }
}


// eslint-disable-next-line no-self-compare
function simpleCompare(a, b) { return a === b || (a !== a && b !== b); }


/**
 * @ngdoc function
 * @name angular.equals
 * @module ng
 * @kind function
 *
 * @description
 * Determines if two objects or two values are equivalent. Supports value types, regular
 * expressions, arrays and objects.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `angular.equals`.
 * * Both values are NaN. (In JavaScript, NaN == NaN => false. But we consider two NaN as equal)
 * * Both values represent the same regular expression (In JavaScript,
 *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual
 *   representation matches).
 *
 * During a property comparison, properties of `function` type and properties with names
 * that begin with `$` are ignored.
 *
 * Scope and DOMWindow objects are being compared only by identify (`===`).
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 *
 * @example
   <example module="equalsExample" name="equalsExample">
     <file name="index.html">
      <div ng-controller="ExampleController">
        <form novalidate>
          <h3>User 1</h3>
          Name: <input type="text" ng-model="user1.name">
          Age: <input type="number" ng-model="user1.age">

          <h3>User 2</h3>
          Name: <input type="text" ng-model="user2.name">
          Age: <input type="number" ng-model="user2.age">

          <div>
            <br/>
            <input type="button" value="Compare" ng-click="compare()">
          </div>
          User 1: <pre>{{user1 | json}}</pre>
          User 2: <pre>{{user2 | json}}</pre>
          Equal: <pre>{{result}}</pre>
        </form>
      </div>
    </file>
    <file name="script.js">
        angular.module('equalsExample', []).controller('ExampleController', ['$scope', function($scope) {
          $scope.user1 = {};
          $scope.user2 = {};
          $scope.compare = function() {
            $scope.result = angular.equals($scope.user1, $scope.user2);
          };
        }]);
    </file>
  </example>
 */
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  // eslint-disable-next-line no-self-compare
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 === t2 && t1 === 'object') {
    if (isArray(o1)) {
      if (!isArray(o2)) return false;
      if ((length = o1.length) === o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else if (isDate(o1)) {
      if (!isDate(o2)) return false;
      return simpleCompare(o1.getTime(), o2.getTime());
    } else if (isRegExp(o1)) {
      if (!isRegExp(o2)) return false;
      return o1.toString() === o2.toString();
    } else {
      if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) ||
        isArray(o2) || isDate(o2) || isRegExp(o2)) return false;
      keySet = createMap();
      for (key in o1) {
        if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
        if (!equals(o1[key], o2[key])) return false;
        keySet[key] = true;
      }
      for (key in o2) {
        if (!(key in keySet) &&
            key.charAt(0) !== '$' &&
            isDefined(o2[key]) &&
            !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

var csp = function() {
  if (!isDefined(csp.rules)) {


    var ngCspElement = (window.document.querySelector('[ng-csp]') ||
                    window.document.querySelector('[data-ng-csp]'));

    if (ngCspElement) {
      var ngCspAttribute = ngCspElement.getAttribute('ng-csp') ||
                    ngCspElement.getAttribute('data-ng-csp');
      csp.rules = {
        noUnsafeEval: !ngCspAttribute || (ngCspAttribute.indexOf('no-unsafe-eval') !== -1),
        noInlineStyle: !ngCspAttribute || (ngCspAttribute.indexOf('no-inline-style') !== -1)
      };
    } else {
      csp.rules = {
        noUnsafeEval: noUnsafeEval(),
        noInlineStyle: false
      };
    }
  }

  return csp.rules;

  function noUnsafeEval() {
    try {
      // eslint-disable-next-line no-new, no-new-func
      new Function('');
      return false;
    } catch (e) {
      return true;
    }
  }
};

/**
 * @ngdoc directive
 * @module ng
 * @name ngJq
 *
 * @element ANY
 * @param {string=} ngJq the name of the library available under `window`
 * to be used for angular.element
 * @description
 * Use this directive to force the angular.element library.  This should be
 * used to force either jqLite by leaving ng-jq blank or setting the name of
 * the jquery variable under window (eg. jQuery).
 *
 * Since AngularJS looks for this directive when it is loaded (doesn't wait for the
 * DOMContentLoaded event), it must be placed on an element that comes before the script
 * which loads angular. Also, only the first instance of `ng-jq` will be used and all
 * others ignored.
 *
 * @example
 * This example shows how to force jqLite using the `ngJq` directive to the `html` tag.
 ```html
 <!doctype html>
 <html ng-app ng-jq>
 ...
 ...
 </html>
 ```
 * @example
 * This example shows how to use a jQuery based library of a different name.
 * The library name must be available at the top most 'window'.
 ```html
 <!doctype html>
 <html ng-app ng-jq="jQueryLib">
 ...
 ...
 </html>
 ```
 */
var jq = function() {
  if (isDefined(jq.name_)) return jq.name_;
  var el;
  var i, ii = ngAttrPrefixes.length, prefix, name;
  for (i = 0; i < ii; ++i) {
    prefix = ngAttrPrefixes[i];
    el = window.document.querySelector('[' + prefix.replace(':', '\\:') + 'jq]');
    if (el) {
      name = el.getAttribute(prefix + 'jq');
      break;
    }
  }

  return (jq.name_ = name);
};

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index));
}

function sliceArgs(args, startIndex) {
  return slice.call(args, startIndex || 0);
}


/**
 * @ngdoc function
 * @name angular.bind
 * @module ng
 * @kind function
 *
 * @description
 * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for
 * `fn`). You can supply optional `args` that are prebound to the function. This feature is also
 * known as [partial application](http://en.wikipedia.org/wiki/Partial_application), as
 * distinguished from [function currying](http://en.wikipedia.org/wiki/Currying#Contrast_with_partial_function_application).
 *
 * @param {Object} self Context which `fn` should be evaluated in.
 * @param {function()} fn Function to be bound.
 * @param {...*} args Optional arguments to be prebound to the `fn` function call.
 * @returns {function()} Function that wraps the `fn` with all the specified bindings.
 */
function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
  if (isFunction(fn) && !(fn instanceof RegExp)) {
    return curryArgs.length
      ? function() {
          return arguments.length
            ? fn.apply(self, concat(curryArgs, arguments, 0))
            : fn.apply(self, curryArgs);
        }
      : function() {
          return arguments.length
            ? fn.apply(self, arguments)
            : fn.call(self);
        };
  } else {
    // In IE, native methods are not functions so they cannot be bound (note: they don't need to be).
    return fn;
  }
}


function toJsonReplacer(key, value) {
  var val = value;

  if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
    val = undefined;
  } else if (isWindow(value)) {
    val = '$WINDOW';
  } else if (value &&  window.document === value) {
    val = '$DOCUMENT';
  } else if (isScope(value)) {
    val = '$SCOPE';
  }

  return val;
}


/**
 * @ngdoc function
 * @name angular.toJson
 * @module ng
 * @kind function
 *
 * @description
 * Serializes input into a JSON-formatted string. Properties with leading $$ characters will be
 * stripped since AngularJS uses this notation internally.
 *
 * @param {Object|Array|Date|string|number|boolean} obj Input to be serialized into JSON.
 * @param {boolean|number} [pretty=2] If set to true, the JSON output will contain newlines and whitespace.
 *    If set to an integer, the JSON output will contain that many spaces per indentation.
 * @returns {string|undefined} JSON-ified string representing `obj`.
 * @knownIssue
 *
 * The Safari browser throws a `RangeError` instead of returning `null` when it tries to stringify a `Date`
 * object with an invalid date value. The only reliable way to prevent this is to monkeypatch the
 * `Date.prototype.toJSON` method as follows:
 *
 * ```
 * var _DatetoJSON = Date.prototype.toJSON;
 * Date.prototype.toJSON = function() {
 *   try {
 *     return _DatetoJSON.call(this);
 *   } catch(e) {
 *     if (e instanceof RangeError) {
 *       return null;
 *     }
 *     throw e;
 *   }
 * };
 * ```
 *
 * See https://github.com/angular/angular.js/pull/14221 for more information.
 */
function toJson(obj, pretty) {
  if (isUndefined(obj)) return undefined;
  if (!isNumber(pretty)) {
    pretty = pretty ? 2 : null;
  }
  return JSON.stringify(obj, toJsonReplacer, pretty);
}


/**
 * @ngdoc function
 * @name angular.fromJson
 * @module ng
 * @kind function
 *
 * @description
 * Deserializes a JSON string.
 *
 * @param {string} json JSON string to deserialize.
 * @returns {Object|Array|string|number} Deserialized JSON string.
 */
function fromJson(json) {
  return isString(json)
      ? JSON.parse(json)
      : json;
}


var ALL_COLONS = /:/g;
function timezoneToOffset(timezone, fallback) {
  // Support: IE 9-11 only, Edge 13-15+
  // IE/Edge do not "understand" colon (`:`) in timezone
  timezone = timezone.replace(ALL_COLONS, '');
  var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
  return isNumberNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
}


function addDateMinutes(date, minutes) {
  date = new Date(date.getTime());
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}


function convertTimezoneToLocal(date, timezone, reverse) {
  reverse = reverse ? -1 : 1;
  var dateTimezoneOffset = date.getTimezoneOffset();
  var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
  return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
}


/**
 * @returns {string} Returns the string representation of the element.
 */
function startingTag(element) {
  element = jqLite(element).clone().empty();
  var elemHtml = jqLite('<div></div>').append(element).html();
  try {
    return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) :
        elemHtml.
          match(/^(<[^>]+>)/)[1].
          replace(/^<([\w-]+)/, function(match, nodeName) {return '<' + lowercase(nodeName);});
  } catch (e) {
    return lowercase(elemHtml);
  }

}


/////////////////////////////////////////////////

/**
 * Tries to decode the URI component without throwing an exception.
 *
 * @private
 * @param str value potential URI component to check.
 * @returns {boolean} True if `value` can be decoded
 * with the decodeURIComponent function.
 */
function tryDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    // Ignore any invalid uri component.
  }
}


/**
 * Parses an escaped url query string into key-value pairs.
 * @returns {Object.<string,boolean|Array>}
 */
function parseKeyValue(/**string*/keyValue) {
  var obj = {};
  forEach((keyValue || '').split('&'), function(keyValue) {
    var splitPoint, key, val;
    if (keyValue) {
      key = keyValue = keyValue.replace(/\+/g,'%20');
      splitPoint = keyValue.indexOf('=');
      if (splitPoint !== -1) {
        key = keyValue.substring(0, splitPoint);
        val = keyValue.substring(splitPoint + 1);
      }
      key = tryDecodeURIComponent(key);
      if (isDefined(key)) {
        val = isDefined(val) ? tryDecodeURIComponent(val) : true;
        if (!hasOwnProperty.call(obj, key)) {
          obj[key] = val;
        } else if (isArray(obj[key])) {
          obj[key].push(val);
        } else {
          obj[key] = [obj[key],val];
        }
      }
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  forEach(obj, function(value, key) {
    if (isArray(value)) {
      forEach(value, function(arrayValue) {
        parts.push(encodeUriQuery(key, true) +
                   (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
      });
    } else {
    parts.push(encodeUriQuery(key, true) +
               (value === true ? '' : '=' + encodeUriQuery(value, true)));
    }
  });
  return parts.length ? parts.join('&') : '';
}


/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
 * segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriSegment(val) {
  return encodeUriQuery(val, true).
             replace(/%26/gi, '&').
             replace(/%3D/gi, '=').
             replace(/%2B/gi, '+');
}


/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).
             replace(/%40/gi, '@').
             replace(/%3A/gi, ':').
             replace(/%24/g, '$').
             replace(/%2C/gi, ',').
             replace(/%3B/gi, ';').
             replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}

var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];

function getNgAttribute(element, ngAttr) {
  var attr, i, ii = ngAttrPrefixes.length;
  for (i = 0; i < ii; ++i) {
    attr = ngAttrPrefixes[i] + ngAttr;
    if (isString(attr = element.getAttribute(attr))) {
      return attr;
    }
  }
  return null;
}

function allowAutoBootstrap(document) {
  var script = document.currentScript;

  if (!script) {
    // Support: IE 9-11 only
    // IE does not have `document.currentScript`
    return true;
  }

  // If the `currentScript` property has been clobbered just return false, since this indicates a probable attack
  if (!(script instanceof window.HTMLScriptElement || script instanceof window.SVGScriptElement)) {
    return false;
  }

  var attributes = script.attributes;
  var srcs = [attributes.getNamedItem('src'), attributes.getNamedItem('href'), attributes.getNamedItem('xlink:href')];

  return srcs.every(function(src) {
    if (!src) {
      return true;
    }
    if (!src.value) {
      return false;
    }

    var link = document.createElement('a');
    link.href = src.value;

    if (document.location.origin === link.origin) {
      // Same-origin resources are always allowed, even for banned URL schemes.
      return true;
    }
    // Disabled bootstrapping unless angular.js was loaded from a known scheme used on the web.
    // This is to prevent angular.js bundled with browser extensions from being used to bypass the
    // content security policy in web pages and other browser extensions.
    switch (link.protocol) {
      case 'http:':
      case 'https:':
      case 'ftp:':
      case 'blob:':
      case 'file:':
      case 'data:':
        return true;
      default:
        return false;
    }
  });
}

// Cached as it has to run during loading so that document.currentScript is available.
var isAutoBootstrapAllowed = allowAutoBootstrap(window.document);

/**
 * @ngdoc directive
 * @name ngApp
 * @module ng
 *
 * @element ANY
 * @param {angular.Module} ngApp an optional application
 *   {@link angular.module module} name to load.
 * @param {boolean=} ngStrictDi if this attribute is present on the app element, the injector will be
 *   created in "strict-di" mode. This means that the application will fail to invoke functions which
 *   do not use explicit function annotation (and are thus unsuitable for minification), as described
 *   in {@link guide/di the Dependency Injection guide}, and useful debugging info will assist in
 *   tracking down the root of these bugs.
 *
 * @description
 *
 * Use this directive to **auto-bootstrap** an AngularJS application. The `ngApp` directive
 * designates the **root element** of the application and is typically placed near the root element
 * of the page - e.g. on the `<body>` or `<html>` tags.
 *
 * There are a few things to keep in mind when using `ngApp`:
 * - only one AngularJS application can be auto-bootstrapped per HTML document. The first `ngApp`
 *   found in the document will be used to define the root element to auto-bootstrap as an
 *   application. To run multiple applications in an HTML document you must manually bootstrap them using
 *   {@link angular.bootstrap} instead.
 * - AngularJS applications cannot be nested within each other.
 * - Do not use a directive that uses {@link ng.$compile#transclusion transclusion} on the same element as `ngApp`.
 *   This includes directives such as {@link ng.ngIf `ngIf`}, {@link ng.ngInclude `ngInclude`} and
 *   {@link ngRoute.ngView `ngView`}.
 *   Doing this misplaces the app {@link ng.$rootElement `$rootElement`} and the app's {@link auto.$injector injector},
 *   causing animations to stop working and making the injector inaccessible from outside the app.
 *
 * You can specify an **AngularJS module** to be used as the root module for the application.  This
 * module will be loaded into the {@link auto.$injector} when the application is bootstrapped. It
 * should contain the application code needed or have dependencies on other modules that will
 * contain the code. See {@link angular.module} for more information.
 *
 * In the example below if the `ngApp` directive were not placed on the `html` element then the
 * document would not be compiled, the `AppController` would not be instantiated and the `{{ a+b }}`
 * would not be resolved to `3`.
 *
 * @example
 *
 * ### Simple Usage
 *
 * `ngApp` is the easiest, and most common way to bootstrap an application.
 *
 <example module="ngAppDemo" name="ng-app">
   <file name="index.html">
   <div ng-controller="ngAppDemoController">
     I can add: {{a}} + {{b}} =  {{ a+b }}
   </div>
   </file>
   <file name="script.js">
   angular.module('ngAppDemo', []).controller('ngAppDemoController', function($scope) {
     $scope.a = 1;
     $scope.b = 2;
   });
   </file>
 </example>
 *
 * @example
 *
 * ### With `ngStrictDi`
 *
 * Using `ngStrictDi`, you would see something like this:
 *
 <example ng-app-included="true" name="strict-di">
   <file name="index.html">
   <div ng-app="ngAppStrictDemo" ng-strict-di>
       <div ng-controller="GoodController1">
           I can add: {{a}} + {{b}} =  {{ a+b }}

           <p>This renders because the controller does not fail to
              instantiate, by using explicit annotation style (see
              script.js for details)
           </p>
       </div>

       <div ng-controller="GoodController2">
           Name: <input ng-model="name"><br />
           Hello, {{name}}!

           <p>This renders because the controller does not fail to
              instantiate, by using explicit annotation style
              (see script.js for details)
           </p>
       </div>

       <div ng-controller="BadController">
           I can add: {{a}} + {{b}} =  {{ a+b }}

           <p>The controller could not be instantiated, due to relying
              on automatic function annotations (which are disabled in
              strict mode). As such, the content of this section is not
              interpolated, and there should be an error in your web console.
           </p>
       </div>
   </div>
   </file>
   <file name="script.js">
   angular.module('ngAppStrictDemo', [])
     // BadController will fail to instantiate, due to relying on automatic function annotation,
     // rather than an explicit annotation
     .controller('BadController', function($scope) {
       $scope.a = 1;
       $scope.b = 2;
     })
     // Unlike BadController, GoodController1 and GoodController2 will not fail to be instantiated,
     // due to using explicit annotations using the array style and $inject property, respectively.
     .controller('GoodController1', ['$scope', function($scope) {
       $scope.a = 1;
       $scope.b = 2;
     }])
     .controller('GoodController2', GoodController2);
     function GoodController2($scope) {
       $scope.name = 'World';
     }
     GoodController2.$inject = ['$scope'];
   </file>
   <file name="style.css">
   div[ng-controller] {
       margin-bottom: 1em;
       -webkit-border-radius: 4px;
       border-radius: 4px;
       border: 1px solid;
       padding: .5em;
   }
   div[ng-controller^=Good] {
       border-color: #d6e9c6;
       background-color: #dff0d8;
       color: #3c763d;
   }
   div[ng-controller^=Bad] {
       border-color: #ebccd1;
       background-color: #f2dede;
       color: #a94442;
       margin-bottom: 0;
   }
   </file>
 </example>
 */
function angularInit(element, bootstrap) {
  var appElement,
      module,
      config = {};

  // The element `element` has priority over any other element.
  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';

    if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
      appElement = element;
      module = element.getAttribute(name);
    }
  });
  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';
    var candidate;

    if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
      appElement = candidate;
      module = candidate.getAttribute(name);
    }
  });
  if (appElement) {
    if (!isAutoBootstrapAllowed) {
      window.console.error('AngularJS: disabling automatic bootstrap. <script> protocol indicates ' +
          'an extension, document.location.href does not match.');
      return;
    }
    config.strictDi = getNgAttribute(appElement, 'strict-di') !== null;
    bootstrap(appElement, module ? [module] : [], config);
  }
}

/**
 * @ngdoc function
 * @name angular.bootstrap
 * @module ng
 * @description
 * Use this function to manually start up AngularJS application.
 *
 * For more information, see the {@link guide/bootstrap Bootstrap guide}.
 *
 * AngularJS will detect if it has been loaded into the browser more than once and only allow the
 * first loaded script to be bootstrapped and will report a warning to the browser console for
 * each of the subsequent scripts. This prevents strange results in applications, where otherwise
 * multiple instances of AngularJS try to work on the DOM.
 *
 * <div class="alert alert-warning">
 * **Note:** Protractor based end-to-end tests cannot use this function to bootstrap manually.
 * They must use {@link ng.directive:ngApp ngApp}.
 * </div>
 *
 * <div class="alert alert-warning">
 * **Note:** Do not bootstrap the app on an element with a directive that uses {@link ng.$compile#transclusion transclusion},
 * such as {@link ng.ngIf `ngIf`}, {@link ng.ngInclude `ngInclude`} and {@link ngRoute.ngView `ngView`}.
 * Doing this misplaces the app {@link ng.$rootElement `$rootElement`} and the app's {@link auto.$injector injector},
 * causing animations to stop working and making the injector inaccessible from outside the app.
 * </div>
 *
 * ```html
 * <!doctype html>
 * <html>
 * <body>
 * <div ng-controller="WelcomeController">
 *   {{greeting}}
 * </div>
 *
 * <script src="angular.js"></script>
 * <script>
 *   var app = angular.module('demo', [])
 *   .controller('WelcomeController', function($scope) {
 *       $scope.greeting = 'Welcome!';
 *   });
 *   angular.bootstrap(document, ['demo']);
 * </script>
 * </body>
 * </html>
 * ```
 *
 * @param {DOMElement} element DOM element which is the root of AngularJS application.
 * @param {Array<String|Function|Array>=} modules an array of modules to load into the application.
 *     Each item in the array should be the name of a predefined module or a (DI annotated)
 *     function that will be invoked by the injector as a `config` block.
 *     See: {@link angular.module modules}
 * @param {Object=} config an object for defining configuration options for the application. The
 *     following keys are supported:
 *
 * * `strictDi` - disable automatic function annotation for the application. This is meant to
 *   assist in finding bugs which break minified code. Defaults to `false`.
 *
 * @returns {auto.$injector} Returns the newly created injector for this app.
 */
function bootstrap(element, modules, config) {
  if (!isObject(config)) config = {};
  var defaultConfig = {
    strictDi: false
  };
  config = extend(defaultConfig, config);
  var doBootstrap = function() {
    element = jqLite(element);

    if (element.injector()) {
      var tag = (element[0] === window.document) ? 'document' : startingTag(element);
      // Encode angle brackets to prevent input from being sanitized to empty string #8683.
      throw ngMinErr(
          'btstrpd',
          'App already bootstrapped with this element \'{0}\'',
          tag.replace(/</,'&lt;').replace(/>/,'&gt;'));
    }

    modules = modules || [];
    modules.unshift(['$provide', function($provide) {
      $provide.value('$rootElement', element);
    }]);

    if (config.debugInfoEnabled) {
      // Pushing so that this overrides `debugInfoEnabled` setting defined in user's `modules`.
      modules.push(['$compileProvider', function($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
      }]);
    }

    modules.unshift('ng');
    var injector = createInjector(modules, config.strictDi);
    injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector',
       function bootstrapApply(scope, element, compile, injector) {
        scope.$apply(function() {
          element.data('$injector', injector);
          compile(element)(scope);
        });
      }]
    );
    return injector;
  };

  var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;
  var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;

  if (window && NG_ENABLE_DEBUG_INFO.test(window.name)) {
    config.debugInfoEnabled = true;
    window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, '');
  }

  if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
    return doBootstrap();
  }

  window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
  angular.resumeBootstrap = function(extraModules) {
    forEach(extraModules, function(module) {
      modules.push(module);
    });
    return doBootstrap();
  };

  if (isFunction(angular.resumeDeferredBootstrap)) {
    angular.resumeDeferredBootstrap();
  }
}

/**
 * @ngdoc function
 * @name angular.reloadWithDebugInfo
 * @module ng
 * @description
 * Use this function to reload the current application with debug information turned on.
 * This takes precedence over a call to `$compileProvider.debugInfoEnabled(false)`.
 *
 * See {@link ng.$compileProvider#debugInfoEnabled} for more.
 */
function reloadWithDebugInfo() {
  window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;
  window.location.reload();
}

/**
 * @name angular.getTestability
 * @module ng
 * @description
 * Get the testability service for the instance of AngularJS on the given
 * element.
 * @param {DOMElement} element DOM element which is the root of AngularJS application.
 */
function getTestability(rootElement) {
  var injector = angular.element(rootElement).injector();
  if (!injector) {
    throw ngMinErr('test',
      'no injector found for element argument to getTestability');
  }
  return injector.get('$$testability');
}

var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator) {
  separator = separator || '_';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}

var bindJQueryFired = false;
function bindJQuery() {
  var originalCleanData;

  if (bindJQueryFired) {
    return;
  }

  // bind to jQuery if present;
  var jqName = jq();
  jQuery = isUndefined(jqName) ? window.jQuery :   // use jQuery (if present)
           !jqName             ? undefined     :   // use jqLite
                                 window[jqName];   // use jQuery specified by `ngJq`

  // Use jQuery if it exists with proper functionality, otherwise default to us.
  // AngularJS 1.2+ requires jQuery 1.7+ for on()/off() support.
  // AngularJS 1.3+ technically requires at least jQuery 2.1+ but it may work with older
  // versions. It will not work for sure with jQuery <1.7, though.
  if (jQuery && jQuery.fn.on) {
    jqLite = jQuery;
    extend(jQuery.fn, {
      scope: JQLitePrototype.scope,
      isolateScope: JQLitePrototype.isolateScope,
      controller: /** @type {?} */ (JQLitePrototype).controller,
      injector: JQLitePrototype.injector,
      inheritedData: JQLitePrototype.inheritedData
    });
  } else {
    jqLite = JQLite;
  }

  // All nodes removed from the DOM via various jqLite/jQuery APIs like .remove()
  // are passed through jqLite/jQuery.cleanData. Monkey-patch this method to fire
  // the $destroy event on all removed nodes.
  originalCleanData = jqLite.cleanData;
  jqLite.cleanData = function(elems) {
    var events;
    for (var i = 0, elem; (elem = elems[i]) != null; i++) {
      events = (jqLite._data(elem) || {}).events;
      if (events && events.$destroy) {
        jqLite(elem).triggerHandler('$destroy');
      }
    }
    originalCleanData(elems);
  };

  angular.element = jqLite;

  // Prevent double-proxying.
  bindJQueryFired = true;
}

/**
 * @ngdoc function
 * @name angular.UNSAFE_restoreLegacyJqLiteXHTMLReplacement
 * @module ng
 * @kind function
 *
 * @description
 * Restores the pre-1.8 behavior of jqLite that turns XHTML-like strings like
 * `<div /><span />` to `<div></div><span></span>` instead of `<div><span></span></div>`.
 * The new behavior is a security fix. Thus, if you need to call this function, please try to adjust
 * your code for this change and remove your use of this function as soon as possible.

 * Note that this only patches jqLite. If you use jQuery 3.5.0 or newer, please read the
 * [jQuery 3.5 upgrade guide](https://jquery.com/upgrade-guide/3.5/) for more details
 * about the workarounds.
 */
function UNSAFE_restoreLegacyJqLiteXHTMLReplacement() {
  JQLite.legacyXHTMLReplacement = true;
}

/**
 * throw error if the argument is falsy.
 */
function assertArg(arg, name, reason) {
  if (!arg) {
    throw ngMinErr('areq', 'Argument \'{0}\' is {1}', (name || '?'), (reason || 'required'));
  }
  return arg;
}

function assertArgFn(arg, name, acceptArrayAnnotation) {
  if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
  }

  assertArg(isFunction(arg), name, 'not a function, got ' +
      (arg && typeof arg === 'object' ? arg.constructor.name || 'Object' : typeof arg));
  return arg;
}

/**
 * throw error if the name given is hasOwnProperty
 * @param  {String} name    the name to test
 * @param  {String} context the context in which the name is used, such as module or directive
 */
function assertNotHasOwnProperty(name, context) {
  if (name === 'hasOwnProperty') {
    throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
  }
}

/**
 * Return the value accessible from the object by path. Any undefined traversals are ignored
 * @param {Object} obj starting object
 * @param {String} path path to traverse
 * @param {boolean} [bindFnToScope=true]
 * @returns {Object} value as accessible by path
 */
//TODO(misko): this function needs to be removed
function getter(obj, path, bindFnToScope) {
  if (!path) return obj;
  var keys = path.split('.');
  var key;
  var lastInstance = obj;
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    key = keys[i];
    if (obj) {
      obj = (lastInstance = obj)[key];
    }
  }
  if (!bindFnToScope && isFunction(obj)) {
    return bind(lastInstance, obj);
  }
  return obj;
}

/**
 * Return the DOM siblings between the first and last node in the given array.
 * @param {Array} array like object
 * @returns {Array} the inputted object or a jqLite collection containing the nodes
 */
function getBlockNodes(nodes) {
  // TODO(perf): update `nodes` instead of creating a new object?
  var node = nodes[0];
  var endNode = nodes[nodes.length - 1];
  var blockNodes;

  for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
    if (blockNodes || nodes[i] !== node) {
      if (!blockNodes) {
        blockNodes = jqLite(slice.call(nodes, 0, i));
      }
      blockNodes.push(node);
    }
  }

  return blockNodes || nodes;
}


/**
 * Creates a new object without a prototype. This object is useful for lookup without having to
 * guard against prototypically inherited properties via hasOwnProperty.
 *
 * Related micro-benchmarks:
 * - http://jsperf.com/object-create2
 * - http://jsperf.com/proto-map-lookup/2
 * - http://jsperf.com/for-in-vs-object-keys2
 *
 * @returns {Object}
 */
function createMap() {
  return Object.create(null);
}

function stringify(value) {
  if (value == null) { // null || undefined
    return '';
  }
  switch (typeof value) {
    case 'string':
      break;
    case 'number':
      value = '' + value;
      break;
    default:
      if (hasCustomToString(value) && !isArray(value) && !isDate(value)) {
        value = value.toString();
      } else {
        value = toJson(value);
      }
  }

  return value;
}

var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_ATTRIBUTE = 2;
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_DOCUMENT = 9;
var NODE_TYPE_DOCUMENT_FRAGMENT = 11;

/**
 * @ngdoc type
 * @name angular.Module
 * @module ng
 * @description
 *
 * Interface for configuring AngularJS {@link angular.module modules}.
 */

function setupModuleLoader(window) {

  var $injectorMinErr = minErr('$injector');
  var ngMinErr = minErr('ng');

  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  var angular = ensure(window, 'angular', Object);

  // We need to expose `angular.$$minErr` to modules such as `ngResource` that reference it during bootstrap
  angular.$$minErr = angular.$$minErr || minErr;

  return ensure(angular, 'module', function() {
    /** @type {Object.<string, angular.Module>} */
    var modules = {};

    /**
     * @ngdoc function
     * @name angular.module
     * @module ng
     * @description
     *
     * The `angular.module` is a global place for creating, registering and retrieving AngularJS
     * modules.
     * All modules (AngularJS core or 3rd party) that should be available to an application must be
     * registered using this mechanism.
     *
     * Passing one argument retrieves an existing {@link angular.Module},
     * whereas passing more than one argument creates a new {@link angular.Module}
     *
     *
     * # Module
     *
     * A module is a collection of services, directives, controllers, filters, and configuration information.
     * `angular.module` is used to configure the {@link auto.$injector $injector}.
     *
     * ```js
     * // Create a new module
     * var myModule = angular.module('myModule', []);
     *
     * // register a new service
     * myModule.value('appName', 'MyCoolApp');
     *
     * // configure existing services inside initialization blocks.
     * myModule.config(['$locationProvider', function($locationProvider) {
     *   // Configure existing providers
     *   $locationProvider.hashPrefix('!');
     * }]);
     * ```
     *
     * Then you can create an injector and load your modules like this:
     *
     * ```js
     * var injector = angular.injector(['ng', 'myModule'])
     * ```
     *
     * However it's more likely that you'll just use
     * {@link ng.directive:ngApp ngApp} or
     * {@link angular.bootstrap} to simplify this process for you.
     *
     * @param {!string} name The name of the module to create or retrieve.
     * @param {!Array.<string>=} requires If specified then new module is being created. If
     *        unspecified then the module is being retrieved for further configuration.
     * @param {Function=} configFn Optional configuration function for the module. Same as
     *        {@link angular.Module#config Module#config()}.
     * @returns {angular.Module} new module with the {@link angular.Module} api.
     */
    return function module(name, requires, configFn) {

      var info = {};

      var assertNotHasOwnProperty = function(name, context) {
        if (name === 'hasOwnProperty') {
          throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
        }
      };

      assertNotHasOwnProperty(name, 'module');
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }
      return ensure(modules, name, function() {
        if (!requires) {
          throw $injectorMinErr('nomod', 'Module \'{0}\' is not available! You either misspelled ' +
             'the module name or forgot to load it. If registering a module ensure that you ' +
             'specify the dependencies as the second argument.', name);
        }

        /** @type {!Array.<Array.<*>>} */
        var invokeQueue = [];

        /** @type {!Array.<Function>} */
        var configBlocks = [];

        /** @type {!Array.<Function>} */
        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke', 'push', configBlocks);

        /** @type {angular.Module} */
        var moduleInstance = {
          // Private state
          _invokeQueue: invokeQueue,
          _configBlocks: configBlocks,
          _runBlocks: runBlocks,

          /**
           * @ngdoc method
           * @name angular.Module#info
           * @module ng
           *
           * @param {Object=} info Information about the module
           * @returns {Object|Module} The current info object for this module if called as a getter,
           *                          or `this` if called as a setter.
           *
           * @description
           * Read and write custom information about this module.
           * For example you could put the version of the module in here.
           *
           * ```js
           * angular.module('myModule', []).info({ version: '1.0.0' });
           * ```
           *
           * The version could then be read back out by accessing the module elsewhere:
           *
           * ```
           * var version = angular.module('myModule').info().version;
           * ```
           *
           * You can also retrieve this information during runtime via the
           * {@link $injector#modules `$injector.modules`} property:
           *
           * ```js
           * var version = $injector.modules['myModule'].info().version;
           * ```
           */
          info: function(value) {
            if (isDefined(value)) {
              if (!isObject(value)) throw ngMinErr('aobj', 'Argument \'{0}\' must be an object', 'value');
              info = value;
              return this;
            }
            return info;
          },

          /**
           * @ngdoc property
           * @name angular.Module#requires
           * @module ng
           *
           * @description
           * Holds the list of modules which the injector will load before the current module is
           * loaded.
           */
          requires: requires,

          /**
           * @ngdoc property
           * @name angular.Module#name
           * @module ng
           *
           * @description
           * Name of the module.
           */
          name: name,


          /**
           * @ngdoc method
           * @name angular.Module#provider
           * @module ng
           * @param {string} name service name
           * @param {Function} providerType Construction function for creating new instance of the
           *                                service.
           * @description
           * See {@link auto.$provide#provider $provide.provider()}.
           */
          provider: invokeLaterAndSetModuleName('$provide', 'provider'),

          /**
           * @ngdoc method
           * @name angular.Module#factory
           * @module ng
           * @param {string} name service name
           * @param {Function} providerFunction Function for creating new instance of the service.
           * @description
           * See {@link auto.$provide#factory $provide.factory()}.
           */
          factory: invokeLaterAndSetModuleName('$provide', 'factory'),

          /**
           * @ngdoc method
           * @name angular.Module#service
           * @module ng
           * @param {string} name service name
           * @param {Function} constructor A constructor function that will be instantiated.
           * @description
           * See {@link auto.$provide#service $provide.service()}.
           */
          service: invokeLaterAndSetModuleName('$provide', 'service'),

          /**
           * @ngdoc method
           * @name angular.Module#value
           * @module ng
           * @param {string} name service name
           * @param {*} object Service instance object.
           * @description
           * See {@link auto.$provide#value $provide.value()}.
           */
          value: invokeLater('$provide', 'value'),

          /**
           * @ngdoc method
           * @name angular.Module#constant
           * @module ng
           * @param {string} name constant name
           * @param {*} object Constant value.
           * @description
           * Because the constants are fixed, they get applied before other provide methods.
           * See {@link auto.$provide#constant $provide.constant()}.
           */
          constant: invokeLater('$provide', 'constant', 'unshift'),

           /**
           * @ngdoc method
           * @name angular.Module#decorator
           * @module ng
           * @param {string} name The name of the service to decorate.
           * @param {Function} decorFn This function will be invoked when the service needs to be
           *                           instantiated and should return the decorated service instance.
           * @description
           * See {@link auto.$provide#decorator $provide.decorator()}.
           */
          decorator: invokeLaterAndSetModuleName('$provide', 'decorator', configBlocks),

          /**
           * @ngdoc method
           * @name angular.Module#animation
           * @module ng
           * @param {string} name animation name
           * @param {Function} animationFactory Factory function for creating new instance of an
           *                                    animation.
           * @description
           *
           * **NOTE**: animations take effect only if the **ngAnimate** module is loaded.
           *
           *
           * Defines an animation hook that can be later used with
           * {@link $animate $animate} service and directives that use this service.
           *
           * ```js
           * module.animation('.animation-name', function($inject1, $inject2) {
           *   return {
           *     eventName : function(element, done) {
           *       //code to run the animation
           *       //once complete, then run done()
           *       return function cancellationFunction(element) {
           *         //code to cancel the animation
           *       }
           *     }
           *   }
           * })
           * ```
           *
           * See {@link ng.$animateProvider#register $animateProvider.register()} and
           * {@link ngAnimate ngAnimate module} for more information.
           */
          animation: invokeLaterAndSetModuleName('$animateProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#filter
           * @module ng
           * @param {string} name Filter name - this must be a valid AngularJS expression identifier
           * @param {Function} filterFactory Factory function for creating new instance of filter.
           * @description
           * See {@link ng.$filterProvider#register $filterProvider.register()}.
           *
           * <div class="alert alert-warning">
           * **Note:** Filter names must be valid AngularJS {@link expression} identifiers, such as `uppercase` or `orderBy`.
           * Names with special characters, such as hyphens and dots, are not allowed. If you wish to namespace
           * your filters, then you can use capitalization (`myappSubsectionFilterx`) or underscores
           * (`myapp_subsection_filterx`).
           * </div>
           */
          filter: invokeLaterAndSetModuleName('$filterProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#controller
           * @module ng
           * @param {string|Object} name Controller name, or an object map of controllers where the
           *    keys are the names and the values are the constructors.
           * @param {Function} constructor Controller constructor function.
           * @description
           * See {@link ng.$controllerProvider#register $controllerProvider.register()}.
           */
          controller: invokeLaterAndSetModuleName('$controllerProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#directive
           * @module ng
           * @param {string|Object} name Directive name, or an object map of directives where the
           *    keys are the names and the values are the factories.
           * @param {Function} directiveFactory Factory function for creating new instance of
           * directives.
           * @description
           * See {@link ng.$compileProvider#directive $compileProvider.directive()}.
           */
          directive: invokeLaterAndSetModuleName('$compileProvider', 'directive'),

          /**
           * @ngdoc method
           * @name angular.Module#component
           * @module ng
           * @param {string|Object} name Name of the component in camelCase (i.e. `myComp` which will match `<my-comp>`),
           *    or an object map of components where the keys are the names and the values are the component definition objects.
           * @param {Object} options Component definition object (a simplified
           *    {@link ng.$compile#directive-definition-object directive definition object})
           *
           * @description
           * See {@link ng.$compileProvider#component $compileProvider.component()}.
           */
          component: invokeLaterAndSetModuleName('$compileProvider', 'component'),

          /**
           * @ngdoc method
           * @name angular.Module#config
           * @module ng
           * @param {Function} configFn Execute this function on module load. Useful for service
           *    configuration.
           * @description
           * Use this method to configure services by injecting their
           * {@link angular.Module#provider `providers`}, e.g. for adding routes to the
           * {@link ngRoute.$routeProvider $routeProvider}.
           *
           * Note that you can only inject {@link angular.Module#provider `providers`} and
           * {@link angular.Module#constant `constants`} into this function.
           *
           * For more about how to configure services, see
           * {@link providers#provider-recipe Provider Recipe}.
           */
          config: config,

          /**
           * @ngdoc method
           * @name angular.Module#run
           * @module ng
           * @param {Function} initializationFn Execute this function after injector creation.
           *    Useful for application initialization.
           * @description
           * Use this method to register work which should be performed when the injector is done
           * loading all modules.
           */
          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        };

        if (configFn) {
          config(configFn);
        }

        return moduleInstance;

        /**
         * @param {string} provider
         * @param {string} method
         * @param {String=} insertMethod
         * @returns {angular.Module}
         */
        function invokeLater(provider, method, insertMethod, queue) {
          if (!queue) queue = invokeQueue;
          return function() {
            queue[insertMethod || 'push']([provider, method, arguments]);
            return moduleInstance;
          };
        }

        /**
         * @param {string} provider
         * @param {string} method
         * @returns {angular.Module}
         */
        function invokeLaterAndSetModuleName(provider, method, queue) {
          if (!queue) queue = invokeQueue;
          return function(recipeName, factoryFunction) {
            if (factoryFunction && isFunction(factoryFunction)) factoryFunction.$$moduleName = name;
            queue.push([provider, method, arguments]);
            return moduleInstance;
          };
        }
      });
    };
  });

}

/* global shallowCopy: true */

/**
 * Creates a shallow copy of an object, an array or a primitive.
 *
 * Assumes that there are no proto properties for objects.
 */
function shallowCopy(src, dst) {
  if (isArray(src)) {
    dst = dst || [];

    for (var i = 0, ii = src.length; i < ii; i++) {
      dst[i] = src[i];
    }
  } else if (isObject(src)) {
    dst = dst || {};

    for (var key in src) {
      if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }
  }

  return dst || src;
}

/* exported toDebugString */

function serializeObject(obj, maxDepth) {
  var seen = [];

  // There is no direct way to stringify object until reaching a specific depth
  // and a very deep object can cause a performance issue, so we copy the object
  // based on this specific depth and then stringify it.
  if (isValidObjectMaxDepth(maxDepth)) {
    // This file is also included in `angular-loader`, so `copy()` might not always be available in
    // the closure. Therefore, it is lazily retrieved as `angular.copy()` when needed.
    obj = angular.copy(obj, null, maxDepth);
  }
  return JSON.stringify(obj, function(key, val) {
    val = toJsonReplacer(key, val);
    if (isObject(val)) {

      if (seen.indexOf(val) >= 0) return '...';

      seen.push(val);
    }
    return val;
  });
}

function toDebugString(obj, maxDepth) {
  if (typeof obj === 'function') {
    return obj.toString().replace(/ \{[\s\S]*$/, '');
  } else if (isUndefined(obj)) {
    return 'undefined';
  } else if (typeof obj !== 'string') {
    return serializeObject(obj, maxDepth);
  }
  return obj;
}

/* global angularModule: true,
  version: true,

  $CompileProvider,

  htmlAnchorDirective,
  inputDirective,
  hiddenInputBrowserCacheDirective,
  formDirective,
  scriptDirective,
  selectDirective,
  optionDirective,
  ngBindDirective,
  ngBindHtmlDirective,
  ngBindTemplateDirective,
  ngClassDirective,
  ngClassEvenDirective,
  ngClassOddDirective,
  ngCloakDirective,
  ngControllerDirective,
  ngFormDirective,
  ngHideDirective,
  ngIfDirective,
  ngIncludeDirective,
  ngIncludeFillContentDirective,
  ngInitDirective,
  ngNonBindableDirective,
  ngPluralizeDirective,
  ngRefDirective,
  ngRepeatDirective,
  ngShowDirective,
  ngStyleDirective,
  ngSwitchDirective,
  ngSwitchWhenDirective,
  ngSwitchDefaultDirective,
  ngOptionsDirective,
  ngTranscludeDirective,
  ngModelDirective,
  ngListDirective,
  ngChangeDirective,
  patternDirective,
  patternDirective,
  requiredDirective,
  requiredDirective,
  minlengthDirective,
  minlengthDirective,
  maxlengthDirective,
  maxlengthDirective,
  ngValueDirective,
  ngModelOptionsDirective,
  ngAttributeAliasDirectives,
  ngEventDirectives,

  $AnchorScrollProvider,
  $AnimateProvider,
  $CoreAnimateCssProvider,
  $$CoreAnimateJsProvider,
  $$CoreAnimateQueueProvider,
  $$AnimateRunnerFactoryProvider,
  $$AnimateAsyncRunFactoryProvider,
  $BrowserProvider,
  $CacheFactoryProvider,
  $ControllerProvider,
  $DateProvider,
  $DocumentProvider,
  $$IsDocumentHiddenProvider,
  $ExceptionHandlerProvider,
  $FilterProvider,
  $$ForceReflowProvider,
  $InterpolateProvider,
  $$IntervalFactoryProvider,
  $IntervalProvider,
  $HttpProvider,
  $HttpParamSerializerProvider,
  $HttpParamSerializerJQLikeProvider,
  $HttpBackendProvider,
  $xhrFactoryProvider,
  $jsonpCallbacksProvider,
  $LocationProvider,
  $LogProvider,
  $$MapProvider,
  $ParseProvider,
  $RootScopeProvider,
  $QProvider,
  $$QProvider,
  $$SanitizeUriProvider,
  $SceProvider,
  $SceDelegateProvider,
  $SnifferProvider,
  $$TaskTrackerFactoryProvider,
  $TemplateCacheProvider,
  $TemplateRequestProvider,
  $$TestabilityProvider,
  $TimeoutProvider,
  $$RAFProvider,
  $WindowProvider,
  $$jqLiteProvider,
  $$CookieReaderProvider
*/


/**
 * @ngdoc object
 * @name angular.version
 * @module ng
 * @description
 * An object that contains information about the current AngularJS version.
 *
 * This object has the following properties:
 *
 * - `full` – `{string}` – Full version string, such as "0.9.18".
 * - `major` – `{number}` – Major version number, such as "0".
 * - `minor` – `{number}` – Minor version number, such as "9".
 * - `dot` – `{number}` – Dot version number, such as "18".
 * - `codeName` – `{string}` – Code name of the release, such as "jiggling-armfat".
 */
var version = {
  // These placeholder strings will be replaced by grunt's `build` task.
  // They need to be double- or single-quoted.
  full: '1.8.2',
  major: '1',
  minor: '8',
  dot: '2',
  codeName: 'meteoric-mining'
};


function publishExternalAPI(angular) {
  extend(angular, {
    'errorHandlingConfig': errorHandlingConfig,
    'bootstrap': bootstrap,
    'copy': copy,
    'extend': extend,
    'merge': merge,
    'equals': equals,
    'element': jqLite,
    'forEach': forEach,
    'injector': createInjector,
    'noop': noop,
    'bind': bind,
    'toJson': toJson,
    'fromJson': fromJson,
    'identity': identity,
    'isUndefined': isUndefined,
    'isDefined': isDefined,
    'isString': isString,
    'isFunction': isFunction,
    'isObject': isObject,
    'isNumber': isNumber,
    'isElement': isElement,
    'isArray': isArray,
    'version': version,
    'isDate': isDate,
    'callbacks': {$$counter: 0},
    'getTestability': getTestability,
    'reloadWithDebugInfo': reloadWithDebugInfo,
    'UNSAFE_restoreLegacyJqLiteXHTMLReplacement': UNSAFE_restoreLegacyJqLiteXHTMLReplacement,
    '$$minErr': minErr,
    '$$csp': csp,
    '$$encodeUriSegment': encodeUriSegment,
    '$$encodeUriQuery': encodeUriQuery,
    '$$lowercase': lowercase,
    '$$stringify': stringify,
    '$$uppercase': uppercase
  });

  angularModule = setupModuleLoader(window);

  angularModule('ng', ['ngLocale'], ['$provide',
    function ngModule($provide) {
      // $$sanitizeUriProvider needs to be before $compileProvider as it is used by it.
      $provide.provider({
        $$sanitizeUri: $$SanitizeUriProvider
      });
      $provide.provider('$compile', $CompileProvider).
        directive({
            a: htmlAnchorDirective,
            input: inputDirective,
            textarea: inputDirective,
            form: formDirective,
            script: scriptDirective,
            select: selectDirective,
            option: optionDirective,
            ngBind: ngBindDirective,
            ngBindHtml: ngBindHtmlDirective,
            ngBindTemplate: ngBindTemplateDirective,
            ngClass: ngClassDirective,
            ngClassEven: ngClassEvenDirective,
            ngClassOdd: ngClassOddDirective,
            ngCloak: ngCloakDirective,
            ngController: ngControllerDirective,
            ngForm: ngFormDirective,
            ngHide: ngHideDirective,
            ngIf: ngIfDirective,
            ngInclude: ngIncludeDirective,
            ngInit: ngInitDirective,
            ngNonBindable: ngNonBindableDirective,
            ngPluralize: ngPluralizeDirective,
            ngRef: ngRefDirective,
            ngRepeat: ngRepeatDirective,
            ngShow: ngShowDirective,
            ngStyle: ngStyleDirective,
            ngSwitch: ngSwitchDirective,
            ngSwitchWhen: ngSwitchWhenDirective,
            ngSwitchDefault: ngSwitchDefaultDirective,
            ngOptions: ngOptionsDirective,
            ngTransclude: ngTranscludeDirective,
            ngModel: ngModelDirective,
            ngList: ngListDirective,
            ngChange: ngChangeDirective,
            pattern: patternDirective,
            ngPattern: patternDirective,
            required: requiredDirective,
            ngRequired: requiredDirective,
            minlength: minlengthDirective,
            ngMinlength: minlengthDirective,
            maxlength: maxlengthDirective,
            ngMaxlength: maxlengthDirective,
            ngValue: ngValueDirective,
            ngModelOptions: ngModelOptionsDirective
        }).
        directive({
          ngInclude: ngIncludeFillContentDirective,
          input: hiddenInputBrowserCacheDirective
        }).
        directive(ngAttributeAliasDirectives).
        directive(ngEventDirectives);
      $provide.provider({
        $anchorScroll: $AnchorScrollProvider,
        $animate: $AnimateProvider,
        $animateCss: $CoreAnimateCssProvider,
        $$animateJs: $$CoreAnimateJsProvider,
        $$animateQueue: $$CoreAnimateQueueProvider,
        $$AnimateRunner: $$AnimateRunnerFactoryProvider,
        $$animateAsyncRun: $$AnimateAsyncRunFactoryProvider,
        $browser: $BrowserProvider,
        $cacheFactory: $CacheFactoryProvider,
        $controller: $ControllerProvider,
        $document: $DocumentProvider,
        $$isDocumentHidden: $$IsDocumentHiddenProvider,
        $exceptionHandler: $ExceptionHandlerProvider,
        $filter: $FilterProvider,
        $$forceReflow: $$ForceReflowProvider,
        $interpolate: $InterpolateProvider,
        $interval: $IntervalProvider,
        $$intervalFactory: $$IntervalFactoryProvider,
        $http: $HttpProvider,
        $httpParamSerializer: $HttpParamSerializerProvider,
        $httpParamSerializerJQLike: $HttpParamSerializerJQLikeProvider,
        $httpBackend: $HttpBackendProvider,
        $xhrFactory: $xhrFactoryProvider,
        $jsonpCallbacks: $jsonpCallbacksProvider,
        $location: $LocationProvider,
        $log: $LogProvider,
        $parse: $ParseProvider,
        $rootScope: $RootScopeProvider,
        $q: $QProvider,
        $$q: $$QProvider,
        $sce: $SceProvider,
        $sceDelegate: $SceDelegateProvider,
        $sniffer: $SnifferProvider,
        $$taskTrackerFactory: $$TaskTrackerFactoryProvider,
        $templateCache: $TemplateCacheProvider,
        $templateRequest: $TemplateRequestProvider,
        $$testability: $$TestabilityProvider,
        $timeout: $TimeoutProvider,
        $window: $WindowProvider,
        $$rAF: $$RAFProvider,
        $$jqLite: $$jqLiteProvider,
        $$Map: $$MapProvider,
        $$cookieReader: $$CookieReaderProvider
      });
    }
  ]);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* global
  JQLitePrototype: true,
  BOOLEAN_ATTR: true,
  ALIASED_ATTR: true
*/

//////////////////////////////////
//JQLite
//////////////////////////////////

/**
 * @ngdoc function
 * @name angular.element
 * @module ng
 * @kind function
 *
 * @description
 * Wraps a raw DOM element or HTML string as a [jQuery](http://jquery.com) element.
 *
 * If jQuery is available, `angular.element` is an alias for the
 * [jQuery](http://api.jquery.com/jQuery/) function. If jQuery is not available, `angular.element`
 * delegates to AngularJS's built-in subset of jQuery, called "jQuery lite" or **jqLite**.
 *
 * jqLite is a tiny, API-compatible subset of jQuery that allows
 * AngularJS to manipulate the DOM in a cross-browser compatible way. jqLite implements only the most
 * commonly needed functionality with the goal of having a very small footprint.
 *
 * To use `jQuery`, simply ensure it is loaded before the `angular.js` file. You can also use the
 * {@link ngJq `ngJq`} directive to specify that jqlite should be used over jQuery, or to use a
 * specific version of jQuery if multiple versions exist on the page.
 *
 * <div class="alert alert-info">**Note:** All element references in AngularJS are always wrapped with jQuery or
 * jqLite (such as the element argument in a directive's compile / link function). They are never raw DOM references.</div>
 *
 * <div class="alert alert-warning">**Note:** Keep in mind that this function will not find elements
 * by tag name / CSS selector. For lookups by tag name, try instead `angular.element(document).find(...)`
 * or `$document.find()`, or use the standard DOM APIs, e.g. `document.querySelectorAll()`.</div>
 *
 * ## AngularJS's jqLite
 * jqLite provides only the following jQuery methods:
 *
 * - [`addClass()`](http://api.jquery.com/addClass/) - Does not support a function as first argument
 * - [`after()`](http://api.jquery.com/after/)
 * - [`append()`](http://api.jquery.com/append/) - Contrary to jQuery, this doesn't clone elements
 *   so will not work correctly when invoked on a jqLite object containing more than one DOM node
 * - [`attr()`](http://api.jquery.com/attr/) - Does not support functions as parameters
 * - [`bind()`](http://api.jquery.com/bind/) (_deprecated_, use [`on()`](http://api.jquery.com/on/)) - Does not support namespaces, selectors or eventData
 * - [`children()`](http://api.jquery.com/children/) - Does not support selectors
 * - [`clone()`](http://api.jquery.com/clone/)
 * - [`contents()`](http://api.jquery.com/contents/)
 * - [`css()`](http://api.jquery.com/css/) - Only retrieves inline-styles, does not call `getComputedStyle()`.
 *   As a setter, does not convert numbers to strings or append 'px', and also does not have automatic property prefixing.
 * - [`data()`](http://api.jquery.com/data/)
 * - [`detach()`](http://api.jquery.com/detach/)
 * - [`empty()`](http://api.jquery.com/empty/)
 * - [`eq()`](http://api.jquery.com/eq/)
 * - [`find()`](http://api.jquery.com/find/) - Limited to lookups by tag name
 * - [`hasClass()`](http://api.jquery.com/hasClass/)
 * - [`html()`](http://api.jquery.com/html/)
 * - [`next()`](http://api.jquery.com/next/) - Does not support selectors
 * - [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
 * - [`off()`](http://api.jquery.com/off/) - Does not support namespaces, selectors or event object as parameter
 * - [`one()`](http://api.jquery.com/one/) - Does not support namespaces or selectors
 * - [`parent()`](http://api.jquery.com/parent/) - Does not support selectors
 * - [`prepend()`](http://api.jquery.com/prepend/)
 * - [`prop()`](http://api.jquery.com/prop/)
 * - [`ready()`](http://api.jquery.com/ready/) (_deprecated_, use `angular.element(callback)` instead of `angular.element(document).ready(callback)`)
 * - [`remove()`](http://api.jquery.com/remove/)
 * - [`removeAttr()`](http://api.jquery.com/removeAttr/) - Does not support multiple attributes
 * - [`removeClass()`](http://api.jquery.com/removeClass/) - Does not support a function as first argument
 * - [`removeData()`](http://api.jquery.com/removeData/)
 * - [`replaceWith()`](http://api.jquery.com/replaceWith/)
 * - [`text()`](http://api.jquery.com/text/)
 * - [`toggleClass()`](http://api.jquery.com/toggleClass/) - Does not support a function as first argument
 * - [`triggerHandler()`](http://api.jquery.com/triggerHandler/) - Passes a dummy event object to handlers
 * - [`unbind()`](http://api.jquery.com/unbind/) (_deprecated_, use [`off()`](http://api.jquery.com/off/)) - Does not support namespaces or event object as parameter
 * - [`val()`](http://api.jquery.com/val/)
 * - [`wrap()`](http://api.jquery.com/wrap/)
 *
 * jqLite also provides a method restoring pre-1.8 insecure treatment of XHTML-like tags.
 * This legacy behavior turns input like `<div /><span />` to `<div></div><span></span>`
 * instead of `<div><span></span></div>` like version 1.8 & newer do. To restore it, invoke:
 * ```js
 * angular.UNSAFE_restoreLegacyJqLiteXHTMLReplacement();
 * ```
 * Note that this only patches jqLite. If you use jQuery 3.5.0 or newer, please read the
 * [jQuery 3.5 upgrade guide](https://jquery.com/upgrade-guide/3.5/) for more details
 * about the workarounds.
 *
 * ## jQuery/jqLite Extras
 * AngularJS also provides the following additional methods and events to both jQuery and jqLite:
 *
 * ### Events
 * - `$destroy` - AngularJS intercepts all jqLite/jQuery's DOM destruction apis and fires this event
 *    on all DOM nodes being removed.  This can be used to clean up any 3rd party bindings to the DOM
 *    element before it is removed.
 *
 * ### Methods
 * - `controller(name)` - retrieves the controller of the current element or its parent. By default
 *   retrieves controller associated with the `ngController` directive. If `name` is provided as
 *   camelCase directive name, then the controller for this directive will be retrieved (e.g.
 *   `'ngModel'`).
 * - `injector()` - retrieves the injector of the current element or its parent.
 * - `scope()` - retrieves the {@link ng.$rootScope.Scope scope} of the current
 *   element or its parent. Requires {@link guide/production#disabling-debug-data Debug Data} to
 *   be enabled.
 * - `isolateScope()` - retrieves an isolate {@link ng.$rootScope.Scope scope} if one is attached directly to the
 *   current element. This getter should be used only on elements that contain a directive which starts a new isolate
 *   scope. Calling `scope()` on this element always returns the original non-isolate scope.
 *   Requires {@link guide/production#disabling-debug-data Debug Data} to be enabled.
 * - `inheritedData()` - same as `data()`, but walks up the DOM until a value is found or the top
 *   parent element is reached.
 *
 * @knownIssue You cannot spy on `angular.element` if you are using Jasmine version 1.x. See
 * https://github.com/angular/angular.js/issues/14251 for more information.
 *
 * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.
 * @returns {Object} jQuery object.
 */

JQLite.expando = 'ng339';

var jqCache = JQLite.cache = {},
    jqId = 1;

/*
 * !!! This is an undocumented "private" function !!!
 */
JQLite._data = function(node) {
  //jQuery always returns an object on cache miss
  return this.cache[node[this.expando]] || {};
};

function jqNextId() { return ++jqId; }


var DASH_LOWERCASE_REGEXP = /-([a-z])/g;
var MS_HACK_REGEXP = /^-ms-/;
var MOUSE_EVENT_MAP = { mouseleave: 'mouseout', mouseenter: 'mouseover' };
var jqLiteMinErr = minErr('jqLite');

/**
 * Converts kebab-case to camelCase.
 * There is also a special case for the ms prefix starting with a lowercase letter.
 * @param name Name to normalize
 */
function cssKebabToCamel(name) {
    return kebabToCamel(name.replace(MS_HACK_REGEXP, 'ms-'));
}

function fnCamelCaseReplace(all, letter) {
  return letter.toUpperCase();
}

/**
 * Converts kebab-case to camelCase.
 * @param name Name to normalize
 */
function kebabToCamel(name) {
  return name
    .replace(DASH_LOWERCASE_REGEXP, fnCamelCaseReplace);
}

var SINGLE_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
var HTML_REGEXP = /<|&#?\w+;/;
var TAG_NAME_REGEXP = /<([\w:-]+)/;
var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;

// Table parts need to be wrapped with `<table>` or they're
// stripped to their contents when put in a div.
// XHTML parsers do not magically insert elements in the
// same way that tag soup parsers do, so we cannot shorten
// this by omitting <tbody> or other required elements.
var wrapMap = {
  thead: ['table'],
  col: ['colgroup', 'table'],
  tr: ['tbody', 'table'],
  td: ['tr', 'tbody', 'table']
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <10 only
// IE 9 requires an option wrapper & it needs to have the whole table structure
// set up in advance; assigning `"<td></td>"` to `tr.innerHTML` doesn't work, etc.
var wrapMapIE9 = {
  option: [1, '<select multiple="multiple">', '</select>'],
  _default: [0, '', '']
};

for (var key in wrapMap) {
  var wrapMapValueClosing = wrapMap[key];
  var wrapMapValue = wrapMapValueClosing.slice().reverse();
  wrapMapIE9[key] = [wrapMapValue.length, '<' + wrapMapValue.join('><') + '>', '</' + wrapMapValueClosing.join('></') + '>'];
}

wrapMapIE9.optgroup = wrapMapIE9.option;

function jqLiteIsTextNode(html) {
  return !HTML_REGEXP.test(html);
}

function jqLiteAcceptsData(node) {
  // The window object can accept data but has no nodeType
  // Otherwise we are only interested in elements (1) and documents (9)
  var nodeType = node.nodeType;
  return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
}

function jqLiteHasData(node) {
  for (var key in jqCache[node.ng339]) {
    return true;
  }
  return false;
}

function jqLiteBuildFragment(html, context) {
  var tmp, tag, wrap, finalHtml,
      fragment = context.createDocumentFragment(),
      nodes = [], i;

  if (jqLiteIsTextNode(html)) {
    // Convert non-html into a text node
    nodes.push(context.createTextNode(html));
  } else {
    // Convert html into DOM nodes
    tmp = fragment.appendChild(context.createElement('div'));
    tag = (TAG_NAME_REGEXP.exec(html) || ['', ''])[1].toLowerCase();
    finalHtml = JQLite.legacyXHTMLReplacement ?
      html.replace(XHTML_TAG_REGEXP, '<$1></$2>') :
      html;

    if (msie < 10) {
      wrap = wrapMapIE9[tag] || wrapMapIE9._default;
      tmp.innerHTML = wrap[1] + finalHtml + wrap[2];

      // Descend through wrappers to the right content
      i = wrap[0];
      while (i--) {
        tmp = tmp.firstChild;
      }
    } else {
      wrap = wrapMap[tag] || [];

      // Create wrappers & descend into them
      i = wrap.length;
      while (--i > -1) {
        tmp.appendChild(window.document.createElement(wrap[i]));
        tmp = tmp.firstChild;
      }

      tmp.innerHTML = finalHtml;
    }

    nodes = concat(nodes, tmp.childNodes);

    tmp = fragment.firstChild;
    tmp.textContent = '';
  }

  // Remove wrapper from fragment
  fragment.textContent = '';
  fragment.innerHTML = ''; // Clear inner HTML
  forEach(nodes, function(node) {
    fragment.appendChild(node);
  });

  return fragment;
}

function jqLiteParseHTML(html, context) {
  context = context || window.document;
  var parsed;

  if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
    return [context.createElement(parsed[1])];
  }

  if ((parsed = jqLiteBuildFragment(html, context))) {
    return parsed.childNodes;
  }

  return [];
}

function jqLiteWrapNode(node, wrapper) {
  var parent = node.parentNode;

  if (parent) {
    parent.replaceChild(wrapper, node);
  }

  wrapper.appendChild(node);
}


// IE9-11 has no method "contains" in SVG element and in Node.prototype. Bug #10259.
var jqLiteContains = window.Node.prototype.contains || /** @this */ function(arg) {
  // eslint-disable-next-line no-bitwise
  return !!(this.compareDocumentPosition(arg) & 16);
};

/////////////////////////////////////////////
function JQLite(element) {
  if (element instanceof JQLite) {
    return element;
  }

  var argIsString;

  if (isString(element)) {
    element = trim(element);
    argIsString = true;
  }
  if (!(this instanceof JQLite)) {
    if (argIsString && element.charAt(0) !== '<') {
      throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
    }
    return new JQLite(element);
  }

  if (argIsString) {
    jqLiteAddNodes(this, jqLiteParseHTML(element));
  } else if (isFunction(element)) {
    jqLiteReady(element);
  } else {
    jqLiteAddNodes(this, element);
  }
}

function jqLiteClone(element) {
  return element.cloneNode(true);
}

function jqLiteDealoc(element, onlyDescendants) {
  if (!onlyDescendants && jqLiteAcceptsData(element)) jqLite.cleanData([element]);

  if (element.querySelectorAll) {
    jqLite.cleanData(element.querySelectorAll('*'));
  }
}

function isEmptyObject(obj) {
  var name;

  for (name in obj) {
    return false;
  }
  return true;
}

function removeIfEmptyData(element) {
  var expandoId = element.ng339;
  var expandoStore = expandoId && jqCache[expandoId];

  var events = expandoStore && expandoStore.events;
  var data = expandoStore && expandoStore.data;

  if ((!data || isEmptyObject(data)) && (!events || isEmptyObject(events))) {
    delete jqCache[expandoId];
    element.ng339 = undefined; // don't delete DOM expandos. IE and Chrome don't like it
  }
}

function jqLiteOff(element, type, fn, unsupported) {
  if (isDefined(unsupported)) throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');

  var expandoStore = jqLiteExpandoStore(element);
  var events = expandoStore && expandoStore.events;
  var handle = expandoStore && expandoStore.handle;

  if (!handle) return; //no listeners registered

  if (!type) {
    for (type in events) {
      if (type !== '$destroy') {
        element.removeEventListener(type, handle);
      }
      delete events[type];
    }
  } else {

    var removeHandler = function(type) {
      var listenerFns = events[type];
      if (isDefined(fn)) {
        arrayRemove(listenerFns || [], fn);
      }
      if (!(isDefined(fn) && listenerFns && listenerFns.length > 0)) {
        element.removeEventListener(type, handle);
        delete events[type];
      }
    };

    forEach(type.split(' '), function(type) {
      removeHandler(type);
      if (MOUSE_EVENT_MAP[type]) {
        removeHandler(MOUSE_EVENT_MAP[type]);
      }
    });
  }

  removeIfEmptyData(element);
}

function jqLiteRemoveData(element, name) {
  var expandoId = element.ng339;
  var expandoStore = expandoId && jqCache[expandoId];

  if (expandoStore) {
    if (name) {
      delete expandoStore.data[name];
    } else {
      expandoStore.data = {};
    }

    removeIfEmptyData(element);
  }
}


function jqLiteExpandoStore(element, createIfNecessary) {
  var expandoId = element.ng339,
      expandoStore = expandoId && jqCache[expandoId];

  if (createIfNecessary && !expandoStore) {
    element.ng339 = expandoId = jqNextId();
    expandoStore = jqCache[expandoId] = {events: {}, data: {}, handle: undefined};
  }

  return expandoStore;
}


function jqLiteData(element, key, value) {
  if (jqLiteAcceptsData(element)) {
    var prop;

    var isSimpleSetter = isDefined(value);
    var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
    var massGetter = !key;
    var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
    var data = expandoStore && expandoStore.data;

    if (isSimpleSetter) { // data('key', value)
      data[kebabToCamel(key)] = value;
    } else {
      if (massGetter) {  // data()
        return data;
      } else {
        if (isSimpleGetter) { // data('key')
          // don't force creation of expandoStore if it doesn't exist yet
          return data && data[kebabToCamel(key)];
        } else { // mass-setter: data({key1: val1, key2: val2})
          for (prop in key) {
            data[kebabToCamel(prop)] = key[prop];
          }
        }
      }
    }
  }
}

function jqLiteHasClass(element, selector) {
  if (!element.getAttribute) return false;
  return ((' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').
      indexOf(' ' + selector + ' ') > -1);
}

function jqLiteRemoveClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
    var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                            .replace(/[\n\t]/g, ' ');
    var newClasses = existingClasses;

    forEach(cssClasses.split(' '), function(cssClass) {
      cssClass = trim(cssClass);
      newClasses = newClasses.replace(' ' + cssClass + ' ', ' ');
    });

    if (newClasses !== existingClasses) {
      element.setAttribute('class', trim(newClasses));
    }
  }
}

function jqLiteAddClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
    var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                            .replace(/[\n\t]/g, ' ');
    var newClasses = existingClasses;

    forEach(cssClasses.split(' '), function(cssClass) {
      cssClass = trim(cssClass);
      if (newClasses.indexOf(' ' + cssClass + ' ') === -1) {
        newClasses += cssClass + ' ';
      }
    });

    if (newClasses !== existingClasses) {
      element.setAttribute('class', trim(newClasses));
    }
  }
}


function jqLiteAddNodes(root, elements) {
  // THIS CODE IS VERY HOT. Don't make changes without benchmarking.

  if (elements) {

    // if a Node (the most common case)
    if (elements.nodeType) {
      root[root.length++] = elements;
    } else {
      var length = elements.length;

      // if an Array or NodeList and not a Window
      if (typeof length === 'number' && elements.window !== elements) {
        if (length) {
          for (var i = 0; i < length; i++) {
            root[root.length++] = elements[i];
          }
        }
      } else {
        root[root.length++] = elements;
      }
    }
  }
}


function jqLiteController(element, name) {
  return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
}

function jqLiteInheritedData(element, name, value) {
  // if element is the document object work with the html element instead
  // this makes $(document).scope() possible
  if (element.nodeType === NODE_TYPE_DOCUMENT) {
    element = element.documentElement;
  }
  var names = isArray(name) ? name : [name];

  while (element) {
    for (var i = 0, ii = names.length; i < ii; i++) {
      if (isDefined(value = jqLite.data(element, names[i]))) return value;
    }

    // If dealing with a document fragment node with a host element, and no parent, use the host
    // element as the parent. This enables directives within a Shadow DOM or polyfilled Shadow DOM
    // to lookup parent controllers.
    element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
  }
}

function jqLiteEmpty(element) {
  jqLiteDealoc(element, true);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function jqLiteRemove(element, keepData) {
  if (!keepData) jqLiteDealoc(element);
  var parent = element.parentNode;
  if (parent) parent.removeChild(element);
}


function jqLiteDocumentLoaded(action, win) {
  win = win || window;
  if (win.document.readyState === 'complete') {
    // Force the action to be run async for consistent behavior
    // from the action's point of view
    // i.e. it will definitely not be in a $apply
    win.setTimeout(action);
  } else {
    // No need to unbind this handler as load is only ever called once
    jqLite(win).on('load', action);
  }
}

function jqLiteReady(fn) {
  function trigger() {
    window.document.removeEventListener('DOMContentLoaded', trigger);
    window.removeEventListener('load', trigger);
    fn();
  }

  // check if document is already loaded
  if (window.document.readyState === 'complete') {
    window.setTimeout(fn);
  } else {
    // We can not use jqLite since we are not done loading and jQuery could be loaded later.

    // Works for modern browsers and IE9
    window.document.addEventListener('DOMContentLoaded', trigger);

    // Fallback to window.onload for others
    window.addEventListener('load', trigger);
  }
}

//////////////////////////////////////////
// Functions which are declared directly.
//////////////////////////////////////////
var JQLitePrototype = JQLite.prototype = {
  ready: jqLiteReady,
  toString: function() {
    var value = [];
    forEach(this, function(e) { value.push('' + e);});
    return '[' + value.join(', ') + ']';
  },

  eq: function(index) {
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
  },

  length: 0,
  push: push,
  sort: [].sort,
  splice: [].splice
};

//////////////////////////////////////////
// Functions iterating getter/setters.
// these functions return self on setter and
// value on get.
//////////////////////////////////////////
var BOOLEAN_ATTR = {};
forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
  BOOLEAN_ATTR[lowercase(value)] = value;
});
var BOOLEAN_ELEMENTS = {};
forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
  BOOLEAN_ELEMENTS[value] = true;
});
var ALIASED_ATTR = {
  'ngMinlength': 'minlength',
  'ngMaxlength': 'maxlength',
  'ngMin': 'min',
  'ngMax': 'max',
  'ngPattern': 'pattern',
  'ngStep': 'step'
};

function getBooleanAttrName(element, name) {
  // check dom last since we will most likely fail on name
  var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];

  // booleanAttr is here twice to minimize DOM access
  return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
}

function getAliasedAttrName(name) {
  return ALIASED_ATTR[name];
}

forEach({
  data: jqLiteData,
  removeData: jqLiteRemoveData,
  hasData: jqLiteHasData,
  cleanData: function jqLiteCleanData(nodes) {
    for (var i = 0, ii = nodes.length; i < ii; i++) {
      jqLiteRemoveData(nodes[i]);
      jqLiteOff(nodes[i]);
    }
  }
}, function(fn, name) {
  JQLite[name] = fn;
});

forEach({
  data: jqLiteData,
  inheritedData: jqLiteInheritedData,

  scope: function(element) {
    // Can't use jqLiteData here directly so we stay compatible with jQuery!
    return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
  },

  isolateScope: function(element) {
    // Can't use jqLiteData here directly so we stay compatible with jQuery!
    return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
  },

  controller: jqLiteController,

  injector: function(element) {
    return jqLiteInheritedData(element, '$injector');
  },

  removeAttr: function(element, name) {
    element.removeAttribute(name);
  },

  hasClass: jqLiteHasClass,

  css: function(element, name, value) {
    name = cssKebabToCamel(name);

    if (isDefined(value)) {
      element.style[name] = value;
    } else {
      return element.style[name];
    }
  },

  attr: function(element, name, value) {
    var ret;
    var nodeType = element.nodeType;
    if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT ||
      !element.getAttribute) {
      return;
    }

    var lowercasedName = lowercase(name);
    var isBooleanAttr = BOOLEAN_ATTR[lowercasedName];

    if (isDefined(value)) {
      // setter

      if (value === null || (value === false && isBooleanAttr)) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, isBooleanAttr ? lowercasedName : value);
      }
    } else {
      // getter

      ret = element.getAttribute(name);

      if (isBooleanAttr && ret !== null) {
        ret = lowercasedName;
      }
      // Normalize non-existing attributes to undefined (as jQuery).
      return ret === null ? undefined : ret;
    }
  },

  prop: function(element, name, value) {
    if (isDefined(value)) {
      element[name] = value;
    } else {
      return element[name];
    }
  },

  text: (function() {
    getText.$dv = '';
    return getText;

    function getText(element, value) {
      if (isUndefined(value)) {
        var nodeType = element.nodeType;
        return (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT) ? element.textContent : '';
      }
      element.textContent = value;
    }
  })(),

  val: function(element, value) {
    if (isUndefined(value)) {
      if (element.multiple && nodeName_(element) === 'select') {
        var result = [];
        forEach(element.options, function(option) {
          if (option.selected) {
            result.push(option.value || option.text);
          }
        });
        return result;
      }
      return element.value;
    }
    element.value = value;
  },

  html: function(element, value) {
    if (isUndefined(value)) {
      return element.innerHTML;
    }
    jqLiteDealoc(element, true);
    element.innerHTML = value;
  },

  empty: jqLiteEmpty
}, function(fn, name) {
  /**
   * Properties: writes return selection, reads return first value
   */
  JQLite.prototype[name] = function(arg1, arg2) {
    var i, key;
    var nodeCount = this.length;

    // jqLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it
    // in a way that survives minification.
    // jqLiteEmpty takes no arguments but is a setter.
    if (fn !== jqLiteEmpty &&
        (isUndefined((fn.length === 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2))) {
      if (isObject(arg1)) {

        // we are a write, but the object properties are the key/values
        for (i = 0; i < nodeCount; i++) {
          if (fn === jqLiteData) {
            // data() takes the whole object in jQuery
            fn(this[i], arg1);
          } else {
            for (key in arg1) {
              fn(this[i], key, arg1[key]);
            }
          }
        }
        // return self for chaining
        return this;
      } else {
        // we are a read, so read the first child.
        // TODO: do we still need this?
        var value = fn.$dv;
        // Only if we have $dv do we iterate over all, otherwise it is just the first element.
        var jj = (isUndefined(value)) ? Math.min(nodeCount, 1) : nodeCount;
        for (var j = 0; j < jj; j++) {
          var nodeValue = fn(this[j], arg1, arg2);
          value = value ? value + nodeValue : nodeValue;
        }
        return value;
      }
    } else {
      // we are a write, so apply to all children
      for (i = 0; i < nodeCount; i++) {
        fn(this[i], arg1, arg2);
      }
      // return self for chaining
      return this;
    }
  };
});

function createEventHandler(element, events) {
  var eventHandler = function(event, type) {
    // jQuery specific api
    event.isDefaultPrevented = function() {
      return event.defaultPrevented;
    };

    var eventFns = events[type || event.type];
    var eventFnsLength = eventFns ? eventFns.length : 0;

    if (!eventFnsLength) return;

    if (isUndefined(event.immediatePropagationStopped)) {
      var originalStopImmediatePropagation = event.stopImmediatePropagation;
      event.stopImmediatePropagation = function() {
        event.immediatePropagationStopped = true;

        if (event.stopPropagation) {
          event.stopPropagation();
        }

        if (originalStopImmediatePropagation) {
          originalStopImmediatePropagation.call(event);
        }
      };
    }

    event.isImmediatePropagationStopped = function() {
      return event.immediatePropagationStopped === true;
    };

    // Some events have special handlers that wrap the real handler
    var handlerWrapper = eventFns.specialHandlerWrapper || defaultHandlerWrapper;

    // Copy event handlers in case event handlers array is modified during execution.
    if ((eventFnsLength > 1)) {
      eventFns = shallowCopy(eventFns);
    }

    for (var i = 0; i < eventFnsLength; i++) {
      if (!event.isImmediatePropagationStopped()) {
        handlerWrapper(element, event, eventFns[i]);
      }
    }
  };

  // TODO: this is a hack for angularMocks/clearDataCache that makes it possible to deregister all
  //       events on `element`
  eventHandler.elem = element;
  return eventHandler;
}

function defaultHandlerWrapper(element, event, handler) {
  handler.call(element, event);
}

function specialMouseHandlerWrapper(target, event, handler) {
  // Refer to jQuery's implementation of mouseenter & mouseleave
  // Read about mouseenter and mouseleave:
  // http://www.quirksmode.org/js/events_mouse.html#link8
  var related = event.relatedTarget;
  // For mousenter/leave call the handler if related is outside the target.
  // NB: No relatedTarget if the mouse left/entered the browser window
  if (!related || (related !== target && !jqLiteContains.call(target, related))) {
    handler.call(target, event);
  }
}

//////////////////////////////////////////
// Functions iterating traversal.
// These functions chain results into a single
// selector.
//////////////////////////////////////////
forEach({
  removeData: jqLiteRemoveData,

  on: function jqLiteOn(element, type, fn, unsupported) {
    if (isDefined(unsupported)) throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');

    // Do not add event handlers to non-elements because they will not be cleaned up.
    if (!jqLiteAcceptsData(element)) {
      return;
    }

    var expandoStore = jqLiteExpandoStore(element, true);
    var events = expandoStore.events;
    var handle = expandoStore.handle;

    if (!handle) {
      handle = expandoStore.handle = createEventHandler(element, events);
    }

    // http://jsperf.com/string-indexof-vs-split
    var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
    var i = types.length;

    var addHandler = function(type, specialHandlerWrapper, noEventListener) {
      var eventFns = events[type];

      if (!eventFns) {
        eventFns = events[type] = [];
        eventFns.specialHandlerWrapper = specialHandlerWrapper;
        if (type !== '$destroy' && !noEventListener) {
          element.addEventListener(type, handle);
        }
      }

      eventFns.push(fn);
    };

    while (i--) {
      type = types[i];
      if (MOUSE_EVENT_MAP[type]) {
        addHandler(MOUSE_EVENT_MAP[type], specialMouseHandlerWrapper);
        addHandler(type, undefined, true);
      } else {
        addHandler(type);
      }
    }
  },

  off: jqLiteOff,

  one: function(element, type, fn) {
    element = jqLite(element);

    //add the listener twice so that when it is called
    //you can remove the original function and still be
    //able to call element.off(ev, fn) normally
    element.on(type, function onFn() {
      element.off(type, fn);
      element.off(type, onFn);
    });
    element.on(type, fn);
  },

  replaceWith: function(element, replaceNode) {
    var index, parent = element.parentNode;
    jqLiteDealoc(element);
    forEach(new JQLite(replaceNode), function(node) {
      if (index) {
        parent.insertBefore(node, index.nextSibling);
      } else {
        parent.replaceChild(node, element);
      }
      index = node;
    });
  },

  children: function(element) {
    var children = [];
    forEach(element.childNodes, function(element) {
      if (element.nodeType === NODE_TYPE_ELEMENT) {
        children.push(element);
      }
    });
    return children;
  },

  contents: function(element) {
    return element.contentDocument || element.childNodes || [];
  },

  append: function(element, node) {
    var nodeType = element.nodeType;
    if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT) return;

    node = new JQLite(node);

    for (var i = 0, ii = node.length; i < ii; i++) {
      var child = node[i];
      element.appendChild(child);
    }
  },

  prepend: function(element, node) {
    if (element.nodeType === NODE_TYPE_ELEMENT) {
      var index = element.firstChild;
      forEach(new JQLite(node), function(child) {
        element.insertBefore(child, index);
      });
    }
  },

  wrap: function(element, wrapNode) {
    jqLiteWrapNode(element, jqLite(wrapNode).eq(0).clone()[0]);
  },

  remove: jqLiteRemove,

  detach: function(element) {
    jqLiteRemove(element, true);
  },

  after: function(element, newElement) {
    var index = element, parent = element.parentNode;

    if (parent) {
      newElement = new JQLite(newElement);

      for (var i = 0, ii = newElement.length; i < ii; i++) {
        var node = newElement[i];
        parent.insertBefore(node, index.nextSibling);
        index = node;
      }
    }
  },

  addClass: jqLiteAddClass,
  removeClass: jqLiteRemoveClass,

  toggleClass: function(element, selector, condition) {
    if (selector) {
      forEach(selector.split(' '), function(className) {
        var classCondition = condition;
        if (isUndefined(classCondition)) {
          classCondition = !jqLiteHasClass(element, className);
        }
        (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
      });
    }
  },

  parent: function(element) {
    var parent = element.parentNode;
    return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
  },

  next: function(element) {
    return element.nextElementSibling;
  },

  find: function(element, selector) {
    if (element.getElementsByTagName) {
      return element.getElementsByTagName(selector);
    } else {
      return [];
    }
  },

  clone: jqLiteClone,

  triggerHandler: function(element, event, extraParameters) {

    var dummyEvent, eventFnsCopy, handlerArgs;
    var eventName = event.type || event;
    var expandoStore = jqLiteExpandoStore(element);
    var events = expandoStore && expandoStore.events;
    var eventFns = events && events[eventName];

    if (eventFns) {
      // Create a dummy event to pass to the handlers
      dummyEvent = {
        preventDefault: function() { this.defaultPrevented = true; },
        isDefaultPrevented: function() { return this.defaultPrevented === true; },
        stopImmediatePropagation: function() { this.immediatePropagationStopped = true; },
        isImmediatePropagationStopped: function() { return this.immediatePropagationStopped === true; },
        stopPropagation: noop,
        type: eventName,
        target: element
      };

      // If a custom event was provided then extend our dummy event with it
      if (event.type) {
        dummyEvent = extend(dummyEvent, event);
      }

      // Copy event handlers in case event handlers array is modified during execution.
      eventFnsCopy = shallowCopy(eventFns);
      handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];

      forEach(eventFnsCopy, function(fn) {
        if (!dummyEvent.isImmediatePropagationStopped()) {
          fn.apply(element, handlerArgs);
        }
      });
    }
  }
}, function(fn, name) {
  /**
   * chaining functions
   */
  JQLite.prototype[name] = function(arg1, arg2, arg3) {
    var value;

    for (var i = 0, ii = this.length; i < ii; i++) {
      if (isUndefined(value)) {
        value = fn(this[i], arg1, arg2, arg3);
        if (isDefined(value)) {
          // any function which returns a value needs to be wrapped
          value = jqLite(value);
        }
      } else {
        jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
      }
    }
    return isDefined(value) ? value : this;
  };
});

// bind legacy bind/unbind to on/off
JQLite.prototype.bind = JQLite.prototype.on;
JQLite.prototype.unbind = JQLite.prototype.off;


// Provider for private $$jqLite service
/** @this */
function $$jqLiteProvider() {
  this.$get = function $$jqLite() {
    return extend(JQLite, {
      hasClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteHasClass(node, classes);
      },
      addClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteAddClass(node, classes);
      },
      removeClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteRemoveClass(node, classes);
      }
    });
  };
}

/**
 * Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {string} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj, nextUidFn) {
  var key = obj && obj.$$hashKey;

  if (key) {
    if (typeof key === 'function') {
      key = obj.$$hashKey();
    }
    return key;
  }

  var objType = typeof obj;
  if (objType === 'function' || (objType === 'object' && obj !== null)) {
    key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
  } else {
    key = objType + ':' + obj;
  }

  return key;
}

// A minimal ES2015 Map implementation.
// Should be bug/feature equivalent to the native implementations of supported browsers
// (for the features required in Angular).
// See https://kangax.github.io/compat-table/es6/#test-Map
var nanKey = Object.create(null);
function NgMapShim() {
  this._keys = [];
  this._values = [];
  this._lastKey = NaN;
  this._lastIndex = -1;
}
NgMapShim.prototype = {
  _idx: function(key) {
    if (key !== this._lastKey) {
      this._lastKey = key;
      this._lastIndex = this._keys.indexOf(key);
    }
    return this._lastIndex;
  },
  _transformKey: function(key) {
    return isNumberNaN(key) ? nanKey : key;
  },
  get: function(key) {
    key = this._transformKey(key);
    var idx = this._idx(key);
    if (idx !== -1) {
      return this._values[idx];
    }
  },
  has: function(key) {
    key = this._transformKey(key);
    var idx = this._idx(key);
    return idx !== -1;
  },
  set: function(key, value) {
    key = this._transformKey(key);
    var idx = this._idx(key);
    if (idx === -1) {
      idx = this._lastIndex = this._keys.length;
    }
    this._keys[idx] = key;
    this._values[idx] = value;

    // Support: IE11
    // Do not `return this` to simulate the partial IE11 implementation
  },
  delete: function(key) {
    key = this._transformKey(key);
    var idx = this._idx(key);
    if (idx === -1) {
      return false;
    }
    this._keys.splice(idx, 1);
    this._values.splice(idx, 1);
    this._lastKey = NaN;
    this._lastIndex = -1;
    return true;
  }
};

// For now, always use `NgMapShim`, even if `window.Map` is available. Some native implementations
// are still buggy (often in subtle ways) and can cause hard-to-debug failures. When native `Map`
// implementations get more stable, we can reconsider switching to `window.Map` (when available).
var NgMap = NgMapShim;

var $$MapProvider = [/** @this */function() {
  this.$get = [function() {
    return NgMap;
  }];
}];

/**
 * @ngdoc function
 * @module ng
 * @name angular.injector
 * @kind function
 *
 * @description
 * Creates an injector object that can be used for retrieving services as well as for
 * dependency injection (see {@link guide/di dependency injection}).
 *
 * @param {Array.<string|Function>} modules A list of module functions or their aliases. See
 *     {@link angular.module}. The `ng` module must be explicitly added.
 * @param {boolean=} [strictDi=false] Whether the injector should be in strict mode, which
 *     disallows argument name annotation inference.
 * @returns {injector} Injector object. See {@link auto.$injector $injector}.
 *
 * @example
 * Typical usage
 * ```js
 *   // create an injector
 *   var $injector = angular.injector(['ng']);
 *
 *   // use the injector to kick off your application
 *   // use the type inference to auto inject arguments, or use implicit injection
 *   $injector.invoke(function($rootScope, $compile, $document) {
 *     $compile($document)($rootScope);
 *     $rootScope.$digest();
 *   });
 * ```
 *
 * Sometimes you want to get access to the injector of a currently running AngularJS app
 * from outside AngularJS. Perhaps, you want to inject and compile some markup after the
 * application has been bootstrapped. You can do this using the extra `injector()` added
 * to JQuery/jqLite elements. See {@link angular.element}.
 *
 * *This is fairly rare but could be the case if a third party library is injecting the
 * markup.*
 *
 * In the following example a new block of HTML containing a `ng-controller`
 * directive is added to the end of the document body by JQuery. We then compile and link
 * it into the current AngularJS scope.
 *
 * ```js
 * var $div = $('<div ng-controller="MyCtrl">{{content.label}}</div>');
 * $(document.body).append($div);
 *
 * angular.element(document).injector().invoke(function($compile) {
 *   var scope = angular.element($div).scope();
 *   $compile($div)(scope);
 * });
 * ```
 */


/**
 * @ngdoc module
 * @name auto
 * @installation
 * @description
 *
 * Implicit module which gets automatically added to each {@link auto.$injector $injector}.
 */

var ARROW_ARG = /^([^(]+?)=>/;
var FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var $injectorMinErr = minErr('$injector');

function stringifyFn(fn) {
  return Function.prototype.toString.call(fn);
}

function extractArgs(fn) {
  var fnText = stringifyFn(fn).replace(STRIP_COMMENTS, ''),
      args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
  return args;
}

function anonFn(fn) {
  // For anonymous functions, showing at the very least the function signature can help in
  // debugging.
  var args = extractArgs(fn);
  if (args) {
    return 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
  }
  return 'fn';
}

function annotate(fn, strictDi, name) {
  var $inject,
      argDecl,
      last;

  if (typeof fn === 'function') {
    if (!($inject = fn.$inject)) {
      $inject = [];
      if (fn.length) {
        if (strictDi) {
          if (!isString(name) || !name) {
            name = fn.name || anonFn(fn);
          }
          throw $injectorMinErr('strictdi',
            '{0} is not using explicit annotation and cannot be invoked in strict mode', name);
        }
        argDecl = extractArgs(fn);
        forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
          arg.replace(FN_ARG, function(all, underscore, name) {
            $inject.push(name);
          });
        });
      }
      fn.$inject = $inject;
    }
  } else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn');
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
}

///////////////////////////////////////

/**
 * @ngdoc service
 * @name $injector
 *
 * @description
 *
 * `$injector` is used to retrieve object instances as defined by
 * {@link auto.$provide provider}, instantiate types, invoke methods,
 * and load modules.
 *
 * The following always holds true:
 *
 * ```js
 *   var $injector = angular.injector();
 *   expect($injector.get('$injector')).toBe($injector);
 *   expect($injector.invoke(function($injector) {
 *     return $injector;
 *   })).toBe($injector);
 * ```
 *
 * ## Injection Function Annotation
 *
 * JavaScript does not have annotations, and annotations are needed for dependency injection. The
 * following are all valid ways of annotating function with injection arguments and are equivalent.
 *
 * ```js
 *   // inferred (only works if code not minified/obfuscated)
 *   $injector.invoke(function(serviceA){});
 *
 *   // annotated
 *   function explicit(serviceA) {};
 *   explicit.$inject = ['serviceA'];
 *   $injector.invoke(explicit);
 *
 *   // inline
 *   $injector.invoke(['serviceA', function(serviceA){}]);
 * ```
 *
 * ### Inference
 *
 * In JavaScript calling `toString()` on a function returns the function definition. The definition
 * can then be parsed and the function arguments can be extracted. This method of discovering
 * annotations is disallowed when the injector is in strict mode.
 * *NOTE:* This does not work with minification, and obfuscation tools since these tools change the
 * argument names.
 *
 * ### `$inject` Annotation
 * By adding an `$inject` property onto a function the injection parameters can be specified.
 *
 * ### Inline
 * As an array of injection names, where the last item in the array is the function to call.
 */

/**
 * @ngdoc property
 * @name $injector#modules
 * @type {Object}
 * @description
 * A hash containing all the modules that have been loaded into the
 * $injector.
 *
 * You can use this property to find out information about a module via the
 * {@link angular.Module#info `myModule.info(...)`} method.
 *
 * For example:
 *
 * ```
 * var info = $injector.modules['ngAnimate'].info();
 * ```
 *
 * **Do not use this property to attempt to modify the modules after the application
 * has been bootstrapped.**
 */


/**
 * @ngdoc method
 * @name $injector#get
 *
 * @description
 * Return an instance of the service.
 *
 * @param {string} name The name of the instance to retrieve.
 * @param {string=} caller An optional string to provide the origin of the function call for error messages.
 * @return {*} The instance.
 */

/**
 * @ngdoc method
 * @name $injector#invoke
 *
 * @description
 * Invoke the method and supply the method arguments from the `$injector`.
 *
 * @param {Function|Array.<string|Function>} fn The injectable function to invoke. Function parameters are
 *   injected according to the {@link guide/di $inject Annotation} rules.
 * @param {Object=} self The `this` for the invoked method.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this
 *                         object first, before the `$injector` is consulted.
 * @returns {*} the value returned by the invoked `fn` function.
 */

/**
 * @ngdoc method
 * @name $injector#has
 *
 * @description
 * Allows the user to query if the particular service exists.
 *
 * @param {string} name Name of the service to query.
 * @returns {boolean} `true` if injector has given service.
 */

/**
 * @ngdoc method
 * @name $injector#instantiate
 * @description
 * Create a new instance of JS type. The method takes a constructor function, invokes the new
 * operator, and supplies all of the arguments to the constructor function as specified by the
 * constructor annotation.
 *
 * @param {Function} Type Annotated constructor function.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this
 * object first, before the `$injector` is consulted.
 * @returns {Object} new instance of `Type`.
 */

/**
 * @ngdoc method
 * @name $injector#annotate
 *
 * @description
 * Returns an array of service names which the function is requesting for injection. This API is
 * used by the injector to determine which services need to be injected into the function when the
 * function is invoked. There are three ways in which the function can be annotated with the needed
 * dependencies.
 *
 * #### Argument names
 *
 * The simplest form is to extract the dependencies from the arguments of the function. This is done
 * by converting the function into a string using `toString()` method and extracting the argument
 * names.
 * ```js
 *   // Given
 *   function MyController($scope, $route) {
 *     // ...
 *   }
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * ```
 *
 * You can disallow this method by using strict injection mode.
 *
 * This method does not work with code minification / obfuscation. For this reason the following
 * annotation strategies are supported.
 *
 * #### The `$inject` property
 *
 * If a function has an `$inject` property and its value is an array of strings, then the strings
 * represent names of services to be injected into the function.
 * ```js
 *   // Given
 *   var MyController = function(obfuscatedScope, obfuscatedRoute) {
 *     // ...
 *   }
 *   // Define function dependencies
 *   MyController['$inject'] = ['$scope', '$route'];
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * ```
 *
 * #### The array notation
 *
 * It is often desirable to inline Injected functions and that's when setting the `$inject` property
 * is very inconvenient. In these situations using the array notation to specify the dependencies in
 * a way that survives minification is a better choice:
 *
 * ```js
 *   // We wish to write this (not minification / obfuscation safe)
 *   injector.invoke(function($compile, $rootScope) {
 *     // ...
 *   });
 *
 *   // We are forced to write break inlining
 *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {
 *     // ...
 *   };
 *   tmpFn.$inject = ['$compile', '$rootScope'];
 *   injector.invoke(tmpFn);
 *
 *   // To better support inline function the inline annotation is supported
 *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {
 *     // ...
 *   }]);
 *
 *   // Therefore
 *   expect(injector.annotate(
 *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])
 *    ).toEqual(['$compile', '$rootScope']);
 * ```
 *
 * @param {Function|Array.<string|Function>} fn Function for which dependent service names need to
 * be retrieved as described above.
 *
 * @param {boolean=} [strictDi=false] Disallow argument name annotation inference.
 *
 * @returns {Array.<string>} The names of the services which the function requires.
 */
/**
 * @ngdoc method
 * @name $injector#loadNewModules
 *
 * @description
 *
 * **This is a dangerous API, which you use at your own risk!**
 *
 * Add the specified modules to the current injector.
 *
 * This method will add each of the injectables to the injector and execute all of the config and run
 * blocks for each module passed to the method.
 *
 * If a module has already been loaded into the injector then it will not be loaded again.
 *
 * * The application developer is responsible for loading the code containing the modules; and for
 * ensuring that lazy scripts are not downloaded and executed more often that desired.
 * * Previously compiled HTML will not be affected by newly loaded directives, filters and components.
 * * Modules cannot be unloaded.
 *
 * You can use {@link $injector#modules `$injector.modules`} to check whether a module has been loaded
 * into the injector, which may indicate whether the script has been executed already.
 *
 * @example
 * Here is an example of loading a bundle of modules, with a utility method called `getScript`:
 *
 * ```javascript
 * app.factory('loadModule', function($injector) {
 *   return function loadModule(moduleName, bundleUrl) {
 *     return getScript(bundleUrl).then(function() { $injector.loadNewModules([moduleName]); });
 *   };
 * })
 * ```
 *
 * @param {Array<String|Function|Array>=} mods an array of modules to load into the application.
 *     Each item in the array should be the name of a predefined module or a (DI annotated)
 *     function that will be invoked by the injector as a `config` block.
 *     See: {@link angular.module modules}
 */


/**
 * @ngdoc service
 * @name $provide
 *
 * @description
 *
 * The {@link auto.$provide $provide} service has a number of methods for registering components
 * with the {@link auto.$injector $injector}. Many of these functions are also exposed on
 * {@link angular.Module}.
 *
 * An AngularJS **service** is a singleton object created by a **service factory**.  These **service
 * factories** are functions which, in turn, are created by a **service provider**.
 * The **service providers** are constructor functions. When instantiated they must contain a
 * property called `$get`, which holds the **service factory** function.
 *
 * When you request a service, the {@link auto.$injector $injector} is responsible for finding the
 * correct **service provider**, instantiating it and then calling its `$get` **service factory**
 * function to get the instance of the **service**.
 *
 * Often services have no configuration options and there is no need to add methods to the service
 * provider.  The provider will be no more than a constructor function with a `$get` property. For
 * these cases the {@link auto.$provide $provide} service has additional helper methods to register
 * services without specifying a provider.
 *
 * * {@link auto.$provide#provider provider(name, provider)} - registers a **service provider** with the
 *     {@link auto.$injector $injector}
 * * {@link auto.$provide#constant constant(name, obj)} - registers a value/object that can be accessed by
 *     providers and services.
 * * {@link auto.$provide#value value(name, obj)} - registers a value/object that can only be accessed by
 *     services, not providers.
 * * {@link auto.$provide#factory factory(name, fn)} - registers a service **factory function**
 *     that will be wrapped in a **service provider** object, whose `$get` property will contain the
 *     given factory function.
 * * {@link auto.$provide#service service(name, Fn)} - registers a **constructor function**
 *     that will be wrapped in a **service provider** object, whose `$get` property will instantiate
 *      a new object using the given constructor function.
 * * {@link auto.$provide#decorator decorator(name, decorFn)} - registers a **decorator function** that
 *      will be able to modify or replace the implementation of another service.
 *
 * See the individual methods for more information and examples.
 */

/**
 * @ngdoc method
 * @name $provide#provider
 * @description
 *
 * Register a **provider function** with the {@link auto.$injector $injector}. Provider functions
 * are constructor functions, whose instances are responsible for "providing" a factory for a
 * service.
 *
 * Service provider names start with the name of the service they provide followed by `Provider`.
 * For example, the {@link ng.$log $log} service has a provider called
 * {@link ng.$logProvider $logProvider}.
 *
 * Service provider objects can have additional methods which allow configuration of the provider
 * and its service. Importantly, you can configure what kind of service is created by the `$get`
 * method, or how that service will act. For example, the {@link ng.$logProvider $logProvider} has a
 * method {@link ng.$logProvider#debugEnabled debugEnabled}
 * which lets you specify whether the {@link ng.$log $log} service will log debug messages to the
 * console or not.
 *
 * It is possible to inject other providers into the provider function,
 * but the injected provider must have been defined before the one that requires it.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name +
                        'Provider'` key.
 * @param {(Object|function())} provider If the provider is:
 *
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
 *     {@link auto.$injector#invoke $injector.invoke()} when an instance needs to be created.
 *   - `Constructor`: a new instance of the provider will be created using
 *     {@link auto.$injector#instantiate $injector.instantiate()}, then treated as `object`.
 *
 * @returns {Object} registered provider instance

 * @example
 *
 * The following example shows how to create a simple event tracking service and register it using
 * {@link auto.$provide#provider $provide.provider()}.
 *
 * ```js
 *  // Define the eventTracker provider
 *  function EventTrackerProvider() {
 *    var trackingUrl = '/track';
 *
 *    // A provider method for configuring where the tracked events should been saved
 *    this.setTrackingUrl = function(url) {
 *      trackingUrl = url;
 *    };
 *
 *    // The service factory function
 *    this.$get = ['$http', function($http) {
 *      var trackedEvents = {};
 *      return {
 *        // Call this to track an event
 *        event: function(event) {
 *          var count = trackedEvents[event] || 0;
 *          count += 1;
 *          trackedEvents[event] = count;
 *          return count;
 *        },
 *        // Call this to save the tracked events to the trackingUrl
 *        save: function() {
 *          $http.post(trackingUrl, trackedEvents);
 *        }
 *      };
 *    }];
 *  }
 *
 *  describe('eventTracker', function() {
 *    var postSpy;
 *
 *    beforeEach(module(function($provide) {
 *      // Register the eventTracker provider
 *      $provide.provider('eventTracker', EventTrackerProvider);
 *    }));
 *
 *    beforeEach(module(function(eventTrackerProvider) {
 *      // Configure eventTracker provider
 *      eventTrackerProvider.setTrackingUrl('/custom-track');
 *    }));
 *
 *    it('tracks events', inject(function(eventTracker) {
 *      expect(eventTracker.event('login')).toEqual(1);
 *      expect(eventTracker.event('login')).toEqual(2);
 *    }));
 *
 *    it('saves to the tracking url', inject(function(eventTracker, $http) {
 *      postSpy = spyOn($http, 'post');
 *      eventTracker.event('login');
 *      eventTracker.save();
 *      expect(postSpy).toHaveBeenCalled();
 *      expect(postSpy.mostRecentCall.args[0]).not.toEqual('/track');
 *      expect(postSpy.mostRecentCall.args[0]).toEqual('/custom-track');
 *      expect(postSpy.mostRecentCall.args[1]).toEqual({ 'login': 1 });
 *    }));
 *  });
 * ```
 */

/**
 * @ngdoc method
 * @name $provide#factory
 * @description
 *
 * Register a **service factory**, which will be called to return the service instance.
 * This is short for registering a service where its provider consists of only a `$get` property,
 * which is the given service factory function.
 * You should use {@link auto.$provide#factory $provide.factory(getFn)} if you do not need to
 * configure your service in a provider.
 *
 * @param {string} name The name of the instance.
 * @param {Function|Array.<string|Function>} $getFn The injectable $getFn for the instance creation.
 *                      Internally this is a short hand for `$provide.provider(name, {$get: $getFn})`.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here is an example of registering a service
 * ```js
 *   $provide.factory('ping', ['$http', function($http) {
 *     return function ping() {
 *       return $http.send('/ping');
 *     };
 *   }]);
 * ```
 * You would then inject and use this service like this:
 * ```js
 *   someModule.controller('Ctrl', ['ping', function(ping) {
 *     ping();
 *   }]);
 * ```
 */


/**
 * @ngdoc method
 * @name $provide#service
 * @description
 *
 * Register a **service constructor**, which will be invoked with `new` to create the service
 * instance.
 * This is short for registering a service where its provider's `$get` property is a factory
 * function that returns an instance instantiated by the injector from the service constructor
 * function.
 *
 * Internally it looks a bit like this:
 *
 * ```
 * {
 *   $get: function() {
 *     return $injector.instantiate(constructor);
 *   }
 * }
 * ```
 *
 *
 * You should use {@link auto.$provide#service $provide.service(class)} if you define your service
 * as a type/class.
 *
 * @param {string} name The name of the instance.
 * @param {Function|Array.<string|Function>} constructor An injectable class (constructor function)
 *     that will be instantiated.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here is an example of registering a service using
 * {@link auto.$provide#service $provide.service(class)}.
 * ```js
 *   var Ping = function($http) {
 *     this.$http = $http;
 *   };
 *
 *   Ping.$inject = ['$http'];
 *
 *   Ping.prototype.send = function() {
 *     return this.$http.get('/ping');
 *   };
 *   $provide.service('ping', Ping);
 * ```
 * You would then inject and use this service like this:
 * ```js
 *   someModule.controller('Ctrl', ['ping', function(ping) {
 *     ping.send();
 *   }]);
 * ```
 */


/**
 * @ngdoc method
 * @name $provide#value
 * @description
 *
 * Register a **value service** with the {@link auto.$injector $injector}, such as a string, a
 * number, an array, an object or a function. This is short for registering a service where its
 * provider's `$get` property is a factory function that takes no arguments and returns the **value
 * service**. That also means it is not possible to inject other services into a value service.
 *
 * Value services are similar to constant services, except that they cannot be injected into a
 * module configuration function (see {@link angular.Module#config}) but they can be overridden by
 * an AngularJS {@link auto.$provide#decorator decorator}.
 *
 * @param {string} name The name of the instance.
 * @param {*} value The value.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here are some examples of creating value services.
 * ```js
 *   $provide.value('ADMIN_USER', 'admin');
 *
 *   $provide.value('RoleLookup', { admin: 0, writer: 1, reader: 2 });
 *
 *   $provide.value('halfOf', function(value) {
 *     return value / 2;
 *   });
 * ```
 */


/**
 * @ngdoc method
 * @name $provide#constant
 * @description
 *
 * Register a **constant service** with the {@link auto.$injector $injector}, such as a string,
 * a number, an array, an object or a function. Like the {@link auto.$provide#value value}, it is not
 * possible to inject other services into a constant.
 *
 * But unlike {@link auto.$provide#value value}, a constant can be
 * injected into a module configuration function (see {@link angular.Module#config}) and it cannot
 * be overridden by an AngularJS {@link auto.$provide#decorator decorator}.
 *
 * @param {string} name The name of the constant.
 * @param {*} value The constant value.
 * @returns {Object} registered instance
 *
 * @example
 * Here a some examples of creating constants:
 * ```js
 *   $provide.constant('SHARD_HEIGHT', 306);
 *
 *   $provide.constant('MY_COLOURS', ['red', 'blue', 'grey']);
 *
 *   $provide.constant('double', function(value) {
 *     return value * 2;
 *   });
 * ```
 */


/**
 * @ngdoc method
 * @name $provide#decorator
 * @description
 *
 * Register a **decorator function** with the {@link auto.$injector $injector}. A decorator function
 * intercepts the creation of a service, allowing it to override or modify the behavior of the
 * service. The return value of the decorator function may be the original service, or a new service
 * that replaces (or wraps and delegates to) the original service.
 *
 * You can find out more about using decorators in the {@link guide/decorators} guide.
 *
 * @param {string} name The name of the service to decorate.
 * @param {Function|Array.<string|Function>} decorator This function will be invoked when the service needs to be
 *    provided and should return the decorated service instance. The function is called using
 *    the {@link auto.$injector#invoke injector.invoke} method and is therefore fully injectable.
 *    Local injection arguments:
 *
 *    * `$delegate` - The original service instance, which can be replaced, monkey patched, configured,
 *      decorated or delegated to.
 *
 * @example
 * Here we decorate the {@link ng.$log $log} service to convert warnings to errors by intercepting
 * calls to {@link ng.$log#error $log.warn()}.
 * ```js
 *   $provide.decorator('$log', ['$delegate', function($delegate) {
 *     $delegate.warn = $delegate.error;
 *     return $delegate;
 *   }]);
 * ```
 */


function createInjector(modulesToLoad, strictDi) {
  strictDi = (strictDi === true);
  var INSTANTIATING = {},
      providerSuffix = 'Provider',
      path = [],
      loadedModules = new NgMap(),
      providerCache = {
        $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
      },
      providerInjector = (providerCache.$injector =
          createInternalInjector(providerCache, function(serviceName, caller) {
            if (angular.isString(caller)) {
              path.push(caller);
            }
            throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
          })),
      instanceCache = {},
      protoInstanceInjector =
          createInternalInjector(instanceCache, function(serviceName, caller) {
            var provider = providerInjector.get(serviceName + providerSuffix, caller);
            return instanceInjector.invoke(
                provider.$get, provider, undefined, serviceName);
          }),
      instanceInjector = protoInstanceInjector;

  providerCache['$injector' + providerSuffix] = { $get: valueFn(protoInstanceInjector) };
  instanceInjector.modules = providerInjector.modules = createMap();
  var runBlocks = loadModules(modulesToLoad);
  instanceInjector = protoInstanceInjector.get('$injector');
  instanceInjector.strictDi = strictDi;
  forEach(runBlocks, function(fn) { if (fn) instanceInjector.invoke(fn); });

  instanceInjector.loadNewModules = function(mods) {
    forEach(loadModules(mods), function(fn) { if (fn) instanceInjector.invoke(fn); });
  };


  return instanceInjector;

  ////////////////////////////////////
  // $provider
  ////////////////////////////////////

  function supportObject(delegate) {
    return function(key, value) {
      if (isObject(key)) {
        forEach(key, reverseParams(delegate));
      } else {
        return delegate(key, value);
      }
    };
  }

  function provider(name, provider_) {
    assertNotHasOwnProperty(name, 'service');
    if (isFunction(provider_) || isArray(provider_)) {
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
    }
    return (providerCache[name + providerSuffix] = provider_);
  }

  function enforceReturnValue(name, factory) {
    return /** @this */ function enforcedReturnValue() {
      var result = instanceInjector.invoke(factory, this);
      if (isUndefined(result)) {
        throw $injectorMinErr('undef', 'Provider \'{0}\' must return a value from $get factory method.', name);
      }
      return result;
    };
  }

  function factory(name, factoryFn, enforce) {
    return provider(name, {
      $get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn
    });
  }

  function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
  }

  function value(name, val) { return factory(name, valueFn(val), false); }

  function constant(name, value) {
    assertNotHasOwnProperty(name, 'constant');
    providerCache[name] = value;
    instanceCache[name] = value;
  }

  function decorator(serviceName, decorFn) {
    var origProvider = providerInjector.get(serviceName + providerSuffix),
        orig$get = origProvider.$get;

    origProvider.$get = function() {
      var origInstance = instanceInjector.invoke(orig$get, origProvider);
      return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
    };
  }

  ////////////////////////////////////
  // Module Loading
  ////////////////////////////////////
  function loadModules(modulesToLoad) {
    assertArg(isUndefined(modulesToLoad) || isArray(modulesToLoad), 'modulesToLoad', 'not an array');
    var runBlocks = [], moduleFn;
    forEach(modulesToLoad, function(module) {
      if (loadedModules.get(module)) return;
      loadedModules.set(module, true);

      function runInvokeQueue(queue) {
        var i, ii;
        for (i = 0, ii = queue.length; i < ii; i++) {
          var invokeArgs = queue[i],
              provider = providerInjector.get(invokeArgs[0]);

          provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
        }
      }

      try {
        if (isString(module)) {
          moduleFn = angularModule(module);
          instanceInjector.modules[module] = moduleFn;
          runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
          runInvokeQueue(moduleFn._invokeQueue);
          runInvokeQueue(moduleFn._configBlocks);
        } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else {
          assertArgFn(module, 'module');
        }
      } catch (e) {
        if (isArray(module)) {
          module = module[module.length - 1];
        }
        if (e.message && e.stack && e.stack.indexOf(e.message) === -1) {
          // Safari & FF's stack traces don't contain error.message content
          // unlike those of Chrome and IE
          // So if stack doesn't contain message, we create a new string that contains both.
          // Since error.stack is read-only in Safari, I'm overriding e and not e.stack here.
          // eslint-disable-next-line no-ex-assign
          e = e.message + '\n' + e.stack;
        }
        throw $injectorMinErr('modulerr', 'Failed to instantiate module {0} due to:\n{1}',
                  module, e.stack || e.message || e);
      }
    });
    return runBlocks;
  }

  ////////////////////////////////////
  // internal Injector
  ////////////////////////////////////

  function createInternalInjector(cache, factory) {

    function getService(serviceName, caller) {
      if (cache.hasOwnProperty(serviceName)) {
        if (cache[serviceName] === INSTANTIATING) {
          throw $injectorMinErr('cdep', 'Circular dependency found: {0}',
                    serviceName + ' <- ' + path.join(' <- '));
        }
        return cache[serviceName];
      } else {
        try {
          path.unshift(serviceName);
          cache[serviceName] = INSTANTIATING;
          cache[serviceName] = factory(serviceName, caller);
          return cache[serviceName];
        } catch (err) {
          if (cache[serviceName] === INSTANTIATING) {
            delete cache[serviceName];
          }
          throw err;
        } finally {
          path.shift();
        }
      }
    }


    function injectionArgs(fn, locals, serviceName) {
      var args = [],
          $inject = createInjector.$$annotate(fn, strictDi, serviceName);

      for (var i = 0, length = $inject.length; i < length; i++) {
        var key = $inject[i];
        if (typeof key !== 'string') {
          throw $injectorMinErr('itkn',
                  'Incorrect injection token! Expected service name as string, got {0}', key);
        }
        args.push(locals && locals.hasOwnProperty(key) ? locals[key] :
                                                         getService(key, serviceName));
      }
      return args;
    }

    function isClass(func) {
      // Support: IE 9-11 only
      // IE 9-11 do not support classes and IE9 leaks with the code below.
      if (msie || typeof func !== 'function') {
        return false;
      }
      var result = func.$$ngIsClass;
      if (!isBoolean(result)) {
        result = func.$$ngIsClass = /^class\b/.test(stringifyFn(func));
      }
      return result;
    }

    function invoke(fn, self, locals, serviceName) {
      if (typeof locals === 'string') {
        serviceName = locals;
        locals = null;
      }

      var args = injectionArgs(fn, locals, serviceName);
      if (isArray(fn)) {
        fn = fn[fn.length - 1];
      }

      if (!isClass(fn)) {
        // http://jsperf.com/angularjs-invoke-apply-vs-switch
        // #5388
        return fn.apply(self, args);
      } else {
        args.unshift(null);
        return new (Function.prototype.bind.apply(fn, args))();
      }
    }


    function instantiate(Type, locals, serviceName) {
      // Check if Type is annotated and use just the given function at n-1 as parameter
      // e.g. someModule.factory('greeter', ['$window', function(renamed$window) {}]);
      var ctor = (isArray(Type) ? Type[Type.length - 1] : Type);
      var args = injectionArgs(Type, locals, serviceName);
      // Empty object at position 0 is ignored for invocation with `new`, but required.
      args.unshift(null);
      return new (Function.prototype.bind.apply(ctor, args))();
    }


    return {
      invoke: invoke,
      instantiate: instantiate,
      get: getService,
      annotate: createInjector.$$annotate,
      has: function(name) {
        return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
      }
    };
  }
}

createInjector.$$annotate = annotate;

/**
 * @ngdoc provider
 * @name $anchorScrollProvider
 * @this
 *
 * @description
 * Use `$anchorScrollProvider` to disable automatic scrolling whenever
 * {@link ng.$location#hash $location.hash()} changes.
 */
function $AnchorScrollProvider() {

  var autoScrollingEnabled = true;

  /**
   * @ngdoc method
   * @name $anchorScrollProvider#disableAutoScrolling
   *
   * @description
   * By default, {@link ng.$anchorScroll $anchorScroll()} will automatically detect changes to
   * {@link ng.$location#hash $location.hash()} and scroll to the element matching the new hash.<br />
   * Use this method to disable automatic scrolling.
   *
   * If automatic scrolling is disabled, one must explicitly call
   * {@link ng.$anchorScroll $anchorScroll()} in order to scroll to the element related to the
   * current hash.
   */
  this.disableAutoScrolling = function() {
    autoScrollingEnabled = false;
  };

  /**
   * @ngdoc service
   * @name $anchorScroll
   * @kind function
   * @requires $window
   * @requires $location
   * @requires $rootScope
   *
   * @description
   * When called, it scrolls to the element related to the specified `hash` or (if omitted) to the
   * current value of {@link ng.$location#hash $location.hash()}, according to the rules specified
   * in the
   * [HTML5 spec](http://www.w3.org/html/wg/drafts/html/master/browsers.html#an-indicated-part-of-the-document).
   *
   * It also watches the {@link ng.$location#hash $location.hash()} and automatically scrolls to
   * match any anchor whenever it changes. This can be disabled by calling
   * {@link ng.$anchorScrollProvider#disableAutoScrolling $anchorScrollProvider.disableAutoScrolling()}.
   *
   * Additionally, you can use its {@link ng.$anchorScroll#yOffset yOffset} property to specify a
   * vertical scroll-offset (either fixed or dynamic).
   *
   * @param {string=} hash The hash specifying the element to scroll to. If omitted, the value of
   *                       {@link ng.$location#hash $location.hash()} will be used.
   *
   * @property {(number|function|jqLite)} yOffset
   * If set, specifies a vertical scroll-offset. This is often useful when there are fixed
   * positioned elements at the top of the page, such as navbars, headers etc.
   *
   * `yOffset` can be specified in various ways:
   * - **number**: A fixed number of pixels to be used as offset.<br /><br />
   * - **function**: A getter function called everytime `$anchorScroll()` is executed. Must return
   *   a number representing the offset (in pixels).<br /><br />
   * - **jqLite**: A jqLite/jQuery element to be used for specifying the offset. The distance from
   *   the top of the page to the element's bottom will be used as offset.<br />
   *   **Note**: The element will be taken into account only as long as its `position` is set to
   *   `fixed`. This option is useful, when dealing with responsive navbars/headers that adjust
   *   their height and/or positioning according to the viewport's size.
   *
   * <br />
   * <div class="alert alert-warning">
   * In order for `yOffset` to work properly, scrolling should take place on the document's root and
   * not some child element.
   * </div>
   *
   * @example
     <example module="anchorScrollExample" name="anchor-scroll">
       <file name="index.html">
         <div id="scrollArea" ng-controller="ScrollController">
           <a ng-click="gotoBottom()">Go to bottom</a>
           <a id="bottom"></a> You're at the bottom!
         </div>
       </file>
       <file name="script.js">
         angular.module('anchorScrollExample', [])
           .controller('ScrollController', ['$scope', '$location', '$anchorScroll',
             function($scope, $location, $anchorScroll) {
               $scope.gotoBottom = function() {
                 // set the location.hash to the id of
                 // the element you wish to scroll to.
                 $location.hash('bottom');

                 // call $anchorScroll()
                 $anchorScroll();
               };
             }]);
       </file>
       <file name="style.css">
         #scrollArea {
           height: 280px;
           overflow: auto;
         }

         #bottom {
           display: block;
           margin-top: 2000px;
         }
       </file>
     </example>
   *
   * <hr />
   * The example below illustrates the use of a vertical scroll-offset (specified as a fixed value).
   * See {@link ng.$anchorScroll#yOffset $anchorScroll.yOffset} for more details.
   *
   * @example
     <example module="anchorScrollOffsetExample" name="anchor-scroll-offset">
       <file name="index.html">
         <div class="fixed-header" ng-controller="headerCtrl">
           <a href="" ng-click="gotoAnchor(x)" ng-repeat="x in [1,2,3,4,5]">
             Go to anchor {{x}}
           </a>
         </div>
         <div id="anchor{{x}}" class="anchor" ng-repeat="x in [1,2,3,4,5]">
           Anchor {{x}} of 5
         </div>
       </file>
       <file name="script.js">
         angular.module('anchorScrollOffsetExample', [])
           .run(['$anchorScroll', function($anchorScroll) {
             $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
           }])
           .controller('headerCtrl', ['$anchorScroll', '$location', '$scope',
             function($anchorScroll, $location, $scope) {
               $scope.gotoAnchor = function(x) {
                 var newHash = 'anchor' + x;
                 if ($location.hash() !== newHash) {
                   // set the $location.hash to `newHash` and
                   // $anchorScroll will automatically scroll to it
                   $location.hash('anchor' + x);
                 } else {
                   // call $anchorScroll() explicitly,
                   // since $location.hash hasn't changed
                   $anchorScroll();
                 }
               };
             }
           ]);
       </file>
       <file name="style.css">
         body {
           padding-top: 50px;
         }

         .anchor {
           border: 2px dashed DarkOrchid;
           padding: 10px 10px 200px 10px;
         }

         .fixed-header {
           background-color: rgba(0, 0, 0, 0.2);
           height: 50px;
           position: fixed;
           top: 0; left: 0; right: 0;
         }

         .fixed-header > a {
           display: inline-block;
           margin: 5px 15px;
         }
       </file>
     </example>
   */
  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    var document = $window.document;

    // Helper function to get first anchor from a NodeList
    // (using `Array#some()` instead of `angular#forEach()` since it's more performant
    //  and working in all supported browsers.)
    function getFirstAnchor(list) {
      var result = null;
      Array.prototype.some.call(list, function(element) {
        if (nodeName_(element) === 'a') {
          result = element;
          return true;
        }
      });
      return result;
    }

    function getYOffset() {

      var offset = scroll.yOffset;

      if (isFunction(offset)) {
        offset = offset();
      } else if (isElement(offset)) {
        var elem = offset[0];
        var style = $window.getComputedStyle(elem);
        if (style.position !== 'fixed') {
          offset = 0;
        } else {
          offset = elem.getBoundingClientRect().bottom;
        }
      } else if (!isNumber(offset)) {
        offset = 0;
      }

      return offset;
    }

    function scrollTo(elem) {
      if (elem) {
        elem.scrollIntoView();

        var offset = getYOffset();

        if (offset) {
          // `offset` is the number of pixels we should scroll UP in order to align `elem` properly.
          // This is true ONLY if the call to `elem.scrollIntoView()` initially aligns `elem` at the
          // top of the viewport.
          //
          // IF the number of pixels from the top of `elem` to the end of the page's content is less
          // than the height of the viewport, then `elem.scrollIntoView()` will align the `elem` some
          // way down the page.
          //
          // This is often the case for elements near the bottom of the page.
          //
          // In such cases we do not need to scroll the whole `offset` up, just the difference between
          // the top of the element and the offset, which is enough to align the top of `elem` at the
          // desired position.
          var elemTop = elem.getBoundingClientRect().top;
          $window.scrollBy(0, elemTop - offset);
        }
      } else {
        $window.scrollTo(0, 0);
      }
    }

    function scroll(hash) {
      // Allow numeric hashes
      hash = isString(hash) ? hash : isNumber(hash) ? hash.toString() : $location.hash();
      var elm;

      // empty hash, scroll to the top of the page
      if (!hash) scrollTo(null);

      // element with given id
      else if ((elm = document.getElementById(hash))) scrollTo(elm);

      // first anchor with given name :-D
      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) scrollTo(elm);

      // no element and hash === 'top', scroll to the top of the page
      else if (hash === 'top') scrollTo(null);
    }

    // does not scroll when user clicks on anchor link that is currently on
    // (no url change, no $location.hash() change), browser native does scroll
    if (autoScrollingEnabled) {
      $rootScope.$watch(function autoScrollWatch() {return $location.hash();},
        function autoScrollWatchAction(newVal, oldVal) {
          // skip the initial scroll if $location.hash is empty
          if (newVal === oldVal && newVal === '') return;

          jqLiteDocumentLoaded(function() {
            $rootScope.$evalAsync(scroll);
          });
        });
    }

    return scroll;
  }];
}

var $animateMinErr = minErr('$animate');
var ELEMENT_NODE = 1;
var NG_ANIMATE_CLASSNAME = 'ng-animate';

function mergeClasses(a,b) {
  if (!a && !b) return '';
  if (!a) return b;
  if (!b) return a;
  if (isArray(a)) a = a.join(' ');
  if (isArray(b)) b = b.join(' ');
  return a + ' ' + b;
}

function extractElementNode(element) {
  for (var i = 0; i < element.length; i++) {
    var elm = element[i];
    if (elm.nodeType === ELEMENT_NODE) {
      return elm;
    }
  }
}

function splitClasses(classes) {
  if (isString(classes)) {
    classes = classes.split(' ');
  }

  // Use createMap() to prevent class assumptions involving property names in
  // Object.prototype
  var obj = createMap();
  forEach(classes, function(klass) {
    // sometimes the split leaves empty string values
    // incase extra spaces were applied to the options
    if (klass.length) {
      obj[klass] = true;
    }
  });
  return obj;
}

// if any other type of options value besides an Object value is
// passed into the $animate.method() animation then this helper code
// will be run which will ignore it. While this patch is not the
// greatest solution to this, a lot of existing plugins depend on
// $animate to either call the callback (< 1.2) or return a promise
// that can be changed. This helper function ensures that the options
// are wiped clean incase a callback function is provided.
function prepareAnimateOptions(options) {
  return isObject(options)
      ? options
      : {};
}

var $$CoreAnimateJsProvider = /** @this */ function() {
  this.$get = noop;
};

// this is prefixed with Core since it conflicts with
// the animateQueueProvider defined in ngAnimate/animateQueue.js
var $$CoreAnimateQueueProvider = /** @this */ function() {
  var postDigestQueue = new NgMap();
  var postDigestElements = [];

  this.$get = ['$$AnimateRunner', '$rootScope',
       function($$AnimateRunner,   $rootScope) {
    return {
      enabled: noop,
      on: noop,
      off: noop,
      pin: noop,

      push: function(element, event, options, domOperation) {
        if (domOperation) {
          domOperation();
        }

        options = options || {};
        if (options.from) {
          element.css(options.from);
        }
        if (options.to) {
          element.css(options.to);
        }

        if (options.addClass || options.removeClass) {
          addRemoveClassesPostDigest(element, options.addClass, options.removeClass);
        }

        var runner = new $$AnimateRunner();

        // since there are no animations to run the runner needs to be
        // notified that the animation call is complete.
        runner.complete();
        return runner;
      }
    };


    function updateData(data, classes, value) {
      var changed = false;
      if (classes) {
        classes = isString(classes) ? classes.split(' ') :
                  isArray(classes) ? classes : [];
        forEach(classes, function(className) {
          if (className) {
            changed = true;
            data[className] = value;
          }
        });
      }
      return changed;
    }

    function handleCSSClassChanges() {
      forEach(postDigestElements, function(element) {
        var data = postDigestQueue.get(element);
        if (data) {
          var existing = splitClasses(element.attr('class'));
          var toAdd = '';
          var toRemove = '';
          forEach(data, function(status, className) {
            var hasClass = !!existing[className];
            if (status !== hasClass) {
              if (status) {
                toAdd += (toAdd.length ? ' ' : '') + className;
              } else {
                toRemove += (toRemove.length ? ' ' : '') + className;
              }
            }
          });

          forEach(element, function(elm) {
            if (toAdd) {
              jqLiteAddClass(elm, toAdd);
            }
            if (toRemove) {
              jqLiteRemoveClass(elm, toRemove);
            }
          });
          postDigestQueue.delete(element);
        }
      });
      postDigestElements.length = 0;
    }


    function addRemoveClassesPostDigest(element, add, remove) {
      var data = postDigestQueue.get(element) || {};

      var classesAdded = updateData(data, add, true);
      var classesRemoved = updateData(data, remove, false);

      if (classesAdded || classesRemoved) {

        postDigestQueue.set(element, data);
        postDigestElements.push(element);

        if (postDigestElements.length === 1) {
          $rootScope.$$postDigest(handleCSSClassChanges);
        }
      }
    }
  }];
};

/**
 * @ngdoc provider
 * @name $animateProvider
 *
 * @description
 * Default implementation of $animate that doesn't perform any animations, instead just
 * synchronously performs DOM updates and resolves the returned runner promise.
 *
 * In order to enable animations the `ngAnimate` module has to be loaded.
 *
 * To see the functional implementation check out `src/ngAnimate/animate.js`.
 */
var $AnimateProvider = ['$provide', /** @this */ function($provide) {
  var provider = this;
  var classNameFilter = null;
  var customFilter = null;

  this.$$registeredAnimations = Object.create(null);

   /**
   * @ngdoc method
   * @name $animateProvider#register
   *
   * @description
   * Registers a new injectable animation factory function. The factory function produces the
   * animation object which contains callback functions for each event that is expected to be
   * animated.
   *
   *   * `eventFn`: `function(element, ... , doneFunction, options)`
   *   The element to animate, the `doneFunction` and the options fed into the animation. Depending
   *   on the type of animation additional arguments will be injected into the animation function. The
   *   list below explains the function signatures for the different animation methods:
   *
   *   - setClass: function(element, addedClasses, removedClasses, doneFunction, options)
   *   - addClass: function(element, addedClasses, doneFunction, options)
   *   - removeClass: function(element, removedClasses, doneFunction, options)
   *   - enter, leave, move: function(element, doneFunction, options)
   *   - animate: function(element, fromStyles, toStyles, doneFunction, options)
   *
   *   Make sure to trigger the `doneFunction` once the animation is fully complete.
   *
   * ```js
   *   return {
   *     //enter, leave, move signature
   *     eventFn : function(element, done, options) {
   *       //code to run the animation
   *       //once complete, then run done()
   *       return function endFunction(wasCancelled) {
   *         //code to cancel the animation
   *       }
   *     }
   *   }
   * ```
   *
   * @param {string} name The name of the animation (this is what the class-based CSS value will be compared to).
   * @param {Function} factory The factory function that will be executed to return the animation
   *                           object.
   */
  this.register = function(name, factory) {
    if (name && name.charAt(0) !== '.') {
      throw $animateMinErr('notcsel', 'Expecting class selector starting with \'.\' got \'{0}\'.', name);
    }

    var key = name + '-animation';
    provider.$$registeredAnimations[name.substr(1)] = key;
    $provide.factory(key, factory);
  };

  /**
   * @ngdoc method
   * @name $animateProvider#customFilter
   *
   * @description
   * Sets and/or returns the custom filter function that is used to "filter" animations, i.e.
   * determine if an animation is allowed or not. When no filter is specified (the default), no
   * animation will be blocked. Setting the `customFilter` value will only allow animations for
   * which the filter function's return value is truthy.
   *
   * This allows to easily create arbitrarily complex rules for filtering animations, such as
   * allowing specific events only, or enabling animations on specific subtrees of the DOM, etc.
   * Filtering animations can also boost performance for low-powered devices, as well as
   * applications containing a lot of structural operations.
   *
   * <div class="alert alert-success">
   *   **Best Practice:**
   *   Keep the filtering function as lean as possible, because it will be called for each DOM
   *   action (e.g. insertion, removal, class change) performed by "animation-aware" directives.
   *   See {@link guide/animations#which-directives-support-animations- here} for a list of built-in
   *   directives that support animations.
   *   Performing computationally expensive or time-consuming operations on each call of the
   *   filtering function can make your animations sluggish.
   * </div>
   *
   * **Note:** If present, `customFilter` will be checked before
   * {@link $animateProvider#classNameFilter classNameFilter}.
   *
   * @param {Function=} filterFn - The filter function which will be used to filter all animations.
   *   If a falsy value is returned, no animation will be performed. The function will be called
   *   with the following arguments:
   *   - **node** `{DOMElement}` - The DOM element to be animated.
   *   - **event** `{String}` - The name of the animation event (e.g. `enter`, `leave`, `addClass`
   *     etc).
   *   - **options** `{Object}` - A collection of options/styles used for the animation.
   * @return {Function} The current filter function or `null` if there is none set.
   */
  this.customFilter = function(filterFn) {
    if (arguments.length === 1) {
      customFilter = isFunction(filterFn) ? filterFn : null;
    }

    return customFilter;
  };

  /**
   * @ngdoc method
   * @name $animateProvider#classNameFilter
   *
   * @description
   * Sets and/or returns the CSS class regular expression that is checked when performing
   * an animation. Upon bootstrap the classNameFilter value is not set at all and will
   * therefore enable $animate to attempt to perform an animation on any element that is triggered.
   * When setting the `classNameFilter` value, animations will only be performed on elements
   * that successfully match the filter expression. This in turn can boost performance
   * for low-powered devices as well as applications containing a lot of structural operations.
   *
   * **Note:** If present, `classNameFilter` will be checked after
   * {@link $animateProvider#customFilter customFilter}. If `customFilter` is present and returns
   * false, `classNameFilter` will not be checked.
   *
   * @param {RegExp=} expression The className expression which will be checked against all animations
   * @return {RegExp} The current CSS className expression value. If null then there is no expression value
   */
  this.classNameFilter = function(expression) {
    if (arguments.length === 1) {
      classNameFilter = (expression instanceof RegExp) ? expression : null;
      if (classNameFilter) {
        var reservedRegex = new RegExp('[(\\s|\\/)]' + NG_ANIMATE_CLASSNAME + '[(\\s|\\/)]');
        if (reservedRegex.test(classNameFilter.toString())) {
          classNameFilter = null;
          throw $animateMinErr('nongcls', '$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "{0}" CSS class.', NG_ANIMATE_CLASSNAME);
        }
      }
    }
    return classNameFilter;
  };

  this.$get = ['$$animateQueue', function($$animateQueue) {
    function domInsert(element, parentElement, afterElement) {
      // if for some reason the previous element was removed
      // from the dom sometime before this code runs then let's
      // just stick to using the parent element as the anchor
      if (afterElement) {
        var afterNode = extractElementNode(afterElement);
        if (afterNode && !afterNode.parentNode && !afterNode.previousElementSibling) {
          afterElement = null;
        }
      }
      if (afterElement) {
        afterElement.after(element);
      } else {
        parentElement.prepend(element);
      }
    }

    /**
     * @ngdoc service
     * @name $animate
     * @description The $animate service exposes a series of DOM utility methods that provide support
     * for animation hooks. The default behavior is the application of DOM operations, however,
     * when an animation is detected (and animations are enabled), $animate will do the heavy lifting
     * to ensure that animation runs with the triggered DOM operation.
     *
     * By default $animate doesn't trigger any animations. This is because the `ngAnimate` module isn't
     * included and only when it is active then the animation hooks that `$animate` triggers will be
     * functional. Once active then all structural `ng-` directives will trigger animations as they perform
     * their DOM-related operations (enter, leave and move). Other directives such as `ngClass`,
     * `ngShow`, `ngHide` and `ngMessages` also provide support for animations.
     *
     * It is recommended that the`$animate` service is always used when executing DOM-related procedures within directives.
     *
     * To learn more about enabling animation support, click here to visit the
     * {@link ngAnimate ngAnimate module page}.
     */
    return {
      // we don't call it directly since non-existant arguments may
      // be interpreted as null within the sub enabled function

      /**
       *
       * @ngdoc method
       * @name $animate#on
       * @kind function
       * @description Sets up an event listener to fire whenever the animation event (enter, leave, move, etc...)
       *    has fired on the given element or among any of its children. Once the listener is fired, the provided callback
       *    is fired with the following params:
       *
       * ```js
       * $animate.on('enter', container,
       *    function callback(element, phase) {
       *      // cool we detected an enter animation within the container
       *    }
       * );
       * ```
       *
       * <div class="alert alert-warning">
       * **Note**: Generally, the events that are fired correspond 1:1 to `$animate` method names,
       * e.g. {@link ng.$animate#addClass addClass()} will fire `addClass`, and {@link ng.ngClass}
       * will fire `addClass` if classes are added, and `removeClass` if classes are removed.
       * However, there are two exceptions:
       *
       * <ul>
       *   <li>if both an {@link ng.$animate#addClass addClass()} and a
       *   {@link ng.$animate#removeClass removeClass()} action are performed during the same
       *   animation, the event fired will be `setClass`. This is true even for `ngClass`.</li>
       *   <li>an {@link ng.$animate#animate animate()} call that adds and removes classes will fire
       *   the `setClass` event, but if it either removes or adds classes,
       *   it will fire `animate` instead.</li>
       * </ul>
       *
       * </div>
       *
       * @param {string} event the animation event that will be captured (e.g. enter, leave, move, addClass, removeClass, etc...)
       * @param {DOMElement} container the container element that will capture each of the animation events that are fired on itself
       *     as well as among its children
       * @param {Function} callback the callback function that will be fired when the listener is triggered.
       *
       * The arguments present in the callback function are:
       * * `element` - The captured DOM element that the animation was fired on.
       * * `phase` - The phase of the animation. The two possible phases are **start** (when the animation starts) and **close** (when it ends).
       * * `data` - an object with these properties:
       *     * addClass - `{string|null}` - space-separated CSS classes to add to the element
       *     * removeClass - `{string|null}` - space-separated CSS classes to remove from the element
       *     * from - `{Object|null}` - CSS properties & values at the beginning of the animation
       *     * to - `{Object|null}` - CSS properties & values at the end of the animation
       *
       * Note that the callback does not trigger a scope digest. Wrap your call into a
       * {@link $rootScope.Scope#$apply scope.$apply} to propagate changes to the scope.
       */
      on: $$animateQueue.on,

      /**
       *
       * @ngdoc method
       * @name $animate#off
       * @kind function
       * @description Deregisters an event listener based on the event which has been associated with the provided element. This method
       * can be used in three different ways depending on the arguments:
       *
       * ```js
       * // remove all the animation event listeners listening for `enter`
       * $animate.off('enter');
       *
       * // remove listeners for all animation events from the container element
       * $animate.off(container);
       *
       * // remove all the animation event listeners listening for `enter` on the given element and its children
       * $animate.off('enter', container);
       *
       * // remove the event listener function provided by `callback` that is set
       * // to listen for `enter` on the given `container` as well as its children
       * $animate.off('enter', container, callback);
       * ```
       *
       * @param {string|DOMElement} event|container the animation event (e.g. enter, leave, move,
       * addClass, removeClass, etc...), or the container element. If it is the element, all other
       * arguments are ignored.
       * @param {DOMElement=} container the container element the event listener was placed on
       * @param {Function=} callback the callback function that was registered as the listener
       */
      off: $$animateQueue.off,

      /**
       * @ngdoc method
       * @name $animate#pin
       * @kind function
       * @description Associates the provided element with a host parent element to allow the element to be animated even if it exists
       *    outside of the DOM structure of the AngularJS application. By doing so, any animation triggered via `$animate` can be issued on the
       *    element despite being outside the realm of the application or within another application. Say for example if the application
       *    was bootstrapped on an element that is somewhere inside of the `<body>` tag, but we wanted to allow for an element to be situated
       *    as a direct child of `document.body`, then this can be achieved by pinning the element via `$animate.pin(element)`. Keep in mind
       *    that calling `$animate.pin(element, parentElement)` will not actually insert into the DOM anywhere; it will just create the association.
       *
       *    Note that this feature is only active when the `ngAnimate` module is used.
       *
       * @param {DOMElement} element the external element that will be pinned
       * @param {DOMElement} parentElement the host parent element that will be associated with the external element
       */
      pin: $$animateQueue.pin,

      /**
       *
       * @ngdoc method
       * @name $animate#enabled
       * @kind function
       * @description Used to get and set whether animations are enabled or not on the entire application or on an element and its children. This
       * function can be called in four ways:
       *
       * ```js
       * // returns true or false
       * $animate.enabled();
       *
       * // changes the enabled state for all animations
       * $animate.enabled(false);
       * $animate.enabled(true);
       *
       * // returns true or false if animations are enabled for an element
       * $animate.enabled(element);
       *
       * // changes the enabled state for an element and its children
       * $animate.enabled(element, true);
       * $animate.enabled(element, false);
       * ```
       *
       * @param {DOMElement=} element the element that will be considered for checking/setting the enabled state
       * @param {boolean=} enabled whether or not the animations will be enabled for the element
       *
       * @return {boolean} whether or not animations are enabled
       */
      enabled: $$animateQueue.enabled,

      /**
       * @ngdoc method
       * @name $animate#cancel
       * @kind function
       * @description Cancels the provided animation and applies the end state of the animation.
       * Note that this does not cancel the underlying operation, e.g. the setting of classes or
       * adding the element to the DOM.
       *
       * @param {animationRunner} animationRunner An animation runner returned by an $animate function.
       *
       * @example
        <example module="animationExample" deps="angular-animate.js" animations="true" name="animate-cancel">
          <file name="app.js">
            angular.module('animationExample', ['ngAnimate']).component('cancelExample', {
              templateUrl: 'template.html',
              controller: function($element, $animate) {
                this.runner = null;

                this.addClass = function() {
                  this.runner = $animate.addClass($element.find('div'), 'red');
                  var ctrl = this;
                  this.runner.finally(function() {
                    ctrl.runner = null;
                  });
                };

                this.removeClass = function() {
                  this.runner = $animate.removeClass($element.find('div'), 'red');
                  var ctrl = this;
                  this.runner.finally(function() {
                    ctrl.runner = null;
                  });
                };

                this.cancel = function() {
                  $animate.cancel(this.runner);
                };
              }
            });
          </file>
          <file name="template.html">
            <p>
              <button id="add" ng-click="$ctrl.addClass()">Add</button>
              <button ng-click="$ctrl.removeClass()">Remove</button>
              <br>
              <button id="cancel" ng-click="$ctrl.cancel()" ng-disabled="!$ctrl.runner">Cancel</button>
              <br>
              <div id="target">CSS-Animated Text</div>
            </p>
          </file>
          <file name="index.html">
            <cancel-example></cancel-example>
          </file>
          <file name="style.css">
            .red-add, .red-remove {
              transition: all 4s cubic-bezier(0.250, 0.460, 0.450, 0.940);
            }

            .red,
            .red-add.red-add-active {
              color: #FF0000;
              font-size: 40px;
            }

            .red-remove.red-remove-active {
              font-size: 10px;
              color: black;
            }

          </file>
        </example>
       */
      cancel: function(runner) {
        if (runner.cancel) {
          runner.cancel();
        }
      },

      /**
       *
       * @ngdoc method
       * @name $animate#enter
       * @kind function
       * @description Inserts the element into the DOM either after the `after` element (if provided) or
       *   as the first child within the `parent` element and then triggers an animation.
       *   A promise is returned that will be resolved during the next digest once the animation
       *   has completed.
       *
       * @param {DOMElement} element the element which will be inserted into the DOM
       * @param {DOMElement} parent the parent element which will append the element as
       *   a child (so long as the after element is not present)
       * @param {DOMElement=} after the sibling element after which the element will be appended
       * @param {object=} options an optional collection of options/styles that will be applied to the element.
       *   The object can have the following properties:
       *
       *   - **addClass** - `{string}` - space-separated CSS classes to add to element
       *   - **from** - `{Object}` - CSS properties & values at the beginning of animation. Must have matching `to`
       *   - **removeClass** - `{string}` - space-separated CSS classes to remove from element
       *   - **to** - `{Object}` - CSS properties & values at end of animation. Must have matching `from`
       *
       * @return {Runner} the animation runner
       */
      enter: function(element, parent, after, options) {
        parent = parent && jqLite(parent);
        after = after && jqLite(after);
        parent = parent || after.parent();
        domInsert(element, parent, after);
        return $$animateQueue.push(element, 'enter', prepareAnimateOptions(options));
      },

      /**
       *
       * @ngdoc method
       * @name $animate#move
       * @kind function
       * @description Inserts (moves) the element into its new position in the DOM either after
       *   the `after` element (if provided) or as the first child within the `parent` element
       *   and then triggers an animation. A promise is returned that will be resolved
       *   during the next digest once the animation has completed.
       *
       * @param {DOMElement} element the element which will be moved into the new DOM position
       * @param {DOMElement} parent the parent element which will append the element as
       *   a child (so long as the after element is not present)
       * @param {DOMElement=} after the sibling element after which the element will be appended
       * @param {object=} options an optional collection of options/styles that will be applied to the element.
       *   The object can have the following properties:
       *
       *   - **addClass** - `{string}` - space-separated CSS classes to add to element
       *   - **from** - `{Object}` - CSS properties & values at the beginning of animation. Must have matching `to`
       *   - **removeClass** - `{string}` - space-separated CSS classes to remove from element
       *   - **to** - `{Object}` - CSS properties & values at end of animation. Must have matching `from`
       *
       * @return {Runner} the animation runner
       */
      move: function(element, parent, after, options) {
        parent = parent && jqLite(parent);
        after = after && jqLite(after);
        parent = parent || after.parent();
        domInsert(element, parent, after);
        return $$animateQueue.push(element, 'move', prepareAnimateOptions(options));
      },

      /**
       * @ngdoc method
       * @name $animate#leave
       * @kind function
       * @description Triggers an animation and then removes the element from the DOM.
       * When the function is called a promise is returned that will be resolved during the next
       * digest once the animation has completed.
       *
       * @param {DOMElement} element the element which will be removed from the DOM
       * @param {object=} options an optional collection of options/styles that will be applied to the element.
       *   The object can have the following properties:
       *
       *   - **addClass** - `{string}` - space-separated CSS classes to add to element
       *   - **from** - `{Object}` - CSS properties & values at the beginning of animation. Must have matching `to`
       *   - **removeClass** - `{string}` - space-separated CSS classes to remove from element
       *   - **to** - `{Object}` - CSS properties & values at end of animation. Must have matching `from`
       *
       * @return {Runner} the animation runner
       */
      leave: function(element, options) {
        return $$animateQueue.push(element, 'leave', prepareAnimateOptions(options), function() {
          element.remove();
        });
      },

      /**
       * @ngdoc method
       * @name $animate#addClass
       * @kind function
       *
       * @description Triggers an addClass animation surrounding the addition of the provided CSS class(es). Upon
       *   execution, the addClass operation will only be handled after the next digest and it will not trigger an
       *   animation if element already contains the CSS class or if the class is removed at a later step.
       *   Note that class-based animations are treated differently compared to structural animations
       *   (like enter, move and leave) since the CSS classes may be added/removed at different points
       *   depending if CSS or JavaScript animations are used.
       *
       * @param {DOMElement} element the element which the CSS classes will be applied to
       * @param {string} className the CSS class(es) that will be added (multiple classes are separated via spaces)
       * @param {object=} options an optional collection of options/styles that will be applied to the element.
       *   The object can have the following properties:
       *
       *   - **removeClass** - `{string}` - space-separated CSS classes to remove from element
       *   - **from** - `{Object}` - CSS properties & values at the beginning of animation. Must have matching `to`
       *   - **to** - `{Object}` - CSS properties & values at end of animation. Must have matching `from`
       *
       * @return {Runner} animationRunner the animation runner
       */
      addClass: function(element, className, options) {
        options = prepareAnimateOptions(options);
        options.addClass = mergeClasses(options.addclass, className);
        return $$animateQueue.push(element, 'addClass', options);
      },

      /**
       * @ngdoc method
       * @name $animate#removeClass
       * @kind function
       *
       * @description Triggers a removeClass animation surrounding the removal of the provided CSS class(es). Upon
       *   execution, the removeClass operation will only be handled after the next digest and it will not trigger an
       *   animation if element does not contain the CSS class or if the class is added at a later step.
       *   Note that class-based animations are treated differently compared to structural animations
       *   (like enter, move and leave) since the CSS classes may be added/removed at different points
       *   depending if CSS or JavaScript animations are used.
       *
       * @param {DOMElement} element the element which the CSS classes will be applied to
       * @param {string} className the CSS class(es) that will be removed (multiple classes are separated via spaces)
       * @param {object=} options an optional collection of options/styles that will be applied to the element.
       *   The object can have the following properties:
       *
       *   - **addClass** - `{string}` - space-separated CSS classes to add to element
       *   - **from** - `{Object}` - CSS properties & values at the beginning of animation. Must have matching `to`
       *   - **to** - `{Object}` - CSS properties & values at end of animation. Must have matching `from`
       *
       * @return {Runner} the animation runner
       */
      removeClass: function(element, className, options) {
        options = prepareAnimateOptions(options);
        options.removeClass = mergeClasses(options.removeClass, className);
        return $$animateQueue.push(element, 'removeClass', options);
      },

      /**
       * @ngdoc method
       * @name $animate#setClass
       * @kind function
       *
       * @description Performs both the addition and removal of a CSS classes on an element and (during the process)
       *    triggers an animation surrounding the class addition/removal. Much like `$animate.addClass` and
       *    `$animate.removeClass`, `setClass` will only evaluate the classes being added/removed once a digest has
       *    passed. Note that class-based animations are treated differently compared to structural animations
       *    (like enter, move and leave) since the CSS classes may be added/removed at different points
       *    depending if CSS or JavaScript animations are used.
       *
       * @param {DOMElement} element the element which the CSS classes will be applied to
       * @param {string} add the CSS class(es) that will be added (multiple classes are separated via spaces)
       * @param {string} remove the CSS class(es) that will be removed (multiple classes are separated via spaces)
       * @param {object=} options an optional collection of options/styles that will be applied to the element.
       *   The object can have the following properties:
       *
       *   - **addClass** - `{string}` - space-separated CSS classes to add to element
       *   - **removeClass** - `{string}` - space-separated CSS classes to remove from element
       *   - **from** - `{Object}` - CSS properties & values at the beginning of animation. Must have matching `to`
       *   - **to** - `{Object}` - CSS properties & values at end of animation. Must have matching `from`
       *
       * @return {Runner} the animation runner
       */
      setClass: function(element, add, remove, options) {
        options = prepareAnimateOptions(options);
        options.addClass = mergeClasses(options.addClass, add);
        options.removeClass = mergeClasses(options.removeClass, remove);
        return $$animateQueue.push(element, 'setClass', options);
      },

      /**
       * @ngdoc method
       * @name $animate#animate
       * @kind function
       *
       * @description Performs an inline animation on the element which applies the provided to and from CSS styles to the element.
       * If any detected CSS transition, keyframe or JavaScript matches the provided className value, then the animation will take
       * on the provided styles. For example, if a transition animation is set for the given className, then the provided `from` and
       * `to` styles will be applied alongside the given transition. If the CSS style provided in `from` does not have a corresponding
       * style in `to`, the style in `from` is applied immediately, and no animation is run.
       * If a JavaScript animation is detected then the provided styles will be given in as function parameters into the `animate`
       * method (or as part of the `options` parameter):
       *
       * ```js
       * ngModule.animation('.my-inline-animation', function() {
       *   return {
       *     animate : function(element, from, to, done, options) {
       *       //animation
       *       done();
       *     }
       *   }
       * });
       * ```
       *
       * @param {DOMElement} element the element which the CSS styles will be applied to
       * @param {object} from the from (starting) CSS styles that will be applied to the element and across the animation.
       * @param {object} to the to (destination) CSS styles that will be applied to the element and across the animation.
       * @param {string=} className an optional CSS class that will be applied to the element for the duration of the animation. If
       *    this value is left as empty then a CSS class of `ng-inline-animate` will be applied to the element.
       *    (Note that if no animation is detected then this value will not be applied to the element.)
       * @param {object=} options an optional collection of options/styles that will be applied to the element.
       *   The object can have the following properties:
       *
       *   - **addClass** - `{string}` - space-separated CSS classes to add to element
       *   - **from** - `{Object}` - CSS properties & values at the beginning of animation. Must have matching `to`
       *   - **removeClass** - `{string}` - space-separated CSS classes to remove from element
       *   - **to** - `{Object}` - CSS properties & values at end of animation. Must have matching `from`
       *
       * @return {Runner} the animation runner
       */
      animate: function(element, from, to, className, options) {
        options = prepareAnimateOptions(options);
        options.from = options.from ? extend(options.from, from) : from;
        options.to   = options.to   ? extend(options.to, to)     : to;

        className = className || 'ng-inline-animate';
        options.tempClasses = mergeClasses(options.tempClasses, className);
        return $$animateQueue.push(element, 'animate', options);
      }
    };
  }];
}];

var $$AnimateAsyncRunFactoryProvider = /** @this */ function() {
  this.$get = ['$$rAF', function($$rAF) {
    var waitQueue = [];

    function waitForTick(fn) {
      waitQueue.push(fn);
      if (waitQueue.length > 1) return;
      $$rAF(function() {
        for (var i = 0; i < waitQueue.length; i++) {
          waitQueue[i]();
        }
        waitQueue = [];
      });
    }

    return function() {
      var passed = false;
      waitForTick(function() {
        passed = true;
      });
      return function(callback) {
        if (passed) {
          callback();
        } else {
          waitForTick(callback);
        }
      };
    };
  }];
};

var $$AnimateRunnerFactoryProvider = /** @this */ function() {
  this.$get = ['$q', '$sniffer', '$$animateAsyncRun', '$$isDocumentHidden', '$timeout',
       function($q,   $sniffer,   $$animateAsyncRun,   $$isDocumentHidden,   $timeout) {

    var INITIAL_STATE = 0;
    var DONE_PENDING_STATE = 1;
    var DONE_COMPLETE_STATE = 2;

    AnimateRunner.chain = function(chain, callback) {
      var index = 0;

      next();
      function next() {
        if (index === chain.length) {
          callback(true);
          return;
        }

        chain[index](function(response) {
          if (response === false) {
            callback(false);
            return;
          }
          index++;
          next();
        });
      }
    };

    AnimateRunner.all = function(runners, callback) {
      var count = 0;
      var status = true;
      forEach(runners, function(runner) {
        runner.done(onProgress);
      });

      function onProgress(response) {
        status = status && response;
        if (++count === runners.length) {
          callback(status);
        }
      }
    };

    function AnimateRunner(host) {
      this.setHost(host);

      var rafTick = $$animateAsyncRun();
      var timeoutTick = function(fn) {
        $timeout(fn, 0, false);
      };

      this._doneCallbacks = [];
      this._tick = function(fn) {
        if ($$isDocumentHidden()) {
          timeoutTick(fn);
        } else {
          rafTick(fn);
        }
      };
      this._state = 0;
    }

    AnimateRunner.prototype = {
      setHost: function(host) {
        this.host = host || {};
      },

      done: function(fn) {
        if (this._state === DONE_COMPLETE_STATE) {
          fn();
        } else {
          this._doneCallbacks.push(fn);
        }
      },

      progress: noop,

      getPromise: function() {
        if (!this.promise) {
          var self = this;
          this.promise = $q(function(resolve, reject) {
            self.done(function(status) {
              if (status === false) {
                reject();
              } else {
                resolve();
              }
            });
          });
        }
        return this.promise;
      },

      then: function(resolveHandler, rejectHandler) {
        return this.getPromise().then(resolveHandler, rejectHandler);
      },

      'catch': function(handler) {
        return this.getPromise()['catch'](handler);
      },

      'finally': function(handler) {
        return this.getPromise()['finally'](handler);
      },

      pause: function() {
        if (this.host.pause) {
          this.host.pause();
        }
      },

      resume: function() {
        if (this.host.resume) {
          this.host.resume();
        }
      },

      end: function() {
        if (this.host.end) {
          this.host.end();
        }
        this._resolve(true);
      },

      cancel: function() {
        if (this.host.cancel) {
          this.host.cancel();
        }
        this._resolve(false);
      },

      complete: function(response) {
        var self = this;
        if (self._state === INITIAL_STATE) {
          self._state = DONE_PENDING_STATE;
          self._tick(function() {
            self._resolve(response);
          });
        }
      },

      _resolve: function(response) {
        if (this._state !== DONE_COMPLETE_STATE) {
          forEach(this._doneCallbacks, function(fn) {
            fn(response);
          });
          this._doneCallbacks.length = 0;
          this._state = DONE_COMPLETE_STATE;
        }
      }
    };

    return AnimateRunner;
  }];
};

/**
 * @ngdoc service
 * @name $animateCss
 * @kind object
 * @this
 *
 * @description
 * This is the core version of `$animateCss`. By default, only when the `ngAnimate` is included,
 * then the `$animateCss` service will actually perform animations.
 *
 * Click here {@link ngAnimate.$animateCss to read the documentation for $animateCss}.
 */
var $CoreAnimateCssProvider = function() {
  this.$get = ['$$rAF', '$q', '$$AnimateRunner', function($$rAF, $q, $$AnimateRunner) {

    return function(element, initialOptions) {
      // all of the animation functions should create
      // a copy of the options data, however, if a
      // parent service has already created a copy then
      // we should stick to using that
      var options = initialOptions || {};
      if (!options.$$prepared) {
        options = copy(options);
      }

      // there is no point in applying the styles since
      // there is no animation that goes on at all in
      // this version of $animateCss.
      if (options.cleanupStyles) {
        options.from = options.to = null;
      }

      if (options.from) {
        element.css(options.from);
        options.from = null;
      }

      var closed, runner = new $$AnimateRunner();
      return {
        start: run,
        end: run
      };

      function run() {
        $$rAF(function() {
          applyAnimationContents();
          if (!closed) {
            runner.complete();
          }
          closed = true;
        });
        return runner;
      }

      function applyAnimationContents() {
        if (options.addClass) {
          element.addClass(options.addClass);
          options.addClass = null;
        }
        if (options.removeClass) {
          element.removeClass(options.removeClass);
          options.removeClass = null;
        }
        if (options.to) {
          element.css(options.to);
          options.to = null;
        }
      }
    };
  }];
};

/* global stripHash: true */

var PATH_MATCH = /^([^?#]*)(\?([^#]*))?(#(.*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp': 21};
var $locationMinErr = minErr('$location');


/**
 * Encode path using encodeUriSegment, ignoring forward slashes
 *
 * @param {string} path Path to encode
 * @returns {string}
 */
function encodePath(path) {
  var segments = path.split('/'),
      i = segments.length;

  while (i--) {
    // decode forward slashes to prevent them from being double encoded
    segments[i] = encodeUriSegment(segments[i].replace(/%2F/g, '/'));
  }

  return segments.join('/');
}

function decodePath(path, html5Mode) {
  var segments = path.split('/'),
      i = segments.length;

  while (i--) {
    segments[i] = decodeURIComponent(segments[i]);
    if (html5Mode) {
      // encode forward slashes to prevent them from being mistaken for path separators
      segments[i] = segments[i].replace(/\//g, '%2F');
    }
  }

  return segments.join('/');
}

function normalizePath(pathValue, searchValue, hashValue) {
  var search = toKeyValue(searchValue),
    hash = hashValue ? '#' + encodeUriSegment(hashValue) : '',
    path = encodePath(pathValue);

  return path + (search ? '?' + search : '') + hash;
}

function parseAbsoluteUrl(absoluteUrl, locationObj) {
  var parsedUrl = urlResolve(absoluteUrl);

  locationObj.$$protocol = parsedUrl.protocol;
  locationObj.$$host = parsedUrl.hostname;
  locationObj.$$port = toInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
}

var DOUBLE_SLASH_REGEX = /^\s*[\\/]{2,}/;
function parseAppUrl(url, locationObj, html5Mode) {

  if (DOUBLE_SLASH_REGEX.test(url)) {
    throw $locationMinErr('badpath', 'Invalid url "{0}".', url);
  }

  var prefixed = (url.charAt(0) !== '/');
  if (prefixed) {
    url = '/' + url;
  }
  var match = urlResolve(url);
  var path = prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname;
  locationObj.$$path = decodePath(path, html5Mode);
  locationObj.$$search = parseKeyValue(match.search);
  locationObj.$$hash = decodeURIComponent(match.hash);

  // make sure path starts with '/';
  if (locationObj.$$path && locationObj.$$path.charAt(0) !== '/') {
    locationObj.$$path = '/' + locationObj.$$path;
  }
}

function startsWith(str, search) {
  return str.slice(0, search.length) === search;
}

/**
 *
 * @param {string} base
 * @param {string} url
 * @returns {string} returns text from `url` after `base` or `undefined` if it does not begin with
 *                   the expected string.
 */
function stripBaseUrl(base, url) {
  if (startsWith(url, base)) {
    return url.substr(base.length);
  }
}

function stripHash(url) {
  var index = url.indexOf('#');
  return index === -1 ? url : url.substr(0, index);
}

function stripFile(url) {
  return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
}

/* return the server only (scheme://host:port) */
function serverBase(url) {
  return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
}


/**
 * LocationHtml5Url represents a URL
 * This object is exposed as $location service when HTML5 mode is enabled and supported
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} appBaseNoFile application base URL stripped of any filename
 * @param {string} basePrefix URL path prefix
 */
function LocationHtml5Url(appBase, appBaseNoFile, basePrefix) {
  this.$$html5 = true;
  basePrefix = basePrefix || '';
  parseAbsoluteUrl(appBase, this);


  /**
   * Parse given HTML5 (regular) URL string into properties
   * @param {string} url HTML5 URL
   * @private
   */
  this.$$parse = function(url) {
    var pathUrl = stripBaseUrl(appBaseNoFile, url);
    if (!isString(pathUrl)) {
      throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url,
          appBaseNoFile);
    }

    parseAppUrl(pathUrl, this, true);

    if (!this.$$path) {
      this.$$path = '/';
    }

    this.$$compose();
  };

  this.$$normalizeUrl = function(url) {
    return appBaseNoFile + url.substr(1); // first char is always '/'
  };

  this.$$parseLinkUrl = function(url, relHref) {
    if (relHref && relHref[0] === '#') {
      // special case for links to hash fragments:
      // keep the old url and only replace the hash fragment
      this.hash(relHref.slice(1));
      return true;
    }
    var appUrl, prevAppUrl;
    var rewrittenUrl;


    if (isDefined(appUrl = stripBaseUrl(appBase, url))) {
      prevAppUrl = appUrl;
      if (basePrefix && isDefined(appUrl = stripBaseUrl(basePrefix, appUrl))) {
        rewrittenUrl = appBaseNoFile + (stripBaseUrl('/', appUrl) || appUrl);
      } else {
        rewrittenUrl = appBase + prevAppUrl;
      }
    } else if (isDefined(appUrl = stripBaseUrl(appBaseNoFile, url))) {
      rewrittenUrl = appBaseNoFile + appUrl;
    } else if (appBaseNoFile === url + '/') {
      rewrittenUrl = appBaseNoFile;
    }
    if (rewrittenUrl) {
      this.$$parse(rewrittenUrl);
    }
    return !!rewrittenUrl;
  };
}


/**
 * LocationHashbangUrl represents URL
 * This object is exposed as $location service when developer doesn't opt into html5 mode.
 * It also serves as the base class for html5 mode fallback on legacy browsers.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} appBaseNoFile application base URL stripped of any filename
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangUrl(appBase, appBaseNoFile, hashPrefix) {

  parseAbsoluteUrl(appBase, this);


  /**
   * Parse given hashbang URL into properties
   * @param {string} url Hashbang URL
   * @private
   */
  this.$$parse = function(url) {
    var withoutBaseUrl = stripBaseUrl(appBase, url) || stripBaseUrl(appBaseNoFile, url);
    var withoutHashUrl;

    if (!isUndefined(withoutBaseUrl) && withoutBaseUrl.charAt(0) === '#') {

      // The rest of the URL starts with a hash so we have
      // got either a hashbang path or a plain hash fragment
      withoutHashUrl = stripBaseUrl(hashPrefix, withoutBaseUrl);
      if (isUndefined(withoutHashUrl)) {
        // There was no hashbang prefix so we just have a hash fragment
        withoutHashUrl = withoutBaseUrl;
      }

    } else {
      // There was no hashbang path nor hash fragment:
      // If we are in HTML5 mode we use what is left as the path;
      // Otherwise we ignore what is left
      if (this.$$html5) {
        withoutHashUrl = withoutBaseUrl;
      } else {
        withoutHashUrl = '';
        if (isUndefined(withoutBaseUrl)) {
          appBase = url;
          /** @type {?} */ (this).replace();
        }
      }
    }

    parseAppUrl(withoutHashUrl, this, false);

    this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);

    this.$$compose();

    /*
     * In Windows, on an anchor node on documents loaded from
     * the filesystem, the browser will return a pathname
     * prefixed with the drive name ('/C:/path') when a
     * pathname without a drive is set:
     *  * a.setAttribute('href', '/foo')
     *   * a.pathname === '/C:/foo' //true
     *
     * Inside of AngularJS, we're always using pathnames that
     * do not include drive names for routing.
     */
    function removeWindowsDriveName(path, url, base) {
      /*
      Matches paths for file protocol on windows,
      such as /C:/foo/bar, and captures only /foo/bar.
      */
      var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;

      var firstPathSegmentMatch;

      //Get the relative path from the input URL.
      if (startsWith(url, base)) {
        url = url.replace(base, '');
      }

      // The input URL intentionally contains a first path segment that ends with a colon.
      if (windowsFilePathExp.exec(url)) {
        return path;
      }

      firstPathSegmentMatch = windowsFilePathExp.exec(path);
      return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
    }
  };

  this.$$normalizeUrl = function(url) {
    return appBase + (url ? hashPrefix + url : '');
  };

  this.$$parseLinkUrl = function(url, relHref) {
    if (stripHash(appBase) === stripHash(url)) {
      this.$$parse(url);
      return true;
    }
    return false;
  };
}


/**
 * LocationHashbangUrl represents URL
 * This object is exposed as $location service when html5 history api is enabled but the browser
 * does not support it.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} appBaseNoFile application base URL stripped of any filename
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangInHtml5Url(appBase, appBaseNoFile, hashPrefix) {
  this.$$html5 = true;
  LocationHashbangUrl.apply(this, arguments);

  this.$$parseLinkUrl = function(url, relHref) {
    if (relHref && relHref[0] === '#') {
      // special case for links to hash fragments:
      // keep the old url and only replace the hash fragment
      this.hash(relHref.slice(1));
      return true;
    }

    var rewrittenUrl;
    var appUrl;

    if (appBase === stripHash(url)) {
      rewrittenUrl = url;
    } else if ((appUrl = stripBaseUrl(appBaseNoFile, url))) {
      rewrittenUrl = appBase + hashPrefix + appUrl;
    } else if (appBaseNoFile === url + '/') {
      rewrittenUrl = appBaseNoFile;
    }
    if (rewrittenUrl) {
      this.$$parse(rewrittenUrl);
    }
    return !!rewrittenUrl;
  };

  this.$$normalizeUrl = function(url) {
    // include hashPrefix in $$absUrl when $$url is empty so IE9 does not reload page because of removal of '#'
    return appBase + hashPrefix + url;
  };
}


var locationPrototype = {

  /**
   * Ensure absolute URL is initialized.
   * @private
   */
  $$absUrl:'',

  /**
   * Are we in html5 mode?
   * @private
   */
  $$html5: false,

  /**
   * Has any change been replacing?
   * @private
   */
  $$replace: false,

  /**
   * Compose url and update `url` and `absUrl` property
   * @private
   */
  $$compose: function() {
    this.$$url = normalizePath(this.$$path, this.$$search, this.$$hash);
    this.$$absUrl = this.$$normalizeUrl(this.$$url);
    this.$$urlUpdatedByLocation = true;
  },

  /**
   * @ngdoc method
   * @name $location#absUrl
   *
   * @description
   * This method is getter only.
   *
   * Return full URL representation with all segments encoded according to rules specified in
   * [RFC 3986](http://www.ietf.org/rfc/rfc3986.txt).
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
   * var absUrl = $location.absUrl();
   * // => "http://example.com/#/some/path?foo=bar&baz=xoxo"
   * ```
   *
   * @return {string} full URL
   */
  absUrl: locationGetter('$$absUrl'),

  /**
   * @ngdoc method
   * @name $location#url
   *
   * @description
   * This method is getter / setter.
   *
   * Return URL (e.g. `/path?a=b#hash`) when called without any parameter.
   *
   * Change path, search and hash, when called with parameter and return `$location`.
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
   * var url = $location.url();
   * // => "/some/path?foo=bar&baz=xoxo"
   * ```
   *
   * @param {string=} url New URL without base prefix (e.g. `/path?a=b#hash`)
   * @return {string} url
   */
  url: function(url) {
    if (isUndefined(url)) {
      return this.$$url;
    }

    var match = PATH_MATCH.exec(url);
    if (match[1] || url === '') this.path(decodeURIComponent(match[1]));
    if (match[2] || match[1] || url === '') this.search(match[3] || '');
    this.hash(match[5] || '');

    return this;
  },

  /**
   * @ngdoc method
   * @name $location#protocol
   *
   * @description
   * This method is getter only.
   *
   * Return protocol of current URL.
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
   * var protocol = $location.protocol();
   * // => "http"
   * ```
   *
   * @return {string} protocol of current URL
   */
  protocol: locationGetter('$$protocol'),

  /**
   * @ngdoc method
   * @name $location#host
   *
   * @description
   * This method is getter only.
   *
   * Return host of current URL.
   *
   * Note: compared to the non-AngularJS version `location.host` which returns `hostname:port`, this returns the `hostname` portion only.
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
   * var host = $location.host();
   * // => "example.com"
   *
   * // given URL http://user:password@example.com:8080/#/some/path?foo=bar&baz=xoxo
   * host = $location.host();
   * // => "example.com"
   * host = location.host;
   * // => "example.com:8080"
   * ```
   *
   * @return {string} host of current URL.
   */
  host: locationGetter('$$host'),

  /**
   * @ngdoc method
   * @name $location#port
   *
   * @description
   * This method is getter only.
   *
   * Return port of current URL.
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
   * var port = $location.port();
   * // => 80
   * ```
   *
   * @return {Number} port
   */
  port: locationGetter('$$port'),

  /**
   * @ngdoc method
   * @name $location#path
   *
   * @description
   * This method is getter / setter.
   *
   * Return path of current URL when called without any parameter.
   *
   * Change path when called with parameter and return `$location`.
   *
   * Note: Path should always begin with forward slash (/), this method will add the forward slash
   * if it is missing.
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
   * var path = $location.path();
   * // => "/some/path"
   * ```
   *
   * @param {(string|number)=} path New path
   * @return {(string|object)} path if called with no parameters, or `$location` if called with a parameter
   */
  path: locationGetterSetter('$$path', function(path) {
    path = path !== null ? path.toString() : '';
    return path.charAt(0) === '/' ? path : '/' + path;
  }),

  /**
   * @ngdoc method
   * @name $location#search
   *
   * @description
   * This method is getter / setter.
   *
   * Return search part (as object) of current URL when called without any parameter.
   *
   * Change search part when called with parameter and return `$location`.
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo
   * var searchObject = $location.search();
   * // => {foo: 'bar', baz: 'xoxo'}
   *
   * // set foo to 'yipee'
   * $location.search('foo', 'yipee');
   * // $location.search() => {foo: 'yipee', baz: 'xoxo'}
   * ```
   *
   * @param {string|Object.<string>|Object.<Array.<string>>} search New search params - string or
   * hash object.
   *
   * When called with a single argument the method acts as a setter, setting the `search` component
   * of `$location` to the specified value.
   *
   * If the argument is a hash object containing an array of values, these values will be encoded
   * as duplicate search parameters in the URL.
   *
   * @param {(string|Number|Array<string>|boolean)=} paramValue If `search` is a string or number, then `paramValue`
   * will override only a single search property.
   *
   * If `paramValue` is an array, it will override the property of the `search` component of
   * `$location` specified via the first argument.
   *
   * If `paramValue` is `null`, the property specified via the first argument will be deleted.
   *
   * If `paramValue` is `true`, the property specified via the first argument will be added with no
   * value nor trailing equal sign.
   *
   * @return {Object} If called with no arguments returns the parsed `search` object. If called with
   * one or more arguments returns `$location` object itself.
   */
  search: function(search, paramValue) {
    switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (isString(search) || isNumber(search)) {
          search = search.toString();
          this.$$search = parseKeyValue(search);
        } else if (isObject(search)) {
          search = copy(search, {});
          // remove object undefined or null properties
          forEach(search, function(value, key) {
            if (value == null) delete search[key];
          });

          this.$$search = search;
        } else {
          throw $locationMinErr('isrcharg',
              'The first argument of the `$location#search()` call must be a string or an object.');
        }
        break;
      default:
        if (isUndefined(paramValue) || paramValue === null) {
          delete this.$$search[search];
        } else {
          this.$$search[search] = paramValue;
        }
    }

    this.$$compose();
    return this;
  },

  /**
   * @ngdoc method
   * @name $location#hash
   *
   * @description
   * This method is getter / setter.
   *
   * Returns the hash fragment when called without any parameters.
   *
   * Changes the hash fragment when called with a parameter and returns `$location`.
   *
   *
   * ```js
   * // given URL http://example.com/#/some/path?foo=bar&baz=xoxo#hashValue
   * var hash = $location.hash();
   * // => "hashValue"
   * ```
   *
   * @param {(string|number)=} hash New hash fragment
   * @return {string} hash
   */
  hash: locationGetterSetter('$$hash', function(hash) {
    return hash !== null ? hash.toString() : '';
  }),

  /**
   * @ngdoc method
   * @name $location#replace
   *
   * @description
   * If called, all changes to $location during the current `$digest` will replace the current history
   * record, instead of adding a new one.
   */
  replace: function() {
    this.$$replace = true;
    return this;
  }
};

forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function(Location) {
  Location.prototype = Object.create(locationPrototype);

  /**
   * @ngdoc method
   * @name $location#state
   *
   * @description
   * This method is getter / setter.
   *
   * Return the history state object when called without any parameter.
   *
   * Change the history state object when called with one parameter and return `$location`.
   * The state object is later passed to `pushState` or `replaceState`.
   *
   * NOTE: This method is supported only in HTML5 mode and only in browsers supporting
   * the HTML5 History API (i.e. methods `pushState` and `replaceState`). If you need to support
   * older browsers (like IE9 or Android < 4.0), don't use this method.
   *
   * @param {object=} state State object for pushState or replaceState
   * @return {object} state
   */
  Location.prototype.state = function(state) {
    if (!arguments.length) {
      return this.$$state;
    }

    if (Location !== LocationHtml5Url || !this.$$html5) {
      throw $locationMinErr('nostate', 'History API state support is available only ' +
        'in HTML5 mode and only in browsers supporting HTML5 History API');
    }
    // The user might modify `stateObject` after invoking `$location.state(stateObject)`
    // but we're changing the $$state reference to $browser.state() during the $digest
    // so the modification window is narrow.
    this.$$state = isUndefined(state) ? null : state;
    this.$$urlUpdatedByLocation = true;

    return this;
  };
});


function locationGetter(property) {
  return /** @this */ function() {
    return this[property];
  };
}


function locationGetterSetter(property, preprocess) {
  return /** @this */ function(value) {
    if (isUndefined(value)) {
      return this[property];
    }

    this[property] = preprocess(value);
    this.$$compose();

    return this;
  };
}


/**
 * @ngdoc service
 * @name $location
 *
 * @requires $rootElement
 *
 * @description
 * The $location service parses the URL in the browser address bar (based on the
 * [window.location](https://developer.mozilla.org/en/window.location)) and makes the URL
 * available to your application. Changes to the URL in the address bar are reflected into
 * $location service and changes to $location are reflected into the browser address bar.
 *
 * **The $location service:**
 *
 * - Exposes the current URL in the browser address bar, so you can
 *   - Watch and observe the URL.
 *   - Change the URL.
 * - Synchronizes the URL with the browser when the user
 *   - Changes the address bar.
 *   - Clicks the back or forward button (or clicks a History link).
 *   - Clicks on a link.
 * - Represents the URL object as a set of methods (protocol, host, port, path, search, hash).
 *
 * For more information see {@link guide/$location Developer Guide: Using $location}
 */

/**
 * @ngdoc provider
 * @name $locationProvider
 * @this
 *
 * @description
 * Use the `$locationProvider` to configure how the application deep linking paths are stored.
 */
function $LocationProvider() {
  var hashPrefix = '!',
      html5Mode = {
        enabled: false,
        requireBase: true,
        rewriteLinks: true
      };

  /**
   * @ngdoc method
   * @name $locationProvider#hashPrefix
   * @description
   * The default value for the prefix is `'!'`.
   * @param {string=} prefix Prefix for hash part (containing path and search)
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.hashPrefix = function(prefix) {
    if (isDefined(prefix)) {
      hashPrefix = prefix;
      return this;
    } else {
      return hashPrefix;
    }
  };

  /**
   * @ngdoc method
   * @name $locationProvider#html5Mode
   * @description
   * @param {(boolean|Object)=} mode If boolean, sets `html5Mode.enabled` to value.
   *   If object, sets `enabled`, `requireBase` and `rewriteLinks` to respective values. Supported
   *   properties:
   *   - **enabled** – `{boolean}` – (default: false) If true, will rely on `history.pushState` to
   *     change urls where supported. Will fall back to hash-prefixed paths in browsers that do not
   *     support `pushState`.
   *   - **requireBase** - `{boolean}` - (default: `true`) When html5Mode is enabled, specifies
   *     whether or not a <base> tag is required to be present. If `enabled` and `requireBase` are
   *     true, and a base tag is not present, an error will be thrown when `$location` is injected.
   *     See the {@link guide/$location $location guide for more information}
   *   - **rewriteLinks** - `{boolean|string}` - (default: `true`) When html5Mode is enabled,
   *     enables/disables URL rewriting for relative links. If set to a string, URL rewriting will
   *     only happen on links with an attribute that matches the given string. For example, if set
   *     to `'internal-link'`, then the URL will only be rewritten for `<a internal-link>` links.
   *     Note that [attribute name normalization](guide/directive#normalization) does not apply
   *     here, so `'internalLink'` will **not** match `'internal-link'`.
   *
   * @returns {Object} html5Mode object if used as getter or itself (chaining) if used as setter
   */
  this.html5Mode = function(mode) {
    if (isBoolean(mode)) {
      html5Mode.enabled = mode;
      return this;
    } else if (isObject(mode)) {

      if (isBoolean(mode.enabled)) {
        html5Mode.enabled = mode.enabled;
      }

      if (isBoolean(mode.requireBase)) {
        html5Mode.requireBase = mode.requireBase;
      }

      if (isBoolean(mode.rewriteLinks) || isString(mode.rewriteLinks)) {
        html5Mode.rewriteLinks = mode.rewriteLinks;
      }

      return this;
    } else {
      return html5Mode;
    }
  };

  /**
   * @ngdoc event
   * @name $location#$locationChangeStart
   * @eventType broadcast on root scope
   * @description
   * Broadcasted before a URL will change.
   *
   * This change can be prevented by calling
   * `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on} for more
   * details about event object. Upon successful change
   * {@link ng.$location#$locationChangeSuccess $locationChangeSuccess} is fired.
   *
   * The `newState` and `oldState` parameters may be defined only in HTML5 mode and when
   * the browser supports the HTML5 History API.
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {string} newUrl New URL
   * @param {string=} oldUrl URL that was before it was changed.
   * @param {string=} newState New history state object
   * @param {string=} oldState History state object that was before it was changed.
   */

  /**
   * @ngdoc event
   * @name $location#$locationChangeSuccess
   * @eventType broadcast on root scope
   * @description
   * Broadcasted after a URL was changed.
   *
   * The `newState` and `oldState` parameters may be defined only in HTML5 mode and when
   * the browser supports the HTML5 History API.
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {string} newUrl New URL
   * @param {string=} oldUrl URL that was before it was changed.
   * @param {string=} newState New history state object
   * @param {string=} oldState History state object that was before it was changed.
   */

  this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement', '$window',
      function($rootScope, $browser, $sniffer, $rootElement, $window) {
    var $location,
        LocationMode,
        baseHref = $browser.baseHref(), // if base[href] is undefined, it defaults to ''
        initialUrl = $browser.url(),
        appBase;

    if (html5Mode.enabled) {
      if (!baseHref && html5Mode.requireBase) {
        throw $locationMinErr('nobase',
          '$location in HTML5 mode requires a <base> tag to be present!');
      }
      appBase = serverBase(initialUrl) + (baseHref || '/');
      LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
    } else {
      appBase = stripHash(initialUrl);
      LocationMode = LocationHashbangUrl;
    }
    var appBaseNoFile = stripFile(appBase);

    $location = new LocationMode(appBase, appBaseNoFile, '#' + hashPrefix);
    $location.$$parseLinkUrl(initialUrl, initialUrl);

    $location.$$state = $browser.state();

    var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;

    // Determine if two URLs are equal despite potentially having different encoding/normalizing
    //  such as $location.absUrl() vs $browser.url()
    // See https://github.com/angular/angular.js/issues/16592
    function urlsEqual(a, b) {
      return a === b || urlResolve(a).href === urlResolve(b).href;
    }

    function setBrowserUrlWithFallback(url, replace, state) {
      var oldUrl = $location.url();
      var oldState = $location.$$state;
      try {
        $browser.url(url, replace, state);

        // Make sure $location.state() returns referentially identical (not just deeply equal)
        // state object; this makes possible quick checking if the state changed in the digest
        // loop. Checking deep equality would be too expensive.
        $location.$$state = $browser.state();
      } catch (e) {
        // Restore old values if pushState fails
        $location.url(oldUrl);
        $location.$$state = oldState;

        throw e;
      }
    }

    $rootElement.on('click', function(event) {
      var rewriteLinks = html5Mode.rewriteLinks;
      // TODO(vojta): rewrite link when opening in new tab/window (in legacy browser)
      // currently we open nice url link and redirect then

      if (!rewriteLinks || event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2 || event.button === 2) return;

      var elm = jqLite(event.target);

      // traverse the DOM up to find first A tag
      while (nodeName_(elm[0]) !== 'a') {
        // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
      }

      if (isString(rewriteLinks) && isUndefined(elm.attr(rewriteLinks))) return;

      var absHref = elm.prop('href');
      // get the actual href attribute - see
      // http://msdn.microsoft.com/en-us/library/ie/dd347148(v=vs.85).aspx
      var relHref = elm.attr('href') || elm.attr('xlink:href');

      if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
        // SVGAnimatedString.animVal should be identical to SVGAnimatedString.baseVal, unless during
        // an animation.
        absHref = urlResolve(absHref.animVal).href;
      }

      // Ignore when url is started with javascript: or mailto:
      if (IGNORE_URI_REGEXP.test(absHref)) return;

      if (absHref && !elm.attr('target') && !event.isDefaultPrevented()) {
        if ($location.$$parseLinkUrl(absHref, relHref)) {
          // We do a preventDefault for all urls that are part of the AngularJS application,
          // in html5mode and also without, so that we are able to abort navigation without
          // getting double entries in the location history.
          event.preventDefault();
          // update location manually
          if ($location.absUrl() !== $browser.url()) {
            $rootScope.$apply();
          }
        }
      }
    });


    // rewrite hashbang url <> html5 url
    if ($location.absUrl() !== initialUrl) {
      $browser.url($location.absUrl(), true);
    }

    var initializing = true;

    // update $location when $browser url changes
    $browser.onUrlChange(function(newUrl, newState) {

      if (!startsWith(newUrl, appBaseNoFile)) {
        // If we are navigating outside of the app then force a reload
        $window.location.href = newUrl;
        return;
      }

      $rootScope.$evalAsync(function() {
        var oldUrl = $location.absUrl();
        var oldState = $location.$$state;
        var defaultPrevented;
        $location.$$parse(newUrl);
        $location.$$state = newState;

        defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
            newState, oldState).defaultPrevented;

        // if the location was changed by a `$locationChangeStart` handler then stop
        // processing this location change
        if ($location.absUrl() !== newUrl) return;

        if (defaultPrevented) {
          $location.$$parse(oldUrl);
          $location.$$state = oldState;
          setBrowserUrlWithFallback(oldUrl, false, oldState);
        } else {
          initializing = false;
          afterLocationChange(oldUrl, oldState);
        }
      });
      if (!$rootScope.$$phase) $rootScope.$digest();
    });

    // update browser
    $rootScope.$watch(function $locationWatch() {
      if (initializing || $location.$$urlUpdatedByLocation) {
        $location.$$urlUpdatedByLocation = false;

        var oldUrl = $browser.url();
        var newUrl = $location.absUrl();
        var oldState = $browser.state();
        var currentReplace = $location.$$replace;
        var urlOrStateChanged = !urlsEqual(oldUrl, newUrl) ||
          ($location.$$html5 && $sniffer.history && oldState !== $location.$$state);

        if (initializing || urlOrStateChanged) {
          initializing = false;

          $rootScope.$evalAsync(function() {
            var newUrl = $location.absUrl();
            var defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
                $location.$$state, oldState).defaultPrevented;

            // if the location was changed by a `$locationChangeStart` handler then stop
            // processing this location change
            if ($location.absUrl() !== newUrl) return;

            if (defaultPrevented) {
              $location.$$parse(oldUrl);
              $location.$$state = oldState;
            } else {
              if (urlOrStateChanged) {
                setBrowserUrlWithFallback(newUrl, currentReplace,
                                          oldState === $location.$$state ? null : $location.$$state);
              }
              afterLocationChange(oldUrl, oldState);
            }
          });
        }
      }

      $location.$$replace = false;

      // we don't need to return anything because $evalAsync will make the digest loop dirty when
      // there is a change
    });

    return $location;

    function afterLocationChange(oldUrl, oldState) {
      $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl,
        $location.$$state, oldState);
    }
}];
}

/**
 * @ngdoc service
 * @name $log
 * @requires $window
 *
 * @description
 * Simple service for logging. Default implementation safely writes the message
 * into the browser's console (if present).
 *
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * To reveal the location of the calls to `$log` in the JavaScript console,
 * you can "blackbox" the AngularJS source in your browser:
 *
 * [Mozilla description of blackboxing](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Black_box_a_source).
 * [Chrome description of blackboxing](https://developer.chrome.com/devtools/docs/blackboxing).
 *
 * Note: Not all browsers support blackboxing.
 *
 * The default is to log `debug` messages. You can use
 * {@link ng.$logProvider ng.$logProvider#debugEnabled} to change this.
 *
 * @example
   <example module="logExample" name="log-service">
     <file name="script.js">
       angular.module('logExample', [])
         .controller('LogController', ['$scope', '$log', function($scope, $log) {
           $scope.$log = $log;
           $scope.message = 'Hello World!';
         }]);
     </file>
     <file name="index.html">
       <div ng-controller="LogController">
         <p>Reload this page with open console, enter text and hit the log button...</p>
         <label>Message:
         <input type="text" ng-model="message" /></label>
         <button ng-click="$log.log(message)">log</button>
         <button ng-click="$log.warn(message)">warn</button>
         <button ng-click="$log.info(message)">info</button>
         <button ng-click="$log.error(message)">error</button>
         <button ng-click="$log.debug(message)">debug</button>
       </div>
     </file>
   </example>
 */

/**
 * @ngdoc provider
 * @name $logProvider
 * @this
 *
 * @description
 * Use the `$logProvider` to configure how the application logs messages
 */
function $LogProvider() {
  var debug = true,
      self = this;

  /**
   * @ngdoc method
   * @name $logProvider#debugEnabled
   * @description
   * @param {boolean=} flag enable or disable debug level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.debugEnabled = function(flag) {
    if (isDefined(flag)) {
      debug = flag;
      return this;
    } else {
      return debug;
    }
  };

  this.$get = ['$window', function($window) {
    // Support: IE 9-11, Edge 12-14+
    // IE/Edge display errors in such a way that it requires the user to click in 4 places
    // to see the stack trace. There is no way to feature-detect it so there's a chance
    // of the user agent sniffing to go wrong but since it's only about logging, this shouldn't
    // break apps. Other browsers display errors in a sensible way and some of them map stack
    // traces along source maps if available so it makes sense to let browsers display it
    // as they want.
    var formatStackTrace = msie || /\bEdge\//.test($window.navigator && $window.navigator.userAgent);

    return {
      /**
       * @ngdoc method
       * @name $log#log
       *
       * @description
       * Write a log message
       */
      log: consoleLog('log'),

      /**
       * @ngdoc method
       * @name $log#info
       *
       * @description
       * Write an information message
       */
      info: consoleLog('info'),

      /**
       * @ngdoc method
       * @name $log#warn
       *
       * @description
       * Write a warning message
       */
      warn: consoleLog('warn'),

      /**
       * @ngdoc method
       * @name $log#error
       *
       * @description
       * Write an error message
       */
      error: consoleLog('error'),

      /**
       * @ngdoc method
       * @name $log#debug
       *
       * @description
       * Write a debug message
       */
      debug: (function() {
        var fn = consoleLog('debug');

        return function() {
          if (debug) {
            fn.apply(self, arguments);
          }
        };
      })()
    };

    function formatError(arg) {
      if (isError(arg)) {
        if (arg.stack && formatStackTrace) {
          arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
              ? 'Error: ' + arg.message + '\n' + arg.stack
              : arg.stack;
        } else if (arg.sourceURL) {
          arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
      }
      return arg;
    }

    function consoleLog(type) {
      var console = $window.console || {},
          logFn = console[type] || console.log || noop;

      return function() {
        var args = [];
        forEach(arguments, function(arg) {
          args.push(formatError(arg));
        });
        // Support: IE 9 only
        // console methods don't inherit from Function.prototype in IE 9 so we can't
        // call `logFn.apply(console, args)` directly.
        return Function.prototype.apply.call(logFn, console, args);
      };
    }
  }];
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var $parseMinErr = minErr('$parse');

var objectValueOf = {}.constructor.prototype.valueOf;

// Sandboxing AngularJS Expressions
// ------------------------------
// AngularJS expressions are no longer sandboxed. So it is now even easier to access arbitrary JS code by
// various means such as obtaining a reference to native JS functions like the Function constructor.
//
// As an example, consider the following AngularJS expression:
//
//   {}.toString.constructor('alert("evil JS code")')
//
// It is important to realize that if you create an expression from a string that contains user provided
// content then it is possible that your application contains a security vulnerability to an XSS style attack.
//
// See https://docs.angularjs.org/guide/security


function getStringValue(name) {
  // Property names must be strings. This means that non-string objects cannot be used
  // as keys in an object. Any non-string object, including a number, is typecasted
  // into a string via the toString method.
  // -- MDN, https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Property_accessors#Property_names
  //
  // So, to ensure that we are checking the same `name` that JavaScript would use, we cast it
  // to a string. It's not always possible. If `name` is an object and its `toString` method is
  // 'broken' (doesn't return a string, isn't a function, etc.), an error will be thrown:
  //
  // TypeError: Cannot convert object to primitive value
  //
  // For performance reasons, we don't catch this error here and allow it to propagate up the call
  // stack. Note that you'll get the same error in JavaScript if you try to access a property using
  // such a 'broken' object as a key.
  return name + '';
}


var OPERATORS = createMap();
forEach('+ - * / % === !== == != < > <= >= && || ! = |'.split(' '), function(operator) { OPERATORS[operator] = true; });
var ESCAPE = {'n':'\n', 'f':'\f', 'r':'\r', 't':'\t', 'v':'\v', '\'':'\'', '"':'"'};


/////////////////////////////////////////


/**
 * @constructor
 */
var Lexer = function Lexer(options) {
  this.options = options;
};

Lexer.prototype = {
  constructor: Lexer,

  lex: function(text) {
    this.text = text;
    this.index = 0;
    this.tokens = [];

    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch === '"' || ch === '\'') {
        this.readString(ch);
      } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek())) {
        this.readNumber();
      } else if (this.isIdentifierStart(this.peekMultichar())) {
        this.readIdent();
      } else if (this.is(ch, '(){}[].,;:?')) {
        this.tokens.push({index: this.index, text: ch});
        this.index++;
      } else if (this.isWhitespace(ch)) {
        this.index++;
      } else {
        var ch2 = ch + this.peek();
        var ch3 = ch2 + this.peek(2);
        var op1 = OPERATORS[ch];
        var op2 = OPERATORS[ch2];
        var op3 = OPERATORS[ch3];
        if (op1 || op2 || op3) {
          var token = op3 ? ch3 : (op2 ? ch2 : ch);
          this.tokens.push({index: this.index, text: token, operator: true});
          this.index += token.length;
        } else {
          this.throwError('Unexpected next character ', this.index, this.index + 1);
        }
      }
    }
    return this.tokens;
  },

  is: function(ch, chars) {
    return chars.indexOf(ch) !== -1;
  },

  peek: function(i) {
    var num = i || 1;
    return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
  },

  isNumber: function(ch) {
    return ('0' <= ch && ch <= '9') && typeof ch === 'string';
  },

  isWhitespace: function(ch) {
    // IE treats non-breaking space as \u00A0
    return (ch === ' ' || ch === '\r' || ch === '\t' ||
            ch === '\n' || ch === '\v' || ch === '\u00A0');
  },

  isIdentifierStart: function(ch) {
    return this.options.isIdentifierStart ?
        this.options.isIdentifierStart(ch, this.codePointAt(ch)) :
        this.isValidIdentifierStart(ch);
  },

  isValidIdentifierStart: function(ch) {
    return ('a' <= ch && ch <= 'z' ||
            'A' <= ch && ch <= 'Z' ||
            '_' === ch || ch === '$');
  },

  isIdentifierContinue: function(ch) {
    return this.options.isIdentifierContinue ?
        this.options.isIdentifierContinue(ch, this.codePointAt(ch)) :
        this.isValidIdentifierContinue(ch);
  },

  isValidIdentifierContinue: function(ch, cp) {
    return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
  },

  codePointAt: function(ch) {
    if (ch.length === 1) return ch.charCodeAt(0);
    // eslint-disable-next-line no-bitwise
    return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 0x35FDC00;
  },

  peekMultichar: function() {
    var ch = this.text.charAt(this.index);
    var peek = this.peek();
    if (!peek) {
      return ch;
    }
    var cp1 = ch.charCodeAt(0);
    var cp2 = peek.charCodeAt(0);
    if (cp1 >= 0xD800 && cp1 <= 0xDBFF && cp2 >= 0xDC00 && cp2 <= 0xDFFF) {
      return ch + peek;
    }
    return ch;
  },

  isExpOperator: function(ch) {
    return (ch === '-' || ch === '+' || this.isNumber(ch));
  },

  throwError: function(error, start, end) {
    end = end || this.index;
    var colStr = (isDefined(start)
            ? 's ' + start +  '-' + this.index + ' [' + this.text.substring(start, end) + ']'
            : ' ' + end);
    throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].',
        error, colStr, this.text);
  },

  readNumber: function() {
    var number = '';
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = lowercase(this.text.charAt(this.index));
      if (ch === '.' || this.isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = this.peek();
        if (ch === 'e' && this.isExpOperator(peekCh)) {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            peekCh && this.isNumber(peekCh) &&
            number.charAt(number.length - 1) === 'e') {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            (!peekCh || !this.isNumber(peekCh)) &&
            number.charAt(number.length - 1) === 'e') {
          this.throwError('Invalid exponent');
        } else {
          break;
        }
      }
      this.index++;
    }
    this.tokens.push({
      index: start,
      text: number,
      constant: true,
      value: Number(number)
    });
  },

  readIdent: function() {
    var start = this.index;
    this.index += this.peekMultichar().length;
    while (this.index < this.text.length) {
      var ch = this.peekMultichar();
      if (!this.isIdentifierContinue(ch)) {
        break;
      }
      this.index += ch.length;
    }
    this.tokens.push({
      index: start,
      text: this.text.slice(start, this.index),
      identifier: true
    });
  },

  readString: function(quote) {
    var start = this.index;
    this.index++;
    var string = '';
    var rawString = quote;
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      rawString += ch;
      if (escape) {
        if (ch === 'u') {
          var hex = this.text.substring(this.index + 1, this.index + 5);
          if (!hex.match(/[\da-f]{4}/i)) {
            this.throwError('Invalid unicode escape [\\u' + hex + ']');
          }
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          string = string + (rep || ch);
        }
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === quote) {
        this.index++;
        this.tokens.push({
          index: start,
          text: rawString,
          constant: true,
          value: string
        });
        return;
      } else {
        string += ch;
      }
      this.index++;
    }
    this.throwError('Unterminated quote', start);
  }
};

var AST = function AST(lexer, options) {
  this.lexer = lexer;
  this.options = options;
};

AST.Program = 'Program';
AST.ExpressionStatement = 'ExpressionStatement';
AST.AssignmentExpression = 'AssignmentExpression';
AST.ConditionalExpression = 'ConditionalExpression';
AST.LogicalExpression = 'LogicalExpression';
AST.BinaryExpression = 'BinaryExpression';
AST.UnaryExpression = 'UnaryExpression';
AST.CallExpression = 'CallExpression';
AST.MemberExpression = 'MemberExpression';
AST.Identifier = 'Identifier';
AST.Literal = 'Literal';
AST.ArrayExpression = 'ArrayExpression';
AST.Property = 'Property';
AST.ObjectExpression = 'ObjectExpression';
AST.ThisExpression = 'ThisExpression';
AST.LocalsExpression = 'LocalsExpression';

// Internal use only
AST.NGValueParameter = 'NGValueParameter';

AST.prototype = {
  ast: function(text) {
    this.text = text;
    this.tokens = this.lexer.lex(text);

    var value = this.program();

    if (this.tokens.length !== 0) {
      this.throwError('is an unexpected token', this.tokens[0]);
    }

    return value;
  },

  program: function() {
    var body = [];
    while (true) {
      if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
        body.push(this.expressionStatement());
      if (!this.expect(';')) {
        return { type: AST.Program, body: body};
      }
    }
  },

  expressionStatement: function() {
    return { type: AST.ExpressionStatement, expression: this.filterChain() };
  },

  filterChain: function() {
    var left = this.expression();
    while (this.expect('|')) {
      left = this.filter(left);
    }
    return left;
  },

  expression: function() {
    return this.assignment();
  },

  assignment: function() {
    var result = this.ternary();
    if (this.expect('=')) {
      if (!isAssignable(result)) {
        throw $parseMinErr('lval', 'Trying to assign a value to a non l-value');
      }

      result = { type: AST.AssignmentExpression, left: result, right: this.assignment(), operator: '='};
    }
    return result;
  },

  ternary: function() {
    var test = this.logicalOR();
    var alternate;
    var consequent;
    if (this.expect('?')) {
      alternate = this.expression();
      if (this.consume(':')) {
        consequent = this.expression();
        return { type: AST.ConditionalExpression, test: test, alternate: alternate, consequent: consequent};
      }
    }
    return test;
  },

  logicalOR: function() {
    var left = this.logicalAND();
    while (this.expect('||')) {
      left = { type: AST.LogicalExpression, operator: '||', left: left, right: this.logicalAND() };
    }
    return left;
  },

  logicalAND: function() {
    var left = this.equality();
    while (this.expect('&&')) {
      left = { type: AST.LogicalExpression, operator: '&&', left: left, right: this.equality()};
    }
    return left;
  },

  equality: function() {
    var left = this.relational();
    var token;
    while ((token = this.expect('==','!=','===','!=='))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.relational() };
    }
    return left;
  },

  relational: function() {
    var left = this.additive();
    var token;
    while ((token = this.expect('<', '>', '<=', '>='))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.additive() };
    }
    return left;
  },

  additive: function() {
    var left = this.multiplicative();
    var token;
    while ((token = this.expect('+','-'))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.multiplicative() };
    }
    return left;
  },

  multiplicative: function() {
    var left = this.unary();
    var token;
    while ((token = this.expect('*','/','%'))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.unary() };
    }
    return left;
  },

  unary: function() {
    var token;
    if ((token = this.expect('+', '-', '!'))) {
      return { type: AST.UnaryExpression, operator: token.text, prefix: true, argument: this.unary() };
    } else {
      return this.primary();
    }
  },

  primary: function() {
    var primary;
    if (this.expect('(')) {
      primary = this.filterChain();
      this.consume(')');
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration();
    } else if (this.expect('{')) {
      primary = this.object();
    } else if (this.selfReferential.hasOwnProperty(this.peek().text)) {
      primary = copy(this.selfReferential[this.consume().text]);
    } else if (this.options.literals.hasOwnProperty(this.peek().text)) {
      primary = { type: AST.Literal, value: this.options.literals[this.consume().text]};
    } else if (this.peek().identifier) {
      primary = this.identifier();
    } else if (this.peek().constant) {
      primary = this.constant();
    } else {
      this.throwError('not a primary expression', this.peek());
    }

    var next;
    while ((next = this.expect('(', '[', '.'))) {
      if (next.text === '(') {
        primary = {type: AST.CallExpression, callee: primary, arguments: this.parseArguments() };
        this.consume(')');
      } else if (next.text === '[') {
        primary = { type: AST.MemberExpression, object: primary, property: this.expression(), computed: true };
        this.consume(']');
      } else if (next.text === '.') {
        primary = { type: AST.MemberExpression, object: primary, property: this.identifier(), computed: false };
      } else {
        this.throwError('IMPOSSIBLE');
      }
    }
    return primary;
  },

  filter: function(baseExpression) {
    var args = [baseExpression];
    var result = {type: AST.CallExpression, callee: this.identifier(), arguments: args, filter: true};

    while (this.expect(':')) {
      args.push(this.expression());
    }

    return result;
  },

  parseArguments: function() {
    var args = [];
    if (this.peekToken().text !== ')') {
      do {
        args.push(this.filterChain());
      } while (this.expect(','));
    }
    return args;
  },

  identifier: function() {
    var token = this.consume();
    if (!token.identifier) {
      this.throwError('is not a valid identifier', token);
    }
    return { type: AST.Identifier, name: token.text };
  },

  constant: function() {
    // TODO check that it is a constant
    return { type: AST.Literal, value: this.consume().value };
  },

  arrayDeclaration: function() {
    var elements = [];
    if (this.peekToken().text !== ']') {
      do {
        if (this.peek(']')) {
          // Support trailing commas per ES5.1.
          break;
        }
        elements.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(']');

    return { type: AST.ArrayExpression, elements: elements };
  },

  object: function() {
    var properties = [], property;
    if (this.peekToken().text !== '}') {
      do {
        if (this.peek('}')) {
          // Support trailing commas per ES5.1.
          break;
        }
        property = {type: AST.Property, kind: 'init'};
        if (this.peek().constant) {
          property.key = this.constant();
          property.computed = false;
          this.consume(':');
          property.value = this.expression();
        } else if (this.peek().identifier) {
          property.key = this.identifier();
          property.computed = false;
          if (this.peek(':')) {
            this.consume(':');
            property.value = this.expression();
          } else {
            property.value = property.key;
          }
        } else if (this.peek('[')) {
          this.consume('[');
          property.key = this.expression();
          this.consume(']');
          property.computed = true;
          this.consume(':');
          property.value = this.expression();
        } else {
          this.throwError('invalid key', this.peek());
        }
        properties.push(property);
      } while (this.expect(','));
    }
    this.consume('}');

    return {type: AST.ObjectExpression, properties: properties };
  },

  throwError: function(msg, token) {
    throw $parseMinErr('syntax',
        'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',
          token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
  },

  consume: function(e1) {
    if (this.tokens.length === 0) {
      throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
    }

    var token = this.expect(e1);
    if (!token) {
      this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
    }
    return token;
  },

  peekToken: function() {
    if (this.tokens.length === 0) {
      throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
    }
    return this.tokens[0];
  },

  peek: function(e1, e2, e3, e4) {
    return this.peekAhead(0, e1, e2, e3, e4);
  },

  peekAhead: function(i, e1, e2, e3, e4) {
    if (this.tokens.length > i) {
      var token = this.tokens[i];
      var t = token.text;
      if (t === e1 || t === e2 || t === e3 || t === e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  },

  expect: function(e1, e2, e3, e4) {
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      this.tokens.shift();
      return token;
    }
    return false;
  },

  selfReferential: {
    'this': {type: AST.ThisExpression },
    '$locals': {type: AST.LocalsExpression }
  }
};

function ifDefined(v, d) {
  return typeof v !== 'undefined' ? v : d;
}

function plusFn(l, r) {
  if (typeof l === 'undefined') return r;
  if (typeof r === 'undefined') return l;
  return l + r;
}

function isStateless($filter, filterName) {
  var fn = $filter(filterName);
  return !fn.$stateful;
}

var PURITY_ABSOLUTE = 1;
var PURITY_RELATIVE = 2;

// Detect nodes which could depend on non-shallow state of objects
function isPure(node, parentIsPure) {
  switch (node.type) {
    // Computed members might invoke a stateful toString()
    case AST.MemberExpression:
      if (node.computed) {
        return false;
      }
      break;

    // Unary always convert to primative
    case AST.UnaryExpression:
      return PURITY_ABSOLUTE;

    // The binary + operator can invoke a stateful toString().
    case AST.BinaryExpression:
      return node.operator !== '+' ? PURITY_ABSOLUTE : false;

    // Functions / filters probably read state from within objects
    case AST.CallExpression:
      return false;
  }

  return (undefined === parentIsPure) ? PURITY_RELATIVE : parentIsPure;
}

function findConstantAndWatchExpressions(ast, $filter, parentIsPure) {
  var allConstants;
  var argsToWatch;
  var isStatelessFilter;

  var astIsPure = ast.isPure = isPure(ast, parentIsPure);

  switch (ast.type) {
  case AST.Program:
    allConstants = true;
    forEach(ast.body, function(expr) {
      findConstantAndWatchExpressions(expr.expression, $filter, astIsPure);
      allConstants = allConstants && expr.expression.constant;
    });
    ast.constant = allConstants;
    break;
  case AST.Literal:
    ast.constant = true;
    ast.toWatch = [];
    break;
  case AST.UnaryExpression:
    findConstantAndWatchExpressions(ast.argument, $filter, astIsPure);
    ast.constant = ast.argument.constant;
    ast.toWatch = ast.argument.toWatch;
    break;
  case AST.BinaryExpression:
    findConstantAndWatchExpressions(ast.left, $filter, astIsPure);
    findConstantAndWatchExpressions(ast.right, $filter, astIsPure);
    ast.constant = ast.left.constant && ast.right.constant;
    ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
    break;
  case AST.LogicalExpression:
    findConstantAndWatchExpressions(ast.left, $filter, astIsPure);
    findConstantAndWatchExpressions(ast.right, $filter, astIsPure);
    ast.constant = ast.left.constant && ast.right.constant;
    ast.toWatch = ast.constant ? [] : [ast];
    break;
  case AST.ConditionalExpression:
    findConstantAndWatchExpressions(ast.test, $filter, astIsPure);
    findConstantAndWatchExpressions(ast.alternate, $filter, astIsPure);
    findConstantAndWatchExpressions(ast.consequent, $filter, astIsPure);
    ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
    ast.toWatch = ast.constant ? [] : [ast];
    break;
  case AST.Identifier:
    ast.constant = false;
    ast.toWatch = [ast];
    break;
  case AST.MemberExpression:
    findConstantAndWatchExpressions(ast.object, $filter, astIsPure);
    if (ast.computed) {
      findConstantAndWatchExpressions(ast.property, $filter, astIsPure);
    }
    ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
    ast.toWatch = ast.constant ? [] : [ast];
    break;
  case AST.CallExpression:
    isStatelessFilter = ast.filter ? isStateless($filter, ast.callee.name) : false;
    allConstants = isStatelessFilter;
    argsToWatch = [];
    forEach(ast.arguments, function(expr) {
      findConstantAndWatchExpressions(expr, $filter, astIsPure);
      allConstants = allConstants && expr.constant;
      argsToWatch.push.apply(argsToWatch, expr.toWatch);
    });
    ast.constant = allConstants;
    ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
    break;
  case AST.AssignmentExpression:
    findConstantAndWatchExpressions(ast.left, $filter, astIsPure);
    findConstantAndWatchExpressions(ast.right, $filter, astIsPure);
    ast.constant = ast.left.constant && ast.right.constant;
    ast.toWatch = [ast];
    break;
  case AST.ArrayExpression:
    allConstants = true;
    argsToWatch = [];
    forEach(ast.elements, function(expr) {
      findConstantAndWatchExpressions(expr, $filter, astIsPure);
      allConstants = allConstants && expr.constant;
      argsToWatch.push.apply(argsToWatch, expr.toWatch);
    });
    ast.constant = allConstants;
    ast.toWatch = argsToWatch;
    break;
  case AST.ObjectExpression:
    allConstants = true;
    argsToWatch = [];
    forEach(ast.properties, function(property) {
      findConstantAndWatchExpressions(property.value, $filter, astIsPure);
      allConstants = allConstants && property.value.constant;
      argsToWatch.push.apply(argsToWatch, property.value.toWatch);
      if (property.computed) {
        //`{[key]: value}` implicitly does `key.toString()` which may be non-pure
        findConstantAndWatchExpressions(property.key, $filter, /*parentIsPure=*/false);
        allConstants = allConstants && property.key.constant;
        argsToWatch.push.apply(argsToWatch, property.key.toWatch);
      }
    });
    ast.constant = allConstants;
    ast.toWatch = argsToWatch;
    break;
  case AST.ThisExpression:
    ast.constant = false;
    ast.toWatch = [];
    break;
  case AST.LocalsExpression:
    ast.constant = false;
    ast.toWatch = [];
    break;
  }
}

function getInputs(body) {
  if (body.length !== 1) return;
  var lastExpression = body[0].expression;
  var candidate = lastExpression.toWatch;
  if (candidate.length !== 1) return candidate;
  return candidate[0] !== lastExpression ? candidate : undefined;
}

function isAssignable(ast) {
  return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
}

function assignableAST(ast) {
  if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
    return {type: AST.AssignmentExpression, left: ast.body[0].expression, right: {type: AST.NGValueParameter}, operator: '='};
  }
}

function isLiteral(ast) {
  return ast.body.length === 0 ||
      ast.body.length === 1 && (
      ast.body[0].expression.type === AST.Literal ||
      ast.body[0].expression.type === AST.ArrayExpression ||
      ast.body[0].expression.type === AST.ObjectExpression);
}

function isConstant(ast) {
  return ast.constant;
}

function ASTCompiler($filter) {
  this.$filter = $filter;
}

ASTCompiler.prototype = {
  compile: function(ast) {
    var self = this;
    this.state = {
      nextId: 0,
      filters: {},
      fn: {vars: [], body: [], own: {}},
      assign: {vars: [], body: [], own: {}},
      inputs: []
    };
    findConstantAndWatchExpressions(ast, self.$filter);
    var extra = '';
    var assignable;
    this.stage = 'assign';
    if ((assignable = assignableAST(ast))) {
      this.state.computing = 'assign';
      var result = this.nextId();
      this.recurse(assignable, result);
      this.return_(result);
      extra = 'fn.assign=' + this.generateFunction('assign', 's,v,l');
    }
    var toWatch = getInputs(ast.body);
    self.stage = 'inputs';
    forEach(toWatch, function(watch, key) {
      var fnKey = 'fn' + key;
      self.state[fnKey] = {vars: [], body: [], own: {}};
      self.state.computing = fnKey;
      var intoId = self.nextId();
      self.recurse(watch, intoId);
      self.return_(intoId);
      self.state.inputs.push({name: fnKey, isPure: watch.isPure});
      watch.watchId = key;
    });
    this.state.computing = 'fn';
    this.stage = 'main';
    this.recurse(ast);
    var fnString =
      // The build and minification steps remove the string "use strict" from the code, but this is done using a regex.
      // This is a workaround for this until we do a better job at only removing the prefix only when we should.
      '"' + this.USE + ' ' + this.STRICT + '";\n' +
      this.filterPrefix() +
      'var fn=' + this.generateFunction('fn', 's,l,a,i') +
      extra +
      this.watchFns() +
      'return fn;';

    // eslint-disable-next-line no-new-func
    var fn = (new Function('$filter',
        'getStringValue',
        'ifDefined',
        'plus',
        fnString))(
          this.$filter,
          getStringValue,
          ifDefined,
          plusFn);
    this.state = this.stage = undefined;
    return fn;
  },

  USE: 'use',

  STRICT: 'strict',

  watchFns: function() {
    var result = [];
    var inputs = this.state.inputs;
    var self = this;
    forEach(inputs, function(input) {
      result.push('var ' + input.name + '=' + self.generateFunction(input.name, 's'));
      if (input.isPure) {
        result.push(input.name, '.isPure=' + JSON.stringify(input.isPure) + ';');
      }
    });
    if (inputs.length) {
      result.push('fn.inputs=[' + inputs.map(function(i) { return i.name; }).join(',') + '];');
    }
    return result.join('');
  },

  generateFunction: function(name, params) {
    return 'function(' + params + '){' +
        this.varsPrefix(name) +
        this.body(name) +
        '};';
  },

  filterPrefix: function() {
    var parts = [];
    var self = this;
    forEach(this.state.filters, function(id, filter) {
      parts.push(id + '=$filter(' + self.escape(filter) + ')');
    });
    if (parts.length) return 'var ' + parts.join(',') + ';';
    return '';
  },

  varsPrefix: function(section) {
    return this.state[section].vars.length ? 'var ' + this.state[section].vars.join(',') + ';' : '';
  },

  body: function(section) {
    return this.state[section].body.join('');
  },

  recurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
    var left, right, self = this, args, expression, computed;
    recursionFn = recursionFn || noop;
    if (!skipWatchIdCheck && isDefined(ast.watchId)) {
      intoId = intoId || this.nextId();
      this.if_('i',
        this.lazyAssign(intoId, this.computedMember('i', ast.watchId)),
        this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true)
      );
      return;
    }
    switch (ast.type) {
    case AST.Program:
      forEach(ast.body, function(expression, pos) {
        self.recurse(expression.expression, undefined, undefined, function(expr) { right = expr; });
        if (pos !== ast.body.length - 1) {
          self.current().body.push(right, ';');
        } else {
          self.return_(right);
        }
      });
      break;
    case AST.Literal:
      expression = this.escape(ast.value);
      this.assign(intoId, expression);
      recursionFn(intoId || expression);
      break;
    case AST.UnaryExpression:
      this.recurse(ast.argument, undefined, undefined, function(expr) { right = expr; });
      expression = ast.operator + '(' + this.ifDefined(right, 0) + ')';
      this.assign(intoId, expression);
      recursionFn(expression);
      break;
    case AST.BinaryExpression:
      this.recurse(ast.left, undefined, undefined, function(expr) { left = expr; });
      this.recurse(ast.right, undefined, undefined, function(expr) { right = expr; });
      if (ast.operator === '+') {
        expression = this.plus(left, right);
      } else if (ast.operator === '-') {
        expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
      } else {
        expression = '(' + left + ')' + ast.operator + '(' + right + ')';
      }
      this.assign(intoId, expression);
      recursionFn(expression);
      break;
    case AST.LogicalExpression:
      intoId = intoId || this.nextId();
      self.recurse(ast.left, intoId);
      self.if_(ast.operator === '&&' ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
      recursionFn(intoId);
      break;
    case AST.ConditionalExpression:
      intoId = intoId || this.nextId();
      self.recurse(ast.test, intoId);
      self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
      recursionFn(intoId);
      break;
    case AST.Identifier:
      intoId = intoId || this.nextId();
      if (nameId) {
        nameId.context = self.stage === 'inputs' ? 's' : this.assign(this.nextId(), this.getHasOwnProperty('l', ast.name) + '?l:s');
        nameId.computed = false;
        nameId.name = ast.name;
      }
      self.if_(self.stage === 'inputs' || self.not(self.getHasOwnProperty('l', ast.name)),
        function() {
          self.if_(self.stage === 'inputs' || 's', function() {
            if (create && create !== 1) {
              self.if_(
                self.isNull(self.nonComputedMember('s', ast.name)),
                self.lazyAssign(self.nonComputedMember('s', ast.name), '{}'));
            }
            self.assign(intoId, self.nonComputedMember('s', ast.name));
          });
        }, intoId && self.lazyAssign(intoId, self.nonComputedMember('l', ast.name))
        );
      recursionFn(intoId);
      break;
    case AST.MemberExpression:
      left = nameId && (nameId.context = this.nextId()) || this.nextId();
      intoId = intoId || this.nextId();
      self.recurse(ast.object, left, undefined, function() {
        self.if_(self.notNull(left), function() {
          if (ast.computed) {
            right = self.nextId();
            self.recurse(ast.property, right);
            self.getStringValue(right);
            if (create && create !== 1) {
              self.if_(self.not(self.computedMember(left, right)), self.lazyAssign(self.computedMember(left, right), '{}'));
            }
            expression = self.computedMember(left, right);
            self.assign(intoId, expression);
            if (nameId) {
              nameId.computed = true;
              nameId.name = right;
            }
          } else {
            if (create && create !== 1) {
              self.if_(self.isNull(self.nonComputedMember(left, ast.property.name)), self.lazyAssign(self.nonComputedMember(left, ast.property.name), '{}'));
            }
            expression = self.nonComputedMember(left, ast.property.name);
            self.assign(intoId, expression);
            if (nameId) {
              nameId.computed = false;
              nameId.name = ast.property.name;
            }
          }
        }, function() {
          self.assign(intoId, 'undefined');
        });
        recursionFn(intoId);
      }, !!create);
      break;
    case AST.CallExpression:
      intoId = intoId || this.nextId();
      if (ast.filter) {
        right = self.filter(ast.callee.name);
        args = [];
        forEach(ast.arguments, function(expr) {
          var argument = self.nextId();
          self.recurse(expr, argument);
          args.push(argument);
        });
        expression = right + '(' + args.join(',') + ')';
        self.assign(intoId, expression);
        recursionFn(intoId);
      } else {
        right = self.nextId();
        left = {};
        args = [];
        self.recurse(ast.callee, right, left, function() {
          self.if_(self.notNull(right), function() {
            forEach(ast.arguments, function(expr) {
              self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function(argument) {
                args.push(argument);
              });
            });
            if (left.name) {
              expression = self.member(left.context, left.name, left.computed) + '(' + args.join(',') + ')';
            } else {
              expression = right + '(' + args.join(',') + ')';
            }
            self.assign(intoId, expression);
          }, function() {
            self.assign(intoId, 'undefined');
          });
          recursionFn(intoId);
        });
      }
      break;
    case AST.AssignmentExpression:
      right = this.nextId();
      left = {};
      this.recurse(ast.left, undefined, left, function() {
        self.if_(self.notNull(left.context), function() {
          self.recurse(ast.right, right);
          expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
          self.assign(intoId, expression);
          recursionFn(intoId || expression);
        });
      }, 1);
      break;
    case AST.ArrayExpression:
      args = [];
      forEach(ast.elements, function(expr) {
        self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function(argument) {
          args.push(argument);
        });
      });
      expression = '[' + args.join(',') + ']';
      this.assign(intoId, expression);
      recursionFn(intoId || expression);
      break;
    case AST.ObjectExpression:
      args = [];
      computed = false;
      forEach(ast.properties, function(property) {
        if (property.computed) {
          computed = true;
        }
      });
      if (computed) {
        intoId = intoId || this.nextId();
        this.assign(intoId, '{}');
        forEach(ast.properties, function(property) {
          if (property.computed) {
            left = self.nextId();
            self.recurse(property.key, left);
          } else {
            left = property.key.type === AST.Identifier ?
                       property.key.name :
                       ('' + property.key.value);
          }
          right = self.nextId();
          self.recurse(property.value, right);
          self.assign(self.member(intoId, left, property.computed), right);
        });
      } else {
        forEach(ast.properties, function(property) {
          self.recurse(property.value, ast.constant ? undefined : self.nextId(), undefined, function(expr) {
            args.push(self.escape(
                property.key.type === AST.Identifier ? property.key.name :
                  ('' + property.key.value)) +
                ':' + expr);
          });
        });
        expression = '{' + args.join(',') + '}';
        this.assign(intoId, expression);
      }
      recursionFn(intoId || expression);
      break;
    case AST.ThisExpression:
      this.assign(intoId, 's');
      recursionFn(intoId || 's');
      break;
    case AST.LocalsExpression:
      this.assign(intoId, 'l');
      recursionFn(intoId || 'l');
      break;
    case AST.NGValueParameter:
      this.assign(intoId, 'v');
      recursionFn(intoId || 'v');
      break;
    }
  },

  getHasOwnProperty: function(element, property) {
    var key = element + '.' + property;
    var own = this.current().own;
    if (!own.hasOwnProperty(key)) {
      own[key] = this.nextId(false, element + '&&(' + this.escape(property) + ' in ' + element + ')');
    }
    return own[key];
  },

  assign: function(id, value) {
    if (!id) return;
    this.current().body.push(id, '=', value, ';');
    return id;
  },

  filter: function(filterName) {
    if (!this.state.filters.hasOwnProperty(filterName)) {
      this.state.filters[filterName] = this.nextId(true);
    }
    return this.state.filters[filterName];
  },

  ifDefined: function(id, defaultValue) {
    return 'ifDefined(' + id + ',' + this.escape(defaultValue) + ')';
  },

  plus: function(left, right) {
    return 'plus(' + left + ',' + right + ')';
  },

  return_: function(id) {
    this.current().body.push('return ', id, ';');
  },

  if_: function(test, alternate, consequent) {
    if (test === true) {
      alternate();
    } else {
      var body = this.current().body;
      body.push('if(', test, '){');
      alternate();
      body.push('}');
      if (consequent) {
        body.push('else{');
        consequent();
        body.push('}');
      }
    }
  },

  not: function(expression) {
    return '!(' + expression + ')';
  },

  isNull: function(expression) {
    return expression + '==null';
  },

  notNull: function(expression) {
    return expression + '!=null';
  },

  nonComputedMember: function(left, right) {
    var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
    var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
    if (SAFE_IDENTIFIER.test(right)) {
      return left + '.' + right;
    } else {
      return left  + '["' + right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn) + '"]';
    }
  },

  computedMember: function(left, right) {
    return left + '[' + right + ']';
  },

  member: function(left, right, computed) {
    if (computed) return this.computedMember(left, right);
    return this.nonComputedMember(left, right);
  },

  getStringValue: function(item) {
    this.assign(item, 'getStringValue(' + item + ')');
  },

  lazyRecurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
    var self = this;
    return function() {
      self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
    };
  },

  lazyAssign: function(id, value) {
    var self = this;
    return function() {
      self.assign(id, value);
    };
  },

  stringEscapeRegex: /[^ a-zA-Z0-9]/g,

  stringEscapeFn: function(c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  },

  escape: function(value) {
    if (isString(value)) return '\'' + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + '\'';
    if (isNumber(value)) return value.toString();
    if (value === true) return 'true';
    if (value === false) return 'false';
    if (value === null) return 'null';
    if (typeof value === 'undefined') return 'undefined';

    throw $parseMinErr('esc', 'IMPOSSIBLE');
  },

  nextId: function(skip, init) {
    var id = 'v' + (this.state.nextId++);
    if (!skip) {
      this.current().vars.push(id + (init ? '=' + init : ''));
    }
    return id;
  },

  current: function() {
    return this.state[this.state.computing];
  }
};


function ASTInterpreter($filter) {
  this.$filter = $filter;
}

ASTInterpreter.prototype = {
  compile: function(ast) {
    var self = this;
    findConstantAndWatchExpressions(ast, self.$filter);
    var assignable;
    var assign;
    if ((assignable = assignableAST(ast))) {
      assign = this.recurse(assignable);
    }
    var toWatch = getInputs(ast.body);
    var inputs;
    if (toWatch) {
      inputs = [];
      forEach(toWatch, function(watch, key) {
        var input = self.recurse(watch);
        input.isPure = watch.isPure;
        watch.input = input;
        inputs.push(input);
        watch.watchId = key;
      });
    }
    var expressions = [];
    forEach(ast.body, function(expression) {
      expressions.push(self.recurse(expression.expression));
    });
    var fn = ast.body.length === 0 ? noop :
             ast.body.length === 1 ? expressions[0] :
             function(scope, locals) {
               var lastValue;
               forEach(expressions, function(exp) {
                 lastValue = exp(scope, locals);
               });
               return lastValue;
             };
    if (assign) {
      fn.assign = function(scope, value, locals) {
        return assign(scope, locals, value);
      };
    }
    if (inputs) {
      fn.inputs = inputs;
    }
    return fn;
  },

  recurse: function(ast, context, create) {
    var left, right, self = this, args;
    if (ast.input) {
      return this.inputs(ast.input, ast.watchId);
    }
    switch (ast.type) {
    case AST.Literal:
      return this.value(ast.value, context);
    case AST.UnaryExpression:
      right = this.recurse(ast.argument);
      return this['unary' + ast.operator](right, context);
    case AST.BinaryExpression:
      left = this.recurse(ast.left);
      right = this.recurse(ast.right);
      return this['binary' + ast.operator](left, right, context);
    case AST.LogicalExpression:
      left = this.recurse(ast.left);
      right = this.recurse(ast.right);
      return this['binary' + ast.operator](left, right, context);
    case AST.ConditionalExpression:
      return this['ternary?:'](
        this.recurse(ast.test),
        this.recurse(ast.alternate),
        this.recurse(ast.consequent),
        context
      );
    case AST.Identifier:
      return self.identifier(ast.name, context, create);
    case AST.MemberExpression:
      left = this.recurse(ast.object, false, !!create);
      if (!ast.computed) {
        right = ast.property.name;
      }
      if (ast.computed) right = this.recurse(ast.property);
      return ast.computed ?
        this.computedMember(left, right, context, create) :
        this.nonComputedMember(left, right, context, create);
    case AST.CallExpression:
      args = [];
      forEach(ast.arguments, function(expr) {
        args.push(self.recurse(expr));
      });
      if (ast.filter) right = this.$filter(ast.callee.name);
      if (!ast.filter) right = this.recurse(ast.callee, true);
      return ast.filter ?
        function(scope, locals, assign, inputs) {
          var values = [];
          for (var i = 0; i < args.length; ++i) {
            values.push(args[i](scope, locals, assign, inputs));
          }
          var value = right.apply(undefined, values, inputs);
          return context ? {context: undefined, name: undefined, value: value} : value;
        } :
        function(scope, locals, assign, inputs) {
          var rhs = right(scope, locals, assign, inputs);
          var value;
          if (rhs.value != null) {
            var values = [];
            for (var i = 0; i < args.length; ++i) {
              values.push(args[i](scope, locals, assign, inputs));
            }
            value = rhs.value.apply(rhs.context, values);
          }
          return context ? {value: value} : value;
        };
    case AST.AssignmentExpression:
      left = this.recurse(ast.left, true, 1);
      right = this.recurse(ast.right);
      return function(scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs = right(scope, locals, assign, inputs);
        lhs.context[lhs.name] = rhs;
        return context ? {value: rhs} : rhs;
      };
    case AST.ArrayExpression:
      args = [];
      forEach(ast.elements, function(expr) {
        args.push(self.recurse(expr));
      });
      return function(scope, locals, assign, inputs) {
        var value = [];
        for (var i = 0; i < args.length; ++i) {
          value.push(args[i](scope, locals, assign, inputs));
        }
        return context ? {value: value} : value;
      };
    case AST.ObjectExpression:
      args = [];
      forEach(ast.properties, function(property) {
        if (property.computed) {
          args.push({key: self.recurse(property.key),
                     computed: true,
                     value: self.recurse(property.value)
          });
        } else {
          args.push({key: property.key.type === AST.Identifier ?
                          property.key.name :
                          ('' + property.key.value),
                     computed: false,
                     value: self.recurse(property.value)
          });
        }
      });
      return function(scope, locals, assign, inputs) {
        var value = {};
        for (var i = 0; i < args.length; ++i) {
          if (args[i].computed) {
            value[args[i].key(scope, locals, assign, inputs)] = args[i].value(scope, locals, assign, inputs);
          } else {
            value[args[i].key] = args[i].value(scope, locals, assign, inputs);
          }
        }
        return context ? {value: value} : value;
      };
    case AST.ThisExpression:
      return function(scope) {
        return context ? {value: scope} : scope;
      };
    case AST.LocalsExpression:
      return function(scope, locals) {
        return context ? {value: locals} : locals;
      };
    case AST.NGValueParameter:
      return function(scope, locals, assign) {
        return context ? {value: assign} : assign;
      };
    }
  },

  'unary+': function(argument, context) {
    return function(scope, locals, assign, inputs) {
      var arg = argument(scope, locals, assign, inputs);
      if (isDefined(arg)) {
        arg = +arg;
      } else {
        arg = 0;
      }
      return context ? {value: arg} : arg;
    };
  },
  'unary-': function(argument, context) {
    return function(scope, locals, assign, inputs) {
      var arg = argument(scope, locals, assign, inputs);
      if (isDefined(arg)) {
        arg = -arg;
      } else {
        arg = -0;
      }
      return context ? {value: arg} : arg;
    };
  },
  'unary!': function(argument, context) {
    return function(scope, locals, assign, inputs) {
      var arg = !argument(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary+': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      var rhs = right(scope, locals, assign, inputs);
      var arg = plusFn(lhs, rhs);
      return context ? {value: arg} : arg;
    };
  },
  'binary-': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      var rhs = right(scope, locals, assign, inputs);
      var arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
      return context ? {value: arg} : arg;
    };
  },
  'binary*': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) * right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary/': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) / right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary%': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) % right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary===': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) === right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary!==': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) !== right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary==': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      // eslint-disable-next-line eqeqeq
      var arg = left(scope, locals, assign, inputs) == right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary!=': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      // eslint-disable-next-line eqeqeq
      var arg = left(scope, locals, assign, inputs) != right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary<': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) < right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary>': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) > right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary<=': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) <= right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary>=': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) >= right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary&&': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) && right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary||': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) || right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'ternary?:': function(test, alternate, consequent, context) {
    return function(scope, locals, assign, inputs) {
      var arg = test(scope, locals, assign, inputs) ? alternate(scope, locals, assign, inputs) : consequent(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  value: function(value, context) {
    return function() { return context ? {context: undefined, name: undefined, value: value} : value; };
  },
  identifier: function(name, context, create) {
    return function(scope, locals, assign, inputs) {
      var base = locals && (name in locals) ? locals : scope;
      if (create && create !== 1 && base && base[name] == null) {
        base[name] = {};
      }
      var value = base ? base[name] : undefined;
      if (context) {
        return {context: base, name: name, value: value};
      } else {
        return value;
      }
    };
  },
  computedMember: function(left, right, context, create) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      var rhs;
      var value;
      if (lhs != null) {
        rhs = right(scope, locals, assign, inputs);
        rhs = getStringValue(rhs);
        if (create && create !== 1) {
          if (lhs && !(lhs[rhs])) {
            lhs[rhs] = {};
          }
        }
        value = lhs[rhs];
      }
      if (context) {
        return {context: lhs, name: rhs, value: value};
      } else {
        return value;
      }
    };
  },
  nonComputedMember: function(left, right, context, create) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      if (create && create !== 1) {
        if (lhs && lhs[right] == null) {
          lhs[right] = {};
        }
      }
      var value = lhs != null ? lhs[right] : undefined;
      if (context) {
        return {context: lhs, name: right, value: value};
      } else {
        return value;
      }
    };
  },
  inputs: function(input, watchId) {
    return function(scope, value, locals, inputs) {
      if (inputs) return inputs[watchId];
      return input(scope, value, locals);
    };
  }
};

/**
 * @constructor
 */
function Parser(lexer, $filter, options) {
  this.ast = new AST(lexer, options);
  this.astCompiler = options.csp ? new ASTInterpreter($filter) :
                                   new ASTCompiler($filter);
}

Parser.prototype = {
  constructor: Parser,

  parse: function(text) {
    var ast = this.getAst(text);
    var fn = this.astCompiler.compile(ast.ast);
    fn.literal = isLiteral(ast.ast);
    fn.constant = isConstant(ast.ast);
    fn.oneTime = ast.oneTime;
    return fn;
  },

  getAst: function(exp) {
    var oneTime = false;
    exp = exp.trim();

    if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
      oneTime = true;
      exp = exp.substring(2);
    }
    return {
      ast: this.ast.ast(exp),
      oneTime: oneTime
    };
  }
};

function getValueOf(value) {
  return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
}

///////////////////////////////////

/**
 * @ngdoc service
 * @name $parse
 * @kind function
 *
 * @description
 *
 * Converts AngularJS {@link guide/expression expression} into a function.
 *
 * ```js
 *   var getter = $parse('user.name');
 *   var setter = getter.assign;
 *   var context = {user:{name:'AngularJS'}};
 *   var locals = {user:{name:'local'}};
 *
 *   expect(getter(context)).toEqual('AngularJS');
 *   setter(context, 'newValue');
 *   expect(context.user.name).toEqual('newValue');
 *   expect(getter(context, locals)).toEqual('local');
 * ```
 *
 *
 * @param {string} expression String expression to compile.
 * @returns {function(context, locals)} a function which represents the compiled expression:
 *
 *    * `context` – `{object}` – an object against which any expressions embedded in the strings
 *      are evaluated against (typically a scope object).
 *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
 *      `context`.
 *
 *    The returned function also has the following properties:
 *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
 *        literal.
 *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
 *        constant literals.
 *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
 *        set to a function to change its value on the given context.
 *
 */


/**
 * @ngdoc provider
 * @name $parseProvider
 * @this
 *
 * @description
 * `$parseProvider` can be used for configuring the default behavior of the {@link ng.$parse $parse}
 *  service.
 */
function $ParseProvider() {
  var cache = createMap();
  var literals = {
    'true': true,
    'false': false,
    'null': null,
    'undefined': undefined
  };
  var identStart, identContinue;

  /**
   * @ngdoc method
   * @name $parseProvider#addLiteral
   * @description
   *
   * Configure $parse service to add literal values that will be present as literal at expressions.
   *
   * @param {string} literalName Token for the literal value. The literal name value must be a valid literal name.
   * @param {*} literalValue Value for this literal. All literal values must be primitives or `undefined`.
   *
   **/
  this.addLiteral = function(literalName, literalValue) {
    literals[literalName] = literalValue;
  };

 /**
  * @ngdoc method
  * @name $parseProvider#setIdentifierFns
  *
  * @description
  *
  * Allows defining the set of characters that are allowed in AngularJS expressions. The function
  * `identifierStart` will get called to know if a given character is a valid character to be the
  * first character for an identifier. The function `identifierContinue` will get called to know if
  * a given character is a valid character to be a follow-up identifier character. The functions
  * `identifierStart` and `identifierContinue` will receive as arguments the single character to be
  * identifier and the character code point. These arguments will be `string` and `numeric`. Keep in
  * mind that the `string` parameter can be two characters long depending on the character
  * representation. It is expected for the function to return `true` or `false`, whether that
  * character is allowed or not.
  *
  * Since this function will be called extensively, keep the implementation of these functions fast,
  * as the performance of these functions have a direct impact on the expressions parsing speed.
  *
  * @param {function=} identifierStart The function that will decide whether the given character is
  *   a valid identifier start character.
  * @param {function=} identifierContinue The function that will decide whether the given character is
  *   a valid identifier continue character.
  */
  this.setIdentifierFns = function(identifierStart, identifierContinue) {
    identStart = identifierStart;
    identContinue = identifierContinue;
    return this;
  };

  this.$get = ['$filter', function($filter) {
    var noUnsafeEval = csp().noUnsafeEval;
    var $parseOptions = {
          csp: noUnsafeEval,
          literals: copy(literals),
          isIdentifierStart: isFunction(identStart) && identStart,
          isIdentifierContinue: isFunction(identContinue) && identContinue
        };
    $parse.$$getAst = $$getAst;
    return $parse;

    function $parse(exp, interceptorFn) {
      var parsedExpression, cacheKey;

      switch (typeof exp) {
        case 'string':
          exp = exp.trim();
          cacheKey = exp;

          parsedExpression = cache[cacheKey];

          if (!parsedExpression) {
            var lexer = new Lexer($parseOptions);
            var parser = new Parser(lexer, $filter, $parseOptions);
            parsedExpression = parser.parse(exp);

            cache[cacheKey] = addWatchDelegate(parsedExpression);
          }
          return addInterceptor(parsedExpression, interceptorFn);

        case 'function':
          return addInterceptor(exp, interceptorFn);

        default:
          return addInterceptor(noop, interceptorFn);
      }
    }

    function $$getAst(exp) {
      var lexer = new Lexer($parseOptions);
      var parser = new Parser(lexer, $filter, $parseOptions);
      return parser.getAst(exp).ast;
    }

    function expressionInputDirtyCheck(newValue, oldValueOfValue, compareObjectIdentity) {

      if (newValue == null || oldValueOfValue == null) { // null/undefined
        return newValue === oldValueOfValue;
      }

      if (typeof newValue === 'object') {

        // attempt to convert the value to a primitive type
        // TODO(docs): add a note to docs that by implementing valueOf even objects and arrays can
        //             be cheaply dirty-checked
        newValue = getValueOf(newValue);

        if (typeof newValue === 'object' && !compareObjectIdentity) {
          // objects/arrays are not supported - deep-watching them would be too expensive
          return false;
        }

        // fall-through to the primitive equality check
      }

      //Primitive or NaN
      // eslint-disable-next-line no-self-compare
      return newValue === oldValueOfValue || (newValue !== newValue && oldValueOfValue !== oldValueOfValue);
    }

    function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
      var inputExpressions = parsedExpression.inputs;
      var lastResult;

      if (inputExpressions.length === 1) {
        var oldInputValueOf = expressionInputDirtyCheck; // init to something unique so that equals check fails
        inputExpressions = inputExpressions[0];
        return scope.$watch(function expressionInputWatch(scope) {
          var newInputValue = inputExpressions(scope);
          if (!expressionInputDirtyCheck(newInputValue, oldInputValueOf, inputExpressions.isPure)) {
            lastResult = parsedExpression(scope, undefined, undefined, [newInputValue]);
            oldInputValueOf = newInputValue && getValueOf(newInputValue);
          }
          return lastResult;
        }, listener, objectEquality, prettyPrintExpression);
      }

      var oldInputValueOfValues = [];
      var oldInputValues = [];
      for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
        oldInputValueOfValues[i] = expressionInputDirtyCheck; // init to something unique so that equals check fails
        oldInputValues[i] = null;
      }

      return scope.$watch(function expressionInputsWatch(scope) {
        var changed = false;

        for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
          var newInputValue = inputExpressions[i](scope);
          if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i], inputExpressions[i].isPure))) {
            oldInputValues[i] = newInputValue;
            oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue);
          }
        }

        if (changed) {
          lastResult = parsedExpression(scope, undefined, undefined, oldInputValues);
        }

        return lastResult;
      }, listener, objectEquality, prettyPrintExpression);
    }

    function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
      var isDone = parsedExpression.literal ? isAllDefined : isDefined;
      var unwatch, lastValue;

      var exp = parsedExpression.$$intercepted || parsedExpression;
      var post = parsedExpression.$$interceptor || identity;

      var useInputs = parsedExpression.inputs && !exp.inputs;

      // Propogate the literal/inputs/constant attributes
      // ... but not oneTime since we are handling it
      oneTimeWatch.literal = parsedExpression.literal;
      oneTimeWatch.constant = parsedExpression.constant;
      oneTimeWatch.inputs = parsedExpression.inputs;

      // Allow other delegates to run on this wrapped expression
      addWatchDelegate(oneTimeWatch);

      unwatch = scope.$watch(oneTimeWatch, listener, objectEquality, prettyPrintExpression);

      return unwatch;

      function unwatchIfDone() {
        if (isDone(lastValue)) {
          unwatch();
        }
      }

      function oneTimeWatch(scope, locals, assign, inputs) {
        lastValue = useInputs && inputs ? inputs[0] : exp(scope, locals, assign, inputs);
        if (isDone(lastValue)) {
          scope.$$postDigest(unwatchIfDone);
        }
        return post(lastValue);
      }
    }

    function isAllDefined(value) {
      var allDefined = true;
      forEach(value, function(val) {
        if (!isDefined(val)) allDefined = false;
      });
      return allDefined;
    }

    function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
      var unwatch = scope.$watch(function constantWatch(scope) {
        unwatch();
        return parsedExpression(scope);
      }, listener, objectEquality);
      return unwatch;
    }

    function addWatchDelegate(parsedExpression) {
      if (parsedExpression.constant) {
        parsedExpression.$$watchDelegate = constantWatchDelegate;
      } else if (parsedExpression.oneTime) {
        parsedExpression.$$watchDelegate = oneTimeWatchDelegate;
      } else if (parsedExpression.inputs) {
        parsedExpression.$$watchDelegate = inputsWatchDelegate;
      }

      return parsedExpression;
    }

    function chainInterceptors(first, second) {
      function chainedInterceptor(value) {
        return second(first(value));
      }
      chainedInterceptor.$stateful = first.$stateful || second.$stateful;
      chainedInterceptor.$$pure = first.$$pure && second.$$pure;

      return chainedInterceptor;
    }

    function addInterceptor(parsedExpression, interceptorFn) {
      if (!interceptorFn) return parsedExpression;

      // Extract any existing interceptors out of the parsedExpression
      // to ensure the original parsedExpression is always the $$intercepted
      if (parsedExpression.$$interceptor) {
        interceptorFn = chainInterceptors(parsedExpression.$$interceptor, interceptorFn);
        parsedExpression = parsedExpression.$$intercepted;
      }

      var useInputs = false;

      var fn = function interceptedExpression(scope, locals, assign, inputs) {
        var value = useInputs && inputs ? inputs[0] : parsedExpression(scope, locals, assign, inputs);
        return interceptorFn(value);
      };

      // Maintain references to the interceptor/intercepted
      fn.$$intercepted = parsedExpression;
      fn.$$interceptor = interceptorFn;

      // Propogate the literal/oneTime/constant attributes
      fn.literal = parsedExpression.literal;
      fn.oneTime = parsedExpression.oneTime;
      fn.constant = parsedExpression.constant;

      // Treat the interceptor like filters.
      // If it is not $stateful then only watch its inputs.
      // If the expression itself has no inputs then use the full expression as an input.
      if (!interceptorFn.$stateful) {
        useInputs = !parsedExpression.inputs;
        fn.inputs = parsedExpression.inputs ? parsedExpression.inputs : [parsedExpression];

        if (!interceptorFn.$$pure) {
          fn.inputs = fn.inputs.map(function(e) {
              // Remove the isPure flag of inputs when it is not absolute because they are now wrapped in a
              // non-pure interceptor function.
              if (e.isPure === PURITY_RELATIVE) {
                return function depurifier(s) { return e(s); };
              }
              return e;
            });
        }
      }

      return addWatchDelegate(fn);
    }
  }];
}

/**
 * @ngdoc service
 * @name $q
 * @requires $rootScope
 *
 * @description
 * A service that helps you run functions asynchronously, and use their return values (or exceptions)
 * when they are done processing.
 *
 * This is a [Promises/A+](https://promisesaplus.com/)-compliant implementation of promises/deferred
 * objects inspired by [Kris Kowal's Q](https://github.com/kriskowal/q).
 *
 * $q can be used in two fashions --- one which is more similar to Kris Kowal's Q or jQuery's Deferred
 * implementations, and the other which resembles ES6 (ES2015) promises to some degree.
 *
 * ## $q constructor
 *
 * The streamlined ES6 style promise is essentially just using $q as a constructor which takes a `resolver`
 * function as the first argument. This is similar to the native Promise implementation from ES6,
 * see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 *
 * While the constructor-style use is supported, not all of the supporting methods from ES6 promises are
 * available yet.
 *
 * It can be used like so:
 *
 * ```js
 *   // for the purpose of this example let's assume that variables `$q` and `okToGreet`
 *   // are available in the current lexical scope (they could have been injected or passed in).
 *
 *   function asyncGreet(name) {
 *     // perform some asynchronous operation, resolve or reject the promise when appropriate.
 *     return $q(function(resolve, reject) {
 *       setTimeout(function() {
 *         if (okToGreet(name)) {
 *           resolve('Hello, ' + name + '!');
 *         } else {
 *           reject('Greeting ' + name + ' is not allowed.');
 *         }
 *       }, 1000);
 *     });
 *   }
 *
 *   var promise = asyncGreet('Robin Hood');
 *   promise.then(function(greeting) {
 *     alert('Success: ' + greeting);
 *   }, function(reason) {
 *     alert('Failed: ' + reason);
 *   });
 * ```
 *
 * Note: progress/notify callbacks are not currently supported via the ES6-style interface.
 *
 * Note: unlike ES6 behavior, an exception thrown in the constructor function will NOT implicitly reject the promise.
 *
 * However, the more traditional CommonJS-style usage is still available, and documented below.
 *
 * [The CommonJS Promise proposal](http://wiki.commonjs.org/wiki/Promises) describes a promise as an
 * interface for interacting with an object that represents the result of an action that is
 * performed asynchronously, and may or may not be finished at any given point in time.
 *
 * From the perspective of dealing with error handling, deferred and promise APIs are to
 * asynchronous programming what `try`, `catch` and `throw` keywords are to synchronous programming.
 *
 * ```js
 *   // for the purpose of this example let's assume that variables `$q` and `okToGreet`
 *   // are available in the current lexical scope (they could have been injected or passed in).
 *
 *   function asyncGreet(name) {
 *     var deferred = $q.defer();
 *
 *     setTimeout(function() {
 *       deferred.notify('About to greet ' + name + '.');
 *
 *       if (okToGreet(name)) {
 *         deferred.resolve('Hello, ' + name + '!');
 *       } else {
 *         deferred.reject('Greeting ' + name + ' is not allowed.');
 *       }
 *     }, 1000);
 *
 *     return deferred.promise;
 *   }
 *
 *   var promise = asyncGreet('Robin Hood');
 *   promise.then(function(greeting) {
 *     alert('Success: ' + greeting);
 *   }, function(reason) {
 *     alert('Failed: ' + reason);
 *   }, function(update) {
 *     alert('Got notification: ' + update);
 *   });
 * ```
 *
 * At first it might not be obvious why this extra complexity is worth the trouble. The payoff
 * comes in the way of guarantees that promise and deferred APIs make, see
 * https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md.
 *
 * Additionally the promise api allows for composition that is very hard to do with the
 * traditional callback ([CPS](http://en.wikipedia.org/wiki/Continuation-passing_style)) approach.
 * For more on this please see the [Q documentation](https://github.com/kriskowal/q) especially the
 * section on serial or parallel joining of promises.
 *
 * ## The Deferred API
 *
 * A new instance of deferred is constructed by calling `$q.defer()`.
 *
 * The purpose of the deferred object is to expose the associated Promise instance as well as APIs
 * that can be used for signaling the successful or unsuccessful completion, as well as the status
 * of the task.
 *
 * **Methods**
 *
 * - `resolve(value)` – resolves the derived promise with the `value`. If the value is a rejection
 *   constructed via `$q.reject`, the promise will be rejected instead.
 * - `reject(reason)` – rejects the derived promise with the `reason`. This is equivalent to
 *   resolving it with a rejection constructed via `$q.reject`.
 * - `notify(value)` - provides updates on the status of the promise's execution. This may be called
 *   multiple times before the promise is either resolved or rejected.
 *
 * **Properties**
 *
 * - promise – `{Promise}` – promise object associated with this deferred.
 *
 *
 * ## The Promise API
 *
 * A new promise instance is created when a deferred instance is created and can be retrieved by
 * calling `deferred.promise`.
 *
 * The purpose of the promise object is to allow for interested parties to get access to the result
 * of the deferred task when it completes.
 *
 * **Methods**
 *
 * - `then(successCallback, [errorCallback], [notifyCallback])` – regardless of when the promise was or
 *   will be resolved or rejected, `then` calls one of the success or error callbacks asynchronously
 *   as soon as the result is available. The callbacks are called with a single argument: the result
 *   or rejection reason. Additionally, the notify callback may be called zero or more times to
 *   provide a progress indication, before the promise is resolved or rejected.
 *
 *   This method *returns a new promise* which is resolved or rejected via the return value of the
 *   `successCallback`, `errorCallback` (unless that value is a promise, in which case it is resolved
 *   with the value which is resolved in that promise using
 *   [promise chaining](http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promises-queues)).
 *   It also notifies via the return value of the `notifyCallback` method. The promise cannot be
 *   resolved or rejected from the notifyCallback method. The errorCallback and notifyCallback
 *   arguments are optional.
 *
 * - `catch(errorCallback)` – shorthand for `promise.then(null, errorCallback)`
 *
 * - `finally(callback, notifyCallback)` – allows you to observe either the fulfillment or rejection of a promise,
 *   but to do so without modifying the final value. This is useful to release resources or do some
 *   clean-up that needs to be done whether the promise was rejected or resolved. See the [full
 *   specification](https://github.com/kriskowal/q/wiki/API-Reference#promisefinallycallback) for
 *   more information.
 *
 * ## Chaining promises
 *
 * Because calling the `then` method of a promise returns a new derived promise, it is easily
 * possible to create a chain of promises:
 *
 * ```js
 *   promiseB = promiseA.then(function(result) {
 *     return result + 1;
 *   });
 *
 *   // promiseB will be resolved immediately after promiseA is resolved and its value
 *   // will be the result of promiseA incremented by 1
 * ```
 *
 * It is possible to create chains of any length and since a promise can be resolved with another
 * promise (which will defer its resolution further), it is possible to pause/defer resolution of
 * the promises at any point in the chain. This makes it possible to implement powerful APIs like
 * $http's response interceptors.
 *
 *
 * ## Differences between Kris Kowal's Q and $q
 *
 *  There are two main differences:
 *
 * - $q is integrated with the {@link ng.$rootScope.Scope} Scope model observation
 *   mechanism in AngularJS, which means faster propagation of resolution or rejection into your
 *   models and avoiding unnecessary browser repaints, which would result in flickering UI.
 * - Q has many more features than $q, but that comes at a cost of bytes. $q is tiny, but contains
 *   all the important functionality needed for common async tasks.
 *
 * ## Testing
 *
 *  ```js
 *    it('should simulate promise', inject(function($q, $rootScope) {
 *      var deferred = $q.defer();
 *      var promise = deferred.promise;
 *      var resolvedValue;
 *
 *      promise.then(function(value) { resolvedValue = value; });
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Simulate resolving of promise
 *      deferred.resolve(123);
 *      // Note that the 'then' function does not get called synchronously.
 *      // This is because we want the promise API to always be async, whether or not
 *      // it got called synchronously or asynchronously.
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Propagate promise resolution to 'then' functions using $apply().
 *      $rootScope.$apply();
 *      expect(resolvedValue).toEqual(123);
 *    }));
 *  ```
 *
 * @param {function(function, function)} resolver Function which is responsible for resolving or
 *   rejecting the newly created promise. The first parameter is a function which resolves the
 *   promise, the second parameter is a function which rejects the promise.
 *
 * @returns {Promise} The newly created promise.
 */
/**
 * @ngdoc provider
 * @name $qProvider
 * @this
 *
 * @description
 */
function $QProvider() {
  var errorOnUnhandledRejections = true;
  this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
    return qFactory(function(callback) {
      $rootScope.$evalAsync(callback);
    }, $exceptionHandler, errorOnUnhandledRejections);
  }];

  /**
   * @ngdoc method
   * @name $qProvider#errorOnUnhandledRejections
   * @kind function
   *
   * @description
   * Retrieves or overrides whether to generate an error when a rejected promise is not handled.
   * This feature is enabled by default.
   *
   * @param {boolean=} value Whether to generate an error when a rejected promise is not handled.
   * @returns {boolean|ng.$qProvider} Current value when called without a new value or self for
   *    chaining otherwise.
   */
  this.errorOnUnhandledRejections = function(value) {
    if (isDefined(value)) {
      errorOnUnhandledRejections = value;
      return this;
    } else {
      return errorOnUnhandledRejections;
    }
  };
}

/** @this */
function $$QProvider() {
  var errorOnUnhandledRejections = true;
  this.$get = ['$browser', '$exceptionHandler', function($browser, $exceptionHandler) {
    return qFactory(function(callback) {
      $browser.defer(callback);
    }, $exceptionHandler, errorOnUnhandledRejections);
  }];

  this.errorOnUnhandledRejections = function(value) {
    if (isDefined(value)) {
      errorOnUnhandledRejections = value;
      return this;
    } else {
      return errorOnUnhandledRejections;
    }
  };
}

/**
 * Constructs a promise manager.
 *
 * @param {function(function)} nextTick Function for executing functions in the next turn.
 * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
 *     debugging purposes.
 * @param {boolean=} errorOnUnhandledRejections Whether an error should be generated on unhandled
 *     promises rejections.
 * @returns {object} Promise manager.
 */
function qFactory(nextTick, exceptionHandler, errorOnUnhandledRejections) {
  var $qMinErr = minErr('$q', TypeError);
  var queueSize = 0;
  var checkQueue = [];

  /**
   * @ngdoc method
   * @name ng.$q#defer
   * @kind function
   *
   * @description
   * Creates a `Deferred` object which represents a task which will finish in the future.
   *
   * @returns {Deferred} Returns a new instance of deferred.
   */
  function defer() {
    return new Deferred();
  }

  function Deferred() {
    var promise = this.promise = new Promise();
    //Non prototype methods necessary to support unbound execution :/
    this.resolve = function(val) { resolvePromise(promise, val); };
    this.reject = function(reason) { rejectPromise(promise, reason); };
    this.notify = function(progress) { notifyPromise(promise, progress); };
  }


  function Promise() {
    this.$$state = { status: 0 };
  }

  extend(Promise.prototype, {
    then: function(onFulfilled, onRejected, progressBack) {
      if (isUndefined(onFulfilled) && isUndefined(onRejected) && isUndefined(progressBack)) {
        return this;
      }
      var result = new Promise();

      this.$$state.pending = this.$$state.pending || [];
      this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
      if (this.$$state.status > 0) scheduleProcessQueue(this.$$state);

      return result;
    },

    'catch': function(callback) {
      return this.then(null, callback);
    },

    'finally': function(callback, progressBack) {
      return this.then(function(value) {
        return handleCallback(value, resolve, callback);
      }, function(error) {
        return handleCallback(error, reject, callback);
      }, progressBack);
    }
  });

  function processQueue(state) {
    var fn, promise, pending;

    pending = state.pending;
    state.processScheduled = false;
    state.pending = undefined;
    try {
      for (var i = 0, ii = pending.length; i < ii; ++i) {
        markQStateExceptionHandled(state);
        promise = pending[i][0];
        fn = pending[i][state.status];
        try {
          if (isFunction(fn)) {
            resolvePromise(promise, fn(state.value));
          } else if (state.status === 1) {
            resolvePromise(promise, state.value);
          } else {
            rejectPromise(promise, state.value);
          }
        } catch (e) {
          rejectPromise(promise, e);
          // This error is explicitly marked for being passed to the $exceptionHandler
          if (e && e.$$passToExceptionHandler === true) {
            exceptionHandler(e);
          }
        }
      }
    } finally {
      --queueSize;
      if (errorOnUnhandledRejections && queueSize === 0) {
        nextTick(processChecks);
      }
    }
  }

  function processChecks() {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!queueSize && checkQueue.length) {
      var toCheck = checkQueue.shift();
      if (!isStateExceptionHandled(toCheck)) {
        markQStateExceptionHandled(toCheck);
        var errorMessage = 'Possibly unhandled rejection: ' + toDebugString(toCheck.value);
        if (isError(toCheck.value)) {
          exceptionHandler(toCheck.value, errorMessage);
        } else {
          exceptionHandler(errorMessage);
        }
      }
    }
  }

  function scheduleProcessQueue(state) {
    if (errorOnUnhandledRejections && !state.pending && state.status === 2 && !isStateExceptionHandled(state)) {
      if (queueSize === 0 && checkQueue.length === 0) {
        nextTick(processChecks);
      }
      checkQueue.push(state);
    }
    if (state.processScheduled || !state.pending) return;
    state.processScheduled = true;
    ++queueSize;
    nextTick(function() { processQueue(state); });
  }

  function resolvePromise(promise, val) {
    if (promise.$$state.status) return;
    if (val === promise) {
      $$reject(promise, $qMinErr(
        'qcycle',
        'Expected promise to be resolved with value other than itself \'{0}\'',
        val));
    } else {
      $$resolve(promise, val);
    }

  }

  function $$resolve(promise, val) {
    var then;
    var done = false;
    try {
      if (isObject(val) || isFunction(val)) then = val.then;
      if (isFunction(then)) {
        promise.$$state.status = -1;
        then.call(val, doResolve, doReject, doNotify);
      } else {
        promise.$$state.value = val;
        promise.$$state.status = 1;
        scheduleProcessQueue(promise.$$state);
      }
    } catch (e) {
      doReject(e);
    }

    function doResolve(val) {
      if (done) return;
      done = true;
      $$resolve(promise, val);
    }
    function doReject(val) {
      if (done) return;
      done = true;
      $$reject(promise, val);
    }
    function doNotify(progress) {
      notifyPromise(promise, progress);
    }
  }

  function rejectPromise(promise, reason) {
    if (promise.$$state.status) return;
    $$reject(promise, reason);
  }

  function $$reject(promise, reason) {
    promise.$$state.value = reason;
    promise.$$state.status = 2;
    scheduleProcessQueue(promise.$$state);
  }

  function notifyPromise(promise, progress) {
    var callbacks = promise.$$state.pending;

    if ((promise.$$state.status <= 0) && callbacks && callbacks.length) {
      nextTick(function() {
        var callback, result;
        for (var i = 0, ii = callbacks.length; i < ii; i++) {
          result = callbacks[i][0];
          callback = callbacks[i][3];
          try {
            notifyPromise(result, isFunction(callback) ? callback(progress) : progress);
          } catch (e) {
            exceptionHandler(e);
          }
        }
      });
    }
  }

  /**
   * @ngdoc method
   * @name $q#reject
   * @kind function
   *
   * @description
   * Creates a promise that is resolved as rejected with the specified `reason`. This api should be
   * used to forward rejection in a chain of promises. If you are dealing with the last promise in
   * a promise chain, you don't need to worry about it.
   *
   * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of
   * `reject` as the `throw` keyword in JavaScript. This also means that if you "catch" an error via
   * a promise error callback and you want to forward the error to the promise derived from the
   * current promise, you have to "rethrow" the error by returning a rejection constructed via
   * `reject`.
   *
   * ```js
   *   promiseB = promiseA.then(function(result) {
   *     // success: do something and resolve promiseB
   *     //          with the old or a new result
   *     return result;
   *   }, function(reason) {
   *     // error: handle the error if possible and
   *     //        resolve promiseB with newPromiseOrValue,
   *     //        otherwise forward the rejection to promiseB
   *     if (canHandle(reason)) {
   *      // handle the error and recover
   *      return newPromiseOrValue;
   *     }
   *     return $q.reject(reason);
   *   });
   * ```
   *
   * @param {*} reason Constant, message, exception or an object representing the rejection reason.
   * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.
   */
  function reject(reason) {
    var result = new Promise();
    rejectPromise(result, reason);
    return result;
  }

  function handleCallback(value, resolver, callback) {
    var callbackOutput = null;
    try {
      if (isFunction(callback)) callbackOutput = callback();
    } catch (e) {
      return reject(e);
    }
    if (isPromiseLike(callbackOutput)) {
      return callbackOutput.then(function() {
        return resolver(value);
      }, reject);
    } else {
      return resolver(value);
    }
  }

  /**
   * @ngdoc method
   * @name $q#when
   * @kind function
   *
   * @description
   * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
   * This is useful when you are dealing with an object that might or might not be a promise, or if
   * the promise comes from a source that can't be trusted.
   *
   * @param {*} value Value or a promise
   * @param {Function=} successCallback
   * @param {Function=} errorCallback
   * @param {Function=} progressCallback
   * @returns {Promise} Returns a promise of the passed value or promise
   */


  function when(value, callback, errback, progressBack) {
    var result = new Promise();
    resolvePromise(result, value);
    return result.then(callback, errback, progressBack);
  }

  /**
   * @ngdoc method
   * @name $q#resolve
   * @kind function
   *
   * @description
   * Alias of {@link ng.$q#when when} to maintain naming consistency with ES6.
   *
   * @param {*} value Value or a promise
   * @param {Function=} successCallback
   * @param {Function=} errorCallback
   * @param {Function=} progressCallback
   * @returns {Promise} Returns a promise of the passed value or promise
   */
  var resolve = when;

  /**
   * @ngdoc method
   * @name $q#all
   * @kind function
   *
   * @description
   * Combines multiple promises into a single promise that is resolved when all of the input
   * promises are resolved.
   *
   * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
   * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
   *   each value corresponding to the promise at the same index/key in the `promises` array/hash.
   *   If any of the promises is resolved with a rejection, this resulting promise will be rejected
   *   with the same rejection value.
   */

  function all(promises) {
    var result = new Promise(),
        counter = 0,
        results = isArray(promises) ? [] : {};

    forEach(promises, function(promise, key) {
      counter++;
      when(promise).then(function(value) {
        results[key] = value;
        if (!(--counter)) resolvePromise(result, results);
      }, function(reason) {
        rejectPromise(result, reason);
      });
    });

    if (counter === 0) {
      resolvePromise(result, results);
    }

    return result;
  }

  /**
   * @ngdoc method
   * @name $q#race
   * @kind function
   *
   * @description
   * Returns a promise that resolves or rejects as soon as one of those promises
   * resolves or rejects, with the value or reason from that promise.
   *
   * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
   * @returns {Promise} a promise that resolves or rejects as soon as one of the `promises`
   * resolves or rejects, with the value or reason from that promise.
   */

  function race(promises) {
    var deferred = defer();

    forEach(promises, function(promise) {
      when(promise).then(deferred.resolve, deferred.reject);
    });

    return deferred.promise;
  }

  function $Q(resolver) {
    if (!isFunction(resolver)) {
      throw $qMinErr('norslvr', 'Expected resolverFn, got \'{0}\'', resolver);
    }

    var promise = new Promise();

    function resolveFn(value) {
      resolvePromise(promise, value);
    }

    function rejectFn(reason) {
      rejectPromise(promise, reason);
    }

    resolver(resolveFn, rejectFn);

    return promise;
  }

  // Let's make the instanceof operator work for promises, so that
  // `new $q(fn) instanceof $q` would evaluate to true.
  $Q.prototype = Promise.prototype;

  $Q.defer = defer;
  $Q.reject = reject;
  $Q.when = when;
  $Q.resolve = resolve;
  $Q.all = all;
  $Q.race = race;

  return $Q;
}

function isStateExceptionHandled(state) {
  return !!state.pur;
}
function markQStateExceptionHandled(state) {
  state.pur = true;
}
function markQExceptionHandled(q) {
  // Built-in `$q` promises will always have a `$$state` property. This check is to allow
  // overwriting `$q` with a different promise library (e.g. Bluebird + angular-bluebird-promises).
  // (Currently, this is the only method that might be called with a promise, even if it is not
  // created by the built-in `$q`.)
  if (q.$$state) {
    markQStateExceptionHandled(q.$$state);
  }
}

/** @this */
function $$RAFProvider() { //rAF
  this.$get = ['$window', '$timeout', function($window, $timeout) {
    var requestAnimationFrame = $window.requestAnimationFrame ||
                                $window.webkitRequestAnimationFrame;

    var cancelAnimationFrame = $window.cancelAnimationFrame ||
                               $window.webkitCancelAnimationFrame ||
                               $window.webkitCancelRequestAnimationFrame;

    var rafSupported = !!requestAnimationFrame;
    var raf = rafSupported
      ? function(fn) {
          var id = requestAnimationFrame(fn);
          return function() {
            cancelAnimationFrame(id);
          };
        }
      : function(fn) {
          var timer = $timeout(fn, 16.66, false); // 1000 / 60 = 16.666
          return function() {
            $timeout.cancel(timer);
          };
        };

    raf.supported = rafSupported;

    return raf;
  }];
}

/**
 * DESIGN NOTES
 *
 * The design decisions behind the scope are heavily favored for speed and memory consumption.
 *
 * The typical use of scope is to watch the expressions, which most of the time return the same
 * value as last time so we optimize the operation.
 *
 * Closures construction is expensive in terms of speed as well as memory:
 *   - No closures, instead use prototypical inheritance for API
 *   - Internal state needs to be stored on scope directly, which means that private state is
 *     exposed as $$____ properties
 *
 * Loop operations are optimized by using while(count--) { ... }
 *   - This means that in order to keep the same order of execution as addition we have to add
 *     items to the array at the beginning (unshift) instead of at the end (push)
 *
 * Child scopes are created and removed often
 *   - Using an array would be slow since inserts in the middle are expensive; so we use linked lists
 *
 * There are fewer watches than observers. This is why you don't want the observer to be implemented
 * in the same way as watch. Watch requires return of the initialization function which is expensive
 * to construct.
 */


/**
 * @ngdoc provider
 * @name $rootScopeProvider
 * @description
 *
 * Provider for the $rootScope service.
 */

/**
 * @ngdoc method
 * @name $rootScopeProvider#digestTtl
 * @description
 *
 * Sets the number of `$digest` iterations the scope should attempt to execute before giving up and
 * assuming that the model is unstable.
 *
 * The current default is 10 iterations.
 *
 * In complex applications it's possible that the dependencies between `$watch`s will result in
 * several digest iterations. However if an application needs more than the default 10 digest
 * iterations for its model to stabilize then you should investigate what is causing the model to
 * continuously change during the digest.
 *
 * Increasing the TTL could have performance implications, so you should not change it without
 * proper justification.
 *
 * @param {number} limit The number of digest iterations.
 */


/**
 * @ngdoc service
 * @name $rootScope
 * @this
 *
 * @description
 *
 * Every application has a single root {@link ng.$rootScope.Scope scope}.
 * All other scopes are descendant scopes of the root scope. Scopes provide separation
 * between the model and the view, via a mechanism for watching the model for changes.
 * They also provide event emission/broadcast and subscription facility. See the
 * {@link guide/scope developer guide on scopes}.
 */
function $RootScopeProvider() {
  var TTL = 10;
  var $rootScopeMinErr = minErr('$rootScope');
  var lastDirtyWatch = null;
  var applyAsyncId = null;

  this.digestTtl = function(value) {
    if (arguments.length) {
      TTL = value;
    }
    return TTL;
  };

  function createChildScopeClass(parent) {
    function ChildScope() {
      this.$$watchers = this.$$nextSibling =
          this.$$childHead = this.$$childTail = null;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$watchersCount = 0;
      this.$id = nextUid();
      this.$$ChildScope = null;
      this.$$suspended = false;
    }
    ChildScope.prototype = parent;
    return ChildScope;
  }

  this.$get = ['$exceptionHandler', '$parse', '$browser',
      function($exceptionHandler, $parse, $browser) {

    function destroyChildScope($event) {
        $event.currentScope.$$destroyed = true;
    }

    function cleanUpScope($scope) {

      // Support: IE 9 only
      if (msie === 9) {
        // There is a memory leak in IE9 if all child scopes are not disconnected
        // completely when a scope is destroyed. So this code will recurse up through
        // all this scopes children
        //
        // See issue https://github.com/angular/angular.js/issues/10706
        if ($scope.$$childHead) {
          cleanUpScope($scope.$$childHead);
        }
        if ($scope.$$nextSibling) {
          cleanUpScope($scope.$$nextSibling);
        }
      }

      // The code below works around IE9 and V8's memory leaks
      //
      // See:
      // - https://code.google.com/p/v8/issues/detail?id=2073#c26
      // - https://github.com/angular/angular.js/issues/6794#issuecomment-38648909
      // - https://github.com/angular/angular.js/issues/1313#issuecomment-10378451

      $scope.$parent = $scope.$$nextSibling = $scope.$$prevSibling = $scope.$$childHead =
          $scope.$$childTail = $scope.$root = $scope.$$watchers = null;
    }

    /**
     * @ngdoc type
     * @name $rootScope.Scope
     *
     * @description
     * A root scope can be retrieved using the {@link ng.$rootScope $rootScope} key from the
     * {@link auto.$injector $injector}. Child scopes are created using the
     * {@link ng.$rootScope.Scope#$new $new()} method. (Most scopes are created automatically when
     * compiled HTML template is executed.) See also the {@link guide/scope Scopes guide} for
     * an in-depth introduction and usage examples.
     *
     *
     * ## Inheritance
     * A scope can inherit from a parent scope, as in this example:
     * ```js
         var parent = $rootScope;
         var child = parent.$new();

         parent.salutation = "Hello";
         expect(child.salutation).toEqual('Hello');

         child.salutation = "Welcome";
         expect(child.salutation).toEqual('Welcome');
         expect(parent.salutation).toEqual('Hello');
     * ```
     *
     * When interacting with `Scope` in tests, additional helper methods are available on the
     * instances of `Scope` type. See {@link ngMock.$rootScope.Scope ngMock Scope} for additional
     * details.
     *
     *
     * @param {Object.<string, function()>=} providers Map of service factory which need to be
     *                                       provided for the current scope. Defaults to {@link ng}.
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
     *                              append/override services provided by `providers`. This is handy
     *                              when unit-testing and having the need to override a default
     *                              service.
     * @returns {Object} Newly created scope.
     *
     */
    function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this.$root = this;
      this.$$destroyed = false;
      this.$$suspended = false;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$watchersCount = 0;
      this.$$isolateBindings = null;
    }

    /**
     * @ngdoc property
     * @name $rootScope.Scope#$id
     *
     * @description
     * Unique scope ID (monotonically increasing) useful for debugging.
     */

     /**
      * @ngdoc property
      * @name $rootScope.Scope#$parent
      *
      * @description
      * Reference to the parent scope.
      */

      /**
       * @ngdoc property
       * @name $rootScope.Scope#$root
       *
       * @description
       * Reference to the root scope.
       */

    Scope.prototype = {
      constructor: Scope,
      /**
       * @ngdoc method
       * @name $rootScope.Scope#$new
       * @kind function
       *
       * @description
       * Creates a new child {@link ng.$rootScope.Scope scope}.
       *
       * The parent scope will propagate the {@link ng.$rootScope.Scope#$digest $digest()} event.
       * The scope can be removed from the scope hierarchy using {@link ng.$rootScope.Scope#$destroy $destroy()}.
       *
       * {@link ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is
       * desired for the scope and its child scopes to be permanently detached from the parent and
       * thus stop participating in model change detection and listener notification by invoking.
       *
       * @param {boolean} isolate If true, then the scope does not prototypically inherit from the
       *         parent scope. The scope is isolated, as it can not see parent scope properties.
       *         When creating widgets, it is useful for the widget to not accidentally read parent
       *         state.
       *
       * @param {Scope} [parent=this] The {@link ng.$rootScope.Scope `Scope`} that will be the `$parent`
       *                              of the newly created scope. Defaults to `this` scope if not provided.
       *                              This is used when creating a transclude scope to correctly place it
       *                              in the scope hierarchy while maintaining the correct prototypical
       *                              inheritance.
       *
       * @returns {Object} The newly created child scope.
       *
       */
      $new: function(isolate, parent) {
        var child;

        parent = parent || this;

        if (isolate) {
          child = new Scope();
          child.$root = this.$root;
        } else {
          // Only create a child scope class if somebody asks for one,
          // but cache it to allow the VM to optimize lookups.
          if (!this.$$ChildScope) {
            this.$$ChildScope = createChildScopeClass(this);
          }
          child = new this.$$ChildScope();
        }
        child.$parent = parent;
        child.$$prevSibling = parent.$$childTail;
        if (parent.$$childHead) {
          parent.$$childTail.$$nextSibling = child;
          parent.$$childTail = child;
        } else {
          parent.$$childHead = parent.$$childTail = child;
        }

        // When the new scope is not isolated or we inherit from `this`, and
        // the parent scope is destroyed, the property `$$destroyed` is inherited
        // prototypically. In all other cases, this property needs to be set
        // when the parent scope is destroyed.
        // The listener needs to be added after the parent is set
        if (isolate || parent !== this) child.$on('$destroy', destroyChildScope);

        return child;
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watch
       * @kind function
       *
       * @description
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
       *
       * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#$digest
       *   $digest()} and should return the value that will be watched. (`watchExpression` should not change
       *   its value when executed multiple times with the same input because it may be executed multiple
       *   times by {@link ng.$rootScope.Scope#$digest $digest()}. That is, `watchExpression` should be
       *   [idempotent](http://en.wikipedia.org/wiki/Idempotence).)
       * - The `listener` is called only when the value from the current `watchExpression` and the
       *   previous call to `watchExpression` are not equal (with the exception of the initial run,
       *   see below). Inequality is determined according to reference inequality,
       *   [strict comparison](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators)
       *    via the `!==` Javascript operator, unless `objectEquality == true`
       *   (see next point)
       * - When `objectEquality == true`, inequality of the `watchExpression` is determined
       *   according to the {@link angular.equals} function. To save the value of the object for
       *   later comparison, the {@link angular.copy} function is used. This therefore means that
       *   watching complex objects will have adverse memory and performance implications.
       * - This should not be used to watch for changes in objects that are (or contain)
       *   [File](https://developer.mozilla.org/docs/Web/API/File) objects due to limitations with {@link angular.copy `angular.copy`}.
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire.
       *   This is achieved by rerunning the watchers until no changes are detected. The rerun
       *   iteration limit is 10 to prevent an infinite loop deadlock.
       *
       *
       * If you want to be notified whenever {@link ng.$rootScope.Scope#$digest $digest} is called,
       * you can register a `watchExpression` function with no `listener`. (Be prepared for
       * multiple calls to your `watchExpression` because it will execute multiple times in a
       * single {@link ng.$rootScope.Scope#$digest $digest} cycle if a change is detected.)
       *
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously
       * (via {@link ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the
       * watcher. In rare cases, this is undesirable because the listener is called when the result
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
       * listener was called due to initialization.
       *
       *
       *
       * @example
       * ```js
           // let's assume that scope was dependency injected as the $rootScope
           var scope = $rootScope;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // the listener is always called during the first $digest loop after it was registered
           expect(scope.counter).toEqual(1);

           scope.$digest();
           // but now it will not be called unless the value changes
           expect(scope.counter).toEqual(1);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(2);



           // Using a function as a watchExpression
           var food;
           scope.foodCounter = 0;
           expect(scope.foodCounter).toEqual(0);
           scope.$watch(
             // This function returns the value being watched. It is called for each turn of the $digest loop
             function() { return food; },
             // This is the change listener, called when the value returned from the above function changes
             function(newValue, oldValue) {
               if ( newValue !== oldValue ) {
                 // Only increment the counter if the value changed
                 scope.foodCounter = scope.foodCounter + 1;
               }
             }
           );
           // No digest has been run so the counter will be zero
           expect(scope.foodCounter).toEqual(0);

           // Run the digest but since food has not changed count will still be zero
           scope.$digest();
           expect(scope.foodCounter).toEqual(0);

           // Update food and run digest.  Now the counter will increment
           food = 'cheeseburger';
           scope.$digest();
           expect(scope.foodCounter).toEqual(1);

       * ```
       *
       *
       *
       * @param {(function()|string)} watchExpression Expression that is evaluated on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. A change in the return value triggers
       *    a call to the `listener`.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(scope)`: called with current `scope` as a parameter.
       * @param {function(newVal, oldVal, scope)} listener Callback called whenever the value
       *    of `watchExpression` changes.
       *
       *    - `newVal` contains the current value of the `watchExpression`
       *    - `oldVal` contains the previous value of the `watchExpression`
       *    - `scope` refers to the current scope
       * @param {boolean=} [objectEquality=false] Compare for object equality using {@link angular.equals} instead of
       *     comparing for reference equality.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
        var get = $parse(watchExp);
        var fn = isFunction(listener) ? listener : noop;

        if (get.$$watchDelegate) {
          return get.$$watchDelegate(this, fn, objectEquality, get, watchExp);
        }
        var scope = this,
            array = scope.$$watchers,
            watcher = {
              fn: fn,
              last: initWatchVal,
              get: get,
              exp: prettyPrintExpression || watchExp,
              eq: !!objectEquality
            };

        lastDirtyWatch = null;

        if (!array) {
          array = scope.$$watchers = [];
          array.$$digestWatchIndex = -1;
        }
        // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);
        array.$$digestWatchIndex++;
        incrementWatchersCount(this, 1);

        return function deregisterWatch() {
          var index = arrayRemove(array, watcher);
          if (index >= 0) {
            incrementWatchersCount(scope, -1);
            if (index < array.$$digestWatchIndex) {
              array.$$digestWatchIndex--;
            }
          }
          lastDirtyWatch = null;
        };
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watchGroup
       * @kind function
       *
       * @description
       * A variant of {@link ng.$rootScope.Scope#$watch $watch()} where it watches an array of `watchExpressions`.
       * If any one expression in the collection changes the `listener` is executed.
       *
       * - The items in the `watchExpressions` array are observed via the standard `$watch` operation. Their return
       *   values are examined for changes on every call to `$digest`.
       * - The `listener` is called whenever any expression in the `watchExpressions` array changes.
       *
       * @param {Array.<string|Function(scope)>} watchExpressions Array of expressions that will be individually
       * watched using {@link ng.$rootScope.Scope#$watch $watch()}
       *
       * @param {function(newValues, oldValues, scope)} listener Callback called whenever the return value of any
       *    expression in `watchExpressions` changes
       *    The `newValues` array contains the current values of the `watchExpressions`, with the indexes matching
       *    those of `watchExpression`
       *    and the `oldValues` array contains the previous values of the `watchExpressions`, with the indexes matching
       *    those of `watchExpression`
       *    The `scope` refers to the current scope.
       * @returns {function()} Returns a de-registration function for all listeners.
       */
      $watchGroup: function(watchExpressions, listener) {
        var oldValues = new Array(watchExpressions.length);
        var newValues = new Array(watchExpressions.length);
        var deregisterFns = [];
        var self = this;
        var changeReactionScheduled = false;
        var firstRun = true;

        if (!watchExpressions.length) {
          // No expressions means we call the listener ASAP
          var shouldCall = true;
          self.$evalAsync(function() {
            if (shouldCall) listener(newValues, newValues, self);
          });
          return function deregisterWatchGroup() {
            shouldCall = false;
          };
        }

        if (watchExpressions.length === 1) {
          // Special case size of one
          return this.$watch(watchExpressions[0], function watchGroupAction(value, oldValue, scope) {
            newValues[0] = value;
            oldValues[0] = oldValue;
            listener(newValues, (value === oldValue) ? newValues : oldValues, scope);
          });
        }

        forEach(watchExpressions, function(expr, i) {
          var unwatchFn = self.$watch(expr, function watchGroupSubAction(value) {
            newValues[i] = value;
            if (!changeReactionScheduled) {
              changeReactionScheduled = true;
              self.$evalAsync(watchGroupAction);
            }
          });
          deregisterFns.push(unwatchFn);
        });

        function watchGroupAction() {
          changeReactionScheduled = false;

          try {
            if (firstRun) {
              firstRun = false;
              listener(newValues, newValues, self);
            } else {
              listener(newValues, oldValues, self);
            }
          } finally {
            for (var i = 0; i < watchExpressions.length; i++) {
              oldValues[i] = newValues[i];
            }
          }
        }

        return function deregisterWatchGroup() {
          while (deregisterFns.length) {
            deregisterFns.shift()();
          }
        };
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watchCollection
       * @kind function
       *
       * @description
       * Shallow watches the properties of an object and fires whenever any of the properties change
       * (for arrays, this implies watching the array items; for object maps, this implies watching
       * the properties). If a change is detected, the `listener` callback is fired.
       *
       * - The `obj` collection is observed via standard $watch operation and is examined on every
       *   call to $digest() to see if any items have been added, removed, or moved.
       * - The `listener` is called whenever anything within the `obj` has changed. Examples include
       *   adding, removing, and moving items belonging to an object or array.
       *
       *
       * @example
       * ```js
          $scope.names = ['igor', 'matias', 'misko', 'james'];
          $scope.dataCount = 4;

          $scope.$watchCollection('names', function(newNames, oldNames) {
            $scope.dataCount = newNames.length;
          });

          expect($scope.dataCount).toEqual(4);
          $scope.$digest();

          //still at 4 ... no changes
          expect($scope.dataCount).toEqual(4);

          $scope.names.pop();
          $scope.$digest();

          //now there's been a change
          expect($scope.dataCount).toEqual(3);
       * ```
       *
       *
       * @param {string|function(scope)} obj Evaluated as {@link guide/expression expression}. The
       *    expression value should evaluate to an object or an array which is observed on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. Any shallow change within the
       *    collection will trigger a call to the `listener`.
       *
       * @param {function(newCollection, oldCollection, scope)} listener a callback function called
       *    when a change is detected.
       *    - The `newCollection` object is the newly modified data obtained from the `obj` expression
       *    - The `oldCollection` object is a copy of the former collection data.
       *      Due to performance considerations, the`oldCollection` value is computed only if the
       *      `listener` function declares two or more arguments.
       *    - The `scope` argument refers to the current scope.
       *
       * @returns {function()} Returns a de-registration function for this listener. When the
       *    de-registration function is executed, the internal watch operation is terminated.
       */
      $watchCollection: function(obj, listener) {
        // Mark the interceptor as
        // ... $$pure when literal since the instance will change when any input changes
        $watchCollectionInterceptor.$$pure = $parse(obj).literal;
        // ... $stateful when non-literal since we must read the state of the collection
        $watchCollectionInterceptor.$stateful = !$watchCollectionInterceptor.$$pure;

        var self = this;
        // the current value, updated on each dirty-check run
        var newValue;
        // a shallow copy of the newValue from the last dirty-check run,
        // updated to match newValue during dirty-check run
        var oldValue;
        // a shallow copy of the newValue from when the last change happened
        var veryOldValue;
        // only track veryOldValue if the listener is asking for it
        var trackVeryOldValue = (listener.length > 1);
        var changeDetected = 0;
        var changeDetector = $parse(obj, $watchCollectionInterceptor);
        var internalArray = [];
        var internalObject = {};
        var initRun = true;
        var oldLength = 0;

        function $watchCollectionInterceptor(_value) {
          newValue = _value;
          var newLength, key, bothNaN, newItem, oldItem;

          // If the new value is undefined, then return undefined as the watch may be a one-time watch
          if (isUndefined(newValue)) return;

          if (!isObject(newValue)) { // if primitive
            if (oldValue !== newValue) {
              oldValue = newValue;
              changeDetected++;
            }
          } else if (isArrayLike(newValue)) {
            if (oldValue !== internalArray) {
              // we are transitioning from something which was not an array into array.
              oldValue = internalArray;
              oldLength = oldValue.length = 0;
              changeDetected++;
            }

            newLength = newValue.length;

            if (oldLength !== newLength) {
              // if lengths do not match we need to trigger change notification
              changeDetected++;
              oldValue.length = oldLength = newLength;
            }
            // copy the items to oldValue and look for changes.
            for (var i = 0; i < newLength; i++) {
              oldItem = oldValue[i];
              newItem = newValue[i];

              // eslint-disable-next-line no-self-compare
              bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
              if (!bothNaN && (oldItem !== newItem)) {
                changeDetected++;
                oldValue[i] = newItem;
              }
            }
          } else {
            if (oldValue !== internalObject) {
              // we are transitioning from something which was not an object into object.
              oldValue = internalObject = {};
              oldLength = 0;
              changeDetected++;
            }
            // copy the items to oldValue and look for changes.
            newLength = 0;
            for (key in newValue) {
              if (hasOwnProperty.call(newValue, key)) {
                newLength++;
                newItem = newValue[key];
                oldItem = oldValue[key];

                if (key in oldValue) {
                  // eslint-disable-next-line no-self-compare
                  bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                  if (!bothNaN && (oldItem !== newItem)) {
                    changeDetected++;
                    oldValue[key] = newItem;
                  }
                } else {
                  oldLength++;
                  oldValue[key] = newItem;
                  changeDetected++;
                }
              }
            }
            if (oldLength > newLength) {
              // we used to have more keys, need to find them and destroy them.
              changeDetected++;
              for (key in oldValue) {
                if (!hasOwnProperty.call(newValue, key)) {
                  oldLength--;
                  delete oldValue[key];
                }
              }
            }
          }
          return changeDetected;
        }

        function $watchCollectionAction() {
          if (initRun) {
            initRun = false;
            listener(newValue, newValue, self);
          } else {
            listener(newValue, veryOldValue, self);
          }

          // make a copy for the next time a collection is changed
          if (trackVeryOldValue) {
            if (!isObject(newValue)) {
              //primitive
              veryOldValue = newValue;
            } else if (isArrayLike(newValue)) {
              veryOldValue = new Array(newValue.length);
              for (var i = 0; i < newValue.length; i++) {
                veryOldValue[i] = newValue[i];
              }
            } else { // if object
              veryOldValue = {};
              for (var key in newValue) {
                if (hasOwnProperty.call(newValue, key)) {
                  veryOldValue[key] = newValue[key];
                }
              }
            }
          }
        }

        return this.$watch(changeDetector, $watchCollectionAction);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$digest
       * @kind function
       *
       * @description
       * Processes all of the {@link ng.$rootScope.Scope#$watch watchers} of the current scope and
       * its children. Because a {@link ng.$rootScope.Scope#$watch watcher}'s listener can change
       * the model, the `$digest()` keeps calling the {@link ng.$rootScope.Scope#$watch watchers}
       * until no more listeners are firing. This means that it is possible to get into an infinite
       * loop. This function will throw `'Maximum iteration limit exceeded.'` if the number of
       * iterations exceeds 10.
       *
       * Usually, you don't call `$digest()` directly in
       * {@link ng.directive:ngController controllers} or in
       * {@link ng.$compileProvider#directive directives}.
       * Instead, you should call {@link ng.$rootScope.Scope#$apply $apply()} (typically from within
       * a {@link ng.$compileProvider#directive directive}), which will force a `$digest()`.
       *
       * If you want to be notified whenever `$digest()` is called,
       * you can register a `watchExpression` function with
       * {@link ng.$rootScope.Scope#$watch $watch()} with no `listener`.
       *
       * In unit tests, you may need to call `$digest()` to simulate the scope life cycle.
       *
       * @example
       * ```js
           var scope = ...;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // the listener is always called during the first $digest loop after it was registered
           expect(scope.counter).toEqual(1);

           scope.$digest();
           // but now it will not be called unless the value changes
           expect(scope.counter).toEqual(1);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(2);
       * ```
       *
       */
      $digest: function() {
        var watch, value, last, fn, get,
            watchers,
            dirty, ttl = TTL,
            next, current, target = asyncQueue.length ? $rootScope : this,
            watchLog = [],
            logIdx, asyncTask;

        beginPhase('$digest');
        // Check for changes to browser url that happened in sync before the call to $digest
        $browser.$$checkUrlChange();

        if (this === $rootScope && applyAsyncId !== null) {
          // If this is the root scope, and $applyAsync has scheduled a deferred $apply(), then
          // cancel the scheduled $apply and flush the queue of expressions to be evaluated.
          $browser.defer.cancel(applyAsyncId);
          flushApplyAsync();
        }

        lastDirtyWatch = null;

        do { // "while dirty" loop
          dirty = false;
          current = target;

          // It's safe for asyncQueuePosition to be a local variable here because this loop can't
          // be reentered recursively. Calling $digest from a function passed to $evalAsync would
          // lead to a '$digest already in progress' error.
          for (var asyncQueuePosition = 0; asyncQueuePosition < asyncQueue.length; asyncQueuePosition++) {
            try {
              asyncTask = asyncQueue[asyncQueuePosition];
              fn = asyncTask.fn;
              fn(asyncTask.scope, asyncTask.locals);
            } catch (e) {
              $exceptionHandler(e);
            }
            lastDirtyWatch = null;
          }
          asyncQueue.length = 0;

          traverseScopesLoop:
          do { // "traverse the scopes" loop
            if ((watchers = !current.$$suspended && current.$$watchers)) {
              // process our watches
              watchers.$$digestWatchIndex = watchers.length;
              while (watchers.$$digestWatchIndex--) {
                try {
                  watch = watchers[watchers.$$digestWatchIndex];
                  // Most common watches are on primitives, in which case we can short
                  // circuit it with === operator, only when === fails do we use .equals
                  if (watch) {
                    get = watch.get;
                    if ((value = get(current)) !== (last = watch.last) &&
                        !(watch.eq
                            ? equals(value, last)
                            : (isNumberNaN(value) && isNumberNaN(last)))) {
                      dirty = true;
                      lastDirtyWatch = watch;
                      watch.last = watch.eq ? copy(value, null) : value;
                      fn = watch.fn;
                      fn(value, ((last === initWatchVal) ? value : last), current);
                      if (ttl < 5) {
                        logIdx = 4 - ttl;
                        if (!watchLog[logIdx]) watchLog[logIdx] = [];
                        watchLog[logIdx].push({
                          msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                          newVal: value,
                          oldVal: last
                        });
                      }
                    } else if (watch === lastDirtyWatch) {
                      // If the most recently dirty watcher is now clean, short circuit since the remaining watchers
                      // have already been tested.
                      dirty = false;
                      break traverseScopesLoop;
                    }
                  }
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            }

            // Insanity Warning: scope depth-first traversal
            // yes, this code is a bit crazy, but it works and we have tests to prove it!
            // this piece should be kept in sync with the traversal in $broadcast
            // (though it differs due to having the extra check for $$suspended and does not
            // check $$listenerCount)
            if (!(next = ((!current.$$suspended && current.$$watchersCount && current.$$childHead) ||
                (current !== target && current.$$nextSibling)))) {
              while (current !== target && !(next = current.$$nextSibling)) {
                current = current.$parent;
              }
            }
          } while ((current = next));

          // `break traverseScopesLoop;` takes us to here

          if ((dirty || asyncQueue.length) && !(ttl--)) {
            clearPhase();
            throw $rootScopeMinErr('infdig',
                '{0} $digest() iterations reached. Aborting!\n' +
                'Watchers fired in the last 5 iterations: {1}',
                TTL, watchLog);
          }

        } while (dirty || asyncQueue.length);

        clearPhase();

        // postDigestQueuePosition isn't local here because this loop can be reentered recursively.
        while (postDigestQueuePosition < postDigestQueue.length) {
          try {
            postDigestQueue[postDigestQueuePosition++]();
          } catch (e) {
            $exceptionHandler(e);
          }
        }
        postDigestQueue.length = postDigestQueuePosition = 0;

        // Check for changes to browser url that happened during the $digest
        // (for which no event is fired; e.g. via `history.pushState()`)
        $browser.$$checkUrlChange();
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$suspend
       * @kind function
       *
       * @description
       * Suspend watchers of this scope subtree so that they will not be invoked during digest.
       *
       * This can be used to optimize your application when you know that running those watchers
       * is redundant.
       *
       * **Warning**
       *
       * Suspending scopes from the digest cycle can have unwanted and difficult to debug results.
       * Only use this approach if you are confident that you know what you are doing and have
       * ample tests to ensure that bindings get updated as you expect.
       *
       * Some of the things to consider are:
       *
       * * Any external event on a directive/component will not trigger a digest while the hosting
       *   scope is suspended - even if the event handler calls `$apply()` or `$rootScope.$digest()`.
       * * Transcluded content exists on a scope that inherits from outside a directive but exists
       *   as a child of the directive's containing scope. If the containing scope is suspended the
       *   transcluded scope will also be suspended, even if the scope from which the transcluded
       *   scope inherits is not suspended.
       * * Multiple directives trying to manage the suspended status of a scope can confuse each other:
       *    * A call to `$suspend()` on an already suspended scope is a no-op.
       *    * A call to `$resume()` on a non-suspended scope is a no-op.
       *    * If two directives suspend a scope, then one of them resumes the scope, the scope will no
       *      longer be suspended. This could result in the other directive believing a scope to be
       *      suspended when it is not.
       * * If a parent scope is suspended then all its descendants will be also excluded from future
       *   digests whether or not they have been suspended themselves. Note that this also applies to
       *   isolate child scopes.
       * * Calling `$digest()` directly on a descendant of a suspended scope will still run the watchers
       *   for that scope and its descendants. When digesting we only check whether the current scope is
       *   locally suspended, rather than checking whether it has a suspended ancestor.
       * * Calling `$resume()` on a scope that has a suspended ancestor will not cause the scope to be
       *   included in future digests until all its ancestors have been resumed.
       * * Resolved promises, e.g. from explicit `$q` deferreds and `$http` calls, trigger `$apply()`
       *   against the `$rootScope` and so will still trigger a global digest even if the promise was
       *   initiated by a component that lives on a suspended scope.
       */
      $suspend: function() {
        this.$$suspended = true;
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$isSuspended
       * @kind function
       *
       * @description
       * Call this method to determine if this scope has been explicitly suspended. It will not
       * tell you whether an ancestor has been suspended.
       * To determine if this scope will be excluded from a digest triggered at the $rootScope,
       * for example, you must check all its ancestors:
       *
       * ```
       * function isExcludedFromDigest(scope) {
       *   while(scope) {
       *     if (scope.$isSuspended()) return true;
       *     scope = scope.$parent;
       *   }
       *   return false;
       * ```
       *
       * Be aware that a scope may not be included in digests if it has a suspended ancestor,
       * even if `$isSuspended()` returns false.
       *
       * @returns true if the current scope has been suspended.
       */
      $isSuspended: function() {
        return this.$$suspended;
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$resume
       * @kind function
       *
       * @description
       * Resume watchers of this scope subtree in case it was suspended.
       *
       * See {@link $rootScope.Scope#$suspend} for information about the dangers of using this approach.
       */
      $resume: function() {
        this.$$suspended = false;
      },

      /**
       * @ngdoc event
       * @name $rootScope.Scope#$destroy
       * @eventType broadcast on scope being destroyed
       *
       * @description
       * Broadcasted when a scope and its children are being destroyed.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$destroy
       * @kind function
       *
       * @description
       * Removes the current scope (and all of its children) from the parent scope. Removal implies
       * that calls to {@link ng.$rootScope.Scope#$digest $digest()} will no longer
       * propagate to the current scope and its children. Removal also implies that the current
       * scope is eligible for garbage collection.
       *
       * The `$destroy()` is usually used by directives such as
       * {@link ng.directive:ngRepeat ngRepeat} for managing the
       * unrolling of the loop.
       *
       * Just before a scope is destroyed, a `$destroy` event is broadcasted on this scope.
       * Application code can register a `$destroy` event handler that will give it a chance to
       * perform any necessary cleanup.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */
      $destroy: function() {
        // We can't destroy a scope that has been already destroyed.
        if (this.$$destroyed) return;
        var parent = this.$parent;

        this.$broadcast('$destroy');
        this.$$destroyed = true;

        if (this === $rootScope) {
          //Remove handlers attached to window when $rootScope is removed
          $browser.$$applicationDestroyed();
        }

        incrementWatchersCount(this, -this.$$watchersCount);
        for (var eventName in this.$$listenerCount) {
          decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
        }

        // sever all the references to parent scopes (after this cleanup, the current scope should
        // not be retained by any of our references and should be eligible for garbage collection)
        if (parent && parent.$$childHead === this) parent.$$childHead = this.$$nextSibling;
        if (parent && parent.$$childTail === this) parent.$$childTail = this.$$prevSibling;
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;

        // Disable listeners, watchers and apply/digest methods
        this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
        this.$on = this.$watch = this.$watchGroup = function() { return noop; };
        this.$$listeners = {};

        // Disconnect the next sibling to prevent `cleanUpScope` destroying those too
        this.$$nextSibling = null;
        cleanUpScope(this);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$eval
       * @kind function
       *
       * @description
       * Executes the `expression` on the current scope and returns the result. Any exceptions in
       * the expression are propagated (uncaught). This is useful when evaluating AngularJS
       * expressions.
       *
       * @example
       * ```js
           var scope = ng.$rootScope.Scope();
           scope.a = 1;
           scope.b = 2;

           expect(scope.$eval('a+b')).toEqual(3);
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);
       * ```
       *
       * @param {(string|function())=} expression An AngularJS expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       * @returns {*} The result of evaluating the expression.
       */
      $eval: function(expr, locals) {
        return $parse(expr)(this, locals);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$evalAsync
       * @kind function
       *
       * @description
       * Executes the expression on the current scope at a later point in time.
       *
       * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only
       * that:
       *
       *   - it will execute after the function that scheduled the evaluation (preferably before DOM
       *     rendering).
       *   - at least one {@link ng.$rootScope.Scope#$digest $digest cycle} will be performed after
       *     `expression` execution.
       *
       * Any exceptions from the execution of the expression are forwarded to the
       * {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * __Note:__ if this function is called outside of a `$digest` cycle, a new `$digest` cycle
       * will be scheduled. However, it is encouraged to always call code that changes the model
       * from within an `$apply` call. That includes code evaluated via `$evalAsync`.
       *
       * @param {(string|function())=} expression An AngularJS expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       */
      $evalAsync: function(expr, locals) {
        // if we are outside of an $digest loop and this is the first time we are scheduling async
        // task also schedule async auto-flush
        if (!$rootScope.$$phase && !asyncQueue.length) {
          $browser.defer(function() {
            if (asyncQueue.length) {
              $rootScope.$digest();
            }
          }, null, '$evalAsync');
        }

        asyncQueue.push({scope: this, fn: $parse(expr), locals: locals});
      },

      $$postDigest: function(fn) {
        postDigestQueue.push(fn);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$apply
       * @kind function
       *
       * @description
       * `$apply()` is used to execute an expression in AngularJS from outside of the AngularJS
       * framework. (For example from browser DOM events, setTimeout, XHR or third party libraries).
       * Because we are calling into the AngularJS framework we need to perform proper scope life
       * cycle of {@link ng.$exceptionHandler exception handling},
       * {@link ng.$rootScope.Scope#$digest executing watches}.
       *
       * **Life cycle: Pseudo-Code of `$apply()`**
       *
       * ```js
           function $apply(expr) {
             try {
               return $eval(expr);
             } catch (e) {
               $exceptionHandler(e);
             } finally {
               $root.$digest();
             }
           }
       * ```
       *
       *
       * Scope's `$apply()` method transitions through the following stages:
       *
       * 1. The {@link guide/expression expression} is executed using the
       *    {@link ng.$rootScope.Scope#$eval $eval()} method.
       * 2. Any exceptions from the execution of the expression are forwarded to the
       *    {@link ng.$exceptionHandler $exceptionHandler} service.
       * 3. The {@link ng.$rootScope.Scope#$watch watch} listeners are fired immediately after the
       *    expression was executed using the {@link ng.$rootScope.Scope#$digest $digest()} method.
       *
       *
       * @param {(string|function())=} exp An AngularJS expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $apply: function(expr) {
        try {
          beginPhase('$apply');
          try {
            return this.$eval(expr);
          } finally {
            clearPhase();
          }
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          try {
            $rootScope.$digest();
          } catch (e) {
            $exceptionHandler(e);
            // eslint-disable-next-line no-unsafe-finally
            throw e;
          }
        }
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$applyAsync
       * @kind function
       *
       * @description
       * Schedule the invocation of $apply to occur at a later time. The actual time difference
       * varies across browsers, but is typically around ~10 milliseconds.
       *
       * This can be used to queue up multiple expressions which need to be evaluated in the same
       * digest.
       *
       * @param {(string|function())=} exp An AngularJS expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       */
      $applyAsync: function(expr) {
        var scope = this;
        if (expr) {
          applyAsyncQueue.push($applyAsyncExpression);
        }
        expr = $parse(expr);
        scheduleApplyAsync();

        function $applyAsyncExpression() {
          scope.$eval(expr);
        }
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$on
       * @kind function
       *
       * @description
       * Listens on events of a given type. See {@link ng.$rootScope.Scope#$emit $emit} for
       * discussion of event life cycle.
       *
       * The event listener function format is: `function(event, args...)`. The `event` object
       * passed into the listener has the following attributes:
       *
       *   - `targetScope` - `{Scope}`: the scope on which the event was `$emit`-ed or
       *     `$broadcast`-ed.
       *   - `currentScope` - `{Scope}`: the scope that is currently handling the event. Once the
       *     event propagates through the scope hierarchy, this property is set to null.
       *   - `name` - `{string}`: name of the event.
       *   - `stopPropagation` - `{function=}`: calling `stopPropagation` function will cancel
       *     further event propagation (available only for events that were `$emit`-ed).
       *   - `preventDefault` - `{function}`: calling `preventDefault` sets `defaultPrevented` flag
       *     to true.
       *   - `defaultPrevented` - `{boolean}`: true if `preventDefault` was called.
       *
       * @param {string} name Event name to listen on.
       * @param {function(event, ...args)} listener Function to call when the event is emitted.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $on: function(name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        var current = this;
        do {
          if (!current.$$listenerCount[name]) {
            current.$$listenerCount[name] = 0;
          }
          current.$$listenerCount[name]++;
        } while ((current = current.$parent));

        var self = this;
        return function() {
          var indexOfListener = namedListeners.indexOf(listener);
          if (indexOfListener !== -1) {
            // Use delete in the hope of the browser deallocating the memory for the array entry,
            // while not shifting the array indexes of other listeners.
            // See issue https://github.com/angular/angular.js/issues/16135
            delete namedListeners[indexOfListener];
            decrementListenerCount(self, 1, name);
          }
        };
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$emit
       * @kind function
       *
       * @description
       * Dispatches an event `name` upwards through the scope hierarchy notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$emit` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event traverses upwards toward the root scope and calls all
       * registered listeners along the way. The event will stop propagating if one of the listeners
       * cancels it.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to emit.
       * @param {...*} args Optional one or more arguments which will be passed onto the event listeners.
       * @return {Object} Event object (see {@link ng.$rootScope.Scope#$on}).
       */
      $emit: function(name, args) {
        var empty = [],
            namedListeners,
            scope = this,
            stopPropagation = false,
            event = {
              name: name,
              targetScope: scope,
              stopPropagation: function() {stopPropagation = true;},
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            i, length;

        do {
          namedListeners = scope.$$listeners[name] || empty;
          event.currentScope = scope;
          for (i = 0, length = namedListeners.length; i < length; i++) {

            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              //allow all listeners attached to the current scope to run
              namedListeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          //if any listener on the current scope stops propagation, prevent bubbling
          if (stopPropagation) {
            break;
          }
          //traverse upwards
          scope = scope.$parent;
        } while (scope);

        event.currentScope = null;

        return event;
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$broadcast
       * @kind function
       *
       * @description
       * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$broadcast` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event propagates to all direct and indirect scopes of the current
       * scope and calls all registered listeners along the way. The event cannot be canceled.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to broadcast.
       * @param {...*} args Optional one or more arguments which will be passed onto the event listeners.
       * @return {Object} Event object, see {@link ng.$rootScope.Scope#$on}
       */
      $broadcast: function(name, args) {
        var target = this,
            current = target,
            next = target,
            event = {
              name: name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            };

        if (!target.$$listenerCount[name]) return event;

        var listenerArgs = concat([event], arguments, 1),
            listeners, i, length;

        //down while you can, then up and next sibling or up and next sibling until back at root
        while ((current = next)) {
          event.currentScope = current;
          listeners = current.$$listeners[name] || [];
          for (i = 0, length = listeners.length; i < length; i++) {
            // if listeners were deregistered, defragment the array
            if (!listeners[i]) {
              listeners.splice(i, 1);
              i--;
              length--;
              continue;
            }

            try {
              listeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          // (though it differs due to having the extra check for $$listenerCount and
          // does not check $$suspended)
          if (!(next = ((current.$$listenerCount[name] && current.$$childHead) ||
              (current !== target && current.$$nextSibling)))) {
            while (current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        }

        event.currentScope = null;
        return event;
      }
    };

    var $rootScope = new Scope();

    //The internal queues. Expose them on the $rootScope for debugging/testing purposes.
    var asyncQueue = $rootScope.$$asyncQueue = [];
    var postDigestQueue = $rootScope.$$postDigestQueue = [];
    var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];

    var postDigestQueuePosition = 0;

    return $rootScope;


    function beginPhase(phase) {
      if ($rootScope.$$phase) {
        throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
      }

      $rootScope.$$phase = phase;
    }

    function clearPhase() {
      $rootScope.$$phase = null;
    }

    function incrementWatchersCount(current, count) {
      do {
        current.$$watchersCount += count;
      } while ((current = current.$parent));
    }

    function decrementListenerCount(current, count, name) {
      do {
        current.$$listenerCount[name] -= count;

        if (current.$$listenerCount[name] === 0) {
          delete current.$$listenerCount[name];
        }
      } while ((current = current.$parent));
    }

    /**
     * function used as an initial value for watchers.
     * because it's unique we can easily tell it apart from other values
     */
    function initWatchVal() {}

    function flushApplyAsync() {
      while (applyAsyncQueue.length) {
        try {
          applyAsyncQueue.shift()();
        } catch (e) {
          $exceptionHandler(e);
        }
      }
      applyAsyncId = null;
    }

    function scheduleApplyAsync() {
      if (applyAsyncId === null) {
        applyAsyncId = $browser.defer(function() {
          $rootScope.$apply(flushApplyAsync);
        }, null, '$applyAsync');
      }
    }
  }];
}

/**
 * @ngdoc service
 * @name $rootElement
 *
 * @description
 * The root element of AngularJS application. This is either the element where {@link
 * ng.directive:ngApp ngApp} was declared or the element passed into
 * {@link angular.bootstrap}. The element represents the root element of application. It is also the
 * location where the application's {@link auto.$injector $injector} service gets
 * published, and can be retrieved using `$rootElement.injector()`.
 */


// the implementation is in angular.bootstrap

/**
 * @this
 * @description
 * Private service to sanitize uris for links and images. Used by $compile and $sanitize.
 */
function $$SanitizeUriProvider() {

  var aHrefSanitizationTrustedUrlList = /^\s*(https?|s?ftp|mailto|tel|file):/,
    imgSrcSanitizationTrustedUrlList = /^\s*((https?|ftp|file|blob):|data:image\/)/;

  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for determining trusted safe
   * urls during a[href] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via HTML anchor links.
   *
   * Any url due to be assigned to an `a[href]` attribute via interpolation is marked as requiring
   * the $sce.URL security context. When interpolation occurs a call is made to `$sce.trustAsUrl(url)`
   * which in turn may call `$$sanitizeUri(url, isMedia)` to sanitize the potentially malicious URL.
   *
   * If the URL matches the `aHrefSanitizationTrustedUrlList` regular expression, it is returned unchanged.
   *
   * If there is no match the URL is returned prefixed with `'unsafe:'` to ensure that when it is written
   * to the DOM it is inactive and potentially malicious code will not be executed.
   *
   * @param {RegExp=} regexp New regexp to trust urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.aHrefSanitizationTrustedUrlList = function(regexp) {
    if (isDefined(regexp)) {
      aHrefSanitizationTrustedUrlList = regexp;
      return this;
    }
    return aHrefSanitizationTrustedUrlList;
  };


  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for determining trusted safe
   * urls during img[src] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via HTML image src links.
   *
   * Any URL due to be assigned to an `img[src]` attribute via interpolation is marked as requiring
   * the $sce.MEDIA_URL security context. When interpolation occurs a call is made to
   * `$sce.trustAsMediaUrl(url)` which in turn may call `$$sanitizeUri(url, isMedia)` to sanitize
   * the potentially malicious URL.
   *
   * If the URL matches the `imgSrcSanitizationTrustedUrlList` regular expression, it is returned
   * unchanged.
   *
   * If there is no match the URL is returned prefixed with `'unsafe:'` to ensure that when it is written
   * to the DOM it is inactive and potentially malicious code will not be executed.
   *
   * @param {RegExp=} regexp New regexp to trust urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.imgSrcSanitizationTrustedUrlList = function(regexp) {
    if (isDefined(regexp)) {
      imgSrcSanitizationTrustedUrlList = regexp;
      return this;
    }
    return imgSrcSanitizationTrustedUrlList;
  };

  this.$get = function() {
    return function sanitizeUri(uri, isMediaUrl) {
      // if (!uri) return uri;
      var regex = isMediaUrl ? imgSrcSanitizationTrustedUrlList : aHrefSanitizationTrustedUrlList;
      var normalizedVal = urlResolve(uri && uri.trim()).href;
      if (normalizedVal !== '' && !normalizedVal.match(regex)) {
        return 'unsafe:' + normalizedVal;
      }
      return uri;
    };
  };
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* exported $SceProvider, $SceDelegateProvider */

var $sceMinErr = minErr('$sce');

var SCE_CONTEXTS = {
  // HTML is used when there's HTML rendered (e.g. ng-bind-html, iframe srcdoc binding).
  HTML: 'html',

  // Style statements or stylesheets. Currently unused in AngularJS.
  CSS: 'css',

  // An URL used in a context where it refers to the source of media, which are not expected to be run
  // as scripts, such as an image, audio, video, etc.
  MEDIA_URL: 'mediaUrl',

  // An URL used in a context where it does not refer to a resource that loads code.
  // A value that can be trusted as a URL can also trusted as a MEDIA_URL.
  URL: 'url',

  // RESOURCE_URL is a subtype of URL used where the referred-to resource could be interpreted as
  // code. (e.g. ng-include, script src binding, templateUrl)
  // A value that can be trusted as a RESOURCE_URL, can also trusted as a URL and a MEDIA_URL.
  RESOURCE_URL: 'resourceUrl',

  // Script. Currently unused in AngularJS.
  JS: 'js'
};

// Helper functions follow.

var UNDERSCORE_LOWERCASE_REGEXP = /_([a-z])/g;

function snakeToCamel(name) {
  return name
    .replace(UNDERSCORE_LOWERCASE_REGEXP, fnCamelCaseReplace);
}

function adjustMatcher(matcher) {
  if (matcher === 'self') {
    return matcher;
  } else if (isString(matcher)) {
    // Strings match exactly except for 2 wildcards - '*' and '**'.
    // '*' matches any character except those from the set ':/.?&'.
    // '**' matches any character (like .* in a RegExp).
    // More than 2 *'s raises an error as it's ill defined.
    if (matcher.indexOf('***') > -1) {
      throw $sceMinErr('iwcard',
          'Illegal sequence *** in string matcher.  String: {0}', matcher);
    }
    matcher = escapeForRegexp(matcher).
                  replace(/\\\*\\\*/g, '.*').
                  replace(/\\\*/g, '[^:/.?&;]*');
    return new RegExp('^' + matcher + '$');
  } else if (isRegExp(matcher)) {
    // The only other type of matcher allowed is a Regexp.
    // Match entire URL / disallow partial matches.
    // Flags are reset (i.e. no global, ignoreCase or multiline)
    return new RegExp('^' + matcher.source + '$');
  } else {
    throw $sceMinErr('imatcher',
        'Matchers may only be "self", string patterns or RegExp objects');
  }
}


function adjustMatchers(matchers) {
  var adjustedMatchers = [];
  if (isDefined(matchers)) {
    forEach(matchers, function(matcher) {
      adjustedMatchers.push(adjustMatcher(matcher));
    });
  }
  return adjustedMatchers;
}


/**
 * @ngdoc service
 * @name $sceDelegate
 * @kind function
 *
 * @description
 *
 * `$sceDelegate` is a service that is used by the `$sce` service to provide {@link ng.$sce Strict
 * Contextual Escaping (SCE)} services to AngularJS.
 *
 * For an overview of this service and the functionnality it provides in AngularJS, see the main
 * page for {@link ng.$sce SCE}. The current page is targeted for developers who need to alter how
 * SCE works in their application, which shouldn't be needed in most cases.
 *
 * <div class="alert alert-danger">
 * AngularJS strongly relies on contextual escaping for the security of bindings: disabling or
 * modifying this might cause cross site scripting (XSS) vulnerabilities. For libraries owners,
 * changes to this service will also influence users, so be extra careful and document your changes.
 * </div>
 *
 * Typically, you would configure or override the {@link ng.$sceDelegate $sceDelegate} instead of
 * the `$sce` service to customize the way Strict Contextual Escaping works in AngularJS.  This is
 * because, while the `$sce` provides numerous shorthand methods, etc., you really only need to
 * override 3 core functions (`trustAs`, `getTrusted` and `valueOf`) to replace the way things
 * work because `$sce` delegates to `$sceDelegate` for these operations.
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} to configure this service.
 *
 * The default instance of `$sceDelegate` should work out of the box with little pain.  While you
 * can override it completely to change the behavior of `$sce`, the common case would
 * involve configuring the {@link ng.$sceDelegateProvider $sceDelegateProvider} instead by setting
 * your own trusted and banned resource lists for trusting URLs used for loading AngularJS resources
 * such as templates.  Refer {@link ng.$sceDelegateProvider#trustedResourceUrlList
 * $sceDelegateProvider.trustedResourceUrlList} and {@link
 * ng.$sceDelegateProvider#bannedResourceUrlList $sceDelegateProvider.bannedResourceUrlList}
 */

/**
 * @ngdoc provider
 * @name $sceDelegateProvider
 * @this
 *
 * @description
 *
 * The `$sceDelegateProvider` provider allows developers to configure the {@link ng.$sceDelegate
 * $sceDelegate service}, used as a delegate for {@link ng.$sce Strict Contextual Escaping (SCE)}.
 *
 * The `$sceDelegateProvider` allows one to get/set the `trustedResourceUrlList` and
 * `bannedResourceUrlList` used to ensure that the URLs used for sourcing AngularJS templates and
 * other script-running URLs are safe (all places that use the `$sce.RESOURCE_URL` context). See
 * {@link ng.$sceDelegateProvider#trustedResourceUrlList
 * $sceDelegateProvider.trustedResourceUrlList} and
 * {@link ng.$sceDelegateProvider#bannedResourceUrlList $sceDelegateProvider.bannedResourceUrlList},
 *
 * For the general details about this service in AngularJS, read the main page for {@link ng.$sce
 * Strict Contextual Escaping (SCE)}.
 *
 * **Example**:  Consider the following case. <a name="example"></a>
 *
 * - your app is hosted at url `http://myapp.example.com/`
 * - but some of your templates are hosted on other domains you control such as
 *   `http://srv01.assets.example.com/`, `http://srv02.assets.example.com/`, etc.
 * - and you have an open redirect at `http://myapp.example.com/clickThru?...`.
 *
 * Here is what a secure configuration for this scenario might look like:
 *
 * ```
 *  angular.module('myApp', []).config(function($sceDelegateProvider) {
 *    $sceDelegateProvider.trustedResourceUrlList([
 *      // Allow same origin resource loads.
 *      'self',
 *      // Allow loading from our assets domain.  Notice the difference between * and **.
 *      'http://srv*.assets.example.com/**'
 *    ]);
 *
 *    // The banned resource URL list overrides the trusted resource URL list so the open redirect
 *    // here is blocked.
 *    $sceDelegateProvider.bannedResourceUrlList([
 *      'http://myapp.example.com/clickThru**'
 *    ]);
 *  });
 * ```
 * Note that an empty trusted resource URL list will block every resource URL from being loaded, and will require
 * you to manually mark each one as trusted with `$sce.trustAsResourceUrl`. However, templates
 * requested by {@link ng.$templateRequest $templateRequest} that are present in
 * {@link ng.$templateCache $templateCache} will not go through this check. If you have a mechanism
 * to populate your templates in that cache at config time, then it is a good idea to remove 'self'
 * from the trusted resource URL lsit. This helps to mitigate the security impact of certain types
 * of issues, like for instance attacker-controlled `ng-includes`.
 */

function $SceDelegateProvider() {
  this.SCE_CONTEXTS = SCE_CONTEXTS;

  // Resource URLs can also be trusted by policy.
  var trustedResourceUrlList = ['self'],
      bannedResourceUrlList = [];

  /**
   * @ngdoc method
   * @name $sceDelegateProvider#trustedResourceUrlList
   * @kind function
   *
   * @param {Array=} trustedResourceUrlList When provided, replaces the trustedResourceUrlList with
   *     the value provided.  This must be an array or null.  A snapshot of this array is used so
   *     further changes to the array are ignored.
   *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
   *     allowed in this array.
   *
   * @return {Array} The currently set trusted resource URL array.
   *
   * @description
   * Sets/Gets the list trusted of resource URLs.
   *
   * The **default value** when no `trustedResourceUrlList` has been explicitly set is `['self']`
   * allowing only same origin resource requests.
   *
   * <div class="alert alert-warning">
   * **Note:** the default `trustedResourceUrlList` of 'self' is not recommended if your app shares
   * its origin with other apps! It is a good idea to limit it to only your application's directory.
   * </div>
   */
  this.trustedResourceUrlList = function(value) {
    if (arguments.length) {
      trustedResourceUrlList = adjustMatchers(value);
    }
    return trustedResourceUrlList;
  };

  /**
   * @ngdoc method
   * @name $sceDelegateProvider#resourceUrlWhitelist
   * @kind function
   *
   * @deprecated
   * sinceVersion="1.8.1"
   *
   * This method is deprecated. Use {@link $sceDelegateProvider#trustedResourceUrlList
   * trustedResourceUrlList} instead.
   */
  Object.defineProperty(this, 'resourceUrlWhitelist', {
    get: function() {
      return this.trustedResourceUrlList;
    },
    set: function(value) {
      this.trustedResourceUrlList = value;
    }
  });

  /**
   * @ngdoc method
   * @name $sceDelegateProvider#bannedResourceUrlList
   * @kind function
   *
   * @param {Array=} bannedResourceUrlList When provided, replaces the `bannedResourceUrlList` with
   *     the value provided. This must be an array or null. A snapshot of this array is used so
   *     further changes to the array are ignored.</p><p>
   *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
   *     allowed in this array.</p><p>
   *     The typical usage for the `bannedResourceUrlList` is to **block
   *     [open redirects](http://cwe.mitre.org/data/definitions/601.html)** served by your domain as
   *     these would otherwise be trusted but actually return content from the redirected domain.
   *     </p><p>
   *     Finally, **the banned resource URL list overrides the trusted resource URL list** and has
   *     the final say.
   *
   * @return {Array} The currently set `bannedResourceUrlList` array.
   *
   * @description
   * Sets/Gets the `bannedResourceUrlList` of trusted resource URLs.
   *
   * The **default value** when no trusted resource URL list has been explicitly set is the empty
   * array (i.e. there is no `bannedResourceUrlList`.)
   */
  this.bannedResourceUrlList = function(value) {
    if (arguments.length) {
      bannedResourceUrlList = adjustMatchers(value);
    }
    return bannedResourceUrlList;
  };

  /**
   * @ngdoc method
   * @name $sceDelegateProvider#resourceUrlBlacklist
   * @kind function
   *
   * @deprecated
   * sinceVersion="1.8.1"
   *
   * This method is deprecated. Use {@link $sceDelegateProvider#bannedResourceUrlList
   * bannedResourceUrlList} instead.
   */
  Object.defineProperty(this, 'resourceUrlBlacklist', {
    get: function() {
      return this.bannedResourceUrlList;
    },
    set: function(value) {
      this.bannedResourceUrlList = value;
    }
  });

  this.$get = ['$injector', '$$sanitizeUri', function($injector, $$sanitizeUri) {

    var htmlSanitizer = function htmlSanitizer(html) {
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    };

    if ($injector.has('$sanitize')) {
      htmlSanitizer = $injector.get('$sanitize');
    }


    function matchUrl(matcher, parsedUrl) {
      if (matcher === 'self') {
        return urlIsSameOrigin(parsedUrl) || urlIsSameOriginAsBaseUrl(parsedUrl);
      } else {
        // definitely a regex.  See adjustMatchers()
        return !!matcher.exec(parsedUrl.href);
      }
    }

    function isResourceUrlAllowedByPolicy(url) {
      var parsedUrl = urlResolve(url.toString());
      var i, n, allowed = false;
      // Ensure that at least one item from the trusted resource URL list allows this url.
      for (i = 0, n = trustedResourceUrlList.length; i < n; i++) {
        if (matchUrl(trustedResourceUrlList[i], parsedUrl)) {
          allowed = true;
          break;
        }
      }
      if (allowed) {
        // Ensure that no item from the banned resource URL list has blocked this url.
        for (i = 0, n = bannedResourceUrlList.length; i < n; i++) {
          if (matchUrl(bannedResourceUrlList[i], parsedUrl)) {
            allowed = false;
            break;
          }
        }
      }
      return allowed;
    }

    function generateHolderType(Base) {
      var holderType = function TrustedValueHolderType(trustedValue) {
        this.$$unwrapTrustedValue = function() {
          return trustedValue;
        };
      };
      if (Base) {
        holderType.prototype = new Base();
      }
      holderType.prototype.valueOf = function sceValueOf() {
        return this.$$unwrapTrustedValue();
      };
      holderType.prototype.toString = function sceToString() {
        return this.$$unwrapTrustedValue().toString();
      };
      return holderType;
    }

    var trustedValueHolderBase = generateHolderType(),
        byType = {};

    byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.MEDIA_URL] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.URL] = generateHolderType(byType[SCE_CONTEXTS.MEDIA_URL]);
    byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);

    /**
     * @ngdoc method
     * @name $sceDelegate#trustAs
     *
     * @description
     * Returns a trusted representation of the parameter for the specified context. This trusted
     * object will later on be used as-is, without any security check, by bindings or directives
     * that require this security context.
     * For instance, marking a string as trusted for the `$sce.HTML` context will entirely bypass
     * the potential `$sanitize` call in corresponding `$sce.HTML` bindings or directives, such as
     * `ng-bind-html`. Note that in most cases you won't need to call this function: if you have the
     * sanitizer loaded, passing the value itself will render all the HTML that does not pose a
     * security risk.
     *
     * See {@link ng.$sceDelegate#getTrusted getTrusted} for the function that will consume those
     * trusted values, and {@link ng.$sce $sce} for general documentation about strict contextual
     * escaping.
     *
     * @param {string} type The context in which this value is safe for use, e.g. `$sce.URL`,
     *     `$sce.RESOURCE_URL`, `$sce.HTML`, `$sce.JS` or `$sce.CSS`.
     *
     * @param {*} value The value that should be considered trusted.
     * @return {*} A trusted representation of value, that can be used in the given context.
     */
    function trustAs(type, trustedValue) {
      var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (!Constructor) {
        throw $sceMinErr('icontext',
            'Attempted to trust a value in invalid context. Context: {0}; Value: {1}',
            type, trustedValue);
      }
      if (trustedValue === null || isUndefined(trustedValue) || trustedValue === '') {
        return trustedValue;
      }
      // All the current contexts in SCE_CONTEXTS happen to be strings.  In order to avoid trusting
      // mutable objects, we ensure here that the value passed in is actually a string.
      if (typeof trustedValue !== 'string') {
        throw $sceMinErr('itype',
            'Attempted to trust a non-string value in a content requiring a string: Context: {0}',
            type);
      }
      return new Constructor(trustedValue);
    }

    /**
     * @ngdoc method
     * @name $sceDelegate#valueOf
     *
     * @description
     * If the passed parameter had been returned by a prior call to {@link ng.$sceDelegate#trustAs
     * `$sceDelegate.trustAs`}, returns the value that had been passed to {@link
     * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}.
     *
     * If the passed parameter is not a value that had been returned by {@link
     * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}, it must be returned as-is.
     *
     * @param {*} value The result of a prior {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}
     *     call or anything else.
     * @return {*} The `value` that was originally provided to {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} if `value` is the result of such a call.  Otherwise, returns
     *     `value` unchanged.
     */
    function valueOf(maybeTrusted) {
      if (maybeTrusted instanceof trustedValueHolderBase) {
        return maybeTrusted.$$unwrapTrustedValue();
      } else {
        return maybeTrusted;
      }
    }

    /**
     * @ngdoc method
     * @name $sceDelegate#getTrusted
     *
     * @description
     * Given an object and a security context in which to assign it, returns a value that's safe to
     * use in this context, which was represented by the parameter. To do so, this function either
     * unwraps the safe type it has been given (for instance, a {@link ng.$sceDelegate#trustAs
     * `$sceDelegate.trustAs`} result), or it might try to sanitize the value given, depending on
     * the context and sanitizer availablility.
     *
     * The contexts that can be sanitized are $sce.MEDIA_URL, $sce.URL and $sce.HTML. The first two are available
     * by default, and the third one relies on the `$sanitize` service (which may be loaded through
     * the `ngSanitize` module). Furthermore, for $sce.RESOURCE_URL context, a plain string may be
     * accepted if the resource url policy defined by {@link ng.$sceDelegateProvider#trustedResourceUrlList
     * `$sceDelegateProvider.trustedResourceUrlList`} and {@link ng.$sceDelegateProvider#bannedResourceUrlList
     * `$sceDelegateProvider.bannedResourceUrlList`} accepts that resource.
     *
     * This function will throw if the safe type isn't appropriate for this context, or if the
     * value given cannot be accepted in the context (which might be caused by sanitization not
     * being available, or the value not being recognized as safe).
     *
     * <div class="alert alert-danger">
     * Disabling auto-escaping is extremely dangerous, it usually creates a Cross Site Scripting
     * (XSS) vulnerability in your application.
     * </div>
     *
     * @param {string} type The context in which this value is to be used (such as `$sce.HTML`).
     * @param {*} maybeTrusted The result of a prior {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} call, or anything else (which will not be considered trusted.)
     * @return {*} A version of the value that's safe to use in the given context, or throws an
     *     exception if this is impossible.
     */
    function getTrusted(type, maybeTrusted) {
      if (maybeTrusted === null || isUndefined(maybeTrusted) || maybeTrusted === '') {
        return maybeTrusted;
      }
      var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      // If maybeTrusted is a trusted class instance or subclass instance, then unwrap and return
      // as-is.
      if (constructor && maybeTrusted instanceof constructor) {
        return maybeTrusted.$$unwrapTrustedValue();
      }

      // If maybeTrusted is a trusted class instance but not of the correct trusted type
      // then unwrap it and allow it to pass through to the rest of the checks
      if (isFunction(maybeTrusted.$$unwrapTrustedValue)) {
        maybeTrusted = maybeTrusted.$$unwrapTrustedValue();
      }

      // If we get here, then we will either sanitize the value or throw an exception.
      if (type === SCE_CONTEXTS.MEDIA_URL || type === SCE_CONTEXTS.URL) {
        // we attempt to sanitize non-resource URLs
        return $$sanitizeUri(maybeTrusted.toString(), type === SCE_CONTEXTS.MEDIA_URL);
      } else if (type === SCE_CONTEXTS.RESOURCE_URL) {
        if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
          return maybeTrusted;
        } else {
          throw $sceMinErr('insecurl',
              'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}',
              maybeTrusted.toString());
        }
      } else if (type === SCE_CONTEXTS.HTML) {
        // htmlSanitizer throws its own error when no sanitizer is available.
        return htmlSanitizer(maybeTrusted);
      }
      // Default error when the $sce service has no way to make the input safe.
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    }

    return { trustAs: trustAs,
             getTrusted: getTrusted,
             valueOf: valueOf };
  }];
}


/**
 * @ngdoc provider
 * @name $sceProvider
 * @this
 *
 * @description
 *
 * The $sceProvider provider allows developers to configure the {@link ng.$sce $sce} service.
 * -   enable/disable Strict Contextual Escaping (SCE) in a module
 * -   override the default implementation with a custom delegate
 *
 * Read more about {@link ng.$sce Strict Contextual Escaping (SCE)}.
 */

/**
 * @ngdoc service
 * @name $sce
 * @kind function
 *
 * @description
 *
 * `$sce` is a service that provides Strict Contextual Escaping services to AngularJS.
 *
 * ## Strict Contextual Escaping
 *
 * Strict Contextual Escaping (SCE) is a mode in which AngularJS constrains bindings to only render
 * trusted values. Its goal is to assist in writing code in a way that (a) is secure by default, and
 * (b) makes auditing for security vulnerabilities such as XSS, clickjacking, etc. a lot easier.
 *
 * ### Overview
 *
 * To systematically block XSS security bugs, AngularJS treats all values as untrusted by default in
 * HTML or sensitive URL bindings. When binding untrusted values, AngularJS will automatically
 * run security checks on them (sanitizations, trusted URL resource, depending on context), or throw
 * when it cannot guarantee the security of the result. That behavior depends strongly on contexts:
 * HTML can be sanitized, but template URLs cannot, for instance.
 *
 * To illustrate this, consider the `ng-bind-html` directive. It renders its value directly as HTML:
 * we call that the *context*. When given an untrusted input, AngularJS will attempt to sanitize it
 * before rendering if a sanitizer is available, and throw otherwise. To bypass sanitization and
 * render the input as-is, you will need to mark it as trusted for that context before attempting
 * to bind it.
 *
 * As of version 1.2, AngularJS ships with SCE enabled by default.
 *
 * ### In practice
 *
 * Here's an example of a binding in a privileged context:
 *
 * ```
 * <input ng-model="userHtml" aria-label="User input">
 * <div ng-bind-html="userHtml"></div>
 * ```
 *
 * Notice that `ng-bind-html` is bound to `userHtml` controlled by the user.  With SCE
 * disabled, this application allows the user to render arbitrary HTML into the DIV, which would
 * be an XSS security bug. In a more realistic example, one may be rendering user comments, blog
 * articles, etc. via bindings. (HTML is just one example of a context where rendering user
 * controlled input creates security vulnerabilities.)
 *
 * For the case of HTML, you might use a library, either on the client side, or on the server side,
 * to sanitize unsafe HTML before binding to the value and rendering it in the document.
 *
 * How would you ensure that every place that used these types of bindings was bound to a value that
 * was sanitized by your library (or returned as safe for rendering by your server?)  How can you
 * ensure that you didn't accidentally delete the line that sanitized the value, or renamed some
 * properties/fields and forgot to update the binding to the sanitized value?
 *
 * To be secure by default, AngularJS makes sure bindings go through that sanitization, or
 * any similar validation process, unless there's a good reason to trust the given value in this
 * context.  That trust is formalized with a function call. This means that as a developer, you
 * can assume all untrusted bindings are safe. Then, to audit your code for binding security issues,
 * you just need to ensure the values you mark as trusted indeed are safe - because they were
 * received from your server, sanitized by your library, etc. You can organize your codebase to
 * help with this - perhaps allowing only the files in a specific directory to do this.
 * Ensuring that the internal API exposed by that code doesn't markup arbitrary values as safe then
 * becomes a more manageable task.
 *
 * In the case of AngularJS' SCE service, one uses {@link ng.$sce#trustAs $sce.trustAs}
 * (and shorthand methods such as {@link ng.$sce#trustAsHtml $sce.trustAsHtml}, etc.) to
 * build the trusted versions of your values.
 *
 * ### How does it work?
 *
 * In privileged contexts, directives and code will bind to the result of {@link ng.$sce#getTrusted
 * $sce.getTrusted(context, value)} rather than to the value directly.  Think of this function as
 * a way to enforce the required security context in your data sink. Directives use {@link
 * ng.$sce#parseAs $sce.parseAs} rather than `$parse` to watch attribute bindings, which performs
 * the {@link ng.$sce#getTrusted $sce.getTrusted} behind the scenes on non-constant literals. Also,
 * when binding without directives, AngularJS will understand the context of your bindings
 * automatically.
 *
 * As an example, {@link ng.directive:ngBindHtml ngBindHtml} uses {@link
 * ng.$sce#parseAsHtml $sce.parseAsHtml(binding expression)}.  Here's the actual code (slightly
 * simplified):
 *
 * ```
 * var ngBindHtmlDirective = ['$sce', function($sce) {
 *   return function(scope, element, attr) {
 *     scope.$watch($sce.parseAsHtml(attr.ngBindHtml), function(value) {
 *       element.html(value || '');
 *     });
 *   };
 * }];
 * ```
 *
 * ### Impact on loading templates
 *
 * This applies both to the {@link ng.directive:ngInclude `ng-include`} directive as well as
 * `templateUrl`'s specified by {@link guide/directive directives}.
 *
 * By default, AngularJS only loads templates from the same domain and protocol as the application
 * document.  This is done by calling {@link ng.$sce#getTrustedResourceUrl
 * $sce.getTrustedResourceUrl} on the template URL.  To load templates from other domains and/or
 * protocols, you may either add them to the {@link ng.$sceDelegateProvider#trustedResourceUrlList
 * trustedResourceUrlList} or {@link ng.$sce#trustAsResourceUrl wrap them} into trusted values.
 *
 * *Please note*:
 * The browser's
 * [Same Origin Policy](https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest)
 * and [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/)
 * policy apply in addition to this and may further restrict whether the template is successfully
 * loaded.  This means that without the right CORS policy, loading templates from a different domain
 * won't work on all browsers.  Also, loading templates from `file://` URL does not work on some
 * browsers.
 *
 * ### This feels like too much overhead
 *
 * It's important to remember that SCE only applies to interpolation expressions.
 *
 * If your expressions are constant literals, they're automatically trusted and you don't need to
 * call `$sce.trustAs` on them (e.g.
 * `<div ng-bind-html="'<b>implicitly trusted</b>'"></div>`) just works (remember to include the
 * `ngSanitize` module). The `$sceDelegate` will also use the `$sanitize` service if it is available
 * when binding untrusted values to `$sce.HTML` context.
 * AngularJS provides an implementation in `angular-sanitize.js`, and if you
 * wish to use it, you will also need to depend on the {@link ngSanitize `ngSanitize`} module in
 * your application.
 *
 * The included {@link ng.$sceDelegate $sceDelegate} comes with sane defaults to allow you to load
 * templates in `ng-include` from your application's domain without having to even know about SCE.
 * It blocks loading templates from other domains or loading templates over http from an https
 * served document.  You can change these by setting your own custom {@link
 * ng.$sceDelegateProvider#trustedResourceUrlList trusted resource URL list} and {@link
 * ng.$sceDelegateProvider#bannedResourceUrlList banned resource URL list} for matching such URLs.
 *
 * This significantly reduces the overhead.  It is far easier to pay the small overhead and have an
 * application that's secure and can be audited to verify that with much more ease than bolting
 * security onto an application later.
 *
 * <a name="contexts"></a>
 * ### What trusted context types are supported?
 *
 * | Context             | Notes          |
 * |---------------------|----------------|
 * | `$sce.HTML`         | For HTML that's safe to source into the application.  The {@link ng.directive:ngBindHtml ngBindHtml} directive uses this context for bindings. If an unsafe value is encountered and the {@link ngSanitize $sanitize} module is present this will sanitize the value instead of throwing an error. |
 * | `$sce.CSS`          | For CSS that's safe to source into the application.  Currently unused.  Feel free to use it in your own directives. |
 * | `$sce.MEDIA_URL`    | For URLs that are safe to render as media. Is automatically converted from string by sanitizing when needed. |
 * | `$sce.URL`          | For URLs that are safe to follow as links. Is automatically converted from string by sanitizing when needed. Note that `$sce.URL` makes a stronger statement about the URL than `$sce.MEDIA_URL` does and therefore contexts requiring values trusted for `$sce.URL` can be used anywhere that values trusted for `$sce.MEDIA_URL` are required.|
 * | `$sce.RESOURCE_URL` | For URLs that are not only safe to follow as links, but whose contents are also safe to include in your application.  Examples include `ng-include`, `src` / `ngSrc` bindings for tags other than `IMG` (e.g. `IFRAME`, `OBJECT`, etc.)  <br><br>Note that `$sce.RESOURCE_URL` makes a stronger statement about the URL than `$sce.URL` or `$sce.MEDIA_URL` do and therefore contexts requiring values trusted for `$sce.RESOURCE_URL` can be used anywhere that values trusted for `$sce.URL` or `$sce.MEDIA_URL` are required. <br><br> The {@link $sceDelegateProvider#trustedResourceUrlList $sceDelegateProvider#trustedResourceUrlList()} and {@link $sceDelegateProvider#bannedResourceUrlList $sceDelegateProvider#bannedResourceUrlList()} can be used to restrict trusted origins for `RESOURCE_URL` |
 * | `$sce.JS`           | For JavaScript that is safe to execute in your application's context.  Currently unused.  Feel free to use it in your own directives. |
 *
 *
 * <div class="alert alert-warning">
 * Be aware that, before AngularJS 1.7.0, `a[href]` and `img[src]` used to sanitize their
 * interpolated values directly rather than rely upon {@link ng.$sce#getTrusted `$sce.getTrusted`}.
 *
 * **As of 1.7.0, this is no longer the case.**
 *
 * Now such interpolations are marked as requiring `$sce.URL` (for `a[href]`) or `$sce.MEDIA_URL`
 * (for `img[src]`), so that the sanitization happens (via `$sce.getTrusted...`) when the `$interpolate`
 * service evaluates the expressions.
 * </div>
 *
 * There are no CSS or JS context bindings in AngularJS currently, so their corresponding `$sce.trustAs`
 * functions aren't useful yet. This might evolve.
 *
 * ### Format of items in {@link ng.$sceDelegateProvider#trustedResourceUrlList trustedResourceUrlList}/{@link ng.$sceDelegateProvider#bannedResourceUrlList bannedResourceUrlList} <a name="resourceUrlPatternItem"></a>
 *
 *  Each element in these arrays must be one of the following:
 *
 *  - **'self'**
 *    - The special **string**, `'self'`, can be used to match against all URLs of the **same
 *      domain** as the application document using the **same protocol**.
 *  - **String** (except the special value `'self'`)
 *    - The string is matched against the full *normalized / absolute URL* of the resource
 *      being tested (substring matches are not good enough.)
 *    - There are exactly **two wildcard sequences** - `*` and `**`.  All other characters
 *      match themselves.
 *    - `*`: matches zero or more occurrences of any character other than one of the following 6
 *      characters: '`:`', '`/`', '`.`', '`?`', '`&`' and '`;`'.  It's a useful wildcard for use
 *      for matching resource URL lists.
 *    - `**`: matches zero or more occurrences of *any* character.  As such, it's not
 *      appropriate for use in a scheme, domain, etc. as it would match too much.  (e.g.
 *      http://**.example.com/ would match http://evil.com/?ignore=.example.com/ and that might
 *      not have been the intention.)  Its usage at the very end of the path is ok.  (e.g.
 *      http://foo.example.com/templates/**).
 *  - **RegExp** (*see caveat below*)
 *    - *Caveat*:  While regular expressions are powerful and offer great flexibility,  their syntax
 *      (and all the inevitable escaping) makes them *harder to maintain*.  It's easy to
 *      accidentally introduce a bug when one updates a complex expression (imho, all regexes should
 *      have good test coverage).  For instance, the use of `.` in the regex is correct only in a
 *      small number of cases.  A `.` character in the regex used when matching the scheme or a
 *      subdomain could be matched against a `:` or literal `.` that was likely not intended.   It
 *      is highly recommended to use the string patterns and only fall back to regular expressions
 *      as a last resort.
 *    - The regular expression must be an instance of RegExp (i.e. not a string.)  It is
 *      matched against the **entire** *normalized / absolute URL* of the resource being tested
 *      (even when the RegExp did not have the `^` and `$` codes.)  In addition, any flags
 *      present on the RegExp (such as multiline, global, ignoreCase) are ignored.
 *    - If you are generating your JavaScript from some other templating engine (not
 *      recommended, e.g. in issue [#4006](https://github.com/angular/angular.js/issues/4006)),
 *      remember to escape your regular expression (and be aware that you might need more than
 *      one level of escaping depending on your templating engine and the way you interpolated
 *      the value.)  Do make use of your platform's escaping mechanism as it might be good
 *      enough before coding your own.  E.g. Ruby has
 *      [Regexp.escape(str)](http://www.ruby-doc.org/core-2.0.0/Regexp.html#method-c-escape)
 *      and Python has [re.escape](http://docs.python.org/library/re.html#re.escape).
 *      Javascript lacks a similar built in function for escaping.  Take a look at Google
 *      Closure library's [goog.string.regExpEscape(s)](
 *      http://docs.closure-library.googlecode.com/git/closure_goog_string_string.js.source.html#line962).
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} for an example.
 *
 * ### Show me an example using SCE.
 *
 * <example module="mySceApp" deps="angular-sanitize.js" name="sce-service">
 * <file name="index.html">
 *   <div ng-controller="AppController as myCtrl">
 *     <i ng-bind-html="myCtrl.explicitlyTrustedHtml" id="explicitlyTrustedHtml"></i><br><br>
 *     <b>User comments</b><br>
 *     By default, HTML that isn't explicitly trusted (e.g. Alice's comment) is sanitized when
 *     $sanitize is available.  If $sanitize isn't available, this results in an error instead of an
 *     exploit.
 *     <div class="well">
 *       <div ng-repeat="userComment in myCtrl.userComments">
 *         <b>{{userComment.name}}</b>:
 *         <span ng-bind-html="userComment.htmlComment" class="htmlComment"></span>
 *         <br>
 *       </div>
 *     </div>
 *   </div>
 * </file>
 *
 * <file name="script.js">
 *   angular.module('mySceApp', ['ngSanitize'])
 *     .controller('AppController', ['$http', '$templateCache', '$sce',
 *       function AppController($http, $templateCache, $sce) {
 *         var self = this;
 *         $http.get('test_data.json', {cache: $templateCache}).then(function(response) {
 *           self.userComments = response.data;
 *         });
 *         self.explicitlyTrustedHtml = $sce.trustAsHtml(
 *             '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
 *             'sanitization.&quot;">Hover over this text.</span>');
 *       }]);
 * </file>
 *
 * <file name="test_data.json">
 * [
 *   { "name": "Alice",
 *     "htmlComment":
 *         "<span onmouseover='this.textContent=\"PWN3D!\"'>Is <i>anyone</i> reading this?</span>"
 *   },
 *   { "name": "Bob",
 *     "htmlComment": "<i>Yes!</i>  Am I the only other one?"
 *   }
 * ]
 * </file>
 *
 * <file name="protractor.js" type="protractor">
 *   describe('SCE doc demo', function() {
 *     it('should sanitize untrusted values', function() {
 *       expect(element.all(by.css('.htmlComment')).first().getAttribute('innerHTML'))
 *           .toBe('<span>Is <i>anyone</i> reading this?</span>');
 *     });
 *
 *     it('should NOT sanitize explicitly trusted values', function() {
 *       expect(element(by.id('explicitlyTrustedHtml')).getAttribute('innerHTML')).toBe(
 *           '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
 *           'sanitization.&quot;">Hover over this text.</span>');
 *     });
 *   });
 * </file>
 * </example>
 *
 *
 *
 * ## Can I disable SCE completely?
 *
 * Yes, you can.  However, this is strongly discouraged.  SCE gives you a lot of security benefits
 * for little coding overhead.  It will be much harder to take an SCE disabled application and
 * either secure it on your own or enable SCE at a later stage.  It might make sense to disable SCE
 * for cases where you have a lot of existing code that was written before SCE was introduced and
 * you're migrating them a module at a time. Also do note that this is an app-wide setting, so if
 * you are writing a library, you will cause security bugs applications using it.
 *
 * That said, here's how you can completely disable SCE:
 *
 * ```
 * angular.module('myAppWithSceDisabledmyApp', []).config(function($sceProvider) {
 *   // Completely disable SCE.  For demonstration purposes only!
 *   // Do not use in new projects or libraries.
 *   $sceProvider.enabled(false);
 * });
 * ```
 *
 */

function $SceProvider() {
  var enabled = true;

  /**
   * @ngdoc method
   * @name $sceProvider#enabled
   * @kind function
   *
   * @param {boolean=} value If provided, then enables/disables SCE application-wide.
   * @return {boolean} True if SCE is enabled, false otherwise.
   *
   * @description
   * Enables/disables SCE and returns the current value.
   */
  this.enabled = function(value) {
    if (arguments.length) {
      enabled = !!value;
    }
    return enabled;
  };


  /* Design notes on the default implementation for SCE.
   *
   * The API contract for the SCE delegate
   * -------------------------------------
   * The SCE delegate object must provide the following 3 methods:
   *
   * - trustAs(contextEnum, value)
   *     This method is used to tell the SCE service that the provided value is OK to use in the
   *     contexts specified by contextEnum.  It must return an object that will be accepted by
   *     getTrusted() for a compatible contextEnum and return this value.
   *
   * - valueOf(value)
   *     For values that were not produced by trustAs(), return them as is.  For values that were
   *     produced by trustAs(), return the corresponding input value to trustAs.  Basically, if
   *     trustAs is wrapping the given values into some type, this operation unwraps it when given
   *     such a value.
   *
   * - getTrusted(contextEnum, value)
   *     This function should return the value that is safe to use in the context specified by
   *     contextEnum or throw and exception otherwise.
   *
   * NOTE: This contract deliberately does NOT state that values returned by trustAs() must be
   * opaque or wrapped in some holder object.  That happens to be an implementation detail.  For
   * instance, an implementation could maintain a registry of all trusted objects by context.  In
   * such a case, trustAs() would return the same object that was passed in.  getTrusted() would
   * return the same object passed in if it was found in the registry under a compatible context or
   * throw an exception otherwise.  An implementation might only wrap values some of the time based
   * on some criteria.  getTrusted() might return a value and not throw an exception for special
   * constants or objects even if not wrapped.  All such implementations fulfill this contract.
   *
   *
   * A note on the inheritance model for SCE contexts
   * ------------------------------------------------
   * I've used inheritance and made RESOURCE_URL wrapped types a subtype of URL wrapped types.  This
   * is purely an implementation details.
   *
   * The contract is simply this:
   *
   *     getTrusted($sce.RESOURCE_URL, value) succeeding implies that getTrusted($sce.URL, value)
   *     will also succeed.
   *
   * Inheritance happens to capture this in a natural way. In some future, we may not use
   * inheritance anymore. That is OK because no code outside of sce.js and sceSpecs.js would need to
   * be aware of this detail.
   */

  this.$get = ['$parse', '$sceDelegate', function(
                $parse,   $sceDelegate) {
    // Support: IE 9-11 only
    // Prereq: Ensure that we're not running in IE<11 quirks mode.  In that mode, IE < 11 allow
    // the "expression(javascript expression)" syntax which is insecure.
    if (enabled && msie < 8) {
      throw $sceMinErr('iequirks',
        'Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks ' +
        'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' +
        'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
    }

    var sce = shallowCopy(SCE_CONTEXTS);

    /**
     * @ngdoc method
     * @name $sce#isEnabled
     * @kind function
     *
     * @return {Boolean} True if SCE is enabled, false otherwise.  If you want to set the value, you
     *     have to do it at module config time on {@link ng.$sceProvider $sceProvider}.
     *
     * @description
     * Returns a boolean indicating if SCE is enabled.
     */
    sce.isEnabled = function() {
      return enabled;
    };
    sce.trustAs = $sceDelegate.trustAs;
    sce.getTrusted = $sceDelegate.getTrusted;
    sce.valueOf = $sceDelegate.valueOf;

    if (!enabled) {
      sce.trustAs = sce.getTrusted = function(type, value) { return value; };
      sce.valueOf = identity;
    }

    /**
     * @ngdoc method
     * @name $sce#parseAs
     *
     * @description
     * Converts AngularJS {@link guide/expression expression} into a function.  This is like {@link
     * ng.$parse $parse} and is identical when the expression is a literal constant.  Otherwise, it
     * wraps the expression in a call to {@link ng.$sce#getTrusted $sce.getTrusted(*type*,
     * *result*)}
     *
     * @param {string} type The SCE context in which this result will be used.
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */
    sce.parseAs = function sceParseAs(type, expr) {
      var parsed = $parse(expr);
      if (parsed.literal && parsed.constant) {
        return parsed;
      } else {
        return $parse(expr, function(value) {
          return sce.getTrusted(type, value);
        });
      }
    };

    /**
     * @ngdoc method
     * @name $sce#trustAs
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}. As such, returns a
     * wrapped object that represents your value, and the trust you have in its safety for the given
     * context. AngularJS can then use that value as-is in bindings of the specified secure context.
     * This is used in bindings for `ng-bind-html`, `ng-include`, and most `src` attribute
     * interpolations. See {@link ng.$sce $sce} for strict contextual escaping.
     *
     * @param {string} type The context in which this value is safe for use, e.g. `$sce.URL`,
     *     `$sce.RESOURCE_URL`, `$sce.HTML`, `$sce.JS` or `$sce.CSS`.
     *
     * @param {*} value The value that that should be considered trusted.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in the context you specified.
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsHtml
     *
     * @description
     * Shorthand method.  `$sce.trustAsHtml(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.HTML, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.HTML` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.HTML` context (like `ng-bind-html`).
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsCss
     *
     * @description
     * Shorthand method.  `$sce.trustAsCss(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.CSS, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.CSS` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant
     *     of your `value` in `$sce.CSS` context. This context is currently unused, so there are
     *     almost no reasons to use this function so far.
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsUrl
     *
     * @description
     * Shorthand method.  `$sce.trustAsUrl(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.URL, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.URL` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.URL` context. That context is currently unused, so there are almost no reasons
     *     to use this function so far.
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsResourceUrl
     *
     * @description
     * Shorthand method.  `$sce.trustAsResourceUrl(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.RESOURCE_URL` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.RESOURCE_URL` context (template URLs in `ng-include`, most `src` attribute
     *     bindings, ...)
     */

    /**
     * @ngdoc method
     * @name $sce#trustAsJs
     *
     * @description
     * Shorthand method.  `$sce.trustAsJs(value)` →
     *     {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs($sce.JS, value)`}
     *
     * @param {*} value The value to mark as trusted for `$sce.JS` context.
     * @return {*} A wrapped version of value that can be used as a trusted variant of your `value`
     *     in `$sce.JS` context. That context is currently unused, so there are almost no reasons to
     *     use this function so far.
     */

    /**
     * @ngdoc method
     * @name $sce#getTrusted
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted`}.  As such,
     * takes any input, and either returns a value that's safe to use in the specified context,
     * or throws an exception. This function is aware of trusted values created by the `trustAs`
     * function and its shorthands, and when contexts are appropriate, returns the unwrapped value
     * as-is. Finally, this function can also throw when there is no way to turn `maybeTrusted` in a
     * safe value (e.g., no sanitization is available or possible.)
     *
     * @param {string} type The context in which this value is to be used.
     * @param {*} maybeTrusted The result of a prior {@link ng.$sce#trustAs
     *     `$sce.trustAs`} call, or anything else (which will not be considered trusted.)
     * @return {*} A version of the value that's safe to use in the given context, or throws an
     *     exception if this is impossible.
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedHtml
     *
     * @description
     * Shorthand method.  `$sce.getTrustedHtml(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.HTML, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.HTML, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedCss
     *
     * @description
     * Shorthand method.  `$sce.getTrustedCss(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.CSS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.CSS, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedUrl
     *
     * @description
     * Shorthand method.  `$sce.getTrustedUrl(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.URL, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.URL, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedResourceUrl
     *
     * @description
     * Shorthand method.  `$sce.getTrustedResourceUrl(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to pass to `$sceDelegate.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.RESOURCE_URL, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#getTrustedJs
     *
     * @description
     * Shorthand method.  `$sce.getTrustedJs(value)` →
     *     {@link ng.$sceDelegate#getTrusted `$sceDelegate.getTrusted($sce.JS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @return {*} The return value of `$sce.getTrusted($sce.JS, value)`
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsHtml
     *
     * @description
     * Shorthand method.  `$sce.parseAsHtml(expression string)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.HTML, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsCss
     *
     * @description
     * Shorthand method.  `$sce.parseAsCss(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.CSS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsUrl
     *
     * @description
     * Shorthand method.  `$sce.parseAsUrl(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsResourceUrl
     *
     * @description
     * Shorthand method.  `$sce.parseAsResourceUrl(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.RESOURCE_URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    /**
     * @ngdoc method
     * @name $sce#parseAsJs
     *
     * @description
     * Shorthand method.  `$sce.parseAsJs(value)` →
     *     {@link ng.$sce#parseAs `$sce.parseAs($sce.JS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @return {function(context, locals)} A function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the
     *      strings are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values
     *      in `context`.
     */

    // Shorthand delegations.
    var parse = sce.parseAs,
        getTrusted = sce.getTrusted,
        trustAs = sce.trustAs;

    forEach(SCE_CONTEXTS, function(enumValue, name) {
      var lName = lowercase(name);
      sce[snakeToCamel('parse_as_' + lName)] = function(expr) {
        return parse(enumValue, expr);
      };
      sce[snakeToCamel('get_trusted_' + lName)] = function(value) {
        return getTrusted(enumValue, value);
      };
      sce[snakeToCamel('trust_as_' + lName)] = function(value) {
        return trustAs(enumValue, value);
      };
    });

    return sce;
  }];
}

/* exported $SnifferProvider */

/**
 * !!! This is an undocumented "private" service !!!
 *
 * @name $sniffer
 * @requires $window
 * @requires $document
 * @this
 *
 * @property {boolean} history Does the browser support html5 history api ?
 * @property {boolean} transitions Does the browser support CSS transition events ?
 * @property {boolean} animations Does the browser support CSS animation events ?
 *
 * @description
 * This is very simple implementation of testing browser's features.
 */
function $SnifferProvider() {
  this.$get = ['$window', '$document', function($window, $document) {
    var eventSupport = {},
        // Chrome Packaged Apps are not allowed to access `history.pushState`.
        // If not sandboxed, they can be detected by the presence of `chrome.app.runtime`
        // (see https://developer.chrome.com/apps/api_index). If sandboxed, they can be detected by
        // the presence of an extension runtime ID and the absence of other Chrome runtime APIs
        // (see https://developer.chrome.com/apps/manifest/sandbox).
        // (NW.js apps have access to Chrome APIs, but do support `history`.)
        isNw = $window.nw && $window.nw.process,
        isChromePackagedApp =
            !isNw &&
            $window.chrome &&
            ($window.chrome.app && $window.chrome.app.runtime ||
                !$window.chrome.app && $window.chrome.runtime && $window.chrome.runtime.id),
        hasHistoryPushState = !isChromePackagedApp && $window.history && $window.history.pushState,
        android =
          toInt((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
        boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
        document = $document[0] || {},
        bodyStyle = document.body && document.body.style,
        transitions = false,
        animations = false;

    if (bodyStyle) {
      // Support: Android <5, Blackberry Browser 10, default Chrome in Android 4.4.x
      // Mentioned browsers need a -webkit- prefix for transitions & animations.
      transitions = !!('transition' in bodyStyle || 'webkitTransition' in bodyStyle);
      animations = !!('animation' in bodyStyle || 'webkitAnimation' in bodyStyle);
    }


    return {
      // Android has history.pushState, but it does not update location correctly
      // so let's not use the history API at all.
      // http://code.google.com/p/android/issues/detail?id=17471
      // https://github.com/angular/angular.js/issues/904

      // older webkit browser (533.9) on Boxee box has exactly the same problem as Android has
      // so let's not use the history API also
      // We are purposefully using `!(android < 4)` to cover the case when `android` is undefined
      history: !!(hasHistoryPushState && !(android < 4) && !boxee),
      hasEvent: function(event) {
        // Support: IE 9-11 only
        // IE9 implements 'input' event it's so fubared that we rather pretend that it doesn't have
        // it. In particular the event is not fired when backspace or delete key are pressed or
        // when cut operation is performed.
        // IE10+ implements 'input' event but it erroneously fires under various situations,
        // e.g. when placeholder changes, or a form is focused.
        if (event === 'input' && msie) return false;

        if (isUndefined(eventSupport[event])) {
          var divElm = document.createElement('div');
          eventSupport[event] = 'on' + event in divElm;
        }

        return eventSupport[event];
      },
      csp: csp(),
      transitions: transitions,
      animations: animations,
      android: android
    };
  }];
}

var $templateRequestMinErr = minErr('$templateRequest');

/**
 * @ngdoc provider
 * @name $templateRequestProvider
 * @this
 *
 * @description
 * Used to configure the options passed to the {@link $http} service when making a template request.
 *
 * For example, it can be used for specifying the "Accept" header that is sent to the server, when
 * requesting a template.
 */
function $TemplateRequestProvider() {

  var httpOptions;

  /**
   * @ngdoc method
   * @name $templateRequestProvider#httpOptions
   * @description
   * The options to be passed to the {@link $http} service when making the request.
   * You can use this to override options such as the "Accept" header for template requests.
   *
   * The {@link $templateRequest} will set the `cache` and the `transformResponse` properties of the
   * options if not overridden here.
   *
   * @param {string=} value new value for the {@link $http} options.
   * @returns {string|self} Returns the {@link $http} options when used as getter and self if used as setter.
   */
  this.httpOptions = function(val) {
    if (val) {
      httpOptions = val;
      return this;
    }
    return httpOptions;
  };

  /**
   * @ngdoc service
   * @name $templateRequest
   *
   * @description
   * The `$templateRequest` service runs security checks then downloads the provided template using
   * `$http` and, upon success, stores the contents inside of `$templateCache`. If the HTTP request
   * fails or the response data of the HTTP request is empty, a `$compile` error will be thrown (the
   * exception can be thwarted by setting the 2nd parameter of the function to true). Note that the
   * contents of `$templateCache` are trusted, so the call to `$sce.getTrustedUrl(tpl)` is omitted
   * when `tpl` is of type string and `$templateCache` has the matching entry.
   *
   * If you want to pass custom options to the `$http` service, such as setting the Accept header you
   * can configure this via {@link $templateRequestProvider#httpOptions}.
   *
   * `$templateRequest` is used internally by {@link $compile}, {@link ngRoute.$route}, and directives such
   * as {@link ngInclude} to download and cache templates.
   *
   * 3rd party modules should use `$templateRequest` if their services or directives are loading
   * templates.
   *
   * @param {string|TrustedResourceUrl} tpl The HTTP request template URL
   * @param {boolean=} ignoreRequestError Whether or not to ignore the exception when the request fails or the template is empty
   *
   * @return {Promise} a promise for the HTTP response data of the given URL.
   *
   * @property {number} totalPendingRequests total amount of pending template requests being downloaded.
   */
  this.$get = ['$exceptionHandler', '$templateCache', '$http', '$q', '$sce',
    function($exceptionHandler, $templateCache, $http, $q, $sce) {

      function handleRequestFn(tpl, ignoreRequestError) {
        handleRequestFn.totalPendingRequests++;

        // We consider the template cache holds only trusted templates, so
        // there's no need to go through adding the template again to the trusted
        // resources for keys that already are included in there. This also makes
        // AngularJS accept any script directive, no matter its name. However, we
        // still need to unwrap trusted types.
        if (!isString(tpl) || isUndefined($templateCache.get(tpl))) {
          tpl = $sce.getTrustedResourceUrl(tpl);
        }

        var transformResponse = $http.defaults && $http.defaults.transformResponse;

        if (isArray(transformResponse)) {
          transformResponse = transformResponse.filter(function(transformer) {
            return transformer !== defaultHttpResponseTransform;
          });
        } else if (transformResponse === defaultHttpResponseTransform) {
          transformResponse = null;
        }

        return $http.get(tpl, extend({
            cache: $templateCache,
            transformResponse: transformResponse
          }, httpOptions))
          .finally(function() {
            handleRequestFn.totalPendingRequests--;
          })
          .then(function(response) {
            return $templateCache.put(tpl, response.data);
          }, handleError);

        function handleError(resp) {
          if (!ignoreRequestError) {
            resp = $templateRequestMinErr('tpload',
                'Failed to load template: {0} (HTTP status: {1} {2})',
                tpl, resp.status, resp.statusText);

            $exceptionHandler(resp);
          }

          return $q.reject(resp);
        }
      }

      handleRequestFn.totalPendingRequests = 0;

      return handleRequestFn;
    }
  ];
}

/** @this */
function $$TestabilityProvider() {
  this.$get = ['$rootScope', '$browser', '$location',
       function($rootScope,   $browser,   $location) {

    /**
     * @name $testability
     *
     * @description
     * The private $$testability service provides a collection of methods for use when debugging
     * or by automated test and debugging tools.
     */
    var testability = {};

    /**
     * @name $$testability#findBindings
     *
     * @description
     * Returns an array of elements that are bound (via ng-bind or {{}})
     * to expressions matching the input.
     *
     * @param {Element} element The element root to search from.
     * @param {string} expression The binding expression to match.
     * @param {boolean} opt_exactMatch If true, only returns exact matches
     *     for the expression. Filters and whitespace are ignored.
     */
    testability.findBindings = function(element, expression, opt_exactMatch) {
      var bindings = element.getElementsByClassName('ng-binding');
      var matches = [];
      forEach(bindings, function(binding) {
        var dataBinding = angular.element(binding).data('$binding');
        if (dataBinding) {
          forEach(dataBinding, function(bindingName) {
            if (opt_exactMatch) {
              var matcher = new RegExp('(^|\\s)' + escapeForRegexp(expression) + '(\\s|\\||$)');
              if (matcher.test(bindingName)) {
                matches.push(binding);
              }
            } else {
              if (bindingName.indexOf(expression) !== -1) {
                matches.push(binding);
              }
            }
          });
        }
      });
      return matches;
    };

    /**
     * @name $$testability#findModels
     *
     * @description
     * Returns an array of elements that are two-way found via ng-model to
     * expressions matching the input.
     *
     * @param {Element} element The element root to search from.
     * @param {string} expression The model expression to match.
     * @param {boolean} opt_exactMatch If true, only returns exact matches
     *     for the expression.
     */
    testability.findModels = function(element, expression, opt_exactMatch) {
      var prefixes = ['ng-', 'data-ng-', 'ng\\:'];
      for (var p = 0; p < prefixes.length; ++p) {
        var attributeEquals = opt_exactMatch ? '=' : '*=';
        var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
        var elements = element.querySelectorAll(selector);
        if (elements.length) {
          return elements;
        }
      }
    };

    /**
     * @name $$testability#getLocation
     *
     * @description
     * Shortcut for getting the location in a browser agnostic way. Returns
     *     the path, search, and hash. (e.g. /path?a=b#hash)
     */
    testability.getLocation = function() {
      return $location.url();
    };

    /**
     * @name $$testability#setLocation
     *
     * @description
     * Shortcut for navigating to a location without doing a full page reload.
     *
     * @param {string} url The location url (path, search and hash,
     *     e.g. /path?a=b#hash) to go to.
     */
    testability.setLocation = function(url) {
      if (url !== $location.url()) {
        $location.url(url);
        $rootScope.$digest();
      }
    };

    /**
     * @name $$testability#whenStable
     *
     * @description
     * Calls the callback when all pending tasks are completed.
     *
     * Types of tasks waited for include:
     * - Pending timeouts (via {@link $timeout}).
     * - Pending HTTP requests (via {@link $http}).
     * - In-progress route transitions (via {@link $route}).
     * - Pending tasks scheduled via {@link $rootScope#$applyAsync}.
     * - Pending tasks scheduled via {@link $rootScope#$evalAsync}.
     *   These include tasks scheduled via `$evalAsync()` indirectly (such as {@link $q} promises).
     *
     * @param {function} callback
     */
    testability.whenStable = function(callback) {
      $browser.notifyWhenNoOutstandingRequests(callback);
    };

    return testability;
  }];
}

var $timeoutMinErr = minErr('$timeout');

/** @this */
function $TimeoutProvider() {
  this.$get = ['$rootScope', '$browser', '$q', '$$q', '$exceptionHandler',
       function($rootScope,   $browser,   $q,   $$q,   $exceptionHandler) {

    var deferreds = {};


    /**
     * @ngdoc service
     * @name $timeout
     *
     * @description
     * AngularJS's wrapper for `window.setTimeout`. The `fn` function is wrapped into a try/catch
     * block and delegates any exceptions to
     * {@link ng.$exceptionHandler $exceptionHandler} service.
     *
     * The return value of calling `$timeout` is a promise, which will be resolved when
     * the delay has passed and the timeout function, if provided, is executed.
     *
     * To cancel a timeout request, call `$timeout.cancel(promise)`.
     *
     * In tests you can use {@link ngMock.$timeout `$timeout.flush()`} to
     * synchronously flush the queue of deferred functions.
     *
     * If you only want a promise that will be resolved after some specified delay
     * then you can call `$timeout` without the `fn` function.
     *
     * @param {function()=} fn A function, whose execution should be delayed.
     * @param {number=} [delay=0] Delay in milliseconds.
     * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
     *   will invoke `fn` within the {@link ng.$rootScope.Scope#$apply $apply} block.
     * @param {...*=} Pass additional parameters to the executed function.
     * @returns {Promise} Promise that will be resolved when the timeout is reached. The promise
     *   will be resolved with the return value of the `fn` function.
     *
     */
    function timeout(fn, delay, invokeApply) {
      if (!isFunction(fn)) {
        invokeApply = delay;
        delay = fn;
        fn = noop;
      }

      var args = sliceArgs(arguments, 3),
          skipApply = (isDefined(invokeApply) && !invokeApply),
          deferred = (skipApply ? $$q : $q).defer(),
          promise = deferred.promise,
          timeoutId;

      timeoutId = $browser.defer(function() {
        try {
          deferred.resolve(fn.apply(null, args));
        } catch (e) {
          deferred.reject(e);
          $exceptionHandler(e);
        } finally {
          delete deferreds[promise.$$timeoutId];
        }

        if (!skipApply) $rootScope.$apply();
      }, delay, '$timeout');

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;

      return promise;
    }


    /**
     * @ngdoc method
     * @name $timeout#cancel
     *
     * @description
     * Cancels a task associated with the `promise`. As a result of this, the promise will be
     * resolved with a rejection.
     *
     * @param {Promise=} promise Promise returned by the `$timeout` function.
     * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
     *   canceled.
     */
    timeout.cancel = function(promise) {
      if (!promise) return false;

      if (!promise.hasOwnProperty('$$timeoutId')) {
        throw $timeoutMinErr('badprom',
            '`$timeout.cancel()` called with a promise that was not generated by `$timeout()`.');
      }

      if (!deferreds.hasOwnProperty(promise.$$timeoutId)) return false;

      var id = promise.$$timeoutId;
      var deferred = deferreds[id];

      // Timeout cancels should not report an unhandled promise.
      markQExceptionHandled(deferred.promise);
      deferred.reject('canceled');
      delete deferreds[id];

      return $browser.defer.cancel(id);
    };

    return timeout;
  }];
}

// NOTE:  The usage of window and document instead of $window and $document here is
// deliberate.  This service depends on the specific behavior of anchor nodes created by the
// browser (resolving and parsing URLs) that is unlikely to be provided by mock objects and
// cause us to break tests.  In addition, when the browser resolves a URL for XHR, it
// doesn't know about mocked locations and resolves URLs to the real document - which is
// exactly the behavior needed here.  There is little value is mocking these out for this
// service.
var urlParsingNode = window.document.createElement('a');
var originUrl = urlResolve(window.location.href);
var baseUrlParsingNode;

urlParsingNode.href = 'http://[::1]';

// Support: IE 9-11 only, Edge 16-17 only (fixed in 18 Preview)
// IE/Edge don't wrap IPv6 addresses' hostnames in square brackets
// when parsed out of an anchor element.
var ipv6InBrackets = urlParsingNode.hostname === '[::1]';

/**
 *
 * Implementation Notes for non-IE browsers
 * ----------------------------------------
 * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
 * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
 * URL will be resolved into an absolute URL in the context of the application document.
 * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
 * properties are all populated to reflect the normalized URL.  This approach has wide
 * compatibility - Safari 1+, Mozilla 1+ etc.  See
 * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
 *
 * Implementation Notes for IE
 * ---------------------------
 * IE <= 10 normalizes the URL when assigned to the anchor node similar to the other
 * browsers.  However, the parsed components will not be set if the URL assigned did not specify
 * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
 * work around that by performing the parsing in a 2nd step by taking a previously normalized
 * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
 * properties such as protocol, hostname, port, etc.
 *
 * References:
 *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
 *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
 *   http://url.spec.whatwg.org/#urlutils
 *   https://github.com/angular/angular.js/pull/2902
 *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
 *
 * @kind function
 * @param {string|object} url The URL to be parsed. If `url` is not a string, it will be returned
 *     unchanged.
 * @description Normalizes and parses a URL.
 * @returns {object} Returns the normalized URL as a dictionary.
 *
 *   | member name   | Description                                                            |
 *   |---------------|------------------------------------------------------------------------|
 *   | href          | A normalized version of the provided URL if it was not an absolute URL |
 *   | protocol      | The protocol without the trailing colon                                |
 *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
 *   | search        | The search params, minus the question mark                             |
 *   | hash          | The hash string, minus the hash symbol                                 |
 *   | hostname      | The hostname                                                           |
 *   | port          | The port, without ":"                                                  |
 *   | pathname      | The pathname, beginning with "/"                                       |
 *
 */
function urlResolve(url) {
  if (!isString(url)) return url;

  var href = url;

  // Support: IE 9-11 only
  if (msie) {
    // Normalize before parse.  Refer Implementation Notes on why this is
    // done in two steps on IE.
    urlParsingNode.setAttribute('href', href);
    href = urlParsingNode.href;
  }

  urlParsingNode.setAttribute('href', href);

  var hostname = urlParsingNode.hostname;

  if (!ipv6InBrackets && hostname.indexOf(':') > -1) {
    hostname = '[' + hostname + ']';
  }

  return {
    href: urlParsingNode.href,
    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
    host: urlParsingNode.host,
    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
    hostname: hostname,
    port: urlParsingNode.port,
    pathname: (urlParsingNode.pathname.charAt(0) === '/')
      ? urlParsingNode.pathname
      : '/' + urlParsingNode.pathname
  };
}

/**
 * Parse a request URL and determine whether this is a same-origin request as the application
 * document.
 *
 * @param {string|object} requestUrl The url of the request as a string that will be resolved
 * or a parsed URL object.
 * @returns {boolean} Whether the request is for the same origin as the application document.
 */
function urlIsSameOrigin(requestUrl) {
  return urlsAreSameOrigin(requestUrl, originUrl);
}

/**
 * Parse a request URL and determine whether it is same-origin as the current document base URL.
 *
 * Note: The base URL is usually the same as the document location (`location.href`) but can
 * be overriden by using the `<base>` tag.
 *
 * @param {string|object} requestUrl The url of the request as a string that will be resolved
 * or a parsed URL object.
 * @returns {boolean} Whether the URL is same-origin as the document base URL.
 */
function urlIsSameOriginAsBaseUrl(requestUrl) {
  return urlsAreSameOrigin(requestUrl, getBaseUrl());
}

/**
 * Create a function that can check a URL's origin against a list of allowed/trusted origins.
 * The current location's origin is implicitly trusted.
 *
 * @param {string[]} trustedOriginUrls - A list of URLs (strings), whose origins are trusted.
 *
 * @returns {Function} - A function that receives a URL (string or parsed URL object) and returns
 *     whether it is of an allowed origin.
 */
function urlIsAllowedOriginFactory(trustedOriginUrls) {
  var parsedAllowedOriginUrls = [originUrl].concat(trustedOriginUrls.map(urlResolve));

  /**
   * Check whether the specified URL (string or parsed URL object) has an origin that is allowed
   * based on a list of trusted-origin URLs. The current location's origin is implicitly
   * trusted.
   *
   * @param {string|Object} requestUrl - The URL to be checked (provided as a string that will be
   *     resolved or a parsed URL object).
   *
   * @returns {boolean} - Whether the specified URL is of an allowed origin.
   */
  return function urlIsAllowedOrigin(requestUrl) {
    var parsedUrl = urlResolve(requestUrl);
    return parsedAllowedOriginUrls.some(urlsAreSameOrigin.bind(null, parsedUrl));
  };
}

/**
 * Determine if two URLs share the same origin.
 *
 * @param {string|Object} url1 - First URL to compare as a string or a normalized URL in the form of
 *     a dictionary object returned by `urlResolve()`.
 * @param {string|object} url2 - Second URL to compare as a string or a normalized URL in the form
 *     of a dictionary object returned by `urlResolve()`.
 *
 * @returns {boolean} - True if both URLs have the same origin, and false otherwise.
 */
function urlsAreSameOrigin(url1, url2) {
  url1 = urlResolve(url1);
  url2 = urlResolve(url2);

  return (url1.protocol === url2.protocol &&
          url1.host === url2.host);
}

/**
 * Returns the current document base URL.
 * @returns {string}
 */
function getBaseUrl() {
  if (window.document.baseURI) {
    return window.document.baseURI;
  }

  // `document.baseURI` is available everywhere except IE
  if (!baseUrlParsingNode) {
    baseUrlParsingNode = window.document.createElement('a');
    baseUrlParsingNode.href = '.';

    // Work-around for IE bug described in Implementation Notes. The fix in `urlResolve()` is not
    // suitable here because we need to track changes to the base URL.
    baseUrlParsingNode = baseUrlParsingNode.cloneNode(false);
  }
  return baseUrlParsingNode.href;
}

/**
 * @ngdoc service
 * @name $window
 * @this
 *
 * @description
 * A reference to the browser's `window` object. While `window`
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. In AngularJS we always refer to it through the
 * `$window` service, so it may be overridden, removed or mocked for testing.
 *
 * Expressions, like the one defined for the `ngClick` directive in the example
 * below, are evaluated with respect to the current scope.  Therefore, there is
 * no risk of inadvertently coding in a dependency on a global value in such an
 * expression.
 *
 * @example
   <example module="windowExample" name="window-service">
     <file name="index.html">
       <script>
         angular.module('windowExample', [])
           .controller('ExampleController', ['$scope', '$window', function($scope, $window) {
             $scope.greeting = 'Hello, World!';
             $scope.doGreeting = function(greeting) {
               $window.alert(greeting);
             };
           }]);
       </script>
       <div ng-controller="ExampleController">
         <input type="text" ng-model="greeting" aria-label="greeting" />
         <button ng-click="doGreeting(greeting)">ALERT</button>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
      it('should display the greeting in the input box', function() {
       element(by.model('greeting')).sendKeys('Hello, E2E Tests');
       // If we click the button it will block the test runner
       // element(':button').click();
      });
     </file>
   </example>
 */
function $WindowProvider() {
  this.$get = valueFn(window);
}

/**
 * @name $$cookieReader
 * @requires $document
 *
 * @description
 * This is a private service for reading cookies used by $http and ngCookies
 *
 * @return {Object} a key/value map of the current cookies
 */
function $$CookieReader($document) {
  var rawDocument = $document[0] || {};
  var lastCookies = {};
  var lastCookieString = '';

  function safeGetCookie(rawDocument) {
    try {
      return rawDocument.cookie || '';
    } catch (e) {
      return '';
    }
  }

  function safeDecodeURIComponent(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }

  return function() {
    var cookieArray, cookie, i, index, name;
    var currentCookieString = safeGetCookie(rawDocument);

    if (currentCookieString !== lastCookieString) {
      lastCookieString = currentCookieString;
      cookieArray = lastCookieString.split('; ');
      lastCookies = {};

      for (i = 0; i < cookieArray.length; i++) {
        cookie = cookieArray[i];
        index = cookie.indexOf('=');
        if (index > 0) { //ignore nameless cookies
          name = safeDecodeURIComponent(cookie.substring(0, index));
          // the first value that is seen for a cookie is the most
          // specific one.  values for the same cookie name that
          // follow are for less specific paths.
          if (isUndefined(lastCookies[name])) {
            lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
          }
        }
      }
    }
    return lastCookies;
  };
}

$$CookieReader.$inject = ['$document'];

/** @this */
function $$CookieReaderProvider() {
  this.$get = $$CookieReader;
}

/* global currencyFilter: true,
 dateFilter: true,
 filterFilter: true,
 jsonFilter: true,
 limitToFilter: true,
 lowercaseFilter: true,
 numberFilter: true,
 orderByFilter: true,
 uppercaseFilter: true,
 */

/**
 * @ngdoc provider
 * @name $filterProvider
 * @description
 *
 * Filters are just functions which transform input to an output. However filters need to be
 * Dependency Injected. To achieve this a filter definition consists of a factory function which is
 * annotated with dependencies and is responsible for creating a filter function.
 *
 * <div class="alert alert-warning">
 * **Note:** Filter names must be valid AngularJS {@link expression} identifiers, such as `uppercase` or `orderBy`.
 * Names with special characters, such as hyphens and dots, are not allowed. If you wish to namespace
 * your filters, then you can use capitalization (`myappSubsectionFilterx`) or underscores
 * (`myapp_subsection_filterx`).
 * </div>
 *
 * ```js
 *   // Filter registration
 *   function MyModule($provide, $filterProvider) {
 *     // create a service to demonstrate injection (not always needed)
 *     $provide.value('greet', function(name){
 *       return 'Hello ' + name + '!';
 *     });
 *
 *     // register a filter factory which uses the
 *     // greet service to demonstrate DI.
 *     $filterProvider.register('greet', function(greet){
 *       // return the filter function which uses the greet service
 *       // to generate salutation
 *       return function(text) {
 *         // filters need to be forgiving so check input validity
 *         return text && greet(text) || text;
 *       };
 *     });
 *   }
 * ```
 *
 * The filter function is registered with the `$injector` under the filter name suffix with
 * `Filter`.
 *
 * ```js
 *   it('should be the same instance', inject(
 *     function($filterProvider) {
 *       $filterProvider.register('reverse', function(){
 *         return ...;
 *       });
 *     },
 *     function($filter, reverseFilter) {
 *       expect($filter('reverse')).toBe(reverseFilter);
 *     });
 * ```
 *
 *
 * For more information about how AngularJS filters work, and how to create your own filters, see
 * {@link guide/filter Filters} in the AngularJS Developer Guide.
 */

/**
 * @ngdoc service
 * @name $filter
 * @kind function
 * @description
 * Filters are used for formatting data displayed to the user.
 *
 * They can be used in view templates, controllers or services. AngularJS comes
 * with a collection of [built-in filters](api/ng/filter), but it is easy to
 * define your own as well.
 *
 * The general syntax in templates is as follows:
 *
 * ```html
 * {{ expression [| filter_name[:parameter_value] ... ] }}
 * ```
 *
 * @param {String} name Name of the filter function to retrieve
 * @return {Function} the filter function
 * @example
   <example name="$filter" module="filterExample">
     <file name="index.html">
       <div ng-controller="MainCtrl">
        <h3>{{ originalText }}</h3>
        <h3>{{ filteredText }}</h3>
       </div>
     </file>

     <file name="script.js">
      angular.module('filterExample', [])
      .controller('MainCtrl', function($scope, $filter) {
        $scope.originalText = 'hello';
        $scope.filteredText = $filter('uppercase')($scope.originalText);
      });
     </file>
   </example>
  */
$FilterProvider.$inject = ['$provide'];
/** @this */
function $FilterProvider($provide) {
  var suffix = 'Filter';

  /**
   * @ngdoc method
   * @name $filterProvider#register
   * @param {string|Object} name Name of the filter function, or an object map of filters where
   *    the keys are the filter names and the values are the filter factories.
   *
   *    <div class="alert alert-warning">
   *    **Note:** Filter names must be valid AngularJS {@link expression} identifiers, such as `uppercase` or `orderBy`.
   *    Names with special characters, such as hyphens and dots, are not allowed. If you wish to namespace
   *    your filters, then you can use capitalization (`myappSubsectionFilterx`) or underscores
   *    (`myapp_subsection_filterx`).
   *    </div>
    * @param {Function} factory If the first argument was a string, a factory function for the filter to be registered.
   * @returns {Object} Registered filter instance, or if a map of filters was provided then a map
   *    of the registered filter instances.
   */
  function register(name, factory) {
    if (isObject(name)) {
      var filters = {};
      forEach(name, function(filter, key) {
        filters[key] = register(key, filter);
      });
      return filters;
    } else {
      return $provide.factory(name + suffix, factory);
    }
  }
  this.register = register;

  this.$get = ['$injector', function($injector) {
    return function(name) {
      return $injector.get(name + suffix);
    };
  }];

  ////////////////////////////////////////

  /* global
    currencyFilter: false,
    dateFilter: false,
    filterFilter: false,
    jsonFilter: false,
    limitToFilter: false,
    lowercaseFilter: false,
    numberFilter: false,
    orderByFilter: false,
    uppercaseFilter: false
  */

  register('currency', currencyFilter);
  register('date', dateFilter);
  register('filter', filterFilter);
  register('json', jsonFilter);
  register('limitTo', limitToFilter);
  register('lowercase', lowercaseFilter);
  register('number', numberFilter);
  register('orderBy', orderByFilter);
  register('uppercase', uppercaseFilter);
}

/**
 * @ngdoc filter
 * @name filter
 * @kind function
 *
 * @description
 * Selects a subset of items from `array` and returns it as a new array.
 *
 * @param {Array} array The source array.
 * <div class="alert alert-info">
 *   **Note**: If the array contains objects that reference themselves, filtering is not possible.
 * </div>
 * @param {string|Object|function()} expression The predicate to be used for selecting items from
 *   `array`.
 *
 *   Can be one of:
 *
 *   - `string`: The string is used for matching against the contents of the `array`. All strings or
 *     objects with string properties in `array` that match this string will be returned. This also
 *     applies to nested object properties.
 *     The predicate can be negated by prefixing the string with `!`.
 *
 *   - `Object`: A pattern object can be used to filter specific properties on objects contained
 *     by `array`. For example `{name:"M", phone:"1"}` predicate will return an array of items
 *     which have property `name` containing "M" and property `phone` containing "1". A special
 *     property name (`$` by default) can be used (e.g. as in `{$: "text"}`) to accept a match
 *     against any property of the object or its nested object properties. That's equivalent to the
 *     simple substring match with a `string` as described above. The special property name can be
 *     overwritten, using the `anyPropertyKey` parameter.
 *     The predicate can be negated by prefixing the string with `!`.
 *     For example `{name: "!M"}` predicate will return an array of items which have property `name`
 *     not containing "M".
 *
 *     Note that a named property will match properties on the same level only, while the special
 *     `$` property will match properties on the same level or deeper. E.g. an array item like
 *     `{name: {first: 'John', last: 'Doe'}}` will **not** be matched by `{name: 'John'}`, but
 *     **will** be matched by `{$: 'John'}`.
 *
 *   - `function(value, index, array)`: A predicate function can be used to write arbitrary filters.
 *     The function is called for each element of the array, with the element, its index, and
 *     the entire array itself as arguments.
 *
 *     The final result is an array of those elements that the predicate returned true for.
 *
 * @param {function(actual, expected)|true|false} [comparator] Comparator which is used in
 *     determining if values retrieved using `expression` (when it is not a function) should be
 *     considered a match based on the expected value (from the filter expression) and actual
 *     value (from the object in the array).
 *
 *   Can be one of:
 *
 *   - `function(actual, expected)`:
 *     The function will be given the object value and the predicate value to compare and
 *     should return true if both values should be considered equal.
 *
 *   - `true`: A shorthand for `function(actual, expected) { return angular.equals(actual, expected)}`.
 *     This is essentially strict comparison of expected and actual.
 *
 *   - `false`: A short hand for a function which will look for a substring match in a case
 *     insensitive way. Primitive values are converted to strings. Objects are not compared against
 *     primitives, unless they have a custom `toString` method (e.g. `Date` objects).
 *
 *
 *   Defaults to `false`.
 *
 * @param {string} [anyPropertyKey] The special property name that matches against any property.
 *     By default `$`.
 *
 * @example
   <example name="filter-filter">
     <file name="index.html">
       <div ng-init="friends = [{name:'John', phone:'555-1276'},
                                {name:'Mary', phone:'800-BIG-MARY'},
                                {name:'Mike', phone:'555-4321'},
                                {name:'Adam', phone:'555-5678'},
                                {name:'Julie', phone:'555-8765'},
                                {name:'Juliette', phone:'555-5678'}]"></div>

       <label>Search: <input ng-model="searchText"></label>
       <table id="searchTextResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:searchText">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
       <hr>
       <label>Any: <input ng-model="search.$"></label> <br>
       <label>Name only <input ng-model="search.name"></label><br>
       <label>Phone only <input ng-model="search.phone"></label><br>
       <label>Equality <input type="checkbox" ng-model="strict"></label><br>
       <table id="searchObjResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friendObj in friends | filter:search:strict">
           <td>{{friendObj.name}}</td>
           <td>{{friendObj.phone}}</td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       var expectFriendNames = function(expectedNames, key) {
         element.all(by.repeater(key + ' in friends').column(key + '.name')).then(function(arr) {
           arr.forEach(function(wd, i) {
             expect(wd.getText()).toMatch(expectedNames[i]);
           });
         });
       };

       it('should search across all fields when filtering with a string', function() {
         var searchText = element(by.model('searchText'));
         searchText.clear();
         searchText.sendKeys('m');
         expectFriendNames(['Mary', 'Mike', 'Adam'], 'friend');

         searchText.clear();
         searchText.sendKeys('76');
         expectFriendNames(['John', 'Julie'], 'friend');
       });

       it('should search in specific fields when filtering with a predicate object', function() {
         var searchAny = element(by.model('search.$'));
         searchAny.clear();
         searchAny.sendKeys('i');
         expectFriendNames(['Mary', 'Mike', 'Julie', 'Juliette'], 'friendObj');
       });
       it('should use a equal comparison when comparator is true', function() {
         var searchName = element(by.model('search.name'));
         var strict = element(by.model('strict'));
         searchName.clear();
         searchName.sendKeys('Julie');
         strict.click();
         expectFriendNames(['Julie'], 'friendObj');
       });
     </file>
   </example>
 */

function filterFilter() {
  return function(array, expression, comparator, anyPropertyKey) {
    if (!isArrayLike(array)) {
      if (array == null) {
        return array;
      } else {
        throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
      }
    }

    anyPropertyKey = anyPropertyKey || '$';
    var expressionType = getTypeForFilter(expression);
    var predicateFn;
    var matchAgainstAnyProp;

    switch (expressionType) {
      case 'function':
        predicateFn = expression;
        break;
      case 'boolean':
      case 'null':
      case 'number':
      case 'string':
        matchAgainstAnyProp = true;
        // falls through
      case 'object':
        predicateFn = createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp);
        break;
      default:
        return array;
    }

    return Array.prototype.filter.call(array, predicateFn);
  };
}

// Helper functions for `filterFilter`
function createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp) {
  var shouldMatchPrimitives = isObject(expression) && (anyPropertyKey in expression);
  var predicateFn;

  if (comparator === true) {
    comparator = equals;
  } else if (!isFunction(comparator)) {
    comparator = function(actual, expected) {
      if (isUndefined(actual)) {
        // No substring matching against `undefined`
        return false;
      }
      if ((actual === null) || (expected === null)) {
        // No substring matching against `null`; only match against `null`
        return actual === expected;
      }
      if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) {
        // Should not compare primitives against objects, unless they have custom `toString` method
        return false;
      }

      actual = lowercase('' + actual);
      expected = lowercase('' + expected);
      return actual.indexOf(expected) !== -1;
    };
  }

  predicateFn = function(item) {
    if (shouldMatchPrimitives && !isObject(item)) {
      return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
    }
    return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
  };

  return predicateFn;
}

function deepCompare(actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) {
  var actualType = getTypeForFilter(actual);
  var expectedType = getTypeForFilter(expected);

  if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
    return !deepCompare(actual, expected.substring(1), comparator, anyPropertyKey, matchAgainstAnyProp);
  } else if (isArray(actual)) {
    // In case `actual` is an array, consider it a match
    // if ANY of it's items matches `expected`
    return actual.some(function(item) {
      return deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp);
    });
  }

  switch (actualType) {
    case 'object':
      var key;
      if (matchAgainstAnyProp) {
        for (key in actual) {
          // Under certain, rare, circumstances, key may not be a string and `charAt` will be undefined
          // See: https://github.com/angular/angular.js/issues/15644
          if (key.charAt && (key.charAt(0) !== '$') &&
              deepCompare(actual[key], expected, comparator, anyPropertyKey, true)) {
            return true;
          }
        }
        return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, anyPropertyKey, false);
      } else if (expectedType === 'object') {
        for (key in expected) {
          var expectedVal = expected[key];
          if (isFunction(expectedVal) || isUndefined(expectedVal)) {
            continue;
          }

          var matchAnyProperty = key === anyPropertyKey;
          var actualVal = matchAnyProperty ? actual : actual[key];
          if (!deepCompare(actualVal, expectedVal, comparator, anyPropertyKey, matchAnyProperty, matchAnyProperty)) {
            return false;
          }
        }
        return true;
      } else {
        return comparator(actual, expected);
      }
    case 'function':
      return false;
    default:
      return comparator(actual, expected);
  }
}

// Used for easily differentiating between `null` and actual `object`
function getTypeForFilter(val) {
  return (val === null) ? 'null' : typeof val;
}

var MAX_DIGITS = 22;
var DECIMAL_SEP = '.';
var ZERO_CHAR = '0';

/**
 * @ngdoc filter
 * @name currency
 * @kind function
 *
 * @description
 * Formats a number as a currency (ie $1,234.56). When no currency symbol is provided, default
 * symbol for current locale is used.
 *
 * @param {number} amount Input to filter.
 * @param {string=} symbol Currency symbol or identifier to be displayed.
 * @param {number=} fractionSize Number of decimal places to round the amount to, defaults to default max fraction size for current locale
 * @returns {string} Formatted number.
 *
 *
 * @example
   <example module="currencyExample" name="currency-filter">
     <file name="index.html">
       <script>
         angular.module('currencyExample', [])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.amount = 1234.56;
           }]);
       </script>
       <div ng-controller="ExampleController">
         <input type="number" ng-model="amount" aria-label="amount"> <br>
         default currency symbol ($): <span id="currency-default">{{amount | currency}}</span><br>
         custom currency identifier (USD$): <span id="currency-custom">{{amount | currency:"USD$"}}</span><br>
         no fractions (0): <span id="currency-no-fractions">{{amount | currency:"USD$":0}}</span>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
       it('should init with 1234.56', function() {
         expect(element(by.id('currency-default')).getText()).toBe('$1,234.56');
         expect(element(by.id('currency-custom')).getText()).toBe('USD$1,234.56');
         expect(element(by.id('currency-no-fractions')).getText()).toBe('USD$1,235');
       });
       it('should update', function() {
         if (browser.params.browser === 'safari') {
           // Safari does not understand the minus key. See
           // https://github.com/angular/protractor/issues/481
           return;
         }
         element(by.model('amount')).clear();
         element(by.model('amount')).sendKeys('-1234');
         expect(element(by.id('currency-default')).getText()).toBe('-$1,234.00');
         expect(element(by.id('currency-custom')).getText()).toBe('-USD$1,234.00');
         expect(element(by.id('currency-no-fractions')).getText()).toBe('-USD$1,234');
       });
     </file>
   </example>
 */
currencyFilter.$inject = ['$locale'];
function currencyFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(amount, currencySymbol, fractionSize) {
    if (isUndefined(currencySymbol)) {
      currencySymbol = formats.CURRENCY_SYM;
    }

    if (isUndefined(fractionSize)) {
      fractionSize = formats.PATTERNS[1].maxFrac;
    }

    // If the currency symbol is empty, trim whitespace around the symbol
    var currencySymbolRe = !currencySymbol ? /\s*\u00A4\s*/g : /\u00A4/g;

    // if null or undefined pass it through
    return (amount == null)
        ? amount
        : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).
            replace(currencySymbolRe, currencySymbol);
  };
}

/**
 * @ngdoc filter
 * @name number
 * @kind function
 *
 * @description
 * Formats a number as text.
 *
 * If the input is null or undefined, it will just be returned.
 * If the input is infinite (Infinity or -Infinity), the Infinity symbol '∞' or '-∞' is returned, respectively.
 * If the input is not a number an empty string is returned.
 *
 *
 * @param {number|string} number Number to format.
 * @param {(number|string)=} fractionSize Number of decimal places to round the number to.
 * If this is not provided then the fraction size is computed from the current locale's number
 * formatting pattern. In the case of the default locale, it will be 3.
 * @returns {string} Number rounded to `fractionSize` appropriately formatted based on the current
 *                   locale (e.g., in the en_US locale it will have "." as the decimal separator and
 *                   include "," group separators after each third digit).
 *
 * @example
   <example module="numberFilterExample" name="number-filter">
     <file name="index.html">
       <script>
         angular.module('numberFilterExample', [])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.val = 1234.56789;
           }]);
       </script>
       <div ng-controller="ExampleController">
         <label>Enter number: <input ng-model='val'></label><br>
         Default formatting: <span id='number-default'>{{val | number}}</span><br>
         No fractions: <span>{{val | number:0}}</span><br>
         Negative number: <span>{{-val | number:4}}</span>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
       it('should format numbers', function() {
         expect(element(by.id('number-default')).getText()).toBe('1,234.568');
         expect(element(by.binding('val | number:0')).getText()).toBe('1,235');
         expect(element(by.binding('-val | number:4')).getText()).toBe('-1,234.5679');
       });

       it('should update', function() {
         element(by.model('val')).clear();
         element(by.model('val')).sendKeys('3374.333');
         expect(element(by.id('number-default')).getText()).toBe('3,374.333');
         expect(element(by.binding('val | number:0')).getText()).toBe('3,374');
         expect(element(by.binding('-val | number:4')).getText()).toBe('-3,374.3330');
      });
     </file>
   </example>
 */
numberFilter.$inject = ['$locale'];
function numberFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(number, fractionSize) {

    // if null or undefined pass it through
    return (number == null)
        ? number
        : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP,
                       fractionSize);
  };
}

/**
 * Parse a number (as a string) into three components that can be used
 * for formatting the number.
 *
 * (Significant bits of this parse algorithm came from https://github.com/MikeMcl/big.js/)
 *
 * @param  {string} numStr The number to parse
 * @return {object} An object describing this number, containing the following keys:
 *  - d : an array of digits containing leading zeros as necessary
 *  - i : the number of the digits in `d` that are to the left of the decimal point
 *  - e : the exponent for numbers that would need more than `MAX_DIGITS` digits in `d`
 *
 */
function parse(numStr) {
  var exponent = 0, digits, numberOfIntegerDigits;
  var i, j, zeros;

  // Decimal point?
  if ((numberOfIntegerDigits = numStr.indexOf(DECIMAL_SEP)) > -1) {
    numStr = numStr.replace(DECIMAL_SEP, '');
  }

  // Exponential form?
  if ((i = numStr.search(/e/i)) > 0) {
    // Work out the exponent.
    if (numberOfIntegerDigits < 0) numberOfIntegerDigits = i;
    numberOfIntegerDigits += +numStr.slice(i + 1);
    numStr = numStr.substring(0, i);
  } else if (numberOfIntegerDigits < 0) {
    // There was no decimal point or exponent so it is an integer.
    numberOfIntegerDigits = numStr.length;
  }

  // Count the number of leading zeros.
  for (i = 0; numStr.charAt(i) === ZERO_CHAR; i++) { /* empty */ }

  if (i === (zeros = numStr.length)) {
    // The digits are all zero.
    digits = [0];
    numberOfIntegerDigits = 1;
  } else {
    // Count the number of trailing zeros
    zeros--;
    while (numStr.charAt(zeros) === ZERO_CHAR) zeros--;

    // Trailing zeros are insignificant so ignore them
    numberOfIntegerDigits -= i;
    digits = [];
    // Convert string to array of digits without leading/trailing zeros.
    for (j = 0; i <= zeros; i++, j++) {
      digits[j] = +numStr.charAt(i);
    }
  }

  // If the number overflows the maximum allowed digits then use an exponent.
  if (numberOfIntegerDigits > MAX_DIGITS) {
    digits = digits.splice(0, MAX_DIGITS - 1);
    exponent = numberOfIntegerDigits - 1;
    numberOfIntegerDigits = 1;
  }

  return { d: digits, e: exponent, i: numberOfIntegerDigits };
}

/**
 * Round the parsed number to the specified number of decimal places
 * This function changed the parsedNumber in-place
 */
function roundNumber(parsedNumber, fractionSize, minFrac, maxFrac) {
    var digits = parsedNumber.d;
    var fractionLen = digits.length - parsedNumber.i;

    // determine fractionSize if it is not specified; `+fractionSize` converts it to a number
    fractionSize = (isUndefined(fractionSize)) ? Math.min(Math.max(minFrac, fractionLen), maxFrac) : +fractionSize;

    // The index of the digit to where rounding is to occur
    var roundAt = fractionSize + parsedNumber.i;
    var digit = digits[roundAt];

    if (roundAt > 0) {
      // Drop fractional digits beyond `roundAt`
      digits.splice(Math.max(parsedNumber.i, roundAt));

      // Set non-fractional digits beyond `roundAt` to 0
      for (var j = roundAt; j < digits.length; j++) {
        digits[j] = 0;
      }
    } else {
      // We rounded to zero so reset the parsedNumber
      fractionLen = Math.max(0, fractionLen);
      parsedNumber.i = 1;
      digits.length = Math.max(1, roundAt = fractionSize + 1);
      digits[0] = 0;
      for (var i = 1; i < roundAt; i++) digits[i] = 0;
    }

    if (digit >= 5) {
      if (roundAt - 1 < 0) {
        for (var k = 0; k > roundAt; k--) {
          digits.unshift(0);
          parsedNumber.i++;
        }
        digits.unshift(1);
        parsedNumber.i++;
      } else {
        digits[roundAt - 1]++;
      }
    }

    // Pad out with zeros to get the required fraction length
    for (; fractionLen < Math.max(0, fractionSize); fractionLen++) digits.push(0);


    // Do any carrying, e.g. a digit was rounded up to 10
    var carry = digits.reduceRight(function(carry, d, i, digits) {
      d = d + carry;
      digits[i] = d % 10;
      return Math.floor(d / 10);
    }, 0);
    if (carry) {
      digits.unshift(carry);
      parsedNumber.i++;
    }
}

/**
 * Format a number into a string
 * @param  {number} number       The number to format
 * @param  {{
 *           minFrac, // the minimum number of digits required in the fraction part of the number
 *           maxFrac, // the maximum number of digits required in the fraction part of the number
 *           gSize,   // number of digits in each group of separated digits
 *           lgSize,  // number of digits in the last group of digits before the decimal separator
 *           negPre,  // the string to go in front of a negative number (e.g. `-` or `(`))
 *           posPre,  // the string to go in front of a positive number
 *           negSuf,  // the string to go after a negative number (e.g. `)`)
 *           posSuf   // the string to go after a positive number
 *         }} pattern
 * @param  {string} groupSep     The string to separate groups of number (e.g. `,`)
 * @param  {string} decimalSep   The string to act as the decimal separator (e.g. `.`)
 * @param  {[type]} fractionSize The size of the fractional part of the number
 * @return {string}              The number formatted as a string
 */
function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {

  if (!(isString(number) || isNumber(number)) || isNaN(number)) return '';

  var isInfinity = !isFinite(number);
  var isZero = false;
  var numStr = Math.abs(number) + '',
      formattedText = '',
      parsedNumber;

  if (isInfinity) {
    formattedText = '\u221e';
  } else {
    parsedNumber = parse(numStr);

    roundNumber(parsedNumber, fractionSize, pattern.minFrac, pattern.maxFrac);

    var digits = parsedNumber.d;
    var integerLen = parsedNumber.i;
    var exponent = parsedNumber.e;
    var decimals = [];
    isZero = digits.reduce(function(isZero, d) { return isZero && !d; }, true);

    // pad zeros for small numbers
    while (integerLen < 0) {
      digits.unshift(0);
      integerLen++;
    }

    // extract decimals digits
    if (integerLen > 0) {
      decimals = digits.splice(integerLen, digits.length);
    } else {
      decimals = digits;
      digits = [0];
    }

    // format the integer digits with grouping separators
    var groups = [];
    if (digits.length >= pattern.lgSize) {
      groups.unshift(digits.splice(-pattern.lgSize, digits.length).join(''));
    }
    while (digits.length > pattern.gSize) {
      groups.unshift(digits.splice(-pattern.gSize, digits.length).join(''));
    }
    if (digits.length) {
      groups.unshift(digits.join(''));
    }
    formattedText = groups.join(groupSep);

    // append the decimal digits
    if (decimals.length) {
      formattedText += decimalSep + decimals.join('');
    }

    if (exponent) {
      formattedText += 'e+' + exponent;
    }
  }
  if (number < 0 && !isZero) {
    return pattern.negPre + formattedText + pattern.negSuf;
  } else {
    return pattern.posPre + formattedText + pattern.posSuf;
  }
}

function padNumber(num, digits, trim, negWrap) {
  var neg = '';
  if (num < 0 || (negWrap && num <= 0)) {
    if (negWrap) {
      num = -num + 1;
    } else {
      num = -num;
      neg = '-';
    }
  }
  num = '' + num;
  while (num.length < digits) num = ZERO_CHAR + num;
  if (trim) {
    num = num.substr(num.length - digits);
  }
  return neg + num;
}


function dateGetter(name, size, offset, trim, negWrap) {
  offset = offset || 0;
  return function(date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset) {
      value += offset;
    }
    if (value === 0 && offset === -12) value = 12;
    return padNumber(value, size, trim, negWrap);
  };
}

function dateStrGetter(name, shortForm, standAlone) {
  return function(date, formats) {
    var value = date['get' + name]();
    var propPrefix = (standAlone ? 'STANDALONE' : '') + (shortForm ? 'SHORT' : '');
    var get = uppercase(propPrefix + name);

    return formats[get][value];
  };
}

function timeZoneGetter(date, formats, offset) {
  var zone = -1 * offset;
  var paddedZone = (zone >= 0) ? '+' : '';

  paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
                padNumber(Math.abs(zone % 60), 2);

  return paddedZone;
}

function getFirstThursdayOfYear(year) {
    // 0 = index of January
    var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
    // 4 = index of Thursday (+1 to account for 1st = 5)
    // 11 = index of *next* Thursday (+1 account for 1st = 12)
    return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
}

function getThursdayThisWeek(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(),
      // 4 = index of Thursday
      datetime.getDate() + (4 - datetime.getDay()));
}

function weekGetter(size) {
   return function(date) {
      var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
         thisThurs = getThursdayThisWeek(date);

      var diff = +thisThurs - +firstThurs,
         result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week

      return padNumber(result, size);
   };
}

function ampmGetter(date, formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

function eraGetter(date, formats) {
  return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
}

function longEraGetter(date, formats) {
  return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
}

var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4, 0, false, true),
    yy: dateGetter('FullYear', 2, 0, true, true),
     y: dateGetter('FullYear', 1, 0, false, true),
  MMMM: dateStrGetter('Month'),
   MMM: dateStrGetter('Month', true),
    MM: dateGetter('Month', 2, 1),
     M: dateGetter('Month', 1, 1),
  LLLL: dateStrGetter('Month', false, true),
    dd: dateGetter('Date', 2),
     d: dateGetter('Date', 1),
    HH: dateGetter('Hours', 2),
     H: dateGetter('Hours', 1),
    hh: dateGetter('Hours', 2, -12),
     h: dateGetter('Hours', 1, -12),
    mm: dateGetter('Minutes', 2),
     m: dateGetter('Minutes', 1),
    ss: dateGetter('Seconds', 2),
     s: dateGetter('Seconds', 1),
     // while ISO 8601 requires fractions to be prefixed with `.` or `,`
     // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
   sss: dateGetter('Milliseconds', 3),
  EEEE: dateStrGetter('Day'),
   EEE: dateStrGetter('Day', true),
     a: ampmGetter,
     Z: timeZoneGetter,
    ww: weekGetter(2),
     w: weekGetter(1),
     G: eraGetter,
     GG: eraGetter,
     GGG: eraGetter,
     GGGG: longEraGetter
};

var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/,
    NUMBER_STRING = /^-?\d+$/;

/**
 * @ngdoc filter
 * @name date
 * @kind function
 *
 * @description
 *   Formats `date` to a string based on the requested `format`.
 *
 *   `format` string can be composed of the following elements:
 *
 *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
 *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
 *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
 *   * `'MMMM'`: Month in year (January-December)
 *   * `'MMM'`: Month in year (Jan-Dec)
 *   * `'MM'`: Month in year, padded (01-12)
 *   * `'M'`: Month in year (1-12)
 *   * `'LLLL'`: Stand-alone month in year (January-December)
 *   * `'dd'`: Day in month, padded (01-31)
 *   * `'d'`: Day in month (1-31)
 *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
 *   * `'EEE'`: Day in Week, (Sun-Sat)
 *   * `'HH'`: Hour in day, padded (00-23)
 *   * `'H'`: Hour in day (0-23)
 *   * `'hh'`: Hour in AM/PM, padded (01-12)
 *   * `'h'`: Hour in AM/PM, (1-12)
 *   * `'mm'`: Minute in hour, padded (00-59)
 *   * `'m'`: Minute in hour (0-59)
 *   * `'ss'`: Second in minute, padded (00-59)
 *   * `'s'`: Second in minute (0-59)
 *   * `'sss'`: Millisecond in second, padded (000-999)
 *   * `'a'`: AM/PM marker
 *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
 *   * `'ww'`: Week of year, padded (00-53). Week 01 is the week with the first Thursday of the year
 *   * `'w'`: Week of year (0-53). Week 1 is the week with the first Thursday of the year
 *   * `'G'`, `'GG'`, `'GGG'`: The abbreviated form of the era string (e.g. 'AD')
 *   * `'GGGG'`: The long form of the era string (e.g. 'Anno Domini')
 *
 *   `format` string can also be one of the following predefined
 *   {@link guide/i18n localizable formats}:
 *
 *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
 *     (e.g. Sep 3, 2010 12:05:08 PM)
 *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 PM)
 *   * `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` for en_US  locale
 *     (e.g. Friday, September 3, 2010)
 *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
 *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
 *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
 *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 PM)
 *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 PM)
 *
 *   `format` string can contain literal values. These need to be escaped by surrounding with single quotes (e.g.
 *   `"h 'in the morning'"`). In order to output a single quote, escape it - i.e., two single quotes in a sequence
 *   (e.g. `"h 'o''clock'"`).
 *
 *   Any other characters in the `format` string will be output as-is.
 *
 * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
 *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its
 *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
 *    specified in the string input, the time is considered to be in the local timezone.
 * @param {string=} format Formatting rules (see Description). If not specified,
 *    `mediumDate` is used.
 * @param {string=} timezone Timezone to be used for formatting. It understands UTC/GMT and the
 *    continental US time zone abbreviations, but for general use, use a time zone offset, for
 *    example, `'+0430'` (4 hours, 30 minutes east of the Greenwich meridian)
 *    If not specified, the timezone of the browser will be used.
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.
 *
 * @example
   <example name="filter-date">
     <file name="index.html">
       <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
           <span>{{1288323623006 | date:'medium'}}</span><br>
       <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
          <span>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span><br>
       <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
          <span>{{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}</span><br>
       <span ng-non-bindable>{{1288323623006 | date:"MM/dd/yyyy 'at' h:mma"}}</span>:
          <span>{{'1288323623006' | date:"MM/dd/yyyy 'at' h:mma"}}</span><br>
     </file>
     <file name="protractor.js" type="protractor">
       it('should format date', function() {
         expect(element(by.binding("1288323623006 | date:'medium'")).getText()).
            toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
         expect(element(by.binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).getText()).
            toMatch(/2010-10-2\d \d{2}:\d{2}:\d{2} (-|\+)?\d{4}/);
         expect(element(by.binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).getText()).
            toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
         expect(element(by.binding("'1288323623006' | date:\"MM/dd/yyyy 'at' h:mma\"")).getText()).
            toMatch(/10\/2\d\/2010 at \d{1,2}:\d{2}(AM|PM)/);
       });
     </file>
   </example>
 */
dateFilter.$inject = ['$locale'];
function dateFilter($locale) {


  var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
                     // 1        2       3         4          5          6          7          8  9     10      11
  function jsonStringToDate(string) {
    var match;
    if ((match = string.match(R_ISO8601_STR))) {
      var date = new Date(0),
          tzHour = 0,
          tzMin  = 0,
          dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
          timeSetter = match[8] ? date.setUTCHours : date.setHours;

      if (match[9]) {
        tzHour = toInt(match[9] + match[10]);
        tzMin = toInt(match[9] + match[11]);
      }
      dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
      var h = toInt(match[4] || 0) - tzHour;
      var m = toInt(match[5] || 0) - tzMin;
      var s = toInt(match[6] || 0);
      var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
      timeSetter.call(date, h, m, s, ms);
      return date;
    }
    return string;
  }


  return function(date, format, timezone) {
    var text = '',
        parts = [],
        fn, match;

    format = format || 'mediumDate';
    format = $locale.DATETIME_FORMATS[format] || format;
    if (isString(date)) {
      date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
    }

    if (isNumber(date)) {
      date = new Date(date);
    }

    if (!isDate(date) || !isFinite(date.getTime())) {
      return date;
    }

    while (format) {
      match = DATE_FORMATS_SPLIT.exec(format);
      if (match) {
        parts = concat(parts, match, 1);
        format = parts.pop();
      } else {
        parts.push(format);
        format = null;
      }
    }

    var dateTimezoneOffset = date.getTimezoneOffset();
    if (timezone) {
      dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
      date = convertTimezoneToLocal(date, timezone, true);
    }
    forEach(parts, function(value) {
      fn = DATE_FORMATS[value];
      text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset)
                 : value === '\'\'' ? '\'' : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
    });

    return text;
  };
}


/**
 * @ngdoc filter
 * @name json
 * @kind function
 *
 * @description
 *   Allows you to convert a JavaScript object into JSON string.
 *
 *   This filter is mostly useful for debugging. When using the double curly {{value}} notation
 *   the binding is automatically converted to JSON.
 *
 * @param {*} object Any JavaScript object (including arrays and primitive types) to filter.
 * @param {number=} spacing The number of spaces to use per indentation, defaults to 2.
 * @returns {string} JSON string.
 *
 *
 * @example
   <example name="filter-json">
     <file name="index.html">
       <pre id="default-spacing">{{ {'name':'value'} | json }}</pre>
       <pre id="custom-spacing">{{ {'name':'value'} | json:4 }}</pre>
     </file>
     <file name="protractor.js" type="protractor">
       it('should jsonify filtered objects', function() {
         expect(element(by.id('default-spacing')).getText()).toMatch(/\{\n {2}"name": ?"value"\n}/);
         expect(element(by.id('custom-spacing')).getText()).toMatch(/\{\n {4}"name": ?"value"\n}/);
       });
     </file>
   </example>
 *
 */
function jsonFilter() {
  return function(object, spacing) {
    if (isUndefined(spacing)) {
        spacing = 2;
    }
    return toJson(object, spacing);
  };
}


/**
 * @ngdoc filter
 * @name lowercase
 * @kind function
 * @description
 * Converts string to lowercase.
 *
 * See the {@link ng.uppercase uppercase filter documentation} for a functionally identical example.
 *
 * @see angular.lowercase
 */
var lowercaseFilter = valueFn(lowercase);


/**
 * @ngdoc filter
 * @name uppercase
 * @kind function
 * @description
 * Converts string to uppercase.
 * @example
   <example module="uppercaseFilterExample" name="filter-uppercase">
     <file name="index.html">
       <script>
         angular.module('uppercaseFilterExample', [])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.title = 'This is a title';
           }]);
       </script>
       <div ng-controller="ExampleController">
         <!-- This title should be formatted normally -->
         <h1>{{title}}</h1>
         <!-- This title should be capitalized -->
         <h1>{{title | uppercase}}</h1>
       </div>
     </file>
   </example>
 */
var uppercaseFilter = valueFn(uppercase);

/**
 * @ngdoc filter
 * @name limitTo
 * @kind function
 *
 * @description
 * Creates a new array or string containing only a specified number of elements. The elements are
 * taken from either the beginning or the end of the source array, string or number, as specified by
 * the value and sign (positive or negative) of `limit`. Other array-like objects are also supported
 * (e.g. array subclasses, NodeLists, jqLite/jQuery collections etc). If a number is used as input,
 * it is converted to a string.
 *
 * @param {Array|ArrayLike|string|number} input - Array/array-like, string or number to be limited.
 * @param {string|number} limit - The length of the returned array or string. If the `limit` number
 *     is positive, `limit` number of items from the beginning of the source array/string are copied.
 *     If the number is negative, `limit` number  of items from the end of the source array/string
 *     are copied. The `limit` will be trimmed if it exceeds `array.length`. If `limit` is undefined,
 *     the input will be returned unchanged.
 * @param {(string|number)=} begin - Index at which to begin limitation. As a negative index,
 *     `begin` indicates an offset from the end of `input`. Defaults to `0`.
 * @returns {Array|string} A new sub-array or substring of length `limit` or less if the input had
 *     less than `limit` elements.
 *
 * @example
   <example module="limitToExample" name="limit-to-filter">
     <file name="index.html">
       <script>
         angular.module('limitToExample', [])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.numbers = [1,2,3,4,5,6,7,8,9];
             $scope.letters = "abcdefghi";
             $scope.longNumber = 2345432342;
             $scope.numLimit = 3;
             $scope.letterLimit = 3;
             $scope.longNumberLimit = 3;
           }]);
       </script>
       <div ng-controller="ExampleController">
         <label>
            Limit {{numbers}} to:
            <input type="number" step="1" ng-model="numLimit">
         </label>
         <p>Output numbers: {{ numbers | limitTo:numLimit }}</p>
         <label>
            Limit {{letters}} to:
            <input type="number" step="1" ng-model="letterLimit">
         </label>
         <p>Output letters: {{ letters | limitTo:letterLimit }}</p>
         <label>
            Limit {{longNumber}} to:
            <input type="number" step="1" ng-model="longNumberLimit">
         </label>
         <p>Output long number: {{ longNumber | limitTo:longNumberLimit }}</p>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
       var numLimitInput = element(by.model('numLimit'));
       var letterLimitInput = element(by.model('letterLimit'));
       var longNumberLimitInput = element(by.model('longNumberLimit'));
       var limitedNumbers = element(by.binding('numbers | limitTo:numLimit'));
       var limitedLetters = element(by.binding('letters | limitTo:letterLimit'));
       var limitedLongNumber = element(by.binding('longNumber | limitTo:longNumberLimit'));

       it('should limit the number array to first three items', function() {
         expect(numLimitInput.getAttribute('value')).toBe('3');
         expect(letterLimitInput.getAttribute('value')).toBe('3');
         expect(longNumberLimitInput.getAttribute('value')).toBe('3');
         expect(limitedNumbers.getText()).toEqual('Output numbers: [1,2,3]');
         expect(limitedLetters.getText()).toEqual('Output letters: abc');
         expect(limitedLongNumber.getText()).toEqual('Output long number: 234');
       });

       // There is a bug in safari and protractor that doesn't like the minus key
       // it('should update the output when -3 is entered', function() {
       //   numLimitInput.clear();
       //   numLimitInput.sendKeys('-3');
       //   letterLimitInput.clear();
       //   letterLimitInput.sendKeys('-3');
       //   longNumberLimitInput.clear();
       //   longNumberLimitInput.sendKeys('-3');
       //   expect(limitedNumbers.getText()).toEqual('Output numbers: [7,8,9]');
       //   expect(limitedLetters.getText()).toEqual('Output letters: ghi');
       //   expect(limitedLongNumber.getText()).toEqual('Output long number: 342');
       // });

       it('should not exceed the maximum size of input array', function() {
         numLimitInput.clear();
         numLimitInput.sendKeys('100');
         letterLimitInput.clear();
         letterLimitInput.sendKeys('100');
         longNumberLimitInput.clear();
         longNumberLimitInput.sendKeys('100');
         expect(limitedNumbers.getText()).toEqual('Output numbers: [1,2,3,4,5,6,7,8,9]');
         expect(limitedLetters.getText()).toEqual('Output letters: abcdefghi');
         expect(limitedLongNumber.getText()).toEqual('Output long number: 2345432342');
       });
     </file>
   </example>
*/
function limitToFilter() {
  return function(input, limit, begin) {
    if (Math.abs(Number(limit)) === Infinity) {
      limit = Number(limit);
    } else {
      limit = toInt(limit);
    }
    if (isNumberNaN(limit)) return input;

    if (isNumber(input)) input = input.toString();
    if (!isArrayLike(input)) return input;

    begin = (!begin || isNaN(begin)) ? 0 : toInt(begin);
    begin = (begin < 0) ? Math.max(0, input.length + begin) : begin;

    if (limit >= 0) {
      return sliceFn(input, begin, begin + limit);
    } else {
      if (begin === 0) {
        return sliceFn(input, limit, input.length);
      } else {
        return sliceFn(input, Math.max(0, begin + limit), begin);
      }
    }
  };
}

function sliceFn(input, begin, end) {
  if (isString(input)) return input.slice(begin, end);

  return slice.call(input, begin, end);
}

/**
 * @ngdoc filter
 * @name orderBy
 * @kind function
 *
 * @description
 * Returns an array containing the items from the specified `collection`, ordered by a `comparator`
 * function based on the values computed using the `expression` predicate.
 *
 * For example, `[{id: 'foo'}, {id: 'bar'}] | orderBy:'id'` would result in
 * `[{id: 'bar'}, {id: 'foo'}]`.
 *
 * The `collection` can be an Array or array-like object (e.g. NodeList, jQuery object, TypedArray,
 * String, etc).
 *
 * The `expression` can be a single predicate, or a list of predicates each serving as a tie-breaker
 * for the preceding one. The `expression` is evaluated against each item and the output is used
 * for comparing with other items.
 *
 * You can change the sorting order by setting `reverse` to `true`. By default, items are sorted in
 * ascending order.
 *
 * The comparison is done using the `comparator` function. If none is specified, a default, built-in
 * comparator is used (see below for details - in a nutshell, it compares numbers numerically and
 * strings alphabetically).
 *
 * ### Under the hood
 *
 * Ordering the specified `collection` happens in two phases:
 *
 * 1. All items are passed through the predicate (or predicates), and the returned values are saved
 *    along with their type (`string`, `number` etc). For example, an item `{label: 'foo'}`, passed
 *    through a predicate that extracts the value of the `label` property, would be transformed to:
 *    ```
 *    {
 *      value: 'foo',
 *      type: 'string',
 *      index: ...
 *    }
 *    ```
 *    **Note:** `null` values use `'null'` as their type.
 * 2. The comparator function is used to sort the items, based on the derived values, types and
 *    indices.
 *
 * If you use a custom comparator, it will be called with pairs of objects of the form
 * `{value: ..., type: '...', index: ...}` and is expected to return `0` if the objects are equal
 * (as far as the comparator is concerned), `-1` if the 1st one should be ranked higher than the
 * second, or `1` otherwise.
 *
 * In order to ensure that the sorting will be deterministic across platforms, if none of the
 * specified predicates can distinguish between two items, `orderBy` will automatically introduce a
 * dummy predicate that returns the item's index as `value`.
 * (If you are using a custom comparator, make sure it can handle this predicate as well.)
 *
 * If a custom comparator still can't distinguish between two items, then they will be sorted based
 * on their index using the built-in comparator.
 *
 * Finally, in an attempt to simplify things, if a predicate returns an object as the extracted
 * value for an item, `orderBy` will try to convert that object to a primitive value, before passing
 * it to the comparator. The following rules govern the conversion:
 *
 * 1. If the object has a `valueOf()` method that returns a primitive, its return value will be
 *    used instead.<br />
 *    (If the object has a `valueOf()` method that returns another object, then the returned object
 *    will be used in subsequent steps.)
 * 2. If the object has a custom `toString()` method (i.e. not the one inherited from `Object`) that
 *    returns a primitive, its return value will be used instead.<br />
 *    (If the object has a `toString()` method that returns another object, then the returned object
 *    will be used in subsequent steps.)
 * 3. No conversion; the object itself is used.
 *
 * ### The default comparator
 *
 * The default, built-in comparator should be sufficient for most usecases. In short, it compares
 * numbers numerically, strings alphabetically (and case-insensitively), for objects falls back to
 * using their index in the original collection, sorts values of different types by type and puts
 * `undefined` and `null` values at the end of the sorted list.
 *
 * More specifically, it follows these steps to determine the relative order of items:
 *
 * 1. If the compared values are of different types:
 *    - If one of the values is undefined, consider it "greater than" the other.
 *    - Else if one of the values is null, consider it "greater than" the other.
 *    - Else compare the types themselves alphabetically.
 * 2. If both values are of type `string`, compare them alphabetically in a case- and
 *    locale-insensitive way.
 * 3. If both values are objects, compare their indices instead.
 * 4. Otherwise, return:
 *    -  `0`, if the values are equal (by strict equality comparison, i.e. using `===`).
 *    - `-1`, if the 1st value is "less than" the 2nd value (compared using the `<` operator).
 *    -  `1`, otherwise.
 *
 * **Note:** If you notice numbers not being sorted as expected, make sure they are actually being
 *           saved as numbers and not strings.
 * **Note:** For the purpose of sorting, `null` and `undefined` are considered "greater than"
 *           any other value (with undefined "greater than" null). This effectively means that `null`
 *           and `undefined` values end up at the end of a list sorted in ascending order.
 * **Note:** `null` values use `'null'` as their type to be able to distinguish them from objects.
 *
 * @param {Array|ArrayLike} collection - The collection (array or array-like object) to sort.
 * @param {(Function|string|Array.<Function|string>)=} expression - A predicate (or list of
 *    predicates) to be used by the comparator to determine the order of elements.
 *
 *    Can be one of:
 *
 *    - `Function`: A getter function. This function will be called with each item as argument and
 *      the return value will be used for sorting.
 *    - `string`: An AngularJS expression. This expression will be evaluated against each item and the
 *      result will be used for sorting. For example, use `'label'` to sort by a property called
 *      `label` or `'label.substring(0, 3)'` to sort by the first 3 characters of the `label`
 *      property.<br />
 *      (The result of a constant expression is interpreted as a property name to be used for
 *      comparison. For example, use `'"special name"'` (note the extra pair of quotes) to sort by a
 *      property called `special name`.)<br />
 *      An expression can be optionally prefixed with `+` or `-` to control the sorting direction,
 *      ascending or descending. For example, `'+label'` or `'-label'`. If no property is provided,
 *      (e.g. `'+'` or `'-'`), the collection element itself is used in comparisons.
 *    - `Array`: An array of function and/or string predicates. If a predicate cannot determine the
 *      relative order of two items, the next predicate is used as a tie-breaker.
 *
 * **Note:** If the predicate is missing or empty then it defaults to `'+'`.
 *
 * @param {boolean=} reverse - If `true`, reverse the sorting order.
 * @param {(Function)=} comparator - The comparator function used to determine the relative order of
 *    value pairs. If omitted, the built-in comparator will be used.
 *
 * @returns {Array} - The sorted array.
 *
 *
 * @example
 * ### Ordering a table with `ngRepeat`
 *
 * The example below demonstrates a simple {@link ngRepeat ngRepeat}, where the data is sorted by
 * age in descending order (expression is set to `'-age'`). The `comparator` is not set, which means
 * it defaults to the built-in comparator.
 *
   <example name="orderBy-static" module="orderByExample1">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <table class="friends">
           <tr>
             <th>Name</th>
             <th>Phone Number</th>
             <th>Age</th>
           </tr>
           <tr ng-repeat="friend in friends | orderBy:'-age'">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </file>
     <file name="script.js">
       angular.module('orderByExample1', [])
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.friends = [
             {name: 'John',   phone: '555-1212',  age: 10},
             {name: 'Mary',   phone: '555-9876',  age: 19},
             {name: 'Mike',   phone: '555-4321',  age: 21},
             {name: 'Adam',   phone: '555-5678',  age: 35},
             {name: 'Julie',  phone: '555-8765',  age: 29}
           ];
         }]);
     </file>
     <file name="style.css">
       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var names = element.all(by.repeater('friends').column('friend.name'));

       it('should sort friends by age in reverse order', function() {
         expect(names.get(0).getText()).toBe('Adam');
         expect(names.get(1).getText()).toBe('Julie');
         expect(names.get(2).getText()).toBe('Mike');
         expect(names.get(3).getText()).toBe('Mary');
         expect(names.get(4).getText()).toBe('John');
       });
     </file>
   </example>
 * <hr />
 *
 * @example
 * ### Changing parameters dynamically
 *
 * All parameters can be changed dynamically. The next example shows how you can make the columns of
 * a table sortable, by binding the `expression` and `reverse` parameters to scope properties.
 *
   <example name="orderBy-dynamic" module="orderByExample2">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <pre>Sort by = {{propertyName}}; reverse = {{reverse}}</pre>
         <hr/>
         <button ng-click="propertyName = null; reverse = false">Set to unsorted</button>
         <hr/>
         <table class="friends">
           <tr>
             <th>
               <button ng-click="sortBy('name')">Name</button>
               <span class="sortorder" ng-show="propertyName === 'name'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('phone')">Phone Number</button>
               <span class="sortorder" ng-show="propertyName === 'phone'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('age')">Age</button>
               <span class="sortorder" ng-show="propertyName === 'age'" ng-class="{reverse: reverse}"></span>
             </th>
           </tr>
           <tr ng-repeat="friend in friends | orderBy:propertyName:reverse">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </file>
     <file name="script.js">
       angular.module('orderByExample2', [])
         .controller('ExampleController', ['$scope', function($scope) {
           var friends = [
             {name: 'John',   phone: '555-1212',  age: 10},
             {name: 'Mary',   phone: '555-9876',  age: 19},
             {name: 'Mike',   phone: '555-4321',  age: 21},
             {name: 'Adam',   phone: '555-5678',  age: 35},
             {name: 'Julie',  phone: '555-8765',  age: 29}
           ];

           $scope.propertyName = 'age';
           $scope.reverse = true;
           $scope.friends = friends;

           $scope.sortBy = function(propertyName) {
             $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
             $scope.propertyName = propertyName;
           };
         }]);
     </file>
     <file name="style.css">
       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }

       .sortorder:after {
         content: '\25b2';   // BLACK UP-POINTING TRIANGLE
       }
       .sortorder.reverse:after {
         content: '\25bc';   // BLACK DOWN-POINTING TRIANGLE
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var unsortButton = element(by.partialButtonText('unsorted'));
       var nameHeader = element(by.partialButtonText('Name'));
       var phoneHeader = element(by.partialButtonText('Phone'));
       var ageHeader = element(by.partialButtonText('Age'));
       var firstName = element(by.repeater('friends').column('friend.name').row(0));
       var lastName = element(by.repeater('friends').column('friend.name').row(4));

       it('should sort friends by some property, when clicking on the column header', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         phoneHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Mary');

         nameHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('Mike');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');
       });

       it('should sort friends in reverse order, when clicking on the same column', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');

         ageHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');
       });

       it('should restore the original order, when clicking "Set to unsorted"', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         unsortButton.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Julie');
       });
     </file>
   </example>
 * <hr />
 *
 * @example
 * ### Using `orderBy` inside a controller
 *
 * It is also possible to call the `orderBy` filter manually, by injecting `orderByFilter`, and
 * calling it with the desired parameters. (Alternatively, you could inject the `$filter` factory
 * and retrieve the `orderBy` filter with `$filter('orderBy')`.)
 *
   <example name="orderBy-call-manually" module="orderByExample3">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <pre>Sort by = {{propertyName}}; reverse = {{reverse}}</pre>
         <hr/>
         <button ng-click="sortBy(null)">Set to unsorted</button>
         <hr/>
         <table class="friends">
           <tr>
             <th>
               <button ng-click="sortBy('name')">Name</button>
               <span class="sortorder" ng-show="propertyName === 'name'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('phone')">Phone Number</button>
               <span class="sortorder" ng-show="propertyName === 'phone'" ng-class="{reverse: reverse}"></span>
             </th>
             <th>
               <button ng-click="sortBy('age')">Age</button>
               <span class="sortorder" ng-show="propertyName === 'age'" ng-class="{reverse: reverse}"></span>
             </th>
           </tr>
           <tr ng-repeat="friend in friends">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </file>
     <file name="script.js">
       angular.module('orderByExample3', [])
         .controller('ExampleController', ['$scope', 'orderByFilter', function($scope, orderBy) {
           var friends = [
             {name: 'John',   phone: '555-1212',  age: 10},
             {name: 'Mary',   phone: '555-9876',  age: 19},
             {name: 'Mike',   phone: '555-4321',  age: 21},
             {name: 'Adam',   phone: '555-5678',  age: 35},
             {name: 'Julie',  phone: '555-8765',  age: 29}
           ];

           $scope.propertyName = 'age';
           $scope.reverse = true;
           $scope.friends = orderBy(friends, $scope.propertyName, $scope.reverse);

           $scope.sortBy = function(propertyName) {
             $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                 ? !$scope.reverse : false;
             $scope.propertyName = propertyName;
             $scope.friends = orderBy(friends, $scope.propertyName, $scope.reverse);
           };
         }]);
     </file>
     <file name="style.css">
       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }

       .sortorder:after {
         content: '\25b2';   // BLACK UP-POINTING TRIANGLE
       }
       .sortorder.reverse:after {
         content: '\25bc';   // BLACK DOWN-POINTING TRIANGLE
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var unsortButton = element(by.partialButtonText('unsorted'));
       var nameHeader = element(by.partialButtonText('Name'));
       var phoneHeader = element(by.partialButtonText('Phone'));
       var ageHeader = element(by.partialButtonText('Age'));
       var firstName = element(by.repeater('friends').column('friend.name').row(0));
       var lastName = element(by.repeater('friends').column('friend.name').row(4));

       it('should sort friends by some property, when clicking on the column header', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         phoneHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Mary');

         nameHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('Mike');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');
       });

       it('should sort friends in reverse order, when clicking on the same column', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         ageHeader.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Adam');

         ageHeader.click();
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');
       });

       it('should restore the original order, when clicking "Set to unsorted"', function() {
         expect(firstName.getText()).toBe('Adam');
         expect(lastName.getText()).toBe('John');

         unsortButton.click();
         expect(firstName.getText()).toBe('John');
         expect(lastName.getText()).toBe('Julie');
       });
     </file>
   </example>
 * <hr />
 *
 * @example
 * ### Using a custom comparator
 *
 * If you have very specific requirements about the way items are sorted, you can pass your own
 * comparator function. For example, you might need to compare some strings in a locale-sensitive
 * way. (When specifying a custom comparator, you also need to pass a value for the `reverse`
 * argument - passing `false` retains the default sorting order, i.e. ascending.)
 *
   <example name="orderBy-custom-comparator" module="orderByExample4">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <div class="friends-container custom-comparator">
           <h3>Locale-sensitive Comparator</h3>
           <table class="friends">
             <tr>
               <th>Name</th>
               <th>Favorite Letter</th>
             </tr>
             <tr ng-repeat="friend in friends | orderBy:'favoriteLetter':false:localeSensitiveComparator">
               <td>{{friend.name}}</td>
               <td>{{friend.favoriteLetter}}</td>
             </tr>
           </table>
         </div>
         <div class="friends-container default-comparator">
           <h3>Default Comparator</h3>
           <table class="friends">
             <tr>
               <th>Name</th>
               <th>Favorite Letter</th>
             </tr>
             <tr ng-repeat="friend in friends | orderBy:'favoriteLetter'">
               <td>{{friend.name}}</td>
               <td>{{friend.favoriteLetter}}</td>
             </tr>
           </table>
         </div>
       </div>
     </file>
     <file name="script.js">
       angular.module('orderByExample4', [])
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.friends = [
             {name: 'John',   favoriteLetter: 'Ä'},
             {name: 'Mary',   favoriteLetter: 'Ü'},
             {name: 'Mike',   favoriteLetter: 'Ö'},
             {name: 'Adam',   favoriteLetter: 'H'},
             {name: 'Julie',  favoriteLetter: 'Z'}
           ];

           $scope.localeSensitiveComparator = function(v1, v2) {
             // If we don't get strings, just compare by index
             if (v1.type !== 'string' || v2.type !== 'string') {
               return (v1.index < v2.index) ? -1 : 1;
             }

             // Compare strings alphabetically, taking locale into account
             return v1.value.localeCompare(v2.value);
           };
         }]);
     </file>
     <file name="style.css">
       .friends-container {
         display: inline-block;
         margin: 0 30px;
       }

       .friends {
         border-collapse: collapse;
       }

       .friends th {
         border-bottom: 1px solid;
       }
       .friends td, .friends th {
         border-left: 1px solid;
         padding: 5px 10px;
       }
       .friends td:first-child, .friends th:first-child {
         border-left: none;
       }
     </file>
     <file name="protractor.js" type="protractor">
       // Element locators
       var container = element(by.css('.custom-comparator'));
       var names = container.all(by.repeater('friends').column('friend.name'));

       it('should sort friends by favorite letter (in correct alphabetical order)', function() {
         expect(names.get(0).getText()).toBe('John');
         expect(names.get(1).getText()).toBe('Adam');
         expect(names.get(2).getText()).toBe('Mike');
         expect(names.get(3).getText()).toBe('Mary');
         expect(names.get(4).getText()).toBe('Julie');
       });
     </file>
   </example>
 *
 */
orderByFilter.$inject = ['$parse'];
function orderByFilter($parse) {
  return function(array, sortPredicate, reverseOrder, compareFn) {

    if (array == null) return array;
    if (!isArrayLike(array)) {
      throw minErr('orderBy')('notarray', 'Expected array but received: {0}', array);
    }

    if (!isArray(sortPredicate)) { sortPredicate = [sortPredicate]; }
    if (sortPredicate.length === 0) { sortPredicate = ['+']; }

    var predicates = processPredicates(sortPredicate);

    var descending = reverseOrder ? -1 : 1;

    // Define the `compare()` function. Use a default comparator if none is specified.
    var compare = isFunction(compareFn) ? compareFn : defaultCompare;

    // The next three lines are a version of a Swartzian Transform idiom from Perl
    // (sometimes called the Decorate-Sort-Undecorate idiom)
    // See https://en.wikipedia.org/wiki/Schwartzian_transform
    var compareValues = Array.prototype.map.call(array, getComparisonObject);
    compareValues.sort(doComparison);
    array = compareValues.map(function(item) { return item.value; });

    return array;

    function getComparisonObject(value, index) {
      // NOTE: We are adding an extra `tieBreaker` value based on the element's index.
      // This will be used to keep the sort stable when none of the input predicates can
      // distinguish between two elements.
      return {
        value: value,
        tieBreaker: {value: index, type: 'number', index: index},
        predicateValues: predicates.map(function(predicate) {
          return getPredicateValue(predicate.get(value), index);
        })
      };
    }

    function doComparison(v1, v2) {
      for (var i = 0, ii = predicates.length; i < ii; i++) {
        var result = compare(v1.predicateValues[i], v2.predicateValues[i]);
        if (result) {
          return result * predicates[i].descending * descending;
        }
      }

      return (compare(v1.tieBreaker, v2.tieBreaker) || defaultCompare(v1.tieBreaker, v2.tieBreaker)) * descending;
    }
  };

  function processPredicates(sortPredicates) {
    return sortPredicates.map(function(predicate) {
      var descending = 1, get = identity;

      if (isFunction(predicate)) {
        get = predicate;
      } else if (isString(predicate)) {
        if ((predicate.charAt(0) === '+' || predicate.charAt(0) === '-')) {
          descending = predicate.charAt(0) === '-' ? -1 : 1;
          predicate = predicate.substring(1);
        }
        if (predicate !== '') {
          get = $parse(predicate);
          if (get.constant) {
            var key = get();
            get = function(value) { return value[key]; };
          }
        }
      }
      return {get: get, descending: descending};
    });
  }

  function isPrimitive(value) {
    switch (typeof value) {
      case 'number': /* falls through */
      case 'boolean': /* falls through */
      case 'string':
        return true;
      default:
        return false;
    }
  }

  function objectValue(value) {
    // If `valueOf` is a valid function use that
    if (isFunction(value.valueOf)) {
      value = value.valueOf();
      if (isPrimitive(value)) return value;
    }
    // If `toString` is a valid function and not the one from `Object.prototype` use that
    if (hasCustomToString(value)) {
      value = value.toString();
      if (isPrimitive(value)) return value;
    }

    return value;
  }

  function getPredicateValue(value, index) {
    var type = typeof value;
    if (value === null) {
      type = 'null';
    } else if (type === 'object') {
      value = objectValue(value);
    }
    return {value: value, type: type, index: index};
  }

  function defaultCompare(v1, v2) {
    var result = 0;
    var type1 = v1.type;
    var type2 = v2.type;

    if (type1 === type2) {
      var value1 = v1.value;
      var value2 = v2.value;

      if (type1 === 'string') {
        // Compare strings case-insensitively
        value1 = value1.toLowerCase();
        value2 = value2.toLowerCase();
      } else if (type1 === 'object') {
        // For basic objects, use the position of the object
        // in the collection instead of the value
        if (isObject(value1)) value1 = v1.index;
        if (isObject(value2)) value2 = v2.index;
      }

      if (value1 !== value2) {
        result = value1 < value2 ? -1 : 1;
      }
    } else {
      result = (type1 === 'undefined') ? 1 :
        (type2 === 'undefined') ? -1 :
        (type1 === 'null') ? 1 :
        (type2 === 'null') ? -1 :
        (type1 < type2) ? -1 : 1;
    }

    return result;
  }
}

function ngDirective(directive) {
  if (isFunction(directive)) {
    directive = {
      link: directive
    };
  }
  directive.restrict = directive.restrict || 'AC';
  return valueFn(directive);
}

/**
 * @ngdoc directive
 * @name a
 * @restrict E
 *
 * @description
 * Modifies the default behavior of the html a tag so that the default action is prevented when
 * the href attribute is empty.
 *
 * For dynamically creating `href` attributes for a tags, see the {@link ng.ngHref `ngHref`} directive.
 */
var htmlAnchorDirective = valueFn({
  restrict: 'E',
  compile: function(element, attr) {
    if (!attr.href && !attr.xlinkHref) {
      return function(scope, element) {
        // If the linked element is not an anchor tag anymore, do nothing
        if (element[0].nodeName.toLowerCase() !== 'a') return;

        // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
        var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ?
                   'xlink:href' : 'href';
        element.on('click', function(event) {
          // if we have no href url, then don't navigate anywhere.
          if (!element.attr(href)) {
            event.preventDefault();
          }
        });
      };
    }
  }
});

/**
 * @ngdoc directive
 * @name ngHref
 * @restrict A
 * @priority 99
 *
 * @description
 * Using AngularJS markup like `{{hash}}` in an href attribute will
 * make the link go to the wrong URL if the user clicks it before
 * AngularJS has a chance to replace the `{{hash}}` markup with its
 * value. Until AngularJS replaces the markup the link will be broken
 * and will most likely return a 404 error. The `ngHref` directive
 * solves this problem.
 *
 * The wrong way to write it:
 * ```html
 * <a href="http://www.gravatar.com/avatar/{{hash}}">link1</a>
 * ```
 *
 * The correct way to write it:
 * ```html
 * <a ng-href="http://www.gravatar.com/avatar/{{hash}}">link1</a>
 * ```
 *
 * @element A
 * @param {template} ngHref any string which can contain `{{}}` markup.
 *
 * @example
 * This example shows various combinations of `href`, `ng-href` and `ng-click` attributes
 * in links and their different behaviors:
    <example name="ng-href">
      <file name="index.html">
        <input ng-model="value" /><br />
        <a id="link-1" href ng-click="value = 1">link 1</a> (link, don't reload)<br />
        <a id="link-2" href="" ng-click="value = 2">link 2</a> (link, don't reload)<br />
        <a id="link-3" ng-href="/{{'123'}}">link 3</a> (link, reload!)<br />
        <a id="link-4" href="" name="xx" ng-click="value = 4">anchor</a> (link, don't reload)<br />
        <a id="link-5" name="xxx" ng-click="value = 5">anchor</a> (no link)<br />
        <a id="link-6" ng-href="{{value}}">link</a> (link, change location)
      </file>
      <file name="protractor.js" type="protractor">
        it('should execute ng-click but not reload when href without value', function() {
          element(by.id('link-1')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('1');
          expect(element(by.id('link-1')).getAttribute('href')).toBe('');
        });

        it('should execute ng-click but not reload when href empty string', function() {
          element(by.id('link-2')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('2');
          expect(element(by.id('link-2')).getAttribute('href')).toBe('');
        });

        it('should execute ng-click and change url when ng-href specified', function() {
          expect(element(by.id('link-3')).getAttribute('href')).toMatch(/\/123$/);

          element(by.id('link-3')).click();

          // At this point, we navigate away from an AngularJS page, so we need
          // to use browser.driver to get the base webdriver.

          browser.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return url.match(/\/123$/);
            });
          }, 5000, 'page should navigate to /123');
        });

        it('should execute ng-click but not reload when href empty string and name specified', function() {
          element(by.id('link-4')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('4');
          expect(element(by.id('link-4')).getAttribute('href')).toBe('');
        });

        it('should execute ng-click but not reload when no href but name specified', function() {
          element(by.id('link-5')).click();
          expect(element(by.model('value')).getAttribute('value')).toEqual('5');
          expect(element(by.id('link-5')).getAttribute('href')).toBe(null);
        });

        it('should only change url when only ng-href', function() {
          element(by.model('value')).clear();
          element(by.model('value')).sendKeys('6');
          expect(element(by.id('link-6')).getAttribute('href')).toMatch(/\/6$/);

          element(by.id('link-6')).click();

          // At this point, we navigate away from an AngularJS page, so we need
          // to use browser.driver to get the base webdriver.
          browser.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return url.match(/\/6$/);
            });
          }, 5000, 'page should navigate to /6');
        });
      </file>
    </example>
 */

/**
 * @ngdoc directive
 * @name ngSrc
 * @restrict A
 * @priority 99
 *
 * @description
 * Using AngularJS markup like `{{hash}}` in a `src` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until AngularJS replaces the expression inside
 * `{{hash}}`. The `ngSrc` directive solves this problem.
 *
 * The buggy way to write it:
 * ```html
 * <img src="http://www.gravatar.com/avatar/{{hash}}" alt="Description"/>
 * ```
 *
 * The correct way to write it:
 * ```html
 * <img ng-src="http://www.gravatar.com/avatar/{{hash}}" alt="Description" />
 * ```
 *
 * @element IMG
 * @param {template} ngSrc any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ngSrcset
 * @restrict A
 * @priority 99
 *
 * @description
 * Using AngularJS markup like `{{hash}}` in a `srcset` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until AngularJS replaces the expression inside
 * `{{hash}}`. The `ngSrcset` directive solves this problem.
 *
 * The buggy way to write it:
 * ```html
 * <img srcset="http://www.gravatar.com/avatar/{{hash}} 2x" alt="Description"/>
 * ```
 *
 * The correct way to write it:
 * ```html
 * <img ng-srcset="http://www.gravatar.com/avatar/{{hash}} 2x" alt="Description" />
 * ```
 *
 * @element IMG
 * @param {template} ngSrcset any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ngDisabled
 * @restrict A
 * @priority 100
 *
 * @description
 *
 * This directive sets the `disabled` attribute on the element (typically a form control,
 * e.g. `input`, `button`, `select` etc.) if the
 * {@link guide/expression expression} inside `ngDisabled` evaluates to truthy.
 *
 * A special directive is necessary because we cannot use interpolation inside the `disabled`
 * attribute. See the {@link guide/interpolation interpolation guide} for more info.
 *
 * @example
    <example name="ng-disabled">
      <file name="index.html">
        <label>Click me to toggle: <input type="checkbox" ng-model="checked"></label><br/>
        <button ng-model="button" ng-disabled="checked">Button</button>
      </file>
      <file name="protractor.js" type="protractor">
        it('should toggle button', function() {
          expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
          element(by.model('checked')).click();
          expect(element(by.css('button')).getAttribute('disabled')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @param {expression} ngDisabled If the {@link guide/expression expression} is truthy,
 *     then the `disabled` attribute will be set on the element
 */


/**
 * @ngdoc directive
 * @name ngChecked
 * @restrict A
 * @priority 100
 *
 * @description
 * Sets the `checked` attribute on the element, if the expression inside `ngChecked` is truthy.
 *
 * Note that this directive should not be used together with {@link ngModel `ngModel`},
 * as this can lead to unexpected behavior.
 *
 * A special directive is necessary because we cannot use interpolation inside the `checked`
 * attribute. See the {@link guide/interpolation interpolation guide} for more info.
 *
 * @example
    <example name="ng-checked">
      <file name="index.html">
        <label>Check me to check both: <input type="checkbox" ng-model="leader"></label><br/>
        <input id="checkFollower" type="checkbox" ng-checked="leader" aria-label="Follower input">
      </file>
      <file name="protractor.js" type="protractor">
        it('should check both checkBoxes', function() {
          expect(element(by.id('checkFollower')).getAttribute('checked')).toBeFalsy();
          element(by.model('leader')).click();
          expect(element(by.id('checkFollower')).getAttribute('checked')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @element INPUT
 * @param {expression} ngChecked If the {@link guide/expression expression} is truthy,
 *     then the `checked` attribute will be set on the element
 */


/**
 * @ngdoc directive
 * @name ngReadonly
 * @restrict A
 * @priority 100
 *
 * @description
 *
 * Sets the `readonly` attribute on the element, if the expression inside `ngReadonly` is truthy.
 * Note that `readonly` applies only to `input` elements with specific types. [See the input docs on
 * MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) for more information.
 *
 * A special directive is necessary because we cannot use interpolation inside the `readonly`
 * attribute. See the {@link guide/interpolation interpolation guide} for more info.
 *
 * @example
    <example name="ng-readonly">
      <file name="index.html">
        <label>Check me to make text readonly: <input type="checkbox" ng-model="checked"></label><br/>
        <input type="text" ng-readonly="checked" value="I'm AngularJS" aria-label="Readonly field" />
      </file>
      <file name="protractor.js" type="protractor">
        it('should toggle readonly attr', function() {
          expect(element(by.css('[type="text"]')).getAttribute('readonly')).toBeFalsy();
          element(by.model('checked')).click();
          expect(element(by.css('[type="text"]')).getAttribute('readonly')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @element INPUT
 * @param {expression} ngReadonly If the {@link guide/expression expression} is truthy,
 *     then special attribute "readonly" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ngSelected
 * @restrict A
 * @priority 100
 *
 * @description
 *
 * Sets the `selected` attribute on the element, if the expression inside `ngSelected` is truthy.
 *
 * A special directive is necessary because we cannot use interpolation inside the `selected`
 * attribute. See the {@link guide/interpolation interpolation guide} for more info.
 *
 * <div class="alert alert-warning">
 *   **Note:** `ngSelected` does not interact with the `select` and `ngModel` directives, it only
 *   sets the `selected` attribute on the element. If you are using `ngModel` on the select, you
 *   should not use `ngSelected` on the options, as `ngModel` will set the select value and
 *   selected options.
 * </div>
 *
 * @example
    <example name="ng-selected">
      <file name="index.html">
        <label>Check me to select: <input type="checkbox" ng-model="selected"></label><br/>
        <select aria-label="ngSelected demo">
          <option>Hello!</option>
          <option id="greet" ng-selected="selected">Greetings!</option>
        </select>
      </file>
      <file name="protractor.js" type="protractor">
        it('should select Greetings!', function() {
          expect(element(by.id('greet')).getAttribute('selected')).toBeFalsy();
          element(by.model('selected')).click();
          expect(element(by.id('greet')).getAttribute('selected')).toBeTruthy();
        });
      </file>
    </example>
 *
 * @element OPTION
 * @param {expression} ngSelected If the {@link guide/expression expression} is truthy,
 *     then special attribute "selected" will be set on the element
 */

/**
 * @ngdoc directive
 * @name ngOpen
 * @restrict A
 * @priority 100
 *
 * @description
 *
 * Sets the `open` attribute on the element, if the expression inside `ngOpen` is truthy.
 *
 * A special directive is necessary because we cannot use interpolation inside the `open`
 * attribute. See the {@link guide/interpolation interpolation guide} for more info.
 *
 * ## A note about browser compatibility
 *
 * Internet Explorer and Edge do not support the `details` element, it is
 * recommended to use {@link ng.ngShow} and {@link ng.ngHide} instead.
 *
 * @example
     <example name="ng-open">
       <file name="index.html">
         <label>Toggle details: <input type="checkbox" ng-model="open"></label><br/>
         <details id="details" ng-open="open">
            <summary>List</summary>
            <ul>
              <li>Apple</li>
              <li>Orange</li>
              <li>Durian</li>
            </ul>
         </details>
       </file>
       <file name="protractor.js" type="protractor">
         it('should toggle open', function() {
           expect(element(by.id('details')).getAttribute('open')).toBeFalsy();
           element(by.model('open')).click();
           expect(element(by.id('details')).getAttribute('open')).toBeTruthy();
         });
       </file>
     </example>
 *
 * @element DETAILS
 * @param {expression} ngOpen If the {@link guide/expression expression} is truthy,
 *     then special attribute "open" will be set on the element
 */

var ngAttributeAliasDirectives = {};

// boolean attrs are evaluated
forEach(BOOLEAN_ATTR, function(propName, attrName) {
  // binding to multiple is not supported
  if (propName === 'multiple') return;

  function defaultLinkFn(scope, element, attr) {
    scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
      attr.$set(attrName, !!value);
    });
  }

  var normalized = directiveNormalize('ng-' + attrName);
  var linkFn = defaultLinkFn;

  if (propName === 'checked') {
    linkFn = function(scope, element, attr) {
      // ensuring ngChecked doesn't interfere with ngModel when both are set on the same input
      if (attr.ngModel !== attr[normalized]) {
        defaultLinkFn(scope, element, attr);
      }
    };
  }

  ngAttributeAliasDirectives[normalized] = function() {
    return {
      restrict: 'A',
      priority: 100,
      link: linkFn
    };
  };
});

// aliased input attrs are evaluated
forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
  ngAttributeAliasDirectives[ngAttr] = function() {
    return {
      priority: 100,
      link: function(scope, element, attr) {
        //special case ngPattern when a literal regular expression value
        //is used as the expression (this way we don't have to watch anything).
        if (ngAttr === 'ngPattern' && attr.ngPattern.charAt(0) === '/') {
          var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
          if (match) {
            attr.$set('ngPattern', new RegExp(match[1], match[2]));
            return;
          }
        }

        scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
          attr.$set(ngAttr, value);
        });
      }
    };
  };
});

// ng-src, ng-srcset, ng-href are interpolated
forEach(['src', 'srcset', 'href'], function(attrName) {
  var normalized = directiveNormalize('ng-' + attrName);
  ngAttributeAliasDirectives[normalized] = ['$sce', function($sce) {
    return {
      priority: 99, // it needs to run after the attributes are interpolated
      link: function(scope, element, attr) {
        var propName = attrName,
            name = attrName;

        if (attrName === 'href' &&
            toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
          name = 'xlinkHref';
          attr.$attr[name] = 'xlink:href';
          propName = null;
        }

        // We need to sanitize the url at least once, in case it is a constant
        // non-interpolated attribute.
        attr.$set(normalized, $sce.getTrustedMediaUrl(attr[normalized]));

        attr.$observe(normalized, function(value) {
          if (!value) {
            if (attrName === 'href') {
              attr.$set(name, null);
            }
            return;
          }

          attr.$set(name, value);

          // Support: IE 9-11 only
          // On IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
          // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
          // to set the property as well to achieve the desired effect.
          // We use attr[attrName] value since $set might have sanitized the url.
          if (msie && propName) element.prop(propName, attr[name]);
        });
      }
    };
  }];
});

/* global -nullFormCtrl, -PENDING_CLASS, -SUBMITTED_CLASS
 */
var nullFormCtrl = {
  $addControl: noop,
  $getControls: valueFn([]),
  $$renameControl: nullFormRenameControl,
  $removeControl: noop,
  $setValidity: noop,
  $setDirty: noop,
  $setPristine: noop,
  $setSubmitted: noop,
  $$setSubmitted: noop
},
PENDING_CLASS = 'ng-pending',
SUBMITTED_CLASS = 'ng-submitted';

function nullFormRenameControl(control, name) {
  control.$name = name;
}

/**
 * @ngdoc type
 * @name form.FormController
 *
 * @property {boolean} $pristine True if user has not interacted with the form yet.
 * @property {boolean} $dirty True if user has already interacted with the form.
 * @property {boolean} $valid True if all of the containing forms and controls are valid.
 * @property {boolean} $invalid True if at least one containing control or form is invalid.
 * @property {boolean} $submitted True if user has submitted the form even if its invalid.
 *
 * @property {Object} $pending An object hash, containing references to controls or forms with
 *  pending validators, where:
 *
 *  - keys are validations tokens (error names).
 *  - values are arrays of controls or forms that have a pending validator for the given error name.
 *
 * See {@link form.FormController#$error $error} for a list of built-in validation tokens.
 *
 * @property {Object} $error An object hash, containing references to controls or forms with failing
 *  validators, where:
 *
 *  - keys are validation tokens (error names),
 *  - values are arrays of controls or forms that have a failing validator for the given error name.
 *
 *  Built-in validation tokens:
 *  - `email`
 *  - `max`
 *  - `maxlength`
 *  - `min`
 *  - `minlength`
 *  - `number`
 *  - `pattern`
 *  - `required`
 *  - `url`
 *  - `date`
 *  - `datetimelocal`
 *  - `time`
 *  - `week`
 *  - `month`
 *
 * @description
 * `FormController` keeps track of all its controls and nested forms as well as the state of them,
 * such as being valid/invalid or dirty/pristine.
 *
 * Each {@link ng.directive:form form} directive creates an instance
 * of `FormController`.
 *
 */
//asks for $scope to fool the BC controller module
FormController.$inject = ['$element', '$attrs', '$scope', '$animate', '$interpolate'];
function FormController($element, $attrs, $scope, $animate, $interpolate) {
  this.$$controls = [];

  // init state
  this.$error = {};
  this.$$success = {};
  this.$pending = undefined;
  this.$name = $interpolate($attrs.name || $attrs.ngForm || '')($scope);
  this.$dirty = false;
  this.$pristine = true;
  this.$valid = true;
  this.$invalid = false;
  this.$submitted = false;
  this.$$parentForm = nullFormCtrl;

  this.$$element = $element;
  this.$$animate = $animate;

  setupValidity(this);
}

FormController.prototype = {
  /**
   * @ngdoc method
   * @name form.FormController#$rollbackViewValue
   *
   * @description
   * Rollback all form controls pending updates to the `$modelValue`.
   *
   * Updates may be pending by a debounced event or because the input is waiting for a some future
   * event defined in `ng-model-options`. This method is typically needed by the reset button of
   * a form that uses `ng-model-options` to pend updates.
   */
  $rollbackViewValue: function() {
    forEach(this.$$controls, function(control) {
      control.$rollbackViewValue();
    });
  },

  /**
   * @ngdoc method
   * @name form.FormController#$commitViewValue
   *
   * @description
   * Commit all form controls pending updates to the `$modelValue`.
   *
   * Updates may be pending by a debounced event or because the input is waiting for a some future
   * event defined in `ng-model-options`. This method is rarely needed as `NgModelController`
   * usually handles calling this in response to input events.
   */
  $commitViewValue: function() {
    forEach(this.$$controls, function(control) {
      control.$commitViewValue();
    });
  },

  /**
   * @ngdoc method
   * @name form.FormController#$addControl
   * @param {object} control control object, either a {@link form.FormController} or an
   * {@link ngModel.NgModelController}
   *
   * @description
   * Register a control with the form. Input elements using ngModelController do this automatically
   * when they are linked.
   *
   * Note that the current state of the control will not be reflected on the new parent form. This
   * is not an issue with normal use, as freshly compiled and linked controls are in a `$pristine`
   * state.
   *
   * However, if the method is used programmatically, for example by adding dynamically created controls,
   * or controls that have been previously removed without destroying their corresponding DOM element,
   * it's the developers responsibility to make sure the current state propagates to the parent form.
   *
   * For example, if an input control is added that is already `$dirty` and has `$error` properties,
   * calling `$setDirty()` and `$validate()` afterwards will propagate the state to the parent form.
   */
  $addControl: function(control) {
    // Breaking change - before, inputs whose name was "hasOwnProperty" were quietly ignored
    // and not added to the scope.  Now we throw an error.
    assertNotHasOwnProperty(control.$name, 'input');
    this.$$controls.push(control);

    if (control.$name) {
      this[control.$name] = control;
    }

    control.$$parentForm = this;
  },

  /**
   * @ngdoc method
   * @name form.FormController#$getControls
   * @returns {Array} the controls that are currently part of this form
   *
   * @description
   * This method returns a **shallow copy** of the controls that are currently part of this form.
   * The controls can be instances of {@link form.FormController `FormController`}
   * ({@link ngForm "child-forms"}) and of {@link ngModel.NgModelController `NgModelController`}.
   * If you need access to the controls of child-forms, you have to call `$getControls()`
   * recursively on them.
   * This can be used for example to iterate over all controls to validate them.
   *
   * The controls can be accessed normally, but adding to, or removing controls from the array has
   * no effect on the form. Instead, use {@link form.FormController#$addControl `$addControl()`} and
   * {@link form.FormController#$removeControl `$removeControl()`} for this use-case.
   * Likewise, adding a control to, or removing a control from the form is not reflected
   * in the shallow copy. That means you should get a fresh copy from `$getControls()` every time
   * you need access to the controls.
   */
  $getControls: function() {
    return shallowCopy(this.$$controls);
  },

  // Private API: rename a form control
  $$renameControl: function(control, newName) {
    var oldName = control.$name;

    if (this[oldName] === control) {
      delete this[oldName];
    }
    this[newName] = control;
    control.$name = newName;
  },

  /**
   * @ngdoc method
   * @name form.FormController#$removeControl
   * @param {object} control control object, either a {@link form.FormController} or an
   * {@link ngModel.NgModelController}
   *
   * @description
   * Deregister a control from the form.
   *
   * Input elements using ngModelController do this automatically when they are destroyed.
   *
   * Note that only the removed control's validation state (`$errors`etc.) will be removed from the
   * form. `$dirty`, `$submitted` states will not be changed, because the expected behavior can be
   * different from case to case. For example, removing the only `$dirty` control from a form may or
   * may not mean that the form is still `$dirty`.
   */
  $removeControl: function(control) {
    if (control.$name && this[control.$name] === control) {
      delete this[control.$name];
    }
    forEach(this.$pending, function(value, name) {
      // eslint-disable-next-line no-invalid-this
      this.$setValidity(name, null, control);
    }, this);
    forEach(this.$error, function(value, name) {
      // eslint-disable-next-line no-invalid-this
      this.$setValidity(name, null, control);
    }, this);
    forEach(this.$$success, function(value, name) {
      // eslint-disable-next-line no-invalid-this
      this.$setValidity(name, null, control);
    }, this);

    arrayRemove(this.$$controls, control);
    control.$$parentForm = nullFormCtrl;
  },

  /**
   * @ngdoc method
   * @name form.FormController#$setDirty
   *
   * @description
   * Sets the form to a dirty state.
   *
   * This method can be called to add the 'ng-dirty' class and set the form to a dirty
   * state (ng-dirty class). This method will also propagate to parent forms.
   */
  $setDirty: function() {
    this.$$animate.removeClass(this.$$element, PRISTINE_CLASS);
    this.$$animate.addClass(this.$$element, DIRTY_CLASS);
    this.$dirty = true;
    this.$pristine = false;
    this.$$parentForm.$setDirty();
  },

  /**
   * @ngdoc method
   * @name form.FormController#$setPristine
   *
   * @description
   * Sets the form to its pristine state.
   *
   * This method sets the form's `$pristine` state to true, the `$dirty` state to false, removes
   * the `ng-dirty` class and adds the `ng-pristine` class. Additionally, it sets the `$submitted`
   * state to false.
   *
   * This method will also propagate to all the controls contained in this form.
   *
   * Setting a form back to a pristine state is often useful when we want to 'reuse' a form after
   * saving or resetting it.
   */
  $setPristine: function() {
    this.$$animate.setClass(this.$$element, PRISTINE_CLASS, DIRTY_CLASS + ' ' + SUBMITTED_CLASS);
    this.$dirty = false;
    this.$pristine = true;
    this.$submitted = false;
    forEach(this.$$controls, function(control) {
      control.$setPristine();
    });
  },

  /**
   * @ngdoc method
   * @name form.FormController#$setUntouched
   *
   * @description
   * Sets the form to its untouched state.
   *
   * This method can be called to remove the 'ng-touched' class and set the form controls to their
   * untouched state (ng-untouched class).
   *
   * Setting a form controls back to their untouched state is often useful when setting the form
   * back to its pristine state.
   */
  $setUntouched: function() {
    forEach(this.$$controls, function(control) {
      control.$setUntouched();
    });
  },

  /**
   * @ngdoc method
   * @name form.FormController#$setSubmitted
   *
   * @description
   * Sets the form to its `$submitted` state. This will also set `$submitted` on all child and
   * parent forms of the form.
   */
  $setSubmitted: function() {
    var rootForm = this;
    while (rootForm.$$parentForm && (rootForm.$$parentForm !== nullFormCtrl)) {
      rootForm = rootForm.$$parentForm;
    }
    rootForm.$$setSubmitted();
  },

  $$setSubmitted: function() {
    this.$$animate.addClass(this.$$element, SUBMITTED_CLASS);
    this.$submitted = true;
    forEach(this.$$controls, function(control) {
      if (control.$$setSubmitted) {
        control.$$setSubmitted();
      }
    });
  }
};

/**
 * @ngdoc method
 * @name form.FormController#$setValidity
 *
 * @description
 * Change the validity state of the form, and notify the parent form (if any).
 *
 * Application developers will rarely need to call this method directly. It is used internally, by
 * {@link ngModel.NgModelController#$setValidity NgModelController.$setValidity()}, to propagate a
 * control's validity state to the parent `FormController`.
 *
 * @param {string} validationErrorKey Name of the validator. The `validationErrorKey` will be
 *        assigned to either `$error[validationErrorKey]` or `$pending[validationErrorKey]` (for
 *        unfulfilled `$asyncValidators`), so that it is available for data-binding. The
 *        `validationErrorKey` should be in camelCase and will get converted into dash-case for
 *        class name. Example: `myError` will result in `ng-valid-my-error` and
 *        `ng-invalid-my-error` classes and can be bound to as `{{ someForm.$error.myError }}`.
 * @param {boolean} isValid Whether the current state is valid (true), invalid (false), pending
 *        (undefined),  or skipped (null). Pending is used for unfulfilled `$asyncValidators`.
 *        Skipped is used by AngularJS when validators do not run because of parse errors and when
 *        `$asyncValidators` do not run because any of the `$validators` failed.
 * @param {NgModelController | FormController} controller - The controller whose validity state is
 *        triggering the change.
 */
addSetValidityMethod({
  clazz: FormController,
  set: function(object, property, controller) {
    var list = object[property];
    if (!list) {
      object[property] = [controller];
    } else {
      var index = list.indexOf(controller);
      if (index === -1) {
        list.push(controller);
      }
    }
  },
  unset: function(object, property, controller) {
    var list = object[property];
    if (!list) {
      return;
    }
    arrayRemove(list, controller);
    if (list.length === 0) {
      delete object[property];
    }
  }
});

/**
 * @ngdoc directive
 * @name ngForm
 * @restrict EAC
 *
 * @description
 * Helper directive that makes it possible to create control groups inside a
 * {@link ng.directive:form `form`} directive.
 * These "child forms" can be used, for example, to determine the validity of a sub-group of
 * controls.
 *
 * <div class="alert alert-danger">
 * **Note**: `ngForm` cannot be used as a replacement for `<form>`, because it lacks its
 * [built-in HTML functionality](https://html.spec.whatwg.org/#the-form-element).
 * Specifically, you cannot submit `ngForm` like a `<form>` tag. That means,
 * you cannot send data to the server with `ngForm`, or integrate it with
 * {@link ng.directive:ngSubmit `ngSubmit`}.
 * </div>
 *
 * @param {string=} ngForm|name Name of the form. If specified, the form controller will
 *                              be published into the related scope, under this name.
 *
 */

 /**
 * @ngdoc directive
 * @name form
 * @restrict E
 *
 * @description
 * Directive that instantiates
 * {@link form.FormController FormController}.
 *
 * If the `name` attribute is specified, the form controller is published onto the current scope under
 * this name.
 *
 * ## Alias: {@link ng.directive:ngForm `ngForm`}
 *
 * In AngularJS, forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However, browsers do not allow nesting of `<form>` elements, so
 * AngularJS provides the {@link ng.directive:ngForm `ngForm`} directive, which behaves identically to
 * `form` but can be nested. Nested forms can be useful, for example, if the validity of a sub-group
 * of controls needs to be determined.
 *
 * ## CSS classes
 *  - `ng-valid` is set if the form is valid.
 *  - `ng-invalid` is set if the form is invalid.
 *  - `ng-pending` is set if the form is pending.
 *  - `ng-pristine` is set if the form is pristine.
 *  - `ng-dirty` is set if the form is dirty.
 *  - `ng-submitted` is set if the form was submitted.
 *
 * Keep in mind that ngAnimate can detect each of these classes when added and removed.
 *
 *
 * ## Submitting a form and preventing the default action
 *
 * Since the role of forms in client-side AngularJS applications is different than in classical
 * roundtrip apps, it is desirable for the browser not to translate the form submission into a full
 * page reload that sends the data to the server. Instead some javascript logic should be triggered
 * to handle the form submission in an application-specific way.
 *
 * For this reason, AngularJS prevents the default action (form submission to the server) unless the
 * `<form>` element has an `action` attribute specified.
 *
 * You can use one of the following two ways to specify what javascript method should be called when
 * a form is submitted:
 *
 * - {@link ng.directive:ngSubmit ngSubmit} directive on the form element
 * - {@link ng.directive:ngClick ngClick} directive on the first
  *  button or input field of type submit (input[type=submit])
 *
 * To prevent double execution of the handler, use only one of the {@link ng.directive:ngSubmit ngSubmit}
 * or {@link ng.directive:ngClick ngClick} directives.
 * This is because of the following form submission rules in the HTML specification:
 *
 * - If a form has only one input field then hitting enter in this field triggers form submit
 * (`ngSubmit`)
 * - if a form has 2+ input fields and no buttons or input[type=submit] then hitting enter
 * doesn't trigger submit
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or
 * input[type=submit] (`ngClick`) *and* a submit handler on the enclosing form (`ngSubmit`)
 *
 * Any pending `ngModelOptions` changes will take place immediately when an enclosing form is
 * submitted. Note that `ngClick` events will occur before the model is updated. Use `ngSubmit`
 * to have access to the updated model.
 *
 * @animations
 * Animations in ngForm are triggered when any of the associated CSS classes are added and removed.
 * These classes are: `.ng-pristine`, `.ng-dirty`, `.ng-invalid` and `.ng-valid` as well as any
 * other validations that are performed within the form. Animations in ngForm are similar to how
 * they work in ngClass and animations can be hooked into using CSS transitions, keyframes as well
 * as JS animations.
 *
 * The following example shows a simple way to utilize CSS transitions to style a form element
 * that has been rendered as invalid after it has been validated:
 *
 * <pre>
 * //be sure to include ngAnimate as a module to hook into more
 * //advanced animations
 * .my-form {
 *   transition:0.5s linear all;
 *   background: white;
 * }
 * .my-form.ng-invalid {
 *   background: red;
 *   color:white;
 * }
 * </pre>
 *
 * @example
    <example name="ng-form" deps="angular-animate.js" animations="true" fixBase="true" module="formExample">
      <file name="index.html">
       <script>
         angular.module('formExample', [])
           .controller('FormController', ['$scope', function($scope) {
             $scope.userType = 'guest';
           }]);
       </script>
       <style>
        .my-form {
          transition:all linear 0.5s;
          background: transparent;
        }
        .my-form.ng-invalid {
          background: red;
        }
       </style>
       <form name="myForm" ng-controller="FormController" class="my-form">
         userType: <input name="input" ng-model="userType" required>
         <span class="error" ng-show="myForm.input.$error.required">Required!</span><br>
         <code>userType = {{userType}}</code><br>
         <code>myForm.input.$valid = {{myForm.input.$valid}}</code><br>
         <code>myForm.input.$error = {{myForm.input.$error}}</code><br>
         <code>myForm.$valid = {{myForm.$valid}}</code><br>
         <code>myForm.$error.required = {{!!myForm.$error.required}}</code><br>
        </form>
      </file>
      <file name="protractor.js" type="protractor">
        it('should initialize to model', function() {
          var userType = element(by.binding('userType'));
          var valid = element(by.binding('myForm.input.$valid'));

          expect(userType.getText()).toContain('guest');
          expect(valid.getText()).toContain('true');
        });

        it('should be invalid if empty', function() {
          var userType = element(by.binding('userType'));
          var valid = element(by.binding('myForm.input.$valid'));
          var userInput = element(by.model('userType'));

          userInput.clear();
          userInput.sendKeys('');

          expect(userType.getText()).toEqual('userType =');
          expect(valid.getText()).toContain('false');
        });
      </file>
    </example>
 *
 * @param {string=} name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 */
var formDirectiveFactory = function(isNgForm) {
  return ['$timeout', '$parse', function($timeout, $parse) {
    var formDirective = {
      name: 'form',
      restrict: isNgForm ? 'EAC' : 'E',
      require: ['form', '^^?form'], //first is the form's own ctrl, second is an optional parent form
      controller: FormController,
      compile: function ngFormCompile(formElement, attr) {
        // Setup initial state of the control
        formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);

        var nameAttr = attr.name ? 'name' : (isNgForm && attr.ngForm ? 'ngForm' : false);

        return {
          pre: function ngFormPreLink(scope, formElement, attr, ctrls) {
            var controller = ctrls[0];

            // if `action` attr is not present on the form, prevent the default action (submission)
            if (!('action' in attr)) {
              // we can't use jq events because if a form is destroyed during submission the default
              // action is not prevented. see #1238
              //
              // IE 9 is not affected because it doesn't fire a submit event and try to do a full
              // page reload if the form was destroyed by submission of the form via a click handler
              // on a button in the form. Looks like an IE9 specific bug.
              var handleFormSubmission = function(event) {
                scope.$apply(function() {
                  controller.$commitViewValue();
                  controller.$setSubmitted();
                });

                event.preventDefault();
              };

              formElement[0].addEventListener('submit', handleFormSubmission);

              // unregister the preventDefault listener so that we don't not leak memory but in a
              // way that will achieve the prevention of the default action.
              formElement.on('$destroy', function() {
                $timeout(function() {
                  formElement[0].removeEventListener('submit', handleFormSubmission);
                }, 0, false);
              });
            }

            var parentFormCtrl = ctrls[1] || controller.$$parentForm;
            parentFormCtrl.$addControl(controller);

            var setter = nameAttr ? getSetter(controller.$name) : noop;

            if (nameAttr) {
              setter(scope, controller);
              attr.$observe(nameAttr, function(newValue) {
                if (controller.$name === newValue) return;
                setter(scope, undefined);
                controller.$$parentForm.$$renameControl(controller, newValue);
                setter = getSetter(controller.$name);
                setter(scope, controller);
              });
            }
            formElement.on('$destroy', function() {
              controller.$$parentForm.$removeControl(controller);
              setter(scope, undefined);
              extend(controller, nullFormCtrl); //stop propagating child destruction handlers upwards
            });
          }
        };
      }
    };

    return formDirective;

    function getSetter(expression) {
      if (expression === '') {
        //create an assignable expression, so forms with an empty name can be renamed later
        return $parse('this[""]').assign;
      }
      return $parse(expression).assign || noop;
    }
  }];
};

var formDirective = formDirectiveFactory();
var ngFormDirective = formDirectiveFactory(true);

/* global
  VALID_CLASS: false,
  INVALID_CLASS: false,
  PRISTINE_CLASS: false,
  DIRTY_CLASS: false,
  ngModelMinErr: false
*/

// Regex code was initially obtained from SO prior to modification: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime#answer-3143231
var ISO_DATE_REGEXP = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/;
// See valid URLs in RFC3987 (http://tools.ietf.org/html/rfc3987)
// Note: We are being more lenient, because browsers are too.
//   1. Scheme
//   2. Slashes
//   3. Username
//   4. Password
//   5. Hostname
//   6. Port
//   7. Path
//   8. Query
//   9. Fragment
//                 1111111111111111 222   333333    44444        55555555555555555555555     666     77777777     8888888     999
var URL_REGEXP = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i;
// eslint-disable-next-line max-len
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
var NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
var DATE_REGEXP = /^(\d{4,})-(\d{2})-(\d{2})$/;
var DATETIMELOCAL_REGEXP = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
var WEEK_REGEXP = /^(\d{4,})-W(\d\d)$/;
var MONTH_REGEXP = /^(\d{4,})-(\d\d)$/;
var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;

var PARTIAL_VALIDATION_EVENTS = 'keydown wheel mousedown';
var PARTIAL_VALIDATION_TYPES = createMap();
forEach('date,datetime-local,month,time,week'.split(','), function(type) {
  PARTIAL_VALIDATION_TYPES[type] = true;
});

var inputType = {

  /**
   * @ngdoc input
   * @name input[text]
   *
   * @description
   * Standard HTML text input with AngularJS data binding, inherited by most of the `input` elements.
   *
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Adds `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the AngularJS expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   * @param {boolean=} [ngTrim=true] If set to false AngularJS will not automatically trim the input.
   *    This parameter is ignored for input[type=password] controls, which will never trim the
   *    input.
   *
   * @example
      <example name="text-input-directive" module="textInputExample">
        <file name="index.html">
         <script>
           angular.module('textInputExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.example = {
                 text: 'guest',
                 word: /^\s*\w*\s*$/
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>Single word:
             <input type="text" name="input" ng-model="example.text"
                    ng-pattern="example.word" required ng-trim="false">
           </label>
           <div role="alert">
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.pattern">
               Single word only!</span>
           </div>
           <code>text = {{example.text}}</code><br/>
           <code>myForm.input.$valid = {{myForm.input.$valid}}</code><br/>
           <code>myForm.input.$error = {{myForm.input.$error}}</code><br/>
           <code>myForm.$valid = {{myForm.$valid}}</code><br/>
           <code>myForm.$error.required = {{!!myForm.$error.required}}</code><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          var text = element(by.binding('example.text'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('example.text'));

          it('should initialize to model', function() {
            expect(text.getText()).toContain('guest');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');

            expect(text.getText()).toEqual('text =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if multi word', function() {
            input.clear();
            input.sendKeys('hello world');

            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'text': textInputType,

    /**
     * @ngdoc input
     * @name input[date]
     *
     * @description
     * Input with date validation and transformation. In browsers that do not yet support
     * the HTML5 date input, a text element will be used. In that case, text must be entered in a valid ISO-8601
     * date format (yyyy-MM-dd), for example: `2009-01-06`. Since many
     * modern browsers do not yet support this input type, it is important to provide cues to users on the
     * expected input format via a placeholder or label.
     *
     * The model must always be a Date object, otherwise AngularJS will throw an error.
     * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
     *
     * The timezone to be used to read/write the `Date` instance in the model can be defined using
     * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
     *
     * @param {string} ngModel Assignable AngularJS expression to data-bind to.
     * @param {string=} name Property name of the form under which the control is published.
     * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`. This must be a
     *   valid ISO date string (yyyy-MM-dd). You can also use interpolation inside this attribute
     *   (e.g. `min="{{minDate | date:'yyyy-MM-dd'}}"`). Note that `min` will also add native HTML5
     *   constraint validation.
     * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`. This must be
     *   a valid ISO date string (yyyy-MM-dd). You can also use interpolation inside this attribute
     *   (e.g. `max="{{maxDate | date:'yyyy-MM-dd'}}"`). Note that `max` will also add native HTML5
     *   constraint validation.
     * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO date string
     *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
     * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO date string
     *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
     * @param {string=} required Sets `required` validation error key if the value is not entered.
     * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
     *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
     *    `required` when you want to data-bind to the `required` attribute.
     * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
     *    interaction with the input element.
     *
     * @example
     <example name="date-input-directive" module="dateInputExample">
     <file name="index.html">
       <script>
          angular.module('dateInputExample', [])
            .controller('DateController', ['$scope', function($scope) {
              $scope.example = {
                value: new Date(2013, 9, 22)
              };
            }]);
       </script>
       <form name="myForm" ng-controller="DateController as dateCtrl">
          <label for="exampleInput">Pick a date in 2013:</label>
          <input type="date" id="exampleInput" name="input" ng-model="example.value"
              placeholder="yyyy-MM-dd" min="2013-01-01" max="2013-12-31" required />
          <div role="alert">
            <span class="error" ng-show="myForm.input.$error.required">
                Required!</span>
            <span class="error" ng-show="myForm.input.$error.date">
                Not a valid date!</span>
           </div>
           <tt>value = {{example.value | date: "yyyy-MM-dd"}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
       </form>
     </file>
     <file name="protractor.js" type="protractor">
        var value = element(by.binding('example.value | date: "yyyy-MM-dd"'));
        var valid = element(by.binding('myForm.input.$valid'));

        // currently protractor/webdriver does not support
        // sending keys to all known HTML5 input controls
        // for various browsers (see https://github.com/angular/protractor/issues/562).
        function setInput(val) {
          // set the value of the element and force validation.
          var scr = "var ipt = document.getElementById('exampleInput'); " +
          "ipt.value = '" + val + "';" +
          "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
          browser.executeScript(scr);
        }

        it('should initialize to model', function() {
          expect(value.getText()).toContain('2013-10-22');
          expect(valid.getText()).toContain('myForm.input.$valid = true');
        });

        it('should be invalid if empty', function() {
          setInput('');
          expect(value.getText()).toEqual('value =');
          expect(valid.getText()).toContain('myForm.input.$valid = false');
        });

        it('should be invalid if over max', function() {
          setInput('2015-01-01');
          expect(value.getText()).toContain('');
          expect(valid.getText()).toContain('myForm.input.$valid = false');
        });
     </file>
     </example>
     */
  'date': createDateInputType('date', DATE_REGEXP,
         createDateParser(DATE_REGEXP, ['yyyy', 'MM', 'dd']),
         'yyyy-MM-dd'),

   /**
    * @ngdoc input
    * @name input[datetime-local]
    *
    * @description
    * Input with datetime validation and transformation. In browsers that do not yet support
    * the HTML5 date input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
    * local datetime format (yyyy-MM-ddTHH:mm:ss), for example: `2010-12-28T14:57:00`.
    *
    * The model must always be a Date object, otherwise AngularJS will throw an error.
    * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
    *
    * The timezone to be used to read/write the `Date` instance in the model can be defined using
    * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
    *
    * The format of the displayed time can be adjusted with the
    * {@link ng.directive:ngModelOptions#ngModelOptions-arguments ngModelOptions} `timeSecondsFormat`
    * and `timeStripZeroSeconds`.
    *
    * @param {string} ngModel Assignable AngularJS expression to data-bind to.
    * @param {string=} name Property name of the form under which the control is published.
    * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
    *   This must be a valid ISO datetime format (yyyy-MM-ddTHH:mm:ss). You can also use interpolation
    *   inside this attribute (e.g. `min="{{minDatetimeLocal | date:'yyyy-MM-ddTHH:mm:ss'}}"`).
    *   Note that `min` will also add native HTML5 constraint validation.
    * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
    *   This must be a valid ISO datetime format (yyyy-MM-ddTHH:mm:ss). You can also use interpolation
    *   inside this attribute (e.g. `max="{{maxDatetimeLocal | date:'yyyy-MM-ddTHH:mm:ss'}}"`).
    *   Note that `max` will also add native HTML5 constraint validation.
    * @param {(date|string)=} ngMin Sets the `min` validation error key to the Date / ISO datetime string
    *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
    * @param {(date|string)=} ngMax Sets the `max` validation error key to the Date / ISO datetime string
    *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
    * @param {string=} required Sets `required` validation error key if the value is not entered.
    * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
    *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
    *    `required` when you want to data-bind to the `required` attribute.
    * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
    *    interaction with the input element.
    *
    * @example
    <example name="datetimelocal-input-directive" module="dateExample">
    <file name="index.html">
      <script>
        angular.module('dateExample', [])
          .controller('DateController', ['$scope', function($scope) {
            $scope.example = {
              value: new Date(2010, 11, 28, 14, 57)
            };
          }]);
      </script>
      <form name="myForm" ng-controller="DateController as dateCtrl">
        <label for="exampleInput">Pick a date between in 2013:</label>
        <input type="datetime-local" id="exampleInput" name="input" ng-model="example.value"
            placeholder="yyyy-MM-ddTHH:mm:ss" min="2001-01-01T00:00:00" max="2013-12-31T00:00:00" required />
        <div role="alert">
          <span class="error" ng-show="myForm.input.$error.required">
              Required!</span>
          <span class="error" ng-show="myForm.input.$error.datetimelocal">
              Not a valid date!</span>
        </div>
        <tt>value = {{example.value | date: "yyyy-MM-ddTHH:mm:ss"}}</tt><br/>
        <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
        <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
        <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
        <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
      </form>
    </file>
    <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "yyyy-MM-ddTHH:mm:ss"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('2010-12-28T14:57:00');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('2015-01-01T23:59:00');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
    </file>
    </example>
    */
  'datetime-local': createDateInputType('datetimelocal', DATETIMELOCAL_REGEXP,
      createDateParser(DATETIMELOCAL_REGEXP, ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'sss']),
      'yyyy-MM-ddTHH:mm:ss.sss'),

  /**
   * @ngdoc input
   * @name input[time]
   *
   * @description
   * Input with time validation and transformation. In browsers that do not yet support
   * the HTML5 time input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
   * local time format (HH:mm:ss), for example: `14:57:00`. Model must be a Date object. This binding will always output a
   * Date object to the model of January 1, 1970, or local date `new Date(1970, 0, 1, HH, mm, ss)`.
   *
   * The model must always be a Date object, otherwise AngularJS will throw an error.
   * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
   *
   * The timezone to be used to read/write the `Date` instance in the model can be defined using
   * {@link ng.directive:ngModelOptions#ngModelOptions-arguments ngModelOptions}. By default,
   * this is the timezone of the browser.
   *
   * The format of the displayed time can be adjusted with the
   * {@link ng.directive:ngModelOptions#ngModelOptions-arguments ngModelOptions} `timeSecondsFormat`
   * and `timeStripZeroSeconds`.
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   *   This must be a valid ISO time format (HH:mm:ss). You can also use interpolation inside this
   *   attribute (e.g. `min="{{minTime | date:'HH:mm:ss'}}"`). Note that `min` will also add
   *   native HTML5 constraint validation.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   *   This must be a valid ISO time format (HH:mm:ss). You can also use interpolation inside this
   *   attribute (e.g. `max="{{maxTime | date:'HH:mm:ss'}}"`). Note that `max` will also add
   *   native HTML5 constraint validation.
   * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO time string the
   *   `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
   * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO time string the
   *   `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
   <example name="time-input-directive" module="timeExample">
   <file name="index.html">
     <script>
      angular.module('timeExample', [])
        .controller('DateController', ['$scope', function($scope) {
          $scope.example = {
            value: new Date(1970, 0, 1, 14, 57, 0)
          };
        }]);
     </script>
     <form name="myForm" ng-controller="DateController as dateCtrl">
        <label for="exampleInput">Pick a time between 8am and 5pm:</label>
        <input type="time" id="exampleInput" name="input" ng-model="example.value"
            placeholder="HH:mm:ss" min="08:00:00" max="17:00:00" required />
        <div role="alert">
          <span class="error" ng-show="myForm.input.$error.required">
              Required!</span>
          <span class="error" ng-show="myForm.input.$error.time">
              Not a valid date!</span>
        </div>
        <tt>value = {{example.value | date: "HH:mm:ss"}}</tt><br/>
        <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
        <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
        <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
        <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
     </form>
   </file>
   <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "HH:mm:ss"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('14:57:00');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('23:59:00');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
   </file>
   </example>
   */
  'time': createDateInputType('time', TIME_REGEXP,
      createDateParser(TIME_REGEXP, ['HH', 'mm', 'ss', 'sss']),
     'HH:mm:ss.sss'),

   /**
    * @ngdoc input
    * @name input[week]
    *
    * @description
    * Input with week-of-the-year validation and transformation to Date. In browsers that do not yet support
    * the HTML5 week input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
    * week format (yyyy-W##), for example: `2013-W02`.
    *
    * The model must always be a Date object, otherwise AngularJS will throw an error.
    * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
    *
    * The value of the resulting Date object will be set to Thursday at 00:00:00 of the requested week,
    * due to ISO-8601 week numbering standards. Information on ISO's system for numbering the weeks of the
    * year can be found at: https://en.wikipedia.org/wiki/ISO_8601#Week_dates
    *
    * The timezone to be used to read/write the `Date` instance in the model can be defined using
    * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
    *
    * @param {string} ngModel Assignable AngularJS expression to data-bind to.
    * @param {string=} name Property name of the form under which the control is published.
    * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
    *   This must be a valid ISO week format (yyyy-W##). You can also use interpolation inside this
    *   attribute (e.g. `min="{{minWeek | date:'yyyy-Www'}}"`). Note that `min` will also add
    *   native HTML5 constraint validation.
    * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
    *   This must be a valid ISO week format (yyyy-W##). You can also use interpolation inside this
    *   attribute (e.g. `max="{{maxWeek | date:'yyyy-Www'}}"`). Note that `max` will also add
    *   native HTML5 constraint validation.
    * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO week string
    *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
    * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO week string
    *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.
    * @param {string=} required Sets `required` validation error key if the value is not entered.
    * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
    *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
    *    `required` when you want to data-bind to the `required` attribute.
    * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
    *    interaction with the input element.
    *
    * @example
    <example name="week-input-directive" module="weekExample">
    <file name="index.html">
      <script>
      angular.module('weekExample', [])
        .controller('DateController', ['$scope', function($scope) {
          $scope.example = {
            value: new Date(2013, 0, 3)
          };
        }]);
      </script>
      <form name="myForm" ng-controller="DateController as dateCtrl">
        <label>Pick a date between in 2013:
          <input id="exampleInput" type="week" name="input" ng-model="example.value"
                 placeholder="YYYY-W##" min="2012-W32"
                 max="2013-W52" required />
        </label>
        <div role="alert">
          <span class="error" ng-show="myForm.input.$error.required">
              Required!</span>
          <span class="error" ng-show="myForm.input.$error.week">
              Not a valid date!</span>
        </div>
        <tt>value = {{example.value | date: "yyyy-Www"}}</tt><br/>
        <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
        <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
        <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
        <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
      </form>
    </file>
    <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "yyyy-Www"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('2013-W01');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('2015-W01');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
    </file>
    </example>
    */
  'week': createDateInputType('week', WEEK_REGEXP, weekParser, 'yyyy-Www'),

  /**
   * @ngdoc input
   * @name input[month]
   *
   * @description
   * Input with month validation and transformation. In browsers that do not yet support
   * the HTML5 month input, a text element will be used. In that case, the text must be entered in a valid ISO-8601
   * month format (yyyy-MM), for example: `2009-01`.
   *
   * The model must always be a Date object, otherwise AngularJS will throw an error.
   * Invalid `Date` objects (dates whose `getTime()` is `NaN`) will be rendered as an empty string.
   * If the model is not set to the first of the month, the next view to model update will set it
   * to the first of the month.
   *
   * The timezone to be used to read/write the `Date` instance in the model can be defined using
   * {@link ng.directive:ngModelOptions ngModelOptions}. By default, this is the timezone of the browser.
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   *   This must be a valid ISO month format (yyyy-MM). You can also use interpolation inside this
   *   attribute (e.g. `min="{{minMonth | date:'yyyy-MM'}}"`). Note that `min` will also add
   *   native HTML5 constraint validation.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   *   This must be a valid ISO month format (yyyy-MM). You can also use interpolation inside this
   *   attribute (e.g. `max="{{maxMonth | date:'yyyy-MM'}}"`). Note that `max` will also add
   *   native HTML5 constraint validation.
   * @param {(date|string)=} ngMin Sets the `min` validation constraint to the Date / ISO week string
   *   the `ngMin` expression evaluates to. Note that it does not set the `min` attribute.
   * @param {(date|string)=} ngMax Sets the `max` validation constraint to the Date / ISO week string
   *   the `ngMax` expression evaluates to. Note that it does not set the `max` attribute.

   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
   <example name="month-input-directive" module="monthExample">
   <file name="index.html">
     <script>
      angular.module('monthExample', [])
        .controller('DateController', ['$scope', function($scope) {
          $scope.example = {
            value: new Date(2013, 9, 1)
          };
        }]);
     </script>
     <form name="myForm" ng-controller="DateController as dateCtrl">
       <label for="exampleInput">Pick a month in 2013:</label>
       <input id="exampleInput" type="month" name="input" ng-model="example.value"
          placeholder="yyyy-MM" min="2013-01" max="2013-12" required />
       <div role="alert">
         <span class="error" ng-show="myForm.input.$error.required">
            Required!</span>
         <span class="error" ng-show="myForm.input.$error.month">
            Not a valid month!</span>
       </div>
       <tt>value = {{example.value | date: "yyyy-MM"}}</tt><br/>
       <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
       <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
       <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
       <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
     </form>
   </file>
   <file name="protractor.js" type="protractor">
      var value = element(by.binding('example.value | date: "yyyy-MM"'));
      var valid = element(by.binding('myForm.input.$valid'));

      // currently protractor/webdriver does not support
      // sending keys to all known HTML5 input controls
      // for various browsers (https://github.com/angular/protractor/issues/562).
      function setInput(val) {
        // set the value of the element and force validation.
        var scr = "var ipt = document.getElementById('exampleInput'); " +
        "ipt.value = '" + val + "';" +
        "angular.element(ipt).scope().$apply(function(s) { s.myForm[ipt.name].$setViewValue('" + val + "'); });";
        browser.executeScript(scr);
      }

      it('should initialize to model', function() {
        expect(value.getText()).toContain('2013-10');
        expect(valid.getText()).toContain('myForm.input.$valid = true');
      });

      it('should be invalid if empty', function() {
        setInput('');
        expect(value.getText()).toEqual('value =');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });

      it('should be invalid if over max', function() {
        setInput('2015-01');
        expect(value.getText()).toContain('');
        expect(valid.getText()).toContain('myForm.input.$valid = false');
      });
   </file>
   </example>
   */
  'month': createDateInputType('month', MONTH_REGEXP,
     createDateParser(MONTH_REGEXP, ['yyyy', 'MM']),
     'yyyy-MM'),

  /**
   * @ngdoc input
   * @name input[number]
   *
   * @description
   * Text input with number validation and transformation. Sets the `number` validation
   * error if not a valid number.
   *
   * <div class="alert alert-warning">
   * The model must always be of type `number` otherwise AngularJS will throw an error.
   * Be aware that a string containing a number is not enough. See the {@link ngModel:numfmt}
   * error docs for more information and an example of how to convert your model if necessary.
   * </div>
   *
   *
   *
   * @knownIssue
   *
   * ### HTML5 constraint validation and `allowInvalid`
   *
   * In browsers that follow the
   * [HTML5 specification](https://html.spec.whatwg.org/multipage/forms.html#number-state-%28type=number%29),
   * `input[number]` does not work as expected with {@link ngModelOptions `ngModelOptions.allowInvalid`}.
   * If a non-number is entered in the input, the browser will report the value as an empty string,
   * which means the view / model values in `ngModel` and subsequently the scope value
   * will also be an empty string.
   *
   * @knownIssue
   *
   * ### Large numbers and `step` validation
   *
   * The `step` validation will not work correctly for very large numbers (e.g. 9999999999) due to
   * Javascript's arithmetic limitations. If you need to handle large numbers, purpose-built
   * libraries (e.g. https://github.com/MikeMcl/big.js/), can be included into AngularJS by
   * {@link guide/forms#modifying-built-in-validators overwriting the validators}
   * for `number` and / or `step`, or by {@link guide/forms#custom-validation applying custom validators}
   * to an `input[text]` element. The source for `input[number]` type can be used as a starting
   * point for both implementations.
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   *    Can be interpolated.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   *    Can be interpolated.
   * @param {string=} ngMin Like `min`, sets the `min` validation error key if the value entered is less than `ngMin`,
   *    but does not trigger HTML5 native validation. Takes an expression.
   * @param {string=} ngMax Like `max`, sets the `max` validation error key if the value entered is greater than `ngMax`,
   *    but does not trigger HTML5 native validation. Takes an expression.
   * @param {string=} step Sets the `step` validation error key if the value entered does not fit the `step` constraint.
   *    Can be interpolated.
   * @param {string=} ngStep Like `step`, sets the `step` validation error key if the value entered does not fit the `ngStep` constraint,
   *    but does not trigger HTML5 native validation. Takes an expression.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the AngularJS expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="number-input-directive" module="numberExample">
        <file name="index.html">
         <script>
           angular.module('numberExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.example = {
                 value: 12
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>Number:
             <input type="number" name="input" ng-model="example.value"
                    min="0" max="99" required>
          </label>
           <div role="alert">
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.number">
               Not valid number!</span>
           </div>
           <tt>value = {{example.value}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          var value = element(by.binding('example.value'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('example.value'));

          it('should initialize to model', function() {
            expect(value.getText()).toContain('12');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');
            expect(value.getText()).toEqual('value =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if over max', function() {
            input.clear();
            input.sendKeys('123');
            expect(value.getText()).toEqual('value =');
            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'number': numberInputType,


  /**
   * @ngdoc input
   * @name input[url]
   *
   * @description
   * Text input with URL validation. Sets the `url` validation error key if the content is not a
   * valid URL.
   *
   * <div class="alert alert-warning">
   * **Note:** `input[url]` uses a regex to validate urls that is derived from the regex
   * used in Chromium. If you need stricter validation, you can use `ng-pattern` or modify
   * the built-in validators (see the {@link guide/forms Forms guide})
   * </div>
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the AngularJS expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="url-input-directive" module="urlExample">
        <file name="index.html">
         <script>
           angular.module('urlExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.url = {
                 text: 'http://google.com'
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>URL:
             <input type="url" name="input" ng-model="url.text" required>
           <label>
           <div role="alert">
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.url">
               Not valid url!</span>
           </div>
           <tt>text = {{url.text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
           <tt>myForm.$error.url = {{!!myForm.$error.url}}</tt><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          var text = element(by.binding('url.text'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('url.text'));

          it('should initialize to model', function() {
            expect(text.getText()).toContain('http://google.com');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');

            expect(text.getText()).toEqual('text =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if not url', function() {
            input.clear();
            input.sendKeys('box');

            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'url': urlInputType,


  /**
   * @ngdoc input
   * @name input[email]
   *
   * @description
   * Text input with email validation. Sets the `email` validation error key if not a valid email
   * address.
   *
   * <div class="alert alert-warning">
   * **Note:** `input[email]` uses a regex to validate email addresses that is derived from the regex
   * used in Chromium, which may not fulfill your app's requirements.
   * If you need stricter (e.g. requiring a top-level domain), or more relaxed validation
   * (e.g. allowing IPv6 address literals) you can use `ng-pattern` or
   * modify the built-in validators (see the {@link guide/forms Forms guide}).
   * </div>
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of
   *    any length.
   * @param {string=} pattern Similar to `ngPattern` except that the attribute value is the actual string
   *    that contains the regular expression body that will be converted to a regular expression
   *    as in the ngPattern directive.
   * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
   *    does not match a RegExp found by evaluating the AngularJS expression given in the attribute value.
   *    If the expression evaluates to a RegExp object, then this is used directly.
   *    If the expression evaluates to a string, then it will be converted to a RegExp
   *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
   *    `new RegExp('^abc$')`.<br />
   *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
   *    start at the index of the last search's match, thus not taking the whole input value into
   *    account.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="email-input-directive" module="emailExample">
        <file name="index.html">
         <script>
           angular.module('emailExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.email = {
                 text: 'me@example.com'
               };
             }]);
         </script>
           <form name="myForm" ng-controller="ExampleController">
             <label>Email:
               <input type="email" name="input" ng-model="email.text" required>
             </label>
             <div role="alert">
               <span class="error" ng-show="myForm.input.$error.required">
                 Required!</span>
               <span class="error" ng-show="myForm.input.$error.email">
                 Not valid email!</span>
             </div>
             <tt>text = {{email.text}}</tt><br/>
             <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
             <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
             <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
             <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
             <tt>myForm.$error.email = {{!!myForm.$error.email}}</tt><br/>
           </form>
         </file>
        <file name="protractor.js" type="protractor">
          var text = element(by.binding('email.text'));
          var valid = element(by.binding('myForm.input.$valid'));
          var input = element(by.model('email.text'));

          it('should initialize to model', function() {
            expect(text.getText()).toContain('me@example.com');
            expect(valid.getText()).toContain('true');
          });

          it('should be invalid if empty', function() {
            input.clear();
            input.sendKeys('');
            expect(text.getText()).toEqual('text =');
            expect(valid.getText()).toContain('false');
          });

          it('should be invalid if not email', function() {
            input.clear();
            input.sendKeys('xxx');

            expect(valid.getText()).toContain('false');
          });
        </file>
      </example>
   */
  'email': emailInputType,


  /**
   * @ngdoc input
   * @name input[radio]
   *
   * @description
   * HTML radio button.
   *
   * **Note:**<br>
   * All inputs controlled by {@link ngModel ngModel} (including those of type `radio`) will use the
   * value of their `name` attribute to determine the property under which their
   * {@link ngModel.NgModelController NgModelController} will be published on the parent
   * {@link form.FormController FormController}. Thus, if you use the same `name` for multiple
   * inputs of a form (e.g. a group of radio inputs), only _one_ `NgModelController` will be
   * published on the parent `FormController` under that name. The rest of the controllers will
   * continue to work as expected, but you won't be able to access them as properties on the parent
   * `FormController`.
   *
   * <div class="alert alert-info">
   *   <p>
   *     In plain HTML forms, the `name` attribute is used to identify groups of radio inputs, so
   *     that the browser can manage their state (checked/unchecked) based on the state of other
   *     inputs in the same group.
   *   </p>
   *   <p>
   *     In AngularJS forms, this is not necessary. The input's state will be updated based on the
   *     value of the underlying model data.
   *   </p>
   * </div>
   *
   * <div class="alert alert-success">
   *   If you omit the `name` attribute on a radio input, `ngModel` will automatically assign it a
   *   unique name.
   * </div>
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string} value The value to which the `ngModel` expression should be set when selected.
   *    Note that `value` only supports `string` values, i.e. the scope model needs to be a string,
   *    too. Use `ngValue` if you need complex models (`number`, `object`, ...).
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   * @param {string} ngValue AngularJS expression to which `ngModel` will be be set when the radio
   *    is selected. Should be used instead of the `value` attribute if you need
   *    a non-string `ngModel` (`boolean`, `array`, ...).
   *
   * @example
      <example name="radio-input-directive" module="radioExample">
        <file name="index.html">
         <script>
           angular.module('radioExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.color = {
                 name: 'blue'
               };
               $scope.specialValue = {
                 "id": "12345",
                 "value": "green"
               };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>
             <input type="radio" ng-model="color.name" value="red">
             Red
           </label><br/>
           <label>
             <input type="radio" ng-model="color.name" ng-value="specialValue">
             Green
           </label><br/>
           <label>
             <input type="radio" ng-model="color.name" value="blue">
             Blue
           </label><br/>
           <tt>color = {{color.name | json}}</tt><br/>
          </form>
          Note that `ng-value="specialValue"` sets radio item's value to be the value of `$scope.specialValue`.
        </file>
        <file name="protractor.js" type="protractor">
          it('should change state', function() {
            var inputs = element.all(by.model('color.name'));
            var color = element(by.binding('color.name'));

            expect(color.getText()).toContain('blue');

            inputs.get(0).click();
            expect(color.getText()).toContain('red');

            inputs.get(1).click();
            expect(color.getText()).toContain('green');
          });
        </file>
      </example>
   */
  'radio': radioInputType,

  /**
   * @ngdoc input
   * @name input[range]
   *
   * @description
   * Native range input with validation and transformation.
   *
   * The model for the range input must always be a `Number`.
   *
   * IE9 and other browsers that do not support the `range` type fall back
   * to a text input without any default values for `min`, `max` and `step`. Model binding,
   * validation and number parsing are nevertheless supported.
   *
   * Browsers that support range (latest Chrome, Safari, Firefox, Edge) treat `input[range]`
   * in a way that never allows the input to hold an invalid value. That means:
   * - any non-numerical value is set to `(max + min) / 2`.
   * - any numerical value that is less than the current min val, or greater than the current max val
   * is set to the min / max val respectively.
   * - additionally, the current `step` is respected, so the nearest value that satisfies a step
   * is used.
   *
   * See the [HTML Spec on input[type=range]](https://www.w3.org/TR/html5/forms.html#range-state-(type=range))
   * for more info.
   *
   * This has the following consequences for AngularJS:
   *
   * Since the element value should always reflect the current model value, a range input
   * will set the bound ngModel expression to the value that the browser has set for the
   * input element. For example, in the following input `<input type="range" ng-model="model.value">`,
   * if the application sets `model.value = null`, the browser will set the input to `'50'`.
   * AngularJS will then set the model to `50`, to prevent input and model value being out of sync.
   *
   * That means the model for range will immediately be set to `50` after `ngModel` has been
   * initialized. It also means a range input can never have the required error.
   *
   * This does not only affect changes to the model value, but also to the values of the `min`,
   * `max`, and `step` attributes. When these change in a way that will cause the browser to modify
   * the input value, AngularJS will also update the model value.
   *
   * Automatic value adjustment also means that a range input element can never have the `required`,
   * `min`, or `max` errors.
   *
   * However, `step` is currently only fully implemented by Firefox. Other browsers have problems
   * when the step value changes dynamically - they do not adjust the element value correctly, but
   * instead may set the `stepMismatch` error. If that's the case, the AngularJS will set the `step`
   * error on the input, and set the model to `undefined`.
   *
   * Note that `input[range]` is not compatible with`ngMax`, `ngMin`, and `ngStep`, because they do
   * not set the `min` and `max` attributes, which means that the browser won't automatically adjust
   * the input value based on their values, and will always assume min = 0, max = 100, and step = 1.
   *
   * @param {string}  ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation to ensure that the value entered is greater
   *                  than `min`. Can be interpolated.
   * @param {string=} max Sets the `max` validation to ensure that the value entered is less than `max`.
   *                  Can be interpolated.
   * @param {string=} step Sets the `step` validation to ensure that the value entered matches the `step`
   *                  Can be interpolated.
   * @param {expression=} ngChange AngularJS expression to be executed when the ngModel value changes due
   *                      to user interaction with the input element.
   * @param {expression=} ngChecked If the expression is truthy, then the `checked` attribute will be set on the
   *                      element. **Note** : `ngChecked` should not be used alongside `ngModel`.
   *                      Checkout {@link ng.directive:ngChecked ngChecked} for usage.
   *
   * @example
      <example name="range-input-directive" module="rangeExample">
        <file name="index.html">
          <script>
            angular.module('rangeExample', [])
              .controller('ExampleController', ['$scope', function($scope) {
                $scope.value = 75;
                $scope.min = 10;
                $scope.max = 90;
              }]);
          </script>
          <form name="myForm" ng-controller="ExampleController">

            Model as range: <input type="range" name="range" ng-model="value" min="{{min}}"  max="{{max}}">
            <hr>
            Model as number: <input type="number" ng-model="value"><br>
            Min: <input type="number" ng-model="min"><br>
            Max: <input type="number" ng-model="max"><br>
            value = <code>{{value}}</code><br/>
            myForm.range.$valid = <code>{{myForm.range.$valid}}</code><br/>
            myForm.range.$error = <code>{{myForm.range.$error}}</code>
          </form>
        </file>
      </example>

   * ## Range Input with ngMin & ngMax attributes

   * @example
      <example name="range-input-directive-ng" module="rangeExample">
        <file name="index.html">
          <script>
            angular.module('rangeExample', [])
              .controller('ExampleController', ['$scope', function($scope) {
                $scope.value = 75;
                $scope.min = 10;
                $scope.max = 90;
              }]);
          </script>
          <form name="myForm" ng-controller="ExampleController">
            Model as range: <input type="range" name="range" ng-model="value" ng-min="min" ng-max="max">
            <hr>
            Model as number: <input type="number" ng-model="value"><br>
            Min: <input type="number" ng-model="min"><br>
            Max: <input type="number" ng-model="max"><br>
            value = <code>{{value}}</code><br/>
            myForm.range.$valid = <code>{{myForm.range.$valid}}</code><br/>
            myForm.range.$error = <code>{{myForm.range.$error}}</code>
          </form>
        </file>
      </example>

   */
  'range': rangeInputType,

  /**
   * @ngdoc input
   * @name input[checkbox]
   *
   * @description
   * HTML checkbox.
   *
   * @param {string} ngModel Assignable AngularJS expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {expression=} ngTrueValue The value to which the expression should be set when selected.
   * @param {expression=} ngFalseValue The value to which the expression should be set when not selected.
   * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <example name="checkbox-input-directive" module="checkboxExample">
        <file name="index.html">
         <script>
           angular.module('checkboxExample', [])
             .controller('ExampleController', ['$scope', function($scope) {
               $scope.checkboxModel = {
                value1 : true,
                value2 : 'YES'
              };
             }]);
         </script>
         <form name="myForm" ng-controller="ExampleController">
           <label>Value1:
             <input type="checkbox" ng-model="checkboxModel.value1">
           </label><br/>
           <label>Value2:
             <input type="checkbox" ng-model="checkboxModel.value2"
                    ng-true-value="'YES'" ng-false-value="'NO'">
            </label><br/>
           <tt>value1 = {{checkboxModel.value1}}</tt><br/>
           <tt>value2 = {{checkboxModel.value2}}</tt><br/>
          </form>
        </file>
        <file name="protractor.js" type="protractor">
          it('should change state', function() {
            var value1 = element(by.binding('checkboxModel.value1'));
            var value2 = element(by.binding('checkboxModel.value2'));

            expect(value1.getText()).toContain('true');
            expect(value2.getText()).toContain('YES');

            element(by.model('checkboxModel.value1')).click();
            element(by.model('checkboxModel.value2')).click();

            expect(value1.getText()).toContain('false');
            expect(value2.getText()).toContain('NO');
          });
        </file>
      </example>
   */
  'checkbox': checkboxInputType,

  'hidden': noop,
  'button': noop,
  'submit': noop,
  'reset': noop,
  'file': noop
};

function stringBasedInputType(ctrl) {
  ctrl.$formatters.push(function(value) {
    return ctrl.$isEmpty(value) ? value : value.toString();
  });
}

function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);
}

function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  var type = lowercase(element[0].type);

  // In composition mode, users are still inputting intermediate text buffer,
  // hold the listener until composition is done.
  // More about composition events: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
  if (!$sniffer.android) {
    var composing = false;

    element.on('compositionstart', function() {
      composing = true;
    });

    // Support: IE9+
    element.on('compositionupdate', function(ev) {
      // End composition when ev.data is empty string on 'compositionupdate' event.
      // When the input de-focusses (e.g. by clicking away), IE triggers 'compositionupdate'
      // instead of 'compositionend'.
      if (isUndefined(ev.data) || ev.data === '') {
        composing = false;
      }
    });

    element.on('compositionend', function() {
      composing = false;
      listener();
    });
  }

  var timeout;

  var listener = function(ev) {
    if (timeout) {
      $browser.defer.cancel(timeout);
      timeout = null;
    }
    if (composing) return;
    var value = element.val(),
        event = ev && ev.type;

    // By default we will trim the value
    // If the attribute ng-trim exists we will avoid trimming
    // If input type is 'password', the value is never trimmed
    if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
      value = trim(value);
    }

    // If a control is suffering from bad input (due to native validators), browsers discard its
    // value, so it may be necessary to revalidate (by calling $setViewValue again) even if the
    // control's value is the same empty value twice in a row.
    if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators)) {
      ctrl.$setViewValue(value, event);
    }
  };

  // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
  // input event on backspace, delete or cut
  if ($sniffer.hasEvent('input')) {
    element.on('input', listener);
  } else {
    var deferListener = function(ev, input, origValue) {
      if (!timeout) {
        timeout = $browser.defer(function() {
          timeout = null;
          if (!input || input.value !== origValue) {
            listener(ev);
          }
        });
      }
    };

    element.on('keydown', /** @this */ function(event) {
      var key = event.keyCode;

      // ignore
      //    command            modifiers                   arrows
      if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

      deferListener(event, this, this.value);
    });

    // if user modifies input value using context menu in IE, we need "paste", "cut" and "drop" events to catch it
    if ($sniffer.hasEvent('paste')) {
      element.on('paste cut drop', deferListener);
    }
  }

  // if user paste into input using mouse on older browser
  // or form autocomplete on newer browser, we need "change" event to catch it
  element.on('change', listener);

  // Some native input types (date-family) have the ability to change validity without
  // firing any input/change events.
  // For these event types, when native validators are present and the browser supports the type,
  // check for validity changes on various DOM events.
  if (PARTIAL_VALIDATION_TYPES[type] && ctrl.$$hasNativeValidators && type === attr.type) {
    element.on(PARTIAL_VALIDATION_EVENTS, /** @this */ function(ev) {
      if (!timeout) {
        var validity = this[VALIDITY_STATE_PROPERTY];
        var origBadInput = validity.badInput;
        var origTypeMismatch = validity.typeMismatch;
        timeout = $browser.defer(function() {
          timeout = null;
          if (validity.badInput !== origBadInput || validity.typeMismatch !== origTypeMismatch) {
            listener(ev);
          }
        });
      }
    });
  }

  ctrl.$render = function() {
    // Workaround for Firefox validation #12102.
    var value = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
    if (element.val() !== value) {
      element.val(value);
    }
  };
}

function weekParser(isoWeek, existingDate) {
  if (isDate(isoWeek)) {
    return isoWeek;
  }

  if (isString(isoWeek)) {
    WEEK_REGEXP.lastIndex = 0;
    var parts = WEEK_REGEXP.exec(isoWeek);
    if (parts) {
      var year = +parts[1],
          week = +parts[2],
          hours = 0,
          minutes = 0,
          seconds = 0,
          milliseconds = 0,
          firstThurs = getFirstThursdayOfYear(year),
          addDays = (week - 1) * 7;

      if (existingDate) {
        hours = existingDate.getHours();
        minutes = existingDate.getMinutes();
        seconds = existingDate.getSeconds();
        milliseconds = existingDate.getMilliseconds();
      }

      return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
    }
  }

  return NaN;
}

function createDateParser(regexp, mapping) {
  return function(iso, previousDate) {
    var parts, map;

    if (isDate(iso)) {
      return iso;
    }

    if (isString(iso)) {
      // When a date is JSON'ified to wraps itself inside of an extra
      // set of double quotes. This makes the date parsing code unable
      // to match the date string and parse it as a date.
      if (iso.charAt(0) === '"' && iso.charAt(iso.length - 1) === '"') {
        iso = iso.substring(1, iso.length - 1);
      }
      if (ISO_DATE_REGEXP.test(iso)) {
        return new Date(iso);
      }
      regexp.lastIndex = 0;
      parts = regexp.exec(iso);

      if (parts) {
        parts.shift();
        if (previousDate) {
          map = {
            yyyy: previousDate.getFullYear(),
            MM: previousDate.getMonth() + 1,
            dd: previousDate.getDate(),
            HH: previousDate.getHours(),
            mm: previousDate.getMinutes(),
            ss: previousDate.getSeconds(),
            sss: previousDate.getMilliseconds() / 1000
          };
        } else {
          map = { yyyy: 1970, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, sss: 0 };
        }

        forEach(parts, function(part, index) {
          if (index < mapping.length) {
            map[mapping[index]] = +part;
          }
        });

        var date = new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1000 || 0);
        if (map.yyyy < 100) {
          // In the constructor, 2-digit years map to 1900-1999.
          // Use `setFullYear()` to set the correct year.
          date.setFullYear(map.yyyy);
        }

        return date;
      }
    }

    return NaN;
  };
}

function createDateInputType(type, regexp, parseDate, format) {
  return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
    badInputChecker(scope, element, attr, ctrl, type);
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);

    var isTimeType = type === 'time' || type === 'datetimelocal';
    var previousDate;
    var previousTimezone;

    ctrl.$parsers.push(function(value) {
      if (ctrl.$isEmpty(value)) return null;

      if (regexp.test(value)) {
        // Note: We cannot read ctrl.$modelValue, as there might be a different
        // parser/formatter in the processing chain so that the model
        // contains some different data format!
        return parseDateAndConvertTimeZoneToLocal(value, previousDate);
      }
      ctrl.$$parserName = type;
      return undefined;
    });

    ctrl.$formatters.push(function(value) {
      if (value && !isDate(value)) {
        throw ngModelMinErr('datefmt', 'Expected `{0}` to be a date', value);
      }
      if (isValidDate(value)) {
        previousDate = value;
        var timezone = ctrl.$options.getOption('timezone');

        if (timezone) {
          previousTimezone = timezone;
          previousDate = convertTimezoneToLocal(previousDate, timezone, true);
        }

        return formatter(value, timezone);
      } else {
        previousDate = null;
        previousTimezone = null;
        return '';
      }
    });

    if (isDefined(attr.min) || attr.ngMin) {
      var minVal = attr.min || $parse(attr.ngMin)(scope);
      var parsedMinVal = parseObservedDateValue(minVal);

      ctrl.$validators.min = function(value) {
        return !isValidDate(value) || isUndefined(parsedMinVal) || parseDate(value) >= parsedMinVal;
      };
      attr.$observe('min', function(val) {
        if (val !== minVal) {
          parsedMinVal = parseObservedDateValue(val);
          minVal = val;
          ctrl.$validate();
        }
      });
    }

    if (isDefined(attr.max) || attr.ngMax) {
      var maxVal = attr.max || $parse(attr.ngMax)(scope);
      var parsedMaxVal = parseObservedDateValue(maxVal);

      ctrl.$validators.max = function(value) {
        return !isValidDate(value) || isUndefined(parsedMaxVal) || parseDate(value) <= parsedMaxVal;
      };
      attr.$observe('max', function(val) {
        if (val !== maxVal) {
          parsedMaxVal = parseObservedDateValue(val);
          maxVal = val;
          ctrl.$validate();
        }
      });
    }

    function isValidDate(value) {
      // Invalid Date: getTime() returns NaN
      return value && !(value.getTime && value.getTime() !== value.getTime());
    }

    function parseObservedDateValue(val) {
      return isDefined(val) && !isDate(val) ? parseDateAndConvertTimeZoneToLocal(val) || undefined : val;
    }

    function parseDateAndConvertTimeZoneToLocal(value, previousDate) {
      var timezone = ctrl.$options.getOption('timezone');

      if (previousTimezone && previousTimezone !== timezone) {
        // If the timezone has changed, adjust the previousDate to the default timezone
        // so that the new date is converted with the correct timezone offset
        previousDate = addDateMinutes(previousDate, timezoneToOffset(previousTimezone));
      }

      var parsedDate = parseDate(value, previousDate);

      if (!isNaN(parsedDate) && timezone) {
        parsedDate = convertTimezoneToLocal(parsedDate, timezone);
      }
      return parsedDate;
    }

    function formatter(value, timezone) {
      var targetFormat = format;

      if (isTimeType && isString(ctrl.$options.getOption('timeSecondsFormat'))) {
        targetFormat = format
          .replace('ss.sss', ctrl.$options.getOption('timeSecondsFormat'))
          .replace(/:$/, '');
      }

      var formatted =  $filter('date')(value, targetFormat, timezone);

      if (isTimeType && ctrl.$options.getOption('timeStripZeroSeconds')) {
        formatted = formatted.replace(/(?::00)?(?:\.000)?$/, '');
      }

      return formatted;
    }
  };
}

function badInputChecker(scope, element, attr, ctrl, parserName) {
  var node = element[0];
  var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
  if (nativeValidation) {
    ctrl.$parsers.push(function(value) {
      var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
      if (validity.badInput || validity.typeMismatch) {
        ctrl.$$parserName = parserName;
        return undefined;
      }

      return value;
    });
  }
}

function numberFormatterParser(ctrl) {
  ctrl.$parsers.push(function(value) {
    if (ctrl.$isEmpty(value))      return null;
    if (NUMBER_REGEXP.test(value)) return parseFloat(value);

    ctrl.$$parserName = 'number';
    return undefined;
  });

  ctrl.$formatters.push(function(value) {
    if (!ctrl.$isEmpty(value)) {
      if (!isNumber(value)) {
        throw ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);
      }
      value = value.toString();
    }
    return value;
  });
}

function parseNumberAttrVal(val) {
  if (isDefined(val) && !isNumber(val)) {
    val = parseFloat(val);
  }
  return !isNumberNaN(val) ? val : undefined;
}

function isNumberInteger(num) {
  // See http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript#14794066
  // (minus the assumption that `num` is a number)

  // eslint-disable-next-line no-bitwise
  return (num | 0) === num;
}

function countDecimals(num) {
  var numString = num.toString();
  var decimalSymbolIndex = numString.indexOf('.');

  if (decimalSymbolIndex === -1) {
    if (-1 < num && num < 1) {
      // It may be in the exponential notation format (`1e-X`)
      var match = /e-(\d+)$/.exec(numString);

      if (match) {
        return Number(match[1]);
      }
    }

    return 0;
  }

  return numString.length - decimalSymbolIndex - 1;
}

function isValidForStep(viewValue, stepBase, step) {
  // At this point `stepBase` and `step` are expected to be non-NaN values
  // and `viewValue` is expected to be a valid stringified number.
  var value = Number(viewValue);

  var isNonIntegerValue = !isNumberInteger(value);
  var isNonIntegerStepBase = !isNumberInteger(stepBase);
  var isNonIntegerStep = !isNumberInteger(step);

  // Due to limitations in Floating Point Arithmetic (e.g. `0.3 - 0.2 !== 0.1` or
  // `0.5 % 0.1 !== 0`), we need to convert all numbers to integers.
  if (isNonIntegerValue || isNonIntegerStepBase || isNonIntegerStep) {
    var valueDecimals = isNonIntegerValue ? countDecimals(value) : 0;
    var stepBaseDecimals = isNonIntegerStepBase ? countDecimals(stepBase) : 0;
    var stepDecimals = isNonIntegerStep ? countDecimals(step) : 0;

    var decimalCount = Math.max(valueDecimals, stepBaseDecimals, stepDecimals);
    var multiplier = Math.pow(10, decimalCount);

    value = value * multiplier;
    stepBase = stepBase * multiplier;
    step = step * multiplier;

    if (isNonIntegerValue) value = Math.round(value);
    if (isNonIntegerStepBase) stepBase = Math.round(stepBase);
    if (isNonIntegerStep) step = Math.round(step);
  }

  return (value - stepBase) % step === 0;
}

function numberInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
  badInputChecker(scope, element, attr, ctrl, 'number');
  numberFormatterParser(ctrl);
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var parsedMinVal;

  if (isDefined(attr.min) || attr.ngMin) {
    var minVal = attr.min || $parse(attr.ngMin)(scope);
    parsedMinVal = parseNumberAttrVal(minVal);

    ctrl.$validators.min = function(modelValue, viewValue) {
      return ctrl.$isEmpty(viewValue) || isUndefined(parsedMinVal) || viewValue >= parsedMinVal;
    };

    attr.$observe('min', function(val) {
      if (val !== minVal) {
        parsedMinVal = parseNumberAttrVal(val);
        minVal = val;
        // TODO(matsko): implement validateLater to reduce number of validations
        ctrl.$validate();
      }
    });
  }

  if (isDefined(attr.max) || attr.ngMax) {
    var maxVal = attr.max || $parse(attr.ngMax)(scope);
    var parsedMaxVal = parseNumberAttrVal(maxVal);

    ctrl.$validators.max = function(modelValue, viewValue) {
      return ctrl.$isEmpty(viewValue) || isUndefined(parsedMaxVal) || viewValue <= parsedMaxVal;
    };

    attr.$observe('max', function(val) {
      if (val !== maxVal) {
        parsedMaxVal = parseNumberAttrVal(val);
        maxVal = val;
        // TODO(matsko): implement validateLater to reduce number of validations
        ctrl.$validate();
      }
    });
  }

  if (isDefined(attr.step) || attr.ngStep) {
    var stepVal = attr.step || $parse(attr.ngStep)(scope);
    var parsedStepVal = parseNumberAttrVal(stepVal);

    ctrl.$validators.step = function(modelValue, viewValue) {
      return ctrl.$isEmpty(viewValue) || isUndefined(parsedStepVal) ||
        isValidForStep(viewValue, parsedMinVal || 0, parsedStepVal);
    };

    attr.$observe('step', function(val) {
      // TODO(matsko): implement validateLater to reduce number of validations
      if (val !== stepVal) {
        parsedStepVal = parseNumberAttrVal(val);
        stepVal = val;
        ctrl.$validate();
      }

    });

  }
}

function rangeInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  badInputChecker(scope, element, attr, ctrl, 'range');
  numberFormatterParser(ctrl);
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var supportsRange = ctrl.$$hasNativeValidators && element[0].type === 'range',
      minVal = supportsRange ? 0 : undefined,
      maxVal = supportsRange ? 100 : undefined,
      stepVal = supportsRange ? 1 : undefined,
      validity = element[0].validity,
      hasMinAttr = isDefined(attr.min),
      hasMaxAttr = isDefined(attr.max),
      hasStepAttr = isDefined(attr.step);

  var originalRender = ctrl.$render;

  ctrl.$render = supportsRange && isDefined(validity.rangeUnderflow) && isDefined(validity.rangeOverflow) ?
    //Browsers that implement range will set these values automatically, but reading the adjusted values after
    //$render would cause the min / max validators to be applied with the wrong value
    function rangeRender() {
      originalRender();
      ctrl.$setViewValue(element.val());
    } :
    originalRender;

  if (hasMinAttr) {
    minVal = parseNumberAttrVal(attr.min);

    ctrl.$validators.min = supportsRange ?
      // Since all browsers set the input to a valid value, we don't need to check validity
      function noopMinValidator() { return true; } :
      // non-support browsers validate the min val
      function minValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(minVal) || viewValue >= minVal;
      };

    setInitialValueAndObserver('min', minChange);
  }

  if (hasMaxAttr) {
    maxVal = parseNumberAttrVal(attr.max);

    ctrl.$validators.max = supportsRange ?
      // Since all browsers set the input to a valid value, we don't need to check validity
      function noopMaxValidator() { return true; } :
      // non-support browsers validate the max val
      function maxValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(maxVal) || viewValue <= maxVal;
      };

    setInitialValueAndObserver('max', maxChange);
  }

  if (hasStepAttr) {
    stepVal = parseNumberAttrVal(attr.step);

    ctrl.$validators.step = supportsRange ?
      function nativeStepValidator() {
        // Currently, only FF implements the spec on step change correctly (i.e. adjusting the
        // input element value to a valid value). It's possible that other browsers set the stepMismatch
        // validity error instead, so we can at least report an error in that case.
        return !validity.stepMismatch;
      } :
      // ngStep doesn't set the setp attr, so the browser doesn't adjust the input value as setting step would
      function stepValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(stepVal) ||
               isValidForStep(viewValue, minVal || 0, stepVal);
      };

    setInitialValueAndObserver('step', stepChange);
  }

  function setInitialValueAndObserver(htmlAttrName, changeFn) {
    // interpolated attributes set the attribute value only after a digest, but we need the
    // attribute value when the input is first rendered, so that the browser can adjust the
    // input value based on the min/max value
    element.attr(htmlAttrName, attr[htmlAttrName]);
    var oldVal = attr[htmlAttrName];
    attr.$observe(htmlAttrName, function wrappedObserver(val) {
      if (val !== oldVal) {
        oldVal = val;
        changeFn(val);
      }
    });
  }

  function minChange(val) {
    minVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    if (supportsRange) {
      var elVal = element.val();
      // IE11 doesn't set the el val correctly if the minVal is greater than the element value
      if (minVal > elVal) {
        elVal = minVal;
        element.val(elVal);
      }
      ctrl.$setViewValue(elVal);
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }

  function maxChange(val) {
    maxVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    if (supportsRange) {
      var elVal = element.val();
      // IE11 doesn't set the el val correctly if the maxVal is less than the element value
      if (maxVal < elVal) {
        element.val(maxVal);
        // IE11 and Chrome don't set the value to the minVal when max < min
        elVal = maxVal < minVal ? minVal : maxVal;
      }
      ctrl.$setViewValue(elVal);
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }

  function stepChange(val) {
    stepVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    // Some browsers don't adjust the input value correctly, but set the stepMismatch error
    if (!supportsRange) {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    } else if (ctrl.$viewValue !== element.val()) {
      ctrl.$setViewValue(element.val());
    }
  }
}

function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  // Note: no badInputChecker here by purpose as `url` is only a validation
  // in browsers, i.e. we can always read out input.value even if it is not valid!
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);

  ctrl.$validators.url = function(modelValue, viewValue) {
    var value = modelValue || viewValue;
    return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
  };
}

function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  // Note: no badInputChecker here by purpose as `url` is only a validation
  // in browsers, i.e. we can always read out input.value even if it is not valid!
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);

  ctrl.$validators.email = function(modelValue, viewValue) {
    var value = modelValue || viewValue;
    return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
  };
}

function radioInputType(scope, element, attr, ctrl) {
  var doTrim = !attr.ngTrim || trim(attr.ngTrim) !== 'false';
  // make the name unique, if not defined
  if (isUndefined(attr.name)) {
    element.attr('name', nextUid());
  }

  var listener = function(ev) {
    var value;
    if (element[0].checked) {
      value = attr.value;
      if (doTrim) {
        value = trim(value);
      }
      ctrl.$setViewValue(value, ev && ev.type);
    }
  };

  element.on('change', listener);

  ctrl.$render = function() {
    var value = attr.value;
    if (doTrim) {
      value = trim(value);
    }
    element[0].checked = (value === ctrl.$viewValue);
  };

  attr.$observe('value', ctrl.$render);
}

function parseConstantExpr($parse, context, name, expression, fallback) {
  var parseFn;
  if (isDefined(expression)) {
    parseFn = $parse(expression);
    if (!parseFn.constant) {
      throw ngModelMinErr('constexpr', 'Expected constant expression for `{0}`, but saw ' +
                                   '`{1}`.', name, expression);
    }
    return parseFn(context);
  }
  return fallback;
}

function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
  var trueValue = parseConstantExpr($parse, scope, 'ngTrueValue', attr.ngTrueValue, true);
  var falseValue = parseConstantExpr($parse, scope, 'ngFalseValue', attr.ngFalseValue, false);

  var listener = function(ev) {
    ctrl.$setViewValue(element[0].checked, ev && ev.type);
  };

  element.on('change', listener);

  ctrl.$render = function() {
    element[0].checked = ctrl.$viewValue;
  };

  // Override the standard `$isEmpty` because the $viewValue of an empty checkbox is always set to `false`
  // This is because of the parser below, which compares the `$modelValue` with `trueValue` to convert
  // it to a boolean.
  ctrl.$isEmpty = function(value) {
    return value === false;
  };

  ctrl.$formatters.push(function(value) {
    return equals(value, trueValue);
  });

  ctrl.$parsers.push(function(value) {
    return value ? trueValue : falseValue;
  });
}


/**
 * @ngdoc directive
 * @name textarea
 * @restrict E
 *
 * @description
 * HTML textarea element control with AngularJS data-binding. The data-binding and validation
 * properties of this element are exactly the same as those of the
 * {@link ng.directive:input input element}.
 *
 * @param {string} ngModel Assignable AngularJS expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of any
 *    length.
 * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
 *    does not match a RegExp found by evaluating the AngularJS expression given in the attribute value.
 *    If the expression evaluates to a RegExp object, then this is used directly.
 *    If the expression evaluates to a string, then it will be converted to a RegExp
 *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
 *    `new RegExp('^abc$')`.<br />
 *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
 *    start at the index of the last search's match, thus not taking the whole input value into
 *    account.
 * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
 *    interaction with the input element.
 * @param {boolean=} [ngTrim=true] If set to false AngularJS will not automatically trim the input.
 *
 * @knownIssue
 *
 * When specifying the `placeholder` attribute of `<textarea>`, Internet Explorer will temporarily
 * insert the placeholder value as the textarea's content. If the placeholder value contains
 * interpolation (`{{ ... }}`), an error will be logged in the console when AngularJS tries to update
 * the value of the by-then-removed text node. This doesn't affect the functionality of the
 * textarea, but can be undesirable.
 *
 * You can work around this Internet Explorer issue by using `ng-attr-placeholder` instead of
 * `placeholder` on textareas, whenever you need interpolation in the placeholder value. You can
 * find more details on `ngAttr` in the
 * [Interpolation](guide/interpolation#-ngattr-for-binding-to-arbitrary-attributes) section of the
 * Developer Guide.
 */


/**
 * @ngdoc directive
 * @name input
 * @restrict E
 *
 * @description
 * HTML input element control. When used together with {@link ngModel `ngModel`}, it provides data-binding,
 * input state control, and validation.
 * Input control follows HTML5 input types and polyfills the HTML5 validation behavior for older browsers.
 *
 * <div class="alert alert-warning">
 * **Note:** Not every feature offered is available for all input types.
 * Specifically, data binding and event handling via `ng-model` is unsupported for `input[file]`.
 * </div>
 *
 * @param {string} ngModel Assignable AngularJS expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {boolean=} ngRequired Sets `required` attribute if set to true
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength. Setting the attribute to a negative or non-numeric value, allows view values of any
 *    length.
 * @param {string=} ngPattern Sets `pattern` validation error key if the ngModel {@link ngModel.NgModelController#$viewValue $viewValue}
 *    value does not match a RegExp found by evaluating the AngularJS expression given in the attribute value.
 *    If the expression evaluates to a RegExp object, then this is used directly.
 *    If the expression evaluates to a string, then it will be converted to a RegExp
 *    after wrapping it in `^` and `$` characters. For instance, `"abc"` will be converted to
 *    `new RegExp('^abc$')`.<br />
 *    **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
 *    start at the index of the last search's match, thus not taking the whole input value into
 *    account.
 * @param {string=} ngChange AngularJS expression to be executed when input changes due to user
 *    interaction with the input element.
 * @param {boolean=} [ngTrim=true] If set to false AngularJS will not automatically trim the input.
 *    This parameter is ignored for input[type=password] controls, which will never trim the
 *    input.
 *
 * @example
    <example name="input-directive" module="inputExample">
      <file name="index.html">
       <script>
          angular.module('inputExample', [])
            .controller('ExampleController', ['$scope', function($scope) {
              $scope.user = {name: 'guest', last: 'visitor'};
            }]);
       </script>
       <div ng-controller="ExampleController">
         <form name="myForm">
           <label>
              User name:
              <input type="text" name="userName" ng-model="user.name" required>
           </label>
           <div role="alert">
             <span class="error" ng-show="myForm.userName.$error.required">
              Required!</span>
           </div>
           <label>
              Last name:
              <input type="text" name="lastName" ng-model="user.last"
              ng-minlength="3" ng-maxlength="10">
           </label>
           <div role="alert">
             <span class="error" ng-show="myForm.lastName.$error.minlength">
               Too short!</span>
             <span class="error" ng-show="myForm.lastName.$error.maxlength">
               Too long!</span>
           </div>
         </form>
         <hr>
         <tt>user = {{user}}</tt><br/>
         <tt>myForm.userName.$valid = {{myForm.userName.$valid}}</tt><br/>
         <tt>myForm.userName.$error = {{myForm.userName.$error}}</tt><br/>
         <tt>myForm.lastName.$valid = {{myForm.lastName.$valid}}</tt><br/>
         <tt>myForm.lastName.$error = {{myForm.lastName.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
         <tt>myForm.$error.minlength = {{!!myForm.$error.minlength}}</tt><br/>
         <tt>myForm.$error.maxlength = {{!!myForm.$error.maxlength}}</tt><br/>
       </div>
      </file>
      <file name="protractor.js" type="protractor">
        var user = element(by.exactBinding('user'));
        var userNameValid = element(by.binding('myForm.userName.$valid'));
        var lastNameValid = element(by.binding('myForm.lastName.$valid'));
        var lastNameError = element(by.binding('myForm.lastName.$error'));
        var formValid = element(by.binding('myForm.$valid'));
        var userNameInput = element(by.model('user.name'));
        var userLastInput = element(by.model('user.last'));

        it('should initialize to model', function() {
          expect(user.getText()).toContain('{"name":"guest","last":"visitor"}');
          expect(userNameValid.getText()).toContain('true');
          expect(formValid.getText()).toContain('true');
        });

        it('should be invalid if empty when required', function() {
          userNameInput.clear();
          userNameInput.sendKeys('');

          expect(user.getText()).toContain('{"last":"visitor"}');
          expect(userNameValid.getText()).toContain('false');
          expect(formValid.getText()).toContain('false');
        });

        it('should be valid if empty when min length is set', function() {
          userLastInput.clear();
          userLastInput.sendKeys('');

          expect(user.getText()).toContain('{"name":"guest","last":""}');
          expect(lastNameValid.getText()).toContain('true');
          expect(formValid.getText()).toContain('true');
        });

        it('should be invalid if less than required min length', function() {
          userLastInput.clear();
          userLastInput.sendKeys('xx');

          expect(user.getText()).toContain('{"name":"guest"}');
          expect(lastNameValid.getText()).toContain('false');
          expect(lastNameError.getText()).toContain('minlength');
          expect(formValid.getText()).toContain('false');
        });

        it('should be invalid if longer than max length', function() {
          userLastInput.clear();
          userLastInput.sendKeys('some ridiculously long name');

          expect(user.getText()).toContain('{"name":"guest"}');
          expect(lastNameValid.getText()).toContain('false');
          expect(lastNameError.getText()).toContain('maxlength');
          expect(formValid.getText()).toContain('false');
        });
      </file>
    </example>
 */
var inputDirective = ['$browser', '$sniffer', '$filter', '$parse',
    function($browser, $sniffer, $filter, $parse) {
  return {
    restrict: 'E',
    require: ['?ngModel'],
    link: {
      pre: function(scope, element, attr, ctrls) {
        if (ctrls[0]) {
          (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer,
                                                              $browser, $filter, $parse);
        }
      }
    }
  };
}];


var hiddenInputBrowserCacheDirective = function() {
  var valueProperty = {
    configurable: true,
    enumerable: false,
    get: function() {
      return this.getAttribute('value') || '';
    },
    set: function(val) {
      this.setAttribute('value', val);
    }
  };

  return {
    restrict: 'E',
    priority: 200,
    compile: function(_, attr) {
      if (lowercase(attr.type) !== 'hidden') {
        return;
      }

      return {
        pre: function(scope, element, attr, ctrls) {
          var node = element[0];

          // Support: Edge
          // Moving the DOM around prevents autofillling
          if (node.parentNode) {
            node.parentNode.insertBefore(node, node.nextSibling);
          }

          // Support: FF, IE
          // Avoiding direct assignment to .value prevents autofillling
          if (Object.defineProperty) {
            Object.defineProperty(node, 'value', valueProperty);
          }
        }
      };
    }
  };
};



var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
/**
 * @ngdoc directive
 * @name ngValue
 * @restrict A
 * @priority 100
 *
 * @description
 * Binds the given expression to the value of the element.
 *
 * It is mainly used on {@link input[radio] `input[radio]`} and option elements,
 * so that when the element is selected, the {@link ngModel `ngModel`} of that element (or its
 * {@link select `select`} parent element) is set to the bound value. It is especially useful
 * for dynamically generated lists using {@link ngRepeat `ngRepeat`}, as shown below.
 *
 * It can also be used to achieve one-way binding of a given expression to an input element
 * such as an `input[text]` or a `textarea`, when that element does not use ngModel.
 *
 * @element ANY
 * @param {string=} ngValue AngularJS expression, whose value will be bound to the `value` attribute
 * and `value` property of the element.
 *
 * @example
    <example name="ngValue-directive" module="valueExample">
      <file name="index.html">
       <script>
          angular.module('valueExample', [])
            .controller('ExampleController', ['$scope', function($scope) {
              $scope.names = ['pizza', 'unicorns', 'robots'];
              $scope.my = { favorite: 'unicorns' };
            }]);
       </script>
        <form ng-controller="ExampleController">
          <h2>Which is your favorite?</h2>
            <label ng-repeat="name in names" for="{{name}}">
              {{name}}
              <input type="radio"
                     ng-model="my.favorite"
                     ng-value="name"
                     id="{{name}}"
                     name="favorite">
            </label>
          <div>You chose {{my.favorite}}</div>
        </form>
      </file>
      <file name="protractor.js" type="protractor">
        var favorite = element(by.binding('my.favorite'));

        it('should initialize to model', function() {
          expect(favorite.getText()).toContain('unicorns');
        });
        it('should bind the values to the inputs', function() {
          element.all(by.model('my.favorite')).get(0).click();
          expect(favorite.getText()).toContain('pizza');
        });
      </file>
    </example>
 */
var ngValueDirective = function() {
  /**
   *  inputs use the value attribute as their default value if the value property is not set.
   *  Once the value property has been set (by adding input), it will not react to changes to
   *  the value attribute anymore. Setting both attribute and property fixes this behavior, and
   *  makes it possible to use ngValue as a sort of one-way bind.
   */
  function updateElementValue(element, attr, value) {
    // Support: IE9 only
    // In IE9 values are converted to string (e.g. `input.value = null` results in `input.value === 'null'`).
    var propValue = isDefined(value) ? value : (msie === 9) ? '' : null;
    element.prop('value', propValue);
    attr.$set('value', value);
  }

  return {
    restrict: 'A',
    priority: 100,
    compile: function(tpl, tplAttr) {
      if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
        return function ngValueConstantLink(scope, elm, attr) {
          var value = scope.$eval(attr.ngValue);
          updateElementValue(elm, attr, value);
        };
      } else {
        return function ngValueLink(scope, elm, attr) {
          scope.$watch(attr.ngValue, function valueWatchAction(value) {
            updateElementValue(elm, attr, value);
          });
        };
      }
    }
  };
};

function addSetValidityMethod(context) {
  var clazz = context.clazz,
      set = context.set,
      unset = context.unset;

  clazz.prototype.$setValidity = function(validationErrorKey, state, controller) {
    if (isUndefined(state)) {
      createAndSet(this, '$pending', validationErrorKey, controller);
    } else {
      unsetAndCleanup(this, '$pending', validationErrorKey, controller);
    }
    if (!isBoolean(state)) {
      unset(this.$error, validationErrorKey, controller);
      unset(this.$$success, validationErrorKey, controller);
    } else {
      if (state) {
        unset(this.$error, validationErrorKey, controller);
        set(this.$$success, validationErrorKey, controller);
      } else {
        set(this.$error, validationErrorKey, controller);
        unset(this.$$success, validationErrorKey, controller);
      }
    }
    if (this.$pending) {
      cachedToggleClass(this, PENDING_CLASS, true);
      this.$valid = this.$invalid = undefined;
      toggleValidationCss(this, '', null);
    } else {
      cachedToggleClass(this, PENDING_CLASS, false);
      this.$valid = isObjectEmpty(this.$error);
      this.$invalid = !this.$valid;
      toggleValidationCss(this, '', this.$valid);
    }

    // re-read the state as the set/unset methods could have
    // combined state in this.$error[validationError] (used for forms),
    // where setting/unsetting only increments/decrements the value,
    // and does not replace it.
    var combinedState;
    if (this.$pending && this.$pending[validationErrorKey]) {
      combinedState = undefined;
    } else if (this.$error[validationErrorKey]) {
      combinedState = false;
    } else if (this.$$success[validationErrorKey]) {
      combinedState = true;
    } else {
      combinedState = null;
    }

    toggleValidationCss(this, validationErrorKey, combinedState);
    this.$$parentForm.$setValidity(validationErrorKey, combinedState, this);
  };

  function createAndSet(ctrl, name, value, controller) {
    if (!ctrl[name]) {
      ctrl[name] = {};
    }
    set(ctrl[name], value, controller);
  }

  function unsetAndCleanup(ctrl, name, value, controller) {
    if (ctrl[name]) {
      unset(ctrl[name], value, controller);
    }
    if (isObjectEmpty(ctrl[name])) {
      ctrl[name] = undefined;
    }
  }

  function cachedToggleClass(ctrl, className, switchValue) {
    if (switchValue && !ctrl.$$classCache[className]) {
      ctrl.$$animate.addClass(ctrl.$$element, className);
      ctrl.$$classCache[className] = true;
    } else if (!switchValue && ctrl.$$classCache[className]) {
      ctrl.$$animate.removeClass(ctrl.$$element, className);
      ctrl.$$classCache[className] = false;
    }
  }

  function toggleValidationCss(ctrl, validationErrorKey, isValid) {
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';

    cachedToggleClass(ctrl, VALID_CLASS + validationErrorKey, isValid === true);
    cachedToggleClass(ctrl, INVALID_CLASS + validationErrorKey, isValid === false);
  }
}

function isObjectEmpty(obj) {
  if (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * @ngdoc directive
 * @name ngNonBindable
 * @restrict AC
 * @priority 1000
 * @element ANY
 *
 * @description
 * The `ngNonBindable` directive tells AngularJS not to compile or bind the contents of the current
 * DOM element, including directives on the element itself that have a lower priority than
 * `ngNonBindable`. This is useful if the element contains what appears to be AngularJS directives
 * and bindings but which should be ignored by AngularJS. This could be the case if you have a site
 * that displays snippets of code, for instance.
 *
 * @example
 * In this example there are two locations where a simple interpolation binding (`{{}}`) is present,
 * but the one wrapped in `ngNonBindable` is left alone.
 *
  <example name="ng-non-bindable">
    <file name="index.html">
      <div>Normal: {{1 + 2}}</div>
      <div ng-non-bindable>Ignored: {{1 + 2}}</div>
    </file>
    <file name="protractor.js" type="protractor">
     it('should check ng-non-bindable', function() {
       expect(element(by.binding('1 + 2')).getText()).toContain('3');
       expect(element.all(by.css('div')).last().getText()).toMatch(/1 \+ 2/);
     });
    </file>
  </example>
 */
var ngNonBindableDirective = ngDirective({ terminal: true, priority: 1000 });

/* exported ngOptionsDirective */

/* global jqLiteRemove */

var ngOptionsMinErr = minErr('ngOptions');

/**
 * @ngdoc directive
 * @name ngOptions
 * @restrict A
 *
 * @description
 *
 * The `ngOptions` attribute can be used to dynamically generate a list of `<option>`
 * elements for the `<select>` element using the array or object obtained by evaluating the
 * `ngOptions` comprehension expression.
 *
 * In many cases, {@link ng.directive:ngRepeat ngRepeat} can be used on `<option>` elements instead of
 * `ngOptions` to achieve a similar result. However, `ngOptions` provides some benefits:
 * - more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression
 * - reduced memory consumption by not creating a new scope for each repeated instance
 * - increased render speed by creating the options in a documentFragment instead of individually
 *
 * When an item in the `<select>` menu is selected, the array element or object property
 * represented by the selected option will be bound to the model identified by the `ngModel`
 * directive.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * ## Complex Models (objects or collections)
 *
 * By default, `ngModel` watches the model by reference, not value. This is important to know when
 * binding the select to a model that is an object or a collection.
 *
 * One issue occurs if you want to preselect an option. For example, if you set
 * the model to an object that is equal to an object in your collection, `ngOptions` won't be able to set the selection,
 * because the objects are not identical. So by default, you should always reference the item in your collection
 * for preselections, e.g.: `$scope.selected = $scope.collection[3]`.
 *
 * Another solution is to use a `track by` clause, because then `ngOptions` will track the identity
 * of the item not by reference, but by the result of the `track by` expression. For example, if your
 * collection items have an id property, you would `track by item.id`.
 *
 * A different issue with objects or collections is that ngModel won't detect if an object property or
 * a collection item changes. For that reason, `ngOptions` additionally watches the model using
 * `$watchCollection`, when the expression contains a `track by` clause or the the select has the `multiple` attribute.
 * This allows ngOptions to trigger a re-rendering of the options even if the actual object/collection
 * has not changed identity, but only a property on the object or an item in the collection changes.
 *
 * Note that `$watchCollection` does a shallow comparison of the properties of the object (or the items in the collection
 * if the model is an array). This means that changing a property deeper than the first level inside the
 * object/collection will not trigger a re-rendering.
 *
 * ## `select` **`as`**
 *
 * Using `select` **`as`** will bind the result of the `select` expression to the model, but
 * the value of the `<select>` and `<option>` html elements will be either the index (for array data sources)
 * or property name (for object data sources) of the value within the collection. If a **`track by`** expression
 * is used, the result of that expression will be set as the value of the `option` and `select` elements.
 *
 *
 * ### `select` **`as`** and **`track by`**
 *
 * <div class="alert alert-warning">
 * Be careful when using `select` **`as`** and **`track by`** in the same expression.
 * </div>
 *
 * Given this array of items on the $scope:
 *
 * ```js
 * $scope.items = [{
 *   id: 1,
 *   label: 'aLabel',
 *   subItem: { name: 'aSubItem' }
 * }, {
 *   id: 2,
 *   label: 'bLabel',
 *   subItem: { name: 'bSubItem' }
 * }];
 * ```
 *
 * This will work:
 *
 * ```html
 * <select ng-options="item as item.label for item in items track by item.id" ng-model="selected"></select>
 * ```
 * ```js
 * $scope.selected = $scope.items[0];
 * ```
 *
 * but this will not work:
 *
 * ```html
 * <select ng-options="item.subItem as item.label for item in items track by item.id" ng-model="selected"></select>
 * ```
 * ```js
 * $scope.selected = $scope.items[0].subItem;
 * ```
 *
 * In both examples, the **`track by`** expression is applied successfully to each `item` in the
 * `items` array. Because the selected option has been set programmatically in the controller, the
 * **`track by`** expression is also applied to the `ngModel` value. In the first example, the
 * `ngModel` value is `items[0]` and the **`track by`** expression evaluates to `items[0].id` with
 * no issue. In the second example, the `ngModel` value is `items[0].subItem` and the **`track by`**
 * expression evaluates to `items[0].subItem.id` (which is undefined). As a result, the model value
 * is not matched against any `<option>` and the `<select>` appears as having no selected value.
 *
 *
 * @param {string} ngModel Assignable AngularJS expression to data-bind to.
 * @param {comprehension_expression} ngOptions in one of the following forms:
 *
 *   * for array data sources:
 *     * `label` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`for`** `value` **`in`** `array`
 *     * `label` **`group by`** `group` **`for`** `value` **`in`** `array`
 *     * `label` **`disable when`** `disable` **`for`** `value` **`in`** `array`
 *     * `label` **`group by`** `group` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`
 *     * `label` **`disable when`** `disable` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`
 *     * `label` **`for`** `value` **`in`** `array` | orderBy:`orderexpr` **`track by`** `trackexpr`
 *        (for including a filter with `track by`)
 *   * for object data sources:
 *     * `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `label` **`group by`** `group` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `label` **`disable when`** `disable` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`group by`** `group`
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`disable when`** `disable`
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`
 *
 * Where:
 *
 *   * `array` / `object`: an expression which evaluates to an array / object to iterate over.
 *   * `value`: local variable which will refer to each item in the `array` or each property value
 *      of `object` during iteration.
 *   * `key`: local variable which will refer to a property name in `object` during iteration.
 *   * `label`: The result of this expression will be the label for `<option>` element. The
 *     `expression` will most likely refer to the `value` variable (e.g. `value.propertyName`).
 *   * `select`: The result of this expression will be bound to the model of the parent `<select>`
 *      element. If not specified, `select` expression will default to `value`.
 *   * `group`: The result of this expression will be used to group options using the `<optgroup>`
 *      DOM element.
 *   * `disable`: The result of this expression will be used to disable the rendered `<option>`
 *      element. Return `true` to disable.
 *   * `trackexpr`: Used when working with an array of objects. The result of this expression will be
 *      used to identify the objects in the array. The `trackexpr` will most likely refer to the
 *     `value` variable (e.g. `value.propertyName`). With this the selection is preserved
 *      even when the options are recreated (e.g. reloaded from the server).
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required The control is considered valid only if value is entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {string=} ngAttrSize sets the size of the select element dynamically. Uses the
 * {@link guide/interpolation#-ngattr-for-binding-to-arbitrary-attributes ngAttr} directive.
 *
 * @example
    <example module="selectExample" name="select">
      <file name="index.html">
        <script>
        angular.module('selectExample', [])
          .controller('ExampleController', ['$scope', function($scope) {
            $scope.colors = [
              {name:'black', shade:'dark'},
              {name:'white', shade:'light', notAnOption: true},
              {name:'red', shade:'dark'},
              {name:'blue', shade:'dark', notAnOption: true},
              {name:'yellow', shade:'light', notAnOption: false}
            ];
            $scope.myColor = $scope.colors[2]; // red
          }]);
        </script>
        <div ng-controller="ExampleController">
          <ul>
            <li ng-repeat="color in colors">
              <label>Name: <input ng-model="color.name"></label>
              <label><input type="checkbox" ng-model="color.notAnOption"> Disabled?</label>
              <button ng-click="colors.splice($index, 1)" aria-label="Remove">X</button>
            </li>
            <li>
              <button ng-click="colors.push({})">add</button>
            </li>
          </ul>
          <hr/>
          <label>Color (null not allowed):
            <select ng-model="myColor" ng-options="color.name for color in colors"></select>
          </label><br/>
          <label>Color (null allowed):
          <span  class="nullable">
            <select ng-model="myColor" ng-options="color.name for color in colors">
              <option value="">-- choose color --</option>
            </select>
          </span></label><br/>

          <label>Color grouped by shade:
            <select ng-model="myColor" ng-options="color.name group by color.shade for color in colors">
            </select>
          </label><br/>

          <label>Color grouped by shade, with some disabled:
            <select ng-model="myColor"
                  ng-options="color.name group by color.shade disable when color.notAnOption for color in colors">
            </select>
          </label><br/>



          Select <button ng-click="myColor = { name:'not in list', shade: 'other' }">bogus</button>.
          <br/>
          <hr/>
          Currently selected: {{ {selected_color:myColor} }}
          <div style="border:solid 1px black; height:20px"
               ng-style="{'background-color':myColor.name}">
          </div>
        </div>
      </file>
      <file name="protractor.js" type="protractor">
         it('should check ng-options', function() {
           expect(element(by.binding('{selected_color:myColor}')).getText()).toMatch('red');
           element.all(by.model('myColor')).first().click();
           element.all(by.css('select[ng-model="myColor"] option')).first().click();
           expect(element(by.binding('{selected_color:myColor}')).getText()).toMatch('black');
           element(by.css('.nullable select[ng-model="myColor"]')).click();
           element.all(by.css('.nullable select[ng-model="myColor"] option')).first().click();
           expect(element(by.binding('{selected_color:myColor}')).getText()).toMatch('null');
         });
      </file>
    </example>
 */

/* eslint-disable max-len */
//                     //00001111111111000000000002222222222000000000000000000000333333333300000000000000000000000004444444444400000000000005555555555555000000000666666666666600000007777777777777000000000000000888888888800000000000000000009999999999
var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
                        // 1: value expression (valueFn)
                        // 2: label expression (displayFn)
                        // 3: group by expression (groupByFn)
                        // 4: disable when expression (disableWhenFn)
                        // 5: array item variable name
                        // 6: object item key variable name
                        // 7: object item value variable name
                        // 8: collection expression
                        // 9: track by expression
/* eslint-enable */


var ngOptionsDirective = ['$compile', '$document', '$parse', function($compile, $document, $parse) {

  function parseOptionsExpression(optionsExp, selectElement, scope) {

    var match = optionsExp.match(NG_OPTIONS_REGEXP);
    if (!(match)) {
      throw ngOptionsMinErr('iexp',
        'Expected expression in form of ' +
        '\'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\'' +
        ' but got \'{0}\'. Element: {1}',
        optionsExp, startingTag(selectElement));
    }

    // Extract the parts from the ngOptions expression

    // The variable name for the value of the item in the collection
    var valueName = match[5] || match[7];
    // The variable name for the key of the item in the collection
    var keyName = match[6];

    // An expression that generates the viewValue for an option if there is a label expression
    var selectAs = / as /.test(match[0]) && match[1];
    // An expression that is used to track the id of each object in the options collection
    var trackBy = match[9];
    // An expression that generates the viewValue for an option if there is no label expression
    var valueFn = $parse(match[2] ? match[1] : valueName);
    var selectAsFn = selectAs && $parse(selectAs);
    var viewValueFn = selectAsFn || valueFn;
    var trackByFn = trackBy && $parse(trackBy);

    // Get the value by which we are going to track the option
    // if we have a trackFn then use that (passing scope and locals)
    // otherwise just hash the given viewValue
    var getTrackByValueFn = trackBy ?
                              function(value, locals) { return trackByFn(scope, locals); } :
                              function getHashOfValue(value) { return hashKey(value); };
    var getTrackByValue = function(value, key) {
      return getTrackByValueFn(value, getLocals(value, key));
    };

    var displayFn = $parse(match[2] || match[1]);
    var groupByFn = $parse(match[3] || '');
    var disableWhenFn = $parse(match[4] || '');
    var valuesFn = $parse(match[8]);

    var locals = {};
    var getLocals = keyName ? function(value, key) {
      locals[keyName] = key;
      locals[valueName] = value;
      return locals;
    } : function(value) {
      locals[valueName] = value;
      return locals;
    };


    function Option(selectValue, viewValue, label, group, disabled) {
      this.selectValue = selectValue;
      this.viewValue = viewValue;
      this.label = label;
      this.group = group;
      this.disabled = disabled;
    }

    function getOptionValuesKeys(optionValues) {
      var optionValuesKeys;

      if (!keyName && isArrayLike(optionValues)) {
        optionValuesKeys = optionValues;
      } else {
        // if object, extract keys, in enumeration order, unsorted
        optionValuesKeys = [];
        for (var itemKey in optionValues) {
          if (optionValues.hasOwnProperty(itemKey) && itemKey.charAt(0) !== '$') {
            optionValuesKeys.push(itemKey);
          }
        }
      }
      return optionValuesKeys;
    }

    return {
      trackBy: trackBy,
      getTrackByValue: getTrackByValue,
      getWatchables: $parse(valuesFn, function(optionValues) {
        // Create a collection of things that we would like to watch (watchedArray)
        // so that they can all be watched using a single $watchCollection
        // that only runs the handler once if anything changes
        var watchedArray = [];
        optionValues = optionValues || [];

        var optionValuesKeys = getOptionValuesKeys(optionValues);
        var optionValuesLength = optionValuesKeys.length;
        for (var index = 0; index < optionValuesLength; index++) {
          var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
          var value = optionValues[key];

          var locals = getLocals(value, key);
          var selectValue = getTrackByValueFn(value, locals);
          watchedArray.push(selectValue);

          // Only need to watch the displayFn if there is a specific label expression
          if (match[2] || match[1]) {
            var label = displayFn(scope, locals);
            watchedArray.push(label);
          }

          // Only need to watch the disableWhenFn if there is a specific disable expression
          if (match[4]) {
            var disableWhen = disableWhenFn(scope, locals);
            watchedArray.push(disableWhen);
          }
        }
        return watchedArray;
      }),

      getOptions: function() {

        var optionItems = [];
        var selectValueMap = {};

        // The option values were already computed in the `getWatchables` fn,
        // which must have been called to trigger `getOptions`
        var optionValues = valuesFn(scope) || [];
        var optionValuesKeys = getOptionValuesKeys(optionValues);
        var optionValuesLength = optionValuesKeys.length;

        for (var index = 0; index < optionValuesLength; index++) {
          var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
          var value = optionValues[key];
          var locals = getLocals(value, key);
          var viewValue = viewValueFn(scope, locals);
          var selectValue = getTrackByValueFn(viewValue, locals);
          var label = displayFn(scope, locals);
          var group = groupByFn(scope, locals);
          var disabled = disableWhenFn(scope, locals);
          var optionItem = new Option(selectValue, viewValue, label, group, disabled);

          optionItems.push(optionItem);
          selectValueMap[selectValue] = optionItem;
        }

        return {
          items: optionItems,
          selectValueMap: selectValueMap,
          getOptionFromViewValue: function(value) {
            return selectValueMap[getTrackByValue(value)];
          },
          getViewValueFromOption: function(option) {
            // If the viewValue could be an object that may be mutated by the application,
            // we need to make a copy and not return the reference to the value on the option.
            return trackBy ? copy(option.viewValue) : option.viewValue;
          }
        };
      }
    };
  }


  // Support: IE 9 only
  // We can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  var optionTemplate = window.document.createElement('option'),
      optGroupTemplate = window.document.createElement('optgroup');

    function ngOptionsPostLink(scope, selectElement, attr, ctrls) {

      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      var multiple = attr.multiple;

      // The emptyOption allows the application developer to provide their own custom "empty"
      // option when the viewValue does not match any of the option values.
      for (var i = 0, children = selectElement.children(), ii = children.length; i < ii; i++) {
        if (children[i].value === '') {
          selectCtrl.hasEmptyOption = true;
          selectCtrl.emptyOption = children.eq(i);
          break;
        }
      }

      // The empty option will be compiled and rendered before we first generate the options
      selectElement.empty();

      var providedEmptyOption = !!selectCtrl.emptyOption;

      var unknownOption = jqLite(optionTemplate.cloneNode(false));
      unknownOption.val('?');

      var options;
      var ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope);
      // This stores the newly created options before they are appended to the select.
      // Since the contents are removed from the fragment when it is appended,
      // we only need to create it once.
      var listFragment = $document[0].createDocumentFragment();

      // Overwrite the implementation. ngOptions doesn't use hashes
      selectCtrl.generateUnknownOptionValue = function(val) {
        return '?';
      };

      // Update the controller methods for multiple selectable options
      if (!multiple) {

        selectCtrl.writeValue = function writeNgOptionsValue(value) {
          // The options might not be defined yet when ngModel tries to render
          if (!options) return;

          var selectedOption = selectElement[0].options[selectElement[0].selectedIndex];
          var option = options.getOptionFromViewValue(value);

          // Make sure to remove the selected attribute from the previously selected option
          // Otherwise, screen readers might get confused
          if (selectedOption) selectedOption.removeAttribute('selected');

          if (option) {
            // Don't update the option when it is already selected.
            // For example, the browser will select the first option by default. In that case,
            // most properties are set automatically - except the `selected` attribute, which we
            // set always

            if (selectElement[0].value !== option.selectValue) {
              selectCtrl.removeUnknownOption();

              selectElement[0].value = option.selectValue;
              option.element.selected = true;
            }

            option.element.setAttribute('selected', 'selected');
          } else {
            selectCtrl.selectUnknownOrEmptyOption(value);
          }
        };

        selectCtrl.readValue = function readNgOptionsValue() {

          var selectedOption = options.selectValueMap[selectElement.val()];

          if (selectedOption && !selectedOption.disabled) {
            selectCtrl.unselectEmptyOption();
            selectCtrl.removeUnknownOption();
            return options.getViewValueFromOption(selectedOption);
          }
          return null;
        };

        // If we are using `track by` then we must watch the tracked value on the model
        // since ngModel only watches for object identity change
        // FIXME: When a user selects an option, this watch will fire needlessly
        if (ngOptions.trackBy) {
          scope.$watch(
            function() { return ngOptions.getTrackByValue(ngModelCtrl.$viewValue); },
            function() { ngModelCtrl.$render(); }
          );
        }

      } else {

        selectCtrl.writeValue = function writeNgOptionsMultiple(values) {
          // The options might not be defined yet when ngModel tries to render
          if (!options) return;

          // Only set `<option>.selected` if necessary, in order to prevent some browsers from
          // scrolling to `<option>` elements that are outside the `<select>` element's viewport.
          var selectedOptions = values && values.map(getAndUpdateSelectedOption) || [];

          options.items.forEach(function(option) {
            if (option.element.selected && !includes(selectedOptions, option)) {
              option.element.selected = false;
            }
          });
        };


        selectCtrl.readValue = function readNgOptionsMultiple() {
          var selectedValues = selectElement.val() || [],
              selections = [];

          forEach(selectedValues, function(value) {
            var option = options.selectValueMap[value];
            if (option && !option.disabled) selections.push(options.getViewValueFromOption(option));
          });

          return selections;
        };

        // If we are using `track by` then we must watch these tracked values on the model
        // since ngModel only watches for object identity change
        if (ngOptions.trackBy) {

          scope.$watchCollection(function() {
            if (isArray(ngModelCtrl.$viewValue)) {
              return ngModelCtrl.$viewValue.map(function(value) {
                return ngOptions.getTrackByValue(value);
              });
            }
          }, function() {
            ngModelCtrl.$render();
          });

        }
      }

      if (providedEmptyOption) {

        // compile the element since there might be bindings in it
        $compile(selectCtrl.emptyOption)(scope);

        selectElement.prepend(selectCtrl.emptyOption);

        if (selectCtrl.emptyOption[0].nodeType === NODE_TYPE_COMMENT) {
          // This means the empty option has currently no actual DOM node, probably because
          // it has been modified by a transclusion directive.
          selectCtrl.hasEmptyOption = false;

          // Redefine the registerOption function, which will catch
          // options that are added by ngIf etc. (rendering of the node is async because of
          // lazy transclusion)
          selectCtrl.registerOption = function(optionScope, optionEl) {
            if (optionEl.val() === '') {
              selectCtrl.hasEmptyOption = true;
              selectCtrl.emptyOption = optionEl;
              selectCtrl.emptyOption.removeClass('ng-scope');
              // This ensures the new empty option is selected if previously no option was selected
              ngModelCtrl.$render();

              optionEl.on('$destroy', function() {
                var needsRerender = selectCtrl.$isEmptyOptionSelected();

                selectCtrl.hasEmptyOption = false;
                selectCtrl.emptyOption = undefined;

                if (needsRerender) ngModelCtrl.$render();
              });
            }
          };

        } else {
          // remove the class, which is added automatically because we recompile the element and it
          // becomes the compilation root
          selectCtrl.emptyOption.removeClass('ng-scope');
        }

      }

      // We will re-render the option elements if the option values or labels change
      scope.$watchCollection(ngOptions.getWatchables, updateOptions);

      // ------------------------------------------------------------------ //

      function addOptionElement(option, parent) {
        var optionElement = optionTemplate.cloneNode(false);
        parent.appendChild(optionElement);
        updateOptionElement(option, optionElement);
      }

      function getAndUpdateSelectedOption(viewValue) {
        var option = options.getOptionFromViewValue(viewValue);
        var element = option && option.element;

        if (element && !element.selected) element.selected = true;

        return option;
      }

      function updateOptionElement(option, element) {
        option.element = element;
        element.disabled = option.disabled;
        // Support: IE 11 only, Edge 12-13 only
        // NOTE: The label must be set before the value, otherwise IE 11 & Edge create unresponsive
        // selects in certain circumstances when multiple selects are next to each other and display
        // the option list in listbox style, i.e. the select is [multiple], or specifies a [size].
        // See https://github.com/angular/angular.js/issues/11314 for more info.
        // This is unfortunately untestable with unit / e2e tests
        if (option.label !== element.label) {
          element.label = option.label;
          element.textContent = option.label;
        }
        element.value = option.selectValue;
      }

      function updateOptions() {
        var previousValue = options && selectCtrl.readValue();

        // We must remove all current options, but cannot simply set innerHTML = null
        // since the providedEmptyOption might have an ngIf on it that inserts comments which we
        // must preserve.
        // Instead, iterate over the current option elements and remove them or their optgroup
        // parents
        if (options) {

          for (var i = options.items.length - 1; i >= 0; i--) {
            var option = options.items[i];
            if (isDefined(option.group)) {
              jqLiteRemove(option.element.parentNode);
            } else {
              jqLiteRemove(option.element);
            }
          }
        }

        options = ngOptions.getOptions();

        var groupElementMap = {};

        options.items.forEach(function addOption(option) {
          var groupElement;

          if (isDefined(option.group)) {

            // This option is to live in a group
            // See if we have already created this group
            groupElement = groupElementMap[option.group];

            if (!groupElement) {

              groupElement = optGroupTemplate.cloneNode(false);
              listFragment.appendChild(groupElement);

              // Update the label on the group element
              // "null" is special cased because of Safari
              groupElement.label = option.group === null ? 'null' : option.group;

              // Store it for use later
              groupElementMap[option.group] = groupElement;
            }

            addOptionElement(option, groupElement);

          } else {

            // This option is not in a group
            addOptionElement(option, listFragment);
          }
        });

        selectElement[0].appendChild(listFragment);

        ngModelCtrl.$render();

        // Check to see if the value has changed due to the update to the options
        if (!ngModelCtrl.$isEmpty(previousValue)) {
          var nextValue = selectCtrl.readValue();
          var isNotPrimitive = ngOptions.trackBy || multiple;
          if (isNotPrimitive ? !equals(previousValue, nextValue) : previousValue !== nextValue) {
            ngModelCtrl.$setViewValue(nextValue);
            ngModelCtrl.$render();
          }
        }
      }
  }

  return {
    restrict: 'A',
    terminal: true,
    require: ['select', 'ngModel'],
    link: {
      pre: function ngOptionsPreLink(scope, selectElement, attr, ctrls) {
        // Deactivate the SelectController.register method to prevent
        // option directives from accidentally registering themselves
        // (and unwanted $destroy handlers etc.)
        ctrls[0].registerOption = noop;
      },
      post: ngOptionsPostLink
    }
  };
}];

/**
 * @ngdoc directive
 * @name ngPluralize
 * @restrict EA
 *
 * @description
 * `ngPluralize` is a directive that displays messages according to en-US localization rules.
 * These rules are bundled with angular.js, but can be overridden
 * (see {@link guide/i18n AngularJS i18n} dev guide). You configure ngPluralize directive
 * by specifying the mappings between
 * [plural categories](http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html)
 * and the strings to be displayed.
 *
 * ## Plural categories and explicit number rules
 * There are two
 * [plural categories](http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html)
 * in AngularJS's default en-US locale: "one" and "other".
 *
 * While a plural category may match many numbers (for example, in en-US locale, "other" can match
 * any number that is not 1), an explicit number rule can only match one number. For example, the
 * explicit number rule for "3" matches the number 3. There are examples of plural categories
 * and explicit number rules throughout the rest of this documentation.
 *
 * ## Configuring ngPluralize
 * You configure ngPluralize by providing 2 attributes: `count` and `when`.
 * You can also provide an optional attribute, `offset`.
 *
 * The value of the `count` attribute can be either a string or an {@link guide/expression
 * AngularJS expression}; these are evaluated on the current scope for its bound value.
 *
 * The `when` attribute specifies the mappings between plural categories and the actual
 * string to be displayed. The value of the attribute should be a JSON object.
 *
 * The following example shows how to configure ngPluralize:
 *
 * ```html
 * <ng-pluralize count="personCount"
                 when="{'0': 'Nobody is viewing.',
 *                      'one': '1 person is viewing.',
 *                      'other': '{} people are viewing.'}">
 * </ng-pluralize>
 *```
 *
 * In the example, `"0: Nobody is viewing."` is an explicit number rule. If you did not
 * specify this rule, 0 would be matched to the "other" category and "0 people are viewing"
 * would be shown instead of "Nobody is viewing". You can specify an explicit number rule for
 * other numbers, for example 12, so that instead of showing "12 people are viewing", you can
 * show "a dozen people are viewing".
 *
 * You can use a set of closed braces (`{}`) as a placeholder for the number that you want substituted
 * into pluralized strings. In the previous example, AngularJS will replace `{}` with
 * <span ng-non-bindable>`{{personCount}}`</span>. The closed braces `{}` is a placeholder
 * for <span ng-non-bindable>{{numberExpression}}</span>.
 *
 * If no rule is defined for a category, then an empty string is displayed and a warning is generated.
 * Note that some locales define more categories than `one` and `other`. For example, fr-fr defines `few` and `many`.
 *
 * ## Configuring ngPluralize with offset
 * The `offset` attribute allows further customization of pluralized text, which can result in
 * a better user experience. For example, instead of the message "4 people are viewing this document",
 * you might display "John, Kate and 2 others are viewing this document".
 * The offset attribute allows you to offset a number by any desired value.
 * Let's take a look at an example:
 *
 * ```html
 * <ng-pluralize count="personCount" offset=2
 *               when="{'0': 'Nobody is viewing.',
 *                      '1': '{{person1}} is viewing.',
 *                      '2': '{{person1}} and {{person2}} are viewing.',
 *                      'one': '{{person1}}, {{person2}} and one other person are viewing.',
 *                      'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
 * </ng-pluralize>
 * ```
 *
 * Notice that we are still using two plural categories(one, other), but we added
 * three explicit number rules 0, 1 and 2.
 * When one person, perhaps John, views the document, "John is viewing" will be shown.
 * When three people view the document, no explicit number rule is found, so
 * an offset of 2 is taken off 3, and AngularJS uses 1 to decide the plural category.
 * In this case, plural category 'one' is matched and "John, Mary and one other person are viewing"
 * is shown.
 *
 * Note that when you specify offsets, you must provide explicit number rules for
 * numbers from 0 up to and including the offset. If you use an offset of 3, for example,
 * you must provide explicit number rules for 0, 1, 2 and 3. You must also provide plural strings for
 * plural categories "one" and "other".
 *
 * @param {string|expression} count The variable to be bound to.
 * @param {string} when The mapping between plural category to its corresponding strings.
 * @param {number=} offset Offset to deduct from the total number.
 *
 * @example
    <example module="pluralizeExample" name="ng-pluralize">
      <file name="index.html">
        <script>
          angular.module('pluralizeExample', [])
            .controller('ExampleController', ['$scope', function($scope) {
              $scope.person1 = 'Igor';
              $scope.person2 = 'Misko';
              $scope.personCount = 1;
            }]);
        </script>
        <div ng-controller="ExampleController">
          <label>Person 1:<input type="text" ng-model="person1" value="Igor" /></label><br/>
          <label>Person 2:<input type="text" ng-model="person2" value="Misko" /></label><br/>
          <label>Number of People:<input type="text" ng-model="personCount" value="1" /></label><br/>

          <!--- Example with simple pluralization rules for en locale --->
          Without Offset:
          <ng-pluralize count="personCount"
                        when="{'0': 'Nobody is viewing.',
                               'one': '1 person is viewing.',
                               'other': '{} people are viewing.'}">
          </ng-pluralize><br>

          <!--- Example with offset --->
          With Offset(2):
          <ng-pluralize count="personCount" offset=2
                        when="{'0': 'Nobody is viewing.',
                               '1': '{{person1}} is viewing.',
                               '2': '{{person1}} and {{person2}} are viewing.',
                               'one': '{{person1}}, {{person2}} and one other person are viewing.',
                               'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
          </ng-pluralize>
        </div>
      </file>
      <file name="protractor.js" type="protractor">
        it('should show correct pluralized string', function() {
          var withoutOffset = element.all(by.css('ng-pluralize')).get(0);
          var withOffset = element.all(by.css('ng-pluralize')).get(1);
          var countInput = element(by.model('personCount'));

          expect(withoutOffset.getText()).toEqual('1 person is viewing.');
          expect(withOffset.getText()).toEqual('Igor is viewing.');

          countInput.clear();
          countInput.sendKeys('0');

          expect(withoutOffset.getText()).toEqual('Nobody is viewing.');
          expect(withOffset.getText()).toEqual('Nobody is viewing.');

          countInput.clear();
          countInput.sendKeys('2');

          expect(withoutOffset.getText()).toEqual('2 people are viewing.');
          expect(withOffset.getText()).toEqual('Igor and Misko are viewing.');

          countInput.clear();
          countInput.sendKeys('3');

          expect(withoutOffset.getText()).toEqual('3 people are viewing.');
          expect(withOffset.getText()).toEqual('Igor, Misko and one other person are viewing.');

          countInput.clear();
          countInput.sendKeys('4');

          expect(withoutOffset.getText()).toEqual('4 people are viewing.');
          expect(withOffset.getText()).toEqual('Igor, Misko and 2 other people are viewing.');
        });
        it('should show data-bound names', function() {
          var withOffset = element.all(by.css('ng-pluralize')).get(1);
          var personCount = element(by.model('personCount'));
          var person1 = element(by.model('person1'));
          var person2 = element(by.model('person2'));
          personCount.clear();
          personCount.sendKeys('4');
          person1.clear();
          person1.sendKeys('Di');
          person2.clear();
          person2.sendKeys('Vojta');
          expect(withOffset.getText()).toEqual('Di, Vojta and 2 other people are viewing.');
        });
      </file>
    </example>
 */
var ngPluralizeDirective = ['$locale', '$interpolate', '$log', function($locale, $interpolate, $log) {
  var BRACE = /{}/g,
      IS_WHEN = /^when(Minus)?(.+)$/;

  return {
    link: function(scope, element, attr) {
      var numberExp = attr.count,
          whenExp = attr.$attr.when && element.attr(attr.$attr.when), // we have {{}} in attrs
          offset = attr.offset || 0,
          whens = scope.$eval(whenExp) || {},
          whensExpFns = {},
          startSymbol = $interpolate.startSymbol(),
          endSymbol = $interpolate.endSymbol(),
          braceReplacement = startSymbol + numberExp + '-' + offset + endSymbol,
          watchRemover = angular.noop,
          lastCount;

      forEach(attr, function(expression, attributeName) {
        var tmpMatch = IS_WHEN.exec(attributeName);
        if (tmpMatch) {
          var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
          whens[whenKey] = element.attr(attr.$attr[attributeName]);
        }
      });
      forEach(whens, function(expression, key) {
        whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));

      });

      scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
        var count = parseFloat(newVal);
        var countIsNaN = isNumberNaN(count);

        if (!countIsNaN && !(count in whens)) {
          // If an explicit number rule such as 1, 2, 3... is defined, just use it.
          // Otherwise, check it against pluralization rules in $locale service.
          count = $locale.pluralCat(count - offset);
        }

        // If both `count` and `lastCount` are NaN, we don't need to re-register a watch.
        // In JS `NaN !== NaN`, so we have to explicitly check.
        if ((count !== lastCount) && !(countIsNaN && isNumberNaN(lastCount))) {
          watchRemover();
          var whenExpFn = whensExpFns[count];
          if (isUndefined(whenExpFn)) {
            if (newVal != null) {
              $log.debug('ngPluralize: no rule defined for \'' + count + '\' in ' + whenExp);
            }
            watchRemover = noop;
            updateElementText();
          } else {
            watchRemover = scope.$watch(whenExpFn, updateElementText);
          }
          lastCount = count;
        }
      });

      function updateElementText(newText) {
        element.text(newText || '');
      }
    }
  };
}];

/* exported ngRepeatDirective */

/**
 * @ngdoc directive
 * @name ngRepeat
 * @multiElement
 * @restrict A
 *
 * @description
 * The `ngRepeat` directive instantiates a template once per item from a collection. Each template
 * instance gets its own scope, where the given loop variable is set to the current collection item,
 * and `$index` is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 * | Variable  | Type            | Details                                                                     |
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | `$index`  | {@type number}  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | {@type boolean} | true if the repeated element is first in the iterator.                      |
 * | `$middle` | {@type boolean} | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | {@type boolean} | true if the repeated element is last in the iterator.                       |
 * | `$even`   | {@type boolean} | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | {@type boolean} | true if the iterator position `$index` is odd (otherwise false).            |
 *
 * <div class="alert alert-info">
 *   Creating aliases for these properties is possible with {@link ng.directive:ngInit `ngInit`}.
 *   This may be useful when, for instance, nesting ngRepeats.
 * </div>
 *
 *
 * ## Iterating over object properties
 *
 * It is possible to get `ngRepeat` to iterate over the properties of an object using the following
 * syntax:
 *
 * ```js
 * <div ng-repeat="(key, value) in myObj"> ... </div>
 * ```
 *
 * However, there are a few limitations compared to array iteration:
 *
 * - The JavaScript specification does not define the order of keys
 *   returned for an object, so AngularJS relies on the order returned by the browser
 *   when running `for key in myObj`. Browsers generally follow the strategy of providing
 *   keys in the order in which they were defined, although there are exceptions when keys are deleted
 *   and reinstated. See the
 *   [MDN page on `delete` for more info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete#Cross-browser_notes).
 *
 * - `ngRepeat` will silently *ignore* object keys starting with `$`, because
 *   it's a prefix used by AngularJS for public (`$`) and private (`$$`) properties.
 *
 * - The built-in filters {@link ng.orderBy orderBy} and {@link ng.filter filter} do not work with
 *   objects, and will throw an error if used with one.
 *
 * If you are hitting any of these limitations, the recommended workaround is to convert your object into an array
 * that is sorted into the order that you prefer before providing it to `ngRepeat`. You could
 * do this with a filter such as [toArrayFilter](http://ngmodules.org/modules/angular-toArrayFilter)
 * or implement a `$watch` on the object yourself.
 *
 *
 * ## Tracking and Duplicates
 *
 * `ngRepeat` uses {@link $rootScope.Scope#$watchCollection $watchCollection} to detect changes in
 * the collection. When a change happens, `ngRepeat` then makes the corresponding changes to the DOM:
 *
 * * When an item is added, a new instance of the template is added to the DOM.
 * * When an item is removed, its template instance is removed from the DOM.
 * * When items are reordered, their respective templates are reordered in the DOM.
 *
 * To minimize creation of DOM elements, `ngRepeat` uses a function
 * to "keep track" of all items in the collection and their corresponding DOM elements.
 * For example, if an item is added to the collection, `ngRepeat` will know that all other items
 * already have DOM elements, and will not re-render them.
 *
 * All different types of tracking functions, their syntax, and their support for duplicate
 * items in collections can be found in the
 * {@link ngRepeat#ngRepeat-arguments ngRepeat expression description}.
 *
 * <div class="alert alert-success">
 * **Best Practice:** If you are working with objects that have a unique identifier property, you
 * should track by this identifier instead of the object instance,
 * e.g. `item in items track by item.id`.
 * Should you reload your data later, `ngRepeat` will not have to rebuild the DOM elements for items
 * it has already rendered, even if the JavaScript objects in the collection have been substituted
 * for new ones. For large collections, this significantly improves rendering performance.
 * </div>
 *
 * ### Effects of DOM Element re-use
 *
 * When DOM elements are re-used, ngRepeat updates the scope for the element, which will
 * automatically update any active bindings on the template. However, other
 * functionality will not be updated, because the element is not re-created:
 *
 * - Directives are not re-compiled
 * - {@link guide/expression#one-time-binding one-time expressions} on the repeated template are not
 * updated if they have stabilized.
 *
 * The above affects all kinds of element re-use due to tracking, but may be especially visible
 * when tracking by `$index` due to the way ngRepeat re-uses elements.
 *
 * The following example shows the effects of different actions with tracking:

  <example module="ngRepeat" name="ngRepeat-tracking" deps="angular-animate.js" animations="true">
    <file name="script.js">
      angular.module('ngRepeat', ['ngAnimate']).controller('repeatController', function($scope) {
        var friends = [
          {name:'John', age:25},
          {name:'Mary', age:40},
          {name:'Peter', age:85}
        ];

        $scope.removeFirst = function() {
          $scope.friends.shift();
        };

        $scope.updateAge = function() {
          $scope.friends.forEach(function(el) {
            el.age = el.age + 5;
          });
        };

        $scope.copy = function() {
          $scope.friends = angular.copy($scope.friends);
        };

        $scope.reset = function() {
          $scope.friends = angular.copy(friends);
        };

        $scope.reset();
      });
    </file>
    <file name="index.html">
      <div ng-controller="repeatController">
        <ol>
          <li>When you click "Update Age", only the first list updates the age, because all others have
          a one-time binding on the age property. If you then click "Copy", the current friend list
          is copied, and now the second list updates the age, because the identity of the collection items
          has changed and the list must be re-rendered. The 3rd and 4th list stay the same, because all the
          items are already known according to their tracking functions.
          </li>
          <li>When you click "Remove First", the 4th list has the wrong age on both remaining items. This is
          due to tracking by $index: when the first collection item is removed, ngRepeat reuses the first
          DOM element for the new first collection item, and so on. Since the age property is one-time
          bound, the value remains from the collection item which was previously at this index.
          </li>
        </ol>

        <button ng-click="removeFirst()">Remove First</button>
        <button ng-click="updateAge()">Update Age</button>
        <button ng-click="copy()">Copy</button>
        <br><button ng-click="reset()">Reset List</button>
        <br>
        <code>track by $id(friend)</code> (default):
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends">
            {{friend.name}} is {{friend.age}} years old.
          </li>
        </ul>
        <code>track by $id(friend)</code> (default), with age one-time binding:
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends">
            {{friend.name}} is {{::friend.age}} years old.
          </li>
        </ul>
        <code>track by friend.name</code>, with age one-time binding:
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends track by friend.name">
            {{friend.name}}  is {{::friend.age}} years old.
          </li>
        </ul>
        <code>track by $index</code>, with age one-time binding:
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends track by $index">
            {{friend.name}} is {{::friend.age}} years old.
          </li>
        </ul>
      </div>
    </file>
    <file name="animations.css">
      .example-animate-container {
        background:white;
        border:1px solid black;
        list-style:none;
        margin:0;
        padding:0 10px;
      }

      .animate-repeat {
        line-height:30px;
        list-style:none;
        box-sizing:border-box;
      }

      .animate-repeat.ng-move,
      .animate-repeat.ng-enter,
      .animate-repeat.ng-leave {
        transition:all linear 0.5s;
      }

      .animate-repeat.ng-leave.ng-leave-active,
      .animate-repeat.ng-move,
      .animate-repeat.ng-enter {
        opacity:0;
        max-height:0;
      }

      .animate-repeat.ng-leave,
      .animate-repeat.ng-move.ng-move-active,
      .animate-repeat.ng-enter.ng-enter-active {
        opacity:1;
        max-height:30px;
      }
    </file>
  </example>

 *
 * ## Special repeat start and end points
 * To repeat a series of elements instead of just one parent element, ngRepeat (as well as other ng directives) supports extending
 * the range of the repeater by defining explicit start and end points by using **ng-repeat-start** and **ng-repeat-end** respectively.
 * The **ng-repeat-start** directive works the same as **ng-repeat**, but will repeat all the HTML code (including the tag it's defined on)
 * up to and including the ending HTML tag where **ng-repeat-end** is placed.
 *
 * The example below makes use of this feature:
 * ```html
 *   <header ng-repeat-start="item in items">
 *     Header {{ item }}
 *   </header>
 *   <div class="body">
 *     Body {{ item }}
 *   </div>
 *   <footer ng-repeat-end>
 *     Footer {{ item }}
 *   </footer>
 * ```
 *
 * And with an input of {@type ['A','B']} for the items variable in the example above, the output will evaluate to:
 * ```html
 *   <header>
 *     Header A
 *   </header>
 *   <div class="body">
 *     Body A
 *   </div>
 *   <footer>
 *     Footer A
 *   </footer>
 *   <header>
 *     Header B
 *   </header>
 *   <div class="body">
 *     Body B
 *   </div>
 *   <footer>
 *     Footer B
 *   </footer>
 * ```
 *
 * The custom start and end points for ngRepeat also support all other HTML directive syntax flavors provided in AngularJS (such
 * as **data-ng-repeat-start**, **x-ng-repeat-start** and **ng:repeat-start**).
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter} | when a new item is added to the list or when an item is revealed after a filter |
 * | {@link ng.$animate#leave leave} | when an item is removed from the list or when an item is filtered out |
 * | {@link ng.$animate#move move } | when an adjacent item is filtered out causing a reorder or when the item contents are reordered |
 *
 * See the example below for defining CSS animations with ngRepeat.
 *
 * @element ANY
 * @scope
 * @priority 1000
 * @param {repeat_expression} ngRepeat The expression indicating how to enumerate a collection. These
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `album in artist.albums`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 *   * `variable in expression track by tracking_expression` – You can also provide an optional tracking expression
 *     which can be used to associate the objects in the collection with the DOM elements. If no tracking expression
 *     is specified, ng-repeat associates elements by identity. It is an error to have
 *     more than one tracking expression value resolve to the same key. (This would mean that two distinct objects are
 *     mapped to the same DOM element, which is not possible.)
 *
 *     *Default tracking: $id()*: `item in items` is equivalent to `item in items track by $id(item)`.
 *     This implies that the DOM elements will be associated by item identity in the collection.
 *
 *     The built-in `$id()` function can be used to assign a unique
 *     `$$hashKey` property to each item in the collection. This property is then used as a key to associated DOM elements
 *     with the corresponding item in the collection by identity. Moving the same object would move
 *     the DOM element in the same way in the DOM.
 *     Note that the default id function does not support duplicate primitive values (`number`, `string`),
 *     but supports duplictae non-primitive values (`object`) that are *equal* in shape.
 *
 *     *Custom Expression*: It is possible to use any AngularJS expression to compute the tracking
 *     id, for example with a function, or using a property on the collection items.
 *     `item in items track by item.id` is a typical pattern when the items have a unique identifier,
 *     e.g. database id. In this case the object identity does not matter. Two objects are considered
 *     equivalent as long as their `id` property is same.
 *     Tracking by unique identifier is the most performant way and should be used whenever possible.
 *
 *     *$index*: This special property tracks the collection items by their index, and
 *     re-uses the DOM elements that match that index, e.g. `item in items track by $index`. This can
 *     be used for a performance improvement if no unique identfier is available and the identity of
 *     the collection items cannot be easily computed. It also allows duplicates.
 *
 *     <div class="alert alert-warning">
 *       <strong>Note:</strong> Re-using DOM elements can have unforeseen effects. Read the
 *       {@link ngRepeat#tracking-and-duplicates section on tracking and duplicates} for
 *       more info.
 *     </div>
 *
 *     <div class="alert alert-warning">
 *       <strong>Note:</strong> the `track by` expression must come last - after any filters, and the alias expression:
 *       `item in items | filter:searchText as results  track by item.id`
 *     </div>
 *
 *   * `variable in expression as alias_expression` – You can also provide an optional alias expression which will then store the
 *     intermediate results of the repeater after the filters have been applied. Typically this is used to render a special message
 *     when a filter is active on the repeater, but the filtered result set is empty.
 *
 *     For example: `item in items | filter:x as results` will store the fragment of the repeated items as `results`, but only after
 *     the items have been processed through the filter.
 *
 *     Please note that `as [variable name]` is not an operator but rather a part of ngRepeat
 *     micro-syntax so it can be used only after all filters (and not as operator, inside an expression).
 *
 *     For example: `item in items | filter : x | orderBy : order | limitTo : limit as results track by item.id` .
 *
 * @example
 * This example uses `ngRepeat` to display a list of people. A filter is used to restrict the displayed
 * results by name or by age. New (entering) and removed (leaving) items are animated.
  <example module="ngRepeat" name="ngRepeat" deps="angular-animate.js" animations="true">
    <file name="index.html">
      <div ng-controller="repeatController">
        I have {{friends.length}} friends. They are:
        <input type="search" ng-model="q" placeholder="filter friends..." aria-label="filter friends" />
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends | filter:q as results track by friend.name">
            [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
          </li>
          <li class="animate-repeat" ng-if="results.length === 0">
            <strong>No results found...</strong>
          </li>
        </ul>
      </div>
    </file>
    <file name="script.js">
      angular.module('ngRepeat', ['ngAnimate']).controller('repeatController', function($scope) {
        $scope.friends = [
          {name:'John', age:25, gender:'boy'},
          {name:'Jessie', age:30, gender:'girl'},
          {name:'Johanna', age:28, gender:'girl'},
          {name:'Joy', age:15, gender:'girl'},
          {name:'Mary', age:28, gender:'girl'},
          {name:'Peter', age:95, gender:'boy'},
          {name:'Sebastian', age:50, gender:'boy'},
          {name:'Erika', age:27, gender:'girl'},
          {name:'Patrick', age:40, gender:'boy'},
          {name:'Samantha', age:60, gender:'girl'}
        ];
      });
    </file>
    <file name="animations.css">
      .example-animate-container {
        background:white;
        border:1px solid black;
        list-style:none;
        margin:0;
        padding:0 10px;
      }

      .animate-repeat {
        line-height:30px;
        list-style:none;
        box-sizing:border-box;
      }

      .animate-repeat.ng-move,
      .animate-repeat.ng-enter,
      .animate-repeat.ng-leave {
        transition:all linear 0.5s;
      }

      .animate-repeat.ng-leave.ng-leave-active,
      .animate-repeat.ng-move,
      .animate-repeat.ng-enter {
        opacity:0;
        max-height:0;
      }

      .animate-repeat.ng-leave,
      .animate-repeat.ng-move.ng-move-active,
      .animate-repeat.ng-enter.ng-enter-active {
        opacity:1;
        max-height:30px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      var friends = element.all(by.repeater('friend in friends'));

      it('should render initial data set', function() {
        expect(friends.count()).toBe(10);
        expect(friends.get(0).getText()).toEqual('[1] John who is 25 years old.');
        expect(friends.get(1).getText()).toEqual('[2] Jessie who is 30 years old.');
        expect(friends.last().getText()).toEqual('[10] Samantha who is 60 years old.');
        expect(element(by.binding('friends.length')).getText())
            .toMatch("I have 10 friends. They are:");
      });

       it('should update repeater when filter predicate changes', function() {
         expect(friends.count()).toBe(10);

         element(by.model('q')).sendKeys('ma');

         expect(friends.count()).toBe(2);
         expect(friends.get(0).getText()).toEqual('[1] Mary who is 28 years old.');
         expect(friends.last().getText()).toEqual('[2] Samantha who is 60 years old.');
       });
      </file>
    </example>
 */
var ngRepeatDirective = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {
  var NG_REMOVED = '$$NG_REMOVED';
  var ngRepeatMinErr = minErr('ngRepeat');

  var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
    // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
    scope[valueIdentifier] = value;
    if (keyIdentifier) scope[keyIdentifier] = key;
    scope.$index = index;
    scope.$first = (index === 0);
    scope.$last = (index === (arrayLength - 1));
    scope.$middle = !(scope.$first || scope.$last);
    // eslint-disable-next-line no-bitwise
    scope.$odd = !(scope.$even = (index & 1) === 0);
  };

  var getBlockStart = function(block) {
    return block.clone[0];
  };

  var getBlockEnd = function(block) {
    return block.clone[block.clone.length - 1];
  };

  var trackByIdArrayFn = function($scope, key, value) {
    return hashKey(value);
  };

  var trackByIdObjFn = function($scope, key) {
    return key;
  };

  return {
    restrict: 'A',
    multiElement: true,
    transclude: 'element',
    priority: 1000,
    terminal: true,
    $$tlb: true,
    compile: function ngRepeatCompile($element, $attr) {
      var expression = $attr.ngRepeat;
      var ngRepeatEndComment = $compile.$$createComment('end ngRepeat', expression);

      var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

      if (!match) {
        throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.',
            expression);
      }

      var lhs = match[1];
      var rhs = match[2];
      var aliasAs = match[3];
      var trackByExp = match[4];

      match = lhs.match(/^(?:(\s*[$\w]+)|\(\s*([$\w]+)\s*,\s*([$\w]+)\s*\))$/);

      if (!match) {
        throw ngRepeatMinErr('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.',
            lhs);
      }
      var valueIdentifier = match[3] || match[1];
      var keyIdentifier = match[2];

      if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
          /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
        throw ngRepeatMinErr('badident', 'alias \'{0}\' is invalid --- must be a valid JS identifier which is not a reserved name.',
          aliasAs);
      }

      var trackByIdExpFn;

      if (trackByExp) {
        var hashFnLocals = {$id: hashKey};
        var trackByExpGetter = $parse(trackByExp);

        trackByIdExpFn = function($scope, key, value, index) {
          // assign key, value, and $index to the locals so that they can be used in hash functions
          if (keyIdentifier) hashFnLocals[keyIdentifier] = key;
          hashFnLocals[valueIdentifier] = value;
          hashFnLocals.$index = index;
          return trackByExpGetter($scope, hashFnLocals);
        };
      }

      return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is objects with following properties.
        //   - scope: bound scope
        //   - clone: previous element.
        //   - index: position
        //
        // We are using no-proto object so that we don't need to guard against inherited props via
        // hasOwnProperty.
        var lastBlockMap = createMap();

        //watch props
        $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
          var index, length,
              previousNode = $element[0],     // node that cloned nodes should be inserted after
                                              // initialized to the comment node anchor
              nextNode,
              // Same as lastBlockMap but it has the current state. It will become the
              // lastBlockMap on the next iteration.
              nextBlockMap = createMap(),
              collectionLength,
              key, value, // key/value of iteration
              trackById,
              trackByIdFn,
              collectionKeys,
              block,       // last object information {scope, element, id}
              nextBlockOrder,
              elementsToRemove;

          if (aliasAs) {
            $scope[aliasAs] = collection;
          }

          if (isArrayLike(collection)) {
            collectionKeys = collection;
            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
          } else {
            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
            // if object, extract keys, in enumeration order, unsorted
            collectionKeys = [];
            for (var itemKey in collection) {
              if (hasOwnProperty.call(collection, itemKey) && itemKey.charAt(0) !== '$') {
                collectionKeys.push(itemKey);
              }
            }
          }

          collectionLength = collectionKeys.length;
          nextBlockOrder = new Array(collectionLength);

          // locate existing items
          for (index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            trackById = trackByIdFn($scope, key, value, index);
            if (lastBlockMap[trackById]) {
              // found previously seen block
              block = lastBlockMap[trackById];
              delete lastBlockMap[trackById];
              nextBlockMap[trackById] = block;
              nextBlockOrder[index] = block;
            } else if (nextBlockMap[trackById]) {
              // if collision detected. restore lastBlockMap and throw an error
              forEach(nextBlockOrder, function(block) {
                if (block && block.scope) lastBlockMap[block.id] = block;
              });
              throw ngRepeatMinErr('dupes',
                  'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}',
                  expression, trackById, value);
            } else {
              // new never before seen block
              nextBlockOrder[index] = {id: trackById, scope: undefined, clone: undefined};
              nextBlockMap[trackById] = true;
            }
          }

          // Clear the value property from the hashFnLocals object to prevent a reference to the last value
          // being leaked into the ngRepeatCompile function scope
          if (hashFnLocals) {
            hashFnLocals[valueIdentifier] = undefined;
          }

          // remove leftover items
          for (var blockKey in lastBlockMap) {
            block = lastBlockMap[blockKey];
            elementsToRemove = getBlockNodes(block.clone);
            $animate.leave(elementsToRemove);
            if (elementsToRemove[0].parentNode) {
              // if the element was not removed yet because of pending animation, mark it as deleted
              // so that we can ignore it later
              for (index = 0, length = elementsToRemove.length; index < length; index++) {
                elementsToRemove[index][NG_REMOVED] = true;
              }
            }
            block.scope.$destroy();
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            block = nextBlockOrder[index];

            if (block.scope) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element

              nextNode = previousNode;

              // skip nodes that are already pending removal via leave animation
              do {
                nextNode = nextNode.nextSibling;
              } while (nextNode && nextNode[NG_REMOVED]);

              if (getBlockStart(block) !== nextNode) {
                // existing item which got moved
                $animate.move(getBlockNodes(block.clone), null, previousNode);
              }
              previousNode = getBlockEnd(block);
              updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
            } else {
              // new item which we don't know about
              $transclude(function ngRepeatTransclude(clone, scope) {
                block.scope = scope;
                // http://jsperf.com/clone-vs-createcomment
                var endNode = ngRepeatEndComment.cloneNode(false);
                clone[clone.length++] = endNode;

                $animate.enter(clone, null, previousNode);
                previousNode = endNode;
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                block.clone = clone;
                nextBlockMap[block.id] = block;
                updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
              });
            }
          }
          lastBlockMap = nextBlockMap;
        });
      };
    }
  };
}];

var NG_HIDE_CLASS = 'ng-hide';
var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';
/**
 * @ngdoc directive
 * @name ngShow
 * @multiElement
 *
 * @description
 * The `ngShow` directive shows or hides the given HTML element based on the expression provided to
 * the `ngShow` attribute.
 *
 * The element is shown or hidden by removing or adding the `.ng-hide` CSS class onto the element.
 * The `.ng-hide` CSS class is predefined in AngularJS and sets the display style to none (using an
 * `!important` flag). For CSP mode please add `angular-csp.css` to your HTML file (see
 * {@link ng.directive:ngCsp ngCsp}).
 *
 * ```html
 * <!-- when $scope.myValue is truthy (element is visible) -->
 * <div ng-show="myValue"></div>
 *
 * <!-- when $scope.myValue is falsy (element is hidden) -->
 * <div ng-show="myValue" class="ng-hide"></div>
 * ```
 *
 * When the `ngShow` expression evaluates to a falsy value then the `.ng-hide` CSS class is added
 * to the class attribute on the element causing it to become hidden. When truthy, the `.ng-hide`
 * CSS class is removed from the element causing the element not to appear hidden.
 *
 * ## Why is `!important` used?
 *
 * You may be wondering why `!important` is used for the `.ng-hide` CSS class. This is because the
 * `.ng-hide` selector can be easily overridden by heavier selectors. For example, something as
 * simple as changing the display style on a HTML list item would make hidden elements appear
 * visible. This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using `!important`, the show and hide behavior will work as expected despite any clash between
 * CSS selector specificity (when `!important` isn't used with any conflicting styles). If a
 * developer chooses to override the styling to change how to hide an element then it is just a
 * matter of using `!important` in their own CSS code.
 *
 * ### Overriding `.ng-hide`
 *
 * By default, the `.ng-hide` class will style the element with `display: none !important`. If you
 * wish to change the hide behavior with `ngShow`/`ngHide`, you can simply overwrite the styles for
 * the `.ng-hide` CSS class. Note that the selector that needs to be used is actually
 * `.ng-hide:not(.ng-hide-animate)` to cope with extra animation classes that can be added.
 *
 * ```css
 * .ng-hide:not(.ng-hide-animate) {
 *   /&#42; These are just alternative ways of hiding an element &#42;/
 *   display: block!important;
 *   position: absolute;
 *   top: -9999px;
 *   left: -9999px;
 * }
 * ```
 *
 * By default you don't need to override anything in CSS and the animations will work around the
 * display style.
 *
 * @animations
 * | Animation                                           | Occurs                                                                                                        |
 * |-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
 * | {@link $animate#addClass addClass} `.ng-hide`       | After the `ngShow` expression evaluates to a non truthy value and just before the contents are set to hidden. |
 * | {@link $animate#removeClass removeClass} `.ng-hide` | After the `ngShow` expression evaluates to a truthy value and just before contents are set to visible.        |
 *
 * Animations in `ngShow`/`ngHide` work with the show and hide events that are triggered when the
 * directive expression is true and false. This system works like the animation system present with
 * `ngClass` except that you must also include the `!important` flag to override the display
 * property so that the elements are not actually hidden during the animation.
 *
 * ```css
 * /&#42; A working example can be found at the bottom of this page. &#42;/
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition: all 0.5s linear;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * ```
 *
 * Keep in mind that, as of AngularJS version 1.3, there is no need to change the display property
 * to block during animation states - ngAnimate will automatically handle the style toggling for you.
 *
 * @element ANY
 * @param {expression} ngShow If the {@link guide/expression expression} is truthy/falsy then the
 *                            element is shown/hidden respectively.
 *
 * @example
 * A simple example, animating the element's opacity:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-show-simple">
    <file name="index.html">
      Show: <input type="checkbox" ng-model="checked" aria-label="Toggle ngShow"><br />
      <div class="check-element animate-show-hide" ng-show="checked">
        I show up when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      .animate-show-hide.ng-hide {
        opacity: 0;
      }

      .animate-show-hide.ng-hide-add,
      .animate-show-hide.ng-hide-remove {
        transition: all linear 0.5s;
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngShow', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(false);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(true);
      });
    </file>
  </example>
 *
 * <hr />
 * @example
 * A more complex example, featuring different show/hide animations:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-show-complex">
    <file name="index.html">
      Show: <input type="checkbox" ng-model="checked" aria-label="Toggle ngShow"><br />
      <div class="check-element funky-show-hide" ng-show="checked">
        I show up when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      body {
        overflow: hidden;
        perspective: 1000px;
      }

      .funky-show-hide.ng-hide-add {
        transform: rotateZ(0);
        transform-origin: right;
        transition: all 0.5s ease-in-out;
      }

      .funky-show-hide.ng-hide-add.ng-hide-add-active {
        transform: rotateZ(-135deg);
      }

      .funky-show-hide.ng-hide-remove {
        transform: rotateY(90deg);
        transform-origin: left;
        transition: all 0.5s ease;
      }

      .funky-show-hide.ng-hide-remove.ng-hide-remove-active {
        transform: rotateY(0);
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngShow', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(false);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(true);
      });
    </file>
  </example>
 *
 * @knownIssue
 *
 * ### Flickering when using ngShow to toggle between elements
 *
 * When using {@link ngShow} and / or {@link ngHide} to toggle between elements, it can
 * happen that both the element to show and the element to hide are visible for a very short time.
 *
 * This usually happens when the {@link ngAnimate ngAnimate module} is included, but no actual animations
 * are defined for {@link ngShow} / {@link ngHide}. Internet Explorer is affected more often than
 * other browsers.
 *
 * There are several way to mitigate this problem:
 *
 * - {@link guide/animations#how-to-selectively-enable-disable-and-skip-animations Disable animations on the affected elements}.
 * - Use {@link ngIf} or {@link ngSwitch} instead of {@link ngShow} / {@link ngHide}.
 * - Use the special CSS selector `ng-hide.ng-hide-animate` to set `{display: none}` or similar on the affected elements.
 * - Use `ng-class="{'ng-hide': expression}` instead of instead of {@link ngShow} / {@link ngHide}.
 * - Define an animation on the affected elements.
 */
var ngShowDirective = ['$animate', function($animate) {
  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
        // we're adding a temporary, animation-specific class for ng-hide since this way
        // we can control when the element is actually displayed on screen without having
        // to have a global/greedy CSS selector that breaks when other animations are run.
        // Read: https://github.com/angular/angular.js/issues/9103#issuecomment-58335845
        $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}];


/**
 * @ngdoc directive
 * @name ngHide
 * @multiElement
 *
 * @description
 * The `ngHide` directive shows or hides the given HTML element based on the expression provided to
 * the `ngHide` attribute.
 *
 * The element is shown or hidden by removing or adding the `.ng-hide` CSS class onto the element.
 * The `.ng-hide` CSS class is predefined in AngularJS and sets the display style to none (using an
 * `!important` flag). For CSP mode please add `angular-csp.css` to your HTML file (see
 * {@link ng.directive:ngCsp ngCsp}).
 *
 * ```html
 * <!-- when $scope.myValue is truthy (element is hidden) -->
 * <div ng-hide="myValue" class="ng-hide"></div>
 *
 * <!-- when $scope.myValue is falsy (element is visible) -->
 * <div ng-hide="myValue"></div>
 * ```
 *
 * When the `ngHide` expression evaluates to a truthy value then the `.ng-hide` CSS class is added
 * to the class attribute on the element causing it to become hidden. When falsy, the `.ng-hide`
 * CSS class is removed from the element causing the element not to appear hidden.
 *
 * ## Why is `!important` used?
 *
 * You may be wondering why `!important` is used for the `.ng-hide` CSS class. This is because the
 * `.ng-hide` selector can be easily overridden by heavier selectors. For example, something as
 * simple as changing the display style on a HTML list item would make hidden elements appear
 * visible. This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using `!important`, the show and hide behavior will work as expected despite any clash between
 * CSS selector specificity (when `!important` isn't used with any conflicting styles). If a
 * developer chooses to override the styling to change how to hide an element then it is just a
 * matter of using `!important` in their own CSS code.
 *
 * ### Overriding `.ng-hide`
 *
 * By default, the `.ng-hide` class will style the element with `display: none !important`. If you
 * wish to change the hide behavior with `ngShow`/`ngHide`, you can simply overwrite the styles for
 * the `.ng-hide` CSS class. Note that the selector that needs to be used is actually
 * `.ng-hide:not(.ng-hide-animate)` to cope with extra animation classes that can be added.
 *
 * ```css
 * .ng-hide:not(.ng-hide-animate) {
 *   /&#42; These are just alternative ways of hiding an element &#42;/
 *   display: block!important;
 *   position: absolute;
 *   top: -9999px;
 *   left: -9999px;
 * }
 * ```
 *
 * By default you don't need to override in CSS anything and the animations will work around the
 * display style.
 *
 * @animations
 * | Animation                                           | Occurs                                                                                                     |
 * |-----------------------------------------------------|------------------------------------------------------------------------------------------------------------|
 * | {@link $animate#addClass addClass} `.ng-hide`       | After the `ngHide` expression evaluates to a truthy value and just before the contents are set to hidden.  |
 * | {@link $animate#removeClass removeClass} `.ng-hide` | After the `ngHide` expression evaluates to a non truthy value and just before contents are set to visible. |
 *
 * Animations in `ngShow`/`ngHide` work with the show and hide events that are triggered when the
 * directive expression is true and false. This system works like the animation system present with
 * `ngClass` except that you must also include the `!important` flag to override the display
 * property so that the elements are not actually hidden during the animation.
 *
 * ```css
 * /&#42; A working example can be found at the bottom of this page. &#42;/
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition: all 0.5s linear;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * ```
 *
 * Keep in mind that, as of AngularJS version 1.3, there is no need to change the display property
 * to block during animation states - ngAnimate will automatically handle the style toggling for you.
 *
 * @element ANY
 * @param {expression} ngHide If the {@link guide/expression expression} is truthy/falsy then the
 *                            element is hidden/shown respectively.
 *
 * @example
 * A simple example, animating the element's opacity:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-hide-simple">
    <file name="index.html">
      Hide: <input type="checkbox" ng-model="checked" aria-label="Toggle ngHide"><br />
      <div class="check-element animate-show-hide" ng-hide="checked">
        I hide when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      .animate-show-hide.ng-hide {
        opacity: 0;
      }

      .animate-show-hide.ng-hide-add,
      .animate-show-hide.ng-hide-remove {
        transition: all linear 0.5s;
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngHide', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(true);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(false);
      });
    </file>
  </example>
 *
 * <hr />
 * @example
 * A more complex example, featuring different show/hide animations:
 *
  <example module="ngAnimate" deps="angular-animate.js" animations="true" name="ng-hide-complex">
    <file name="index.html">
      Hide: <input type="checkbox" ng-model="checked" aria-label="Toggle ngHide"><br />
      <div class="check-element funky-show-hide" ng-hide="checked">
        I hide when your checkbox is checked.
      </div>
    </file>
    <file name="animations.css">
      body {
        overflow: hidden;
        perspective: 1000px;
      }

      .funky-show-hide.ng-hide-add {
        transform: rotateZ(0);
        transform-origin: right;
        transition: all 0.5s ease-in-out;
      }

      .funky-show-hide.ng-hide-add.ng-hide-add-active {
        transform: rotateZ(-135deg);
      }

      .funky-show-hide.ng-hide-remove {
        transform: rotateY(90deg);
        transform-origin: left;
        transition: all 0.5s ease;
      }

      .funky-show-hide.ng-hide-remove.ng-hide-remove-active {
        transform: rotateY(0);
      }

      .check-element {
        border: 1px solid black;
        opacity: 1;
        padding: 10px;
      }
    </file>
    <file name="protractor.js" type="protractor">
      it('should check ngHide', function() {
        var checkbox = element(by.model('checked'));
        var checkElem = element(by.css('.check-element'));

        expect(checkElem.isDisplayed()).toBe(true);
        checkbox.click();
        expect(checkElem.isDisplayed()).toBe(false);
      });
    </file>
  </example>
 *
 * @knownIssue
 *
 * ### Flickering when using ngHide to toggle between elements
 *
 * When using {@link ngShow} and / or {@link ngHide} to toggle between elements, it can
 * happen that both the element to show and the element to hide are visible for a very short time.
 *
 * This usually happens when the {@link ngAnimate ngAnimate module} is included, but no actual animations
 * are defined for {@link ngShow} / {@link ngHide}. Internet Explorer is affected more often than
 * other browsers.
 *
 * There are several way to mitigate this problem:
 *
 * - {@link guide/animations#how-to-selectively-enable-disable-and-skip-animations Disable animations on the affected elements}.
 * - Use {@link ngIf} or {@link ngSwitch} instead of {@link ngShow} / {@link ngHide}.
 * - Use the special CSS selector `ng-hide.ng-hide-animate` to set `{display: none}` or similar on the affected elements.
 * - Use `ng-class="{'ng-hide': expression}` instead of instead of {@link ngShow} / {@link ngHide}.
 * - Define an animation on the affected elements.
 */
var ngHideDirective = ['$animate', function($animate) {
  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
        // The comment inside of the ngShowDirective explains why we add and
        // remove a temporary class for the show/hide animation
        $animate[value ? 'addClass' : 'removeClass'](element,NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}];


/**
 * @ngdoc directive
 * @name ngStyle
 * @restrict AC
 *
 * @description
 * The `ngStyle` directive allows you to set CSS style on an HTML element conditionally.
 *
 * @knownIssue
 * You should not use {@link guide/interpolation interpolation} in the value of the `style`
 * attribute, when using the `ngStyle` directive on the same element.
 * See {@link guide/interpolation#known-issues here} for more info.
 *
 * @element ANY
 * @param {expression} ngStyle
 *
 * {@link guide/expression Expression} which evals to an
 * object whose keys are CSS style names and values are corresponding values for those CSS
 * keys.
 *
 * Since some CSS style names are not valid keys for an object, they must be quoted.
 * See the 'background-color' style in the example below.
 *
 * @example
   <example name="ng-style">
     <file name="index.html">
        <input type="button" value="set color" ng-click="myStyle={color:'red'}">
        <input type="button" value="set background" ng-click="myStyle={'background-color':'blue'}">
        <input type="button" value="clear" ng-click="myStyle={}">
        <br/>
        <span ng-style="myStyle">Sample Text</span>
        <pre>myStyle={{myStyle}}</pre>
     </file>
     <file name="style.css">
       span {
         color: black;
       }
     </file>
     <file name="protractor.js" type="protractor">
       var colorSpan = element(by.css('span'));

       it('should check ng-style', function() {
         expect(colorSpan.getCssValue('color')).toMatch(/rgba\(0, 0, 0, 1\)|rgb\(0, 0, 0\)/);
         element(by.css('input[value=\'set color\']')).click();
         expect(colorSpan.getCssValue('color')).toMatch(/rgba\(255, 0, 0, 1\)|rgb\(255, 0, 0\)/);
         element(by.css('input[value=clear]')).click();
         expect(colorSpan.getCssValue('color')).toMatch(/rgba\(0, 0, 0, 1\)|rgb\(0, 0, 0\)/);
       });
     </file>
   </example>
 */
var ngStyleDirective = ngDirective(function(scope, element, attr) {
  scope.$watchCollection(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
    if (oldStyles && (newStyles !== oldStyles)) {
      forEach(oldStyles, function(val, style) { element.css(style, ''); });
    }
    if (newStyles) element.css(newStyles);
  });
});

/**
 * @ngdoc directive
 * @name ngSwitch
 * @restrict EA
 *
 * @description
 * The `ngSwitch` directive is used to conditionally swap DOM structure on your template based on a scope expression.
 * Elements within `ngSwitch` but without `ngSwitchWhen` or `ngSwitchDefault` directives will be preserved at the location
 * as specified in the template.
 *
 * The directive itself works similar to ngInclude, however, instead of downloading template code (or loading it
 * from the template cache), `ngSwitch` simply chooses one of the nested elements and makes it visible based on which element
 * matches the value obtained from the evaluated expression. In other words, you define a container element
 * (where you place the directive), place an expression on the **`on="..."` attribute**
 * (or the **`ng-switch="..."` attribute**), define any inner elements inside of the directive and place
 * a when attribute per element. The when attribute is used to inform ngSwitch which element to display when the on
 * expression is evaluated. If a matching expression is not found via a when attribute then an element with the default
 * attribute is displayed.
 *
 * <div class="alert alert-info">
 * Be aware that the attribute values to match against cannot be expressions. They are interpreted
 * as literal string values to match against.
 * For example, **`ng-switch-when="someVal"`** will match against the string `"someVal"` not against the
 * value of the expression `$scope.someVal`.
 * </div>

 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | after the ngSwitch contents change and the matched child element is placed inside the container |
 * | {@link ng.$animate#leave leave}  | after the ngSwitch contents change and just before the former contents are removed from the DOM |
 *
 * @usage
 *
 * ```
 * <ANY ng-switch="expression">
 *   <ANY ng-switch-when="matchValue1">...</ANY>
 *   <ANY ng-switch-when="matchValue2">...</ANY>
 *   <ANY ng-switch-default>...</ANY>
 * </ANY>
 * ```
 *
 *
 * @scope
 * @priority 1200
 * @param {*} ngSwitch|on expression to match against <code>ng-switch-when</code>.
 * On child elements add:
 *
 * * `ngSwitchWhen`: the case statement to match against. If match then this
 *   case will be displayed. If the same match appears multiple times, all the
 *   elements will be displayed. It is possible to associate multiple values to
 *   the same `ngSwitchWhen` by defining the optional attribute
 *   `ngSwitchWhenSeparator`. The separator will be used to split the value of
 *   the `ngSwitchWhen` attribute into multiple tokens, and the element will show
 *   if any of the `ngSwitch` evaluates to any of these tokens.
 * * `ngSwitchDefault`: the default case when no other case match. If there
 *   are multiple default cases, all of them will be displayed when no other
 *   case match.
 *
 *
 * @example
  <example module="switchExample" deps="angular-animate.js" animations="true" name="ng-switch">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <select ng-model="selection" ng-options="item for item in items">
        </select>
        <code>selection={{selection}}</code>
        <hr/>
        <div class="animate-switch-container"
          ng-switch on="selection">
            <div class="animate-switch" ng-switch-when="settings|options" ng-switch-when-separator="|">Settings Div</div>
            <div class="animate-switch" ng-switch-when="home">Home Span</div>
            <div class="animate-switch" ng-switch-default>default</div>
        </div>
      </div>
    </file>
    <file name="script.js">
      angular.module('switchExample', ['ngAnimate'])
        .controller('ExampleController', ['$scope', function($scope) {
          $scope.items = ['settings', 'home', 'options', 'other'];
          $scope.selection = $scope.items[0];
        }]);
    </file>
    <file name="animations.css">
      .animate-switch-container {
        position:relative;
        background:white;
        border:1px solid black;
        height:40px;
        overflow:hidden;
      }

      .animate-switch {
        padding:10px;
      }

      .animate-switch.ng-animate {
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
      }

      .animate-switch.ng-leave.ng-leave-active,
      .animate-switch.ng-enter {
        top:-50px;
      }
      .animate-switch.ng-leave,
      .animate-switch.ng-enter.ng-enter-active {
        top:0;
      }
    </file>
    <file name="protractor.js" type="protractor">
      var switchElem = element(by.css('[ng-switch]'));
      var select = element(by.model('selection'));

      it('should start in settings', function() {
        expect(switchElem.getText()).toMatch(/Settings Div/);
      });
      it('should change to home', function() {
        select.all(by.css('option')).get(1).click();
        expect(switchElem.getText()).toMatch(/Home Span/);
      });
      it('should change to settings via "options"', function() {
        select.all(by.css('option')).get(2).click();
        expect(switchElem.getText()).toMatch(/Settings Div/);
      });
      it('should select default', function() {
        select.all(by.css('option')).get(3).click();
        expect(switchElem.getText()).toMatch(/default/);
      });
    </file>
  </example>
 */
var ngSwitchDirective = ['$animate', '$compile', function($animate, $compile) {
  return {
    require: 'ngSwitch',

    // asks for $scope to fool the BC controller module
    controller: ['$scope', function NgSwitchController() {
     this.cases = {};
    }],
    link: function(scope, element, attr, ngSwitchController) {
      var watchExpr = attr.ngSwitch || attr.on,
          selectedTranscludes = [],
          selectedElements = [],
          previousLeaveAnimations = [],
          selectedScopes = [];

      var spliceFactory = function(array, index) {
          return function(response) {
            if (response !== false) array.splice(index, 1);
          };
      };

      scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
        var i, ii;

        // Start with the last, in case the array is modified during the loop
        while (previousLeaveAnimations.length) {
          $animate.cancel(previousLeaveAnimations.pop());
        }

        for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
          var selected = getBlockNodes(selectedElements[i].clone);
          selectedScopes[i].$destroy();
          var runner = previousLeaveAnimations[i] = $animate.leave(selected);
          runner.done(spliceFactory(previousLeaveAnimations, i));
        }

        selectedElements.length = 0;
        selectedScopes.length = 0;

        if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
          forEach(selectedTranscludes, function(selectedTransclude) {
            selectedTransclude.transclude(function(caseElement, selectedScope) {
              selectedScopes.push(selectedScope);
              var anchor = selectedTransclude.element;
              caseElement[caseElement.length++] = $compile.$$createComment('end ngSwitchWhen');
              var block = { clone: caseElement };

              selectedElements.push(block);
              $animate.enter(caseElement, anchor.parent(), anchor);
            });
          });
        }
      });
    }
  };
}];

var ngSwitchWhenDirective = ngDirective({
  transclude: 'element',
  priority: 1200,
  require: '^ngSwitch',
  multiElement: true,
  link: function(scope, element, attrs, ctrl, $transclude) {

    var cases = attrs.ngSwitchWhen.split(attrs.ngSwitchWhenSeparator).sort().filter(
      // Filter duplicate cases
      function(element, index, array) { return array[index - 1] !== element; }
    );

    forEach(cases, function(whenCase) {
      ctrl.cases['!' + whenCase] = (ctrl.cases['!' + whenCase] || []);
      ctrl.cases['!' + whenCase].push({ transclude: $transclude, element: element });
    });
  }
});

var ngSwitchDefaultDirective = ngDirective({
  transclude: 'element',
  priority: 1200,
  require: '^ngSwitch',
  multiElement: true,
  link: function(scope, element, attr, ctrl, $transclude) {
    ctrl.cases['?'] = (ctrl.cases['?'] || []);
    ctrl.cases['?'].push({ transclude: $transclude, element: element });
   }
});

/**
 * @ngdoc directive
 * @name ngTransclude
 * @restrict EAC
 *
 * @description
 * Directive that marks the insertion point for the transcluded DOM of the nearest parent directive that uses transclusion.
 *
 * You can specify that you want to insert a named transclusion slot, instead of the default slot, by providing the slot name
 * as the value of the `ng-transclude` or `ng-transclude-slot` attribute.
 *
 * If the transcluded content is not empty (i.e. contains one or more DOM nodes, including whitespace text nodes), any existing
 * content of this element will be removed before the transcluded content is inserted.
 * If the transcluded content is empty (or only whitespace), the existing content is left intact. This lets you provide fallback
 * content in the case that no transcluded content is provided.
 *
 * @element ANY
 *
 * @param {string} ngTransclude|ngTranscludeSlot the name of the slot to insert at this point. If this is not provided, is empty
 *                                               or its value is the same as the name of the attribute then the default slot is used.
 *
 * @example
 * ### Basic transclusion
 * This example demonstrates basic transclusion of content into a component directive.
 * <example name="simpleTranscludeExample" module="transcludeExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('transcludeExample', [])
 *        .directive('pane', function(){
 *           return {
 *             restrict: 'E',
 *             transclude: true,
 *             scope: { title:'@' },
 *             template: '<div style="border: 1px solid black;">' +
 *                         '<div style="background-color: gray">{{title}}</div>' +
 *                         '<ng-transclude></ng-transclude>' +
 *                       '</div>'
 *           };
 *       })
 *       .controller('ExampleController', ['$scope', function($scope) {
 *         $scope.title = 'Lorem Ipsum';
 *         $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
 *       }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <input ng-model="title" aria-label="title"> <br/>
 *       <textarea ng-model="text" aria-label="text"></textarea> <br/>
 *       <pane title="{{title}}"><span>{{text}}</span></pane>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      it('should have transcluded', function() {
 *        var titleElement = element(by.model('title'));
 *        titleElement.clear();
 *        titleElement.sendKeys('TITLE');
 *        var textElement = element(by.model('text'));
 *        textElement.clear();
 *        textElement.sendKeys('TEXT');
 *        expect(element(by.binding('title')).getText()).toEqual('TITLE');
 *        expect(element(by.binding('text')).getText()).toEqual('TEXT');
 *      });
 *   </file>
 * </example>
 *
 * @example
 * ### Transclude fallback content
 * This example shows how to use `NgTransclude` with fallback content, that
 * is displayed if no transcluded content is provided.
 *
 * <example module="transcludeFallbackContentExample" name="ng-transclude">
 * <file name="index.html">
 * <script>
 * angular.module('transcludeFallbackContentExample', [])
 * .directive('myButton', function(){
 *             return {
 *               restrict: 'E',
 *               transclude: true,
 *               scope: true,
 *               template: '<button style="cursor: pointer;">' +
 *                           '<ng-transclude>' +
 *                             '<b style="color: red;">Button1</b>' +
 *                           '</ng-transclude>' +
 *                         '</button>'
 *             };
 *         });
 * </script>
 * <!-- fallback button content -->
 * <my-button id="fallback"></my-button>
 * <!-- modified button content -->
 * <my-button id="modified">
 *   <i style="color: green;">Button2</i>
 * </my-button>
 * </file>
 * <file name="protractor.js" type="protractor">
 * it('should have different transclude element content', function() {
 *          expect(element(by.id('fallback')).getText()).toBe('Button1');
 *          expect(element(by.id('modified')).getText()).toBe('Button2');
 *        });
 * </file>
 * </example>
 *
 * @example
 * ### Multi-slot transclusion
 * This example demonstrates using multi-slot transclusion in a component directive.
 * <example name="multiSlotTranscludeExample" module="multiSlotTranscludeExample">
 *   <file name="index.html">
 *    <style>
 *      .title, .footer {
 *        background-color: gray
 *      }
 *    </style>
 *    <div ng-controller="ExampleController">
 *      <input ng-model="title" aria-label="title"> <br/>
 *      <textarea ng-model="text" aria-label="text"></textarea> <br/>
 *      <pane>
 *        <pane-title><a ng-href="{{link}}">{{title}}</a></pane-title>
 *        <pane-body><p>{{text}}</p></pane-body>
 *      </pane>
 *    </div>
 *   </file>
 *   <file name="app.js">
 *    angular.module('multiSlotTranscludeExample', [])
 *     .directive('pane', function() {
 *        return {
 *          restrict: 'E',
 *          transclude: {
 *            'title': '?paneTitle',
 *            'body': 'paneBody',
 *            'footer': '?paneFooter'
 *          },
 *          template: '<div style="border: 1px solid black;">' +
 *                      '<div class="title" ng-transclude="title">Fallback Title</div>' +
 *                      '<div ng-transclude="body"></div>' +
 *                      '<div class="footer" ng-transclude="footer">Fallback Footer</div>' +
 *                    '</div>'
 *        };
 *    })
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.title = 'Lorem Ipsum';
 *      $scope.link = 'https://google.com';
 *      $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
 *    }]);
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *      it('should have transcluded the title and the body', function() {
 *        var titleElement = element(by.model('title'));
 *        titleElement.clear();
 *        titleElement.sendKeys('TITLE');
 *        var textElement = element(by.model('text'));
 *        textElement.clear();
 *        textElement.sendKeys('TEXT');
 *        expect(element(by.css('.title')).getText()).toEqual('TITLE');
 *        expect(element(by.binding('text')).getText()).toEqual('TEXT');
 *        expect(element(by.css('.footer')).getText()).toEqual('Fallback Footer');
 *      });
 *   </file>
 * </example>
 */
var ngTranscludeMinErr = minErr('ngTransclude');
var ngTranscludeDirective = ['$compile', function($compile) {
  return {
    restrict: 'EAC',
    compile: function ngTranscludeCompile(tElement) {

      // Remove and cache any original content to act as a fallback
      var fallbackLinkFn = $compile(tElement.contents());
      tElement.empty();

      return function ngTranscludePostLink($scope, $element, $attrs, controller, $transclude) {

        if (!$transclude) {
          throw ngTranscludeMinErr('orphan',
          'Illegal use of ngTransclude directive in the template! ' +
          'No parent directive that requires a transclusion found. ' +
          'Element: {0}',
          startingTag($element));
        }


        // If the attribute is of the form: `ng-transclude="ng-transclude"` then treat it like the default
        if ($attrs.ngTransclude === $attrs.$attr.ngTransclude) {
          $attrs.ngTransclude = '';
        }
        var slotName = $attrs.ngTransclude || $attrs.ngTranscludeSlot;

        // If the slot is required and no transclusion content is provided then this call will throw an error
        $transclude(ngTranscludeCloneAttachFn, null, slotName);

        // If the slot is optional and no transclusion content is provided then use the fallback content
        if (slotName && !$transclude.isSlotFilled(slotName)) {
          useFallbackContent();
        }

        function ngTranscludeCloneAttachFn(clone, transcludedScope) {
          if (clone.length && notWhitespace(clone)) {
            $element.append(clone);
          } else {
            useFallbackContent();
            // There is nothing linked against the transcluded scope since no content was available,
            // so it should be safe to clean up the generated scope.
            transcludedScope.$destroy();
          }
        }

        function useFallbackContent() {
          // Since this is the fallback content rather than the transcluded content,
          // we link against the scope of this directive rather than the transcluded scope
          fallbackLinkFn($scope, function(clone) {
            $element.append(clone);
          });
        }

        function notWhitespace(nodes) {
          for (var i = 0, ii = nodes.length; i < ii; i++) {
            var node = nodes[i];
            if (node.nodeType !== NODE_TYPE_TEXT || node.nodeValue.trim()) {
              return true;
            }
          }
        }
      };
    }
  };
}];

/**
 * @ngdoc directive
 * @name script
 * @restrict E
 *
 * @description
 * Load the content of a `<script>` element into {@link ng.$templateCache `$templateCache`}, so that the
 * template can be used by {@link ng.directive:ngInclude `ngInclude`},
 * {@link ngRoute.directive:ngView `ngView`}, or {@link guide/directive directives}. The type of the
 * `<script>` element must be specified as `text/ng-template`, and a cache name for the template must be
 * assigned through the element's `id`, which can then be used as a directive's `templateUrl`.
 *
 * @param {string} type Must be set to `'text/ng-template'`.
 * @param {string} id Cache name of the template.
 *
 * @example
  <example  name="script-tag">
    <file name="index.html">
      <script type="text/ng-template" id="/tpl.html">
        Content of the template.
      </script>

      <a ng-click="currentTpl='/tpl.html'" id="tpl-link">Load inlined template</a>
      <div id="tpl-content" ng-include src="currentTpl"></div>
    </file>
    <file name="protractor.js" type="protractor">
      it('should load template defined inside script tag', function() {
        element(by.css('#tpl-link')).click();
        expect(element(by.css('#tpl-content')).getText()).toMatch(/Content of the template/);
      });
    </file>
  </example>
 */
var scriptDirective = ['$templateCache', function($templateCache) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element, attr) {
      if (attr.type === 'text/ng-template') {
        var templateUrl = attr.id,
            text = element[0].text;

        $templateCache.put(templateUrl, text);
      }
    }
  };
}];

/* exported selectDirective, optionDirective */

var noopNgModelController = { $setViewValue: noop, $render: noop };

function setOptionSelectedStatus(optionEl, value) {
  optionEl.prop('selected', value);
  /**
   * When unselecting an option, setting the property to null / false should be enough
   * However, screenreaders might react to the selected attribute instead, see
   * https://github.com/angular/angular.js/issues/14419
   * Note: "selected" is a boolean attr and will be removed when the "value" arg in attr() is false
   * or null
   */
  optionEl.attr('selected', value);
}

/**
 * @ngdoc type
 * @name  select.SelectController
 *
 * @description
 * The controller for the {@link ng.select select} directive. The controller exposes
 * a few utility methods that can be used to augment the behavior of a regular or an
 * {@link ng.ngOptions ngOptions} select element.
 *
 * @example
 * ### Set a custom error when the unknown option is selected
 *
 * This example sets a custom error "unknownValue" on the ngModelController
 * when the select element's unknown option is selected, i.e. when the model is set to a value
 * that is not matched by any option.
 *
 * <example name="select-unknown-value-error" module="staticSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="testSelect"> Single select: </label><br>
 *     <select name="testSelect" ng-model="selected" unknown-value-error>
 *       <option value="option-1">Option 1</option>
 *       <option value="option-2">Option 2</option>
 *     </select><br>
 *     <span class="error" ng-if="myForm.testSelect.$error.unknownValue">
 *       Error: The current model doesn't match any option</span><br>
 *
 *     <button ng-click="forceUnknownOption()">Force unknown option</button><br>
 *   </form>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('staticSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.selected = null;
 *
 *      $scope.forceUnknownOption = function() {
 *        $scope.selected = 'nonsense';
 *      };
 *   }])
 *   .directive('unknownValueError', function() {
 *     return {
 *       require: ['ngModel', 'select'],
 *       link: function(scope, element, attrs, ctrls) {
 *         var ngModelCtrl = ctrls[0];
 *         var selectCtrl = ctrls[1];
 *
 *         ngModelCtrl.$validators.unknownValue = function(modelValue, viewValue) {
 *           if (selectCtrl.$isUnknownOptionSelected()) {
 *             return false;
 *           }
 *
 *           return true;
 *         };
 *       }
 *
 *     };
 *   });
 * </file>
 *</example>
 *
 *
 * @example
 * ### Set the "required" error when the unknown option is selected.
 *
 * By default, the "required" error on the ngModelController is only set on a required select
 * when the empty option is selected. This example adds a custom directive that also sets the
 * error when the unknown option is selected.
 *
 * <example name="select-unknown-value-required" module="staticSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="testSelect"> Select: </label><br>
 *     <select name="testSelect" ng-model="selected" required unknown-value-required>
 *       <option value="option-1">Option 1</option>
 *       <option value="option-2">Option 2</option>
 *     </select><br>
 *     <span class="error" ng-if="myForm.testSelect.$error.required">Error: Please select a value</span><br>
 *
 *     <button ng-click="forceUnknownOption()">Force unknown option</button><br>
 *   </form>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('staticSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.selected = null;
 *
 *      $scope.forceUnknownOption = function() {
 *        $scope.selected = 'nonsense';
 *      };
 *   }])
 *   .directive('unknownValueRequired', function() {
 *     return {
 *       priority: 1, // This directive must run after the required directive has added its validator
 *       require: ['ngModel', 'select'],
 *       link: function(scope, element, attrs, ctrls) {
 *         var ngModelCtrl = ctrls[0];
 *         var selectCtrl = ctrls[1];
 *
 *         var originalRequiredValidator = ngModelCtrl.$validators.required;
 *
 *         ngModelCtrl.$validators.required = function() {
 *           if (attrs.required && selectCtrl.$isUnknownOptionSelected()) {
 *             return false;
 *           }
 *
 *           return originalRequiredValidator.apply(this, arguments);
 *         };
 *       }
 *     };
 *   });
 * </file>
 * <file name="protractor.js" type="protractor">
 *  it('should show the error message when the unknown option is selected', function() {

      var error = element(by.className('error'));

      expect(error.getText()).toBe('Error: Please select a value');

      element(by.cssContainingText('option', 'Option 1')).click();

      expect(error.isPresent()).toBe(false);

      element(by.tagName('button')).click();

      expect(error.getText()).toBe('Error: Please select a value');
    });
 * </file>
 *</example>
 *
 *
 */
var SelectController =
        ['$element', '$scope', /** @this */ function($element, $scope) {

  var self = this,
      optionsMap = new NgMap();

  self.selectValueMap = {}; // Keys are the hashed values, values the original values

  // If the ngModel doesn't get provided then provide a dummy noop version to prevent errors
  self.ngModelCtrl = noopNgModelController;
  self.multiple = false;

  // The "unknown" option is one that is prepended to the list if the viewValue
  // does not match any of the options. When it is rendered the value of the unknown
  // option is '? XXX ?' where XXX is the hashKey of the value that is not known.
  //
  // Support: IE 9 only
  // We can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  self.unknownOption = jqLite(window.document.createElement('option'));

  // The empty option is an option with the value '' that the application developer can
  // provide inside the select. It is always selectable and indicates that a "null" selection has
  // been made by the user.
  // If the select has an empty option, and the model of the select is set to "undefined" or "null",
  // the empty option is selected.
  // If the model is set to a different unmatched value, the unknown option is rendered and
  // selected, i.e both are present, because a "null" selection and an unknown value are different.
  self.hasEmptyOption = false;
  self.emptyOption = undefined;

  self.renderUnknownOption = function(val) {
    var unknownVal = self.generateUnknownOptionValue(val);
    self.unknownOption.val(unknownVal);
    $element.prepend(self.unknownOption);
    setOptionSelectedStatus(self.unknownOption, true);
    $element.val(unknownVal);
  };

  self.updateUnknownOption = function(val) {
    var unknownVal = self.generateUnknownOptionValue(val);
    self.unknownOption.val(unknownVal);
    setOptionSelectedStatus(self.unknownOption, true);
    $element.val(unknownVal);
  };

  self.generateUnknownOptionValue = function(val) {
    return '? ' + hashKey(val) + ' ?';
  };

  self.removeUnknownOption = function() {
    if (self.unknownOption.parent()) self.unknownOption.remove();
  };

  self.selectEmptyOption = function() {
    if (self.emptyOption) {
      $element.val('');
      setOptionSelectedStatus(self.emptyOption, true);
    }
  };

  self.unselectEmptyOption = function() {
    if (self.hasEmptyOption) {
      setOptionSelectedStatus(self.emptyOption, false);
    }
  };

  $scope.$on('$destroy', function() {
    // disable unknown option so that we don't do work when the whole select is being destroyed
    self.renderUnknownOption = noop;
  });

  // Read the value of the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.readValue = function readSingleValue() {
    var val = $element.val();
    // ngValue added option values are stored in the selectValueMap, normal interpolations are not
    var realVal = val in self.selectValueMap ? self.selectValueMap[val] : val;

    if (self.hasOption(realVal)) {
      return realVal;
    }

    return null;
  };


  // Write the value to the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.writeValue = function writeSingleValue(value) {
    // Make sure to remove the selected attribute from the previously selected option
    // Otherwise, screen readers might get confused
    var currentlySelectedOption = $element[0].options[$element[0].selectedIndex];
    if (currentlySelectedOption) setOptionSelectedStatus(jqLite(currentlySelectedOption), false);

    if (self.hasOption(value)) {
      self.removeUnknownOption();

      var hashedVal = hashKey(value);
      $element.val(hashedVal in self.selectValueMap ? hashedVal : value);

      // Set selected attribute and property on selected option for screen readers
      var selectedOption = $element[0].options[$element[0].selectedIndex];
      setOptionSelectedStatus(jqLite(selectedOption), true);
    } else {
      self.selectUnknownOrEmptyOption(value);
    }
  };


  // Tell the select control that an option, with the given value, has been added
  self.addOption = function(value, element) {
    // Skip comment nodes, as they only pollute the `optionsMap`
    if (element[0].nodeType === NODE_TYPE_COMMENT) return;

    assertNotHasOwnProperty(value, '"option value"');
    if (value === '') {
      self.hasEmptyOption = true;
      self.emptyOption = element;
    }
    var count = optionsMap.get(value) || 0;
    optionsMap.set(value, count + 1);
    // Only render at the end of a digest. This improves render performance when many options
    // are added during a digest and ensures all relevant options are correctly marked as selected
    scheduleRender();
  };

  // Tell the select control that an option, with the given value, has been removed
  self.removeOption = function(value) {
    var count = optionsMap.get(value);
    if (count) {
      if (count === 1) {
        optionsMap.delete(value);
        if (value === '') {
          self.hasEmptyOption = false;
          self.emptyOption = undefined;
        }
      } else {
        optionsMap.set(value, count - 1);
      }
    }
  };

  // Check whether the select control has an option matching the given value
  self.hasOption = function(value) {
    return !!optionsMap.get(value);
  };

  /**
   * @ngdoc method
   * @name select.SelectController#$hasEmptyOption
   *
   * @description
   *
   * Returns `true` if the select element currently has an empty option
   * element, i.e. an option that signifies that the select is empty / the selection is null.
   *
   */
  self.$hasEmptyOption = function() {
    return self.hasEmptyOption;
  };

  /**
   * @ngdoc method
   * @name select.SelectController#$isUnknownOptionSelected
   *
   * @description
   *
   * Returns `true` if the select element's unknown option is selected. The unknown option is added
   * and automatically selected whenever the select model doesn't match any option.
   *
   */
  self.$isUnknownOptionSelected = function() {
    // Presence of the unknown option means it is selected
    return $element[0].options[0] === self.unknownOption[0];
  };

  /**
   * @ngdoc method
   * @name select.SelectController#$isEmptyOptionSelected
   *
   * @description
   *
   * Returns `true` if the select element has an empty option and this empty option is currently
   * selected. Returns `false` if the select element has no empty option or it is not selected.
   *
   */
  self.$isEmptyOptionSelected = function() {
    return self.hasEmptyOption && $element[0].options[$element[0].selectedIndex] === self.emptyOption[0];
  };

  self.selectUnknownOrEmptyOption = function(value) {
    if (value == null && self.emptyOption) {
      self.removeUnknownOption();
      self.selectEmptyOption();
    } else if (self.unknownOption.parent().length) {
      self.updateUnknownOption(value);
    } else {
      self.renderUnknownOption(value);
    }
  };

  var renderScheduled = false;
  function scheduleRender() {
    if (renderScheduled) return;
    renderScheduled = true;
    $scope.$$postDigest(function() {
      renderScheduled = false;
      self.ngModelCtrl.$render();
    });
  }

  var updateScheduled = false;
  function scheduleViewValueUpdate(renderAfter) {
    if (updateScheduled) return;

    updateScheduled = true;

    $scope.$$postDigest(function() {
      if ($scope.$$destroyed) return;

      updateScheduled = false;
      self.ngModelCtrl.$setViewValue(self.readValue());
      if (renderAfter) self.ngModelCtrl.$render();
    });
  }


  self.registerOption = function(optionScope, optionElement, optionAttrs, interpolateValueFn, interpolateTextFn) {

    if (optionAttrs.$attr.ngValue) {
      // The value attribute is set by ngValue
      var oldVal, hashedVal;
      optionAttrs.$observe('value', function valueAttributeObserveAction(newVal) {

        var removal;
        var previouslySelected = optionElement.prop('selected');

        if (isDefined(hashedVal)) {
          self.removeOption(oldVal);
          delete self.selectValueMap[hashedVal];
          removal = true;
        }

        hashedVal = hashKey(newVal);
        oldVal = newVal;
        self.selectValueMap[hashedVal] = newVal;
        self.addOption(newVal, optionElement);
        // Set the attribute directly instead of using optionAttrs.$set - this stops the observer
        // from firing a second time. Other $observers on value will also get the result of the
        // ngValue expression, not the hashed value
        optionElement.attr('value', hashedVal);

        if (removal && previouslySelected) {
          scheduleViewValueUpdate();
        }

      });
    } else if (interpolateValueFn) {
      // The value attribute is interpolated
      optionAttrs.$observe('value', function valueAttributeObserveAction(newVal) {
        // This method is overwritten in ngOptions and has side-effects!
        self.readValue();

        var removal;
        var previouslySelected = optionElement.prop('selected');

        if (isDefined(oldVal)) {
          self.removeOption(oldVal);
          removal = true;
        }
        oldVal = newVal;
        self.addOption(newVal, optionElement);

        if (removal && previouslySelected) {
          scheduleViewValueUpdate();
        }
      });
    } else if (interpolateTextFn) {
      // The text content is interpolated
      optionScope.$watch(interpolateTextFn, function interpolateWatchAction(newVal, oldVal) {
        optionAttrs.$set('value', newVal);
        var previouslySelected = optionElement.prop('selected');
        if (oldVal !== newVal) {
          self.removeOption(oldVal);
        }
        self.addOption(newVal, optionElement);

        if (oldVal && previouslySelected) {
          scheduleViewValueUpdate();
        }
      });
    } else {
      // The value attribute is static
      self.addOption(optionAttrs.value, optionElement);
    }


    optionAttrs.$observe('disabled', function(newVal) {

      // Since model updates will also select disabled options (like ngOptions),
      // we only have to handle options becoming disabled, not enabled

      if (newVal === 'true' || newVal && optionElement.prop('selected')) {
        if (self.multiple) {
          scheduleViewValueUpdate(true);
        } else {
          self.ngModelCtrl.$setViewValue(null);
          self.ngModelCtrl.$render();
        }
      }
    });

    optionElement.on('$destroy', function() {
      var currentValue = self.readValue();
      var removeValue = optionAttrs.value;

      self.removeOption(removeValue);
      scheduleRender();

      if (self.multiple && currentValue && currentValue.indexOf(removeValue) !== -1 ||
          currentValue === removeValue
      ) {
        // When multiple (selected) options are destroyed at the same time, we don't want
        // to run a model update for each of them. Instead, run a single update in the $$postDigest
        scheduleViewValueUpdate(true);
      }
    });
  };
}];

/**
 * @ngdoc directive
 * @name select
 * @restrict E
 *
 * @description
 * HTML `select` element with AngularJS data-binding.
 *
 * The `select` directive is used together with {@link ngModel `ngModel`} to provide data-binding
 * between the scope and the `<select>` control (including setting default values).
 * It also handles dynamic `<option>` elements, which can be added using the {@link ngRepeat `ngRepeat}` or
 * {@link ngOptions `ngOptions`} directives.
 *
 * When an item in the `<select>` menu is selected, the value of the selected option will be bound
 * to the model identified by the `ngModel` directive. With static or repeated options, this is
 * the content of the `value` attribute or the textContent of the `<option>`, if the value attribute is missing.
 * Value and textContent can be interpolated.
 *
 * The {@link select.SelectController select controller} exposes utility functions that can be used
 * to manipulate the select's behavior.
 *
 * ## Matching model and option values
 *
 * In general, the match between the model and an option is evaluated by strictly comparing the model
 * value against the value of the available options.
 *
 * If you are setting the option value with the option's `value` attribute, or textContent, the
 * value will always be a `string` which means that the model value must also be a string.
 * Otherwise the `select` directive cannot match them correctly.
 *
 * To bind the model to a non-string value, you can use one of the following strategies:
 * - the {@link ng.ngOptions `ngOptions`} directive
 *   ({@link ng.select#using-select-with-ngoptions-and-setting-a-default-value})
 * - the {@link ng.ngValue `ngValue`} directive, which allows arbitrary expressions to be
 *   option values ({@link ng.select#using-ngvalue-to-bind-the-model-to-an-array-of-objects Example})
 * - model $parsers / $formatters to convert the string value
 *   ({@link ng.select#binding-select-to-a-non-string-value-via-ngmodel-parsing-formatting Example})
 *
 * If the viewValue of `ngModel` does not match any of the options, then the control
 * will automatically add an "unknown" option, which it then removes when the mismatch is resolved.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * ## Choosing between `ngRepeat` and `ngOptions`
 *
 * In many cases, `ngRepeat` can be used on `<option>` elements instead of {@link ng.directive:ngOptions
 * ngOptions} to achieve a similar result. However, `ngOptions` provides some benefits:
 * - more flexibility in how the `<select>`'s model is assigned via the `select` **`as`** part of the
 * comprehension expression
 * - reduced memory consumption by not creating a new scope for each repeated instance
 * - increased render speed by creating the options in a documentFragment instead of individually
 *
 * Specifically, select with repeated options slows down significantly starting at 2000 options in
 * Chrome and Internet Explorer / Edge.
 *
 *
 * @param {string} ngModel Assignable AngularJS expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} multiple Allows multiple options to be selected. The selected values will be
 *     bound to the model as an array.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {string=} ngRequired Adds required attribute and required validation constraint to
 * the element when the ngRequired expression evaluates to true. Use ngRequired instead of required
 * when you want to data-bind to the required attribute.
 * @param {string=} ngChange AngularJS expression to be executed when selected option(s) changes due to user
 *    interaction with the select element.
 * @param {string=} ngOptions sets the options that the select is populated with and defines what is
 * set on the model on selection. See {@link ngOptions `ngOptions`}.
 * @param {string=} ngAttrSize sets the size of the select element dynamically. Uses the
 * {@link guide/interpolation#-ngattr-for-binding-to-arbitrary-attributes ngAttr} directive.
 *
 *
 * @example
 * ### Simple `select` elements with static options
 *
 * <example name="static-select" module="staticSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="singleSelect"> Single select: </label><br>
 *     <select name="singleSelect" ng-model="data.singleSelect">
 *       <option value="option-1">Option 1</option>
 *       <option value="option-2">Option 2</option>
 *     </select><br>
 *
 *     <label for="singleSelect"> Single select with "not selected" option and dynamic option values: </label><br>
 *     <select name="singleSelect" id="singleSelect" ng-model="data.singleSelect">
 *       <option value="">---Please select---</option> <!-- not selected / blank option -->
 *       <option value="{{data.option1}}">Option 1</option> <!-- interpolation -->
 *       <option value="option-2">Option 2</option>
 *     </select><br>
 *     <button ng-click="forceUnknownOption()">Force unknown option</button><br>
 *     <tt>singleSelect = {{data.singleSelect}}</tt>
 *
 *     <hr>
 *     <label for="multipleSelect"> Multiple select: </label><br>
 *     <select name="multipleSelect" id="multipleSelect" ng-model="data.multipleSelect" multiple>
 *       <option value="option-1">Option 1</option>
 *       <option value="option-2">Option 2</option>
 *       <option value="option-3">Option 3</option>
 *     </select><br>
 *     <tt>multipleSelect = {{data.multipleSelect}}</tt><br/>
 *   </form>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('staticSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       singleSelect: null,
 *       multipleSelect: [],
 *       option1: 'option-1'
 *      };
 *
 *      $scope.forceUnknownOption = function() {
 *        $scope.data.singleSelect = 'nonsense';
 *      };
 *   }]);
 * </file>
 *</example>
 *
 * @example
 * ### Using `ngRepeat` to generate `select` options
 * <example name="select-ngrepeat" module="ngrepeatSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="repeatSelect"> Repeat select: </label>
 *     <select name="repeatSelect" id="repeatSelect" ng-model="data.model">
 *       <option ng-repeat="option in data.availableOptions" value="{{option.id}}">{{option.name}}</option>
 *     </select>
 *   </form>
 *   <hr>
 *   <tt>model = {{data.model}}</tt><br/>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('ngrepeatSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       model: null,
 *       availableOptions: [
 *         {id: '1', name: 'Option A'},
 *         {id: '2', name: 'Option B'},
 *         {id: '3', name: 'Option C'}
 *       ]
 *      };
 *   }]);
 * </file>
 *</example>
 *
 * @example
 * ### Using `ngValue` to bind the model to an array of objects
 * <example name="select-ngvalue" module="ngvalueSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="ngvalueselect"> ngvalue select: </label>
 *     <select size="6" name="ngvalueselect" ng-model="data.model" multiple>
 *       <option ng-repeat="option in data.availableOptions" ng-value="option.value">{{option.name}}</option>
 *     </select>
 *   </form>
 *   <hr>
 *   <pre>model = {{data.model | json}}</pre><br/>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('ngvalueSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       model: null,
 *       availableOptions: [
           {value: 'myString', name: 'string'},
           {value: 1, name: 'integer'},
           {value: true, name: 'boolean'},
           {value: null, name: 'null'},
           {value: {prop: 'value'}, name: 'object'},
           {value: ['a'], name: 'array'}
 *       ]
 *      };
 *   }]);
 * </file>
 *</example>
 *
 * @example
 * ### Using `select` with `ngOptions` and setting a default value
 * See the {@link ngOptions ngOptions documentation} for more `ngOptions` usage examples.
 *
 * <example name="select-with-default-values" module="defaultValueSelect">
 * <file name="index.html">
 * <div ng-controller="ExampleController">
 *   <form name="myForm">
 *     <label for="mySelect">Make a choice:</label>
 *     <select name="mySelect" id="mySelect"
 *       ng-options="option.name for option in data.availableOptions track by option.id"
 *       ng-model="data.selectedOption"></select>
 *   </form>
 *   <hr>
 *   <tt>option = {{data.selectedOption}}</tt><br/>
 * </div>
 * </file>
 * <file name="app.js">
 *  angular.module('defaultValueSelect', [])
 *    .controller('ExampleController', ['$scope', function($scope) {
 *      $scope.data = {
 *       availableOptions: [
 *         {id: '1', name: 'Option A'},
 *         {id: '2', name: 'Option B'},
 *         {id: '3', name: 'Option C'}
 *       ],
 *       selectedOption: {id: '3', name: 'Option C'} //This sets the default value of the select in the ui
 *       };
 *   }]);
 * </file>
 *</example>
 *
 * @example
 * ### Binding `select` to a non-string value via `ngModel` parsing / formatting
 *
 * <example name="select-with-non-string-options" module="nonStringSelect">
 *   <file name="index.html">
 *     <select ng-model="model.id" convert-to-number>
 *       <option value="0">Zero</option>
 *       <option value="1">One</option>
 *       <option value="2">Two</option>
 *     </select>
 *     {{ model }}
 *   </file>
 *   <file name="app.js">
 *     angular.module('nonStringSelect', [])
 *       .run(function($rootScope) {
 *         $rootScope.model = { id: 2 };
 *       })
 *       .directive('convertToNumber', function() {
 *         return {
 *           require: 'ngModel',
 *           link: function(scope, element, attrs, ngModel) {
 *             ngModel.$parsers.push(function(val) {
 *               return parseInt(val, 10);
 *             });
 *             ngModel.$formatters.push(function(val) {
 *               return '' + val;
 *             });
 *           }
 *         };
 *       });
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *     it('should initialize to model', function() {
 *       expect(element(by.model('model.id')).$('option:checked').getText()).toEqual('Two');
 *     });
 *   </file>
 * </example>
 *
 */
var selectDirective = function() {

  return {
    restrict: 'E',
    require: ['select', '?ngModel'],
    controller: SelectController,
    priority: 1,
    link: {
      pre: selectPreLink,
      post: selectPostLink
    }
  };

  function selectPreLink(scope, element, attr, ctrls) {

      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];

      // if ngModel is not defined, we don't need to do anything but set the registerOption
      // function to noop, so options don't get added internally
      if (!ngModelCtrl) {
        selectCtrl.registerOption = noop;
        return;
      }


      selectCtrl.ngModelCtrl = ngModelCtrl;

      // When the selected item(s) changes we delegate getting the value of the select control
      // to the `readValue` method, which can be changed if the select can have multiple
      // selected values or if the options are being generated by `ngOptions`
      element.on('change', function() {
        selectCtrl.removeUnknownOption();
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(selectCtrl.readValue());
        });
      });

      // If the select allows multiple values then we need to modify how we read and write
      // values from and to the control; also what it means for the value to be empty and
      // we have to add an extra watch since ngModel doesn't work well with arrays - it
      // doesn't trigger rendering if only an item in the array changes.
      if (attr.multiple) {
        selectCtrl.multiple = true;

        // Read value now needs to check each option to see if it is selected
        selectCtrl.readValue = function readMultipleValue() {
          var array = [];
          forEach(element.find('option'), function(option) {
            if (option.selected && !option.disabled) {
              var val = option.value;
              array.push(val in selectCtrl.selectValueMap ? selectCtrl.selectValueMap[val] : val);
            }
          });
          return array;
        };

        // Write value now needs to set the selected property of each matching option
        selectCtrl.writeValue = function writeMultipleValue(value) {
          forEach(element.find('option'), function(option) {
            var shouldBeSelected = !!value && (includes(value, option.value) ||
                                               includes(value, selectCtrl.selectValueMap[option.value]));
            var currentlySelected = option.selected;

            // Support: IE 9-11 only, Edge 12-15+
            // In IE and Edge adding options to the selection via shift+click/UP/DOWN
            // will de-select already selected options if "selected" on those options was set
            // more than once (i.e. when the options were already selected)
            // So we only modify the selected property if necessary.
            // Note: this behavior cannot be replicated via unit tests because it only shows in the
            // actual user interface.
            if (shouldBeSelected !== currentlySelected) {
              setOptionSelectedStatus(jqLite(option), shouldBeSelected);
            }

          });
        };

        // we have to do it on each watch since ngModel watches reference, but
        // we need to work of an array, so we need to see if anything was inserted/removed
        var lastView, lastViewRef = NaN;
        scope.$watch(function selectMultipleWatch() {
          if (lastViewRef === ngModelCtrl.$viewValue && !equals(lastView, ngModelCtrl.$viewValue)) {
            lastView = shallowCopy(ngModelCtrl.$viewValue);
            ngModelCtrl.$render();
          }
          lastViewRef = ngModelCtrl.$viewValue;
        });

        // If we are a multiple select then value is now a collection
        // so the meaning of $isEmpty changes
        ngModelCtrl.$isEmpty = function(value) {
          return !value || value.length === 0;
        };

      }
    }

    function selectPostLink(scope, element, attrs, ctrls) {
      // if ngModel is not defined, we don't need to do anything
      var ngModelCtrl = ctrls[1];
      if (!ngModelCtrl) return;

      var selectCtrl = ctrls[0];

      // We delegate rendering to the `writeValue` method, which can be changed
      // if the select can have multiple selected values or if the options are being
      // generated by `ngOptions`.
      // This must be done in the postLink fn to prevent $render to be called before
      // all nodes have been linked correctly.
      ngModelCtrl.$render = function() {
        selectCtrl.writeValue(ngModelCtrl.$viewValue);
      };
    }
};


// The option directive is purely designed to communicate the existence (or lack of)
// of dynamically created (and destroyed) option elements to their containing select
// directive via its controller.
var optionDirective = ['$interpolate', function($interpolate) {
  return {
    restrict: 'E',
    priority: 100,
    compile: function(element, attr) {
      var interpolateValueFn, interpolateTextFn;

      if (isDefined(attr.ngValue)) {
        // Will be handled by registerOption
      } else if (isDefined(attr.value)) {
        // If the value attribute is defined, check if it contains an interpolation
        interpolateValueFn = $interpolate(attr.value, true);
      } else {
        // If the value attribute is not defined then we fall back to the
        // text content of the option element, which may be interpolated
        interpolateTextFn = $interpolate(element.text(), true);
        if (!interpolateTextFn) {
          attr.$set('value', element.text());
        }
      }

      return function(scope, element, attr) {
        // This is an optimization over using ^^ since we don't want to have to search
        // all the way to the root of the DOM for every single option element
        var selectCtrlName = '$selectController',
            parent = element.parent(),
            selectCtrl = parent.data(selectCtrlName) ||
              parent.parent().data(selectCtrlName); // in case we are in optgroup

        if (selectCtrl) {
          selectCtrl.registerOption(scope, element, attr, interpolateValueFn, interpolateTextFn);
        }
      };
    }
  };
}];

/**
 * @ngdoc directive
 * @name ngRequired
 * @restrict A
 *
 * @param {expression} ngRequired AngularJS expression. If it evaluates to `true`, it sets the
 *                                `required` attribute to the element and adds the `required`
 *                                {@link ngModel.NgModelController#$validators `validator`}.
 *
 * @description
 *
 * ngRequired adds the required {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for {@link input `input`} and {@link select `select`} controls, but can also be
 * applied to custom controls.
 *
 * The directive sets the `required` attribute on the element if the AngularJS expression inside
 * `ngRequired` evaluates to true. A special directive for setting `required` is necessary because we
 * cannot use interpolation inside `required`. See the {@link guide/interpolation interpolation guide}
 * for more info.
 *
 * The validator will set the `required` error key to true if the `required` attribute is set and
 * calling {@link ngModel.NgModelController#$isEmpty `NgModelController.$isEmpty`} with the
 * {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`} returns `true`. For example, the
 * `$isEmpty()` implementation for `input[text]` checks the length of the `$viewValue`. When developing
 * custom controls, `$isEmpty()` can be overwritten to account for a $viewValue that is not string-based.
 *
 * @example
 * <example name="ngRequiredDirective" module="ngRequiredExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngRequiredExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.required = true;
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="required">Toggle required: </label>
 *         <input type="checkbox" ng-model="required" id="required" />
 *         <br>
 *         <label for="input">This input must be filled if `required` is true: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-required="required" /><br>
 *         <hr>
 *         required error set? = <code>{{form.input.$error.required}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var required = element(by.binding('form.input.$error.required'));
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should set the required error', function() {
         expect(required.getText()).toContain('true');

         input.sendKeys('123');
         expect(required.getText()).not.toContain('true');
         expect(model.getText()).toContain('123');
       });
 *   </file>
 * </example>
 */
var requiredDirective = ['$parse', function($parse) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      // For boolean attributes like required, presence means true
      var value = attr.hasOwnProperty('required') || $parse(attr.ngRequired)(scope);

      if (!attr.ngRequired) {
        // force truthy in case we are on non input element
        // (input elements do this automatically for boolean attributes like required)
        attr.required = true;
      }

      ctrl.$validators.required = function(modelValue, viewValue) {
        return !value || !ctrl.$isEmpty(viewValue);
      };

      attr.$observe('required', function(newVal) {

        if (value !== newVal) {
          value = newVal;
          ctrl.$validate();
        }
      });
    }
  };
}];

/**
 * @ngdoc directive
 * @name ngPattern
 * @restrict A
 *
 * @param {expression|RegExp} ngPattern AngularJS expression that must evaluate to a `RegExp` or a `String`
 *                                      parsable into a `RegExp`, or a `RegExp` literal. See above for
 *                                      more details.
 *
 * @description
 *
 * ngPattern adds the pattern {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for text-based {@link input `input`} controls, but can also be applied to custom text-based controls.
 *
 * The validator sets the `pattern` error key if the {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`}
 * does not match a RegExp which is obtained from the `ngPattern` attribute value:
 * - the value is an AngularJS expression:
 *   - If the expression evaluates to a RegExp object, then this is used directly.
 *   - If the expression evaluates to a string, then it will be converted to a RegExp after wrapping it
 *     in `^` and `$` characters. For instance, `"abc"` will be converted to `new RegExp('^abc$')`.
 * - If the value is a RegExp literal, e.g. `ngPattern="/^\d+$/"`, it is used directly.
 *
 * <div class="alert alert-info">
 * **Note:** Avoid using the `g` flag on the RegExp, as it will cause each successive search to
 * start at the index of the last search's match, thus not taking the whole input value into
 * account.
 * </div>
 *
 * <div class="alert alert-info">
 * **Note:** This directive is also added when the plain `pattern` attribute is used, with two
 * differences:
 * <ol>
 *   <li>
 *     `ngPattern` does not set the `pattern` attribute and therefore HTML5 constraint validation is
 *     not available.
 *   </li>
 *   <li>
 *     The `ngPattern` attribute must be an expression, while the `pattern` value must be
 *     interpolated.
 *   </li>
 * </ol>
 * </div>
 *
 * @example
 * <example name="ngPatternDirective" module="ngPatternExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngPatternExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.regex = '\\d+';
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="regex">Set a pattern (regex string): </label>
 *         <input type="text" ng-model="regex" id="regex" />
 *         <br>
 *         <label for="input">This input is restricted by the current pattern: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-pattern="regex" /><br>
 *         <hr>
 *         input valid? = <code>{{form.input.$valid}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should validate the input with the default pattern', function() {
         input.sendKeys('aaa');
         expect(model.getText()).not.toContain('aaa');

         input.clear().then(function() {
           input.sendKeys('123');
           expect(model.getText()).toContain('123');
         });
       });
 *   </file>
 * </example>
 */
var patternDirective = ['$parse', function($parse) {
  return {
    restrict: 'A',
    require: '?ngModel',
    compile: function(tElm, tAttr) {
      var patternExp;
      var parseFn;

      if (tAttr.ngPattern) {
        patternExp = tAttr.ngPattern;

        // ngPattern might be a scope expression, or an inlined regex, which is not parsable.
        // We get value of the attribute here, so we can compare the old and the new value
        // in the observer to avoid unnecessary validations
        if (tAttr.ngPattern.charAt(0) === '/' && REGEX_STRING_REGEXP.test(tAttr.ngPattern)) {
          parseFn = function() { return tAttr.ngPattern; };
        } else {
          parseFn = $parse(tAttr.ngPattern);
        }
      }

      return function(scope, elm, attr, ctrl) {
        if (!ctrl) return;

        var attrVal = attr.pattern;

        if (attr.ngPattern) {
          attrVal = parseFn(scope);
        } else {
          patternExp = attr.pattern;
        }

        var regexp = parsePatternAttr(attrVal, patternExp, elm);

        attr.$observe('pattern', function(newVal) {
          var oldRegexp = regexp;

          regexp = parsePatternAttr(newVal, patternExp, elm);

          if ((oldRegexp && oldRegexp.toString()) !== (regexp && regexp.toString())) {
            ctrl.$validate();
          }
        });

        ctrl.$validators.pattern = function(modelValue, viewValue) {
          // HTML5 pattern constraint validates the input value, so we validate the viewValue
          return ctrl.$isEmpty(viewValue) || isUndefined(regexp) || regexp.test(viewValue);
        };
      };
    }

  };
}];

/**
 * @ngdoc directive
 * @name ngMaxlength
 * @restrict A
 *
 * @param {expression} ngMaxlength AngularJS expression that must evaluate to a `Number` or `String`
 *                                 parsable into a `Number`. Used as value for the `maxlength`
 *                                 {@link ngModel.NgModelController#$validators validator}.
 *
 * @description
 *
 * ngMaxlength adds the maxlength {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for text-based {@link input `input`} controls, but can also be applied to custom text-based controls.
 *
 * The validator sets the `maxlength` error key if the {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`}
 * is longer than the integer obtained by evaluating the AngularJS expression given in the
 * `ngMaxlength` attribute value.
 *
 * <div class="alert alert-info">
 * **Note:** This directive is also added when the plain `maxlength` attribute is used, with two
 * differences:
 * <ol>
 *   <li>
 *     `ngMaxlength` does not set the `maxlength` attribute and therefore HTML5 constraint
 *     validation is not available.
 *   </li>
 *   <li>
 *     The `ngMaxlength` attribute must be an expression, while the `maxlength` value must be
 *     interpolated.
 *   </li>
 * </ol>
 * </div>
 *
 * @example
 * <example name="ngMaxlengthDirective" module="ngMaxlengthExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngMaxlengthExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.maxlength = 5;
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="maxlength">Set a maxlength: </label>
 *         <input type="number" ng-model="maxlength" id="maxlength" />
 *         <br>
 *         <label for="input">This input is restricted by the current maxlength: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-maxlength="maxlength" /><br>
 *         <hr>
 *         input valid? = <code>{{form.input.$valid}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should validate the input with the default maxlength', function() {
         input.sendKeys('abcdef');
         expect(model.getText()).not.toContain('abcdef');

         input.clear().then(function() {
           input.sendKeys('abcde');
           expect(model.getText()).toContain('abcde');
         });
       });
 *   </file>
 * </example>
 */
var maxlengthDirective = ['$parse', function($parse) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var maxlength = attr.maxlength || $parse(attr.ngMaxlength)(scope);
      var maxlengthParsed = parseLength(maxlength);

      attr.$observe('maxlength', function(value) {
        if (maxlength !== value) {
          maxlengthParsed = parseLength(value);
          maxlength = value;
          ctrl.$validate();
        }
      });
      ctrl.$validators.maxlength = function(modelValue, viewValue) {
        return (maxlengthParsed < 0) || ctrl.$isEmpty(viewValue) || (viewValue.length <= maxlengthParsed);
      };
    }
  };
}];

/**
 * @ngdoc directive
 * @name ngMinlength
 * @restrict A
 *
 * @param {expression} ngMinlength AngularJS expression that must evaluate to a `Number` or `String`
 *                                 parsable into a `Number`. Used as value for the `minlength`
 *                                 {@link ngModel.NgModelController#$validators validator}.
 *
 * @description
 *
 * ngMinlength adds the minlength {@link ngModel.NgModelController#$validators `validator`} to {@link ngModel `ngModel`}.
 * It is most often used for text-based {@link input `input`} controls, but can also be applied to custom text-based controls.
 *
 * The validator sets the `minlength` error key if the {@link ngModel.NgModelController#$viewValue `ngModel.$viewValue`}
 * is shorter than the integer obtained by evaluating the AngularJS expression given in the
 * `ngMinlength` attribute value.
 *
 * <div class="alert alert-info">
 * **Note:** This directive is also added when the plain `minlength` attribute is used, with two
 * differences:
 * <ol>
 *   <li>
 *     `ngMinlength` does not set the `minlength` attribute and therefore HTML5 constraint
 *     validation is not available.
 *   </li>
 *   <li>
 *     The `ngMinlength` value must be an expression, while the `minlength` value must be
 *     interpolated.
 *   </li>
 * </ol>
 * </div>
 *
 * @example
 * <example name="ngMinlengthDirective" module="ngMinlengthExample">
 *   <file name="index.html">
 *     <script>
 *       angular.module('ngMinlengthExample', [])
 *         .controller('ExampleController', ['$scope', function($scope) {
 *           $scope.minlength = 3;
 *         }]);
 *     </script>
 *     <div ng-controller="ExampleController">
 *       <form name="form">
 *         <label for="minlength">Set a minlength: </label>
 *         <input type="number" ng-model="minlength" id="minlength" />
 *         <br>
 *         <label for="input">This input is restricted by the current minlength: </label>
 *         <input type="text" ng-model="model" id="input" name="input" ng-minlength="minlength" /><br>
 *         <hr>
 *         input valid? = <code>{{form.input.$valid}}</code><br>
 *         model = <code>{{model}}</code>
 *       </form>
 *     </div>
 *   </file>
 *   <file name="protractor.js" type="protractor">
       var model = element(by.binding('model'));
       var input = element(by.id('input'));

       it('should validate the input with the default minlength', function() {
         input.sendKeys('ab');
         expect(model.getText()).not.toContain('ab');

         input.sendKeys('abc');
         expect(model.getText()).toContain('abc');
       });
 *   </file>
 * </example>
 */
var minlengthDirective = ['$parse', function($parse) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var minlength = attr.minlength || $parse(attr.ngMinlength)(scope);
      var minlengthParsed = parseLength(minlength) || -1;

      attr.$observe('minlength', function(value) {
        if (minlength !== value) {
          minlengthParsed = parseLength(value) || -1;
          minlength = value;
          ctrl.$validate();
        }

      });
      ctrl.$validators.minlength = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || viewValue.length >= minlengthParsed;
      };
    }
  };
}];

function parsePatternAttr(regex, patternExp, elm) {
  if (!regex) return undefined;

  if (isString(regex)) {
    regex = new RegExp('^' + regex + '$');
  }

  if (!regex.test) {
    throw minErr('ngPattern')('noregexp',
      'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp,
      regex, startingTag(elm));
  }

  return regex;
}

function parseLength(val) {
  var intVal = toInt(val);
  return isNumberNaN(intVal) ? -1 : intVal;
}

if (window.angular.bootstrap) {
  // AngularJS is already loaded, so we can return here...
  if (window.console) {
    console.log('WARNING: Tried to load AngularJS more than once.');
  }
  return;
}

// try to bind to jquery now so that one can write jqLite(fn)
// but we will rebind on bootstrap again.
bindJQuery();

publishExternalAPI(angular);

angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "ERANAMES": [
      "Before Christ",
      "Anno Domini"
    ],
    "ERAS": [
      "BC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    "SHORTDAY": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "SHORTMONTH": [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    "STANDALONEMONTH": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/y h:mm a",
    "shortDate": "dd/MM/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "en-na",
  "localeID": "en_NA",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);

  jqLite(function() {
    angularInit(window.document, bootstrap);
  });

})(window);

!window.angular.$$csp().noInlineStyle && window.angular.element(document.head).prepend(window.angular.element('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>'));
