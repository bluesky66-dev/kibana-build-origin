"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rumOverviewLocalFiltersRoute = exports.rumHasDataRoute = exports.rumJSErrors = exports.rumUrlSearch = exports.rumLongTaskMetrics = exports.rumWebCoreVitals = exports.rumVisitorsBreakdownRoute = exports.rumServicesRoute = exports.rumPageViewsTrendRoute = exports.rumPageLoadDistBreakdownRoute = exports.rumPageLoadDistributionRoute = exports.rumClientMetricsRoute = exports.percentileRangeRt = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

var _json_rt = require("../../common/runtime_types/json_rt");

var _get_es_filter = require("../lib/helpers/convert_ui_filters/get_es_filter");

var _setup_request = require("../lib/helpers/setup_request");

var _get_client_metrics = require("../lib/rum_client/get_client_metrics");

var _get_js_errors = require("../lib/rum_client/get_js_errors");

var _get_long_task_metrics = require("../lib/rum_client/get_long_task_metrics");

var _get_page_load_distribution = require("../lib/rum_client/get_page_load_distribution");

var _get_page_view_trends = require("../lib/rum_client/get_page_view_trends");

var _get_pl_dist_breakdown = require("../lib/rum_client/get_pl_dist_breakdown");

var _get_rum_services = require("../lib/rum_client/get_rum_services");

var _get_url_search = require("../lib/rum_client/get_url_search");

var _get_visitor_breakdown = require("../lib/rum_client/get_visitor_breakdown");

var _get_web_core_vitals = require("../lib/rum_client/get_web_core_vitals");

var _has_rum_data = require("../lib/rum_client/has_rum_data");

var _local_ui_filters = require("../lib/rum_client/ui_filters/local_ui_filters");

var _config = require("../lib/rum_client/ui_filters/local_ui_filters/config");

var _rum_page_load_transactions = require("../projections/rum_page_load_transactions");

var _create_route = require("./create_route");

var _default_api_types = require("./default_api_types");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const percentileRangeRt = t.partial({
  minPercentile: t.string,
  maxPercentile: t.string
});
exports.percentileRangeRt = percentileRangeRt;
const uxQueryRt = t.intersection([_default_api_types.uiFiltersRt, _default_api_types.rangeRt, t.partial({
  urlQuery: t.string,
  percentile: t.string
})]);
const rumClientMetricsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum/client-metrics',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        urlQuery,
        percentile
      }
    } = context.params;
    return (0, _get_client_metrics.getClientMetrics)({
      setup,
      urlQuery,
      percentile: percentile ? Number(percentile) : undefined
    });
  }
});
exports.rumClientMetricsRoute = rumClientMetricsRoute;
const rumPageLoadDistributionRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/page-load-distribution',
  params: t.type({
    query: t.intersection([uxQueryRt, percentileRangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        minPercentile,
        maxPercentile,
        urlQuery
      }
    } = context.params;
    return (0, _get_page_load_distribution.getPageLoadDistribution)({
      setup,
      minPercentile,
      maxPercentile,
      urlQuery
    });
  }
});
exports.rumPageLoadDistributionRoute = rumPageLoadDistributionRoute;
const rumPageLoadDistBreakdownRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/page-load-distribution/breakdown',
  params: t.type({
    query: t.intersection([uxQueryRt, percentileRangeRt, t.type({
      breakdown: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        minPercentile,
        maxPercentile,
        breakdown,
        urlQuery
      }
    } = context.params;
    return (0, _get_pl_dist_breakdown.getPageLoadDistBreakdown)({
      setup,
      minPercentile: Number(minPercentile),
      maxPercentile: Number(maxPercentile),
      breakdown,
      urlQuery
    });
  }
});
exports.rumPageLoadDistBreakdownRoute = rumPageLoadDistBreakdownRoute;
const rumPageViewsTrendRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/page-view-trends',
  params: t.type({
    query: t.intersection([uxQueryRt, t.partial({
      breakdowns: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        breakdowns,
        urlQuery
      }
    } = context.params;
    return (0, _get_page_view_trends.getPageViewTrends)({
      setup,
      breakdowns,
      urlQuery
    });
  }
});
exports.rumPageViewsTrendRoute = rumPageViewsTrendRoute;
const rumServicesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/services',
  params: t.type({
    query: t.intersection([_default_api_types.uiFiltersRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    return (0, _get_rum_services.getRumServices)({
      setup
    });
  }
});
exports.rumServicesRoute = rumServicesRoute;
const rumVisitorsBreakdownRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/visitor-breakdown',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        urlQuery
      }
    } = context.params;
    return (0, _get_visitor_breakdown.getVisitorBreakdown)({
      setup,
      urlQuery
    });
  }
});
exports.rumVisitorsBreakdownRoute = rumVisitorsBreakdownRoute;
const rumWebCoreVitals = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/web-core-vitals',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        urlQuery,
        percentile
      }
    } = context.params;
    return (0, _get_web_core_vitals.getWebCoreVitals)({
      setup,
      urlQuery,
      percentile: percentile ? Number(percentile) : undefined
    });
  }
});
exports.rumWebCoreVitals = rumWebCoreVitals;
const rumLongTaskMetrics = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/long-task-metrics',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        urlQuery,
        percentile
      }
    } = context.params;
    return (0, _get_long_task_metrics.getLongTaskMetrics)({
      setup,
      urlQuery,
      percentile: percentile ? Number(percentile) : undefined
    });
  }
});
exports.rumLongTaskMetrics = rumLongTaskMetrics;
const rumUrlSearch = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/url-search',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        urlQuery,
        percentile
      }
    } = context.params;
    return (0, _get_url_search.getUrlSearch)({
      setup,
      urlQuery,
      percentile: Number(percentile)
    });
  }
});
exports.rumUrlSearch = rumUrlSearch;
const rumJSErrors = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/rum-client/js-errors',
  params: t.type({
    query: t.intersection([_default_api_types.uiFiltersRt, _default_api_types.rangeRt, t.type({
      pageSize: t.string,
      pageIndex: t.string
    }), t.partial({
      urlQuery: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        pageSize,
        pageIndex,
        urlQuery
      }
    } = context.params;
    return (0, _get_js_errors.getJSErrors)({
      setup,
      urlQuery,
      pageSize: Number(pageSize),
      pageIndex: Number(pageIndex)
    });
  }
});
exports.rumJSErrors = rumJSErrors;
const rumHasDataRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/observability_overview/has_rum_data',
  params: t.type({
    query: t.intersection([_default_api_types.uiFiltersRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    return await (0, _has_rum_data.hasRumData)({
      setup
    });
  }
}); // Everything below here was originally in ui_filters.ts but now is here, since
// UX is the only part of APM using UI filters now.

exports.rumHasDataRoute = rumHasDataRoute;
const filterNamesRt = t.type({
  filterNames: _json_rt.jsonRt.pipe(t.array(t.keyof(Object.fromEntries(_config.localUIFilterNames.map(filterName => [filterName, null])))))
});
const localUiBaseQueryRt = t.intersection([filterNamesRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt]);

function createLocalFiltersRoute({
  endpoint,
  getProjection,
  queryRt
}) {
  return (0, _create_route.createRoute)({
    endpoint,
    params: t.type({
      query: t.intersection([localUiBaseQueryRt, queryRt])
    }),
    options: {
      tags: ['access:apm']
    },
    handler: async ({
      context,
      request
    }) => {
      const setup = await (0, _setup_request.setupRequest)(context, request);
      const {
        uiFilters
      } = setup;
      const {
        query
      } = context.params;
      const {
        filterNames
      } = query;
      const projection = await getProjection({
        query,
        context,
        setup: { ...setup,
          esFilter: (0, _get_es_filter.getEsFilter)((0, _lodash.omit)(uiFilters, filterNames))
        }
      });
      return (0, _local_ui_filters.getLocalUIFilters)({
        projection,
        setup,
        uiFilters,
        localFilterNames: filterNames
      });
    }
  });
}

const rumOverviewLocalFiltersRoute = createLocalFiltersRoute({
  endpoint: 'GET /api/apm/rum/local_filters',
  getProjection: async ({
    setup
  }) => {
    return (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
      setup
    });
  },
  queryRt: t.type({})
});
exports.rumOverviewLocalFiltersRoute = rumOverviewLocalFiltersRoute;