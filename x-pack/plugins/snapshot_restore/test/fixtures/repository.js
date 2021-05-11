"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepository = void 0;

var _jest = require("@kbn/test/jest");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultSettings = {
  chunkSize: '10mb',
  location: '/tmp/es-backups'
};

const getRepository = ({
  name = (0, _jest.getRandomString)(),
  type = 'fs',
  settings = defaultSettings
} = {}) => ({
  name,
  type,
  settings
});

exports.getRepository = getRepository;