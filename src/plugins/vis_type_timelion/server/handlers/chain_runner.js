"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chainRunner;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _parse_sheet = _interopRequireDefault(require("./lib/parse_sheet.js"));

var _reposition_arguments = _interopRequireDefault(require("./lib/reposition_arguments.js"));

var _index_arguments = _interopRequireDefault(require("./lib/index_arguments.js"));

var _validate_time = _interopRequireDefault(require("./lib/validate_time.js"));

var _lib = require("../../common/lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function chainRunner(tlConfig) {
  const preprocessChain = require('./lib/preprocess_chain')(tlConfig);

  let queryCache = {};
  const stats = {};
  let sheet;

  function throwWithCell(cell, exception) {
    throw new Error(' in cell #' + (cell + 1) + ': ' + exception.message);
  } // Invokes a modifier function, resolving arguments into series as needed


  function invoke(fnName, args) {
    const functionDef = tlConfig.getFunction(fnName);

    function resolveArgument(item) {
      if (Array.isArray(item)) {
        return _bluebird.default.all(_lodash.default.map(item, resolveArgument));
      }

      if (_lodash.default.isObject(item)) {
        switch (item.type) {
          case 'function':
            {
              const itemFunctionDef = tlConfig.getFunction(item.function);

              if (itemFunctionDef.cacheKey && queryCache[itemFunctionDef.cacheKey(item)]) {
                stats.queryCount++;
                return _bluebird.default.resolve(_lodash.default.cloneDeep(queryCache[itemFunctionDef.cacheKey(item)]));
              }

              return invoke(item.function, item.arguments);
            }

          case 'reference':
            {
              let reference;

              if (item.series) {
                reference = sheet[item.plot - 1][item.series - 1];
              } else {
                reference = {
                  type: 'chainList',
                  list: sheet[item.plot - 1]
                };
              }

              return invoke('first', [reference]);
            }

          case 'chain':
            return invokeChain(item);

          case 'chainList':
            return resolveChainList(item.list);

          case 'literal':
            return item.value;

          case 'requestList':
          case 'seriesList':
            return item;
        }

        throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.unknownArgumentTypeErrorMessage', {
          defaultMessage: 'Argument type not supported: {argument}',
          values: {
            argument: JSON.stringify(item)
          }
        }));
      } else {
        return item;
      }
    }

    args = (0, _reposition_arguments.default)(functionDef, args);
    args = _lodash.default.map(args, resolveArgument);
    return _bluebird.default.all(args).then(function (args) {
      args.byName = (0, _index_arguments.default)(functionDef, args);
      return functionDef.fn(args, tlConfig);
    });
  }

  function invokeChain(chainObj, result) {
    if (chainObj.chain.length === 0) return result[0];

    const chain = _lodash.default.clone(chainObj.chain);

    const link = chain.shift();
    let promise;

    if (link.type === 'chain') {
      promise = invokeChain(link);
    } else if (!result) {
      promise = invoke('first', [link]);
    } else {
      const args = link.arguments ? result.concat(link.arguments) : result;
      promise = invoke(link.function, args);
    }

    return promise.then(function (result) {
      return invokeChain({
        type: 'chain',
        chain: chain
      }, [result]);
    });
  }

  function resolveChainList(chainList) {
    const seriesList = _lodash.default.map(chainList, function (chain) {
      const values = invoke('first', [chain]);
      return values.then(function (args) {
        return args;
      });
    });

    return _bluebird.default.all(seriesList).then(function (args) {
      const list = _lodash.default.chain(args).map('list').flatten().value();

      const seriesList = _lodash.default.merge.apply(this, _lodash.default.flatten([{}, args]));

      seriesList.list = list;
      return seriesList;
    });
  }

  function preProcessSheet(sheet) {
    let queries = {};

    _lodash.default.each(sheet, function (chainList, i) {
      try {
        const queriesInCell = _lodash.default.mapValues(preprocessChain(chainList), function (val) {
          val.cell = i;
          return val;
        });

        queries = _lodash.default.extend(queries, queriesInCell);
      } catch (e) {
        throwWithCell(i, e);
      }
    });

    queries = _lodash.default.values(queries);

    const promises = _lodash.default.chain(queries).values().map(function (query) {
      return invoke(query.function, query.arguments);
    }).value();

    return _bluebird.default.settle(promises).then(function (resolvedDatasources) {
      stats.queryTime = new Date().getTime();

      _lodash.default.each(queries, function (query, i) {
        const functionDef = tlConfig.getFunction(query.function);
        const resolvedDatasource = resolvedDatasources[i];

        if (resolvedDatasource.isRejected()) {
          if (resolvedDatasource.reason().isBoom) {
            throw resolvedDatasource.reason();
          } else {
            throwWithCell(query.cell, resolvedDatasource.reason());
          }
        }

        queryCache[functionDef.cacheKey(query)] = resolvedDatasource.value();
      });

      stats.cacheCount = _lodash.default.keys(queryCache).length;
      return sheet;
    });
  }

  function processRequest(request) {
    if (!request) throw new Error('Empty request body');
    (0, _validate_time.default)(request.time, tlConfig);
    tlConfig.time = request.time;
    tlConfig.time.to = (0, _moment.default)(request.time.to).valueOf();
    tlConfig.time.from = (0, _moment.default)(request.time.from).valueOf();
    tlConfig.time.interval = (0, _lib.calculateInterval)(tlConfig.time.from, tlConfig.time.to, tlConfig.settings['timelion:target_buckets'] || 200, tlConfig.time.interval, tlConfig.settings['timelion:min_interval'] || '1ms');
    tlConfig.setTargetSeries();
    stats.invokeTime = new Date().getTime();
    stats.queryCount = 0;
    queryCache = {}; // This is setting the "global" sheet, required for resolving references

    sheet = (0, _parse_sheet.default)(request.sheet);
    return preProcessSheet(sheet).then(function () {
      return _lodash.default.map(sheet, function (chainList, i) {
        return resolveChainList(chainList).then(function (seriesList) {
          stats.sheetTime = new Date().getTime();
          return seriesList;
        }).catch(function (e) {
          throwWithCell(i, e);
        });
      });
    });
  }

  return {
    processRequest: processRequest,
    getStats: function () {
      return stats;
    }
  };
}

module.exports = exports.default;