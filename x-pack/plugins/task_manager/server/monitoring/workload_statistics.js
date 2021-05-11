"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWorkloadAggregator = createWorkloadAggregator;
exports.padBuckets = padBuckets;
exports.estimateRecurringTaskScheduling = estimateRecurringTaskScheduling;
exports.summarizeWorkloadStat = summarizeWorkloadStat;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _intervals = require("../lib/intervals");

var _monitoring_stats_stream = require("./monitoring_stats_stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Set an upper bound just in case a customer sets a really high refresh rate


const MAX_SHCEDULE_DENSITY_BUCKETS = 50;

function createWorkloadAggregator(taskStore, elasticsearchAndSOAvailability$, refreshInterval, pollInterval, logger) {
  // calculate scheduleDensity going two refreshIntervals or 1 minute into into the future
  // (the longer of the two)
  const scheduleDensityBuckets = Math.min(Math.max(Math.round(60000 / pollInterval), Math.round(refreshInterval * 2 / pollInterval)), MAX_SHCEDULE_DENSITY_BUCKETS);
  return (0, _rxjs.combineLatest)([(0, _rxjs.timer)(0, refreshInterval), elasticsearchAndSOAvailability$]).pipe((0, _operators.filter)(([, areElasticsearchAndSOAvailable]) => areElasticsearchAndSOAvailable), (0, _operators.mergeMap)(() => taskStore.aggregate({
    aggs: {
      taskType: {
        terms: {
          field: 'task.taskType'
        },
        aggs: {
          status: {
            terms: {
              field: 'task.status'
            }
          }
        }
      },
      schedule: {
        terms: {
          field: 'task.schedule.interval'
        }
      },
      idleTasks: {
        filter: {
          term: {
            'task.status': 'idle'
          }
        },
        aggs: {
          scheduleDensity: {
            // create a window of upcoming tasks
            range: {
              field: 'task.runAt',
              ranges: [{
                from: `now`,
                to: `now+${(0, _intervals.asInterval)(scheduleDensityBuckets * pollInterval)}`
              }]
            },
            aggs: {
              // create histogram of scheduling in the window, with each bucket being a polling interval
              histogram: {
                date_histogram: {
                  field: 'task.runAt',
                  fixed_interval: (0, _intervals.asInterval)(pollInterval)
                },
                // break down each bucket in the historgram by schedule
                aggs: {
                  interval: {
                    terms: {
                      field: 'task.schedule.interval'
                    }
                  }
                }
              }
            }
          },
          overdue: {
            filter: {
              range: {
                'task.runAt': {
                  lt: 'now'
                }
              }
            }
          }
        }
      }
    }
  })), (0, _operators.map)(result => {
    var _aggregations$idleTas, _aggregations$idleTas2;

    const {
      aggregations,
      hits: {
        total: {
          value: count
        }
      }
    } = result;

    if (!(aggregations !== null && aggregations !== void 0 && aggregations.taskType && aggregations !== null && aggregations !== void 0 && aggregations.schedule && aggregations !== null && aggregations !== void 0 && (_aggregations$idleTas = aggregations.idleTasks) !== null && _aggregations$idleTas !== void 0 && _aggregations$idleTas.overdue && aggregations !== null && aggregations !== void 0 && (_aggregations$idleTas2 = aggregations.idleTasks) !== null && _aggregations$idleTas2 !== void 0 && _aggregations$idleTas2.scheduleDensity)) {
      throw new Error(`Invalid workload: ${JSON.stringify(result)}`);
    }

    const taskTypes = aggregations.taskType.buckets;
    const schedules = aggregations.schedule.buckets;
    const {
      overdue: {
        doc_count: overdue
      },
      scheduleDensity: {
        buckets: [scheduleDensity] = []
      } = {}
    } = aggregations.idleTasks;
    const summary = {
      count,
      task_types: (0, _lodash.mapValues)((0, _lodash.keyBy)(taskTypes, 'key'), ({
        doc_count: docCount,
        status
      }) => {
        return {
          count: docCount,
          status: (0, _lodash.mapValues)((0, _lodash.keyBy)(status.buckets, 'key'), 'doc_count')
        };
      }),
      schedule: schedules.sort((scheduleLeft, scheduleRight) => (0, _intervals.parseIntervalAsSecond)(scheduleLeft.key) - (0, _intervals.parseIntervalAsSecond)(scheduleRight.key)).map(schedule => [schedule.key, schedule.doc_count]),
      overdue,
      estimated_schedule_density: padBuckets(scheduleDensityBuckets, pollInterval, scheduleDensity)
    };
    return {
      key: 'workload',
      value: summary
    };
  }), (0, _operators.catchError)((ex, caught) => {
    logger.error(`[WorkloadAggregator]: ${ex}`); // continue to pull values from the same observable but only on the next refreshInterval

    return (0, _rxjs.timer)(refreshInterval).pipe((0, _operators.switchMap)(() => caught));
  }));
}

function padBuckets(scheduleDensityBuckets, pollInterval, scheduleDensity) {
  var _scheduleDensity$hist, _scheduleDensity$hist2;

  if (scheduleDensity.from && scheduleDensity.to && (_scheduleDensity$hist = scheduleDensity.histogram) !== null && _scheduleDensity$hist !== void 0 && (_scheduleDensity$hist2 = _scheduleDensity$hist.buckets) !== null && _scheduleDensity$hist2 !== void 0 && _scheduleDensity$hist2.length) {
    const {
      histogram,
      from,
      to
    } = scheduleDensity;
    const firstBucket = histogram.buckets[0].key;
    const lastBucket = histogram.buckets[histogram.buckets.length - 1].key; // detect when the first bucket is before the `from` so that we can take that into
    // account by begining the timeline earlier
    // This can happen when you have overdue tasks and Elasticsearch returns their bucket
    // as begining before the `from`

    const firstBucketStartsInThePast = firstBucket - from < 0;
    const bucketsToPadBeforeFirstBucket = firstBucketStartsInThePast ? [] : calculateBucketsBetween(firstBucket, from, pollInterval);
    const bucketsToPadAfterLast = calculateBucketsBetween(lastBucket + pollInterval, firstBucketStartsInThePast ? to - pollInterval : to, pollInterval);
    return estimateRecurringTaskScheduling([...bucketsToPadBeforeFirstBucket, ...histogram.buckets.map(countByIntervalInBucket), ...bucketsToPadAfterLast], pollInterval);
  }

  return new Array(scheduleDensityBuckets).fill(0);
}

function countByIntervalInBucket(bucket) {
  if (bucket.doc_count === 0) {
    return {
      nonRecurring: 0,
      key: bucket.key
    };
  }

  const recurring = [];
  let nonRecurring = bucket.doc_count;

  for (const intervalBucket of bucket.interval.buckets) {
    recurring.push([intervalBucket.doc_count, intervalBucket.key]);
    nonRecurring -= intervalBucket.doc_count;
  }

  return {
    nonRecurring,
    recurring,
    key: bucket.key
  };
}

function calculateBucketsBetween(from, to, interval, bucketInterval = interval) {
  const calcForwardInTime = from < to; // as task interval might not divide by the pollInterval (aka the bucket interval)
  // we have to adjust for the "drift" that occurs when estimating when the next
  // bucket the task might actually get scheduled in

  const actualInterval = Math.ceil(interval / bucketInterval) * bucketInterval;
  const buckets = [];
  const toBound = calcForwardInTime ? to : -(to + actualInterval);
  let fromBound = calcForwardInTime ? from : -from;

  while (fromBound < toBound) {
    buckets.push({
      key: fromBound
    });
    fromBound += actualInterval;
  }

  return calcForwardInTime ? buckets : buckets.reverse().map(bucket => {
    bucket.key = Math.abs(bucket.key);
    return bucket;
  });
}

function estimateRecurringTaskScheduling(scheduleDensity, pollInterval) {
  const lastKey = scheduleDensity[scheduleDensity.length - 1].key;
  return scheduleDensity.map((bucket, currentBucketIndex) => {
    var _bucket$nonRecurring;

    for (const [count, interval] of (_bucket$recurring = bucket.recurring) !== null && _bucket$recurring !== void 0 ? _bucket$recurring : []) {
      var _bucket$recurring;

      for (const recurrance of calculateBucketsBetween(bucket.key, // `calculateBucketsBetween` uses the `to` as a non-inclusive upper bound
      // but lastKey is a bucket we wish to include
      lastKey + pollInterval, (0, _intervals.parseIntervalAsMillisecond)(interval), pollInterval)) {
        const recurranceBucketIndex = currentBucketIndex + Math.ceil((recurrance.key - bucket.key) / pollInterval);

        if (recurranceBucketIndex < scheduleDensity.length) {
          var _scheduleDensity$recu;

          scheduleDensity[recurranceBucketIndex].nonRecurring = count + ((_scheduleDensity$recu = scheduleDensity[recurranceBucketIndex].nonRecurring) !== null && _scheduleDensity$recu !== void 0 ? _scheduleDensity$recu : 0);
        }
      }
    }

    return (_bucket$nonRecurring = bucket.nonRecurring) !== null && _bucket$nonRecurring !== void 0 ? _bucket$nonRecurring : 0;
  });
}

function summarizeWorkloadStat(workloadStats) {
  return {
    value: workloadStats,
    status: _monitoring_stats_stream.HealthStatus.OK
  };
}