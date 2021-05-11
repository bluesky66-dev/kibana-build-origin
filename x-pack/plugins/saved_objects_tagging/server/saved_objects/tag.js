"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagType = void 0;

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const tagType = {
  name: _common.tagSavedObjectTypeName,
  hidden: false,
  namespaceType: 'single',
  mappings: {
    properties: {
      name: {
        type: 'text'
      },
      description: {
        type: 'text'
      },
      color: {
        type: 'text'
      }
    }
  },
  management: {
    importableAndExportable: true,
    defaultSearchField: 'name',
    icon: 'tag',
    getTitle: obj => obj.attributes.name
  }
};
exports.tagType = tagType;