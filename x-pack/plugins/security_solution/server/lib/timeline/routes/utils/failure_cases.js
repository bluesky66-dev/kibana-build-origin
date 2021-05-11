"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIsCreateViaImportFailureCases = exports.checkIsCreateFailureCases = exports.checkIsUpdateFailureCases = exports.checkIsUpdateViaImportFailureCases = exports.commonFailureChecker = exports.getImportExistingTimelineError = exports.DEFAULT_ERROR = exports.UPDAT_TIMELINE_VIA_IMPORT_NOT_ALLOWED_ERROR_MESSAGE = exports.NOT_ALLOW_UPDATE_TIMELINE_TYPE_ERROR_MESSAGE = exports.NOT_ALLOW_UPDATE_STATUS_ERROR_MESSAGE = exports.CREATE_WITH_INVALID_STATUS_ERROR_MESSAGE = exports.CREATE_TEMPLATE_TIMELINE_WITHOUT_VERSION_ERROR_MESSAGE = exports.UPDATE_STATUS_ERROR_MESSAGE = exports.EMPTY_TITLE_ERROR_MESSAGE = exports.CREATE_TEMPLATE_TIMELINE_ERROR_MESSAGE = exports.CREATE_TIMELINE_ERROR_MESSAGE = exports.TEMPLATE_TIMELINE_VERSION_CONFLICT_MESSAGE = exports.NO_MATCH_ID_ERROR_MESSAGE = exports.NO_MATCH_VERSION_ERROR_MESSAGE = exports.UPDATE_TEMPLATE_TIMELINE_ERROR_MESSAGE = exports.UPDATE_TIMELINE_ERROR_MESSAGE = void 0;

var _fp = require("lodash/fp");

var _timeline = require("../../../../../common/types/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const UPDATE_TIMELINE_ERROR_MESSAGE = 'You cannot create new timelines with PATCH. Use POST instead.';
exports.UPDATE_TIMELINE_ERROR_MESSAGE = UPDATE_TIMELINE_ERROR_MESSAGE;
const UPDATE_TEMPLATE_TIMELINE_ERROR_MESSAGE = 'You cannot create new Timeline templates with PATCH. Use POST instead (templateTimelineId does not exist).';
exports.UPDATE_TEMPLATE_TIMELINE_ERROR_MESSAGE = UPDATE_TEMPLATE_TIMELINE_ERROR_MESSAGE;
const NO_MATCH_VERSION_ERROR_MESSAGE = 'Timeline template version conflict. The provided templateTimelineVersion does not match the current template.';
exports.NO_MATCH_VERSION_ERROR_MESSAGE = NO_MATCH_VERSION_ERROR_MESSAGE;
const NO_MATCH_ID_ERROR_MESSAGE = 'There are no Timeline templates that match the provided templateTimelineId.';
exports.NO_MATCH_ID_ERROR_MESSAGE = NO_MATCH_ID_ERROR_MESSAGE;
const TEMPLATE_TIMELINE_VERSION_CONFLICT_MESSAGE = 'To update existing Timeline templates, you must increment the templateTimelineVersion value.';
exports.TEMPLATE_TIMELINE_VERSION_CONFLICT_MESSAGE = TEMPLATE_TIMELINE_VERSION_CONFLICT_MESSAGE;
const CREATE_TIMELINE_ERROR_MESSAGE = 'You cannot update timelines with POST. Use PATCH instead.';
exports.CREATE_TIMELINE_ERROR_MESSAGE = CREATE_TIMELINE_ERROR_MESSAGE;
const CREATE_TEMPLATE_TIMELINE_ERROR_MESSAGE = 'You cannot update Timeline templates with POST. Use PATCH instead.';
exports.CREATE_TEMPLATE_TIMELINE_ERROR_MESSAGE = CREATE_TEMPLATE_TIMELINE_ERROR_MESSAGE;
const EMPTY_TITLE_ERROR_MESSAGE = 'The title field cannot be empty.';
exports.EMPTY_TITLE_ERROR_MESSAGE = EMPTY_TITLE_ERROR_MESSAGE;
const UPDATE_STATUS_ERROR_MESSAGE = 'You are not allowed to set the status field value to immutable.';
exports.UPDATE_STATUS_ERROR_MESSAGE = UPDATE_STATUS_ERROR_MESSAGE;
const CREATE_TEMPLATE_TIMELINE_WITHOUT_VERSION_ERROR_MESSAGE = 'You must provide a valid templateTimelineVersion value. Use 1 for new Timeline templates.';
exports.CREATE_TEMPLATE_TIMELINE_WITHOUT_VERSION_ERROR_MESSAGE = CREATE_TEMPLATE_TIMELINE_WITHOUT_VERSION_ERROR_MESSAGE;
const CREATE_WITH_INVALID_STATUS_ERROR_MESSAGE = 'You are not allowed to set the status field value to draft.';
exports.CREATE_WITH_INVALID_STATUS_ERROR_MESSAGE = CREATE_WITH_INVALID_STATUS_ERROR_MESSAGE;
const NOT_ALLOW_UPDATE_STATUS_ERROR_MESSAGE = 'You are not allowed to set the status field.';
exports.NOT_ALLOW_UPDATE_STATUS_ERROR_MESSAGE = NOT_ALLOW_UPDATE_STATUS_ERROR_MESSAGE;
const NOT_ALLOW_UPDATE_TIMELINE_TYPE_ERROR_MESSAGE = 'You cannot convert a Timeline template to a timeline, or a timeline to a Timeline template.';
exports.NOT_ALLOW_UPDATE_TIMELINE_TYPE_ERROR_MESSAGE = NOT_ALLOW_UPDATE_TIMELINE_TYPE_ERROR_MESSAGE;
const UPDAT_TIMELINE_VIA_IMPORT_NOT_ALLOWED_ERROR_MESSAGE = 'You cannot update a timeline via imports. Use the UI to modify existing timelines.';
exports.UPDAT_TIMELINE_VIA_IMPORT_NOT_ALLOWED_ERROR_MESSAGE = UPDAT_TIMELINE_VIA_IMPORT_NOT_ALLOWED_ERROR_MESSAGE;
const DEFAULT_ERROR = `Something has gone wrong. We didn't handle something properly. To help us fix this, please upload your file to https://discuss.elastic.co/c/security/siem.`;
exports.DEFAULT_ERROR = DEFAULT_ERROR;

const isUpdatingStatus = (isHandlingTemplateTimeline, status, existTimeline, existTemplateTimeline) => {
  const obj = isHandlingTemplateTimeline ? existTemplateTimeline : existTimeline;
  return (obj === null || obj === void 0 ? void 0 : obj.status) === _timeline.TimelineStatus.immutable ? UPDATE_STATUS_ERROR_MESSAGE : null;
};

const isGivenTitleValid = (status, title) => {
  return status !== _timeline.TimelineStatus.draft && !(0, _fp.isEmpty)(title) || status === _timeline.TimelineStatus.draft ? null : EMPTY_TITLE_ERROR_MESSAGE;
};

const getImportExistingTimelineError = id => `savedObjectId: "${id}" already exists`;

exports.getImportExistingTimelineError = getImportExistingTimelineError;

const commonFailureChecker = (status, title) => {
  const error = [isGivenTitleValid(status, title)].filter(msg => msg != null).join(',');
  return !(0, _fp.isEmpty)(error) ? {
    body: error,
    statusCode: 405
  } : null;
};

exports.commonFailureChecker = commonFailureChecker;

const commonUpdateTemplateTimelineCheck = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  if (isHandlingTemplateTimeline) {
    if (existTimeline != null && timelineType !== existTimeline.timelineType || existTemplateTimeline != null && timelineType !== existTemplateTimeline.timelineType) {
      return {
        body: NOT_ALLOW_UPDATE_TIMELINE_TYPE_ERROR_MESSAGE,
        statusCode: 403
      };
    }

    if (existTemplateTimeline == null && templateTimelineVersion != null) {
      // timeline template !exists
      // Throw error to create timeline template in patch
      return {
        body: UPDATE_TEMPLATE_TIMELINE_ERROR_MESSAGE,
        statusCode: 405
      };
    }

    if (existTimeline != null && existTemplateTimeline != null && existTimeline.savedObjectId !== existTemplateTimeline.savedObjectId) {
      // Throw error you can not have a no matching between your timeline and your timeline template during an update
      return {
        body: NO_MATCH_ID_ERROR_MESSAGE,
        statusCode: 409
      };
    }

    if (existTemplateTimeline != null && existTemplateTimeline.version !== version) {
      // throw error 409 conflict timeline
      return {
        body: NO_MATCH_VERSION_ERROR_MESSAGE,
        statusCode: 409
      };
    }
  }

  return null;
};

const commonUpdateTimelineCheck = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  if (existTimeline == null) {
    // timeline !exists
    return {
      body: UPDATE_TIMELINE_ERROR_MESSAGE,
      statusCode: 405
    };
  }

  if ((existTimeline === null || existTimeline === void 0 ? void 0 : existTimeline.version) !== version) {
    // throw error 409 conflict timeline
    return {
      body: NO_MATCH_VERSION_ERROR_MESSAGE,
      statusCode: 409
    };
  }

  return null;
};

const commonUpdateCases = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  if (isHandlingTemplateTimeline) {
    return commonUpdateTemplateTimelineCheck(isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline);
  } else {
    return commonUpdateTimelineCheck(isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline);
  }
};

const createTemplateTimelineCheck = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  if (isHandlingTemplateTimeline && existTemplateTimeline != null) {
    // Throw error to create timeline template in patch
    return {
      body: CREATE_TEMPLATE_TIMELINE_ERROR_MESSAGE,
      statusCode: 405
    };
  } else if (isHandlingTemplateTimeline && templateTimelineVersion == null) {
    return {
      body: CREATE_TEMPLATE_TIMELINE_WITHOUT_VERSION_ERROR_MESSAGE,
      statusCode: 403
    };
  } else {
    return null;
  }
};

const checkIsUpdateViaImportFailureCases = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  if (!isHandlingTemplateTimeline) {
    if (existTimeline == null) {
      return {
        body: UPDAT_TIMELINE_VIA_IMPORT_NOT_ALLOWED_ERROR_MESSAGE,
        statusCode: 405
      };
    } else {
      return {
        body: getImportExistingTimelineError(existTimeline.savedObjectId),
        statusCode: 405
      };
    }
  } else {
    const isStatusValid = ((existTemplateTimeline === null || existTemplateTimeline === void 0 ? void 0 : existTemplateTimeline.status) == null || (existTemplateTimeline === null || existTemplateTimeline === void 0 ? void 0 : existTemplateTimeline.status) === _timeline.TimelineStatus.active) && (status == null || status === _timeline.TimelineStatus.active) || (existTemplateTimeline === null || existTemplateTimeline === void 0 ? void 0 : existTemplateTimeline.status) != null && status === (existTemplateTimeline === null || existTemplateTimeline === void 0 ? void 0 : existTemplateTimeline.status);

    if (!isStatusValid) {
      return {
        body: NOT_ALLOW_UPDATE_STATUS_ERROR_MESSAGE,
        statusCode: 405
      };
    }

    const error = commonUpdateTemplateTimelineCheck(isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline);

    if (error) {
      return error;
    }

    if (templateTimelineVersion != null && existTemplateTimeline != null && existTemplateTimeline.templateTimelineVersion != null && existTemplateTimeline.templateTimelineVersion >= templateTimelineVersion) {
      // Throw error you can not update a timeline template version with an old version
      return {
        body: TEMPLATE_TIMELINE_VERSION_CONFLICT_MESSAGE,
        statusCode: 409
      };
    }
  }

  return null;
};

exports.checkIsUpdateViaImportFailureCases = checkIsUpdateViaImportFailureCases;

const checkIsUpdateFailureCases = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  const error = isUpdatingStatus(isHandlingTemplateTimeline, status, existTimeline, existTemplateTimeline);

  if (error) {
    return {
      body: error,
      statusCode: 403
    };
  }

  return commonUpdateCases(isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline);
};

exports.checkIsUpdateFailureCases = checkIsUpdateFailureCases;

const checkIsCreateFailureCases = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  if (!isHandlingTemplateTimeline && existTimeline != null) {
    return {
      body: CREATE_TIMELINE_ERROR_MESSAGE,
      statusCode: 405
    };
  } else if (isHandlingTemplateTimeline) {
    return createTemplateTimelineCheck(isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline);
  } else {
    return null;
  }
};

exports.checkIsCreateFailureCases = checkIsCreateFailureCases;

const checkIsCreateViaImportFailureCases = (isHandlingTemplateTimeline, status, timelineType, version, templateTimelineVersion, templateTimelineId, existTimeline, existTemplateTimeline) => {
  if (status === _timeline.TimelineStatus.draft) {
    return {
      body: CREATE_WITH_INVALID_STATUS_ERROR_MESSAGE,
      statusCode: 405
    };
  }

  if (!isHandlingTemplateTimeline) {
    if (existTimeline != null) {
      return {
        body: getImportExistingTimelineError(existTimeline.savedObjectId),
        statusCode: 405
      };
    }
  } else {
    if (existTemplateTimeline != null) {
      // Throw error to create timeline template in patch
      return {
        body: getImportExistingTimelineError(existTemplateTimeline.savedObjectId),
        statusCode: 405
      };
    }
  }

  return null;
};

exports.checkIsCreateViaImportFailureCases = checkIsCreateViaImportFailureCases;