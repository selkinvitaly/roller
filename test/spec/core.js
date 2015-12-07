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

  });

}(window.Roller));
