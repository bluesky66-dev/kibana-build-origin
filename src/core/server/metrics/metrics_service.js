"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _ops_metrics_collector = require("./ops_metrics_collector");

var _ops_config = require("./ops_config");

var _logging = require("./logging");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class MetricsService {
  constructor(coreContext) {
    this.coreContext = coreContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "opsMetricsLogger", void 0);

    _defineProperty(this, "metricsCollector", void 0);

    _defineProperty(this, "collectInterval", void 0);

    _defineProperty(this, "metrics$", new _rxjs.ReplaySubject(1));

    _defineProperty(this, "service", void 0);

    this.logger = coreContext.logger.get('metrics');
    this.opsMetricsLogger = coreContext.logger.get('metrics', 'ops');
  }

  async setup({
    http
  }) {
    const config = await this.coreContext.configService.atPath(_ops_config.opsConfig.path).pipe((0, _operators.first)()).toPromise();
    this.metricsCollector = new _ops_metrics_collector.OpsMetricsCollector(http.server, {
      logger: this.logger,
      ...config.cGroupOverrides
    });
    await this.refreshMetrics();
    this.collectInterval = setInterval(() => {
      this.refreshMetrics();
    }, config.interval.asMilliseconds());
    const metricsObservable = this.metrics$.asObservable();
    this.service = {
      collectionInterval: config.interval.asMilliseconds(),
      getOpsMetrics$: () => metricsObservable
    };
    return this.service;
  }

  async start() {
    if (!this.service) {
      throw new Error('#setup() needs to be run first');
    }

    return this.service;
  }

  async refreshMetrics() {
    const metrics = await this.metricsCollector.collect();
    const {
      message,
      ...meta
    } = (0, _logging.getEcsOpsMetricsLog)(metrics);
    this.opsMetricsLogger.debug(message, meta);
    this.metricsCollector.reset();
    this.metrics$.next(metrics);
  }

  async stop() {
    if (this.collectInterval) {
      clearInterval(this.collectInterval);
    }

    this.metrics$.complete();
  }

}

exports.MetricsService = MetricsService;