"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workpadTemplateType = void 0;

var _constants = require("../../common/lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const workpadTemplateType = {
  name: _constants.TEMPLATE_TYPE,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {
      name: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword'
          }
        }
      },
      help: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword'
          }
        }
      },
      tags: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword'
          }
        }
      },
      template_key: {
        type: 'keyword'
      }
    }
  },
  migrations: {},
  management: {
    importableAndExportable: false,
    icon: 'canvasApp',
    defaultSearchField: 'name',

    getTitle(obj) {
      return obj.attributes.name;
    }

  }
};
exports.workpadTemplateType = workpadTemplateType;