"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _metrics_hosts_anomalies = require("./metrics_hosts_anomalies");

Object.keys(_metrics_hosts_anomalies).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _metrics_hosts_anomalies[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _metrics_hosts_anomalies[key];
    }
  });
});

var _metrics_k8s_anomalies = require("./metrics_k8s_anomalies");

Object.keys(_metrics_k8s_anomalies).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _metrics_k8s_anomalies[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _metrics_k8s_anomalies[key];
    }
  });
});

var _common = require("./common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});