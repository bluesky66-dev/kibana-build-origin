"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  UMKibanaBackendFrameworkAdapter: true
};
Object.defineProperty(exports, "UMKibanaBackendFrameworkAdapter", {
  enumerable: true,
  get: function () {
    return _kibana_framework_adapter.UMKibanaBackendFrameworkAdapter;
  }
});

var _adapter_types = require("./adapter_types");

Object.keys(_adapter_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _adapter_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _adapter_types[key];
    }
  });
});

var _kibana_framework_adapter = require("./kibana_framework_adapter");