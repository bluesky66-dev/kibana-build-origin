"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentableCase = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _api = require("../../../common/api");

var _helpers = require("../../routes/api/cases/helpers");

var _utils = require("../../routes/api/utils");

var _saved_object_types = require("../../saved_object_types");

var _error = require("../error");

var _index = require("../index");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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
/**
 * This class represents a case that can have a comment attached to it. This includes
 * a Sub Case, Case, and Collection.
 */


class CommentableCase {
  constructor({
    collection,
    subCase,
    soClient,
    service,
    logger
  }) {
    _defineProperty(this, "collection", void 0);

    _defineProperty(this, "subCase", void 0);

    _defineProperty(this, "soClient", void 0);

    _defineProperty(this, "service", void 0);

    _defineProperty(this, "logger", void 0);

    this.collection = collection;
    this.subCase = subCase;
    this.soClient = soClient;
    this.service = service;
    this.logger = logger;
  }

  get status() {
    var _this$subCase$attribu, _this$subCase;

    return (_this$subCase$attribu = (_this$subCase = this.subCase) === null || _this$subCase === void 0 ? void 0 : _this$subCase.attributes.status) !== null && _this$subCase$attribu !== void 0 ? _this$subCase$attribu : this.collection.attributes.status;
  }
  /**
   * This property is used to abstract away which element is actually being acted upon in this class.
   * If the sub case was initialized then it will be the focus of creating comments. So if you want the id
   * of the saved object that the comment is primarily being attached to use this property.
   *
   * This is a little confusing because the created comment will have references to both the sub case and the
   * collection but from the UI's perspective only the sub case really has the comment attached to it.
   */


  get id() {
    var _this$subCase$id, _this$subCase2;

    return (_this$subCase$id = (_this$subCase2 = this.subCase) === null || _this$subCase2 === void 0 ? void 0 : _this$subCase2.id) !== null && _this$subCase$id !== void 0 ? _this$subCase$id : this.collection.id;
  }

  get settings() {
    return this.collection.attributes.settings;
  }
  /**
   * These functions break the abstraction of this class but they are needed to build the comment user action item.
   * Another potential solution would be to implement another function that handles creating the user action in this
   * class so that we don't need to expose these properties.
   */


  get caseId() {
    return this.collection.id;
  }

  get subCaseId() {
    var _this$subCase3;

    return (_this$subCase3 = this.subCase) === null || _this$subCase3 === void 0 ? void 0 : _this$subCase3.id;
  }

  buildRefsToCase() {
    const subCaseSOType = _saved_object_types.SUB_CASE_SAVED_OBJECT;
    const caseSOType = _saved_object_types.CASE_SAVED_OBJECT;
    return [{
      type: caseSOType,
      name: `associated-${caseSOType}`,
      id: this.collection.id
    }, ...(this.subCase ? [{
      type: subCaseSOType,
      name: `associated-${subCaseSOType}`,
      id: this.subCase.id
    }] : [])];
  }

  async update({
    date,
    user
  }) {
    try {
      var _updatedCase$version;

      let updatedSubCaseAttributes;

      if (this.subCase) {
        var _updatedSubCase$versi;

        const updatedSubCase = await this.service.patchSubCase({
          client: this.soClient,
          subCaseId: this.subCase.id,
          updatedAttributes: {
            updated_at: date,
            updated_by: { ...user
            }
          },
          version: this.subCase.version
        });
        updatedSubCaseAttributes = { ...this.subCase,
          attributes: { ...this.subCase.attributes,
            ...updatedSubCase.attributes
          },
          version: (_updatedSubCase$versi = updatedSubCase.version) !== null && _updatedSubCase$versi !== void 0 ? _updatedSubCase$versi : this.subCase.version
        };
      }

      const updatedCase = await this.service.patchCase({
        client: this.soClient,
        caseId: this.collection.id,
        updatedAttributes: {
          updated_at: date,
          updated_by: { ...user
          }
        },
        version: this.collection.version
      }); // this will contain the updated sub case information if the sub case was defined initially

      return new CommentableCase({
        collection: { ...this.collection,
          attributes: { ...this.collection.attributes,
            ...updatedCase.attributes
          },
          version: (_updatedCase$version = updatedCase.version) !== null && _updatedCase$version !== void 0 ? _updatedCase$version : this.collection.version
        },
        subCase: updatedSubCaseAttributes,
        soClient: this.soClient,
        service: this.service,
        logger: this.logger
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }
  /**
   * Update a comment and update the corresponding case's update_at and updated_by fields.
   */


  async updateComment({
    updateRequest,
    updatedAt,
    user
  }) {
    try {
      const {
        id,
        version,
        ...queryRestAttributes
      } = updateRequest;
      const [comment, commentableCase] = await Promise.all([this.service.patchComment({
        client: this.soClient,
        commentId: id,
        updatedAttributes: { ...queryRestAttributes,
          updated_at: updatedAt,
          updated_by: user
        },
        version
      }), this.update({
        date: updatedAt,
        user
      })]);
      return {
        comment,
        commentableCase
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update comment in commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }
  /**
   * Create a new comment on the appropriate case. This updates the case's updated_at and updated_by fields.
   */


  async createComment({
    createdDate,
    user,
    commentReq
  }) {
    try {
      if (commentReq.type === _api.CommentType.alert) {
        if (this.status === _api.CaseStatuses.closed) {
          throw _boom.default.badRequest('Alert cannot be attached to a closed case');
        }

        if (!this.subCase && this.collection.attributes.type === _api.CaseType.collection) {
          throw _boom.default.badRequest('Alert cannot be attached to a collection case');
        }
      }

      const [comment, commentableCase] = await Promise.all([this.service.postNewComment({
        client: this.soClient,
        attributes: (0, _utils.transformNewComment)({
          associationType: this.subCase ? _api.AssociationType.subCase : _api.AssociationType.case,
          createdDate,
          ...commentReq,
          ...user
        }),
        references: this.buildRefsToCase()
      }), this.update({
        date: createdDate,
        user
      })]);
      return {
        comment,
        commentableCase
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed creating a comment on a commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  formatCollectionForEncoding(totalComment) {
    var _this$collection$vers;

    return {
      id: this.collection.id,
      version: (_this$collection$vers = this.collection.version) !== null && _this$collection$vers !== void 0 ? _this$collection$vers : '0',
      totalComment,
      ...this.collection.attributes,
      connector: (0, _helpers.transformESConnectorToCaseConnector)(this.collection.attributes.connector)
    };
  }

  async encode() {
    try {
      var _countAlertsForID;

      const collectionCommentStats = await this.service.getAllCaseComments({
        client: this.soClient,
        id: this.collection.id,
        options: {
          fields: [],
          page: 1,
          perPage: 1
        }
      });
      const collectionComments = await this.service.getAllCaseComments({
        client: this.soClient,
        id: this.collection.id,
        options: {
          fields: [],
          page: 1,
          perPage: collectionCommentStats.total
        }
      });
      const collectionTotalAlerts = (_countAlertsForID = (0, _index.countAlertsForID)({
        comments: collectionComments,
        id: this.collection.id
      })) !== null && _countAlertsForID !== void 0 ? _countAlertsForID : 0;
      const caseResponse = {
        comments: (0, _utils.flattenCommentSavedObjects)(collectionComments.saved_objects),
        totalAlerts: collectionTotalAlerts,
        ...this.formatCollectionForEncoding(collectionCommentStats.total)
      };

      if (this.subCase) {
        var _countAlertsForID2;

        const subCaseComments = await this.service.getAllSubCaseComments({
          client: this.soClient,
          id: this.subCase.id
        });
        const totalAlerts = (_countAlertsForID2 = (0, _index.countAlertsForID)({
          comments: subCaseComments,
          id: this.subCase.id
        })) !== null && _countAlertsForID2 !== void 0 ? _countAlertsForID2 : 0;
        return _api.CaseResponseRt.encode({ ...caseResponse,

          /**
           * For now we need the sub case comments and totals to be exposed on the top level of the response so that the UI
           * functionality can stay the same. Ideally in the future we can refactor this so that the UI will look for the
           * comments either in the top level for a case or a collection or in the subCases field if it is a sub case.
           *
           * If we ever need to return both the collection's comments and the sub case comments we'll need to refactor it then
           * as well.
           */
          comments: (0, _utils.flattenCommentSavedObjects)(subCaseComments.saved_objects),
          totalComment: subCaseComments.saved_objects.length,
          totalAlerts,
          subCases: [(0, _utils.flattenSubCaseSavedObject)({
            savedObject: this.subCase,
            totalComment: subCaseComments.saved_objects.length,
            totalAlerts
          })]
        });
      }

      return _api.CaseResponseRt.encode(caseResponse);
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed encoding the commentable case, sub case id: ${this.subCaseId} case id: ${this.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

}

exports.CommentableCase = CommentableCase;