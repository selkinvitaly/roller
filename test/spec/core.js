"use strict";

;(function(Roller) {

  describe("Basic requirements", function() {

    let roller;

    beforeAll(function() {
      roller = new Roller();
    });

    it("has getter \"resized\"", function() {
      expect(roller.resized).toBeDefined();
    });

    it("has init method", function() {
      expect(roller.init).toBeDefined();
    });

    it("initial value for the resized flag is null", function() {
      expect(roller.resized).toBeNull();
    });

  });

}(window.Roller));
