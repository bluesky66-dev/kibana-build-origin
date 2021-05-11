"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getBuiltinRules: true
};
Object.defineProperty(exports, "getBuiltinRules", {
  enumerable: true,
  get: function () {
    return _builtin_rules.getBuiltinRules;
  }
});

var _message = require("./message");

Object.keys(_message).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _message[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _message[key];
    }
  });
});

var _builtin_rules = require("./builtin_rules");