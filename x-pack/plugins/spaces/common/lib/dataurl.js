"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
exports.imageTypes = void 0;

var _base64Js = require("base64-js");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const imageTypes = ['image/svg+xml', 'image/jpeg', 'image/png', 'image/gif'];
exports.imageTypes = imageTypes;

function encode(data, type = 'text/plain') {
  // use FileReader if it's available, like in the browser
  if (FileReader) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result);

      reader.onerror = err => reject(err);

      reader.readAsDataURL(data);
    });
  } // otherwise fall back to fromByteArray
  // note: Buffer doesn't seem to correctly base64 encode binary data


  return Promise.resolve(`data:${type};base64,${(0, _base64Js.fromByteArray)(data)}`);
}