"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("util");

var _routes = require("./routes");

var _status_config = require("./status_config");

var _get_summary_status = require("./get_summary_status");

var _plugins_status = require("./plugins_status");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class StatusService {
  constructor(coreContext) {
    this.coreContext = coreContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "pluginsStatus", void 0);

    _defineProperty(this, "overallSubscription", void 0);

    this.logger = coreContext.logger.get('status');
    this.config$ = coreContext.configService.atPath(_status_config.config.path);
  }

  async setup({
    elasticsearch,
    pluginDependencies,
    http,
    metrics,
    savedObjects,
    environment
  }) {
    const statusConfig = await this.config$.pipe((0, _operators.take)(1)).toPromise();
    const core$ = this.setupCoreStatus({
      elasticsearch,
      savedObjects
    });
    this.pluginsStatus = new _plugins_status.PluginsStatusService({
      core$,
      pluginDependencies
    });
    const overall$ = (0, _rxjs.combineLatest)([core$, this.pluginsStatus.getAll$()]).pipe( // Prevent many emissions at once from dependency status resolution from making this too noisy
    (0, _operators.debounceTime)(500), (0, _operators.map)(([coreStatus, pluginsStatus]) => {
      const summary = (0, _get_summary_status.getSummaryStatus)([...Object.entries(coreStatus), ...Object.entries(pluginsStatus)]);
      this.logger.debug(`Recalculated overall status`, {
        status: summary
      });
      return summary;
    }), (0, _operators.distinctUntilChanged)(_util.isDeepStrictEqual), (0, _operators.shareReplay)(1)); // Create an unused subscription to ensure all underlying lazy observables are started.

    this.overallSubscription = overall$.subscribe();
    const router = http.createRouter('');
    (0, _routes.registerStatusRoute)({
      router,
      config: {
        allowAnonymous: statusConfig.allowAnonymous,
        packageInfo: this.coreContext.env.packageInfo,
        serverName: http.getServerInfo().name,
        uuid: environment.instanceUuid
      },
      metrics,
      status: {
        overall$,
        plugins$: this.pluginsStatus.getAll$(),
        core$
      }
    });
    return {
      core$,
      overall$,
      plugins: {
        set: this.pluginsStatus.set.bind(this.pluginsStatus),
        getDependenciesStatus$: this.pluginsStatus.getDependenciesStatus$.bind(this.pluginsStatus),
        getDerivedStatus$: this.pluginsStatus.getDerivedStatus$.bind(this.pluginsStatus)
      },
      isStatusPageAnonymous: () => statusConfig.allowAnonymous
    };
  }

  start() {}

  stop() {
    if (this.overallSubscription) {
      this.overallSubscription.unsubscribe();
      this.overallSubscription = undefined;
    }
  }

  setupCoreStatus({
    elasticsearch,
    savedObjects
  }) {
    return (0, _rxjs.combineLatest)([elasticsearch.status$, savedObjects.status$]).pipe((0, _operators.map)(([elasticsearchStatus, savedObjectsStatus]) => ({
      elasticsearch: elasticsearchStatus,
      savedObjects: savedObjectsStatus
    })), (0, _operators.distinctUntilChanged)(_util.isDeepStrictEqual), (0, _operators.shareReplay)(1));
  }

}

exports.StatusService = StatusService;