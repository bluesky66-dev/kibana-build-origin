"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectorSet = void 0;

var _lodash = require("lodash");

var _collector = require("./collector");

var _usage_collector = require("./usage_collector");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CollectorSet {
  constructor({
    logger,
    maximumWaitTimeForAllCollectorsInS,
    collectors: _collectors = []
  }) {
    _defineProperty(this, "_waitingForAllCollectorsTimestamp", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "maximumWaitTimeForAllCollectorsInS", void 0);

    _defineProperty(this, "collectors", void 0);

    _defineProperty(this, "makeStatsCollector", options => {
      return new _collector.Collector(this.logger, options);
    });

    _defineProperty(this, "makeUsageCollector", options => {
      return new _usage_collector.UsageCollector(this.logger, options);
    });

    _defineProperty(this, "registerCollector", collector => {
      // check instanceof
      if (!(collector instanceof _collector.Collector)) {
        throw new Error('CollectorSet can only have Collector instances registered');
      }

      if (this.collectors.get(collector.type)) {
        throw new Error(`Usage collector's type "${collector.type}" is duplicated.`);
      }

      this.collectors.set(collector.type, collector);

      if (collector.init) {
        this.logger.debug(`Initializing ${collector.type} collector`);
        collector.init();
      }
    });

    _defineProperty(this, "getCollectorByType", type => {
      return [...this.collectors.values()].find(c => c.type === type);
    });

    _defineProperty(this, "areAllCollectorsReady", async (collectorSet = this) => {
      if (!(collectorSet instanceof CollectorSet)) {
        throw new Error(`areAllCollectorsReady method given bad collectorSet parameter: ` + typeof collectorSet);
      }

      const collectors = [...collectorSet.collectors.values()];
      const collectorsWithStatus = await Promise.all(collectors.map(async collector => {
        return {
          isReady: await collector.isReady(),
          collector
        };
      }));
      const collectorsTypesNotReady = collectorsWithStatus.filter(collectorWithStatus => collectorWithStatus.isReady === false).map(collectorWithStatus => collectorWithStatus.collector.type);
      const allReady = collectorsTypesNotReady.length === 0;

      if (!allReady && this.maximumWaitTimeForAllCollectorsInS >= 0) {
        const nowTimestamp = +new Date();
        this._waitingForAllCollectorsTimestamp = this._waitingForAllCollectorsTimestamp || nowTimestamp;
        const timeWaitedInMS = nowTimestamp - this._waitingForAllCollectorsTimestamp;
        const timeLeftInMS = this.maximumWaitTimeForAllCollectorsInS * 1000 - timeWaitedInMS;

        if (timeLeftInMS <= 0) {
          this.logger.debug(`All collectors are not ready (waiting for ${collectorsTypesNotReady.join(',')}) ` + `but we have waited the required ` + `${this.maximumWaitTimeForAllCollectorsInS}s and will return data from all collectors that are ready.`);
          return true;
        } else {
          this.logger.debug(`All collectors are not ready. Waiting for ${timeLeftInMS}ms longer.`);
        }
      } else {
        this._waitingForAllCollectorsTimestamp = undefined;
      }

      return allReady;
    });

    _defineProperty(this, "bulkFetch", async (esClient, soClient, kibanaRequest, // intentionally `| undefined` to enforce providing the parameter
    collectors = this.collectors) => {
      const responses = await Promise.all([...collectors.values()].map(async collector => {
        this.logger.debug(`Fetching data from ${collector.type} collector`);

        try {
          const context = {
            esClient,
            soClient,
            ...(collector.extendFetchContext.kibanaRequest && {
              kibanaRequest
            })
          };
          return {
            type: collector.type,
            result: await collector.fetch(context)
          };
        } catch (err) {
          this.logger.warn(err);
          this.logger.warn(`Unable to fetch data from ${collector.type} collector`);
        }
      }));
      return responses.filter(response => typeof response !== 'undefined');
    });

    _defineProperty(this, "getFilteredCollectorSet", filter => {
      const filtered = [...this.collectors.values()].filter(filter);
      return this.makeCollectorSetFromArray(filtered);
    });

    _defineProperty(this, "bulkFetchUsage", async (esClient, savedObjectsClient, kibanaRequest) => {
      const usageCollectors = this.getFilteredCollectorSet(c => c instanceof _usage_collector.UsageCollector);
      return await this.bulkFetch(esClient, savedObjectsClient, kibanaRequest, usageCollectors.collectors);
    });

    _defineProperty(this, "toObject", (statsData = []) => {
      return statsData.reduce((accumulatedStats, {
        type,
        result
      }) => {
        return { ...accumulatedStats,
          [type]: result
        };
      }, {});
    });

    _defineProperty(this, "toApiFieldNames", apiData => {
      const getValueOrRecurse = value => {
        if (value == null || typeof value !== 'object') {
          return value;
        } else {
          return this.toApiFieldNames(value); // recurse
        }
      }; // handle array and return early, or return a reduced object


      if (Array.isArray(apiData)) {
        return apiData.map(getValueOrRecurse);
      }

      return Object.keys(apiData).reduce((accum, field) => {
        const value = apiData[field];
        let newName = field;
        newName = (0, _lodash.snakeCase)(newName);
        newName = newName.replace(/^(1|5|15)_m/, '$1m'); // os.load.15m, os.load.5m, os.load.1m

        newName = newName.replace('_in_bytes', '_bytes');
        newName = newName.replace('_in_millis', '_ms');
        return { ...accum,
          [newName]: getValueOrRecurse(value)
        };
      }, {});
    });

    _defineProperty(this, "makeCollectorSetFromArray", collectors => {
      return new CollectorSet({
        logger: this.logger,
        maximumWaitTimeForAllCollectorsInS: this.maximumWaitTimeForAllCollectorsInS,
        collectors
      });
    });

    this.logger = logger;
    this.collectors = new Map(_collectors.map(collector => [collector.type, collector]));
    this.maximumWaitTimeForAllCollectorsInS = maximumWaitTimeForAllCollectorsInS || 60;
  }
  /**
   * Instantiates a stats collector with the definition provided in the options
   * @param options Definition of the collector {@link CollectorOptions}
   */


}

exports.CollectorSet = CollectorSet;