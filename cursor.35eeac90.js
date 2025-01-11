// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"about/src/js/cursor.js":[function(require,module,exports) {
/**
 * Linear interpolation
 * @param {Number} a - first value to interpolate
 * @param {Number} b - second value to interpolate 
 * @param {Number} n - amount to interpolate
 */
const lerp = (a, b, n) => (1 - n) * a + n * b;

/**
 * Gets the cursor position
 * @param {Event} ev - mousemove event
 */
const getCursorPos = ev => {
  return {
    x: ev.clientX,
    y: ev.clientY
  };
};

// Track the cursor position
let cursor = {
  x: 0,
  y: 0
};
window.addEventListener('mousemove', ev => cursor = getCursorPos(ev));

/**
 * Class representing a custom cursor.
 * A Cursor can have multiple elements/svgs
 */
class Cursor {
  // DOM elements
  DOM = {
    // cursor elements (SVGs .cursor)
    elements: null
  };
  // All CursorElement instances
  cursorElements = [];

  /**
   * Constructor.
   * @param {NodeList} Dom_elems - all .cursor elements
   * @param {String} triggerSelector - Trigger the cursor enter/leave method on the this selector returned elements. Default is all <a>.
   */
  constructor(Dom_elems) {
    let triggerSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'a';
    this.DOM.elements = Dom_elems;
    [...this.DOM.elements].forEach(el => this.cursorElements.push(new CursorElement(el)));
    [...document.querySelectorAll(triggerSelector)].forEach(link => {
      link.addEventListener('mouseenter', () => this.enter());
      link.addEventListener('mouseleave', () => this.leave());
    });
  }
  /**
   * Mouseenter event
   */
  enter() {
    for (const el of this.cursorElements) {
      el.enter();
    }
  }

  /**
   * Mouseleave event
   */
  leave() {
    for (const el of this.cursorElements) {
      el.leave();
    }
  }
}

/**
 * Class representing a .cursor element
 */
class CursorElement {
  // DOM elements
  DOM = {
    // Main element (.cursor)
    el: null,
    // Inner element (.cursor__inner)
    inner: null,
    // feTurbulence element
    feTurbulence: null
  };
  // Scales value when entering an <a> element
  radiusOnEnter = 40;
  // Opacity value when entering an <a> element
  opacityOnEnter = 1;
  // radius
  radius;
  // Element style properties
  renderedStyles = {
    // With interpolation, we can achieve a smooth animation effect when moving the cursor. 
    // The "previous" and "current" values are the values that will interpolate. 
    // The returned value will be one between these two (previous and current) at a specific increment. 
    // The "amt" is the amount to interpolate. 
    // As an example, the following formula calculates the x-axis translation value to apply to the cursor element:
    // this.renderedStyles.tx.previous = lerp(this.renderedStyles.tx.previous, this.renderedStyles.tx.current, this.renderedStyles.tx.amt);

    // translation, scale and opacity values
    // The lower the amt, the slower the cursor "follows" the user gesture
    tx: {
      previous: 0,
      current: 0,
      amt: 0.15
    },
    ty: {
      previous: 0,
      current: 0,
      amt: 0.15
    },
    // The scale and opacity will change when hovering over any element specified in [triggerSelector]
    // Defaults are 1 for both properties
    //scale: {previous: 1, current: 1, amt: 0.2},
    radius: {
      previous: 20,
      current: 20,
      amt: 0.15
    },
    opacity: {
      previous: 1,
      current: 1,
      amt: 0.15
    }
  };
  // Element size and position
  bounds;
  // SVG filter id
  filterId = '#cursor-filter';
  // for the filter animation
  primitiveValues = {
    turbulence: 0
  };

  /**
   * Constructor.
   */
  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.cursor__inner');
    this.DOM.feTurbulence = document.querySelector(`${this.filterId} > feTurbulence`);
    this.createFilterTimeline();

    // Hide it initially
    this.opacity = this.DOM.el.style.opacity;
    this.DOM.el.style.opacity = 0;

    // Calculate size and position
    this.bounds = this.DOM.el.getBoundingClientRect();

    // Check if any options passed in data attributes
    this.radiusOnEnter = this.DOM.el.dataset.radiusEnter || this.radiusOnEnter;
    this.opacityOnEnter = this.DOM.el.dataset.opacityEnter || this.opacityOnEnter;
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].amt = this.DOM.el.dataset.amt || this.renderedStyles[key].amt;
    }
    this.radius = this.DOM.inner.getAttribute('r');
    this.renderedStyles['radius'].previous = this.renderedStyles['radius'].current = this.radius;
    this.renderedStyles['opacity'].previous = this.renderedStyles['opacity'].current = this.opacity;

    // Show the element and start tracking its position as soon as the user moves the cursor.
    const onMouseMoveEv = () => {
      // Set up the initial values to be the same
      this.renderedStyles.tx.previous = this.renderedStyles.tx.current = cursor.x - this.bounds.width / 2;
      this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = cursor.y - this.bounds.height / 2;
      // Show it
      this.DOM.el.style.opacity = this.opacity;
      // Start rAF loop
      requestAnimationFrame(() => this.render());
      // Remove the initial mousemove event
      window.removeEventListener('mousemove', onMouseMoveEv);
    };
    window.addEventListener('mousemove', onMouseMoveEv);
  }

  /**
   * Mouseenter event
   * Scale up and fade out.
   */
  enter() {
    this.renderedStyles['radius'].current = this.radiusOnEnter;
    this.renderedStyles['opacity'].current = this.opacityOnEnter;
    this.filterTimeline.restart();
  }

  /**
   * Mouseleave event
   * Reset scale and opacity.
   */
  leave() {
    this.renderedStyles['radius'].current = this.radius;
    this.renderedStyles['opacity'].current = this.opacity;
    this.filterTimeline.progress(1).kill();
  }
  createFilterTimeline() {
    this.filterTimeline = gsap.timeline({
      paused: true,
      onStart: () => {
        this.DOM.inner.style.filter = `url(${this.filterId}`;
      },
      onUpdate: () => {
        this.DOM.feTurbulence.setAttribute('baseFrequency', this.primitiveValues.turbulence);
      },
      onComplete: () => {
        this.DOM.inner.style.filter = 'none';
      }
    }).to(this.primitiveValues, {
      duration: .5,
      ease: 'sine.in',
      startAt: {
        turbulence: 1
      },
      turbulence: 0
    });
  }

  /**
   * Loop / Interpolation
   */
  render() {
    // New cursor positions
    this.renderedStyles['tx'].current = cursor.x - this.bounds.width / 2;
    this.renderedStyles['ty'].current = cursor.y - this.bounds.height / 2;

    // Interpolation
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
    }

    // Apply interpolated values (smooth effect)
    this.DOM.el.style.transform = `translateX(${this.renderedStyles['tx'].previous}px) translateY(${this.renderedStyles['ty'].previous}px)`;
    this.DOM.inner.setAttribute('r', this.renderedStyles['radius'].previous);
    this.DOM.el.style.opacity = this.renderedStyles['opacity'].previous;

    // loop...
    requestAnimationFrame(() => this.render());
  }
}

// Initialize custom cursor
const customCursor = new Cursor(document.querySelectorAll('.cursor'));
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "11519" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","about/src/js/cursor.js"], null)
//# sourceMappingURL=/cursor.35eeac90.js.map