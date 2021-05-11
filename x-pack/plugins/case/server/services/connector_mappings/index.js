"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorMappingsService = void 0;

var _saved_object_types = require("../../saved_object_types");

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

class ConnectorMappingsService {
  constructor(log) {
    this.log = log;

    _defineProperty(this, "setup", async () => ({
      find: async ({
        client,
        options
      }) => {
        try {
          this.log.debug(`Attempting to find all connector mappings`);
          return await client.find({ ...options,
            type: _saved_object_types.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT
          });
        } catch (error) {
          this.log.error(`Attempting to find all connector mappings: ${error}`);
          throw error;
        }
      },
      post: async ({
        client,
        attributes,
        references
      }) => {
        try {
          this.log.debug(`Attempting to POST a new connector mappings`);
          return await client.create(_saved_object_types.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT, attributes, {
            references
          });
        } catch (error) {
          this.log.error(`Error on POST a new connector mappings: ${error}`);
          throw error;
        }
      }
    }));
  }

}

exports.ConnectorMappingsService = ConnectorMappingsService;