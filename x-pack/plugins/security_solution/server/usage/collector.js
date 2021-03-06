"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalSavedObjectsClient = getInternalSavedObjectsClient;
exports.registerCollector = void 0;

var _detections = require("./detections");

var _endpoints = require("./endpoints");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getInternalSavedObjectsClient(core) {
  return core.getStartServices().then(async ([coreStart]) => {
    return coreStart.savedObjects.createInternalRepository();
  });
}

const registerCollector = ({
  core,
  kibanaIndex,
  ml,
  usageCollection
}) => {
  if (!usageCollection) {
    return;
  }

  const collector = usageCollection.makeUsageCollector({
    type: 'security_solution',
    schema: {
      detections: {
        detection_rules: {
          custom: {
            enabled: {
              type: 'long'
            },
            disabled: {
              type: 'long'
            }
          },
          elastic: {
            enabled: {
              type: 'long'
            },
            disabled: {
              type: 'long'
            }
          }
        },
        ml_jobs: {
          custom: {
            enabled: {
              type: 'long'
            },
            disabled: {
              type: 'long'
            }
          },
          elastic: {
            enabled: {
              type: 'long'
            },
            disabled: {
              type: 'long'
            }
          }
        }
      },
      detectionMetrics: {
        ml_jobs: {
          type: 'array',
          items: {
            job_id: {
              type: 'keyword'
            },
            open_time: {
              type: 'keyword'
            },
            create_time: {
              type: 'keyword'
            },
            finished_time: {
              type: 'keyword'
            },
            state: {
              type: 'keyword'
            },
            data_counts: {
              bucket_count: {
                type: 'long'
              },
              empty_bucket_count: {
                type: 'long'
              },
              input_bytes: {
                type: 'long'
              },
              input_record_count: {
                type: 'long'
              },
              last_data_time: {
                type: 'long'
              },
              processed_record_count: {
                type: 'long'
              }
            },
            model_size_stats: {
              bucket_allocation_failures_count: {
                type: 'long'
              },
              model_bytes: {
                type: 'long'
              },
              model_bytes_exceeded: {
                type: 'long'
              },
              model_bytes_memory_limit: {
                type: 'long'
              },
              peak_model_bytes: {
                type: 'long'
              }
            },
            timing_stats: {
              average_bucket_processing_time_ms: {
                type: 'long'
              },
              bucket_count: {
                type: 'long'
              },
              exponential_average_bucket_processing_time_ms: {
                type: 'long'
              },
              exponential_average_bucket_processing_time_per_hour_ms: {
                type: 'long'
              },
              maximum_bucket_processing_time_ms: {
                type: 'long'
              },
              minimum_bucket_processing_time_ms: {
                type: 'long'
              },
              total_bucket_processing_time_ms: {
                type: 'long'
              }
            },
            datafeed: {
              datafeed_id: {
                type: 'keyword'
              },
              state: {
                type: 'keyword'
              },
              timing_stats: {
                average_search_time_per_bucket_ms: {
                  type: 'long'
                },
                bucket_count: {
                  type: 'long'
                },
                exponential_average_search_time_per_hour_ms: {
                  type: 'long'
                },
                search_count: {
                  type: 'long'
                },
                total_search_time_ms: {
                  type: 'long'
                }
              }
            }
          }
        }
      },
      endpoints: {
        total_installed: {
          type: 'long'
        },
        active_within_last_24_hours: {
          type: 'long'
        },
        os: {
          type: 'array',
          items: {
            full_name: {
              type: 'keyword'
            },
            platform: {
              type: 'keyword'
            },
            version: {
              type: 'keyword'
            },
            count: {
              type: 'long'
            }
          }
        },
        policies: {
          malware: {
            active: {
              type: 'long'
            },
            inactive: {
              type: 'long'
            },
            failure: {
              type: 'long'
            }
          }
        }
      }
    },
    isReady: () => kibanaIndex.length > 0,
    fetch: async ({
      esClient
    }) => {
      const internalSavedObjectsClient = await getInternalSavedObjectsClient(core);
      const savedObjectsClient = internalSavedObjectsClient;
      const [detections, detectionMetrics, endpoints] = await Promise.allSettled([(0, _detections.fetchDetectionsUsage)(kibanaIndex, esClient, ml, savedObjectsClient), (0, _detections.fetchDetectionsMetrics)(ml, savedObjectsClient), (0, _endpoints.getEndpointTelemetryFromFleet)(internalSavedObjectsClient)]);
      return {
        detections: detections.status === 'fulfilled' ? detections.value : _detections.defaultDetectionsUsage,
        detectionMetrics: detectionMetrics.status === 'fulfilled' ? detectionMetrics.value : {},
        endpoints: endpoints.status === 'fulfilled' ? endpoints.value : {}
      };
    }
  });
  usageCollection.registerCollector(collector);
};

exports.registerCollector = registerCollector;