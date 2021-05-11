"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _download_artifact_schema = require("./download_artifact_schema");

Object.keys(_download_artifact_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _download_artifact_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _download_artifact_schema[key];
    }
  });
});