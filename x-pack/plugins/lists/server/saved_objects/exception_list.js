"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exceptionListAgnosticType = exports.exceptionListType = exports.exceptionListItemMapping = exports.exceptionListMapping = exports.commonMapping = void 0;

var _types = require("../../common/types");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This is a super set of exception list and exception list items. The switch
 * to determine if you are using an exception list vs. an exception list item
 * is "list_type". If "list_type" is "list" then it is an exception list. If
 * "list_type" is "item" then the type is an item.
 */


const commonMapping = {
  properties: {
    _tags: {
      type: 'keyword'
    },
    created_at: {
      type: 'keyword'
    },
    created_by: {
      type: 'keyword'
    },
    description: {
      type: 'keyword'
    },
    immutable: {
      type: 'boolean'
    },
    list_id: {
      type: 'keyword'
    },
    list_type: {
      type: 'keyword'
    },
    meta: {
      type: 'keyword'
    },
    name: {
      fields: {
        text: {
          type: 'text'
        }
      },
      type: 'keyword'
    },
    tags: {
      fields: {
        text: {
          type: 'text'
        }
      },
      type: 'keyword'
    },
    tie_breaker_id: {
      type: 'keyword'
    },
    type: {
      type: 'keyword'
    },
    updated_by: {
      type: 'keyword'
    },
    version: {
      type: 'keyword'
    }
  }
};
exports.commonMapping = commonMapping;
const exceptionListMapping = {
  properties: {// There is nothing that is not also used within exceptionListItemMapping
    // at this time but if there is it should go here
  }
};
exports.exceptionListMapping = exceptionListMapping;
const exceptionListItemMapping = {
  properties: {
    comments: {
      properties: {
        comment: {
          type: 'keyword'
        },
        created_at: {
          type: 'keyword'
        },
        created_by: {
          type: 'keyword'
        },
        id: {
          type: 'keyword'
        },
        updated_at: {
          type: 'keyword'
        },
        updated_by: {
          type: 'keyword'
        }
      }
    },
    entries: {
      properties: {
        entries: {
          properties: {
            field: {
              type: 'keyword'
            },
            operator: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            },
            value: {
              fields: {
                text: {
                  type: 'text'
                }
              },
              type: 'keyword'
            }
          }
        },
        field: {
          type: 'keyword'
        },
        list: {
          properties: {
            id: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            }
          }
        },
        operator: {
          type: 'keyword'
        },
        type: {
          type: 'keyword'
        },
        value: {
          fields: {
            text: {
              type: 'text'
            }
          },
          type: 'keyword'
        }
      }
    },
    item_id: {
      type: 'keyword'
    },
    os_types: {
      type: 'keyword'
    }
  }
};
exports.exceptionListItemMapping = exceptionListItemMapping;
const combinedMappings = {
  properties: { ...commonMapping.properties,
    ...exceptionListMapping.properties,
    ...exceptionListItemMapping.properties
  }
};
const exceptionListType = {
  hidden: false,
  mappings: combinedMappings,
  migrations: _migrations.migrations,
  name: _types.exceptionListSavedObjectType,
  namespaceType: 'single'
};
exports.exceptionListType = exceptionListType;
const exceptionListAgnosticType = {
  hidden: false,
  mappings: combinedMappings,
  migrations: _migrations.migrations,
  name: _types.exceptionListAgnosticSavedObjectType,
  namespaceType: 'agnostic'
};
exports.exceptionListAgnosticType = exceptionListAgnosticType;