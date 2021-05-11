"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMetadataDetails = getServiceMetadataDetails;

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _queries = require("../../../common/utils/queries");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _get_service_metadata_icons = require("./get_service_metadata_icons");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceMetadataDetails({
  serviceName,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_metadata_details', async () => {
    var _response$aggregation, _service$framework, _response$aggregation2, _host$os, _cloud$project, _response$aggregation3, _response$aggregation4;

    const {
      start,
      end,
      apmEventClient
    } = setup;
    const filter = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, ...(0, _queries.rangeQuery)(start, end)];
    const params = {
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 1,
        _source: [_elasticsearch_fieldnames.SERVICE, _elasticsearch_fieldnames.AGENT, _elasticsearch_fieldnames.HOST, _elasticsearch_fieldnames.CONTAINER_ID, _elasticsearch_fieldnames.KUBERNETES, _elasticsearch_fieldnames.CLOUD],
        query: {
          bool: {
            filter,
            should: _get_service_metadata_icons.should
          }
        },
        aggs: {
          serviceVersions: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_VERSION,
              size: 10,
              order: {
                _key: 'desc'
              }
            }
          },
          availabilityZones: {
            terms: {
              field: _elasticsearch_fieldnames.CLOUD_AVAILABILITY_ZONE,
              size: 10
            }
          },
          machineTypes: {
            terms: {
              field: _elasticsearch_fieldnames.CLOUD_MACHINE_TYPE,
              size: 10
            }
          },
          totalNumberInstances: {
            cardinality: {
              field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
            }
          }
        }
      }
    };
    const response = await apmEventClient.search(params);

    if (response.hits.total.value === 0) {
      return {
        service: undefined,
        container: undefined,
        cloud: undefined
      };
    }

    const {
      service,
      agent,
      host,
      kubernetes,
      container,
      cloud
    } = response.hits.hits[0]._source;
    const serviceMetadataDetails = {
      versions: (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.serviceVersions.buckets.map(bucket => bucket.key),
      runtime: service.runtime,
      framework: (_service$framework = service.framework) === null || _service$framework === void 0 ? void 0 : _service$framework.name,
      agent
    };
    const totalNumberInstances = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.totalNumberInstances.value;
    const containerDetails = host || container || totalNumberInstances || kubernetes ? {
      os: host === null || host === void 0 ? void 0 : (_host$os = host.os) === null || _host$os === void 0 ? void 0 : _host$os.platform,
      type: !!kubernetes ? 'Kubernetes' : 'Docker',
      isContainerized: !!(container !== null && container !== void 0 && container.id),
      totalNumberInstances
    } : undefined;
    const cloudDetails = cloud ? {
      provider: cloud.provider,
      projectName: (_cloud$project = cloud.project) === null || _cloud$project === void 0 ? void 0 : _cloud$project.name,
      availabilityZones: (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.availabilityZones.buckets.map(bucket => bucket.key),
      machineTypes: (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.machineTypes.buckets.map(bucket => bucket.key)
    } : undefined;
    return {
      service: serviceMetadataDetails,
      container: containerDetails,
      cloud: cloudDetails
    };
  });
}