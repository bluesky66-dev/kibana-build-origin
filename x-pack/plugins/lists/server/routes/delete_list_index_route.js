"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteListIndexRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _shared_imports = require("../../common/shared_imports");

var _schemas = require("../../common/schemas");

var _2 = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Deletes all of the indexes, template, ilm policies, and aliases. You can check
 * this by looking at each of these settings from ES after a deletion:
 *
 * GET /_template/.lists-default
 * GET /.lists-default-000001/
 * GET /_ilm/policy/.lists-default
 * GET /_alias/.lists-default
 *
 * GET /_template/.items-default
 * GET /.items-default-000001/
 * GET /_ilm/policy/.items-default
 * GET /_alias/.items-default
 *
 * And ensuring they're all gone
 */


const deleteListIndexRoute = router => {
  router.delete({
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

      if (!listIndexExists && !listItemIndexExists) {
        return siemResponse.error({
          body: `index: "${lists.getListIndex()}" and "${lists.getListItemIndex()}" does not exist`,
          statusCode: 404
        });
      } else {
        if (listIndexExists) {
          await lists.deleteListIndex();
        }

        if (listItemIndexExists) {
          await lists.deleteListItemIndex();
        }

        const listsPolicyExists = await lists.getListPolicyExists();
        const listItemPolicyExists = await lists.getListItemPolicyExists();

        if (listsPolicyExists) {
          await lists.deleteListPolicy();
        }

        if (listItemPolicyExists) {
          await lists.deleteListItemPolicy();
        }

        const listsTemplateExists = await lists.getListTemplateExists();
        const listItemTemplateExists = await lists.getListItemTemplateExists();

        if (listsTemplateExists) {
          await lists.deleteListTemplate();
        }

        if (listItemTemplateExists) {
          await lists.deleteListItemTemplate();
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

exports.deleteListIndexRoute = deleteListIndexRoute;