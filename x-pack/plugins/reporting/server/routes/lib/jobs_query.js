"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobsQueryFactory = jobsQueryFactory;

var _i18n = require("@kbn/i18n");

var _elasticsearch = require("elasticsearch");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const esErrors = _elasticsearch.errors;
const defaultSize = 10; // TODO: use SearchRequest from elasticsearch-client

const getUsername = user => user ? user.username : false;

function jobsQueryFactory(reportingCore) {
  const {
    elasticsearch
  } = reportingCore.getPluginSetupDeps();
  const {
    callAsInternalUser
  } = elasticsearch.legacy.client;

  function execQuery(queryType, body) {
    const defaultBody = {
      search: {
        _source: {
          excludes: ['output.content']
        },
        sort: [{
          created_at: {
            order: 'desc'
          }
        }],
        size: defaultSize
      }
    };
    const config = reportingCore.getConfig();
    const index = config.get('index');
    const query = {
      index: `${index}-*`,
      body: Object.assign(defaultBody[queryType] || {}, body)
    };
    return callAsInternalUser(queryType, query).catch(err => {
      if (err instanceof esErrors['401']) return;
      if (err instanceof esErrors['403']) return;
      if (err instanceof esErrors['404']) return;
      throw err;
    });
  }

  function getHits(query) {
    return query.then(res => (0, _lodash.get)(res, 'hits.hits', []));
  }

  return {
    list(jobTypes, user, page = 0, size = defaultSize, jobIds) {
      const username = getUsername(user);
      const body = {
        size,
        from: size * page,
        query: {
          constant_score: {
            filter: {
              bool: {
                must: [{
                  terms: {
                    jobtype: jobTypes
                  }
                }, {
                  term: {
                    created_by: username
                  }
                }]
              }
            }
          }
        }
      };

      if (jobIds) {
        body.query.constant_score.filter.bool.must.push({
          ids: {
            values: jobIds
          }
        });
      }

      return getHits(execQuery('search', body));
    },

    count(jobTypes, user) {
      const username = getUsername(user);
      const body = {
        query: {
          constant_score: {
            filter: {
              bool: {
                must: [{
                  terms: {
                    jobtype: jobTypes
                  }
                }, {
                  term: {
                    created_by: username
                  }
                }]
              }
            }
          }
        }
      };
      return execQuery('count', body).then(doc => {
        if (!doc) return 0;
        return doc.count;
      });
    },

    get(user, id, opts = {}) {
      if (!id) return Promise.resolve();
      const username = getUsername(user);
      const body = {
        query: {
          constant_score: {
            filter: {
              bool: {
                must: [{
                  term: {
                    _id: id
                  }
                }, {
                  term: {
                    created_by: username
                  }
                }]
              }
            }
          }
        },
        size: 1
      };

      if (opts.includeContent) {
        body._source = {
          excludes: []
        };
      }

      return getHits(execQuery('search', body)).then(hits => {
        if (hits.length !== 1) return;
        return hits[0];
      });
    },

    async delete(deleteIndex, id) {
      try {
        const query = {
          id,
          index: deleteIndex,
          refresh: true
        };
        return callAsInternalUser('delete', query);
      } catch (error) {
        throw new Error(_i18n.i18n.translate('xpack.reporting.jobsQuery.deleteError', {
          defaultMessage: 'Could not delete the report: {error}',
          values: {
            error: error.message
          }
        }));
      }
    }

  };
}