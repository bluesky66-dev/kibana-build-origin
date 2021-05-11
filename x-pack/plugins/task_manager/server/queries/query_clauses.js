"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchesClauses = matchesClauses;
exports.shouldBeOneOf = shouldBeOneOf;
exports.mustBeAllOf = mustBeAllOf;
exports.filterDownBy = filterDownBy;
exports.asPinnedQuery = asPinnedQuery;
exports.asUpdateByQuery = asUpdateByQuery;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Terminology
 * ===========
 * The terms for the differenct clauses in an Elasticsearch query can be confusing, here are some
 * clarifications that might help you understand the Typescript types we use here.
 *
 * Given the following Query:
 * {
 *   "query": { (1)
 *      "bool": { (2)
 *        "must":
 *          [
 * (3)        { "term" : { "tag" : "wow" } },
 *            { "term" : { "tag" : "elasticsearch" } },
 *            {
 *              "must" : { "term" : { "user" : "kimchy" } }
 *            }
 *          ]
 *       }
 *    }
 * }
 *
 * These are referred to as:
 *  (1). BoolClause / BoolClauseWithAnyCondition
 *  (2). BoolCondition / AnyBoolCondition
 *  (3). BoolClauseFilter
 *
 */

var Conditions;
/**
 * Describe a specific BoolClause Condition with a BoolClauseFilter on it, such as:
 * ```
 * {
 *  must : [
 *    T, ...
 *  ]
 * }
 * ```
 */

(function (Conditions) {
  Conditions["Should"] = "should";
  Conditions["Must"] = "must";
  Conditions["MustNot"] = "must_not";
  Conditions["Filter"] = "filter";
})(Conditions || (Conditions = {}));

function matchesClauses(...clauses) {
  return {
    bool: Object.assign({}, ...clauses.map(clause => clause.bool))
  };
}

function shouldBeOneOf(...should) {
  return {
    bool: {
      should
    }
  };
}

function mustBeAllOf(...must) {
  return {
    bool: {
      must
    }
  };
}

function filterDownBy(...filter) {
  return {
    bool: {
      filter
    }
  };
}

function asPinnedQuery(ids, organic) {
  return {
    pinned: {
      ids,
      organic
    }
  };
}

function asUpdateByQuery({
  query,
  update,
  sort
}) {
  return {
    query,
    sort,
    seq_no_primary_term: true,
    script: update
  };
}