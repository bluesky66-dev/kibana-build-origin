"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResolveImportErrorsRoute = void 0;

var _path = require("path");

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _import = require("../import");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerResolveImportErrorsRoute = (router, {
  config,
  coreUsageData
}) => {
  const {
    maxImportPayloadBytes
  } = config;
  router.post({
    path: '/_resolve_import_errors',
    options: {
      body: {
        maxBytes: maxImportPayloadBytes,
        output: 'stream',
        accepts: 'multipart/form-data'
      }
    },
    validate: {
      query: _configSchema.schema.object({
        createNewCopies: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      body: _configSchema.schema.object({
        file: _configSchema.schema.stream(),
        retries: _configSchema.schema.arrayOf(_configSchema.schema.object({
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string(),
          overwrite: _configSchema.schema.boolean({
            defaultValue: false
          }),
          destinationId: _configSchema.schema.maybe(_configSchema.schema.string()),
          replaceReferences: _configSchema.schema.arrayOf(_configSchema.schema.object({
            type: _configSchema.schema.string(),
            from: _configSchema.schema.string(),
            to: _configSchema.schema.string()
          }), {
            defaultValue: []
          }),
          createNewCopy: _configSchema.schema.maybe(_configSchema.schema.boolean()),
          ignoreMissingReferences: _configSchema.schema.maybe(_configSchema.schema.boolean())
        }))
      })
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const {
      createNewCopies
    } = req.query;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsResolveImportErrors({
      request: req,
      createNewCopies
    }).catch(() => {});
    const file = req.body.file;
    const fileExtension = (0, _path.extname)(file.hapi.filename).toLowerCase();

    if (fileExtension !== '.ndjson') {
      return res.badRequest({
        body: `Invalid file extension ${fileExtension}`
      });
    }

    let readStream;

    try {
      readStream = await (0, _utils.createSavedObjectsStreamFromNdJson)(file);
    } catch (e) {
      return res.badRequest({
        body: e
      });
    }

    const {
      getClient,
      getImporter,
      typeRegistry
    } = context.core.savedObjects;
    const includedHiddenTypes = (0, _lodash.chain)(req.body.retries).map('type').uniq().filter(type => typeRegistry.isHidden(type) && typeRegistry.isImportableAndExportable(type)).value();
    const client = getClient({
      includedHiddenTypes
    });
    const importer = getImporter(client);

    try {
      const result = await importer.resolveImportErrors({
        readStream,
        retries: req.body.retries,
        createNewCopies
      });
      return res.ok({
        body: result
      });
    } catch (e) {
      if (e instanceof _import.SavedObjectsImportError) {
        return res.badRequest({
          body: {
            message: e.message,
            attributes: e.attributes
          }
        });
      }

      throw e;
    }
  }));
};

exports.registerResolveImportErrorsRoute = registerResolveImportErrorsRoute;