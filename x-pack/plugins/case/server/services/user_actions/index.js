"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseUserActionService = void 0;

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

class CaseUserActionService {
  constructor(log) {
    this.log = log;

    _defineProperty(this, "setup", async () => ({
      getUserActions: async ({
        client,
        caseId,
        subCaseId
      }) => {
        try {
          const id = subCaseId !== null && subCaseId !== void 0 ? subCaseId : caseId;
          const type = subCaseId ? _saved_object_types.SUB_CASE_SAVED_OBJECT : _saved_object_types.CASE_SAVED_OBJECT;
          const caseUserActionInfo = await client.find({
            type: _saved_object_types.CASE_USER_ACTION_SAVED_OBJECT,
            fields: [],
            hasReference: {
              type,
              id
            },
            page: 1,
            perPage: 1
          });
          return await client.find({
            type: _saved_object_types.CASE_USER_ACTION_SAVED_OBJECT,
            hasReference: {
              type,
              id
            },
            page: 1,
            perPage: caseUserActionInfo.total,
            sortField: 'action_at',
            sortOrder: 'asc'
          });
        } catch (error) {
          this.log.error(`Error on GET case user action case id: ${caseId}: ${error}`);
          throw error;
        }
      },
      postUserActions: async ({
        client,
        actions
      }) => {
        try {
          this.log.debug(`Attempting to POST a new case user action`);
          return await client.bulkCreate(actions.map(action => ({
            type: _saved_object_types.CASE_USER_ACTION_SAVED_OBJECT,
            ...action
          })));
        } catch (error) {
          this.log.error(`Error on POST a new case user action: ${error}`);
          throw error;
        }
      }
    }));
  }

}

exports.CaseUserActionService = CaseUserActionService;