"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importTimelines = exports.setTimeline = exports.timelineSavedObjectOmittedFields = exports.isBulkError = exports.isImportRegular = void 0;

var _fp = require("lodash/fp");

var _uuid = _interopRequireDefault(require("uuid"));

var _utils = require("@kbn/utils");

var _timeline = require("../../../../../common/types/timeline");

var _validate = require("../../../../../common/validate");

var _utils2 = require("../../../detection_engine/routes/utils");

var _create_timelines = require("./create_timelines");

var _create_timelines_stream_from_ndjson = require("../../create_timelines_stream_from_ndjson");

var _get_timelines_from_stream = require("./get_timelines_from_stream");

var _compare_timelines_status = require("./compare_timelines_status");

var _common = require("./common");

var _failure_cases = require("./failure_cases");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isImportRegular = importTimelineResponse => {
  return !(0, _fp.has)('error', importTimelineResponse) && (0, _fp.has)('status_code', importTimelineResponse);
};

exports.isImportRegular = isImportRegular;

const isBulkError = importRuleResponse => {
  return (0, _fp.has)('error', importRuleResponse);
};
/**
 * This fields do not exists in savedObject mapping, but exist in Users' import,
 * exclude them here to avoid creating savedObject failure
 */


exports.isBulkError = isBulkError;
const timelineSavedObjectOmittedFields = ['globalNotes', 'eventNotes', 'pinnedEventIds', 'savedObjectId', 'created', 'createdBy', 'updated', 'updatedBy', 'version'];
exports.timelineSavedObjectOmittedFields = timelineSavedObjectOmittedFields;

const setTimeline = (parsedTimelineObject, parsedTimeline, isTemplateTimeline) => {
  var _parsedTimeline$statu, _parsedTimeline$templ, _parsedTimeline$templ2;

  return { ...parsedTimelineObject,
    status: parsedTimeline.status === _timeline.TimelineStatus.draft ? _timeline.TimelineStatus.active : (_parsedTimeline$statu = parsedTimeline.status) !== null && _parsedTimeline$statu !== void 0 ? _parsedTimeline$statu : _timeline.TimelineStatus.active,
    templateTimelineVersion: isTemplateTimeline ? (_parsedTimeline$templ = parsedTimeline.templateTimelineVersion) !== null && _parsedTimeline$templ !== void 0 ? _parsedTimeline$templ : 1 : null,
    templateTimelineId: isTemplateTimeline ? (_parsedTimeline$templ2 = parsedTimeline.templateTimelineId) !== null && _parsedTimeline$templ2 !== void 0 ? _parsedTimeline$templ2 : _uuid.default.v4() : null
  };
};

exports.setTimeline = setTimeline;
const CHUNK_PARSED_OBJECT_SIZE = 10;

const importTimelines = async (file, maxTimelineImportExportSize, frameworkRequest, isImmutable) => {
  var _timelinesInstalled$l, _timelinesUpdated$len;

  const readStream = (0, _create_timelines_stream_from_ndjson.createTimelinesStreamFromNdJson)(maxTimelineImportExportSize);
  const parsedObjects = await (0, _utils.createPromiseFromStreams)([file, ...readStream]);
  const [duplicateIdErrors, uniqueParsedObjects] = (0, _get_timelines_from_stream.getTupleDuplicateErrorsAndUniqueTimeline)(parsedObjects, false);
  const chunkParseObjects = (0, _fp.chunk)(CHUNK_PARSED_OBJECT_SIZE, uniqueParsedObjects);
  let importTimelineResponse = [];

  while (chunkParseObjects.length) {
    var _chunkParseObjects$sh;

    const batchParseObjects = (_chunkParseObjects$sh = chunkParseObjects.shift()) !== null && _chunkParseObjects$sh !== void 0 ? _chunkParseObjects$sh : [];
    const newImportTimelineResponse = await Promise.all(batchParseObjects.reduce((accum, parsedTimeline) => {
      const importsWorkerPromise = new Promise(async (resolve, reject) => {
        if (parsedTimeline instanceof Error) {
          // If the JSON object had a validation or parse error then we return
          // early with the error and an (unknown) for the ruleId
          resolve((0, _utils2.createBulkErrorObject)({
            statusCode: 400,
            message: parsedTimeline.message
          }));
          return null;
        }

        const {
          savedObjectId,
          pinnedEventIds,
          globalNotes,
          eventNotes,
          status,
          templateTimelineId,
          templateTimelineVersion,
          title,
          timelineType,
          version
        } = parsedTimeline;
        const parsedTimelineObject = (0, _fp.omit)(timelineSavedObjectOmittedFields, parsedTimeline);
        let newTimeline = null;

        try {
          const compareTimelinesStatus = new _compare_timelines_status.CompareTimelinesStatus({
            status,
            timelineType,
            title,
            timelineInput: {
              id: savedObjectId,
              version
            },
            templateTimelineInput: {
              id: templateTimelineId,
              version: templateTimelineVersion
            },
            frameworkRequest
          });
          await compareTimelinesStatus.init();
          const isTemplateTimeline = compareTimelinesStatus.isHandlingTemplateTimeline;

          if (compareTimelinesStatus.isCreatableViaImport) {
            // create timeline / timeline template
            newTimeline = await (0, _create_timelines.createTimelines)({
              frameworkRequest,
              timeline: setTimeline(parsedTimelineObject, parsedTimeline, isTemplateTimeline),
              pinnedEventIds: isTemplateTimeline ? null : pinnedEventIds,
              notes: isTemplateTimeline ? globalNotes : [...globalNotes, ...eventNotes],
              isImmutable,
              overrideNotesOwner: false
            });
            resolve({
              timeline_id: newTimeline.timeline.savedObjectId,
              status_code: 200,
              action: _common.TimelineStatusActions.createViaImport
            });
          }

          if (!compareTimelinesStatus.isHandlingTemplateTimeline) {
            var _errorMessage$body;

            const errorMessage = compareTimelinesStatus.checkIsFailureCases(_common.TimelineStatusActions.createViaImport);
            const message = (_errorMessage$body = errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.body) !== null && _errorMessage$body !== void 0 ? _errorMessage$body : _failure_cases.DEFAULT_ERROR;
            resolve((0, _utils2.createBulkErrorObject)({
              id: savedObjectId !== null && savedObjectId !== void 0 ? savedObjectId : 'unknown',
              statusCode: 409,
              message
            }));
          } else {
            if (compareTimelinesStatus.isUpdatableViaImport) {
              var _compareTimelinesStat; // update timeline template


              newTimeline = await (0, _create_timelines.createTimelines)({
                frameworkRequest,
                timeline: parsedTimelineObject,
                timelineSavedObjectId: compareTimelinesStatus.timelineId,
                timelineVersion: compareTimelinesStatus.timelineVersion,
                notes: globalNotes,
                existingNoteIds: (_compareTimelinesStat = compareTimelinesStatus.timelineInput.data) === null || _compareTimelinesStat === void 0 ? void 0 : _compareTimelinesStat.noteIds,
                isImmutable,
                overrideNotesOwner: false
              });
              resolve({
                timeline_id: newTimeline.timeline.savedObjectId,
                status_code: 200,
                action: _common.TimelineStatusActions.updateViaImport
              });
            } else {
              var _errorMessage$body2;

              const errorMessage = compareTimelinesStatus.checkIsFailureCases(_common.TimelineStatusActions.updateViaImport);
              const message = (_errorMessage$body2 = errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.body) !== null && _errorMessage$body2 !== void 0 ? _errorMessage$body2 : _failure_cases.DEFAULT_ERROR;
              resolve((0, _utils2.createBulkErrorObject)({
                id: savedObjectId !== null && savedObjectId !== void 0 ? savedObjectId : templateTimelineId ? `(template_timeline_id) ${templateTimelineId}` : 'unknown',
                statusCode: 409,
                message
              }));
            }
          }
        } catch (err) {
          resolve((0, _utils2.createBulkErrorObject)({
            id: savedObjectId !== null && savedObjectId !== void 0 ? savedObjectId : templateTimelineId ? `(template_timeline_id) ${templateTimelineId}` : 'unknown',
            statusCode: 400,
            message: err.message
          }));
        }
      });
      return [...accum, importsWorkerPromise];
    }, []));
    importTimelineResponse = [...duplicateIdErrors, ...importTimelineResponse, ...newImportTimelineResponse];
  }

  const errorsResp = importTimelineResponse.filter(resp => {
    return isBulkError(resp);
  });
  const successes = importTimelineResponse.filter(resp => {
    if (isImportRegular(resp)) {
      return resp.status_code === 200;
    } else {
      return false;
    }
  });
  const timelinesInstalled = importTimelineResponse.filter(resp => isImportRegular(resp) && resp.action === 'createViaImport');
  const timelinesUpdated = importTimelineResponse.filter(resp => isImportRegular(resp) && resp.action === 'updateViaImport');
  const importTimelinesRes = {
    success: errorsResp.length === 0,
    success_count: successes.length,
    errors: errorsResp,
    timelines_installed: (_timelinesInstalled$l = timelinesInstalled.length) !== null && _timelinesInstalled$l !== void 0 ? _timelinesInstalled$l : 0,
    timelines_updated: (_timelinesUpdated$len = timelinesUpdated.length) !== null && _timelinesUpdated$len !== void 0 ? _timelinesUpdated$len : 0
  };
  const [validated, errors] = (0, _validate.validate)(importTimelinesRes, _timeline.importTimelineResultSchema);

  if (errors != null || validated == null) {
    return new Error(errors || 'Import timeline error');
  } else {
    return validated;
  }
};

exports.importTimelines = importTimelines;