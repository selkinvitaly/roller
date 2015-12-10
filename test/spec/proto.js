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

}(window.Roller));
