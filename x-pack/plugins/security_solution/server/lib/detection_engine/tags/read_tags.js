"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readRawTags = exports.readTags = exports.convertTagsToSet = exports.convertToTags = exports.isTags = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../common/constants");

var _find_rules = require("../rules/find_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isTags = obj => {
  return (0, _fp.has)('tags', obj);
};

exports.isTags = isTags;

const convertToTags = tagObjects => {
  const tags = tagObjects.reduce((accum, tagObj) => {
    if (isTags(tagObj)) {
      return [...accum, ...tagObj.tags];
    } else {
      return accum;
    }
  }, []);
  return tags;
};

exports.convertToTags = convertToTags;

const convertTagsToSet = tagObjects => {
  return new Set(convertToTags(tagObjects));
}; // Note: This is doing an in-memory aggregation of the tags by calling each of the alerting
// records in batches of this const setting and uses the fields to try to get the least
// amount of data per record back. If saved objects at some point supports aggregations
// then this should be replaced with a an aggregation call.
// Ref: https://www.elastic.co/guide/en/kibana/master/saved-objects-api.html


exports.convertTagsToSet = convertTagsToSet;

const readTags = async ({
  alertsClient
}) => {
  const tags = await readRawTags({
    alertsClient
  });
  return tags.filter(tag => !tag.startsWith(_constants.INTERNAL_IDENTIFIER));
};

exports.readTags = readTags;

const readRawTags = async ({
  alertsClient
}) => {
  // Get just one record so we can get the total count
  const firstTags = await (0, _find_rules.findRules)({
    alertsClient,
    fields: ['tags'],
    perPage: 1,
    page: 1,
    sortField: 'createdAt',
    sortOrder: 'desc',
    filter: undefined
  }); // Get all the rules to aggregate over all the tags of the rules

  const rules = await (0, _find_rules.findRules)({
    alertsClient,
    fields: ['tags'],
    perPage: firstTags.total,
    sortField: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    filter: undefined
  });
  const tagSet = convertTagsToSet(rules.data);
  return Array.from(tagSet);
};

exports.readRawTags = readRawTags;