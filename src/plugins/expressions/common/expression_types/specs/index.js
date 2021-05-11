"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  typeSpecs: true
};
exports.typeSpecs = void 0;

var _boolean = require("./boolean");

Object.keys(_boolean).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _boolean[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _boolean[key];
    }
  });
});

var _datatable = require("./datatable");

Object.keys(_datatable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _datatable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _datatable[key];
    }
  });
});

var _error = require("./error");

Object.keys(_error).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _error[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _error[key];
    }
  });
});

var _filter = require("./filter");

Object.keys(_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _filter[key];
    }
  });
});

var _image = require("./image");

Object.keys(_image).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _image[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _image[key];
    }
  });
});

var _null = require("./null");

Object.keys(_null).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _null[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _null[key];
    }
  });
});

var _num = require("./num");

Object.keys(_num).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _num[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _num[key];
    }
  });
});

var _number = require("./number");

Object.keys(_number).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _number[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _number[key];
    }
  });
});

var _pointseries = require("./pointseries");

Object.keys(_pointseries).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _pointseries[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pointseries[key];
    }
  });
});

var _range = require("./range");

Object.keys(_range).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _range[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _range[key];
    }
  });
});

var _render = require("./render");

Object.keys(_render).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _render[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _render[key];
    }
  });
});

var _shape = require("./shape");

Object.keys(_shape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _shape[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _shape[key];
    }
  });
});

var _string = require("./string");

Object.keys(_string).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _string[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _string[key];
    }
  });
});

var _style = require("./style");

Object.keys(_style).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _style[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _style[key];
    }
  });
});

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const typeSpecs = [_boolean.boolean, _datatable.datatable, _error.error, _filter.filter, _image.image, _null.nullType, _num.num, _number.number, _pointseries.pointseries, _range.range, _render.render, _shape.shape, _string.string, _style.style];
exports.typeSpecs = typeSpecs;