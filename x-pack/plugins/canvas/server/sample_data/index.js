"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ecommerceSavedObjects", {
  enumerable: true,
  get: function () {
    return _ecommerce_saved_objects.default;
  }
});
Object.defineProperty(exports, "flightsSavedObjects", {
  enumerable: true,
  get: function () {
    return _flights_saved_objects.default;
  }
});
Object.defineProperty(exports, "webLogsSavedObjects", {
  enumerable: true,
  get: function () {
    return _web_logs_saved_objects.default;
  }
});
Object.defineProperty(exports, "loadSampleData", {
  enumerable: true,
  get: function () {
    return _load_sample_data.loadSampleData;
  }
});

var _ecommerce_saved_objects = _interopRequireDefault(require("./ecommerce_saved_objects.json"));

var _flights_saved_objects = _interopRequireDefault(require("./flights_saved_objects.json"));

var _web_logs_saved_objects = _interopRequireDefault(require("./web_logs_saved_objects.json"));

var _load_sample_data = require("./load_sample_data");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}