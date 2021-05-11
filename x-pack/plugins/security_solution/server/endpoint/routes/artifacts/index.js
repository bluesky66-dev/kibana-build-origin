"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _download_artifact = require("./download_artifact");

Object.keys(_download_artifact).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _download_artifact[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _download_artifact[key];
    }
  });
});