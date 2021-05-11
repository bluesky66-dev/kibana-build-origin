"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  MatrixHistogramQuery: true,
  MatrixHistogramType: true
};
exports.MatrixHistogramType = exports.MatrixHistogramQuery = void 0;

var _alerts = require("./alerts");

Object.keys(_alerts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alerts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alerts[key];
    }
  });
});

var _anomalies = require("./anomalies");

Object.keys(_anomalies).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _anomalies[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _anomalies[key];
    }
  });
});

var _authentications = require("./authentications");

Object.keys(_authentications).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _authentications[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authentications[key];
    }
  });
});

var _common = require("./common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});

var _dns = require("./dns");

Object.keys(_dns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _dns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dns[key];
    }
  });
});

var _events = require("./events");

Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _events[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MatrixHistogramQuery = 'matrixHistogram';
exports.MatrixHistogramQuery = MatrixHistogramQuery;
let MatrixHistogramType;
exports.MatrixHistogramType = MatrixHistogramType;

(function (MatrixHistogramType) {
  MatrixHistogramType["authentications"] = "authentications";
  MatrixHistogramType["anomalies"] = "anomalies";
  MatrixHistogramType["events"] = "events";
  MatrixHistogramType["alerts"] = "alerts";
  MatrixHistogramType["dns"] = "dns";
})(MatrixHistogramType || (exports.MatrixHistogramType = MatrixHistogramType = {}));