"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alerts_client = require("./alerts_client");

Object.keys(_alerts_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _alerts_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerts_client[key];
    }
  });
});