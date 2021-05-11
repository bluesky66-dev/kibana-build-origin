"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _services = require("../../../test/common/services");

Object.keys(_services).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _services[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _services[key];
    }
  });
});