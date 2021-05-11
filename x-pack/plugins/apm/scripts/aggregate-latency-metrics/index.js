"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregateLatencyMetrics = aggregateLatencyMetrics;

var _yargs = require("yargs");

var _pLimit = _interopRequireDefault(require("p-limit"));

var _pRetry = _interopRequireDefault(require("p-retry"));

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var histogram = _interopRequireWildcard(require("hdr-histogram-js"));

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _createOrUpdateIndex = require("../shared/create-or-update-index");

var _parse_index_url = require("../shared/parse_index_url");

var _get_es_client = require("../shared/get_es_client");

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
// This script will try to estimate how many latency metric documents
// will be created based on the available transaction documents.
// It can also generate metric documents based on a painless script
// and hdr histograms.
//
// Options:
// - interval: the interval (in minutes) for which latency metrics will be aggregated.
// Defaults to 1.
// - concurrency: number of maximum concurrent requests to ES. Defaults to 3.
// - from: start of the date range that should be processed. Should be a valid ISO timestamp.
// - to: end of the date range that should be processed. Should be a valid ISO timestamp.
// - source: from which transaction documents should be read. Should be location of ES (basic auth
// is supported) plus the index name (or an index pattern). Example:
// https://foo:bar@apm.elstc.co:9999/apm-8.0.0-transaction
// - dest: to which metric documents should be written. If this is not set, no metric documents
// will be created.Should be location of ES (basic auth is supported) plus the index name.
// Example: https://foo:bar@apm.elstc.co:9999/apm-8.0.0-metric
// - include: comma-separated list of fields that should be aggregated on, in addition to the
// default ones.
// - exclude: comma-separated list of fields that should be not be aggregated on.


async function aggregateLatencyMetrics() {
  var _argv$include, _argv$exclude, _argv$only, _argv$source, _argv$dest;

  const interval = parseInt(String(_yargs.argv.interval), 10) || 1;
  const concurrency = parseInt(String(_yargs.argv.concurrency), 10) || 3;
  const numSigFigures = parseInt(String(_yargs.argv.sigfig), 10) || 2;
  const from = new Date(String(_yargs.argv.from)).getTime();
  const to = new Date(String(_yargs.argv.to)).getTime();

  if (isNaN(from) || isNaN(to)) {
    throw new Error(`from and to are not valid dates - please supply valid ISO timestamps`);
  }

  if (to <= from) {
    throw new Error('to cannot be earlier than from');
  }

  const limit = (0, _pLimit.default)(concurrency); // retry function to handle ES timeouts

  const retry = fn => {
    return () => (0, _pRetry.default)(fn, {
      factor: 1,
      retries: 3,
      minTimeout: 2500
    });
  };

  const tasks = [];
  const defaultFields = [_elasticsearch_fieldnames.SERVICE_NAME, _elasticsearch_fieldnames.SERVICE_VERSION, _elasticsearch_fieldnames.SERVICE_ENVIRONMENT, _elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.HOST_NAME, _elasticsearch_fieldnames.POD_NAME, _elasticsearch_fieldnames.CONTAINER_ID, _elasticsearch_fieldnames.TRANSACTION_NAME, _elasticsearch_fieldnames.TRANSACTION_RESULT, _elasticsearch_fieldnames.TRANSACTION_TYPE];
  const include = String((_argv$include = _yargs.argv.include) !== null && _argv$include !== void 0 ? _argv$include : '').split(',').filter(Boolean);
  const exclude = String((_argv$exclude = _yargs.argv.exclude) !== null && _argv$exclude !== void 0 ? _argv$exclude : '').split(',').filter(Boolean);
  const only = String((_argv$only = _yargs.argv.only) !== null && _argv$only !== void 0 ? _argv$only : '').split(',').filter(Boolean);
  const fields = only.length ? (0, _lodash.uniq)(only) : (0, _lodash.without)((0, _lodash.uniq)([...include, ...defaultFields]), ...exclude);
  const globalFilter = _yargs.argv.filter ? JSON.parse(String(_yargs.argv.filter)) : {}; // eslint-disable-next-line no-console

  console.log('Aggregating on', fields.join(','));
  const source = String((_argv$source = _yargs.argv.source) !== null && _argv$source !== void 0 ? _argv$source : '');
  const dest = String((_argv$dest = _yargs.argv.dest) !== null && _argv$dest !== void 0 ? _argv$dest : '');
  const sourceOptions = (0, _parse_index_url.parseIndexUrl)(source);
  const sourceClient = (0, _get_es_client.getEsClient)({
    node: sourceOptions.node
  });
  let destClient;
  let destOptions;
  const uploadMetrics = !!dest;

  if (uploadMetrics) {
    destOptions = (0, _parse_index_url.parseIndexUrl)(dest);
    destClient = (0, _get_es_client.getEsClient)({
      node: destOptions.node
    });
    const mappings = (await sourceClient.indices.getMapping({
      index: sourceOptions.index
    })).body;
    const lastMapping = mappings[Object.keys(mappings)[0]];
    const newMapping = (0, _lodash.merge)({}, lastMapping, {
      mappings: {
        properties: {
          transaction: {
            properties: {
              duration: {
                properties: {
                  histogram: {
                    type: 'histogram'
                  }
                }
              }
            }
          }
        }
      }
    });
    await (0, _createOrUpdateIndex.createOrUpdateIndex)({
      client: destClient,
      indexName: destOptions.index,
      clear: false,
      template: newMapping
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('No destination was defined, not uploading aggregated documents');
  }

  let at = to;

  while (at > from) {
    const end = at;
    const start = Math.max(from, at - interval * 60 * 1000);
    tasks.push(limit(retry(async () => {
      var _globalFilter$query, _globalFilter$query$b, _globalFilter$query2, _globalFilter$query$b2, _globalFilter$query3, _globalFilter$query3$;

      const filter = [{
        term: {
          [_elasticsearch_fieldnames.PROCESSOR_EVENT]: 'transaction'
        }
      }, {
        range: {
          '@timestamp': {
            gte: start,
            lt: end
          }
        }
      }];
      const query = { ...globalFilter,
        query: { ...((_globalFilter$query = globalFilter === null || globalFilter === void 0 ? void 0 : globalFilter.query) !== null && _globalFilter$query !== void 0 ? _globalFilter$query : {}),
          bool: { ...((_globalFilter$query$b = globalFilter === null || globalFilter === void 0 ? void 0 : (_globalFilter$query2 = globalFilter.query) === null || _globalFilter$query2 === void 0 ? void 0 : _globalFilter$query2.bool) !== null && _globalFilter$query$b !== void 0 ? _globalFilter$query$b : {}),
            filter: [...Object.values((_globalFilter$query$b2 = globalFilter === null || globalFilter === void 0 ? void 0 : (_globalFilter$query3 = globalFilter.query) === null || _globalFilter$query3 === void 0 ? void 0 : (_globalFilter$query3$ = _globalFilter$query3.bool) === null || _globalFilter$query3$ === void 0 ? void 0 : _globalFilter$query3$.filter) !== null && _globalFilter$query$b2 !== void 0 ? _globalFilter$query$b2 : {}), ...filter]
          }
        }
      };

      async function paginateThroughBuckets(buckets, after) {
        const params = {
          index: sourceOptions.index,
          body: { ...query,
            aggs: {
              transactionGroups: {
                composite: { ...(after ? {
                    after
                  } : {}),
                  size: 10000,
                  sources: fields.map(field => ({
                    [field]: {
                      terms: {
                        field,
                        missing_bucket: true
                      }
                    }
                  }))
                },
                ...(dest ? {
                  // scripted metric agg to get all the values (rather than downloading all the documents)
                  aggs: {
                    recorded_values: {
                      scripted_metric: {
                        init_script: 'state.values = new ArrayList()',
                        map_script: `
                            if (!doc['transaction.duration.us'].empty) {
                              state.values.add(doc['transaction.duration.us'].value);
                            }
                          `,
                        combine_script: 'return state.values',
                        reduce_script: `
                            return states.stream().flatMap(l -> l.stream()).collect(Collectors.toList())
                          `
                      }
                    }
                  }
                } : {})
              }
            }
          }
        };
        const response = await sourceClient.search(params);
        const {
          aggregations
        } = response.body;

        if (!aggregations) {
          return buckets;
        }

        const {
          transactionGroups
        } = aggregations;
        const nextBuckets = buckets.concat(transactionGroups.buckets);

        if (!transactionGroups.after_key) {
          return nextBuckets;
        }

        return nextBuckets.concat(await paginateThroughBuckets(buckets, transactionGroups.after_key));
      }

      async function getNumberOfTransactionDocuments() {
        const params = {
          index: sourceOptions.index,
          body: {
            query: {
              bool: {
                filter
              }
            },
            track_total_hits: true
          }
        };
        const response = await sourceClient.search(params);
        return response.body.hits.total.value;
      }

      const [buckets, numberOfTransactionDocuments] = await Promise.all([paginateThroughBuckets([]), getNumberOfTransactionDocuments()]);
      const rangeLabel = `${new Date(start).toISOString()}-${new Date(end).toISOString()}`; // eslint-disable-next-line no-console

      console.log(`${rangeLabel}: Compression: ${buckets.length}/${numberOfTransactionDocuments} (${(buckets.length / numberOfTransactionDocuments * 100).toPrecision(2)}%)`);
      const docs = [];

      if (uploadMetrics) {
        var _destClient;

        buckets.forEach(bucket => {
          var _bucket$recorded_valu, _bucket$recorded_valu2;

          const values = (_bucket$recorded_valu = (_bucket$recorded_valu2 = bucket.recorded_values) === null || _bucket$recorded_valu2 === void 0 ? void 0 : _bucket$recorded_valu2.value) !== null && _bucket$recorded_valu !== void 0 ? _bucket$recorded_valu : [];
          const h = histogram.build({
            numberOfSignificantValueDigits: numSigFigures
          });
          values.forEach(value => {
            h.recordValue(value);
          });
          const iterator = h.recordedValuesIterator;
          const distribution = {
            values: [],
            counts: []
          };
          iterator.reset();

          while (iterator.hasNext()) {
            const value = iterator.next();
            distribution.values.push(value.valueIteratedTo);
            distribution.counts.push(value.countAtValueIteratedTo);
          }

          const structured = Object.keys(bucket.key).reduce((prev, key) => {
            (0, _saferLodashSet.set)(prev, key, bucket.key[key]);
            return prev;
          }, {});
          const doc = (0, _lodash.merge)({}, structured, {
            '@timestamp': new Date(start).toISOString(),
            timestamp: {
              us: start * 1000
            },
            processor: {
              name: 'metric',
              event: 'metric'
            },
            transaction: {
              duration: {
                histogram: distribution
              }
            }
          });
          docs.push(doc);
        });

        if (!docs.length) {
          // eslint-disable-next-line no-console
          console.log(`${rangeLabel}: No docs to upload`);
          return;
        }

        const response = await ((_destClient = destClient) === null || _destClient === void 0 ? void 0 : _destClient.bulk({
          refresh: 'wait_for',
          body: (0, _lodash.flatten)(docs.map(doc => {
            var _destOptions;

            return [{
              index: {
                _index: (_destOptions = destOptions) === null || _destOptions === void 0 ? void 0 : _destOptions.index
              }
            }, doc];
          }))
        }));

        if (response !== null && response !== void 0 && response.body.errors) {
          throw new Error(`${rangeLabel}: Could not upload all metric documents`);
        } // eslint-disable-next-line no-console


        console.log(`${rangeLabel}: Uploaded ${docs.length} metric documents`);
      }
    })));
    at = start;
  }

  await Promise.all(tasks);
}