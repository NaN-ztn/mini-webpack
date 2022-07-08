(function (modules) { function require(id) { const [fn, mapping] = modules[id]; const module = { exports: {}, };
function localeRequire(filePath) { const id = mapping[filePath]; return require(id); } fn(localeRequire, module,
module.exports); return module.exports; } require(1); })({  "1":[function(require,module,exports){ "use strict";

var _foo = require("./foo.js");

var _user = require("./user.json");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function main() {
  console.log('main');
  console.log(_user2.default);
}

(0, _foo.foo)();
main(); },{"./foo.js":2,"./user.json":3}],  "2":[function(require,module,exports){ "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

function foo() {
  (0, _bar.bar)();
  console.log('foo');
} },{"./bar.js":4}],  "3":[function(require,module,exports){ "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\r\n  \"user\": \"1111\",\r\n  \"password\": \"asdf\"\r\n}"; },{}],  "4":[function(require,module,exports){ "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log('bar');
} },{}],  });
