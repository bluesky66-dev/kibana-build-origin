"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentsMigrations = exports.userActionsMigrations = exports.configureMigrations = exports.caseMigrations = void 0;

var _api = require("../../common/api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


const caseMigrations = {
  '7.10.0': doc => {
    const {
      connector_id,
      ...attributesWithoutConnectorId
    } = doc.attributes;
    return { ...doc,
      attributes: { ...attributesWithoutConnectorId,
        connector: {
          id: connector_id !== null && connector_id !== void 0 ? connector_id : 'none',
          name: 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }
      },
      references: doc.references || []
    };
  },
  '7.11.0': doc => {
    return { ...doc,
      attributes: { ...doc.attributes,
        settings: {
          syncAlerts: true
        }
      },
      references: doc.references || []
    };
  },
  '7.12.0': doc => {
    const {
      fields,
      type
    } = doc.attributes.connector;
    return { ...doc,
      attributes: { ...doc.attributes,
        type: _api.CaseType.individual,
        connector: { ...doc.attributes.connector,
          fields: Array.isArray(fields) && fields.length > 0 && type === _api.ConnectorTypes.serviceNowITSM ? [...fields, {
            key: 'category',
            value: null
          }, {
            key: 'subcategory',
            value: null
          }] : fields
        }
      },
      references: doc.references || []
    };
  }
};
exports.caseMigrations = caseMigrations;
const configureMigrations = {
  '7.10.0': doc => {
    const {
      connector_id,
      connector_name,
      ...restAttributes
    } = doc.attributes;
    return { ...doc,
      attributes: { ...restAttributes,
        connector: {
          id: connector_id !== null && connector_id !== void 0 ? connector_id : 'none',
          name: connector_name !== null && connector_name !== void 0 ? connector_name : 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }
      },
      references: doc.references || []
    };
  }
};
exports.configureMigrations = configureMigrations;
const userActionsMigrations = {
  '7.10.0': doc => {
    const {
      action_field,
      new_value,
      old_value,
      ...restAttributes
    } = doc.attributes;

    if (action_field == null || !Array.isArray(action_field) || action_field[0] !== 'connector_id') {
      return { ...doc,
        references: doc.references || []
      };
    }

    return { ...doc,
      attributes: { ...restAttributes,
        action_field: ['connector'],
        new_value: new_value != null ? JSON.stringify({
          id: new_value,
          name: 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }) : new_value,
        old_value: old_value != null ? JSON.stringify({
          id: old_value,
          name: 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }) : old_value
      },
      references: doc.references || []
    };
  }
};
exports.userActionsMigrations = userActionsMigrations;
const commentsMigrations = {
  '7.11.0': doc => {
    return { ...doc,
      attributes: { ...doc.attributes,
        type: _api.CommentType.user
      },
      references: doc.references || []
    };
  },
  '7.12.0': doc => {
    let attributes = { ...doc.attributes,
      associationType: _api.AssociationType.case
    }; // only add the rule object for alert comments. Prior to 7.12 we only had CommentType.alert, generated alerts are
    // introduced in 7.12.

    if (doc.attributes.type === _api.CommentType.alert) {
      attributes = { ...attributes,
        rule: {
          id: null,
          name: null
        }
      };
    }

    return { ...doc,
      attributes,
      references: doc.references || []
    };
  }
};
exports.commentsMigrations = commentsMigrations;