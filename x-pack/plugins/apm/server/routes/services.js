"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceDependenciesRoute = exports.serviceInstancesRoute = exports.serviceThroughputRoute = exports.serviceErrorGroupsRoute = exports.serviceAnnotationsCreateRoute = exports.serviceAnnotationsRoute = exports.serviceNodeMetadataRoute = exports.serviceTransactionTypesRoute = exports.serviceAgentNameRoute = exports.serviceMetadataIconsRoute = exports.serviceMetadataDetailsRoute = exports.servicesRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

var _iso_to_epoch_rt = require("../../common/runtime_types/iso_to_epoch_rt");

var _to_number_rt = require("../../common/runtime_types/to_number_rt");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");

var _setup_request = require("../lib/helpers/setup_request");

var _annotations = require("../lib/services/annotations");

var _get_services = require("../lib/services/get_services");

var _get_service_agent_name = require("../lib/services/get_service_agent_name");

var _get_service_dependencies = require("../lib/services/get_service_dependencies");

var _get_service_error_groups = require("../lib/services/get_service_error_groups");

var _get_service_instances = require("../lib/services/get_service_instances");

var _get_service_metadata_details = require("../lib/services/get_service_metadata_details");

var _get_service_metadata_icons = require("../lib/services/get_service_metadata_icons");

var _get_service_node_metadata = require("../lib/services/get_service_node_metadata");

var _get_service_transaction_types = require("../lib/services/get_service_transaction_types");

var _get_throughput = require("../lib/services/get_throughput");

var _offset_previous_period_coordinate = require("../utils/offset_previous_period_coordinate");

var _create_route = require("./create_route");

var _default_api_types = require("./default_api_types");

var _with_apm_span = require("../utils/with_apm_span");

var _latency_aggregation_types = require("../../common/latency_aggregation_types");

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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const servicesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt])
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
      environment
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    const services = await (0, _get_services.getServices)({
      environment,
      setup,
      searchAggregatedTransactions,
      logger: context.logger
    });
    return services;
  }
});
exports.servicesRoute = servicesRoute;
const serviceMetadataDetailsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/metadata/details',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: _default_api_types.rangeRt
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
      serviceName
    } = context.params.path;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _get_service_metadata_details.getServiceMetadataDetails)({
      serviceName,
      setup,
      searchAggregatedTransactions
    });
  }
});
exports.serviceMetadataDetailsRoute = serviceMetadataDetailsRoute;
const serviceMetadataIconsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/metadata/icons',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: _default_api_types.rangeRt
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
      serviceName
    } = context.params.path;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _get_service_metadata_icons.getServiceMetadataIcons)({
      serviceName,
      setup,
      searchAggregatedTransactions
    });
  }
});
exports.serviceMetadataIconsRoute = serviceMetadataIconsRoute;
const serviceAgentNameRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/agent_name',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: _default_api_types.rangeRt
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
      serviceName
    } = context.params.path;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _get_service_agent_name.getServiceAgentName)({
      serviceName,
      setup,
      searchAggregatedTransactions
    });
  }
});
exports.serviceAgentNameRoute = serviceAgentNameRoute;
const serviceTransactionTypesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transaction_types',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: _default_api_types.rangeRt
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
      serviceName
    } = context.params.path;
    return (0, _get_service_transaction_types.getServiceTransactionTypes)({
      serviceName,
      setup,
      searchAggregatedTransactions: await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup)
    });
  }
});
exports.serviceTransactionTypesRoute = serviceTransactionTypesRoute;
const serviceNodeMetadataRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/node/{serviceNodeName}/metadata',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      serviceNodeName: t.string
    }),
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
    const {
      serviceName,
      serviceNodeName
    } = context.params.path;
    return (0, _get_service_node_metadata.getServiceNodeMetadata)({
      setup,
      serviceName,
      serviceNodeName
    });
  }
});
exports.serviceNodeMetadataRoute = serviceNodeMetadataRoute;
const serviceAnnotationsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/annotation/search',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.rangeRt, t.partial({
      environment: t.string
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
      serviceName
    } = context.params.path;
    const {
      environment
    } = context.params.query;
    const {
      observability
    } = context.plugins;
    const [annotationsClient, searchAggregatedTransactions] = await Promise.all([observability ? (0, _with_apm_span.withApmSpan)('get_scoped_annotations_client', () => observability.getScopedAnnotationsClient(context, request)) : undefined, (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup)]);
    return (0, _annotations.getServiceAnnotations)({
      setup,
      searchAggregatedTransactions,
      serviceName,
      environment,
      annotationsClient,
      client: context.core.elasticsearch.client.asCurrentUser,
      logger: context.logger
    });
  }
});
exports.serviceAnnotationsRoute = serviceAnnotationsRoute;
const serviceAnnotationsCreateRoute = (0, _create_route.createRoute)({
  endpoint: 'POST /api/apm/services/{serviceName}/annotation',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    body: t.intersection([t.type({
      '@timestamp': _iso_to_epoch_rt.isoToEpochRt,
      service: t.intersection([t.type({
        version: t.string
      }), t.partial({
        environment: t.string
      })])
    }), t.partial({
      message: t.string,
      tags: t.array(t.string)
    })])
  }),
  handler: async ({
    request,
    context
  }) => {
    const {
      observability
    } = context.plugins;
    const annotationsClient = observability ? await (0, _with_apm_span.withApmSpan)('get_scoped_annotations_client', () => observability.getScopedAnnotationsClient(context, request)) : undefined;

    if (!annotationsClient) {
      throw _boom.default.notFound();
    }

    const {
      body,
      path
    } = context.params;
    return (0, _with_apm_span.withApmSpan)('create_annotation', () => {
      var _body$tags;

      return annotationsClient.create({
        message: body.service.version,
        ...body,
        '@timestamp': new Date(body['@timestamp']).toISOString(),
        annotation: {
          type: 'deployment'
        },
        service: { ...body.service,
          name: path.serviceName
        },
        tags: (0, _lodash.uniq)(['apm'].concat((_body$tags = body.tags) !== null && _body$tags !== void 0 ? _body$tags : []))
      });
    });
  }
});
exports.serviceAnnotationsCreateRoute = serviceAnnotationsCreateRoute;
const serviceErrorGroupsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/error_groups',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.uiFiltersRt, t.type({
      size: _to_number_rt.toNumberRt,
      numBuckets: _to_number_rt.toNumberRt,
      pageIndex: _to_number_rt.toNumberRt,
      sortDirection: t.union([t.literal('asc'), t.literal('desc')]),
      sortField: t.union([t.literal('last_seen'), t.literal('occurrences'), t.literal('name')]),
      transactionType: t.string
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
      path: {
        serviceName
      },
      query: {
        environment,
        numBuckets,
        pageIndex,
        size,
        sortDirection,
        sortField,
        transactionType
      }
    } = context.params;
    return (0, _get_service_error_groups.getServiceErrorGroups)({
      environment,
      serviceName,
      setup,
      size,
      numBuckets,
      pageIndex,
      sortDirection,
      sortField,
      transactionType
    });
  }
});
exports.serviceErrorGroupsRoute = serviceErrorGroupsRoute;
const serviceThroughputRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/throughput',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt])
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
      serviceName
    } = context.params.path;
    const {
      environment,
      transactionType,
      comparisonStart,
      comparisonEnd
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    const {
      start,
      end
    } = setup;
    const commonProps = {
      searchAggregatedTransactions,
      serviceName,
      setup,
      transactionType
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_throughput.getThroughput)({ ...commonProps,
      environment,
      start,
      end
    }), comparisonStart && comparisonEnd ? (0, _get_throughput.getThroughput)({ ...commonProps,
      environment,
      start: comparisonStart,
      end: comparisonEnd
    }).then(coordinates => (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
      currentPeriodStart: start,
      previousPeriodStart: comparisonStart,
      previousPeriodTimeseries: coordinates
    })) : []]);
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
exports.serviceThroughputRoute = serviceThroughputRoute;
const serviceInstancesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/service_overview_instances',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt,
      transactionType: t.string,
      numBuckets: _to_number_rt.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt])
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
      serviceName
    } = context.params.path;
    const {
      environment,
      transactionType,
      numBuckets
    } = context.params.query;
    const latencyAggregationType = context.params.query.latencyAggregationType;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _get_service_instances.getServiceInstances)({
      environment,
      latencyAggregationType,
      serviceName,
      setup,
      transactionType,
      searchAggregatedTransactions,
      numBuckets
    });
  }
});
exports.serviceInstancesRoute = serviceInstancesRoute;
const serviceDependenciesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/dependencies',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      numBuckets: _to_number_rt.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.rangeRt])
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
      serviceName
    } = context.params.path;
    const {
      environment,
      numBuckets
    } = context.params.query;
    return (0, _get_service_dependencies.getServiceDependencies)({
      serviceName,
      environment,
      setup,
      numBuckets
    });
  }
});
exports.serviceDependenciesRoute = serviceDependenciesRoute;