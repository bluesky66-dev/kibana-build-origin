"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseXmlString = parseXmlString;

var _xml2js = require("xml2js");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// promise based wrapper around parseString


async function parseXmlString(xmlString) {
  const parsePromise = new Promise((resolve, reject) => {
    (0, _xml2js.parseString)(xmlString, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
  return await parsePromise;
}