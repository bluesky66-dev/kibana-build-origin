"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaRequestToMetadataListESQuery = kibanaRequestToMetadataListESQuery;
exports.getESQueryHostMetadataByID = getESQueryHostMetadataByID;

var _server = require("../../../../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// sort using either event.created, or HostDetails.event.created,
// depending on whichever exists. This works for QueryStrat v1 and v2, and the v2+ schema change.
// using unmapped_type avoids errors when the given field doesn't exist, and sets to the 0-value for that type
// effectively ignoring it
// https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html#_ignoring_unmapped_fields


const MetadataSortMethod = [{
  'event.created': {
    order: 'desc',
    unmapped_type: 'date'
  }
}, {
  'HostDetails.event.created': {
    order: 'desc',
    unmapped_type: 'date'
  }
}];

async function kibanaRequestToMetadataListESQuery( // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, endpointAppContext, metadataQueryStrategy, queryBuilderOptions) {
  const pagingProperties = await getPagingProperties(request, endpointAppContext);
  return {
    body: {
      query: buildQueryBody(request, metadataQueryStrategy, queryBuilderOptions === null || queryBuilderOptions === void 0 ? void 0 : queryBuilderOptions.unenrolledAgentIds, queryBuilderOptions === null || queryBuilderOptions === void 0 ? void 0 : queryBuilderOptions.statusAgentIDs),
      ...metadataQueryStrategy.extraBodyProperties,
      sort: MetadataSortMethod
    },
    from: pagingProperties.pageIndex * pagingProperties.pageSize,
    size: pagingProperties.pageSize,
    index: metadataQueryStrategy.index
  };
}

async function getPagingProperties( // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, endpointAppContext) {
  var _request$body;

  const config = await endpointAppContext.config();
  const pagingProperties = {};

  if (request !== null && request !== void 0 && (_request$body = request.body) !== null && _request$body !== void 0 && _request$body.paging_properties) {
    for (const property of request.body.paging_properties) {
      Object.assign(pagingProperties, ...Object.keys(property).map(key => ({
        [key]: property[key]
      })));
    }
  }

  return {
    pageSize: pagingProperties.page_size || config.endpointResultListDefaultPageSize,
    pageIndex: pagingProperties.page_index || config.endpointResultListDefaultFirstPageIndex
  };
}

function buildQueryBody( // eslint-disable-next-line @typescript-eslint/no-explicit-any
request, metadataQueryStrategy, unerolledAgentIds, statusAgentIDs) {
  var _request$body2, _request$body2$filter; // the filtered properties may be preceded by 'HostDetails' under an older index mapping


  const filterUnenrolledAgents = unerolledAgentIds && unerolledAgentIds.length > 0 ? {
    must_not: [{
      terms: {
        'elastic.agent.id': unerolledAgentIds
      }
    }, // OR
    {
      terms: {
        'HostDetails.elastic.agent.id': unerolledAgentIds
      }
    }]
  } : null;
  const filterStatusAgents = statusAgentIDs ? {
    filter: [{
      bool: {
        // OR's the two together
        should: [{
          terms: {
            'elastic.agent.id': statusAgentIDs
          }
        }, {
          terms: {
            'HostDetails.elastic.agent.id': statusAgentIDs
          }
        }]
      }
    }]
  } : null;
  const idFilter = {
    bool: { ...filterUnenrolledAgents,
      ...filterStatusAgents
    }
  };

  if (request !== null && request !== void 0 && (_request$body2 = request.body) !== null && _request$body2 !== void 0 && (_request$body2$filter = _request$body2.filters) !== null && _request$body2$filter !== void 0 && _request$body2$filter.kql) {
    const kqlQuery = _server.esKuery.toElasticsearchQuery(_server.esKuery.fromKueryExpression(request.body.filters.kql));

    const q = [];

    if (filterUnenrolledAgents || filterStatusAgents) {
      q.push(idFilter);
    }

    q.push({ ...kqlQuery
    });
    return {
      bool: {
        must: q
      }
    };
  }

  return filterUnenrolledAgents || filterStatusAgents ? idFilter : {
    match_all: {}
  };
}

function getESQueryHostMetadataByID(agentID, metadataQueryStrategy) {
  return {
    body: {
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                term: {
                  'agent.id': agentID
                }
              }, {
                term: {
                  'HostDetails.agent.id': agentID
                }
              }]
            }
          }]
        }
      },
      sort: MetadataSortMethod,
      size: 1
    },
    index: metadataQueryStrategy.index
  };
}