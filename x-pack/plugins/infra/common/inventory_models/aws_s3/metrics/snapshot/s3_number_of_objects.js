"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3NumberOfObjects = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const s3NumberOfObjects = {
  s3NumberOfObjects: {
    max: {
      field: 'aws.s3_daily_storage.number_of_objects'
    }
  }
};
exports.s3NumberOfObjects = s3NumberOfObjects;