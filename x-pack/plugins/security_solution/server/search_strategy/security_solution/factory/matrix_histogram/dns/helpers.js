"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDnsParsedData = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDnsParsedData = (data, keyBucket) => {
  let result = [];
  data.forEach(bucketData => {
    const questionName = (0, _fp.get)('key', bucketData);
    const histData = (0, _fp.getOr)([], keyBucket, bucketData).map( // eslint-disable-next-line @typescript-eslint/naming-convention
    ({
      key,
      doc_count
    }) => ({
      x: key,
      y: doc_count,
      g: questionName
    }));
    result = [...result, ...histData];
  });
  return result;
};

exports.getDnsParsedData = getDnsParsedData;