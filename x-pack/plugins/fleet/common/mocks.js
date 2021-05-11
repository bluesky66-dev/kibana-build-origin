"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPackagePolicyMock = exports.createNewPackagePolicyMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createNewPackagePolicyMock = () => {
  return {
    name: 'endpoint-1',
    description: '',
    namespace: 'default',
    enabled: true,
    policy_id: '93c46720-c217-11ea-9906-b5b8a21b268e',
    output_id: '',
    package: {
      name: 'endpoint',
      title: 'Elastic Endpoint',
      version: '0.9.0'
    },
    inputs: []
  };
};

exports.createNewPackagePolicyMock = createNewPackagePolicyMock;

const createPackagePolicyMock = () => {
  const newPackagePolicy = createNewPackagePolicyMock();
  return { ...newPackagePolicy,
    id: 'c6d16e42-c32d-4dce-8a88-113cfe276ad1',
    version: 'abcd',
    revision: 1,
    updated_at: '2020-06-25T16:03:38.159292',
    updated_by: 'kibana',
    created_at: '2020-06-25T16:03:38.159292',
    created_by: 'kibana',
    inputs: [{
      config: {},
      enabled: true,
      type: 'endpoint',
      streams: []
    }]
  };
};

exports.createPackagePolicyMock = createPackagePolicyMock;