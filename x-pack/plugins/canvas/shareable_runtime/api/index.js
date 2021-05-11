"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("whatwg-fetch");

require("jquery");

require("@kbn/ui-shared-deps/flot_charts");

var _shareable = require("./shareable");

Object.keys(_shareable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _shareable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _shareable[key];
    }
  });
});