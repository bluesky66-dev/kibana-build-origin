"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchService = void 0;

var _rxjs = require("rxjs");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _operators = require("rxjs/operators");

var _aggs = require("./aggs");

var _routes = require("./routes");

var _es_search = require("./es_search");

var _register = require("./collectors/register");

var _usage = require("./collectors/usage");

var _saved_objects = require("../saved_objects");

var _search = require("../../common/search");

var _expressions = require("./expressions");

var _shard_delay = require("../../common/search/aggs/buckets/shard_delay");

var _shard_delay_fn = require("../../common/search/aggs/buckets/shard_delay_fn");

var _session = require("./session");

var _server = require("../../../kibana_utils/server");

var _bsearch = require("./routes/bsearch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SearchService {
  constructor(initializerContext, logger) {
    this.initializerContext = initializerContext;
    this.logger = logger;

    _defineProperty(this, "aggsService", new _aggs.AggsService());

    _defineProperty(this, "searchSourceService", new _search.SearchSourceService());

    _defineProperty(this, "defaultSearchStrategyName", _es_search.ES_SEARCH_STRATEGY);

    _defineProperty(this, "searchStrategies", {});

    _defineProperty(this, "sessionService", void 0);

    _defineProperty(this, "asScoped", void 0);

    _defineProperty(this, "registerSearchStrategy", (name, strategy) => {
      this.logger.debug(`Register strategy ${name}`);
      this.searchStrategies[name] = strategy;
    });

    _defineProperty(this, "getSearchStrategy", (name = this.defaultSearchStrategyName) => {
      this.logger.debug(`Get strategy ${name}`);
      const strategy = this.searchStrategies[name];

      if (!strategy) {
        throw new _server.KbnServerError(`Search strategy ${name} not found`, 404);
      }

      return strategy;
    });

    _defineProperty(this, "search", (deps, request, options) => {
      try {
        const strategy = this.getSearchStrategy(options.strategy);

        const getSearchRequest = async () => !options.sessionId || !options.isRestore || request.id ? request : { ...request,
          id: await deps.searchSessionsClient.getId(request, options)
        };

        return (0, _rxjs.from)(getSearchRequest()).pipe((0, _operators.switchMap)(searchRequest => strategy.search(searchRequest, options, deps)), (0, _operators.tap)(response => {
          if (!options.sessionId || !response.id || options.isRestore) return; // intentionally swallow tracking error, as it shouldn't fail the search

          deps.searchSessionsClient.trackId(request, response.id, options).catch(trackErr => {
            this.logger.error(trackErr);
          });
        }));
      } catch (e) {
        return (0, _rxjs.throwError)(e);
      }
    });

    _defineProperty(this, "cancel", async (deps, id, options = {}) => {
      const strategy = this.getSearchStrategy(options.strategy);

      if (!strategy.cancel) {
        throw new _server.KbnServerError(`Search strategy ${options.strategy} doesn't support cancellations`, 400);
      }

      return strategy.cancel(id, options, deps);
    });

    _defineProperty(this, "extend", async (deps, id, keepAlive, options = {}) => {
      const strategy = this.getSearchStrategy(options.strategy);

      if (!strategy.extend) {
        throw new _server.KbnServerError(`Search strategy ${options.strategy} does not support extend`, 400);
      }

      return strategy.extend(id, keepAlive, options, deps);
    });

    _defineProperty(this, "cancelSessionSearches", async (deps, sessionId) => {
      const searchIdMapping = await deps.searchSessionsClient.getSearchIdMapping(sessionId);
      await Promise.allSettled(Array.from(searchIdMapping).map(([searchId, strategyName]) => {
        const searchOptions = {
          sessionId,
          strategy: strategyName,
          isStored: true
        };
        return this.cancel(deps, searchId, searchOptions);
      }));
    });

    _defineProperty(this, "cancelSession", async (deps, sessionId) => {
      const response = await deps.searchSessionsClient.cancel(sessionId);
      await this.cancelSessionSearches(deps, sessionId);
      return response;
    });

    _defineProperty(this, "deleteSession", async (deps, sessionId) => {
      await this.cancelSessionSearches(deps, sessionId);
      return deps.searchSessionsClient.delete(sessionId);
    });

    _defineProperty(this, "extendSession", async (deps, sessionId, expires) => {
      const searchIdMapping = await deps.searchSessionsClient.getSearchIdMapping(sessionId);
      const keepAlive = `${(0, _moment.default)(expires).diff((0, _moment.default)())}ms`;
      const result = await Promise.allSettled(Array.from(searchIdMapping).map(([searchId, strategyName]) => {
        const searchOptions = {
          sessionId,
          strategy: strategyName,
          isStored: true
        };
        return this.extend(deps, searchId, keepAlive, searchOptions);
      }));

      if (result.some(extRes => extRes.status === 'rejected')) {
        throw new Error('Failed to extend the expiration of some searches');
      }

      return deps.searchSessionsClient.extend(sessionId, expires);
    });

    _defineProperty(this, "asScopedProvider", core => {
      const {
        elasticsearch,
        savedObjects,
        uiSettings
      } = core;
      const getSessionAsScoped = this.sessionService.asScopedProvider(core);
      return request => {
        const savedObjectsClient = savedObjects.getScopedClient(request);
        const searchSessionsClient = getSessionAsScoped(request);
        const deps = {
          searchSessionsClient,
          savedObjectsClient,
          esClient: elasticsearch.client.asScoped(request),
          uiSettingsClient: uiSettings.asScopedToClient(savedObjectsClient)
        };
        return {
          search: (searchRequest, options = {}) => this.search(deps, searchRequest, options),
          cancel: this.cancel.bind(this, deps),
          extend: this.extend.bind(this, deps),
          saveSession: searchSessionsClient.save,
          getSession: searchSessionsClient.get,
          findSessions: searchSessionsClient.find,
          updateSession: searchSessionsClient.update,
          extendSession: this.extendSession.bind(this, deps),
          cancelSession: this.cancelSession.bind(this, deps),
          deleteSession: this.deleteSession.bind(this, deps)
        };
      };
    });

    this.sessionService = new _session.SearchSessionService();
  }

  setup(core, {
    bfetch,
    expressions,
    usageCollection
  }) {
    const usage = usageCollection ? (0, _usage.usageProvider)(core) : undefined;
    const router = core.http.createRouter();
    const routeDependencies = {
      getStartServices: core.getStartServices,
      globalConfig$: this.initializerContext.config.legacy.globalConfig$
    };
    (0, _routes.registerSearchRoute)(router);
    (0, _routes.registerMsearchRoute)(router, routeDependencies);
    core.http.registerRouteHandlerContext('search', async (context, request) => {
      return this.asScoped(request);
    });
    this.registerSearchStrategy(_es_search.ES_SEARCH_STRATEGY, (0, _es_search.esSearchStrategyProvider)(this.initializerContext.config.legacy.globalConfig$, this.logger, usage));
    (0, _bsearch.registerBsearchRoute)(bfetch, request => this.asScoped(request));
    core.savedObjects.registerType(_saved_objects.searchTelemetry);

    if (usageCollection) {
      (0, _register.registerUsageCollector)(usageCollection, this.initializerContext);
    }

    expressions.registerFunction((0, _expressions.getEsaggs)({
      getStartServices: core.getStartServices
    }));
    expressions.registerFunction(_search.kibana);
    expressions.registerFunction(_search.kibanaContextFunction);
    expressions.registerType(_search.kibanaContext);
    const aggs = this.aggsService.setup({
      registerFunction: expressions.registerFunction
    });
    this.initializerContext.config.create().pipe((0, _operators.first)()).toPromise().then(value => {
      if (value.search.aggs.shardDelay.enabled) {
        aggs.types.registerBucket(_shard_delay.SHARD_DELAY_AGG_NAME, _shard_delay.getShardDelayBucketAgg);
        expressions.registerFunction(_shard_delay_fn.aggShardDelay);
      }
    });
    return {
      __enhance: enhancements => {
        if (this.searchStrategies.hasOwnProperty(enhancements.defaultStrategy)) {
          this.defaultSearchStrategyName = enhancements.defaultStrategy;
        }

        this.sessionService = enhancements.sessionService;
      },
      aggs,
      registerSearchStrategy: this.registerSearchStrategy,
      usage
    };
  }

  start(core, {
    fieldFormats,
    indexPatterns
  }) {
    const {
      elasticsearch,
      savedObjects,
      uiSettings
    } = core;
    this.asScoped = this.asScopedProvider(core);
    return {
      aggs: this.aggsService.start({
        fieldFormats,
        uiSettings,
        indexPatterns
      }),
      getSearchStrategy: this.getSearchStrategy,
      asScoped: this.asScoped,
      searchSource: {
        asScoped: async request => {
          const esClient = elasticsearch.client.asScoped(request);
          const savedObjectsClient = savedObjects.getScopedClient(request);
          const scopedIndexPatterns = await indexPatterns.indexPatternsServiceFactory(savedObjectsClient, esClient.asCurrentUser);
          const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient); // cache ui settings, only including items which are explicitly needed by SearchSource

          const uiSettingsCache = (0, _lodash.pick)(await uiSettingsClient.getAll(), _search.searchSourceRequiredUiSettings);
          const searchSourceDependencies = {
            getConfig: key => uiSettingsCache[key],
            search: this.asScoped(request).search,
            onResponse: (req, res) => res,
            legacy: {
              callMsearch: (0, _routes.getCallMsearch)({
                esClient,
                globalConfig$: this.initializerContext.config.legacy.globalConfig$,
                uiSettings: uiSettingsClient
              }),
              loadingCount$: new _rxjs.BehaviorSubject(0)
            }
          };
          return this.searchSourceService.start(scopedIndexPatterns, searchSourceDependencies);
        }
      }
    };
  }

  stop() {
    this.aggsService.stop();
  }

}

exports.SearchService = SearchService;