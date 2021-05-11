"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCaseApi = initCaseApi;
exports.defaultPerPage = exports.defaultPage = void 0;

var _delete_cases = require("./cases/delete_cases");

var _find_cases = require("././cases/find_cases");

var _get_case = require("./cases/get_case");

var _patch_cases = require("./cases/patch_cases");

var _post_case = require("./cases/post_case");

var _push_case = require("./cases/push_case");

var _get_reporters = require("./cases/reporters/get_reporters");

var _get_status = require("./cases/status/get_status");

var _get_tags = require("./cases/tags/get_tags");

var _get_all_user_actions = require("./cases/user_actions/get_all_user_actions");

var _delete_comment = require("./cases/comments/delete_comment");

var _delete_all_comments = require("./cases/comments/delete_all_comments");

var _find_comments = require("./cases/comments/find_comments");

var _get_all_comment = require("./cases/comments/get_all_comment");

var _get_comment = require("./cases/comments/get_comment");

var _patch_comment = require("./cases/comments/patch_comment");

var _post_comment = require("./cases/comments/post_comment");

var _get_connectors = require("./cases/configure/get_connectors");

var _get_configure = require("./cases/configure/get_configure");

var _patch_configure = require("./cases/configure/patch_configure");

var _post_configure = require("./cases/configure/post_configure");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Default page number when interacting with the saved objects API.
 */


const defaultPage = 1;
/**
 * Default number of results when interacting with the saved objects API.
 */

exports.defaultPage = defaultPage;
const defaultPerPage = 20;
exports.defaultPerPage = defaultPerPage;

function initCaseApi(deps) {
  // Cases
  (0, _delete_cases.initDeleteCasesApi)(deps);
  (0, _find_cases.initFindCasesApi)(deps);
  (0, _get_case.initGetCaseApi)(deps);
  (0, _patch_cases.initPatchCasesApi)(deps);
  (0, _post_case.initPostCaseApi)(deps);
  (0, _push_case.initPushCaseApi)(deps);
  (0, _get_all_user_actions.initGetAllCaseUserActionsApi)(deps); // Comments

  (0, _delete_comment.initDeleteCommentApi)(deps);
  (0, _delete_all_comments.initDeleteAllCommentsApi)(deps);
  (0, _find_comments.initFindCaseCommentsApi)(deps);
  (0, _get_comment.initGetCommentApi)(deps);
  (0, _get_all_comment.initGetAllCommentsApi)(deps);
  (0, _patch_comment.initPatchCommentApi)(deps);
  (0, _post_comment.initPostCommentApi)(deps); // Cases Configure

  (0, _get_connectors.initCaseConfigureGetActionConnector)(deps);
  (0, _get_configure.initGetCaseConfigure)(deps);
  (0, _patch_configure.initPatchCaseConfigure)(deps);
  (0, _post_configure.initPostCaseConfigure)(deps); // Reporters

  (0, _get_reporters.initGetReportersApi)(deps); // Status

  (0, _get_status.initGetCasesStatusApi)(deps); // Tags

  (0, _get_tags.initGetTagsApi)(deps);
}