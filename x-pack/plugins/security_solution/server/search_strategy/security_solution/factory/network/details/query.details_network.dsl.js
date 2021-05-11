"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNetworkDetailsQuery = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAggs = (type, ip) => {
  return {
    [type]: {
      filter: {
        term: {
          [`${type}.ip`]: ip
        }
      },
      aggs: {
        firstSeen: {
          min: {
            field: '@timestamp'
          }
        },
        lastSeen: {
          max: {
            field: '@timestamp'
          }
        },
        as: {
          filter: {
            exists: {
              field: `${type}.as`
            }
          },
          aggs: {
            results: {
              top_hits: {
                size: 1,
                _source: [`${type}.as`],
                sort: [{
                  '@timestamp': 'desc'
                }]
              }
            }
          }
        },
        geo: {
          filter: {
            exists: {
              field: `${type}.geo`
            }
          },
          aggs: {
            results: {
              top_hits: {
                size: 1,
                _source: [`${type}.geo`],
                sort: [{
                  '@timestamp': 'desc'
                }]
              }
            }
          }
        }
      }
    }
  };
};

const getHostAggs = ip => {
  return {
    host: {
      filter: {
        term: {
          'host.ip': ip
        }
      },
      aggs: {
        results: {
          top_hits: {
            size: 1,
            _source: ['host'],
            sort: [{
              '@timestamp': 'desc'
            }]
          }
        }
      }
    }
  };
};

const buildNetworkDetailsQuery = ({
  defaultIndex,
  docValueFields,
  ip
}) => {
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    track_total_hits: false,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      aggs: { ...getAggs('source', ip),
        ...getAggs('destination', ip),
        ...getHostAggs(ip)
      },
      query: {
        bool: {
          should: []
        }
      },
      size: 0
    }
  };
  return dslQuery;
};

exports.buildNetworkDetailsQuery = buildNetworkDetailsQuery;