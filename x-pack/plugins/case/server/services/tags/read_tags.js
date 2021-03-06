"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readRawTags = exports.readTags = exports.convertTagsToSet = exports.convertToTags = void 0;

var _saved_object_types = require("../../saved_object_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const convertToTags = tagObjects => tagObjects.reduce((accum, tagObj) => {
  if (tagObj && tagObj.attributes && tagObj.attributes.tags) {
    return [...accum, ...tagObj.attributes.tags];
  } else {
    return accum;
  }
}, []);

exports.convertToTags = convertToTags;

const convertTagsToSet = tagObjects => {
  return new Set(convertToTags(tagObjects));
}; // Note: This is doing an in-memory aggregation of the tags by calling each of the case
// records in batches of this const setting and uses the fields to try to get the least
// amount of data per record back. If saved objects at some point supports aggregations
// then this should be replaced with a an aggregation call.
// Ref: https://www.elastic.co/guide/en/kibana/master/saved-objects-api.html


exports.convertTagsToSet = convertTagsToSet;

const readTags = async ({
  client
}) => {
  const tags = await readRawTags({
    client
  });
  return tags;
};

exports.readTags = readTags;

const readRawTags = async ({
  client
}) => {
  const firstTags = await client.find({
    type: _saved_object_types.CASE_SAVED_OBJECT,
    fields: ['tags'],
    page: 1,
    perPage: 1
  });
  const tags = await client.find({
    type: _saved_object_types.CASE_SAVED_OBJECT,
    fields: ['tags'],
    page: 1,
    perPage: firstTags.total
  });
  return Array.from(convertTagsToSet(tags.saved_objects));
};

exports.readRawTags = readRawTags;