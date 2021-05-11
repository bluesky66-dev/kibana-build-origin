"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCerts = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

var SortFields;

(function (SortFields) {
  SortFields["issuer"] = "tls.server.x509.issuer.common_name";
  SortFields["not_after"] = "tls.server.x509.not_after";
  SortFields["not_before"] = "tls.server.x509.not_before";
  SortFields["common_name"] = "tls.server.x509.subject.common_name";
})(SortFields || (SortFields = {}));

const getCerts = async ({
  uptimeEsClient,
  index,
  from,
  to,
  size,
  search,
  notValidBefore,
  notValidAfter,
  sortBy,
  direction
}) => {
  var _result$hits$hits, _result$hits, _result$aggregations$, _result$aggregations, _result$aggregations$2;

  const sort = SortFields[sortBy];
  const searchBody = {
    from: index * size,
    size,
    sort: [{
      [sort]: {
        order: direction
      }
    }],
    query: {
      bool: { ...(search ? {
          minimum_should_match: 1,
          should: [{
            multi_match: {
              query: escape(search),
              type: 'phrase_prefix',
              fields: ['monitor.id.text', 'monitor.name.text', 'url.full.text', 'tls.server.x509.subject.common_name.text', 'tls.server.x509.issuer.common_name.text']
            }
          }]
        } : {}),
        filter: [{
          exists: {
            field: 'tls.server'
          }
        }, {
          range: {
            'monitor.timespan': {
              gte: from,
              lte: to
            }
          }
        }]
      }
    },
    _source: ['monitor.id', 'monitor.name', 'tls.server.x509.issuer.common_name', 'tls.server.x509.subject.common_name', 'tls.server.hash.sha1', 'tls.server.hash.sha256', 'tls.server.x509.not_after', 'tls.server.x509.not_before'],
    collapse: {
      field: 'tls.server.hash.sha256',
      inner_hits: {
        _source: {
          includes: ['monitor.id', 'monitor.name', 'url.full']
        },
        collapse: {
          field: 'monitor.id'
        },
        name: 'monitors',
        sort: [{
          'monitor.id': 'asc'
        }]
      }
    },
    aggs: {
      total: {
        cardinality: {
          field: 'tls.server.hash.sha256'
        }
      }
    }
  };

  if (notValidBefore || notValidAfter) {
    const validityFilters = {
      bool: {
        should: []
      }
    };

    if (notValidBefore) {
      validityFilters.bool.should.push({
        range: {
          'tls.certificate_not_valid_before': {
            lte: notValidBefore
          }
        }
      });
    }

    if (notValidAfter) {
      validityFilters.bool.should.push({
        range: {
          'tls.certificate_not_valid_after': {
            lte: notValidAfter
          }
        }
      });
    }

    searchBody.query.bool.filter.push(validityFilters);
  } // console.log(JSON.stringify(params, null, 2));


  const {
    body: result
  } = await uptimeEsClient.search({
    body: searchBody
  });
  const certs = ((_result$hits$hits = result === null || result === void 0 ? void 0 : (_result$hits = result.hits) === null || _result$hits === void 0 ? void 0 : _result$hits.hits) !== null && _result$hits$hits !== void 0 ? _result$hits$hits : []).map(hit => {
    var _ping$tls, _server$x, _server$x2, _server$x3, _server$x3$issuer, _server$x4, _server$x4$subject, _server$hash, _server$hash2;

    const ping = hit._source;
    const server = (_ping$tls = ping.tls) === null || _ping$tls === void 0 ? void 0 : _ping$tls.server;
    const notAfter = server === null || server === void 0 ? void 0 : (_server$x = server.x509) === null || _server$x === void 0 ? void 0 : _server$x.not_after;
    const notBefore = server === null || server === void 0 ? void 0 : (_server$x2 = server.x509) === null || _server$x2 === void 0 ? void 0 : _server$x2.not_before;
    const issuer = server === null || server === void 0 ? void 0 : (_server$x3 = server.x509) === null || _server$x3 === void 0 ? void 0 : (_server$x3$issuer = _server$x3.issuer) === null || _server$x3$issuer === void 0 ? void 0 : _server$x3$issuer.common_name;
    const commonName = server === null || server === void 0 ? void 0 : (_server$x4 = server.x509) === null || _server$x4 === void 0 ? void 0 : (_server$x4$subject = _server$x4.subject) === null || _server$x4$subject === void 0 ? void 0 : _server$x4$subject.common_name;
    const sha1 = server === null || server === void 0 ? void 0 : (_server$hash = server.hash) === null || _server$hash === void 0 ? void 0 : _server$hash.sha1;
    const sha256 = server === null || server === void 0 ? void 0 : (_server$hash2 = server.hash) === null || _server$hash2 === void 0 ? void 0 : _server$hash2.sha256;
    const monitors = hit.inner_hits.monitors.hits.hits.map(monitor => {
      var _monitor$_source, _monitor$_source2, _monitor$_source3, _monitor$_source3$url;

      return {
        name: (_monitor$_source = monitor._source) === null || _monitor$_source === void 0 ? void 0 : _monitor$_source.monitor.name,
        id: (_monitor$_source2 = monitor._source) === null || _monitor$_source2 === void 0 ? void 0 : _monitor$_source2.monitor.id,
        url: (_monitor$_source3 = monitor._source) === null || _monitor$_source3 === void 0 ? void 0 : (_monitor$_source3$url = _monitor$_source3.url) === null || _monitor$_source3$url === void 0 ? void 0 : _monitor$_source3$url.full
      };
    });
    return {
      monitors,
      issuer,
      sha1,
      sha256: sha256,
      not_after: notAfter,
      not_before: notBefore,
      common_name: commonName
    };
  });
  const total = (_result$aggregations$ = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$2 = _result$aggregations.total) === null || _result$aggregations$2 === void 0 ? void 0 : _result$aggregations$2.value) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : 0;
  return {
    certs,
    total
  };
};

exports.getCerts = getCerts;