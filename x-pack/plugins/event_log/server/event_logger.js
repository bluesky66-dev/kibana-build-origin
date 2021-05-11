"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT_LOGGED_PREFIX = exports.EventLogger = void 0;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _types = require("./types");

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

class EventLogger {
  constructor(ctorParams) {
    _defineProperty(this, "esContext", void 0);

    _defineProperty(this, "eventLogService", void 0);

    _defineProperty(this, "initialProperties", void 0);

    _defineProperty(this, "systemLogger", void 0);

    this.esContext = ctorParams.esContext;
    this.eventLogService = ctorParams.eventLogService;
    this.initialProperties = ctorParams.initialProperties;
    this.systemLogger = ctorParams.systemLogger;
  }

  startTiming(event) {
    if (event == null) return;
    event.event = event.event || {};
    event.event.start = new Date().toISOString();
  }

  stopTiming(event) {
    if ((event === null || event === void 0 ? void 0 : event.event) == null) return;
    const start = getEventStart(event);
    if (start == null || isNaN(start)) return;
    const end = Date.now();
    event.event.end = new Date(end).toISOString();
    event.event.duration = (end - start) * 1000 * 1000; // nanoseconds
  } // non-blocking, but spawns an async task to do the work


  logEvent(eventProperties) {
    if (!this.eventLogService.isEnabled()) return;
    const event = {};
    const fixedProperties = {
      ecs: {
        version: _types.ECS_VERSION
      },
      kibana: {
        server_uuid: this.eventLogService.kibanaUUID
      }
    };
    const defaultProperties = {
      '@timestamp': new Date().toISOString()
    }; // merge the initial properties and event properties

    (0, _lodash.merge)(event, defaultProperties, this.initialProperties, eventProperties, fixedProperties);
    let validatedEvent;

    try {
      validatedEvent = validateEvent(this.eventLogService, event);
    } catch (err) {
      this.systemLogger.warn(`invalid event logged: ${err.message}`);
      return;
    }

    const doc = {
      index: this.esContext.esNames.alias,
      body: validatedEvent
    };

    if (this.eventLogService.isIndexingEntries()) {
      indexEventDoc(this.esContext, doc);
    }

    if (this.eventLogService.isLoggingEntries()) {
      logEventDoc(this.systemLogger, doc);
    }
  }

} // return the epoch millis of the start date, or null; may be NaN if garbage


exports.EventLogger = EventLogger;

function getEventStart(event) {
  var _event$event;

  if ((event === null || event === void 0 ? void 0 : (_event$event = event.event) === null || _event$event === void 0 ? void 0 : _event$event.start) == null) return null;
  return Date.parse(event.event.start);
}

const RequiredEventSchema = _configSchema.schema.object({
  provider: _configSchema.schema.string({
    minLength: 1
  }),
  action: _configSchema.schema.string({
    minLength: 1
  })
});

const ValidSavedObjectRels = new Set([undefined, _types.SAVED_OBJECT_REL_PRIMARY]);

function validateEvent(eventLogService, event) {
  var _result$kibana, _result$kibana$saved_;

  if ((event === null || event === void 0 ? void 0 : event.event) == null) {
    throw new Error(`no "event" property`);
  } // ensure there are provider/action properties in event as strings


  const requiredProps = {
    provider: event.event.provider,
    action: event.event.action
  }; // will throw an error if structure doesn't validate

  const {
    provider,
    action
  } = RequiredEventSchema.validate(requiredProps);

  if (!eventLogService.isProviderActionRegistered(provider, action)) {
    throw new Error(`unregistered provider/action: "${provider}" / "${action}"`);
  } // could throw an error


  const result = _types.EventSchema.validate(event);

  if (result !== null && result !== void 0 && (_result$kibana = result.kibana) !== null && _result$kibana !== void 0 && (_result$kibana$saved_ = _result$kibana.saved_objects) !== null && _result$kibana$saved_ !== void 0 && _result$kibana$saved_.length) {
    for (const so of result === null || result === void 0 ? void 0 : (_result$kibana2 = result.kibana) === null || _result$kibana2 === void 0 ? void 0 : _result$kibana2.saved_objects) {
      var _result$kibana2;

      if (!ValidSavedObjectRels.has(so.rel)) {
        throw new Error(`invalid rel property in saved_objects: "${so.rel}"`);
      }
    }
  }

  return result;
}

const EVENT_LOGGED_PREFIX = `event logged: `;
exports.EVENT_LOGGED_PREFIX = EVENT_LOGGED_PREFIX;

function logEventDoc(logger, doc) {
  logger.info(`event logged: ${JSON.stringify(doc.body)}`);
}

function indexEventDoc(esContext, doc) {
  esContext.esAdapter.indexDocument(doc);
}