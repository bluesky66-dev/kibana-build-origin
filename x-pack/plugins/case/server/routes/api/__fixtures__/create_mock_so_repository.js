"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockSavedObjectsRepository = void 0;

var _server = require("src/core/server");

var _saved_object_types = require("../../../saved_object_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createMockSavedObjectsRepository = ({
  caseSavedObject = [],
  caseCommentSavedObject = [],
  caseConfigureSavedObject = [],
  caseMappingsSavedObject = [],
  caseUserActionsSavedObject = []
} = {}) => {
  const mockSavedObjectsClientContract = {
    bulkGet: jest.fn(objects => {
      return {
        saved_objects: objects.map(({
          id,
          type
        }) => {
          if (type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT) {
            const result = caseCommentSavedObject.filter(s => s.id === id);

            if (!result.length) {
              throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
            }

            return result;
          }

          const result = caseSavedObject.filter(s => s.id === id);

          if (!result.length) {
            return {
              id,
              type,
              error: {
                statusCode: 404,
                error: 'Not Found',
                message: 'Saved object [cases/not-exist] not found'
              }
            };
          }

          return result[0];
        })
      };
    }),
    bulkCreate: jest.fn(),
    bulkUpdate: jest.fn(objects => {
      return {
        saved_objects: objects.map(({
          id,
          type,
          attributes
        }) => {
          if (type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT) {
            if (!caseCommentSavedObject.find(s => s.id === id)) {
              throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
            }
          } else if (type === _saved_object_types.CASE_SAVED_OBJECT) {
            if (!caseSavedObject.find(s => s.id === id)) {
              throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
            }
          }

          return {
            id,
            type,
            updated_at: '2019-11-22T22:50:55.191Z',
            version: 'WzE3LDFd',
            attributes
          };
        })
      };
    }),
    get: jest.fn((type, id) => {
      if (type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT) {
        const result = caseCommentSavedObject.filter(s => s.id === id);

        if (!result.length) {
          throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }

        return result[0];
      } else if (type === _saved_object_types.CASE_SAVED_OBJECT) {
        const result = caseSavedObject.filter(s => s.id === id);

        if (!result.length) {
          throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }

        return result[0];
      } else {
        throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
      }
    }),
    find: jest.fn(findArgs => {
      // References can be an array so we need to loop through it looking for the bad-guy
      const hasReferenceIncludeBadGuy = args => {
        const references = args.hasReference;

        if (references) {
          return Array.isArray(references) ? references.some(ref => ref.id === 'bad-guy') : references.id === 'bad-guy';
        } else {
          return false;
        }
      };

      if (hasReferenceIncludeBadGuy(findArgs)) {
        throw _server.SavedObjectsErrorHelpers.createBadRequestError('Error thrown for testing');
      }

      if (findArgs.type === _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT && caseConfigureSavedObject[0] && caseConfigureSavedObject[0].id === 'throw-error-find' || findArgs.type === _saved_object_types.CASE_SAVED_OBJECT && caseSavedObject[0] && caseSavedObject[0].id === 'throw-error-find') {
        throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError('Error thrown for testing');
      }

      if (findArgs.type === _saved_object_types.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT && caseMappingsSavedObject[0]) {
        return {
          page: 1,
          per_page: 5,
          total: 1,
          saved_objects: caseMappingsSavedObject
        };
      }

      if (findArgs.type === _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT) {
        return {
          page: 1,
          per_page: 5,
          total: caseConfigureSavedObject.length,
          saved_objects: caseConfigureSavedObject
        };
      }

      if (findArgs.type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT) {
        return {
          page: 1,
          per_page: 5,
          total: caseCommentSavedObject.length,
          saved_objects: caseCommentSavedObject
        };
      } // Currently not supporting sub cases in this mock library


      if (findArgs.type === _saved_object_types.SUB_CASE_SAVED_OBJECT) {
        return {
          page: 1,
          per_page: 0,
          total: 0,
          saved_objects: []
        };
      }

      if (findArgs.type === _saved_object_types.CASE_USER_ACTION_SAVED_OBJECT) {
        return {
          page: 1,
          per_page: 5,
          total: caseUserActionsSavedObject.length,
          saved_objects: caseUserActionsSavedObject
        };
      }

      return {
        page: 1,
        per_page: 5,
        total: caseSavedObject.length,
        saved_objects: caseSavedObject
      };
    }),
    create: jest.fn((type, attributes, references) => {
      if (attributes.description === 'Throw an error' || attributes.comment === 'Throw an error') {
        throw _server.SavedObjectsErrorHelpers.createBadRequestError('Error thrown for testing');
      }

      if (type === _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT && attributes.connector.id === 'throw-error-create') {
        throw _server.SavedObjectsErrorHelpers.createBadRequestError('Error thrown for testing');
      }

      if (type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT) {
        const newCommentObj = {
          type,
          id: 'mock-comment',
          attributes,
          ...references,
          updated_at: '2019-12-02T22:48:08.327Z',
          version: 'WzksMV0='
        };
        caseCommentSavedObject = [...caseCommentSavedObject, newCommentObj];
        return newCommentObj;
      }

      if (type === _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT) {
        const newConfiguration = {
          type,
          id: 'mock-configuration',
          attributes,
          updated_at: '2020-04-09T09:43:51.778Z',
          version: attributes.connector.id === 'no-version' ? undefined : 'WzksMV0='
        };
        caseConfigureSavedObject = [newConfiguration];
        return newConfiguration;
      }

      return {
        type,
        id: 'mock-it',
        attributes,
        references: [],
        updated_at: '2019-12-02T22:48:08.327Z',
        version: 'WzksMV0='
      };
    }),
    update: jest.fn((type, id, attributes) => {
      if (type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT) {
        const foundComment = caseCommentSavedObject.findIndex(s => s.id === id);

        if (foundComment === -1) {
          throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }

        const comment = caseCommentSavedObject[foundComment];
        caseCommentSavedObject.splice(foundComment, 1, { ...comment,
          id,
          type,
          updated_at: '2019-11-22T22:50:55.191Z',
          version: 'WzE3LDFd',
          attributes: { ...comment.attributes,
            ...attributes
          }
        });
      } else if (type === _saved_object_types.CASE_SAVED_OBJECT) {
        if (!caseSavedObject.find(s => s.id === id)) {
          throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
        }
      }

      if (type === _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT) {
        var _attributes$connector;

        return {
          id,
          type,
          updated_at: '2019-11-22T22:50:55.191Z',
          attributes,
          version: ((_attributes$connector = attributes.connector) === null || _attributes$connector === void 0 ? void 0 : _attributes$connector.id) === 'no-version' ? undefined : 'WzE3LDFd'
        };
      }

      return {
        id,
        type,
        updated_at: '2019-11-22T22:50:55.191Z',
        version: 'WzE3LDFd',
        attributes
      };
    }),
    delete: jest.fn((type, id) => {
      let result = caseSavedObject.filter(s => s.id === id);

      if (type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT) {
        result = caseCommentSavedObject.filter(s => s.id === id);
      }

      if (type === _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT) {
        result = caseConfigureSavedObject.filter(s => s.id === id);
      }

      if (type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT && id === 'bad-guy') {
        throw _server.SavedObjectsErrorHelpers.createBadRequestError('Error thrown for testing');
      }

      if (!result.length) {
        throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
      }

      if (type === _saved_object_types.CASE_CONFIGURE_SAVED_OBJECT && caseConfigureSavedObject[0].id === 'throw-error-delete') {
        throw new Error('Error thrown for testing');
      }

      return {};
    }),
    deleteByNamespace: jest.fn()
  };
  return mockSavedObjectsClientContract;
};

exports.createMockSavedObjectsRepository = createMockSavedObjectsRepository;