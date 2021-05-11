"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorStrings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ErrorStrings = {
  actionsElements: {
    getInvalidArgIndexErrorMessage: index => _i18n.i18n.translate('xpack.canvas.error.actionsElements.invaludArgIndexErrorMessage', {
      defaultMessage: 'Invalid argument index: {index}',
      values: {
        index
      }
    })
  },
  downloadWorkpad: {
    getDownloadFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.downloadWorkpad.downloadFailureErrorMessage', {
      defaultMessage: "Couldn't download workpad"
    }),
    getDownloadRenderedWorkpadFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.downloadWorkpad.downloadRenderedWorkpadFailureErrorMessage', {
      defaultMessage: "Couldn't download rendered workpad"
    }),
    getDownloadRuntimeFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.downloadWorkpad.downloadRuntimeFailureErrorMessage', {
      defaultMessage: "Couldn't download Shareable Runtime"
    }),
    getDownloadZippedRuntimeFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.downloadWorkpad.downloadZippedRuntimeFailureErrorMessage', {
      defaultMessage: "Couldn't download ZIP file"
    })
  },
  esPersist: {
    getSaveFailureTitle: () => _i18n.i18n.translate('xpack.canvas.error.esPersist.saveFailureTitle', {
      defaultMessage: "Couldn't save your changes to Elasticsearch"
    }),
    getTooLargeErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.esPersist.tooLargeErrorMessage', {
      defaultMessage: 'The server gave a response that the workpad data was too large. This usually means uploaded image assets that are too large for Kibana or a proxy. Try removing some assets in the asset manager.'
    }),
    getUpdateFailureTitle: () => _i18n.i18n.translate('xpack.canvas.error.esPersist.updateFailureTitle', {
      defaultMessage: "Couldn't update workpad"
    })
  },
  esService: {
    getDefaultIndexFetchErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.esService.defaultIndexFetchErrorMessage', {
      defaultMessage: "Couldn't fetch default index"
    }),
    getFieldsFetchErrorMessage: index => _i18n.i18n.translate('xpack.canvas.error.esService.fieldsFetchErrorMessage', {
      defaultMessage: "Couldn't fetch Elasticsearch fields for '{index}'",
      values: {
        index
      }
    }),
    getIndicesFetchErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.esService.indicesFetchErrorMessage', {
      defaultMessage: "Couldn't fetch Elasticsearch indices"
    })
  },
  RenderWithFn: {
    getRenderErrorMessage: functionName => _i18n.i18n.translate('xpack.canvas.error.RenderWithFn.renderErrorMessage', {
      defaultMessage: "Rendering '{functionName}' failed",
      values: {
        functionName: functionName || 'function'
      }
    })
  },
  RepeatImage: {
    getMissingMaxArgumentErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.repeatImage.missingMaxArgument', {
      defaultMessage: '{maxArgument} must be set if providing an {emptyImageArgument}',
      values: {
        maxArgument: '`max`',
        emptyImageArgument: '`emptyImage`'
      }
    })
  },
  WorkpadFileUpload: {
    getAcceptJSONOnlyErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadUpload.acceptJSONOnlyErrorMessage', {
      defaultMessage: 'Only {JSON} files are accepted',
      values: {
        JSON: _constants.JSON
      }
    }),
    getFileUploadFailureWithFileNameErrorMessage: fileName => _i18n.i18n.translate('xpack.canvas.errors.workpadUpload.fileUploadFileWithFileNameErrorMessage', {
      defaultMessage: `Couldn't upload '{fileName}'`,
      values: {
        fileName
      }
    }),
    getFileUploadFailureWithoutFileNameErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadUpload.fileUploadFailureWithoutFileNameErrorMessage', {
      defaultMessage: `Couldn't upload file`
    }),
    getMissingPropertiesErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadUpload.missingPropertiesErrorMessage', {
      defaultMessage: 'Some properties required for a {CANVAS} workpad are missing.  Edit your {JSON} file to provide the correct property values, and try again.',
      values: {
        CANVAS: _constants.CANVAS,
        JSON: _constants.JSON
      }
    })
  },
  WorkpadLoader: {
    getCloneFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadLoader.cloneFailureErrorMessage', {
      defaultMessage: `Couldn't clone workpad`
    }),
    getDeleteFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadLoader.deleteFailureErrorMessage', {
      defaultMessage: `Couldn't delete all workpads`
    }),
    getFindFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadLoader.findFailureErrorMessage', {
      defaultMessage: `Couldn't find workpad`
    }),
    getUploadFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadLoader.uploadFailureErrorMessage', {
      defaultMessage: `Couldn't upload workpad`
    })
  },
  workpadRoutes: {
    getCreateFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadRoutes.createFailureErrorMessage', {
      defaultMessage: "Couldn't create workpad"
    }),
    getLoadFailureErrorMessage: () => _i18n.i18n.translate('xpack.canvas.error.workpadRoutes.loadFailureErrorMessage', {
      defaultMessage: "Couldn't load workpad with ID"
    })
  }
};
exports.ErrorStrings = ErrorStrings;