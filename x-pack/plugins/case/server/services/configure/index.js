"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseConfigureService = void 0;

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

class CaseConfigureService {
  constructor(log) {
    this.log = log;

    _defineProperty(this, "setup", async () => ({
      delete: async ({
        client,
        caseConfigureId
      }) => {
        try {
          this.log.debug(`Attempting to DELETE case configure ${caseConfigureId}`);
          return await client.delete(_saved_object_types.CASE_CONFIGURE_SAVED_OBJECT, caseConfigureId);
        } catch (error) {
          this.log.debug(`Error on DELETE case configure ${caseConfigureId}: ${error}`);
          throw error;
        }
      },
      get: async ({
        client,
        caseConfigureId
      }) => {
        try {
          this.log.debug(`Attempting to GET case configuration ${caseConfigureId}`);
          return await client.get(_saved_object_types.CASE_CONFIGURE_SAVED_OBJECT, caseConfigureId);
        } catch (error) {
          this.log.debug(`Error on GET case configuration ${caseConfigureId}: ${error}`);
          throw error;
        }
      },
      find: async ({
        client,
        options
      }) => {
        try {
          this.log.debug(`Attempting to find all case configuration`);
          return await client.find({ ...options,
            type: _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT
          });
        } catch (error) {
          this.log.debug(`Attempting to find all case configuration`);
          throw error;
        }
      },
      post: async ({
        client,
        attributes
      }) => {
        try {
          this.log.debug(`Attempting to POST a new case configuration`);
          return await client.create(_saved_object_types.CASE_CONFIGURE_SAVED_OBJECT, { ...attributes
          });
        } catch (error) {
          this.log.debug(`Error on POST a new case configuration: ${error}`);
          throw error;
        }
      },
      patch: async ({
        client,
        caseConfigureId,
        updatedAttributes
      }) => {
        try {
          this.log.debug(`Attempting to UPDATE case configuration ${caseConfigureId}`);
          return await client.update(_saved_object_types.CASE_CONFIGURE_SAVED_OBJECT, caseConfigureId, { ...updatedAttributes
          });
        } catch (error) {
          this.log.debug(`Error on UPDATE case configuration ${caseConfigureId}: ${error}`);
          throw error;
        }
      }
    }));
  }

}

exports.CaseConfigureService = CaseConfigureService;