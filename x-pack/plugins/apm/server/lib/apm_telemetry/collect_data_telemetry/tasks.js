"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tasks = void 0;

var _lodash = require("lodash");

var _processor_event = require("../../../../common/processor_event");

var _agent_name = require("../../../../common/agent_name");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TIME_RANGES = ['1d', 'all'];
const range1d = {
  range: {
    '@timestamp': {
      gte: 'now-1d'
    }
  }
};
const timeout = '5m';
const tasks = [{
  name: 'aggregated_transactions',
  // Record the number of metric documents we can expect in different scenarios. We simulate this by requesting data for 1m,
  // adding a composite aggregation on a number of fields and counting the number of buckets. The resulting count is an
  // approximation of the amount of metric documents that will be created. We record both the expected metric document count plus
  // the transaction count for that time range.
  executor: async ({
    indices,
    search
  }) => {
    async function getBucketCountFromPaginatedQuery(sources, prevResult, after) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let {
        expected_metric_document_count
      } = prevResult !== null && prevResult !== void 0 ? prevResult : {
        transaction_count: 0,
        expected_metric_document_count: 0
      };
      const params = {
        index: [indices['apm_oss.transactionIndices']],
        body: {
          size: 0,
          timeout,
          query: {
            bool: {
              filter: [{
                term: {
                  [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
                }
              }, {
                range: {
                  '@timestamp': {
                    gte: start,
                    lt: end
                  }
                }
              }]
            }
          },
          track_total_hits: true,
          aggs: {
            transaction_metric_groups: {
              composite: { ...(after ? {
                  after
                } : {}),
                size: 10000,
                sources: sources.map((source, index) => {
                  return {
                    [index]: source
                  };
                })
              }
            }
          }
        }
      };
      const result = await search(params);
      let nextAfter;

      if (result.aggregations) {
        nextAfter = result.aggregations.transaction_metric_groups.after_key;
        expected_metric_document_count += result.aggregations.transaction_metric_groups.buckets.length;
      }

      if (nextAfter) {
        return await getBucketCountFromPaginatedQuery(sources, {
          expected_metric_document_count,
          transaction_count: result.hits.total.value
        }, nextAfter);
      }

      return {
        expected_metric_document_count,
        transaction_count: result.hits.total.value,
        ratio: expected_metric_document_count / result.hits.total.value
      };
    } // fixed date range for reliable results


    const lastTransaction = (await search({
      index: indices['apm_oss.transactionIndices'],
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
              }
            }]
          }
        },
        size: 1,
        sort: {
          '@timestamp': 'desc'
        }
      }
    })).hits.hits[0];

    if (!lastTransaction) {
      return {};
    }

    const end = new Date(lastTransaction._source['@timestamp']).getTime() - 5 * 60 * 1000;
    const start = end - 60 * 1000;
    const simpleTermFields = [_elasticsearch_fieldnames.TRANSACTION_NAME, _elasticsearch_fieldnames.TRANSACTION_RESULT, _elasticsearch_fieldnames.TRANSACTION_TYPE, _elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.SERVICE_ENVIRONMENT, _elasticsearch_fieldnames.SERVICE_VERSION, _elasticsearch_fieldnames.HOST_NAME, _elasticsearch_fieldnames.CONTAINER_ID, _elasticsearch_fieldnames.POD_NAME].map(field => ({
      terms: {
        field,
        missing_bucket: true
      }
    }));
    const observerHostname = {
      terms: {
        field: _elasticsearch_fieldnames.OBSERVER_HOSTNAME,
        missing_bucket: true
      }
    };
    const baseFields = [...simpleTermFields, // user_agent.name only for page-load transactions
    {
      terms: {
        script: `
              if (doc['transaction.type'].value == 'page-load' && doc['user_agent.name'].size() > 0) {
                return doc['user_agent.name'].value;
              }

              return null;
            `,
        missing_bucket: true
      }
    }, // transaction.root
    {
      terms: {
        script: `return doc['parent.id'].size() == 0`,
        missing_bucket: true
      }
    }];
    const results = {
      current_implementation: await getBucketCountFromPaginatedQuery([...baseFields, observerHostname]),
      with_country: await getBucketCountFromPaginatedQuery([...baseFields, observerHostname, {
        terms: {
          script: `
                if (doc['transaction.type'].value == 'page-load' && doc['client.geo.country_iso_code'].size() > 0) {
                  return doc['client.geo.country_iso_code'].value;
                }
                return null;
              `,
          missing_bucket: true
        }
      }]),
      no_observer_name: await getBucketCountFromPaginatedQuery(baseFields)
    };
    return {
      aggregated_transactions: results
    };
  }
}, {
  name: 'cloud',
  executor: async ({
    indices,
    search
  }) => {
    function getBucketKeys({
      buckets
    }) {
      return buckets.map(bucket => bucket.key);
    }

    const az = 'availability_zone';
    const region = 'region';
    const provider = 'provider';
    const response = await search({
      index: [indices['apm_oss.errorIndices'], indices['apm_oss.metricsIndices'], indices['apm_oss.spanIndices'], indices['apm_oss.transactionIndices']],
      body: {
        size: 0,
        timeout,
        aggs: {
          [az]: {
            terms: {
              field: _elasticsearch_fieldnames.CLOUD_AVAILABILITY_ZONE
            }
          },
          [provider]: {
            terms: {
              field: _elasticsearch_fieldnames.CLOUD_PROVIDER
            }
          },
          [region]: {
            terms: {
              field: _elasticsearch_fieldnames.CLOUD_REGION
            }
          }
        }
      }
    });
    const {
      aggregations
    } = response;

    if (!aggregations) {
      return {
        cloud: {
          [az]: [],
          [provider]: [],
          [region]: []
        }
      };
    }

    const cloud = {
      [az]: getBucketKeys(aggregations[az]),
      [provider]: getBucketKeys(aggregations[provider]),
      [region]: getBucketKeys(aggregations[region])
    };
    return {
      cloud
    };
  }
}, {
  name: 'environments',
  executor: async ({
    indices,
    search
  }) => {
    var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4;

    const response = await search({
      index: [indices['apm_oss.transactionIndices']],
      body: {
        query: {
          bool: {
            filter: [{
              range: {
                '@timestamp': {
                  gte: 'now-1d'
                }
              }
            }]
          }
        },
        aggs: {
          environments: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
              size: 5
            }
          },
          service_environments: {
            composite: {
              size: 1000,
              sources: [{
                [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                    missing_bucket: true
                  }
                }
              }, {
                [_elasticsearch_fieldnames.SERVICE_NAME]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_NAME
                  }
                }
              }]
            }
          }
        }
      }
    });
    const topEnvironments = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.environments.buckets.map(bucket => bucket.key)) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
    const serviceEnvironments = {};
    const buckets = (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.service_environments.buckets) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : [];
    buckets.forEach(bucket => {
      var _serviceEnvironments$;

      const serviceName = bucket.key['service.name'];
      const environment = bucket.key['service.environment'];
      const environments = (_serviceEnvironments$ = serviceEnvironments[serviceName]) !== null && _serviceEnvironments$ !== void 0 ? _serviceEnvironments$ : [];
      serviceEnvironments[serviceName] = environments.concat(environment);
    });
    const servicesWithoutEnvironment = Object.keys((0, _lodash.pickBy)(serviceEnvironments, environments => environments.includes(null)));
    const servicesWithMultipleEnvironments = Object.keys((0, _lodash.pickBy)(serviceEnvironments, environments => environments.length > 1));
    return {
      environments: {
        services_without_environment: servicesWithoutEnvironment.length,
        services_with_multiple_environments: servicesWithMultipleEnvironments.length,
        top_environments: topEnvironments
      }
    };
  }
}, {
  name: 'processor_events',
  executor: async ({
    indices,
    search
  }) => {
    const indicesByProcessorEvent = {
      error: indices['apm_oss.errorIndices'],
      metric: indices['apm_oss.metricsIndices'],
      span: indices['apm_oss.spanIndices'],
      transaction: indices['apm_oss.transactionIndices'],
      onboarding: indices['apm_oss.onboardingIndices'],
      sourcemap: indices['apm_oss.sourcemapIndices']
    };
    const events = Object.keys(indicesByProcessorEvent);
    const jobs = events.flatMap(processorEvent => TIME_RANGES.map(timeRange => ({
      processorEvent,
      timeRange
    })));
    const allData = await jobs.reduce((prevJob, current) => {
      return prevJob.then(async data => {
        var _retainmentResponse$h;

        const {
          processorEvent,
          timeRange
        } = current;
        const totalHitsResponse = await search({
          index: indicesByProcessorEvent[processorEvent],
          body: {
            size: 0,
            timeout,
            query: {
              bool: {
                filter: [{
                  term: {
                    [_elasticsearch_fieldnames.PROCESSOR_EVENT]: processorEvent
                  }
                }, ...(timeRange === '1d' ? [range1d] : [])]
              }
            },
            track_total_hits: true
          }
        });
        const retainmentResponse = timeRange === 'all' ? await search({
          index: indicesByProcessorEvent[processorEvent],
          body: {
            timeout,
            query: {
              bool: {
                filter: [{
                  term: {
                    [_elasticsearch_fieldnames.PROCESSOR_EVENT]: processorEvent
                  }
                }]
              }
            },
            sort: {
              '@timestamp': 'asc'
            },
            _source: ['@timestamp']
          }
        }) : null;
        const event = retainmentResponse === null || retainmentResponse === void 0 ? void 0 : (_retainmentResponse$h = retainmentResponse.hits.hits[0]) === null || _retainmentResponse$h === void 0 ? void 0 : _retainmentResponse$h._source;
        return (0, _lodash.merge)({}, data, {
          counts: {
            [processorEvent]: {
              [timeRange]: totalHitsResponse.hits.total.value
            }
          },
          ...(event ? {
            retainment: {
              [processorEvent]: {
                ms: new Date().getTime() - new Date(event['@timestamp']).getTime()
              }
            }
          } : {})
        });
      });
    }, Promise.resolve({}));
    return allData;
  }
}, {
  name: 'agent_configuration',
  executor: async ({
    indices,
    search
  }) => {
    const agentConfigurationCount = (await search({
      index: indices.apmAgentConfigurationIndex,
      body: {
        size: 0,
        timeout,
        track_total_hits: true
      }
    })).hits.total.value;
    return {
      counts: {
        agent_configuration: {
          all: agentConfigurationCount
        }
      }
    };
  }
}, {
  name: 'services',
  executor: async ({
    indices,
    search
  }) => {
    const servicesPerAgent = await _agent_name.AGENT_NAMES.reduce((prevJob, agentName) => {
      return prevJob.then(async data => {
        var _response$aggregation5;

        const response = await search({
          index: [indices['apm_oss.errorIndices'], indices['apm_oss.spanIndices'], indices['apm_oss.metricsIndices'], indices['apm_oss.transactionIndices']],
          body: {
            size: 0,
            timeout,
            query: {
              bool: {
                filter: [{
                  term: {
                    [_elasticsearch_fieldnames.AGENT_NAME]: agentName
                  }
                }, range1d]
              }
            },
            aggs: {
              services: {
                cardinality: {
                  field: _elasticsearch_fieldnames.SERVICE_NAME
                }
              }
            }
          }
        });
        return { ...data,
          [agentName]: ((_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.services.value) || 0
        };
      });
    }, Promise.resolve({}));
    return {
      has_any_services: (0, _lodash.sum)(Object.values(servicesPerAgent)) > 0,
      services_per_agent: servicesPerAgent
    };
  }
}, {
  name: 'versions',
  executor: async ({
    search,
    indices
  }) => {
    var _response$hits$hits$, _hit$observer;

    const response = await search({
      index: [indices['apm_oss.transactionIndices'], indices['apm_oss.spanIndices'], indices['apm_oss.errorIndices']],
      terminateAfter: 1,
      body: {
        query: {
          exists: {
            field: 'observer.version'
          }
        },
        size: 1,
        timeout,
        sort: {
          '@timestamp': 'desc'
        }
      }
    });
    const hit = (_response$hits$hits$ = response.hits.hits[0]) === null || _response$hits$hits$ === void 0 ? void 0 : _response$hits$hits$._source;

    if (!hit || !((_hit$observer = hit.observer) !== null && _hit$observer !== void 0 && _hit$observer.version)) {
      return {};
    }

    const [major, minor, patch] = hit.observer.version.split('.').map(part => Number(part));
    return {
      version: {
        apm_server: {
          major,
          minor,
          patch
        }
      }
    };
  }
}, {
  name: 'groupings',
  executor: async ({
    search,
    indices
  }) => {
    var _await$search$aggrega, _await$search$aggrega2, _await$search$aggrega3, _await$search$aggrega4, _await$search$aggrega5;

    const errorGroupsCount = (_await$search$aggrega = (await search({
      index: indices['apm_oss.errorIndices'],
      body: {
        size: 0,
        timeout,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.error
              }
            }, range1d]
          }
        },
        aggs: {
          top_service: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_NAME,
              order: {
                error_groups: 'desc'
              },
              size: 1
            },
            aggs: {
              error_groups: {
                cardinality: {
                  field: _elasticsearch_fieldnames.ERROR_GROUP_ID
                }
              }
            }
          }
        }
      }
    })).aggregations) === null || _await$search$aggrega === void 0 ? void 0 : (_await$search$aggrega2 = _await$search$aggrega.top_service.buckets[0]) === null || _await$search$aggrega2 === void 0 ? void 0 : _await$search$aggrega2.error_groups.value;
    const transactionGroupsCount = (_await$search$aggrega3 = (await search({
      index: indices['apm_oss.transactionIndices'],
      body: {
        size: 0,
        timeout,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
              }
            }, range1d]
          }
        },
        aggs: {
          top_service: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_NAME,
              order: {
                transaction_groups: 'desc'
              },
              size: 1
            },
            aggs: {
              transaction_groups: {
                cardinality: {
                  field: _elasticsearch_fieldnames.TRANSACTION_NAME
                }
              }
            }
          }
        }
      }
    })).aggregations) === null || _await$search$aggrega3 === void 0 ? void 0 : (_await$search$aggrega4 = _await$search$aggrega3.top_service.buckets[0]) === null || _await$search$aggrega4 === void 0 ? void 0 : _await$search$aggrega4.transaction_groups.value;
    const tracesPerDayCount = (await search({
      index: indices['apm_oss.transactionIndices'],
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
              }
            }, range1d],
            must_not: {
              exists: {
                field: _elasticsearch_fieldnames.PARENT_ID
              }
            }
          }
        },
        track_total_hits: true,
        size: 0,
        timeout
      }
    })).hits.total.value;
    const servicesCount = (_await$search$aggrega5 = (await search({
      index: [indices['apm_oss.transactionIndices'], indices['apm_oss.errorIndices'], indices['apm_oss.metricsIndices']],
      body: {
        size: 0,
        timeout,
        query: {
          bool: {
            filter: [range1d]
          }
        },
        aggs: {
          service_name: {
            cardinality: {
              field: _elasticsearch_fieldnames.SERVICE_NAME
            }
          }
        }
      }
    })).aggregations) === null || _await$search$aggrega5 === void 0 ? void 0 : _await$search$aggrega5.service_name.value;
    return {
      counts: {
        max_error_groups_per_service: {
          '1d': errorGroupsCount || 0
        },
        max_transaction_groups_per_service: {
          '1d': transactionGroupsCount || 0
        },
        traces: {
          '1d': tracesPerDayCount || 0
        },
        services: {
          '1d': servicesCount || 0
        }
      }
    };
  }
}, {
  name: 'integrations',
  executor: async ({
    transportRequest
  }) => {
    var _response$body$count, _response$body;

    const apmJobs = ['apm-*', '*-high_mean_response_time'];
    const response = await transportRequest({
      method: 'get',
      path: `/_ml/anomaly_detectors/${apmJobs.join(',')}`
    });
    return {
      integrations: {
        ml: {
          all_jobs_count: (_response$body$count = (_response$body = response.body) === null || _response$body === void 0 ? void 0 : _response$body.count) !== null && _response$body$count !== void 0 ? _response$body$count : 0
        }
      }
    };
  }
}, {
  name: 'agents',
  executor: async ({
    search,
    indices
  }) => {
    const size = 3;
    const agentData = await _agent_name.AGENT_NAMES.reduce(async (prevJob, agentName) => {
      const data = await prevJob;
      const response = await search({
        index: [indices['apm_oss.errorIndices'], indices['apm_oss.metricsIndices'], indices['apm_oss.transactionIndices']],
        body: {
          size: 0,
          timeout,
          query: {
            bool: {
              filter: [{
                term: {
                  [_elasticsearch_fieldnames.AGENT_NAME]: agentName
                }
              }, range1d]
            }
          },
          sort: {
            '@timestamp': 'desc'
          },
          aggs: {
            [_elasticsearch_fieldnames.AGENT_VERSION]: {
              terms: {
                field: _elasticsearch_fieldnames.AGENT_VERSION,
                size
              }
            },
            [_elasticsearch_fieldnames.SERVICE_FRAMEWORK_NAME]: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_FRAMEWORK_NAME,
                size
              },
              aggs: {
                [_elasticsearch_fieldnames.SERVICE_FRAMEWORK_VERSION]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_FRAMEWORK_VERSION,
                    size
                  }
                }
              }
            },
            [_elasticsearch_fieldnames.SERVICE_FRAMEWORK_VERSION]: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_FRAMEWORK_VERSION,
                size
              }
            },
            [_elasticsearch_fieldnames.SERVICE_LANGUAGE_NAME]: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_LANGUAGE_NAME,
                size
              },
              aggs: {
                [_elasticsearch_fieldnames.SERVICE_LANGUAGE_VERSION]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_LANGUAGE_VERSION,
                    size
                  }
                }
              }
            },
            [_elasticsearch_fieldnames.SERVICE_LANGUAGE_VERSION]: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_LANGUAGE_VERSION,
                size
              }
            },
            [_elasticsearch_fieldnames.SERVICE_RUNTIME_NAME]: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_RUNTIME_NAME,
                size
              },
              aggs: {
                [_elasticsearch_fieldnames.SERVICE_RUNTIME_VERSION]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_RUNTIME_VERSION,
                    size
                  }
                }
              }
            },
            [_elasticsearch_fieldnames.SERVICE_RUNTIME_VERSION]: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_RUNTIME_VERSION,
                size
              }
            }
          }
        }
      });
      const {
        aggregations
      } = response;

      if (!aggregations) {
        return data;
      }

      const toComposite = (outerKey, innerKey) => `${outerKey}/${innerKey}`;

      return { ...data,
        [agentName]: {
          agent: {
            version: aggregations[_elasticsearch_fieldnames.AGENT_VERSION].buckets.map(bucket => bucket.key)
          },
          service: {
            framework: {
              name: aggregations[_elasticsearch_fieldnames.SERVICE_FRAMEWORK_NAME].buckets.map(bucket => bucket.key).slice(0, size),
              version: aggregations[_elasticsearch_fieldnames.SERVICE_FRAMEWORK_VERSION].buckets.map(bucket => bucket.key).slice(0, size),
              composite: (0, _lodash.sortBy)((0, _lodash.flatten)(aggregations[_elasticsearch_fieldnames.SERVICE_FRAMEWORK_NAME].buckets.map(bucket => bucket[_elasticsearch_fieldnames.SERVICE_FRAMEWORK_VERSION].buckets.map(versionBucket => ({
                doc_count: versionBucket.doc_count,
                name: toComposite(bucket.key, versionBucket.key)
              })))), 'doc_count').reverse().slice(0, size).map(composite => composite.name)
            },
            language: {
              name: aggregations[_elasticsearch_fieldnames.SERVICE_LANGUAGE_NAME].buckets.map(bucket => bucket.key).slice(0, size),
              version: aggregations[_elasticsearch_fieldnames.SERVICE_LANGUAGE_VERSION].buckets.map(bucket => bucket.key).slice(0, size),
              composite: (0, _lodash.sortBy)((0, _lodash.flatten)(aggregations[_elasticsearch_fieldnames.SERVICE_LANGUAGE_NAME].buckets.map(bucket => bucket[_elasticsearch_fieldnames.SERVICE_LANGUAGE_VERSION].buckets.map(versionBucket => ({
                doc_count: versionBucket.doc_count,
                name: toComposite(bucket.key, versionBucket.key)
              })))), 'doc_count').reverse().slice(0, size).map(composite => composite.name)
            },
            runtime: {
              name: aggregations[_elasticsearch_fieldnames.SERVICE_RUNTIME_NAME].buckets.map(bucket => bucket.key).slice(0, size),
              version: aggregations[_elasticsearch_fieldnames.SERVICE_RUNTIME_VERSION].buckets.map(bucket => bucket.key).slice(0, size),
              composite: (0, _lodash.sortBy)((0, _lodash.flatten)(aggregations[_elasticsearch_fieldnames.SERVICE_RUNTIME_NAME].buckets.map(bucket => bucket[_elasticsearch_fieldnames.SERVICE_RUNTIME_VERSION].buckets.map(versionBucket => ({
                doc_count: versionBucket.doc_count,
                name: toComposite(bucket.key, versionBucket.key)
              })))), 'doc_count').reverse().slice(0, size).map(composite => composite.name)
            }
          }
        }
      };
    }, Promise.resolve({}));
    return {
      agents: agentData
    };
  }
}, {
  name: 'indices_stats',
  executor: async ({
    indicesStats,
    indices
  }) => {
    var _response$_shards$tot, _response$_shards, _response$_all$total$, _response$_all, _response$_all$total, _response$_all$total$2, _response$_all$total$3, _response$_all2, _response$_all2$total, _response$_all2$total2;

    const response = await indicesStats({
      index: [indices.apmAgentConfigurationIndex, indices['apm_oss.errorIndices'], indices['apm_oss.metricsIndices'], indices['apm_oss.onboardingIndices'], indices['apm_oss.sourcemapIndices'], indices['apm_oss.spanIndices'], indices['apm_oss.transactionIndices']]
    });
    return {
      indices: {
        shards: {
          total: (_response$_shards$tot = (_response$_shards = response._shards) === null || _response$_shards === void 0 ? void 0 : _response$_shards.total) !== null && _response$_shards$tot !== void 0 ? _response$_shards$tot : 0
        },
        all: {
          total: {
            docs: {
              count: (_response$_all$total$ = (_response$_all = response._all) === null || _response$_all === void 0 ? void 0 : (_response$_all$total = _response$_all.total) === null || _response$_all$total === void 0 ? void 0 : (_response$_all$total$2 = _response$_all$total.docs) === null || _response$_all$total$2 === void 0 ? void 0 : _response$_all$total$2.count) !== null && _response$_all$total$ !== void 0 ? _response$_all$total$ : 0
            },
            store: {
              size_in_bytes: (_response$_all$total$3 = (_response$_all2 = response._all) === null || _response$_all2 === void 0 ? void 0 : (_response$_all2$total = _response$_all2.total) === null || _response$_all2$total === void 0 ? void 0 : (_response$_all2$total2 = _response$_all2$total.store) === null || _response$_all2$total2 === void 0 ? void 0 : _response$_all2$total2.size_in_bytes) !== null && _response$_all$total$3 !== void 0 ? _response$_all$total$3 : 0
            }
          }
        }
      }
    };
  }
}, {
  name: 'cardinality',
  executor: async ({
    search
  }) => {
    var _rumAgentCardinalityR, _allAgentsCardinality, _rumAgentCardinalityR2, _allAgentsCardinality2, _rumAgentCardinalityR3;

    const allAgentsCardinalityResponse = await search({
      body: {
        size: 0,
        timeout,
        query: {
          bool: {
            filter: [range1d]
          }
        },
        aggs: {
          [_elasticsearch_fieldnames.TRANSACTION_NAME]: {
            cardinality: {
              field: _elasticsearch_fieldnames.TRANSACTION_NAME
            }
          },
          [_elasticsearch_fieldnames.USER_AGENT_ORIGINAL]: {
            cardinality: {
              field: _elasticsearch_fieldnames.USER_AGENT_ORIGINAL
            }
          }
        }
      }
    });
    const rumAgentCardinalityResponse = await search({
      body: {
        size: 0,
        timeout,
        query: {
          bool: {
            filter: [range1d, {
              terms: {
                [_elasticsearch_fieldnames.AGENT_NAME]: _agent_name.RUM_AGENT_NAMES
              }
            }]
          }
        },
        aggs: {
          [_elasticsearch_fieldnames.CLIENT_GEO_COUNTRY_ISO_CODE]: {
            cardinality: {
              field: _elasticsearch_fieldnames.CLIENT_GEO_COUNTRY_ISO_CODE
            }
          },
          [_elasticsearch_fieldnames.TRANSACTION_NAME]: {
            cardinality: {
              field: _elasticsearch_fieldnames.TRANSACTION_NAME
            }
          },
          [_elasticsearch_fieldnames.USER_AGENT_ORIGINAL]: {
            cardinality: {
              field: _elasticsearch_fieldnames.USER_AGENT_ORIGINAL
            }
          }
        }
      }
    });
    return {
      cardinality: {
        client: {
          geo: {
            country_iso_code: {
              rum: {
                '1d': (_rumAgentCardinalityR = rumAgentCardinalityResponse.aggregations) === null || _rumAgentCardinalityR === void 0 ? void 0 : _rumAgentCardinalityR[_elasticsearch_fieldnames.CLIENT_GEO_COUNTRY_ISO_CODE].value
              }
            }
          }
        },
        transaction: {
          name: {
            all_agents: {
              '1d': (_allAgentsCardinality = allAgentsCardinalityResponse.aggregations) === null || _allAgentsCardinality === void 0 ? void 0 : _allAgentsCardinality[_elasticsearch_fieldnames.TRANSACTION_NAME].value
            },
            rum: {
              '1d': (_rumAgentCardinalityR2 = rumAgentCardinalityResponse.aggregations) === null || _rumAgentCardinalityR2 === void 0 ? void 0 : _rumAgentCardinalityR2[_elasticsearch_fieldnames.TRANSACTION_NAME].value
            }
          }
        },
        user_agent: {
          original: {
            all_agents: {
              '1d': (_allAgentsCardinality2 = allAgentsCardinalityResponse.aggregations) === null || _allAgentsCardinality2 === void 0 ? void 0 : _allAgentsCardinality2[_elasticsearch_fieldnames.USER_AGENT_ORIGINAL].value
            },
            rum: {
              '1d': (_rumAgentCardinalityR3 = rumAgentCardinalityResponse.aggregations) === null || _rumAgentCardinalityR3 === void 0 ? void 0 : _rumAgentCardinalityR3[_elasticsearch_fieldnames.USER_AGENT_ORIGINAL].value
            }
          }
        }
      }
    };
  }
}];
exports.tasks = tasks;