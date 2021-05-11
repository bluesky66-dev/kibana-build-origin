"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toError = exports.toPromise = void 0;

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const toPromise = async taskEither => (0, _pipeable.pipe)(await taskEither(), (0, _Either.fold)(e => Promise.reject(e), a => Promise.resolve(a)));

exports.toPromise = toPromise;

const toError = e => e instanceof Error ? e : new Error(String(e));

exports.toError = toError;