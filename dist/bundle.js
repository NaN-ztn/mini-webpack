(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];
    const module = { exports: {} };
    function localeRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }
    fn(localeRequire, module, module.exports);
    return module.exports;
  }
  require(1);
})({
  1: [
    function (require, module, exports) {
      'use strict';

      var _foo = require('./foo.js');

      function main() {
        console.log('main');
      }

      (0, _foo.foo)();
      main();
    },
    { './foo.js': 2 },
  ],
  2: [
    function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.foo = foo;

      var _bar = require('./bar.js');

      function foo() {
        (0, _bar.bar)();
        console.log('foo');
      }
    },
    { './bar.js': 3 },
  ],
  3: [
    function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.bar = bar;

      function bar() {
        console.log('bar');
      }
    },
    {},
  ],
});
