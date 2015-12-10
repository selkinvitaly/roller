"use strict";

;(function(Roller) {

  let roller = new Roller();

  // Roller.prototype._emitEvent()
  describe("Method _emitEvent", function() {

    it("emits the CustomEvent type via dispatchEvent", function() {
      let link     = document.createElement("div");
      let area     = document.createElement("div");
      let elements = {
        nameArea: {
          link: link,
          area: area
        }
      };

      spyOn(document, "dispatchEvent");

      roller._emitEvent("rolling", "nameArea", elements, document);

      expect(document.dispatchEvent).toHaveBeenCalled();
      expect(document.dispatchEvent).toHaveBeenCalledWith(jasmine.objectContaining({
        detail: {
          link: link,
          area: area,
          name: "nameArea"
        },
        bubbles: true
      }));
    });

  });

  // Roller.prototype._checkCalculated()
  describe("Method _checkCalculated", function() {

    it("calls the method _calcAllCoordinates and sets the resized flag", function() {
      let elements = {};

      spyOn(roller, "_calcAllCoordinates");

      roller._checkCalculated(elements);

      expect(roller.resized).toBe(true);
      expect(roller._calcAllCoordinates).toHaveBeenCalledWith(elements);
    });

  });

  // Roller.prototype._getNameCurrentArea()
  describe("Method _getNameCurrentArea", function() {

    it("returns the current name of the area", function() {
      let elements = {
        nameArea: {
          pageY: {
            top: 0,
            bottom: 100
          }
        }
      };

      let name = roller._getNameCurrentArea(elements);

      expect(name).toBe("nameArea");
    });

    it("doesn't return the current name of the area", function() {
      let elements  = {
        nameArea: {
          pageY: {
            top: 0,
            bottom: 0
          }
        }
      };
      let elements2 = {
        nameArea: {
          pageY: {
            top: 1,
            bottom: 100
          }
        }
      };

      let name  = roller._getNameCurrentArea(elements);
      let name2 = roller._getNameCurrentArea(elements2);

      expect(name).toBeNull();
      expect(name2).toBeNull();
    });

  });

  // Roller.prototype._calcAllCoordinates()
  describe("Method _calcAllCoordinates", function() {
    let append, remove;

    beforeAll(function() {

      append = function() {
        let args = Array.prototype.slice.apply(arguments);

        args.forEach((elem) => document.body.appendChild(elem));
      };

      remove = function() {
        let args = Array.prototype.slice.apply(arguments);

        args.forEach((elem) => document.body.removeChild(elem));
      };

    });

    it("calculates all coordinates", function() {
      let area  = document.createElement("div");
      let area2 = document.createElement("div");
      let elements = {
        nameArea: {
          area: area
        },
        nameArea2: {
          area: area2
        }
      };

      append(area, area2);
      roller._calcAllCoordinates(elements);

      expect(elements.nameArea.pageY).toBeDefined();
      expect(elements.nameArea2.pageY).toBeDefined();

      remove(area, area2);
    });

  });

  // Roller.prototype._findRollingElements()
  describe("Method _findRollingElements", function() {
    let append, remove;

    beforeAll(function() {

      append = function() {
        let args = Array.prototype.slice.apply(arguments);

        args.forEach((elem) => document.body.appendChild(elem));
      };

      remove = function() {
        let args = Array.prototype.slice.apply(arguments);

        args.forEach((elem) => document.body.removeChild(elem));
      };

    });

    it("finds elements in DOM", function() {
      let elements = {};
      let area     = document.createElement("div");
      let link     = document.createElement("a");
      let area2    = document.createElement("div");
      let link2    = document.createElement("a");

      area.setAttribute("data-roller-area", "area");
      link.setAttribute("data-roller-link", "area");
      area2.setAttribute("data-roller-area", "area2");
      link2.setAttribute("data-roller-link", "area2");

      append(area, area2, link, link2);

      roller._findRollingElements(elements, "data-roller-area", "data-roller-link");

      expect(elements.area.area).toBeDefined();
      expect(elements.area.link).toBeDefined();
      expect(elements.area2.area).toBeDefined();
      expect(elements.area2.link).toBeDefined();

      remove(area, area2, link, link2);
    });

  });

}(window.Roller));
