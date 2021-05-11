"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TWO_KEYS_PATH = exports.TWO_CAS_PATH = exports.NO_KEY_PATH = exports.NO_CERT_PATH = exports.NO_CA_PATH = void 0;

var _path = require("path");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const NO_CA_PATH = (0, _path.resolve)(__dirname, './no_ca.p12');
exports.NO_CA_PATH = NO_CA_PATH;
const NO_CERT_PATH = (0, _path.resolve)(__dirname, './no_cert.p12');
exports.NO_CERT_PATH = NO_CERT_PATH;
const NO_KEY_PATH = (0, _path.resolve)(__dirname, './no_key.p12');
exports.NO_KEY_PATH = NO_KEY_PATH;
const TWO_CAS_PATH = (0, _path.resolve)(__dirname, './two_cas.p12');
exports.TWO_CAS_PATH = TWO_CAS_PATH;
const TWO_KEYS_PATH = (0, _path.resolve)(__dirname, './two_keys.p12');
exports.TWO_KEYS_PATH = TWO_KEYS_PATH;