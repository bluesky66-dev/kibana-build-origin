"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListIndexRoute = void 0;

var _siem_server_deps = require("../siem_server_deps");

var _shared_imports = require("../../common/shared_imports");

var _constants = require("../../common/constants");

var _schemas = require("../../common/schemas");

var _2 = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createListIndexRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.LIST_INDEX,
    validate: false
  }, async (context, _, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const lists = (0, _2.getListClient)(context);
      const listIndexExists = await lists.getListIndexExists();
      const listItemIndexExists = await lists.getListItemIndexExists();

      if (listIndexExists && listItemIndexExists) {
        return siemResponse.error({
          body: `index: "${lists.getListIndex()}" and "${lists.getListItemIndex()}" already exists`,
          statusCode: 409
        });
      } else {
        const policyExists = await lists.getListPolicyExists();
        const policyListItemExists = await lists.getListItemPolicyExists();

        if (!policyExists) {
          await lists.setListPolicy();
        }

        if (!policyListItemExists) {
          await lists.setListItemPolicy();
        }

        const templateExists = await lists.getListTemplateExists();
        const templateListItemsExists = await lists.getListItemTemplateExists();

        if (!templateExists) {
          await lists.setListTemplate();
        }

        if (!templateListItemsExists) {
          await lists.setListItemTemplate();
        }

        if (!listIndexExists) {
          await lists.createListBootStrapIndex();
        }

        if (!listItemIndexExists) {
          await lists.createListItemBootStrapIndex();
        }

        const [validated, errors] = (0, _shared_imports.validate)({
          acknowledged: true
        }, _schemas.acknowledgeSchema);

        if (errors != null) {
          return siemResponse.error({
            body: errors,
            statusCode: 500
          });
        } else {
          return response.ok({
            body: validated !== null && validated !== void 0 ? validated : {}
          });
        }
      }
    } catch (err) {
      const error = (0, _siem_server_deps.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.createListIndexRoute = createListIndexRoute;