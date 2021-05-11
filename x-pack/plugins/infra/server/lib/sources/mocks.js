"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInfraSourcesMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createInfraSourcesMock = () => ({
  getSourceConfiguration: jest.fn(),
  createSourceConfiguration: jest.fn(),
  deleteSourceConfiguration: jest.fn(),
  updateSourceConfiguration: jest.fn(),
  getAllSourceConfigurations: jest.fn(),
  getInternalSourceConfiguration: jest.fn(),
  defineInternalSourceConfiguration: jest.fn()
});

exports.createInfraSourcesMock = createInfraSourcesMock;