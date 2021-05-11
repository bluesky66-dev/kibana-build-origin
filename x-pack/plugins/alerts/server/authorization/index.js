"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alerts_authorization = require("./alerts_authorization");

Object.keys(_alerts_authorization).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _alerts_authorization[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerts_authorization[key];
    }
  });
});

var _alerts_authorization_kuery = require("./alerts_authorization_kuery");

Object.keys(_alerts_authorization_kuery).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _alerts_authorization_kuery[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerts_authorization_kuery[key];
    }
  });
});