# Roller

Roller is a JavaScript class for rolling on a web page.

* **Plain JavaScript** - this class hasn't dependencies on external libraries, just plain JS;
* **IE9+ supports** - It works on IE9 and above;
* **Behavioral pattern** - It use this pattern, so you don't need to pass DOM-elements to the constructor;
* **Recalculates after resizing supports** - It can recalculates coordinates after [window resizing](#resized).

**Note** this class only emits event (the default name is "rolling") type [CustomEvent](https://dom.spec.whatwg.org/#interface-customevent) on element (the default element is `document`). [The event object](https://dom.spec.whatwg.org/#dom-customevent-detail) contains a reference to the element that is currently active. For more details see [the example] (./example/index.html) and [settings](#settings).

## Usage

Add the script to a page, initialize the class and attach a handler to the event "rolling". For example:

```html
<script src="../dist/roller.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    var roller = new Roller();

    document.addEventListener("rolling", handler);

    roller.init();

    function handler(event) {
      var link      = event.detail.link;
      var className = "active";

      resetClass(className);
      if (link) {
        link.classList.add(className);
      }
    }

    function resetClass(className) {
      var links = document.querySelectorAll("a");

      Array.prototype.forEach.call(links, function(link) {
        link.classList.remove(className);
      });
    }
  });
</script>
```

**Note method "init" calculates coordinates of the "rolling" areas**. For more details see [below] (#loading).

You need to associate the link with the "rolling" area through attributes `data-roller-area` and `data-roller-link`:

```html
<ul>
  <li><a href="#sec" data-roller-link="item1">list item</a></li>
</ul>
...
<section id="sec" data-roller-area="item1">section</section>
```

`document` will emits "rolling" event. You may change this emitted element via attribute `data-roller-where`:

```html
<ul data-roller-where>
  <li><a href="#sec" data-roller-link="item1">list item</a></li>
</ul>
...
<section id="sec" data-roller-area="item1">section</section>
```

Now `UL` element will emit the event.

## <a name="settings"></a>API and options

**API**:
* `init()` - Initialization method. For more details see [below] (#loading);
* `resized` - It has `null` before the initialization of the class. It has `true` If there was resizing window, else `false`.

**Constructor options**:
* `attributeLink` - string the attribute name for the link. Default: `"data-roller-link"`;
* `attributeArea` - string the attribute name for the area. Default: `"data-roller-area"`;
* `attributeWhere` - string the attribute name for the emitted element. Default: `"data-roller-where"`;
* `nameEvent` - the name of emitted event. Default: `"rolling"`.

**Event**:
* `detail.name` - the name of the current area. You specified this name into the attributtes `"data-roller-area"` and `"data-roller-link"`;
* `detail.link` - the current link. This element has the attribute `"data-roller-link"`;
* `detail.area` - the current area. This element has the attribute `"data-roller-area"`.

**Note** these properties will be `null` If the current area isn't "rolling" area (hasn't attribute `data-roller-area`)! See (example)[./example/index.html].

## <a name="loading"></a>When I initialize the class?

If you have pictures that affect the height of the areas that at the time of the event `DOMContentLoaded` the pictures still won't load! You can use `window.onload` or similar function:

```js
...
resourcesLoaded(document.querySelectorAll("img"), function() {
  roller.init();
});

function resourcesLoaded(resources, callback) {
  var loaded = 0;
  var count  = resources.length;

  Array.prototype.forEach.call(resources, function(item) {
    item.addEventListener("load", onload, false);
  });

  function onload(event) {
    if (++loaded === count) {
      callback();
    }
  }
};
```

## <a name="resized"></a>Resized example

If you want the class recalculate the coordinates after each resizing window that you may attach handler on `resize` event:

```js
...
var handlerResized = throttle(function() {
  roller.resized = true;
}, 500);

window.addEventListener("resize", handlerResized);

function throttle(doSomething, ms) {
  var running = false;

  return function() {
    if (running) {
      return;
    }

    var self = this;
    var args = arguments;

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(step);
    } else {
      step();
    }

    function step() {
      running = true;
      doSomething.apply(self, args);
      setTimeout(function() {
        running = false;
      }, ms);
    }
  };
};
```

## <a name="building"></a>Building

Run this command after cloning the repository from the cloned folder:

```sh
npm run build
```

## License

[MIT](./LICENSE)

Copyright © Selkin Vitaly, 2015
