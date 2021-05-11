"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchTagUsageData = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Manual type reflection of the `tagDataAggregations` resulting payload
 */

const fetchTagUsageData = async ({
  esClient,
  kibanaIndex
}) => {
  const {
    body
  } = await esClient.search({
    index: [kibanaIndex],
    ignore_unavailable: true,
    filter_path: 'aggregations',
    body: {
      size: 0,
      query: {
        bool: {
          must: [hasTagReferenceClause]
        }
      },
      aggs: tagDataAggregations
    }
  });
  const byTypeUsages = {};
  const allUsedTags = new Set();
  let totalTaggedObjects = 0;
  const typeBuckets = body.aggregations.by_type.buckets;
  typeBuckets.forEach(bucket => {
    const type = bucket.key;
    const taggedDocCount = bucket.doc_count;
    const usedTagIds = bucket.nested_ref.tag_references.tag_id.buckets.map(tagBucket => tagBucket.key);
    totalTaggedObjects += taggedDocCount;
    usedTagIds.forEach(tagId => allUsedTags.add(tagId));
    byTypeUsages[type] = {
      taggedObjects: taggedDocCount,
      usedTags: usedTagIds.length
    };
  });
  return {
    usedTags: allUsedTags.size,
    taggedObjects: totalTaggedObjects,
    types: byTypeUsages
  };
};

exports.fetchTagUsageData = fetchTagUsageData;
const hasTagReferenceClause = {
  nested: {
    path: 'references',
    query: {
      bool: {
        must: [{
          term: {
            'references.type': 'tag'
          }
        }]
      }
    }
  }
};
const tagDataAggregations = {
  by_type: {
    terms: {
      field: 'type'
    },
    aggs: {
      nested_ref: {
        nested: {
          path: 'references'
        },
        aggs: {
          tag_references: {
            filter: {
              term: {
                'references.type': 'tag'
              }
            },
            aggs: {
              tag_id: {
                terms: {
                  field: 'references.id'
                }
              }
            }
          }
        }
      }
    }
  }
};