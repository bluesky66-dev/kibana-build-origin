"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalRepository = exports.setInternalRepository = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let internalRepository = null;

const setInternalRepository = createInternalRepository => {
  internalRepository = createInternalRepository();
};

exports.setInternalRepository = setInternalRepository;

const getInternalRepository = () => internalRepository;

exports.getInternalRepository = getInternalRepository;