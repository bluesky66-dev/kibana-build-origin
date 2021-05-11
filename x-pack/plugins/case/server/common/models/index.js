"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commentable_case = require("./commentable_case");

Object.keys(_commentable_case).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _commentable_case[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _commentable_case[key];
    }
  });
});