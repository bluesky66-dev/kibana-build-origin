"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readReporters = exports.convertToReporters = void 0;

var _saved_object_types = require("../../saved_object_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const convertToReporters = caseObjects => caseObjects.reduce((accum, caseObj) => {
  if (caseObj && caseObj.attributes && caseObj.attributes.created_by && caseObj.attributes.created_by.username && !accum.some(item => item.username === caseObj.attributes.created_by.username)) {
    return [...accum, caseObj.attributes.created_by];
  } else {
    return accum;
  }
}, []);

exports.convertToReporters = convertToReporters;

const readReporters = async ({
  client
}) => {
  const firstReporters = await client.find({
    type: _saved_object_types.CASE_SAVED_OBJECT,
    fields: ['created_by'],
    page: 1,
    perPage: 1
  });
  const reporters = await client.find({
    type: _saved_object_types.CASE_SAVED_OBJECT,
    fields: ['created_by'],
    page: 1,
    perPage: firstReporters.total
  });
  return convertToReporters(reporters.saved_objects);
};

exports.readReporters = readReporters;