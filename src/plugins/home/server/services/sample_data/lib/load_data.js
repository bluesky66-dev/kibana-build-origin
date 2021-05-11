"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadData = loadData;

var _readline = _interopRequireDefault(require("readline"));

var _fs = _interopRequireDefault(require("fs"));

var _zlib = require("zlib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const BULK_INSERT_SIZE = 500;

function loadData(path, bulkInsert) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let docs = [];
    let isPaused = false; // pause does not stop lines already in buffer. Use smaller buffer size to avoid bulk inserting to many records

    const readStream = _fs.default.createReadStream(path, {
      highWaterMark: 1024 * 4
    });

    const lineStream = _readline.default.createInterface({
      input: readStream.pipe((0, _zlib.createUnzip)())
    });

    const onClose = async () => {
      if (docs.length > 0) {
        try {
          await bulkInsert(docs);
        } catch (err) {
          reject(err);
          return;
        }
      }

      resolve(count);
    };

    lineStream.on('close', onClose);

    const closeWithError = err => {
      lineStream.removeListener('close', onClose);
      lineStream.close();
      reject(err);
    };

    lineStream.on('line', async line => {
      if (line.length === 0 || line.charAt(0) === '#') {
        return;
      }

      let doc;

      try {
        doc = JSON.parse(line);
      } catch (err) {
        closeWithError(new Error(`Unable to parse line as JSON document, line: """${line}""", Error: ${err.message}`));
        return;
      }

      count++;
      docs.push(doc);

      if (docs.length >= BULK_INSERT_SIZE && !isPaused) {
        lineStream.pause(); // readline pause is leaky and events in buffer still get sent after pause
        // need to clear buffer before async call

        const docstmp = docs.slice();
        docs = [];

        try {
          await bulkInsert(docstmp);
          lineStream.resume();
        } catch (err) {
          closeWithError(err);
        }
      }
    });
    lineStream.on('pause', async () => {
      isPaused = true;
    });
    lineStream.on('resume', async () => {
      isPaused = false;
    });
  });
}