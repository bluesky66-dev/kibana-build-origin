"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggsCommonService = exports.aggsRequiredUiSettings = void 0;

var _common = require("../../../common");

var _ = require("./");

var _time_column_meta = require("./utils/time_column_meta");

var _datatable_column_meta = require("./utils/datatable_column_meta");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
const aggsRequiredUiSettings = ['dateFormat', 'dateFormat:scaled', 'dateFormat:tz', _common.UI_SETTINGS.HISTOGRAM_BAR_TARGET, _common.UI_SETTINGS.HISTOGRAM_MAX_BARS, _common.UI_SETTINGS.SEARCH_QUERY_LANGUAGE, _common.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS, _common.UI_SETTINGS.QUERY_STRING_OPTIONS, _common.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX];
/** @internal */

exports.aggsRequiredUiSettings = aggsRequiredUiSettings;

/**
 * The aggs service provides a means of modeling and manipulating the various
 * Elasticsearch aggregations supported by Kibana, providing the ability to
 * output the correct DSL when you are ready to send your request to ES.
 */
class AggsCommonService {
  constructor() {
    _defineProperty(this, "aggTypesRegistry", new _.AggTypesRegistry());
  }

  setup({
    registerFunction
  }) {
    const aggTypesSetup = this.aggTypesRegistry.setup(); // register each agg type

    const aggTypes = (0, _.getAggTypes)();
    aggTypes.buckets.forEach(({
      name,
      fn
    }) => aggTypesSetup.registerBucket(name, fn));
    aggTypes.metrics.forEach(({
      name,
      fn
    }) => aggTypesSetup.registerMetric(name, fn)); // register expression functions for each agg type

    const aggFunctions = (0, _.getAggTypesFunctions)();
    aggFunctions.forEach(fn => registerFunction(fn));
    return {
      types: aggTypesSetup
    };
  }

  start({
    getConfig,
    getIndexPattern,
    isDefaultTimezone
  }) {
    const aggTypesStart = this.aggTypesRegistry.start();
    const calculateAutoTimeExpression = (0, _.getCalculateAutoTimeExpression)(getConfig);

    const createAggConfigs = (indexPattern, configStates) => {
      return new _.AggConfigs(indexPattern, configStates, {
        typesRegistry: aggTypesStart
      });
    };

    return {
      calculateAutoTimeExpression,
      getDateMetaByDatatableColumn: (0, _time_column_meta.getDateMetaByDatatableColumn)({
        calculateAutoTimeExpression,
        getIndexPattern,
        getConfig,
        isDefaultTimezone
      }),
      datatableUtilities: (0, _datatable_column_meta.getDatatableColumnUtilities)({
        getIndexPattern,
        createAggConfigs,
        aggTypesStart
      }),
      createAggConfigs,
      types: aggTypesStart
    };
  }

}

exports.AggsCommonService = AggsCommonService;