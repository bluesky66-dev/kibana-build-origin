"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPastDays = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getPastDays = dateString => {
  const date = new Date(dateString);
  const today = new Date();
  const diff = Math.abs(date.getTime() - today.getTime());
  return Math.trunc(diff / (1000 * 60 * 60 * 24));
};

exports.getPastDays = getPastDays;