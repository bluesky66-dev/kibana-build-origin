"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventLogClient = exports.findOptionsSchema = void 0;

var _configSchema = require("@kbn/config-schema");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const optionalDateFieldSchema = _configSchema.schema.maybe(_configSchema.schema.string({
  validate(value) {
    if (isNaN(Date.parse(value))) {
      return 'Invalid Date';
    }
  }

}));

const findOptionsSchema = _configSchema.schema.object({
  per_page: _configSchema.schema.number({
    defaultValue: 10,
    min: 0
  }),
  page: _configSchema.schema.number({
    defaultValue: 1,
    min: 1
  }),
  start: optionalDateFieldSchema,
  end: optionalDateFieldSchema,
  sort_field: _configSchema.schema.oneOf([_configSchema.schema.literal('@timestamp'), _configSchema.schema.literal('event.start'), _configSchema.schema.literal('event.end'), _configSchema.schema.literal('event.provider'), _configSchema.schema.literal('event.duration'), _configSchema.schema.literal('event.action'), _configSchema.schema.literal('message')], {
    defaultValue: '@timestamp'
  }),
  sort_order: _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')], {
    defaultValue: 'asc'
  }),
  filter: _configSchema.schema.maybe(_configSchema.schema.string())
}); // page & perPage are required, other fields are optional
// using schema.maybe allows us to set undefined, but not to make the field optional


exports.findOptionsSchema = findOptionsSchema; // note that clusterClient may be null, indicating we can't write to ES

class EventLogClient {
  constructor({
    esContext,
    savedObjectGetter,
    spacesService,
    request
  }) {
    _defineProperty(this, "esContext", void 0);

    _defineProperty(this, "savedObjectGetter", void 0);

    _defineProperty(this, "spacesService", void 0);

    _defineProperty(this, "request", void 0);

    this.esContext = esContext;
    this.savedObjectGetter = savedObjectGetter;
    this.spacesService = spacesService;
    this.request = request;
  }

  async findEventsBySavedObjectIds(type, ids, options) {
    var _this$spacesService, _this$spacesService2;

    const findOptions = findOptionsSchema.validate(options !== null && options !== void 0 ? options : {});
    const space = await ((_this$spacesService = this.spacesService) === null || _this$spacesService === void 0 ? void 0 : _this$spacesService.getActiveSpace(this.request));
    const namespace = space && ((_this$spacesService2 = this.spacesService) === null || _this$spacesService2 === void 0 ? void 0 : _this$spacesService2.spaceIdToNamespace(space.id)); // verify the user has the required permissions to view this saved objects

    await this.savedObjectGetter(type, ids);
    return await this.esContext.esAdapter.queryEventsBySavedObjects(this.esContext.esNames.indexPattern, namespace, type, ids, findOptions);
  }

}

exports.EventLogClient = EventLogClient;