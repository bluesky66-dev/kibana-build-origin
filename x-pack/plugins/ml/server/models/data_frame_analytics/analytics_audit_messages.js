"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyticsAuditMessagesProvider = analyticsAuditMessagesProvider;

var _index_patterns = require("../../../common/constants/index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SIZE = 50;

function analyticsAuditMessagesProvider({
  asInternalUser
}) {
  // search for audit messages,
  // analyticsId is optional. without it, all analytics will be listed.
  async function getAnalyticsAuditMessages(analyticsId) {
    const query = {
      bool: {
        filter: [{
          bool: {
            must_not: {
              term: {
                level: 'activity'
              }
            },
            must: {
              term: {
                job_type: 'data_frame_analytics'
              }
            }
          }
        }]
      }
    }; // if no analyticsId specified, load all of the messages

    if (analyticsId !== undefined) {
      query.bool.filter.push({
        bool: {
          should: [{
            term: {
              job_id: '' // catch system messages

            }
          }, {
            term: {
              job_id: analyticsId // messages for specified analyticsId

            }
          }]
        }
      });
    }

    const {
      body
    } = await asInternalUser.search({
      index: _index_patterns.ML_NOTIFICATION_INDEX_PATTERN,
      ignore_unavailable: true,
      size: SIZE,
      body: {
        sort: [{
          timestamp: {
            order: 'desc'
          }
        }, {
          job_id: {
            order: 'asc'
          }
        }],
        query
      }
    });
    let messages = [];

    if (body.hits.total.value > 0) {
      messages = body.hits.hits.map(hit => hit._source);
      messages.reverse();
    }

    return messages;
  }

  return {
    getAnalyticsAuditMessages
  };
}