"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExportRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _utils = require("@kbn/utils");

var _export = require("../export");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const cleanOptions = ({
  type,
  objects,
  search,
  hasReference,
  excludeExportDetails,
  includeReferencesDeep
}) => {
  return {
    types: typeof type === 'string' ? [type] : type,
    search,
    objects,
    hasReference: hasReference && !Array.isArray(hasReference) ? [hasReference] : hasReference,
    excludeExportDetails,
    includeReferencesDeep
  };
};

const isExportByTypeOptions = options => {
  return Boolean(options.types);
};

const validateOptions = ({
  types,
  objects,
  excludeExportDetails,
  hasReference,
  includeReferencesDeep,
  search
}, {
  exportSizeLimit,
  supportedTypes,
  request
}) => {
  var _types$length, _objects$length;

  const hasTypes = ((_types$length = types === null || types === void 0 ? void 0 : types.length) !== null && _types$length !== void 0 ? _types$length : 0) > 0;
  const hasObjects = ((_objects$length = objects === null || objects === void 0 ? void 0 : objects.length) !== null && _objects$length !== void 0 ? _objects$length : 0) > 0;

  if (!hasTypes && !hasObjects) {
    throw new Error('Either `type` or `objects` are required.');
  }

  if (hasTypes && hasObjects) {
    throw new Error(`Can't specify both "types" and "objects" properties when exporting`);
  }

  if (hasObjects) {
    if (objects.length > exportSizeLimit) {
      throw new Error(`Can't export more than ${exportSizeLimit} objects`);
    }

    if (typeof search === 'string') {
      throw new Error(`Can't specify both "search" and "objects" properties when exporting`);
    }

    if (hasReference && hasReference.length) {
      throw new Error(`Can't specify both "references" and "objects" properties when exporting`);
    }

    const validationError = (0, _utils2.validateObjects)(objects, supportedTypes);

    if (validationError) {
      throw new Error(validationError);
    }

    return {
      objects: objects,
      excludeExportDetails,
      includeReferencesDeep,
      request
    };
  } else {
    const validationError = (0, _utils2.validateTypes)(types, supportedTypes);

    if (validationError) {
      throw new Error(validationError);
    }

    return {
      types: types,
      hasReference,
      search,
      excludeExportDetails,
      includeReferencesDeep,
      request
    };
  }
};

const registerExportRoute = (router, {
  config,
  coreUsageData
}) => {
  const {
    maxImportExportSize
  } = config;

  const referenceSchema = _configSchema.schema.object({
    type: _configSchema.schema.string(),
    id: _configSchema.schema.string()
  });

  router.post({
    path: '/_export',
    validate: {
      body: _configSchema.schema.object({
        type: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
        hasReference: _configSchema.schema.maybe(_configSchema.schema.oneOf([referenceSchema, _configSchema.schema.arrayOf(referenceSchema)])),
        objects: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        }), {
          maxSize: maxImportExportSize
        })),
        search: _configSchema.schema.maybe(_configSchema.schema.string()),
        includeReferencesDeep: _configSchema.schema.boolean({
          defaultValue: false
        }),
        excludeExportDetails: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, (0, _utils2.catchAndReturnBoomErrors)(async (context, req, res) => {
    const cleaned = cleanOptions(req.body);
    const {
      typeRegistry,
      getExporter,
      getClient
    } = context.core.savedObjects;
    const supportedTypes = typeRegistry.getImportableAndExportableTypes().map(t => t.name);
    let options;

    try {
      options = validateOptions(cleaned, {
        request: req,
        exportSizeLimit: maxImportExportSize,
        supportedTypes
      });
    } catch (e) {
      return res.badRequest({
        body: e
      });
    }

    const includedHiddenTypes = supportedTypes.filter(supportedType => typeRegistry.isHidden(supportedType));
    const client = getClient({
      includedHiddenTypes
    });
    const exporter = getExporter(client);
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsExport({
      request: req,
      types: cleaned.types,
      supportedTypes
    }).catch(() => {});

    try {
      const exportStream = isExportByTypeOptions(options) ? await exporter.exportByTypes(options) : await exporter.exportByObjects(options);
      const docsToExport = await (0, _utils.createPromiseFromStreams)([exportStream, (0, _utils.createMapStream)(obj => {
        return (0, _jsonStableStringify.default)(obj);
      }), (0, _utils.createConcatStream)([])]);
      return res.ok({
        body: docsToExport.join('\n'),
        headers: {
          'Content-Disposition': `attachment; filename="export.ndjson"`,
          'Content-Type': 'application/ndjson'
        }
      });
    } catch (e) {
      if (e instanceof _export.SavedObjectsExportError) {
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

exports.registerExportRoute = registerExportRoute;