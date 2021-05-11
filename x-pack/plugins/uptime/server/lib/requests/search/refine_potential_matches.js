"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = exports.summaryPingsToSummary = exports.fullyMatchingIds = exports.refinePotentialMatches = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Determines whether the provided check groups are the latest complete check groups for their associated monitor ID's.
 * If provided check groups are not the latest complete group, they are discarded.
 * @param queryContext the data and resources needed to perform the query
 * @param potentialMatchMonitorIDs the monitor ID's of interest
 * @param potentialMatchCheckGroups the check groups to filter for the latest match per ID
 */
// check groups for their associated monitor IDs. If not, it discards the result.

const refinePotentialMatches = async (queryContext, potentialMatchMonitorIDs) => {
  if (potentialMatchMonitorIDs.length === 0) {
    return [];
  }

  const {
    body: queryResult
  } = await query(queryContext, potentialMatchMonitorIDs);
  return await fullyMatchingIds(queryResult, queryContext.statusFilter);
};

exports.refinePotentialMatches = refinePotentialMatches;

const fullyMatchingIds = (queryResult, statusFilter) => {
  const summaries = [];

  for (const monBucket of queryResult.aggregations.monitor.buckets) {
    // Did at least one location match?
    let matched = false;
    const summaryPings = [];

    for (const locBucket of monBucket.location.buckets) {
      const latest = locBucket.summaries.latest.hits.hits[0]; // It is possible for no latest summary to exist in this bucket if only partial
      // non-summary docs exist

      if (!latest) {
        continue;
      }

      const latestStillMatching = locBucket.latest_matching.top.hits.hits[0]; // If the most recent document still matches the most recent document matching the current filters
      // we can include this in the result
      //
      // We just check if the timestamp is greater. Note this may match an incomplete check group
      // that has not yet sent a summary doc

      if (latestStillMatching && latestStillMatching._source['@timestamp'] >= latest._source['@timestamp']) {
        matched = true;
      }

      summaryPings.push({
        docId: latest._id,
        timestamp: latest._source['@timestamp'],
        ...latest._source
      });
    }

    const someDown = summaryPings.some(p => {
      var _p$summary$down, _p$summary;

      return ((_p$summary$down = (_p$summary = p.summary) === null || _p$summary === void 0 ? void 0 : _p$summary.down) !== null && _p$summary$down !== void 0 ? _p$summary$down : 0) > 0;
    });
    const statusFilterOk = !statusFilter ? true : statusFilter === 'up' ? !someDown : someDown;

    if (matched && statusFilterOk) {
      summaries.push(summaryPingsToSummary(summaryPings));
    }
  }

  return summaries;
};

exports.fullyMatchingIds = fullyMatchingIds;

const summaryPingsToSummary = summaryPings => {
  var _latest$monitor, _latest$monitor2, _latest$url, _summaryPings$find;

  summaryPings.sort((a, b) => a.timestamp > b.timestamp ? 1 : a.timestamp === b.timestamp ? 0 : -1);
  const latest = summaryPings[summaryPings.length - 1];
  return {
    monitor_id: latest.monitor.id,
    state: {
      timestamp: latest.timestamp,
      monitor: {
        name: (_latest$monitor = latest.monitor) === null || _latest$monitor === void 0 ? void 0 : _latest$monitor.name,
        type: (_latest$monitor2 = latest.monitor) === null || _latest$monitor2 === void 0 ? void 0 : _latest$monitor2.type
      },
      url: (_latest$url = latest.url) !== null && _latest$url !== void 0 ? _latest$url : {},
      summary: {
        up: summaryPings.reduce((acc, p) => {
          var _p$summary$up, _p$summary2;

          return ((_p$summary$up = (_p$summary2 = p.summary) === null || _p$summary2 === void 0 ? void 0 : _p$summary2.up) !== null && _p$summary$up !== void 0 ? _p$summary$up : 0) + acc;
        }, 0),
        down: summaryPings.reduce((acc, p) => {
          var _p$summary$down2, _p$summary3;

          return ((_p$summary$down2 = (_p$summary3 = p.summary) === null || _p$summary3 === void 0 ? void 0 : _p$summary3.down) !== null && _p$summary$down2 !== void 0 ? _p$summary$down2 : 0) + acc;
        }, 0),
        status: summaryPings.some(p => {
          var _p$summary$down3, _p$summary4;

          return ((_p$summary$down3 = (_p$summary4 = p.summary) === null || _p$summary4 === void 0 ? void 0 : _p$summary4.down) !== null && _p$summary$down3 !== void 0 ? _p$summary$down3 : 0) > 0;
        }) ? 'down' : 'up'
      },
      summaryPings,
      tls: latest.tls,
      // easier to ensure to use '' for an empty geo name in terms of types
      observer: {
        geo: {
          name: summaryPings.map(p => {
            var _p$observer$geo$name, _p$observer, _p$observer$geo;

            return (_p$observer$geo$name = (_p$observer = p.observer) === null || _p$observer === void 0 ? void 0 : (_p$observer$geo = _p$observer.geo) === null || _p$observer$geo === void 0 ? void 0 : _p$observer$geo.name) !== null && _p$observer$geo$name !== void 0 ? _p$observer$geo$name : '';
          }).filter(n => n !== '')
        }
      },
      service: (_summaryPings$find = summaryPings.find(p => {
        var _p$service;

        return (_p$service = p.service) === null || _p$service === void 0 ? void 0 : _p$service.name;
      })) === null || _summaryPings$find === void 0 ? void 0 : _summaryPings$find.service
    }
  };
};

exports.summaryPingsToSummary = summaryPingsToSummary;

const query = async (queryContext, potentialMatchMonitorIDs) => {
  const params = {
    body: {
      size: 0,
      query: {
        bool: {
          filter: [await queryContext.dateRangeFilter(), {
            terms: {
              'monitor.id': potentialMatchMonitorIDs
            }
          }]
        }
      },
      aggs: {
        monitor: {
          terms: {
            field: 'monitor.id',
            size: potentialMatchMonitorIDs.length,
            order: {
              _key: queryContext.cursorOrder()
            }
          },
          aggs: {
            location: {
              terms: {
                field: 'observer.geo.name',
                missing: 'N/A',
                size: 100
              },
              aggs: {
                summaries: {
                  // only match summary docs because we only want the latest *complete* check group.
                  filter: {
                    exists: {
                      field: 'summary'
                    }
                  },
                  aggs: {
                    latest: {
                      top_hits: {
                        sort: [{
                          '@timestamp': 'desc'
                        }],
                        size: 1
                      }
                    }
                  }
                },
                // We want to find the latest check group, even if it's not part of a summary
                latest_matching: {
                  filter: queryContext.filterClause || {
                    match_all: {}
                  },
                  aggs: {
                    top: {
                      top_hits: {
                        _source: ['@timestamp'],
                        sort: [{
                          '@timestamp': 'desc'
                        }],
                        size: 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  return await queryContext.search(params);
};

exports.query = query;