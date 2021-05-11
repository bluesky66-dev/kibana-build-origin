"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _upload_license = require("./upload_license");

Object.keys(_upload_license).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _upload_license[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _upload_license[key];
    }
  });
});