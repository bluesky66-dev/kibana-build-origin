"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MockTelemetryDiagnosticTask = exports.createMockTelemetryEventsSender = void 0;

var _task = require("./task");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * Creates a mocked Telemetry Events Sender
 */


const createMockTelemetryEventsSender = enableTelemtry => {
  return {
    setup: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    fetchDiagnosticAlerts: jest.fn(),
    queueTelemetryEvents: jest.fn(),
    processEvents: jest.fn(),
    isTelemetryOptedIn: jest.fn().mockReturnValue(enableTelemtry !== null && enableTelemtry !== void 0 ? enableTelemtry : jest.fn()),
    sendIfDue: jest.fn(),
    fetchClusterInfo: jest.fn(),
    fetchTelemetryUrl: jest.fn(),
    fetchLicenseInfo: jest.fn(),
    copyLicenseFields: jest.fn(),
    sendEvents: jest.fn()
  };
};
/**
 * Creates a mocked Telemetry Diagnostic Task
 */


exports.createMockTelemetryEventsSender = createMockTelemetryEventsSender;

class MockTelemetryDiagnosticTask extends _task.TelemetryDiagTask {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "runTask", jest.fn());
  }

}

exports.MockTelemetryDiagnosticTask = MockTelemetryDiagnosticTask;