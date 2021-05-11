"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPutPayloadSchema = getPutPayloadSchema;
exports.transformPutPayloadToElasticsearchRole = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../../../common/constants");

var _privilege_serializer = require("../../../../authorization/privilege_serializer");

var _resource_serializer = require("../../../../authorization/resource_serializer");

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

/**
 * Elasticsearch specific portion of the role definition.
 * See more details at https://www.elastic.co/guide/en/elasticsearch/reference/master/security-api.html#security-role-apis.
 */


const elasticsearchRoleSchema = _configSchema.schema.object({
  /**
   * An optional list of cluster privileges. These privileges define the cluster level actions that
   * users with this role are able to execute
   */
  cluster: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),

  /**
   * An optional list of indices permissions entries.
   */
  indices: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    /**
     * Required list of indices (or index name patterns) to which the permissions in this
     * entry apply.
     */
    names: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    }),

    /**
     * An optional set of the document fields that the owners of the role have read access to.
     */
    field_security: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.oneOf([_configSchema.schema.literal('grant'), _configSchema.schema.literal('except')]), _configSchema.schema.arrayOf(_configSchema.schema.string()))),

    /**
     * Required list of the index level privileges that the owners of the role have on the
     * specified indices.
     */
    privileges: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    }),

    /**
     * An optional search query that defines the documents the owners of the role have read access
     * to. A document within the specified indices must match this query in order for it to be
     * accessible by the owners of the role.
     */
    query: _configSchema.schema.maybe(_configSchema.schema.string()),

    /**
     * An optional flag used to indicate if index pattern wildcards or regexps should cover
     * restricted indices.
     */
    allow_restricted_indices: _configSchema.schema.maybe(_configSchema.schema.boolean())
  }))),

  /**
   * An optional list of users that the owners of this role can impersonate.
   */
  run_as: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});

const allSpacesSchema = _configSchema.schema.arrayOf(_configSchema.schema.literal(_constants.GLOBAL_RESOURCE), {
  minSize: 1,
  maxSize: 1
});
/**
 * Schema for the list of space IDs used within Kibana specific role definition.
 */


const spacesSchema = _configSchema.schema.oneOf([allSpacesSchema, _configSchema.schema.arrayOf(_configSchema.schema.string({
  validate(value) {
    if (!/^[a-z0-9_-]+$/.test(value)) {
      return `must be lower case, a-z, 0-9, '_', and '-' are allowed`;
    }
  }

}))], {
  defaultValue: [_constants.GLOBAL_RESOURCE]
});

const FEATURE_NAME_VALUE_REGEX = /^[a-zA-Z0-9_-]+$/;

function getPutPayloadSchema(getBasePrivilegeNames) {
  return _configSchema.schema.object({
    /**
     * An optional meta-data dictionary. Within the metadata, keys that begin with _ are reserved
     * for system usage.
     */
    metadata: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),

    /**
     * Elasticsearch specific portion of the role definition.
     */
    elasticsearch: elasticsearchRoleSchema,

    /**
     * Kibana specific portion of the role definition. It's represented as a list of base and/or
     * feature Kibana privileges. None of the entries should apply to the same spaces.
     */
    kibana: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
      /**
       * An optional list of space IDs to which the permissions in this entry apply. If not
       * specified it defaults to special "global" space ID (all spaces).
       */
      spaces: spacesSchema,

      /**
       * An optional list of Kibana base privileges. If this entry applies to special "global"
       * space (all spaces) then specified base privileges should be within known base "global"
       * privilege list, otherwise - within known "space" privilege list. Base privileges
       * definition isn't allowed when feature privileges are defined and required otherwise.
       */
      base: _configSchema.schema.maybe(_configSchema.schema.conditional(_configSchema.schema.siblingRef('spaces'), allSpacesSchema, _configSchema.schema.arrayOf(_configSchema.schema.string({
        validate(value) {
          const globalPrivileges = getBasePrivilegeNames().global;

          if (!globalPrivileges.some(privilege => privilege === value)) {
            return `unknown global privilege "${value}", must be one of [${globalPrivileges}]`;
          }
        }

      })), _configSchema.schema.arrayOf(_configSchema.schema.string({
        validate(value) {
          const spacePrivileges = getBasePrivilegeNames().space;

          if (!spacePrivileges.some(privilege => privilege === value)) {
            return `unknown space privilege "${value}", must be one of [${spacePrivileges}]`;
          }
        }

      })))),

      /**
       * An optional dictionary of Kibana feature privileges where the key is the ID of the
       * feature and the value is a list of feature specific privilege IDs. Both feature and
       * privilege IDs should consist of allowed set of characters. Feature privileges
       * definition isn't allowed when base privileges are defined and required otherwise.
       */
      feature: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string({
        validate(value) {
          if (!FEATURE_NAME_VALUE_REGEX.test(value)) {
            return `only a-z, A-Z, 0-9, '_', and '-' are allowed`;
          }
        }

      }), _configSchema.schema.arrayOf(_configSchema.schema.string({
        validate(value) {
          if (!FEATURE_NAME_VALUE_REGEX.test(value)) {
            return `only a-z, A-Z, 0-9, '_', and '-' are allowed`;
          }
        }

      }))))
    }, {
      validate(value) {
        if ((value.base === undefined || value.base.length === 0) && (value.feature === undefined || Object.values(value.feature).flat().length === 0)) {
          return 'either [base] or [feature] is expected, but none of them specified';
        }

        if (value.base !== undefined && value.base.length > 0 && value.feature !== undefined && Object.keys(value.feature).length > 0) {
          return `definition of [feature] isn't allowed when non-empty [base] is defined.`;
        }
      }

    }), {
      validate(value) {
        for (const [indexA, valueA] of value.entries()) {
          for (const valueB of value.slice(indexA + 1)) {
            const spaceIntersection = _lodash.default.intersection(valueA.spaces, valueB.spaces);

            if (spaceIntersection.length !== 0) {
              return `more than one privilege is applied to the following spaces: [${spaceIntersection}]`;
            }
          }
        }
      }

    }))
  });
}

const transformPutPayloadToElasticsearchRole = (rolePayload, application, allExistingApplications = []) => {
  const {
    elasticsearch = {
      cluster: undefined,
      indices: undefined,
      run_as: undefined
    },
    kibana = []
  } = rolePayload;
  const otherApplications = allExistingApplications.filter(roleApplication => roleApplication.application !== application);
  return {
    metadata: rolePayload.metadata,
    cluster: elasticsearch.cluster || [],
    indices: elasticsearch.indices || [],
    run_as: elasticsearch.run_as || [],
    applications: [...transformPrivilegesToElasticsearchPrivileges(application, kibana), ...otherApplications]
  };
};

exports.transformPutPayloadToElasticsearchRole = transformPutPayloadToElasticsearchRole;

const transformPrivilegesToElasticsearchPrivileges = (application, kibanaPrivileges = []) => {
  return kibanaPrivileges.map(({
    base,
    feature,
    spaces
  }) => {
    if (spaces.length === 1 && spaces[0] === _constants.GLOBAL_RESOURCE) {
      return {
        privileges: [...(base ? base.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeGlobalBasePrivilege(privilege)) : []), ...(feature ? Object.entries(feature).map(([featureName, featurePrivileges]) => featurePrivileges.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeFeaturePrivilege(featureName, privilege))).flat() : [])],
        application,
        resources: [_constants.GLOBAL_RESOURCE]
      };
    }

    return {
      privileges: [...(base ? base.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeSpaceBasePrivilege(privilege)) : []), ...(feature ? Object.entries(feature).map(([featureName, featurePrivileges]) => featurePrivileges.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeFeaturePrivilege(featureName, privilege))).flat() : [])],
      application,
      resources: spaces.map(resource => _resource_serializer.ResourceSerializer.serializeSpaceResource(resource))
    };
  });
};