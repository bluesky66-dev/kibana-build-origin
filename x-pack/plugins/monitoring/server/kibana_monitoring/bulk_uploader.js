"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulkUploader = void 0;

var _operators = require("rxjs/operators");

var _moment = _interopRequireDefault(require("moment"));

var _server = require("../../../../../src/core/server");

var _constants = require("../../common/constants");

var _lib = require("./lib");

var _collectors = require("./collectors");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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
/*
 * Handles internal Kibana stats collection and uploading data to Monitoring
 * bulk endpoint.
 *
 * NOTE: internal collection will be removed in 7.0
 *
 * Depends on
 *   - 'monitoring.kibana.collection.enabled' config
 *   - monitoring enabled in ES (checked against xpack_main.info license info change)
 * The dependencies are handled upstream
 * - Ops Events - essentially Kibana's /api/status
 * - Usage Stats - essentially Kibana's /api/stats
 * - Kibana Settings - select uiSettings
 * @param {Object} server HapiJS server instance
 * @param {Object} xpackInfo server.plugins.xpack_main.info object
 */


class BulkUploader {
  constructor({
    log,
    config,
    interval,
    statusGetter$,
    opsMetrics$,
    kibanaStats
  }) {
    _defineProperty(this, "_log", void 0);

    _defineProperty(this, "kibanaStats", void 0);

    _defineProperty(this, "kibanaStatusGetter$", void 0);

    _defineProperty(this, "kibanaStatusSubscription", void 0);

    _defineProperty(this, "opsMetrics$", void 0);

    _defineProperty(this, "kibanaStatus", void 0);

    _defineProperty(this, "_timer", void 0);

    _defineProperty(this, "_interval", void 0);

    _defineProperty(this, "config", void 0);

    if (typeof interval !== 'number') {
      throw new Error('interval number of milliseconds is required');
    }

    this.opsMetrics$ = opsMetrics$;
    this.config = config;
    this._timer = null;
    this._interval = interval;
    this._log = log;
    this.kibanaStats = kibanaStats;
    this.kibanaStatus = null;
    this.kibanaStatusGetter$ = statusGetter$;
  }
  /*
   * Start the interval timer
   * @param {usageCollection} usageCollection object to use for initial the fetch/upload and fetch/uploading on interval
   * @return undefined
   */


  start(esClient) {
    this._log.info('Starting monitoring stats collection');

    this.kibanaStatusSubscription = this.kibanaStatusGetter$.subscribe(nextStatus => {
      this.kibanaStatus = nextStatus.level;
    });

    if (this._timer) {
      clearInterval(this._timer);
    } else {
      this._fetchAndUpload(esClient); // initial fetch

    }

    this._timer = setInterval(() => {
      this._fetchAndUpload(esClient);
    }, this._interval);
  }
  /*
   * start() and stop() are lifecycle event handlers for
   * xpackMainPlugin license changes
   * @param {String} logPrefix help give context to the reason for stopping
   */


  stop(logPrefix) {
    var _this$kibanaStatusSub;

    if (this._timer) clearInterval(this._timer);
    this._timer = null;
    (_this$kibanaStatusSub = this.kibanaStatusSubscription) === null || _this$kibanaStatusSub === void 0 ? void 0 : _this$kibanaStatusSub.unsubscribe();
    const prefix = logPrefix ? logPrefix + ':' : '';

    this._log.info(prefix + 'Monitoring stats collection is stopped');
  }

  handleNotEnabled() {
    this.stop('Monitoring status upload endpoint is not enabled in Elasticsearch');
  }

  handleConnectionLost() {
    this.stop('Connection issue detected');
  }
  /**
   * Retrieves the OpsMetrics in the same format as the `kibana_stats` collector
   * @private
   */


  async getOpsMetrics() {
    const {
      process: {
        pid,
        ...process
      },
      collected_at: collectedAt,
      requests: {
        statusCodes,
        ...requests
      },
      ...lastMetrics
    } = await this.opsMetrics$.pipe((0, _operators.take)(1)).toPromise();
    return { ...lastMetrics,
      process,
      requests,
      response_times: {
        average: lastMetrics.response_times.avg_in_millis,
        max: lastMetrics.response_times.max_in_millis
      },
      timestamp: _moment.default.utc(collectedAt).toISOString()
    };
  }

  async _fetchAndUpload(esClient) {
    const data = await Promise.all([{
      type: _constants.KIBANA_STATS_TYPE_MONITORING,
      result: await this.getOpsMetrics()
    }, {
      type: _constants.KIBANA_SETTINGS_TYPE,
      result: await (0, _collectors.getKibanaSettings)(this._log, this.config)
    }]);
    const payload = this.toBulkUploadFormat(data);

    if (payload && payload.length > 0) {
      try {
        this._log.debug(`Uploading bulk stats payload to the local cluster`);

        await this._onPayload(esClient, payload);

        this._log.debug(`Uploaded bulk stats payload to the local cluster`);
      } catch (err) {
        this._log.warn(err.stack);

        this._log.warn(`Unable to bulk upload the stats payload to the local cluster`);
      }
    } else {
      this._log.debug(`Skipping bulk uploading of an empty stats payload`);
    }
  }

  async _onPayload(esClient, payload) {
    return await (0, _lib.sendBulkPayload)(esClient, this._interval, payload);
  }

  getConvertedKibanaStatus() {
    if (this.kibanaStatus === _server.ServiceStatusLevels.available) {
      return 'green';
    }

    if (this.kibanaStatus === _server.ServiceStatusLevels.critical) {
      return 'red';
    }

    if (this.kibanaStatus === _server.ServiceStatusLevels.degraded) {
      return 'yellow';
    }

    return 'unknown';
  }

  getKibanaStats(type) {
    const stats = { ...this.kibanaStats,
      status: this.getConvertedKibanaStatus()
    };

    if (type === _constants.KIBANA_STATS_TYPE_MONITORING) {
      // Do not report the keys `port` and `locale`
      const {
        port,
        locale,
        ...rest
      } = stats;
      return rest;
    }

    return stats;
  }
  /*
   * Bulk stats are transformed into a bulk upload format
   * Non-legacy transformation is done in CollectorSet.toApiStats
   *
   * Example:
   * Before:
   *    [
   *      {
   *        "type": "kibana_stats",
   *        "result": {
   *          "process": { ...  },
   *          "requests": { ...  },
   *          ...
   *        }
   *      },
   *    ]
   *
   * After:
   *    [
   *      {
   *        "index": {
   *          "_type": "kibana_stats"
   *        }
   *      },
   *      {
   *        "kibana": {
   *          "host": "localhost",
   *          "uuid": "d619c5d1-4315-4f35-b69d-a3ac805489fb",
   *          "version": "7.0.0-alpha1",
   *          ...
   *        },
   *        "process": { ...  },
   *        "requests": { ...  },
   *        ...
   *      }
   *    ]
   */


  toBulkUploadFormat(rawData) {
    // convert the raw data into a flat array, with each payload prefixed
    // with an 'index' instruction, for bulk upload
    return rawData.reduce((accum, {
      type,
      result
    }) => {
      return [...accum, {
        index: {
          _type: type
        }
      }, {
        kibana: this.getKibanaStats(type),
        ...result
      }];
    }, []);
  }

}

exports.BulkUploader = BulkUploader;