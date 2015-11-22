"use strict";

module.exports = function() {
  try {
    new CustomEvent("IE has CustomEvent, but doesn't support constructor");
  } catch (e) {
    window.CustomEvent = function(nameEvent, options) {
      options = options || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      var event = document.createEvent("CustomEvent");

      event.initCustomEvent(nameEvent, options.bubbles, options.cancelable, options.detail);
      return event;
    };
    window.CustomEvent.prototype = Object.create(window.Event.prototype);
  }
};
