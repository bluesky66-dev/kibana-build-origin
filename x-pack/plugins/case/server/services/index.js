"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CaseConfigureService", {
  enumerable: true,
  get: function () {
    return _configure.CaseConfigureService;
  }
});
Object.defineProperty(exports, "CaseConfigureServiceSetup", {
  enumerable: true,
  get: function () {
    return _configure.CaseConfigureServiceSetup;
  }
});
Object.defineProperty(exports, "CaseUserActionService", {
  enumerable: true,
  get: function () {
    return _user_actions.CaseUserActionService;
  }
});
Object.defineProperty(exports, "CaseUserActionServiceSetup", {
  enumerable: true,
  get: function () {
    return _user_actions.CaseUserActionServiceSetup;
  }
});
Object.defineProperty(exports, "ConnectorMappingsService", {
  enumerable: true,
  get: function () {
    return _connector_mappings.ConnectorMappingsService;
  }
});
Object.defineProperty(exports, "ConnectorMappingsServiceSetup", {
  enumerable: true,
  get: function () {
    return _connector_mappings.ConnectorMappingsServiceSetup;
  }
});
Object.defineProperty(exports, "AlertService", {
  enumerable: true,
  get: function () {
    return _alerts.AlertService;
  }
});
Object.defineProperty(exports, "AlertServiceContract", {
  enumerable: true,
  get: function () {
    return _alerts.AlertServiceContract;
  }
});
exports.CaseService = void 0;

var _api = require("../../common/api");

var _common = require("../common");

var _api2 = require("../routes/api");

var _utils = require("../routes/api/utils");

var _saved_object_types = require("../saved_object_types");

var _read_reporters = require("./reporters/read_reporters");

var _read_tags = require("./tags/read_tags");

var _configure = require("./configure");

var _user_actions = require("./user_actions");

var _connector_mappings = require("./connector_mappings");

var _alerts = require("./alerts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CaseService {
  constructor(log, authentication) {
    this.log = log;
    this.authentication = authentication;
  }
  /**
   * Returns a map of all cases combined with their sub cases if they are collections.
   */


  async findCasesGroupedByID({
    client,
    caseOptions,
    subCaseOptions
  }) {
    const cases = await this.findCases({
      client,
      options: caseOptions
    });
    const subCasesResp = await this.findSubCasesGroupByCase({
      client,
      options: subCaseOptions,
      ids: cases.saved_objects.filter(caseInfo => caseInfo.attributes.type === _api.CaseType.collection).map(caseInfo => caseInfo.id)
    });
    const casesMap = cases.saved_objects.reduce((accMap, caseInfo) => {
      const subCasesForCase = subCasesResp.subCasesMap.get(caseInfo.id);
      /**
       * If this case is an individual add it to the return map
       * If it is a collection and it has sub cases add it to the return map
       * If it is a collection and it does not have sub cases, check and see if we're filtering on a status,
       *  if we're filtering on a status then exclude the empty collection from the results
       *  if we're not filtering on a status then include the empty collection (that way we can display all the collections
       *  when the UI isn't doing any filtering)
       */

      if (caseInfo.attributes.type === _api.CaseType.individual || subCasesForCase !== undefined || !caseOptions.status) {
        accMap.set(caseInfo.id, {
          case: caseInfo,
          subCases: subCasesForCase
        });
      }

      return accMap;
    }, new Map());
    /**
     * One potential optimization here is to get all comment stats for individual cases, parent cases, and sub cases
     * in a single request. This can be done because comments that are for sub cases have a reference to both the sub case
     * and the parent. The associationType field allows us to determine which type of case the comment is attached to.
     *
     * So we could use the ids for all the valid cases (individual cases and parents with sub cases) to grab everything.
     * Once we have it we can build the maps.
     *
     * Currently we get all comment stats for all sub cases in one go and we get all comment stats for cases (individual and parent)
     * in another request (the one below this comment).
     */

    const totalCommentsForCases = await this.getCaseCommentStats({
      client,
      ids: Array.from(casesMap.keys()),
      associationType: _api.AssociationType.case
    });
    const casesWithComments = new Map();

    for (const [id, caseInfo] of casesMap.entries()) {
      var _totalCommentsForCase, _totalCommentsForCase2;

      casesWithComments.set(id, (0, _utils.flattenCaseSavedObject)({
        savedObject: caseInfo.case,
        totalComment: (_totalCommentsForCase = totalCommentsForCases.commentTotals.get(id)) !== null && _totalCommentsForCase !== void 0 ? _totalCommentsForCase : 0,
        totalAlerts: (_totalCommentsForCase2 = totalCommentsForCases.alertTotals.get(id)) !== null && _totalCommentsForCase2 !== void 0 ? _totalCommentsForCase2 : 0,
        subCases: caseInfo.subCases
      }));
    }

    return {
      casesMap: casesWithComments,
      page: cases.page,
      perPage: cases.per_page,
      total: cases.total
    };
  }
  /**
   * Retrieves the number of cases that exist with a given status (open, closed, etc).
   * This also counts sub cases. Parent cases are excluded from the statistics.
   */


  async findCaseStatusStats({
    client,
    caseOptions,
    subCaseOptions
  }) {
    const casesStats = await this.findCases({
      client,
      options: { ...caseOptions,
        fields: [],
        page: 1,
        perPage: 1
      }
    });
    /**
     * This could be made more performant. What we're doing here is retrieving all cases
     * that match the API request's filters instead of just counts. This is because we need to grab
     * the ids for the parent cases that match those filters. Then we use those IDS to count how many
     * sub cases those parents have to calculate the total amount of cases that are open, closed, or in-progress.
     *
     * Another solution would be to store ALL filterable fields on both a case and sub case. That we could do a single
     * query for each type to calculate the totals using the filters. This has drawbacks though:
     *
     * We'd have to sync up the parent case's editable attributes with the sub case any time they were change to avoid
     * them getting out of sync and causing issues when we do these types of stats aggregations. This would result in a lot
     * of update requests if the user is editing their case details often. Which could potentially cause conflict failures.
     *
     * Another option is to prevent the ability from update the parent case's details all together once it's created. A user
     * could instead modify the sub case details directly. This could be weird though because individual sub cases for the same
     * parent would have different titles, tags, etc.
     *
     * Another potential issue with this approach is when you push a case and all its sub case information. If the sub cases
     * don't have the same title and tags, we'd need to account for that as well.
     */

    const cases = await this.findCases({
      client,
      options: { ...caseOptions,
        fields: [_api.caseTypeField],
        page: 1,
        perPage: casesStats.total
      }
    });
    const caseIds = cases.saved_objects.filter(caseInfo => caseInfo.attributes.type === _api.CaseType.collection).map(caseInfo => caseInfo.id);
    let subCasesTotal = 0;

    if (subCaseOptions) {
      subCasesTotal = await this.findSubCaseStatusStats({
        client,
        options: subCaseOptions,
        ids: caseIds
      });
    }

    const total = cases.saved_objects.filter(caseInfo => caseInfo.attributes.type !== _api.CaseType.collection).length + subCasesTotal;
    return total;
  }
  /**
   * Retrieves the comments attached to a case or sub case.
   */


  async getCommentsByAssociation({
    client,
    id,
    associationType,
    options
  }) {
    if (associationType === _api.AssociationType.subCase) {
      return this.getAllSubCaseComments({
        client,
        id,
        options
      });
    } else {
      return this.getAllCaseComments({
        client,
        id,
        options
      });
    }
  }
  /**
   * Returns the number of total comments and alerts for a case (or sub case)
   */


  async getCaseCommentStats({
    client,
    ids,
    associationType
  }) {
    if (ids.length <= 0) {
      return {
        commentTotals: new Map(),
        alertTotals: new Map()
      };
    }

    const refType = associationType === _api.AssociationType.case ? _saved_object_types.CASE_SAVED_OBJECT : _saved_object_types.SUB_CASE_SAVED_OBJECT;
    const allComments = await Promise.all(ids.map(id => this.getCommentsByAssociation({
      client,
      associationType,
      id,
      options: {
        page: 1,
        perPage: 1
      }
    })));
    const alerts = await this.getCommentsByAssociation({
      client,
      associationType,
      id: ids,
      options: {
        filter: `(${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.type: ${_api.CommentType.alert} OR ${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.type: ${_api.CommentType.generatedAlert})`
      }
    });

    const getID = comments => {
      var _comments$saved_objec;

      return comments.saved_objects.length > 0 ? (_comments$saved_objec = comments.saved_objects[0].references.find(ref => ref.type === refType)) === null || _comments$saved_objec === void 0 ? void 0 : _comments$saved_objec.id : undefined;
    };

    const groupedComments = allComments.reduce((acc, comments) => {
      const id = getID(comments);

      if (id) {
        acc.set(id, comments.total);
      }

      return acc;
    }, new Map());
    const groupedAlerts = (0, _common.groupTotalAlertsByID)({
      comments: alerts
    });
    return {
      commentTotals: groupedComments,
      alertTotals: groupedAlerts
    };
  }
  /**
   * Returns all the sub cases for a set of case IDs. Comment statistics are also returned.
   */


  async findSubCasesGroupByCase({
    client,
    options,
    ids
  }) {
    const getCaseID = subCase => {
      return subCase.references.length > 0 ? subCase.references[0].id : undefined;
    };

    const emptyResponse = {
      subCasesMap: new Map(),
      page: 0,
      perPage: 0
    };

    if (!options) {
      return emptyResponse;
    }

    if (ids.length <= 0) {
      return emptyResponse;
    }

    const subCases = await this.findSubCases({
      client,
      options: { ...options,
        hasReference: ids.map(id => {
          return {
            id,
            type: _saved_object_types.CASE_SAVED_OBJECT
          };
        })
      }
    });
    const subCaseComments = await this.getCaseCommentStats({
      client,
      ids: subCases.saved_objects.map(subCase => subCase.id),
      associationType: _api.AssociationType.subCase
    });
    const subCasesMap = subCases.saved_objects.reduce((accMap, subCase) => {
      const parentCaseID = getCaseID(subCase);

      if (parentCaseID) {
        const subCaseFromMap = accMap.get(parentCaseID);

        if (subCaseFromMap === undefined) {
          var _subCaseComments$comm, _subCaseComments$aler;

          const subCasesForID = [(0, _utils.flattenSubCaseSavedObject)({
            savedObject: subCase,
            totalComment: (_subCaseComments$comm = subCaseComments.commentTotals.get(subCase.id)) !== null && _subCaseComments$comm !== void 0 ? _subCaseComments$comm : 0,
            totalAlerts: (_subCaseComments$aler = subCaseComments.alertTotals.get(subCase.id)) !== null && _subCaseComments$aler !== void 0 ? _subCaseComments$aler : 0
          })];
          accMap.set(parentCaseID, subCasesForID);
        } else {
          var _subCaseComments$comm2, _subCaseComments$aler2;

          subCaseFromMap.push((0, _utils.flattenSubCaseSavedObject)({
            savedObject: subCase,
            totalComment: (_subCaseComments$comm2 = subCaseComments.commentTotals.get(subCase.id)) !== null && _subCaseComments$comm2 !== void 0 ? _subCaseComments$comm2 : 0,
            totalAlerts: (_subCaseComments$aler2 = subCaseComments.alertTotals.get(subCase.id)) !== null && _subCaseComments$aler2 !== void 0 ? _subCaseComments$aler2 : 0
          }));
        }
      }

      return accMap;
    }, new Map());
    return {
      subCasesMap,
      page: subCases.page,
      perPage: subCases.per_page
    };
  }
  /**
   * Calculates the number of sub cases for a given set of options for a set of case IDs.
   */


  async findSubCaseStatusStats({
    client,
    options,
    ids
  }) {
    if (ids.length <= 0) {
      return 0;
    }

    const subCases = await this.findSubCases({
      client,
      options: { ...options,
        page: 1,
        perPage: 1,
        fields: [],
        hasReference: ids.map(id => {
          return {
            id,
            type: _saved_object_types.CASE_SAVED_OBJECT
          };
        })
      }
    });
    return subCases.total;
  }

  async createSubCase({
    client,
    createdAt,
    caseId,
    createdBy
  }) {
    try {
      this.log.debug(`Attempting to POST a new sub case`);
      return client.create(_saved_object_types.SUB_CASE_SAVED_OBJECT, (0, _utils.transformNewSubCase)({
        createdAt,
        createdBy
      }), {
        references: [{
          type: _saved_object_types.CASE_SAVED_OBJECT,
          name: `associated-${_saved_object_types.CASE_SAVED_OBJECT}`,
          id: caseId
        }]
      });
    } catch (error) {
      this.log.error(`Error on POST a new sub case for id ${caseId}: ${error}`);
      throw error;
    }
  }

  async getMostRecentSubCase(client, caseId) {
    try {
      this.log.debug(`Attempting to find most recent sub case for caseID: ${caseId}`);
      const subCases = await client.find({
        perPage: 1,
        sortField: 'created_at',
        sortOrder: 'desc',
        type: _saved_object_types.SUB_CASE_SAVED_OBJECT,
        hasReference: {
          type: _saved_object_types.CASE_SAVED_OBJECT,
          id: caseId
        }
      });

      if (subCases.saved_objects.length <= 0) {
        return;
      }

      return subCases.saved_objects[0];
    } catch (error) {
      this.log.error(`Error finding the most recent sub case for case: ${caseId}: ${error}`);
      throw error;
    }
  }

  async deleteSubCase(client, id) {
    try {
      this.log.debug(`Attempting to DELETE sub case ${id}`);
      return await client.delete(_saved_object_types.SUB_CASE_SAVED_OBJECT, id);
    } catch (error) {
      this.log.error(`Error on DELETE sub case ${id}: ${error}`);
      throw error;
    }
  }

  async deleteCase({
    client,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to DELETE case ${caseId}`);
      return await client.delete(_saved_object_types.CASE_SAVED_OBJECT, caseId);
    } catch (error) {
      this.log.error(`Error on DELETE case ${caseId}: ${error}`);
      throw error;
    }
  }

  async deleteComment({
    client,
    commentId
  }) {
    try {
      this.log.debug(`Attempting to GET comment ${commentId}`);
      return await client.delete(_saved_object_types.CASE_COMMENT_SAVED_OBJECT, commentId);
    } catch (error) {
      this.log.error(`Error on GET comment ${commentId}: ${error}`);
      throw error;
    }
  }

  async getCase({
    client,
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to GET case ${caseId}`);
      return await client.get(_saved_object_types.CASE_SAVED_OBJECT, caseId);
    } catch (error) {
      this.log.error(`Error on GET case ${caseId}: ${error}`);
      throw error;
    }
  }

  async getSubCase({
    client,
    id
  }) {
    try {
      this.log.debug(`Attempting to GET sub case ${id}`);
      return await client.get(_saved_object_types.SUB_CASE_SAVED_OBJECT, id);
    } catch (error) {
      this.log.error(`Error on GET sub case ${id}: ${error}`);
      throw error;
    }
  }

  async getSubCases({
    client,
    ids
  }) {
    try {
      this.log.debug(`Attempting to GET sub cases ${ids.join(', ')}`);
      return await client.bulkGet(ids.map(id => ({
        type: _saved_object_types.SUB_CASE_SAVED_OBJECT,
        id
      })));
    } catch (error) {
      this.log.error(`Error on GET cases ${ids.join(', ')}: ${error}`);
      throw error;
    }
  }

  async getCases({
    client,
    caseIds
  }) {
    try {
      this.log.debug(`Attempting to GET cases ${caseIds.join(', ')}`);
      return await client.bulkGet(caseIds.map(caseId => ({
        type: _saved_object_types.CASE_SAVED_OBJECT,
        id: caseId
      })));
    } catch (error) {
      this.log.error(`Error on GET cases ${caseIds.join(', ')}: ${error}`);
      throw error;
    }
  }

  async getComment({
    client,
    commentId
  }) {
    try {
      this.log.debug(`Attempting to GET comment ${commentId}`);
      return await client.get(_saved_object_types.CASE_COMMENT_SAVED_OBJECT, commentId);
    } catch (error) {
      this.log.error(`Error on GET comment ${commentId}: ${error}`);
      throw error;
    }
  }

  async findCases({
    client,
    options
  }) {
    try {
      this.log.debug(`Attempting to find cases`);
      return await client.find({
        sortField: _common.defaultSortField,
        ...options,
        type: _saved_object_types.CASE_SAVED_OBJECT
      });
    } catch (error) {
      this.log.error(`Error on find cases: ${error}`);
      throw error;
    }
  }

  async findSubCases({
    client,
    options
  }) {
    try {
      this.log.debug(`Attempting to find sub cases`); // if the page or perPage options are set then respect those instead of trying to
      // grab all sub cases

      if ((options === null || options === void 0 ? void 0 : options.page) !== undefined || (options === null || options === void 0 ? void 0 : options.perPage) !== undefined) {
        return client.find({
          sortField: _common.defaultSortField,
          ...options,
          type: _saved_object_types.SUB_CASE_SAVED_OBJECT
        });
      }

      const stats = await client.find({
        fields: [],
        page: 1,
        perPage: 1,
        sortField: _common.defaultSortField,
        ...options,
        type: _saved_object_types.SUB_CASE_SAVED_OBJECT
      });
      return client.find({
        page: 1,
        perPage: stats.total,
        sortField: _common.defaultSortField,
        ...options,
        type: _saved_object_types.SUB_CASE_SAVED_OBJECT
      });
    } catch (error) {
      this.log.error(`Error on find sub cases: ${error}`);
      throw error;
    }
  }
  /**
   * Find sub cases using a collection's ID. This would try to retrieve the maximum amount of sub cases
   * by default.
   *
   * @param id the saved object ID of the parent collection to find sub cases for.
   */


  async findSubCasesByCaseId({
    client,
    ids,
    options
  }) {
    if (ids.length <= 0) {
      var _options$page, _options$perPage;

      return {
        total: 0,
        saved_objects: [],
        page: (_options$page = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page !== void 0 ? _options$page : _api2.defaultPage,
        per_page: (_options$perPage = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage !== void 0 ? _options$perPage : _api2.defaultPerPage
      };
    }

    try {
      this.log.debug(`Attempting to GET sub cases for case collection id ${ids.join(', ')}`);
      return this.findSubCases({
        client,
        options: { ...options,
          hasReference: ids.map(id => ({
            type: _saved_object_types.CASE_SAVED_OBJECT,
            id
          }))
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all sub cases for case collection id ${ids.join(', ')}: ${error}`);
      throw error;
    }
  }

  asArray(id) {
    if (id === undefined) {
      return [];
    } else if (Array.isArray(id)) {
      return id;
    } else {
      return [id];
    }
  }

  async getAllComments({
    client,
    id,
    options
  }) {
    try {
      this.log.debug(`Attempting to GET all comments for id ${JSON.stringify(id)}`);

      if ((options === null || options === void 0 ? void 0 : options.page) !== undefined || (options === null || options === void 0 ? void 0 : options.perPage) !== undefined) {
        return client.find({
          type: _saved_object_types.CASE_COMMENT_SAVED_OBJECT,
          sortField: _common.defaultSortField,
          ...options
        });
      } // get the total number of comments that are in ES then we'll grab them all in one go


      const stats = await client.find({
        type: _saved_object_types.CASE_COMMENT_SAVED_OBJECT,
        fields: [],
        page: 1,
        perPage: 1,
        sortField: _common.defaultSortField,
        // spread the options after so the caller can override the default behavior if they want
        ...options
      });
      return client.find({
        type: _saved_object_types.CASE_COMMENT_SAVED_OBJECT,
        page: 1,
        perPage: stats.total,
        sortField: _common.defaultSortField,
        ...options
      });
    } catch (error) {
      this.log.error(`Error on GET all comments for ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }
  /**
   * Default behavior is to retrieve all comments that adhere to a given filter (if one is included).
   * to override this pass in the either the page or perPage options.
   *
   * @param includeSubCaseComments is a flag to indicate that sub case comments should be included as well, by default
   *  sub case comments are excluded. If the `filter` field is included in the options, it will override this behavior
   */


  async getAllCaseComments({
    client,
    id,
    options,
    includeSubCaseComments = false
  }) {
    try {
      const refs = this.asArray(id).map(caseID => ({
        type: _saved_object_types.CASE_SAVED_OBJECT,
        id: caseID
      }));

      if (refs.length <= 0) {
        var _options$perPage2, _options$page2;

        return {
          saved_objects: [],
          total: 0,
          per_page: (_options$perPage2 = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage2 !== void 0 ? _options$perPage2 : _api2.defaultPerPage,
          page: (_options$page2 = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page2 !== void 0 ? _options$page2 : _api2.defaultPage
        };
      }

      let filter;

      if (!includeSubCaseComments) {
        var _options$filter; // if other filters were passed in then combine them to filter out sub case comments


        filter = (0, _common.combineFilters)([(_options$filter = options === null || options === void 0 ? void 0 : options.filter) !== null && _options$filter !== void 0 ? _options$filter : '', `${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.associationType: ${_api.AssociationType.case}`], 'AND');
      }

      this.log.debug(`Attempting to GET all comments for case caseID ${JSON.stringify(id)}`);
      return this.getAllComments({
        client,
        id,
        options: {
          hasReferenceOperator: 'OR',
          hasReference: refs,
          filter,
          ...options
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all comments for case ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }

  async getAllSubCaseComments({
    client,
    id,
    options
  }) {
    try {
      const refs = this.asArray(id).map(caseID => ({
        type: _saved_object_types.SUB_CASE_SAVED_OBJECT,
        id: caseID
      }));

      if (refs.length <= 0) {
        var _options$perPage3, _options$page3;

        return {
          saved_objects: [],
          total: 0,
          per_page: (_options$perPage3 = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage3 !== void 0 ? _options$perPage3 : _api2.defaultPerPage,
          page: (_options$page3 = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page3 !== void 0 ? _options$page3 : _api2.defaultPage
        };
      }

      this.log.debug(`Attempting to GET all comments for sub case caseID ${JSON.stringify(id)}`);
      return this.getAllComments({
        client,
        id,
        options: {
          hasReferenceOperator: 'OR',
          hasReference: refs,
          ...options
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all comments for sub case ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }

  async getReporters({
    client
  }) {
    try {
      this.log.debug(`Attempting to GET all reporters`);
      return await (0, _read_reporters.readReporters)({
        client
      });
    } catch (error) {
      this.log.error(`Error on GET all reporters: ${error}`);
      throw error;
    }
  }

  async getTags({
    client
  }) {
    try {
      this.log.debug(`Attempting to GET all cases`);
      return await (0, _read_tags.readTags)({
        client
      });
    } catch (error) {
      this.log.error(`Error on GET cases: ${error}`);
      throw error;
    }
  }

  async getUser({
    request
  }) {
    try {
      this.log.debug(`Attempting to authenticate a user`);

      if (this.authentication != null) {
        const user = this.authentication.getCurrentUser(request);

        if (!user) {
          return {
            username: null,
            full_name: null,
            email: null
          };
        }

        return user;
      }

      return {
        username: null,
        full_name: null,
        email: null
      };
    } catch (error) {
      this.log.error(`Error on GET cases: ${error}`);
      throw error;
    }
  }

  async postNewCase({
    client,
    attributes
  }) {
    try {
      this.log.debug(`Attempting to POST a new case`);
      return await client.create(_saved_object_types.CASE_SAVED_OBJECT, { ...attributes
      });
    } catch (error) {
      this.log.error(`Error on POST a new case: ${error}`);
      throw error;
    }
  }

  async postNewComment({
    client,
    attributes,
    references
  }) {
    try {
      this.log.debug(`Attempting to POST a new comment`);
      return await client.create(_saved_object_types.CASE_COMMENT_SAVED_OBJECT, attributes, {
        references
      });
    } catch (error) {
      this.log.error(`Error on POST a new comment: ${error}`);
      throw error;
    }
  }

  async patchCase({
    client,
    caseId,
    updatedAttributes,
    version
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${caseId}`);
      return await client.update(_saved_object_types.CASE_SAVED_OBJECT, caseId, { ...updatedAttributes
      }, {
        version
      });
    } catch (error) {
      this.log.error(`Error on UPDATE case ${caseId}: ${error}`);
      throw error;
    }
  }

  async patchCases({
    client,
    cases
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${cases.map(c => c.caseId).join(', ')}`);
      return await client.bulkUpdate(cases.map(c => ({
        type: _saved_object_types.CASE_SAVED_OBJECT,
        id: c.caseId,
        attributes: c.updatedAttributes,
        version: c.version
      })));
    } catch (error) {
      this.log.error(`Error on UPDATE case ${cases.map(c => c.caseId).join(', ')}: ${error}`);
      throw error;
    }
  }

  async patchComment({
    client,
    commentId,
    updatedAttributes,
    version
  }) {
    try {
      this.log.debug(`Attempting to UPDATE comment ${commentId}`);
      return await client.update(_saved_object_types.CASE_COMMENT_SAVED_OBJECT, commentId, { ...updatedAttributes
      }, {
        version
      });
    } catch (error) {
      this.log.error(`Error on UPDATE comment ${commentId}: ${error}`);
      throw error;
    }
  }

  async patchComments({
    client,
    comments
  }) {
    try {
      this.log.debug(`Attempting to UPDATE comments ${comments.map(c => c.commentId).join(', ')}`);
      return await client.bulkUpdate(comments.map(c => ({
        type: _saved_object_types.CASE_COMMENT_SAVED_OBJECT,
        id: c.commentId,
        attributes: c.updatedAttributes,
        version: c.version
      })));
    } catch (error) {
      this.log.error(`Error on UPDATE comments ${comments.map(c => c.commentId).join(', ')}: ${error}`);
      throw error;
    }
  }

  async patchSubCase({
    client,
    subCaseId,
    updatedAttributes,
    version
  }) {
    try {
      this.log.debug(`Attempting to UPDATE sub case ${subCaseId}`);
      return await client.update(_saved_object_types.SUB_CASE_SAVED_OBJECT, subCaseId, { ...updatedAttributes
      }, {
        version
      });
    } catch (error) {
      this.log.error(`Error on UPDATE sub case ${subCaseId}: ${error}`);
      throw error;
    }
  }

  async patchSubCases({
    client,
    subCases
  }) {
    try {
      this.log.debug(`Attempting to UPDATE sub case ${subCases.map(c => c.subCaseId).join(', ')}`);
      return await client.bulkUpdate(subCases.map(c => ({
        type: _saved_object_types.SUB_CASE_SAVED_OBJECT,
        id: c.subCaseId,
        attributes: c.updatedAttributes,
        version: c.version
      })));
    } catch (error) {
      this.log.error(`Error on UPDATE sub case ${subCases.map(c => c.subCaseId).join(', ')}: ${error}`);
      throw error;
    }
  }

}

exports.CaseService = CaseService;