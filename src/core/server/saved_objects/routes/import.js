"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerImportRoute = void 0;

var _path = require("path");

var _configSchema = require("@kbn/config-schema");

var _import = require("../import");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerImportRoute = (router, {
  config,
  coreUsageData
}) => {
  const {
    maxImportPayloadBytes
  } = config;
  router.post({
    path: '/_import',
    options: {
      body: {
        maxBytes: maxImportPayloadBytes,
        output: 'stream',
        accepts: 'multipart/form-data'
      }
    },
    validate: {
      query: _configSchema.schema.object({
        overwrite: _configSchema.schema.boolean({
          defaultValue: false
        }),
        createNewCopies: _configSchema.schema.boolean({
          defaultValue: false
        })
      }, {
        validate: object => {
          if (object.overwrite && object.createNewCopies) {
            return 'cannot use [overwrite] with [createNewCopies]';
          }
        }
      }),
      body: _configSchema.schema.object({
        file: _configSchema.schema.stream()
      })
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const {
      overwrite,
      createNewCopies
    } = req.query;
    const {
      getClient,
      getImporter,
      typeRegistry
    } = context.core.savedObjects;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsImport({
      request: req,
      createNewCopies,
      overwrite
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

    const supportedTypes = typeRegistry.getImportableAndExportableTypes().map(t => t.name);
    const includedHiddenTypes = supportedTypes.filter(supportedType => typeRegistry.isHidden(supportedType));
    const client = getClient({
      includedHiddenTypes
    });
    const importer = getImporter(client);

    try {
      const result = await importer.import({
        readStream,
        overwrite,
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

exports.registerImportRoute = registerImportRoute;