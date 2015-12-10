// =================================================
// Roller class. This class has the following public API:
//    - [method] "init" - initializes scrolling areas and attaches handler;
//    - [getter and setter] "resized" - necessary to recalculate the coordinates after window resizing;
// =================================================

"use strict";

module.exports = function(options) {
  // private
  var nameEvent       = options && options.nameEvent || "rolling";
  var attributeArea   = options && options.attributeArea || "data-roller-area";
  var attributeLink   = options && options.attributeLink || "data-roller-link";
  var attributeWhere  = options && options.attributeWhere || "data-roller-where";
  var elements        = {};
  var currentNameArea = null; // the name of the current area
  var lastNameArea    = null; // this property is required, because "_noRollingAreaHandler" will be generate the double "change" event
  var where           = null; // DOM element that will emit the event
  var resized         = null;
  var self            = this;

  // public
  this.init = function() {
    self._findRollingElements(elements, attributeArea, attributeLink);
    _findWhereElement();
    document.addEventListener("scroll", _noRollingAreaHandler, false);
  };

  // getter and setter
  Object.defineProperty(this, "resized", {
    get: function() {
      return resized;
    },
    set: function(bool) {
      resized = bool;
    }
  });

  // private
  // this method looks up DOM element that will emit the event and saves it
  function _findWhereElement() {
    var element = document.querySelector("[" + attributeWhere + "]");

    where = element ? element : document;
  }

  // private
  // this method handles the scrolling on "norolling" areas
  function _noRollingAreaHandler() {
    self._checkCalculated(elements);
    lastNameArea = currentNameArea; // cached the name of the last area. It's required for fix the double event "change"

    if ((currentNameArea = self._getNameCurrentArea(elements)) !== null) { // change area
      document.removeEventListener("scroll", _noRollingAreaHandler, false);
      document.addEventListener("scroll", _rollingAreaHandler, false);
      _rollingAreaHandler();
      self._emitEvent(nameEvent, currentNameArea, elements, where);
    } else { // It's still "norolling" area or transition "rolling -> norolling"
      if (lastNameArea !== null) { // check transition "rolling -> norolling"
        self._emitEvent(nameEvent, currentNameArea, elements, where);
      }
    }
  }

  // private
  // this method handles the scrolling on "rolling" areas
  function _rollingAreaHandler() {
    self._checkCalculated(elements);

    var scroll = window.pageYOffset;
    var top    = elements[currentNameArea].pageY.top; // top coordinate of the current area
    var bottom = elements[currentNameArea].pageY.bottom; // bottom coordinate of the current area

    if (scroll >= top && scroll < bottom) { // It's still the current area
      return;
    }
    // change area
    document.removeEventListener("scroll", _rollingAreaHandler, false);
    document.addEventListener("scroll", _noRollingAreaHandler, false);
    _noRollingAreaHandler();
  }
};

// protected
// this method needs to emit event in the outer API
module.exports.prototype._emitEvent = function(nameEvent, currentNameArea, elements, where) {
  var link  = (currentNameArea !== null) ? elements[currentNameArea].link : null;
  var area  = (currentNameArea !== null) ? elements[currentNameArea].area : null;
  var event = new CustomEvent(nameEvent, {
    detail: {
      link: link,
      area: area,
      name: currentNameArea
    },
    bubbles: true
  });

  where.dispatchEvent(event);
};

// protected
// this method calculates all coordinates (if there was changing the window or this is the stage of initialization)
module.exports.prototype._checkCalculated = function(elements) {
  var resized = this.resized;

  if (resized || resized === null) {
    this._calcAllCoordinates(elements);
    this.resized = true;
  }
};

// protected
// this method determines the name of the current area in the object of elements
// return null if the current area is an "norolling" area
module.exports.prototype._getNameCurrentArea = function(elements) {
  var scroll = window.pageYOffset;

  for (var name in elements) {
    var element = elements[name];

    if (scroll >= element.pageY.top && scroll < element.pageY.bottom) {
      return name;
    }
  }
  return null;
};

// protected
// this method calculates coordinates of areas and saves them
module.exports.prototype._calcAllCoordinates = function(elements) {
  var scroll = window.pageYOffset;

  for (var name in elements) {
    var element = elements[name];
    var area    = element.area;
    var rect    = area.getBoundingClientRect();

    element.pageY = {
      top: rect.top + scroll,
      bottom: rect.bottom + scroll
    };
  }
};

// protected
// this method looks up "rolling" elements at initialization and saves them
module.exports.prototype._findRollingElements = function(elements, attributeArea, attributeLink) {
  var forEach = Array.prototype.forEach;
  var areas   = document.querySelectorAll("[" + attributeArea + "]");
  var links   = document.querySelectorAll("[" + attributeLink + "]");

  forEach.call(areas, function(area) {
    var nameArea = area.getAttribute(attributeArea);

    for (var i = 0; i < links.length; i++) {
      var link     = links[i];
      var nameLink = link.getAttribute(attributeLink);

      if (nameLink === nameArea) {
        elements[nameArea] = {
          area: area,
          link: link
        };
        break;
      }
    }
  });
};
