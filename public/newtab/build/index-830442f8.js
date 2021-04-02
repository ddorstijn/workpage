
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { r as is_function } from './main-23cac9f9.js';

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

function getBoundingClientRect(element) {
  var rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle$1(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(round(x * dpr) / dpr) || 0,
    y: round(round(y * dpr) / dpr) || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets;

  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
      _ref3$x = _ref3.x,
      x = _ref3$x === void 0 ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = _ref3$y === void 0 ? 0 : _ref3$y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle$1(offsetParent).position !== 'static') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top) {
      sideY = bottom; // $FlowFixMe[prop-missing]

      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left) {
      sideX = right; // $FlowFixMe[prop-missing]

      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref4) {
  var state = _ref4.state,
      options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle$1(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle$1(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function getVariation(placement) {
  return placement.split('-')[1];
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var referenceElement = state.elements.reference;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(referenceElement);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;

    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip$1(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$2 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip$1,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
    var max$1 = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

    if (checkMainAxis) {
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// Composite means it takes into account transforms as well as layout.

function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement);
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    Object.keys(modifier).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (!Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(options) {
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle$1(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$2, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function createPopperActions(initOptions) {
    var popperInstance = null;
    var referenceNode;
    var contentNode;
    var options = initOptions;
    var initPopper = function () {
        if (referenceNode && contentNode) {
            popperInstance = createPopper(referenceNode, contentNode, options);
        }
    };
    var deinitPopper = function () {
        if (popperInstance) {
            popperInstance.destroy();
            popperInstance = null;
        }
    };
    var referenceAction = function (node) {
        referenceNode = node;
        initPopper();
        return {
            destroy: function () {
                deinitPopper();
            }
        };
    };
    var contentAction = function (node, contentOptions) {
        contentNode = node;
        options = __assign(__assign({}, initOptions), contentOptions);
        initPopper();
        return {
            update: function (newContentOptions) {
                options = __assign(__assign({}, initOptions), newContentOptions);
                if (popperInstance && options) {
                    popperInstance.setOptions(options);
                }
            },
            destroy: function () {
                deinitPopper();
            }
        };
    };
    return [referenceAction, contentAction, function () { return popperInstance; }];
}

// external events
const FINALIZE_EVENT_NAME = "finalize";
const CONSIDER_EVENT_NAME = "consider";

/**
 * @typedef {Object} Info
 * @property {string} trigger
 * @property {string} id
 * @property {string} source
 * @param {Node} el
 * @param {Array} items
 * @param {Info} info
 */
function dispatchFinalizeEvent(el, items, info) {
    el.dispatchEvent(
        new CustomEvent(FINALIZE_EVENT_NAME, {
            detail: {items, info}
        })
    );
}

/**
 * Dispatches a consider event
 * @param {Node} el
 * @param {Array} items
 * @param {Info} info
 */
function dispatchConsiderEvent(el, items, info) {
    el.dispatchEvent(
        new CustomEvent(CONSIDER_EVENT_NAME, {
            detail: {items, info}
        })
    );
}

// internal events
const DRAGGED_ENTERED_EVENT_NAME = "draggedEntered";
const DRAGGED_LEFT_EVENT_NAME = "draggedLeft";
const DRAGGED_OVER_INDEX_EVENT_NAME = "draggedOverIndex";
const DRAGGED_LEFT_DOCUMENT_EVENT_NAME = "draggedLeftDocument";

const DRAGGED_LEFT_TYPES = {
    LEFT_FOR_ANOTHER: "leftForAnother",
    OUTSIDE_OF_ANY: "outsideOfAny"
};

function dispatchDraggedElementEnteredContainer(containerEl, indexObj, draggedEl) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_ENTERED_EVENT_NAME, {
            detail: {indexObj, draggedEl}
        })
    );
}

/**
 * @param containerEl - the dropzone the element left
 * @param draggedEl - the dragged element
 * @param theOtherDz - the new dropzone the element entered
 */
function dispatchDraggedElementLeftContainerForAnother(containerEl, draggedEl, theOtherDz) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
            detail: {draggedEl, type: DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER, theOtherDz}
        })
    );
}

function dispatchDraggedElementLeftContainerForNone(containerEl, draggedEl) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
            detail: {draggedEl, type: DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY}
        })
    );
}
function dispatchDraggedElementIsOverIndex(containerEl, indexObj, draggedEl) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_OVER_INDEX_EVENT_NAME, {
            detail: {indexObj, draggedEl}
        })
    );
}
function dispatchDraggedLeftDocument(draggedEl) {
    window.dispatchEvent(
        new CustomEvent(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, {
            detail: {draggedEl}
        })
    );
}

const TRIGGERS = {
    DRAG_STARTED: "dragStarted",
    DRAGGED_ENTERED: DRAGGED_ENTERED_EVENT_NAME,
    DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
    DRAGGED_OVER_INDEX: DRAGGED_OVER_INDEX_EVENT_NAME,
    DRAGGED_LEFT: DRAGGED_LEFT_EVENT_NAME,
    DRAGGED_LEFT_ALL: "draggedLeftAll",
    DROPPED_INTO_ZONE: "droppedIntoZone",
    DROPPED_INTO_ANOTHER: "droppedIntoAnother",
    DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
    DRAG_STOPPED: "dragStopped"
};

const SOURCES = {
    POINTER: "pointer",
    KEYBOARD: "keyboard"
};

const SHADOW_ITEM_MARKER_PROPERTY_NAME = "isDndShadowItem";
const SHADOW_ELEMENT_ATTRIBUTE_NAME = "data-is-dnd-shadow-item";
const SHADOW_PLACEHOLDER_ITEM_ID = "id:dnd-shadow-placeholder-0000";

let ITEM_ID_KEY = "id";
let activeDndZoneCount = 0;
function incrementActiveDropZoneCount() {
    activeDndZoneCount++;
}
function decrementActiveDropZoneCount() {
    if (activeDndZoneCount === 0) {
        throw new Error("Bug! trying to decrement when there are no dropzones");
    }
    activeDndZoneCount--;
}

const isOnServer = typeof window === "undefined";

// This is based off https://stackoverflow.com/questions/27745438/how-to-compute-getboundingclientrect-without-considering-transforms/57876601#57876601
// It removes the transforms that are potentially applied by the flip animations
/**
 * Gets the bounding rect but removes transforms (ex: flip animation)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
function getBoundingRectNoTransforms(el) {
    let ta;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const tx = style.transform;

    if (tx) {
        let sx, sy, dx, dy;
        if (tx.startsWith("matrix3d(")) {
            ta = tx.slice(9, -1).split(/, /);
            sx = +ta[0];
            sy = +ta[5];
            dx = +ta[12];
            dy = +ta[13];
        } else if (tx.startsWith("matrix(")) {
            ta = tx.slice(7, -1).split(/, /);
            sx = +ta[0];
            sy = +ta[3];
            dx = +ta[4];
            dy = +ta[5];
        } else {
            return rect;
        }

        const to = style.transformOrigin;
        const x = rect.x - dx - (1 - sx) * parseFloat(to);
        const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
        const w = sx ? rect.width / sx : el.offsetWidth;
        const h = sy ? rect.height / sy : el.offsetHeight;
        return {
            x: x,
            y: y,
            width: w,
            height: h,
            top: y,
            right: x + w,
            bottom: y + h,
            left: x
        };
    } else {
        return rect;
    }
}

/**
 * Gets the absolute bounding rect (accounts for the window's scroll position and removes transforms)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
function getAbsoluteRectNoTransforms(el) {
    const rect = getBoundingRectNoTransforms(el);
    return {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX
    };
}

/**
 * Gets the absolute bounding rect (accounts for the window's scroll position)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
function getAbsoluteRect(el) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX
    };
}

/**
 * finds the center :)
 * @typedef {Object} Rect
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 * @param {Rect} rect
 * @return {{x: number, y: number}}
 */
function findCenter(rect) {
    return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
    };
}

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 * @param {Point} pointA
 * @param {Point} pointB
 * @return {number}
 */
function calcDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

/**
 * @param {Point} point
 * @param {Rect} rect
 * @return {boolean|boolean}
 */
function isPointInsideRect(point, rect) {
    return point.y <= rect.bottom && point.y >= rect.top && point.x >= rect.left && point.x <= rect.right;
}

/**
 * find the absolute coordinates of the center of a dom element
 * @param el {HTMLElement}
 * @returns {{x: number, y: number}}
 */
function findCenterOfElement(el) {
    return findCenter(getAbsoluteRect(el));
}

/**
 * @param {HTMLElement} elA
 * @param {HTMLElement} elB
 * @return {boolean}
 */
function isCenterOfAInsideB(elA, elB) {
    const centerOfA = findCenterOfElement(elA);
    const rectOfB = getAbsoluteRectNoTransforms(elB);
    return isPointInsideRect(centerOfA, rectOfB);
}

/**
 * @param {HTMLElement|ChildNode} elA
 * @param {HTMLElement|ChildNode} elB
 * @return {number}
 */
function calcDistanceBetweenCenters(elA, elB) {
    const centerOfA = findCenterOfElement(elA);
    const centerOfB = findCenterOfElement(elB);
    return calcDistance(centerOfA, centerOfB);
}

/**
 * @param {HTMLElement} el - the element to check
 * @returns {boolean} - true if the element in its entirety is off screen including the scrollable area (the normal dom events look at the mouse rather than the element)
 */
function isElementOffDocument(el) {
    const rect = getAbsoluteRect(el);
    return rect.right < 0 || rect.left > document.documentElement.scrollWidth || rect.bottom < 0 || rect.top > document.documentElement.scrollHeight;
}

/**
 * If the point is inside the element returns its distances from the sides, otherwise returns null
 * @param {Point} point
 * @param {HTMLElement} el
 * @return {null|{top: number, left: number, bottom: number, right: number}}
 */
function calcInnerDistancesBetweenPointAndSidesOfElement(point, el) {
    const rect = getAbsoluteRect(el);
    if (!isPointInsideRect(point, rect)) {
        return null;
    }
    return {
        top: point.y - rect.top,
        bottom: rect.bottom - point.y,
        left: point.x - rect.left,
        // TODO - figure out what is so special about right (why the rect is too big)
        right: Math.min(rect.right, document.documentElement.clientWidth) - point.x
    };
}

let dzToShadowIndexToRect;

/**
 * Resets the cache that allows for smarter "would be index" resolution. Should be called after every drag operation
 */
function resetIndexesCache() {
    dzToShadowIndexToRect = new Map();
}
resetIndexesCache();

/**
 * Caches the coordinates of the shadow element when it's in a certain index in a certain dropzone.
 * Helpful in order to determine "would be index" more effectively
 * @param {HTMLElement} dz
 * @return {number} - the shadow element index
 */
function cacheShadowRect(dz) {
    const shadowElIndex = Array.from(dz.children).findIndex(child => child.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME));
    if (shadowElIndex >= 0) {
        if (!dzToShadowIndexToRect.has(dz)) {
            dzToShadowIndexToRect.set(dz, new Map());
        }
        dzToShadowIndexToRect.get(dz).set(shadowElIndex, getAbsoluteRectNoTransforms(dz.children[shadowElIndex]));
        return shadowElIndex;
    }
    return undefined;
}

/**
 * @typedef {Object} Index
 * @property {number} index - the would be index
 * @property {boolean} isProximityBased - false if the element is actually over the index, true if it is not over it but this index is the closest
 */
/**
 * Find the index for the dragged element in the list it is dragged over
 * @param {HTMLElement} floatingAboveEl
 * @param {HTMLElement} collectionBelowEl
 * @returns {Index|null} -  if the element is over the container the Index object otherwise null
 */
function findWouldBeIndex(floatingAboveEl, collectionBelowEl) {
    if (!isCenterOfAInsideB(floatingAboveEl, collectionBelowEl)) {
        return null;
    }
    const children = collectionBelowEl.children;
    // the container is empty, floating element should be the first
    if (children.length === 0) {
        return {index: 0, isProximityBased: true};
    }
    const shadowElIndex = cacheShadowRect(collectionBelowEl);

    // the search could be more efficient but keeping it simple for now
    // a possible improvement: pass in the lastIndex it was found in and check there first, then expand from there
    for (let i = 0; i < children.length; i++) {
        if (isCenterOfAInsideB(floatingAboveEl, children[i])) {
            const cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);
            if (cachedShadowRect) {
                if (!isPointInsideRect(findCenterOfElement(floatingAboveEl), cachedShadowRect)) {
                    return {index: shadowElIndex, isProximityBased: false};
                }
            }
            return {index: i, isProximityBased: false};
        }
    }
    // this can happen if there is space around the children so the floating element has
    //entered the container but not any of the children, in this case we will find the nearest child
    let minDistanceSoFar = Number.MAX_VALUE;
    let indexOfMin = undefined;
    // we are checking all of them because we don't know whether we are dealing with a horizontal or vertical container and where the floating element entered from
    for (let i = 0; i < children.length; i++) {
        const distance = calcDistanceBetweenCenters(floatingAboveEl, children[i]);
        if (distance < minDistanceSoFar) {
            minDistanceSoFar = distance;
            indexOfMin = i;
        }
    }
    return {index: indexOfMin, isProximityBased: true};
}

const SCROLL_ZONE_PX = 25;

function makeScroller() {
    let scrollingInfo;
    function resetScrolling() {
        scrollingInfo = {directionObj: undefined, stepPx: 0};
    }
    resetScrolling();
    // directionObj {x: 0|1|-1, y:0|1|-1} - 1 means down in y and right in x
    function scrollContainer(containerEl) {
        const {directionObj, stepPx} = scrollingInfo;
        if (directionObj) {
            containerEl.scrollBy(directionObj.x * stepPx, directionObj.y * stepPx);
            window.requestAnimationFrame(() => scrollContainer(containerEl));
        }
    }
    function calcScrollStepPx(distancePx) {
        return SCROLL_ZONE_PX - distancePx;
    }

    /**
     * If the pointer is next to the sides of the element to scroll, will trigger scrolling
     * Can be called repeatedly with updated pointer and elementToScroll values without issues
     * @return {boolean} - true if scrolling was needed
     */
    function scrollIfNeeded(pointer, elementToScroll) {
        if (!elementToScroll) {
            return false;
        }
        const distances = calcInnerDistancesBetweenPointAndSidesOfElement(pointer, elementToScroll);
        if (distances === null) {
            resetScrolling();
            return false;
        }
        const isAlreadyScrolling = !!scrollingInfo.directionObj;
        let [scrollingVertically, scrollingHorizontally] = [false, false];
        // vertical
        if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
            if (distances.bottom < SCROLL_ZONE_PX) {
                scrollingVertically = true;
                scrollingInfo.directionObj = {x: 0, y: 1};
                scrollingInfo.stepPx = calcScrollStepPx(distances.bottom);
            } else if (distances.top < SCROLL_ZONE_PX) {
                scrollingVertically = true;
                scrollingInfo.directionObj = {x: 0, y: -1};
                scrollingInfo.stepPx = calcScrollStepPx(distances.top);
            }
            if (!isAlreadyScrolling && scrollingVertically) {
                scrollContainer(elementToScroll);
                return true;
            }
        }
        // horizontal
        if (elementToScroll.scrollWidth > elementToScroll.clientWidth) {
            if (distances.right < SCROLL_ZONE_PX) {
                scrollingHorizontally = true;
                scrollingInfo.directionObj = {x: 1, y: 0};
                scrollingInfo.stepPx = calcScrollStepPx(distances.right);
            } else if (distances.left < SCROLL_ZONE_PX) {
                scrollingHorizontally = true;
                scrollingInfo.directionObj = {x: -1, y: 0};
                scrollingInfo.stepPx = calcScrollStepPx(distances.left);
            }
            if (!isAlreadyScrolling && scrollingHorizontally) {
                scrollContainer(elementToScroll);
                return true;
            }
        }
        resetScrolling();
        return false;
    }

    return {
        scrollIfNeeded,
        resetScrolling
    };
}

/**
 * @param {Object} object
 * @return {string}
 */
function toString(object) {
    return JSON.stringify(object, null, 2);
}

/**
 * Finds the depth of the given node in the DOM tree
 * @param {HTMLElement} node
 * @return {number} - the depth of the node
 */
function getDepth(node) {
    if (!node) {
        throw new Error("cannot get depth of a falsy node");
    }
    return _getDepth(node, 0);
}
function _getDepth(node, countSoFar = 0) {
    if (!node.parentElement) {
        return countSoFar - 1;
    }
    return _getDepth(node.parentElement, countSoFar + 1);
}

/**
 * A simple util to shallow compare objects quickly, it doesn't validate the arguments so pass objects in
 * @param {Object} objA
 * @param {Object} objB
 * @return {boolean} - true if objA and objB are shallow equal
 */
function areObjectsShallowEqual(objA, objB) {
    if (Object.keys(objA).length !== Object.keys(objB).length) {
        return false;
    }
    for (const keyA in objA) {
        if (!{}.hasOwnProperty.call(objB, keyA) || objB[keyA] !== objA[keyA]) {
            return false;
        }
    }
    return true;
}

/**
 * Shallow compares two arrays
 * @param arrA
 * @param arrB
 * @return {boolean} - whether the arrays are shallow equal
 */
function areArraysShallowEqualSameOrder(arrA, arrB) {
    if (arrA.length !== arrB.length) {
        return false;
    }
    for (let i = 0; i < arrA.length; i++) {
        if (arrA[i] !== arrB[i]) {
            return false;
        }
    }
    return true;
}

const INTERVAL_MS$1 = 200;
const TOLERANCE_PX = 10;
const {scrollIfNeeded: scrollIfNeeded$1, resetScrolling: resetScrolling$1} = makeScroller();
let next$1;

/**
 * Tracks the dragged elements and performs the side effects when it is dragged over a drop zone (basically dispatching custom-events scrolling)
 * @param {Set<HTMLElement>} dropZones
 * @param {HTMLElement} draggedEl
 * @param {number} [intervalMs = INTERVAL_MS]
 */
function observe(draggedEl, dropZones, intervalMs = INTERVAL_MS$1) {
    // initialization
    let lastDropZoneFound;
    let lastIndexFound;
    let lastIsDraggedInADropZone = false;
    let lastCentrePositionOfDragged;
    // We are sorting to make sure that in case of nested zones of the same type the one "on top" is considered first
    const dropZonesFromDeepToShallow = Array.from(dropZones).sort((dz1, dz2) => getDepth(dz2) - getDepth(dz1));

    /**
     * The main function in this module. Tracks where everything is/ should be a take the actions
     */
    function andNow() {
        const currentCenterOfDragged = findCenterOfElement(draggedEl);
        const scrolled = scrollIfNeeded$1(currentCenterOfDragged, lastDropZoneFound);
        // we only want to make a new decision after the element was moved a bit to prevent flickering
        if (
            !scrolled &&
            lastCentrePositionOfDragged &&
            Math.abs(lastCentrePositionOfDragged.x - currentCenterOfDragged.x) < TOLERANCE_PX &&
            Math.abs(lastCentrePositionOfDragged.y - currentCenterOfDragged.y) < TOLERANCE_PX
        ) {
            next$1 = window.setTimeout(andNow, intervalMs);
            return;
        }
        if (isElementOffDocument(draggedEl)) {
            dispatchDraggedLeftDocument(draggedEl);
            return;
        }

        lastCentrePositionOfDragged = currentCenterOfDragged;
        // this is a simple algorithm, potential improvement: first look at lastDropZoneFound
        let isDraggedInADropZone = false;
        for (const dz of dropZonesFromDeepToShallow) {
            const indexObj = findWouldBeIndex(draggedEl, dz);
            if (indexObj === null) {
                // it is not inside
                continue;
            }
            const {index} = indexObj;
            isDraggedInADropZone = true;
            // the element is over a container
            if (dz !== lastDropZoneFound) {
                lastDropZoneFound && dispatchDraggedElementLeftContainerForAnother(lastDropZoneFound, draggedEl, dz);
                dispatchDraggedElementEnteredContainer(dz, indexObj, draggedEl);
                lastDropZoneFound = dz;
            } else if (index !== lastIndexFound) {
                dispatchDraggedElementIsOverIndex(dz, indexObj, draggedEl);
                lastIndexFound = index;
            }
            // we handle looping with the 'continue' statement above
            break;
        }
        // the first time the dragged element is not in any dropzone we need to notify the last dropzone it was in
        if (!isDraggedInADropZone && lastIsDraggedInADropZone && lastDropZoneFound) {
            dispatchDraggedElementLeftContainerForNone(lastDropZoneFound, draggedEl);
            lastDropZoneFound = undefined;
            lastIndexFound = undefined;
            lastIsDraggedInADropZone = false;
        } else {
            lastIsDraggedInADropZone = true;
        }
        next$1 = window.setTimeout(andNow, intervalMs);
    }
    andNow();
}

// assumption - we can only observe one dragged element at a time, this could be changed in the future
function unobserve() {
    clearTimeout(next$1);
    resetScrolling$1();
    resetIndexesCache();
}

const INTERVAL_MS = 300;
let mousePosition;

/**
 * Do not use this! it is visible for testing only until we get over the issue Cypress not triggering the mousemove listeners
 * // TODO - make private (remove export)
 * @param {{clientX: number, clientY: number}} e
 */
function updateMousePosition(e) {
    const c = e.touches ? e.touches[0] : e;
    mousePosition = {x: c.clientX, y: c.clientY};
}
const {scrollIfNeeded, resetScrolling} = makeScroller();
let next;

function loop() {
    if (mousePosition) {
        scrollIfNeeded(mousePosition, document.documentElement);
    }
    next = window.setTimeout(loop, INTERVAL_MS);
}

/**
 * will start watching the mouse pointer and scroll the window if it goes next to the edges
 */
function armWindowScroller() {
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("touchmove", updateMousePosition);
    loop();
}

/**
 * will stop watching the mouse pointer and won't scroll the window anymore
 */
function disarmWindowScroller() {
    window.removeEventListener("mousemove", updateMousePosition);
    window.removeEventListener("touchmove", updateMousePosition);
    mousePosition = undefined;
    window.clearTimeout(next);
    resetScrolling();
}

const TRANSITION_DURATION_SECONDS = 0.2;

/**
 * private helper function - creates a transition string for a property
 * @param {string} property
 * @return {string} - the transition string
 */
function trs(property) {
    return `${property} ${TRANSITION_DURATION_SECONDS}s ease`;
}
/**
 * clones the given element and applies proper styles and transitions to the dragged element
 * @param {HTMLElement} originalElement
 * @param {Point} [positionCenterOnXY]
 * @return {Node} - the cloned, styled element
 */
function createDraggedElementFrom(originalElement, positionCenterOnXY) {
    const rect = originalElement.getBoundingClientRect();
    const draggedEl = originalElement.cloneNode(true);
    copyStylesFromTo(originalElement, draggedEl);
    draggedEl.id = `dnd-action-dragged-el`;
    draggedEl.style.position = "fixed";
    let elTopPx = rect.top;
    let elLeftPx = rect.left;
    draggedEl.style.top = `${elTopPx}px`;
    draggedEl.style.left = `${elLeftPx}px`;
    if (positionCenterOnXY) {
        const center = findCenter(rect);
        elTopPx -= center.y - positionCenterOnXY.y;
        elLeftPx -= center.x - positionCenterOnXY.x;
        window.setTimeout(() => {
            draggedEl.style.top = `${elTopPx}px`;
            draggedEl.style.left = `${elLeftPx}px`;
        }, 0);
    }
    draggedEl.style.margin = "0";
    // we can't have relative or automatic height and width or it will break the illusion
    draggedEl.style.boxSizing = "border-box";
    draggedEl.style.height = `${rect.height}px`;
    draggedEl.style.width = `${rect.width}px`;
    draggedEl.style.transition = `${trs("top")}, ${trs("left")}, ${trs("background-color")}, ${trs("opacity")}, ${trs("color")} `;
    // this is a workaround for a strange browser bug that causes the right border to disappear when all the transitions are added at the same time
    window.setTimeout(() => (draggedEl.style.transition += `, ${trs("width")}, ${trs("height")}`), 0);
    draggedEl.style.zIndex = "9999";
    draggedEl.style.cursor = "grabbing";

    return draggedEl;
}

/**
 * styles the dragged element to a 'dropped' state
 * @param {HTMLElement} draggedEl
 */
function moveDraggedElementToWasDroppedState(draggedEl) {
    draggedEl.style.cursor = "grab";
}

/**
 * Morphs the dragged element style, maintains the mouse pointer within the element
 * @param {HTMLElement} draggedEl
 * @param {HTMLElement} copyFromEl - the element the dragged element should look like, typically the shadow element
 * @param {number} currentMouseX
 * @param {number} currentMouseY
 * @param {function} transformDraggedElement - function to transform the dragged element, does nothing by default.
 */
function morphDraggedElementToBeLike(draggedEl, copyFromEl, currentMouseX, currentMouseY, transformDraggedElement) {
    const newRect = copyFromEl.getBoundingClientRect();
    const draggedElRect = draggedEl.getBoundingClientRect();
    const widthChange = newRect.width - draggedElRect.width;
    const heightChange = newRect.height - draggedElRect.height;
    if (widthChange || heightChange) {
        const relativeDistanceOfMousePointerFromDraggedSides = {
            left: (currentMouseX - draggedElRect.left) / draggedElRect.width,
            top: (currentMouseY - draggedElRect.top) / draggedElRect.height
        };
        draggedEl.style.height = `${newRect.height}px`;
        draggedEl.style.width = `${newRect.width}px`;
        draggedEl.style.left = `${parseFloat(draggedEl.style.left) - relativeDistanceOfMousePointerFromDraggedSides.left * widthChange}px`;
        draggedEl.style.top = `${parseFloat(draggedEl.style.top) - relativeDistanceOfMousePointerFromDraggedSides.top * heightChange}px`;
    }

    /// other properties
    copyStylesFromTo(copyFromEl, draggedEl);
    transformDraggedElement();
}

/**
 * @param {HTMLElement} copyFromEl
 * @param {HTMLElement} copyToEl
 */
function copyStylesFromTo(copyFromEl, copyToEl) {
    const computedStyle = window.getComputedStyle(copyFromEl);
    Array.from(computedStyle)
        .filter(
            s =>
                s.startsWith("background") ||
                s.startsWith("padding") ||
                s.startsWith("font") ||
                s.startsWith("text") ||
                s.startsWith("align") ||
                s.startsWith("justify") ||
                s.startsWith("display") ||
                s.startsWith("flex") ||
                s.startsWith("border") ||
                s === "opacity" ||
                s === "color" ||
                s === "list-style-type"
        )
        .forEach(s => copyToEl.style.setProperty(s, computedStyle.getPropertyValue(s), computedStyle.getPropertyPriority(s)));
}

/**
 * makes the element compatible with being draggable
 * @param {HTMLElement} draggableEl
 * @param {boolean} dragDisabled
 */
function styleDraggable(draggableEl, dragDisabled) {
    draggableEl.draggable = false;
    draggableEl.ondragstart = () => false;
    if (!dragDisabled) {
        draggableEl.style.userSelect = "none";
        draggableEl.style.WebkitUserSelect = "none";
        draggableEl.style.cursor = "grab";
    } else {
        draggableEl.style.userSelect = "";
        draggableEl.style.WebkitUserSelect = "";
        draggableEl.style.cursor = "";
    }
}

/**
 * Hides the provided element so that it can stay in the dom without interrupting
 * @param {HTMLElement} dragTarget
 */
function hideOriginalDragTarget(dragTarget) {
    dragTarget.style.display = "none";
    dragTarget.style.position = "fixed";
    dragTarget.style.zIndex = "-5";
}

/**
 * styles the shadow element
 * @param {HTMLElement} shadowEl
 */
function decorateShadowEl(shadowEl) {
    shadowEl.style.visibility = "hidden";
    shadowEl.setAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME, "true");
}

/**
 * undo the styles the shadow element
 * @param {HTMLElement} shadowEl
 */
function unDecorateShadowElement(shadowEl) {
    shadowEl.style.visibility = "";
    shadowEl.removeAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
}

/**
 * will mark the given dropzones as visually active
 * @param {Array<HTMLElement>} dropZones
 * @param {Function} getStyles - maps a dropzone to a styles object (so the styles can be removed)
 * @param {Function} getClasses - maps a dropzone to a classList
 */
function styleActiveDropZones(dropZones, getStyles = () => {}, getClasses = () => []) {
    dropZones.forEach(dz => {
        const styles = getStyles(dz);
        Object.keys(styles).forEach(style => {
            dz.style[style] = styles[style];
        });
        getClasses(dz).forEach(c => dz.classList.add(c));
    });
}

/**
 * will remove the 'active' styling from given dropzones
 * @param {Array<HTMLElement>} dropZones
 * @param {Function} getStyles - maps a dropzone to a styles object
 * @param {Function} getClasses - maps a dropzone to a classList
 */
function styleInactiveDropZones(dropZones, getStyles = () => {}, getClasses = () => []) {
    dropZones.forEach(dz => {
        const styles = getStyles(dz);
        Object.keys(styles).forEach(style => {
            dz.style[style] = "";
        });
        getClasses(dz).forEach(c => dz.classList.contains(c) && dz.classList.remove(c));
    });
}

/**
 * will prevent the provided element from shrinking by setting its minWidth and minHeight to the current width and height values
 * @param {HTMLElement} el
 * @return {function(): void} - run this function to undo the operation and restore the original values
 */
function preventShrinking(el) {
    const originalMinHeight = el.style.minHeight;
    el.style.minHeight = window.getComputedStyle(el).getPropertyValue("height");
    const originalMinWidth = el.style.minWidth;
    el.style.minWidth = window.getComputedStyle(el).getPropertyValue("width");
    return function undo() {
        el.style.minHeight = originalMinHeight;
        el.style.minWidth = originalMinWidth;
    };
}

const DEFAULT_DROP_ZONE_TYPE$1 = "--any--";
const MIN_OBSERVATION_INTERVAL_MS = 100;
const MIN_MOVEMENT_BEFORE_DRAG_START_PX = 3;
const DEFAULT_DROP_TARGET_STYLE$1 = {
    outline: "rgba(255, 255, 102, 0.7) solid 2px"
};

let originalDragTarget;
let draggedEl;
let draggedElData;
let draggedElType;
let originDropZone;
let originIndex;
let shadowElData;
let shadowElDropZone;
let dragStartMousePosition;
let currentMousePosition;
let isWorkingOnPreviousDrag = false;
let finalizingPreviousDrag = false;
let unlockOriginDzMinDimensions;
let isDraggedOutsideOfAnyDz = false;

// a map from type to a set of drop-zones
const typeToDropZones$1 = new Map();
// important - this is needed because otherwise the config that would be used for everyone is the config of the element that created the event listeners
const dzToConfig$1 = new Map();
// this is needed in order to be able to cleanup old listeners and avoid stale closures issues (as the listener is defined within each zone)
const elToMouseDownListener = new WeakMap();

/* drop-zones registration management */
function registerDropZone$1(dropZoneEl, type) {
    if (!typeToDropZones$1.has(type)) {
        typeToDropZones$1.set(type, new Set());
    }
    if (!typeToDropZones$1.get(type).has(dropZoneEl)) {
        typeToDropZones$1.get(type).add(dropZoneEl);
        incrementActiveDropZoneCount();
    }
}
function unregisterDropZone$1(dropZoneEl, type) {
    typeToDropZones$1.get(type).delete(dropZoneEl);
    decrementActiveDropZoneCount();
    if (typeToDropZones$1.get(type).size === 0) {
        typeToDropZones$1.delete(type);
    }
}

/* functions to manage observing the dragged element and trigger custom drag-events */
function watchDraggedElement() {
    armWindowScroller();
    const dropZones = typeToDropZones$1.get(draggedElType);
    for (const dz of dropZones) {
        dz.addEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
        dz.addEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
        dz.addEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
    }
    window.addEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
    // it is important that we don't have an interval that is faster than the flip duration because it can cause elements to jump bach and forth
    const observationIntervalMs = Math.max(
        MIN_OBSERVATION_INTERVAL_MS,
        ...Array.from(dropZones.keys()).map(dz => dzToConfig$1.get(dz).dropAnimationDurationMs)
    );
    observe(draggedEl, dropZones, observationIntervalMs * 1.07);
}
function unWatchDraggedElement() {
    disarmWindowScroller();
    const dropZones = typeToDropZones$1.get(draggedElType);
    for (const dz of dropZones) {
        dz.removeEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
        dz.removeEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
        dz.removeEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
    }
    window.removeEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop$1);
    unobserve();
}

// finds the initial placeholder that is placed there on drag start
function findShadowPlaceHolderIdx(items) {
    return items.findIndex(item => item[ITEM_ID_KEY] === SHADOW_PLACEHOLDER_ITEM_ID);
}
function findShadowElementIdx(items) {
    // checking that the id is not the placeholder's for Dragula like usecases
    return items.findIndex(item => !!item[SHADOW_ITEM_MARKER_PROPERTY_NAME] && item[ITEM_ID_KEY] !== SHADOW_PLACEHOLDER_ITEM_ID);
}

/* custom drag-events handlers */
function handleDraggedEntered(e) {
    let {items, dropFromOthersDisabled} = dzToConfig$1.get(e.currentTarget);
    if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
        return;
    }
    isDraggedOutsideOfAnyDz = false;
    // this deals with another race condition. in rare occasions (super rapid operations) the list hasn't updated yet
    items = items.filter(item => item[ITEM_ID_KEY] !== shadowElData[ITEM_ID_KEY]);

    if (originDropZone !== e.currentTarget) {
        const originZoneItems = dzToConfig$1.get(originDropZone).items;
        const newOriginZoneItems = originZoneItems.filter(item => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
        dispatchConsiderEvent(originDropZone, newOriginZoneItems, {
            trigger: TRIGGERS.DRAGGED_ENTERED_ANOTHER,
            id: draggedElData[ITEM_ID_KEY],
            source: SOURCES.POINTER
        });
    } else {
        const shadowPlaceHolderIdx = findShadowPlaceHolderIdx(items);
        if (shadowPlaceHolderIdx !== -1) {
            items.splice(shadowPlaceHolderIdx, 1);
        }
    }

    const {index, isProximityBased} = e.detail.indexObj;
    const shadowElIdx = isProximityBased && index === e.currentTarget.children.length - 1 ? index + 1 : index;
    shadowElDropZone = e.currentTarget;
    items.splice(shadowElIdx, 0, shadowElData);
    dispatchConsiderEvent(e.currentTarget, items, {trigger: TRIGGERS.DRAGGED_ENTERED, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER});
}

function handleDraggedLeft(e) {
    const {items, dropFromOthersDisabled} = dzToConfig$1.get(e.currentTarget);
    if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
        return;
    }
    const shadowElIdx = findShadowElementIdx(items);
    const shadowItem = items.splice(shadowElIdx, 1)[0];
    shadowElDropZone = undefined;
    const {type, theOtherDz} = e.detail;
    if (
        type === DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY ||
        (type === DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER && theOtherDz !== originDropZone && dzToConfig$1.get(theOtherDz).dropFromOthersDisabled)
    ) {
        isDraggedOutsideOfAnyDz = true;
        shadowElDropZone = originDropZone;
        const originZoneItems = dzToConfig$1.get(originDropZone).items;
        originZoneItems.splice(originIndex, 0, shadowItem);
        dispatchConsiderEvent(originDropZone, originZoneItems, {
            trigger: TRIGGERS.DRAGGED_LEFT_ALL,
            id: draggedElData[ITEM_ID_KEY],
            source: SOURCES.POINTER
        });
    }
    // for the origin dz, when the dragged is outside of any, this will be fired in addition to the previous. this is for simplicity
    dispatchConsiderEvent(e.currentTarget, items, {
        trigger: TRIGGERS.DRAGGED_LEFT,
        id: draggedElData[ITEM_ID_KEY],
        source: SOURCES.POINTER
    });
}
function handleDraggedIsOverIndex(e) {
    const {items, dropFromOthersDisabled} = dzToConfig$1.get(e.currentTarget);
    if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
        return;
    }
    isDraggedOutsideOfAnyDz = false;
    const {index} = e.detail.indexObj;
    const shadowElIdx = findShadowElementIdx(items);
    items.splice(shadowElIdx, 1);
    items.splice(index, 0, shadowElData);
    dispatchConsiderEvent(e.currentTarget, items, {trigger: TRIGGERS.DRAGGED_OVER_INDEX, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER});
}

// Global mouse/touch-events handlers
function handleMouseMove(e) {
    e.preventDefault();
    const c = e.touches ? e.touches[0] : e;
    currentMousePosition = {x: c.clientX, y: c.clientY};
    draggedEl.style.transform = `translate3d(${currentMousePosition.x - dragStartMousePosition.x}px, ${
        currentMousePosition.y - dragStartMousePosition.y
    }px, 0)`;
}

function handleDrop$1() {
    finalizingPreviousDrag = true;
    // cleanup
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("touchmove", handleMouseMove);
    window.removeEventListener("mouseup", handleDrop$1);
    window.removeEventListener("touchend", handleDrop$1);
    unWatchDraggedElement();
    moveDraggedElementToWasDroppedState(draggedEl);

    if (!shadowElDropZone) {
        shadowElDropZone = originDropZone;
    }
    let {items, type} = dzToConfig$1.get(shadowElDropZone);
    styleInactiveDropZones(
        typeToDropZones$1.get(type),
        dz => dzToConfig$1.get(dz).dropTargetStyle,
        dz => dzToConfig$1.get(dz).dropTargetClasses
    );
    let shadowElIdx = findShadowElementIdx(items);
    // the handler might remove the shadow element, ex: dragula like copy on drag
    if (shadowElIdx === -1) shadowElIdx = originIndex;
    items = items.map(item => (item[SHADOW_ITEM_MARKER_PROPERTY_NAME] ? draggedElData : item));
    function finalizeWithinZone() {
        unlockOriginDzMinDimensions();
        dispatchFinalizeEvent(shadowElDropZone, items, {
            trigger: isDraggedOutsideOfAnyDz ? TRIGGERS.DROPPED_OUTSIDE_OF_ANY : TRIGGERS.DROPPED_INTO_ZONE,
            id: draggedElData[ITEM_ID_KEY],
            source: SOURCES.POINTER
        });
        if (shadowElDropZone !== originDropZone) {
            // letting the origin drop zone know the element was permanently taken away
            dispatchFinalizeEvent(originDropZone, dzToConfig$1.get(originDropZone).items, {
                trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
                id: draggedElData[ITEM_ID_KEY],
                source: SOURCES.POINTER
            });
        }
        unDecorateShadowElement(shadowElDropZone.children[shadowElIdx]);
        cleanupPostDrop();
    }
    animateDraggedToFinalPosition(shadowElIdx, finalizeWithinZone);
}

// helper function for handleDrop
function animateDraggedToFinalPosition(shadowElIdx, callback) {
    const shadowElRect = getBoundingRectNoTransforms(shadowElDropZone.children[shadowElIdx]);
    const newTransform = {
        x: shadowElRect.left - parseFloat(draggedEl.style.left),
        y: shadowElRect.top - parseFloat(draggedEl.style.top)
    };
    const {dropAnimationDurationMs} = dzToConfig$1.get(shadowElDropZone);
    const transition = `transform ${dropAnimationDurationMs}ms ease`;
    draggedEl.style.transition = draggedEl.style.transition ? draggedEl.style.transition + "," + transition : transition;
    draggedEl.style.transform = `translate3d(${newTransform.x}px, ${newTransform.y}px, 0)`;
    window.setTimeout(callback, dropAnimationDurationMs);
}

/* cleanup */
function cleanupPostDrop() {
    draggedEl.remove();
    originalDragTarget.remove();
    draggedEl = undefined;
    originalDragTarget = undefined;
    draggedElData = undefined;
    draggedElType = undefined;
    originDropZone = undefined;
    originIndex = undefined;
    shadowElData = undefined;
    shadowElDropZone = undefined;
    dragStartMousePosition = undefined;
    currentMousePosition = undefined;
    isWorkingOnPreviousDrag = false;
    finalizingPreviousDrag = false;
    unlockOriginDzMinDimensions = undefined;
    isDraggedOutsideOfAnyDz = false;
}

function dndzone$2(node, options) {
    const config = {
        items: undefined,
        type: undefined,
        flipDurationMs: 0,
        dragDisabled: false,
        dropFromOthersDisabled: false,
        dropTargetStyle: DEFAULT_DROP_TARGET_STYLE$1,
        dropTargetClasses: [],
        transformDraggedElement: () => {},
        centreDraggedOnCursor: false
    };
    let elToIdx = new Map();

    function addMaybeListeners() {
        window.addEventListener("mousemove", handleMouseMoveMaybeDragStart, {passive: false});
        window.addEventListener("touchmove", handleMouseMoveMaybeDragStart, {passive: false, capture: false});
        window.addEventListener("mouseup", handleFalseAlarm, {passive: false});
        window.addEventListener("touchend", handleFalseAlarm, {passive: false});
    }
    function removeMaybeListeners() {
        window.removeEventListener("mousemove", handleMouseMoveMaybeDragStart);
        window.removeEventListener("touchmove", handleMouseMoveMaybeDragStart);
        window.removeEventListener("mouseup", handleFalseAlarm);
        window.removeEventListener("touchend", handleFalseAlarm);
    }
    function handleFalseAlarm() {
        removeMaybeListeners();
        originalDragTarget = undefined;
        dragStartMousePosition = undefined;
        currentMousePosition = undefined;
    }

    function handleMouseMoveMaybeDragStart(e) {
        e.preventDefault();
        const c = e.touches ? e.touches[0] : e;
        currentMousePosition = {x: c.clientX, y: c.clientY};
        if (
            Math.abs(currentMousePosition.x - dragStartMousePosition.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX ||
            Math.abs(currentMousePosition.y - dragStartMousePosition.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX
        ) {
            removeMaybeListeners();
            handleDragStart();
        }
    }
    function handleMouseDown(e) {
        // on safari clicking on a select element doesn't fire mouseup at the end of the click and in general this makes more sense
        if (e.target !== e.currentTarget && (e.target.value !== undefined || e.target.isContentEditable)) {
            return;
        }
        // prevents responding to any button but left click which equals 0 (which is falsy)
        if (e.button) {
            return;
        }
        if (isWorkingOnPreviousDrag) {
            return;
        }
        e.stopPropagation();
        const c = e.touches ? e.touches[0] : e;
        dragStartMousePosition = {x: c.clientX, y: c.clientY};
        currentMousePosition = {...dragStartMousePosition};
        originalDragTarget = e.currentTarget;
        addMaybeListeners();
    }

    function handleDragStart() {
        isWorkingOnPreviousDrag = true;

        // initialising globals
        const currentIdx = elToIdx.get(originalDragTarget);
        originIndex = currentIdx;
        originDropZone = originalDragTarget.parentElement;
        const {items, type, centreDraggedOnCursor} = config;
        draggedElData = {...items[currentIdx]};
        draggedElType = type;
        shadowElData = {...draggedElData, [SHADOW_ITEM_MARKER_PROPERTY_NAME]: true};
        // The initial shadow element. We need a different id at first in order to avoid conflicts and timing issues
        const placeHolderElData = {...shadowElData, [ITEM_ID_KEY]: SHADOW_PLACEHOLDER_ITEM_ID};

        // creating the draggable element
        draggedEl = createDraggedElementFrom(originalDragTarget, centreDraggedOnCursor && currentMousePosition);
        // We will keep the original dom node in the dom because touch events keep firing on it, we want to re-add it after the framework removes it
        function keepOriginalElementInDom() {
            if (!draggedEl.parentElement) {
                document.body.appendChild(draggedEl);
                // to prevent the outline from disappearing
                draggedEl.focus();
                watchDraggedElement();
                hideOriginalDragTarget(originalDragTarget);
                document.body.appendChild(originalDragTarget);
            } else {
                window.requestAnimationFrame(keepOriginalElementInDom);
            }
        }
        window.requestAnimationFrame(keepOriginalElementInDom);

        styleActiveDropZones(
            Array.from(typeToDropZones$1.get(config.type)).filter(dz => dz === originDropZone || !dzToConfig$1.get(dz).dropFromOthersDisabled),
            dz => dzToConfig$1.get(dz).dropTargetStyle,
            dz => dzToConfig$1.get(dz).dropTargetClasses
        );

        // removing the original element by removing its data entry
        items.splice(currentIdx, 1, placeHolderElData);
        unlockOriginDzMinDimensions = preventShrinking(originDropZone);

        dispatchConsiderEvent(originDropZone, items, {trigger: TRIGGERS.DRAG_STARTED, id: draggedElData[ITEM_ID_KEY], source: SOURCES.POINTER});

        // handing over to global handlers - starting to watch the element
        window.addEventListener("mousemove", handleMouseMove, {passive: false});
        window.addEventListener("touchmove", handleMouseMove, {passive: false, capture: false});
        window.addEventListener("mouseup", handleDrop$1, {passive: false});
        window.addEventListener("touchend", handleDrop$1, {passive: false});
    }

    function configure({
        items = undefined,
        flipDurationMs: dropAnimationDurationMs = 0,
        type: newType = DEFAULT_DROP_ZONE_TYPE$1,
        dragDisabled = false,
        dropFromOthersDisabled = false,
        dropTargetStyle = DEFAULT_DROP_TARGET_STYLE$1,
        dropTargetClasses = [],
        transformDraggedElement = () => {},
        centreDraggedOnCursor = false
    }) {
        config.dropAnimationDurationMs = dropAnimationDurationMs;
        if (config.type && newType !== config.type) {
            unregisterDropZone$1(node, config.type);
        }
        config.type = newType;
        registerDropZone$1(node, newType);

        config.items = [...items];
        config.dragDisabled = dragDisabled;
        config.transformDraggedElement = transformDraggedElement;
        config.centreDraggedOnCursor = centreDraggedOnCursor;

        // realtime update for dropTargetStyle
        if (
            isWorkingOnPreviousDrag &&
            !finalizingPreviousDrag &&
            (!areObjectsShallowEqual(dropTargetStyle, config.dropTargetStyle) ||
                !areArraysShallowEqualSameOrder(dropTargetClasses, config.dropTargetClasses))
        ) {
            styleInactiveDropZones(
                [node],
                () => config.dropTargetStyle,
                () => dropTargetClasses
            );
            styleActiveDropZones(
                [node],
                () => dropTargetStyle,
                () => dropTargetClasses
            );
        }
        config.dropTargetStyle = dropTargetStyle;
        config.dropTargetClasses = [...dropTargetClasses];

        // realtime update for dropFromOthersDisabled
        if (isWorkingOnPreviousDrag && config.dropFromOthersDisabled !== dropFromOthersDisabled) {
            if (dropFromOthersDisabled) {
                styleInactiveDropZones(
                    [node],
                    dz => dzToConfig$1.get(dz).dropTargetStyle,
                    dz => dzToConfig$1.get(dz).dropTargetClasses
                );
            } else {
                styleActiveDropZones(
                    [node],
                    dz => dzToConfig$1.get(dz).dropTargetStyle,
                    dz => dzToConfig$1.get(dz).dropTargetClasses
                );
            }
        }
        config.dropFromOthersDisabled = dropFromOthersDisabled;

        dzToConfig$1.set(node, config);
        const shadowElIdx = findShadowElementIdx(config.items);
        for (let idx = 0; idx < node.children.length; idx++) {
            const draggableEl = node.children[idx];
            styleDraggable(draggableEl, dragDisabled);
            if (idx === shadowElIdx) {
                morphDraggedElementToBeLike(draggedEl, draggableEl, currentMousePosition.x, currentMousePosition.y, () =>
                    config.transformDraggedElement(draggedEl, draggedElData, idx)
                );
                decorateShadowEl(draggableEl);
                continue;
            }
            draggableEl.removeEventListener("mousedown", elToMouseDownListener.get(draggableEl));
            draggableEl.removeEventListener("touchstart", elToMouseDownListener.get(draggableEl));
            if (!dragDisabled) {
                draggableEl.addEventListener("mousedown", handleMouseDown);
                draggableEl.addEventListener("touchstart", handleMouseDown);
                elToMouseDownListener.set(draggableEl, handleMouseDown);
            }
            // updating the idx
            elToIdx.set(draggableEl, idx);
        }
    }
    configure(options);

    return {
        update: newOptions => {
            configure(newOptions);
        },
        destroy: () => {
            unregisterDropZone$1(node, config.type);
            dzToConfig$1.delete(node);
        }
    };
}

const INSTRUCTION_IDs$1 = {
    DND_ZONE_ACTIVE: "dnd-zone-active",
    DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
const ID_TO_INSTRUCTION = {
    [INSTRUCTION_IDs$1.DND_ZONE_ACTIVE]: "Tab to one the items and press space-bar or enter to start dragging it",
    [INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED]: "This is a disabled drag and drop list"
};

const ALERT_DIV_ID = "dnd-action-aria-alert";
let alertsDiv;

function initAriaOnBrowser() {
    // setting the dynamic alerts
    alertsDiv = document.createElement("div");
    (function initAlertsDiv() {
        alertsDiv.id = ALERT_DIV_ID;
        // tab index -1 makes the alert be read twice on chrome for some reason
        //alertsDiv.tabIndex = -1;
        alertsDiv.style.position = "fixed";
        alertsDiv.style.bottom = "0";
        alertsDiv.style.left = "0";
        alertsDiv.style.zIndex = "-5";
        alertsDiv.style.opacity = "0";
        alertsDiv.style.height = "0";
        alertsDiv.style.width = "0";
        alertsDiv.setAttribute("role", "alert");
    })();
    document.body.prepend(alertsDiv);

    // setting the instructions
    Object.entries(ID_TO_INSTRUCTION).forEach(([id, txt]) => document.body.prepend(instructionToHiddenDiv(id, txt)));
}

/**
 * Initializes the static aria instructions so they can be attached to zones
 * @return {{DND_ZONE_ACTIVE: string, DND_ZONE_DRAG_DISABLED: string} | null} - the IDs for static aria instruction (to be used via aria-describedby) or null on the server
 */
function initAria() {
    if (isOnServer) return null;
    if (document.readyState === "complete") {
        initAriaOnBrowser();
    } else {
        window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
    }
    return {...INSTRUCTION_IDs$1};
}
function instructionToHiddenDiv(id, txt) {
    const div = document.createElement("div");
    div.id = id;
    div.innerHTML = `<p>${txt}</p>`;
    div.style.display = "none";
    div.style.position = "fixed";
    div.style.zIndex = "-5";
    return div;
}

/**
 * Will make the screen reader alert the provided text to the user
 * @param {string} txt
 */
function alertToScreenReader(txt) {
    alertsDiv.innerHTML = "";
    const alertText = document.createTextNode(txt);
    alertsDiv.appendChild(alertText);
    // this is needed for Safari
    alertsDiv.style.display = "none";
    alertsDiv.style.display = "inline";
}

const DEFAULT_DROP_ZONE_TYPE = "--any--";
const DEFAULT_DROP_TARGET_STYLE = {
    outline: "rgba(255, 255, 102, 0.7) solid 2px"
};

let isDragging = false;
let draggedItemType;
let focusedDz;
let focusedDzLabel = "";
let focusedItem;
let focusedItemId;
let focusedItemLabel = "";
const allDragTargets = new WeakSet();
const elToKeyDownListeners = new WeakMap();
const elToFocusListeners = new WeakMap();
const dzToHandles = new Map();
const dzToConfig = new Map();
const typeToDropZones = new Map();

/* TODO (potentially)
 * what's the deal with the black border of voice-reader not following focus?
 * maybe keep focus on the last dragged item upon drop?
 */

const INSTRUCTION_IDs = initAria();

/* drop-zones registration management */
function registerDropZone(dropZoneEl, type) {
    if (typeToDropZones.size === 0) {
        window.addEventListener("keydown", globalKeyDownHandler);
        window.addEventListener("click", globalClickHandler);
    }
    if (!typeToDropZones.has(type)) {
        typeToDropZones.set(type, new Set());
    }
    if (!typeToDropZones.get(type).has(dropZoneEl)) {
        typeToDropZones.get(type).add(dropZoneEl);
        incrementActiveDropZoneCount();
    }
}
function unregisterDropZone(dropZoneEl, type) {
    if (focusedDz === dropZoneEl) {
        handleDrop();
    }
    typeToDropZones.get(type).delete(dropZoneEl);
    decrementActiveDropZoneCount();
    if (typeToDropZones.get(type).size === 0) {
        typeToDropZones.delete(type);
    }
    if (typeToDropZones.size === 0) {
        window.removeEventListener("keydown", globalKeyDownHandler);
        window.removeEventListener("click", globalClickHandler);
    }
}

function globalKeyDownHandler(e) {
    if (!isDragging) return;
    switch (e.key) {
        case "Escape": {
            handleDrop();
            break;
        }
    }
}

function globalClickHandler() {
    if (!isDragging) return;
    if (!allDragTargets.has(document.activeElement)) {
        handleDrop();
    }
}

function handleZoneFocus(e) {
    if (!isDragging) return;
    const newlyFocusedDz = e.currentTarget;
    if (newlyFocusedDz === focusedDz) return;

    focusedDzLabel = newlyFocusedDz.getAttribute("aria-label") || "";
    const {items: originItems} = dzToConfig.get(focusedDz);
    const originItem = originItems.find(item => item[ITEM_ID_KEY] === focusedItemId);
    const originIdx = originItems.indexOf(originItem);
    const itemToMove = originItems.splice(originIdx, 1)[0];
    const {items: targetItems, autoAriaDisabled} = dzToConfig.get(newlyFocusedDz);
    if (
        newlyFocusedDz.getBoundingClientRect().top < focusedDz.getBoundingClientRect().top ||
        newlyFocusedDz.getBoundingClientRect().left < focusedDz.getBoundingClientRect().left
    ) {
        targetItems.push(itemToMove);
        if (!autoAriaDisabled) {
            alertToScreenReader(`Moved item ${focusedItemLabel} to the end of the list ${focusedDzLabel}`);
        }
    } else {
        targetItems.unshift(itemToMove);
        if (!autoAriaDisabled) {
            alertToScreenReader(`Moved item ${focusedItemLabel} to the beginning of the list ${focusedDzLabel}`);
        }
    }
    const dzFrom = focusedDz;
    dispatchFinalizeEvent(dzFrom, originItems, {trigger: TRIGGERS.DROPPED_INTO_ANOTHER, id: focusedItemId, source: SOURCES.KEYBOARD});
    dispatchFinalizeEvent(newlyFocusedDz, targetItems, {trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD});
    focusedDz = newlyFocusedDz;
}

function triggerAllDzsUpdate() {
    dzToHandles.forEach(({update}, dz) => update(dzToConfig.get(dz)));
}

function handleDrop(dispatchConsider = true) {
    if (!dzToConfig.get(focusedDz).autoAriaDisabled) {
        alertToScreenReader(`Stopped dragging item ${focusedItemLabel}`);
    }
    if (allDragTargets.has(document.activeElement)) {
        document.activeElement.blur();
    }
    if (dispatchConsider) {
        dispatchConsiderEvent(focusedDz, dzToConfig.get(focusedDz).items, {
            trigger: TRIGGERS.DRAG_STOPPED,
            id: focusedItemId,
            source: SOURCES.KEYBOARD
        });
    }
    styleInactiveDropZones(
        typeToDropZones.get(draggedItemType),
        dz => dzToConfig.get(dz).dropTargetStyle,
        dz => dzToConfig.get(dz).dropTargetClasses
    );
    focusedItem = null;
    focusedItemId = null;
    focusedItemLabel = "";
    draggedItemType = null;
    focusedDz = null;
    focusedDzLabel = "";
    isDragging = false;
    triggerAllDzsUpdate();
}
//////
function dndzone$1(node, options) {
    const config = {
        items: undefined,
        type: undefined,
        dragDisabled: false,
        dropFromOthersDisabled: false,
        dropTargetStyle: DEFAULT_DROP_TARGET_STYLE,
        dropTargetClasses: [],
        autoAriaDisabled: false
    };

    function swap(arr, i, j) {
        if (arr.length <= 1) return;
        arr.splice(j, 1, arr.splice(i, 1, arr[j])[0]);
    }

    function handleKeyDown(e) {
        switch (e.key) {
            case "Enter":
            case " ": {
                // we don't want to affect nested input elements or clickable elements
                if ((e.target.disabled !== undefined || e.target.href || e.target.isContentEditable) && !allDragTargets.has(e.target)) {
                    return;
                }
                e.preventDefault(); // preventing scrolling on spacebar
                e.stopPropagation();
                if (isDragging) {
                    // TODO - should this trigger a drop? only here or in general (as in when hitting space or enter outside of any zone)?
                    handleDrop();
                } else {
                    // drag start
                    handleDragStart(e);
                }
                break;
            }
            case "ArrowDown":
            case "ArrowRight": {
                if (!isDragging) return;
                e.preventDefault(); // prevent scrolling
                e.stopPropagation();
                const {items} = dzToConfig.get(node);
                const children = Array.from(node.children);
                const idx = children.indexOf(e.currentTarget);
                if (idx < children.length - 1) {
                    if (!config.autoAriaDisabled) {
                        alertToScreenReader(`Moved item ${focusedItemLabel} to position ${idx + 2} in the list ${focusedDzLabel}`);
                    }
                    swap(items, idx, idx + 1);
                    dispatchFinalizeEvent(node, items, {trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD});
                }
                break;
            }
            case "ArrowUp":
            case "ArrowLeft": {
                if (!isDragging) return;
                e.preventDefault(); // prevent scrolling
                e.stopPropagation();
                const {items} = dzToConfig.get(node);
                const children = Array.from(node.children);
                const idx = children.indexOf(e.currentTarget);
                if (idx > 0) {
                    if (!config.autoAriaDisabled) {
                        alertToScreenReader(`Moved item ${focusedItemLabel} to position ${idx} in the list ${focusedDzLabel}`);
                    }
                    swap(items, idx, idx - 1);
                    dispatchFinalizeEvent(node, items, {trigger: TRIGGERS.DROPPED_INTO_ZONE, id: focusedItemId, source: SOURCES.KEYBOARD});
                }
                break;
            }
        }
    }
    function handleDragStart(e) {
        setCurrentFocusedItem(e.currentTarget);
        focusedDz = node;
        draggedItemType = config.type;
        isDragging = true;
        const dropTargets = Array.from(typeToDropZones.get(config.type)).filter(dz => dz === focusedDz || !dzToConfig.get(dz).dropFromOthersDisabled);
        styleActiveDropZones(
            dropTargets,
            dz => dzToConfig.get(dz).dropTargetStyle,
            dz => dzToConfig.get(dz).dropTargetClasses
        );
        if (!config.autoAriaDisabled) {
            let msg = `Started dragging item ${focusedItemLabel}. Use the arrow keys to move it within its list ${focusedDzLabel}`;
            if (dropTargets.length > 1) {
                msg += `, or tab to another list in order to move the item into it`;
            }
            alertToScreenReader(msg);
        }
        dispatchConsiderEvent(node, dzToConfig.get(node).items, {trigger: TRIGGERS.DRAG_STARTED, id: focusedItemId, source: SOURCES.KEYBOARD});
        triggerAllDzsUpdate();
    }

    function handleClick(e) {
        if (!isDragging) return;
        if (e.currentTarget === focusedItem) return;
        e.stopPropagation();
        handleDrop(false);
        handleDragStart(e);
    }
    function setCurrentFocusedItem(draggableEl) {
        const {items} = dzToConfig.get(node);
        const children = Array.from(node.children);
        const focusedItemIdx = children.indexOf(draggableEl);
        focusedItem = draggableEl;
        focusedItem.tabIndex = 0;
        focusedItemId = items[focusedItemIdx][ITEM_ID_KEY];
        focusedItemLabel = children[focusedItemIdx].getAttribute("aria-label") || "";
    }

    function configure({
        items = [],
        type: newType = DEFAULT_DROP_ZONE_TYPE,
        dragDisabled = false,
        dropFromOthersDisabled = false,
        dropTargetStyle = DEFAULT_DROP_TARGET_STYLE,
        dropTargetClasses = [],
        autoAriaDisabled = false
    }) {
        config.items = [...items];
        config.dragDisabled = dragDisabled;
        config.dropFromOthersDisabled = dropFromOthersDisabled;
        config.dropTargetStyle = dropTargetStyle;
        config.dropTargetClasses = dropTargetClasses;
        config.autoAriaDisabled = autoAriaDisabled;
        if (!autoAriaDisabled) {
            node.setAttribute("aria-disabled", dragDisabled);
            node.setAttribute("role", "list");
            node.setAttribute("aria-describedby", dragDisabled ? INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED : INSTRUCTION_IDs.DND_ZONE_ACTIVE);
        }
        if (config.type && newType !== config.type) {
            unregisterDropZone(node, config.type);
        }
        config.type = newType;
        registerDropZone(node, newType);
        dzToConfig.set(node, config);

        node.tabIndex =
            isDragging &&
            (node === focusedDz ||
                focusedItem.contains(node) ||
                config.dropFromOthersDisabled ||
                (focusedDz && config.type !== dzToConfig.get(focusedDz).type))
                ? -1
                : 0;
        node.addEventListener("focus", handleZoneFocus);

        for (let i = 0; i < node.children.length; i++) {
            const draggableEl = node.children[i];
            allDragTargets.add(draggableEl);
            draggableEl.tabIndex = isDragging ? -1 : 0;
            if (!autoAriaDisabled) {
                draggableEl.setAttribute("role", "listitem");
            }
            draggableEl.removeEventListener("keydown", elToKeyDownListeners.get(draggableEl));
            draggableEl.removeEventListener("click", elToFocusListeners.get(draggableEl));
            if (!dragDisabled) {
                draggableEl.addEventListener("keydown", handleKeyDown);
                elToKeyDownListeners.set(draggableEl, handleKeyDown);
                draggableEl.addEventListener("click", handleClick);
                elToFocusListeners.set(draggableEl, handleClick);
            }
            if (isDragging && config.items[i][ITEM_ID_KEY] === focusedItemId) {
                // if it is a nested dropzone, it was re-rendered and we need to refresh our pointer
                focusedItem = draggableEl;
                focusedItem.tabIndex = 0;
                // without this the element loses focus if it moves backwards in the list
                draggableEl.focus();
            }
        }
    }
    configure(options);

    const handles = {
        update: newOptions => {
            configure(newOptions);
        },
        destroy: () => {
            unregisterDropZone(node, config.type);
            dzToConfig.delete(node);
            dzToHandles.delete(node);
        }
    };
    dzToHandles.set(node, handles);
    return handles;
}

/**
 * A custom action to turn any container to a dnd zone and all of its direct children to draggables
 * Supports mouse, touch and keyboard interactions.
 * Dispatches two events that the container is expected to react to by modifying its list of items,
 * which will then feed back in to this action via the update function
 *
 * @typedef {object} Options
 * @property {array} items - the list of items that was used to generate the children of the given node (the list used in the #each block
 * @property {string} [type] - the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type
 * @property {number} [flipDurationMs] - if the list animated using flip (recommended), specifies the flip duration such that everything syncs with it without conflict, defaults to zero
 * @property {boolean} [dragDisabled]
 * @property {boolean} [dropFromOthersDisabled]
 * @property {object} [dropTargetStyle]
 * @property {string[]} [dropTargetClasses]
 * @property {function} [transformDraggedElement]
 * @param {HTMLElement} node - the element to enhance
 * @param {Options} options
 * @return {{update: function, destroy: function}}
 */
function dndzone(node, options) {
    validateOptions(options);
    const pointerZone = dndzone$2(node, options);
    const keyboardZone = dndzone$1(node, options);
    return {
        update: newOptions => {
            validateOptions(newOptions);
            pointerZone.update(newOptions);
            keyboardZone.update(newOptions);
        },
        destroy: () => {
            pointerZone.destroy();
            keyboardZone.destroy();
        }
    };
}

function validateOptions(options) {
    /*eslint-disable*/
    const {
        items,
        flipDurationMs,
        type,
        dragDisabled,
        dropFromOthersDisabled,
        dropTargetStyle,
        dropTargetClasses,
        transformDraggedElement,
        autoAriaDisabled,
        centreDraggedOnCursor,
        ...rest
    } = options;
    /*eslint-enable*/
    if (Object.keys(rest).length > 0) {
        console.warn(`dndzone will ignore unknown options`, rest);
    }
    if (!items) {
        throw new Error("no 'items' key provided to dndzone");
    }
    const itemWithMissingId = items.find(item => !{}.hasOwnProperty.call(item, ITEM_ID_KEY));
    if (itemWithMissingId) {
        throw new Error(`missing '${ITEM_ID_KEY}' property for item ${toString(itemWithMissingId)}`);
    }
    if (dropTargetClasses && !Array.isArray(dropTargetClasses)) {
        throw new Error(`dropTargetClasses should be an array but instead it is a ${typeof dropTargetClasses}, ${toString(dropTargetClasses)}`);
    }
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

function flip(node, animation, params = {}) {
    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;
    const scaleX = animation.from.width / node.clientWidth;
    const scaleY = animation.from.height / node.clientHeight;
    const dx = (animation.from.left - animation.to.left) / scaleX;
    const dy = (animation.from.top - animation.to.top) / scaleY;
    const d = Math.sqrt(dx * dx + dy * dy);
    const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
    return {
        delay,
        duration: is_function(duration) ? duration(d) : duration,
        easing,
        css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
    };
}

export { createPopperActions as c, dndzone as d, flip as f };
//# sourceMappingURL=index-830442f8.js.map
