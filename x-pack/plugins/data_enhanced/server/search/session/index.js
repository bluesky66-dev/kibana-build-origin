"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  registerSearchSessionsTask: true,
  scheduleSearchSessionsTasks: true
};
Object.defineProperty(exports, "registerSearchSessionsTask", {
  enumerable: true,
  get: function () {
    return _monitoring_task.registerSearchSessionsTask;
  }
});
Object.defineProperty(exports, "scheduleSearchSessionsTasks", {
  enumerable: true,
  get: function () {
    return _monitoring_task.scheduleSearchSessionsTasks;
  }
});

var _session_service = require("./session_service");

Object.keys(_session_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _session_service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _session_service[key];
    }
  });
});

var _monitoring_task = require("./monitoring_task");