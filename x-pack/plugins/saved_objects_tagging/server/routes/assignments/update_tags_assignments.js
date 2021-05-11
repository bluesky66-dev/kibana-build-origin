"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateTagsAssignmentsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerUpdateTagsAssignmentsRoute = router => {
  const objectReferenceSchema = _configSchema.schema.object({
    type: _configSchema.schema.string(),
    id: _configSchema.schema.string()
  });

  router.post({
    path: '/api/saved_objects_tagging/assignments/update_by_tags',
    validate: {
      body: _configSchema.schema.object({
        tags: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
          minSize: 1
        }),
        assign: _configSchema.schema.arrayOf(objectReferenceSchema, {
          defaultValue: []
        }),
        unassign: _configSchema.schema.arrayOf(objectReferenceSchema, {
          defaultValue: []
        })
      }, {
        validate: ({
          assign,
          unassign
        }) => {
          if (assign.length === 0 && unassign.length === 0) {
            return 'either `assign` or `unassign` must be specified';
          }
        }
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    try {
      const {
        assignmentService
      } = ctx.tags;
      const {
        tags,
        assign,
        unassign
      } = req.body;
      await assignmentService.updateTagAssignments({
        tags,
        assign,
        unassign
      });
      return res.ok({
        body: {}
      });
    } catch (e) {
      if (e instanceof _services.AssignmentError) {
        return res.customError({
          statusCode: e.status,
          body: e.message
        });
      }

      throw e;
    }
  }));
};

exports.registerUpdateTagsAssignmentsRoute = registerUpdateTagsAssignmentsRoute;