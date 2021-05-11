"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSpaceService = exports.RETRY_DURATION_MAX = exports.RETRY_SCALE_DURATION = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../../../src/core/server");

var _create_default_space = require("./create_default_space");

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

const RETRY_SCALE_DURATION = 100;
exports.RETRY_SCALE_DURATION = RETRY_SCALE_DURATION;
const RETRY_DURATION_MAX = 10000;
exports.RETRY_DURATION_MAX = RETRY_DURATION_MAX;

const calculateDuration = i => {
  const duration = i * RETRY_SCALE_DURATION;

  if (duration > RETRY_DURATION_MAX) {
    return RETRY_DURATION_MAX;
  }

  return duration;
}; // we can't use a retryWhen here, because we want to propagate the unavailable status and then retry


const propagateUnavailableStatusAndScaleRetry = () => {
  let i = 0;
  return (err, caught) => (0, _rxjs.concat)((0, _rxjs.of)({
    level: _server.ServiceStatusLevels.unavailable,
    summary: `Error creating default space: ${err.message}`
  }), (0, _rxjs.timer)(calculateDuration(++i)).pipe((0, _operators.mergeMap)(() => caught)));
};

class DefaultSpaceService {
  constructor() {
    _defineProperty(this, "initializeSubscription", void 0);

    _defineProperty(this, "serviceStatus$", void 0);
  }

  setup({
    coreStatus,
    getSavedObjects,
    license$,
    spacesLicense,
    logger
  }) {
    const statusLogger = logger.get('status');
    this.serviceStatus$ = new _rxjs.BehaviorSubject({
      level: _server.ServiceStatusLevels.unavailable,
      summary: 'not initialized'
    });
    this.initializeSubscription = (0, _rxjs.combineLatest)([coreStatus.core$, license$]).pipe((0, _operators.switchMap)(([status]) => {
      const isElasticsearchReady = status.elasticsearch.level === _server.ServiceStatusLevels.available;
      const isSavedObjectsReady = status.savedObjects.level === _server.ServiceStatusLevels.available;

      if (!isElasticsearchReady || !isSavedObjectsReady) {
        return (0, _rxjs.of)({
          level: _server.ServiceStatusLevels.unavailable,
          summary: 'required core services are not ready'
        });
      }

      if (!spacesLicense.isEnabled()) {
        return (0, _rxjs.of)({
          level: _server.ServiceStatusLevels.unavailable,
          summary: 'missing or invalid license'
        });
      }

      return (0, _rxjs.defer)(() => (0, _create_default_space.createDefaultSpace)({
        getSavedObjects,
        logger
      }).then(() => {
        return {
          level: _server.ServiceStatusLevels.available,
          summary: 'ready'
        };
      })).pipe((0, _operators.catchError)(propagateUnavailableStatusAndScaleRetry()));
    }), (0, _operators.tap)(spacesStatus => {
      // This is temporary for debugging/visibility until we get a proper status service from core.
      // See issue #41983 for details.
      statusLogger.debug(`${spacesStatus.level.toString()}: ${spacesStatus.summary}`);
      this.serviceStatus$.next(spacesStatus);
    })).subscribe();
    return {
      serviceStatus$: this.serviceStatus$.asObservable()
    };
  }

  stop() {
    if (this.initializeSubscription) {
      this.initializeSubscription.unsubscribe();
    }

    this.initializeSubscription = undefined;

    if (this.serviceStatus$) {
      this.serviceStatus$.complete();
      this.serviceStatus$ = undefined;
    }
  }

}

exports.DefaultSpaceService = DefaultSpaceService;