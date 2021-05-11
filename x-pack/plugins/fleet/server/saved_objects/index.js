"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSavedObjects = registerSavedObjects;
exports.registerEncryptedSavedObjects = registerEncryptedSavedObjects;

var _security_solution = require("./security_solution");

var _constants = require("../constants");

var _to_v7_10_ = require("./migrations/to_v7_10_0");

var _to_v7_12_ = require("./migrations/to_v7_12_0");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Saved object types and mappings
 *
 * Please update typings in `/common/types` as well as
 * schemas in `/server/types` if mappings are updated.
 */


const getSavedObjectTypes = encryptedSavedObjects => ({
  [_constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE]: {
    name: _constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        agent_auto_upgrade: {
          type: 'keyword'
        },
        package_auto_upgrade: {
          type: 'keyword'
        },
        kibana_urls: {
          type: 'keyword'
        },
        kibana_ca_sha256: {
          type: 'keyword'
        },
        has_seen_add_data_notice: {
          type: 'boolean',
          index: false
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migrateSettingsToV7100
    }
  },
  [_constants.AGENT_SAVED_OBJECT_TYPE]: {
    name: _constants.AGENT_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        type: {
          type: 'keyword'
        },
        active: {
          type: 'boolean'
        },
        enrolled_at: {
          type: 'date'
        },
        unenrolled_at: {
          type: 'date'
        },
        unenrollment_started_at: {
          type: 'date'
        },
        upgraded_at: {
          type: 'date'
        },
        upgrade_started_at: {
          type: 'date'
        },
        access_api_key_id: {
          type: 'keyword'
        },
        version: {
          type: 'keyword'
        },
        user_provided_metadata: {
          type: 'flattened'
        },
        local_metadata: {
          type: 'flattened'
        },
        policy_id: {
          type: 'keyword'
        },
        policy_revision: {
          type: 'integer'
        },
        last_updated: {
          type: 'date'
        },
        last_checkin: {
          type: 'date'
        },
        last_checkin_status: {
          type: 'keyword'
        },
        default_api_key_id: {
          type: 'keyword'
        },
        default_api_key: {
          type: 'binary'
        },
        updated_at: {
          type: 'date'
        },
        current_error_events: {
          type: 'text',
          index: false
        },
        packages: {
          type: 'keyword'
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migrateAgentToV7100,
      '7.12.0': _to_v7_12_.migrateAgentToV7120
    }
  },
  [_constants.AGENT_ACTION_SAVED_OBJECT_TYPE]: {
    name: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        agent_id: {
          type: 'keyword'
        },
        policy_id: {
          type: 'keyword'
        },
        policy_revision: {
          type: 'integer'
        },
        type: {
          type: 'keyword'
        },
        data: {
          type: 'binary'
        },
        ack_data: {
          type: 'text'
        },
        sent_at: {
          type: 'date'
        },
        created_at: {
          type: 'date'
        }
      }
    },
    migrations: {
      '7.10.0': (0, _to_v7_10_.migrateAgentActionToV7100)(encryptedSavedObjects)
    }
  },
  // TODO: Remove this saved object type. Core will drop any saved objects of
  // this type during migrations. See https://github.com/elastic/kibana/issues/91869
  [_constants.AGENT_EVENT_SAVED_OBJECT_TYPE]: {
    name: _constants.AGENT_EVENT_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        type: {
          type: 'keyword'
        },
        subtype: {
          type: 'keyword'
        },
        agent_id: {
          type: 'keyword'
        },
        action_id: {
          type: 'keyword'
        },
        policy_id: {
          type: 'keyword'
        },
        stream_id: {
          type: 'keyword'
        },
        timestamp: {
          type: 'date'
        },
        message: {
          type: 'text'
        },
        payload: {
          type: 'text'
        },
        data: {
          type: 'text'
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migrateAgentEventToV7100
    }
  },
  [_constants.AGENT_POLICY_SAVED_OBJECT_TYPE]: {
    name: _constants.AGENT_POLICY_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        description: {
          type: 'text'
        },
        namespace: {
          type: 'keyword'
        },
        is_default: {
          type: 'boolean'
        },
        is_default_fleet_server: {
          type: 'boolean'
        },
        is_managed: {
          type: 'boolean'
        },
        status: {
          type: 'keyword'
        },
        package_policies: {
          type: 'keyword'
        },
        updated_at: {
          type: 'date'
        },
        updated_by: {
          type: 'keyword'
        },
        revision: {
          type: 'integer'
        },
        monitoring_enabled: {
          type: 'keyword',
          index: false
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migrateAgentPolicyToV7100,
      '7.12.0': _to_v7_12_.migrateAgentPolicyToV7120
    }
  },
  [_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE]: {
    name: _constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        type: {
          type: 'keyword'
        },
        api_key: {
          type: 'binary'
        },
        api_key_id: {
          type: 'keyword'
        },
        policy_id: {
          type: 'keyword'
        },
        created_at: {
          type: 'date'
        },
        updated_at: {
          type: 'date'
        },
        expire_at: {
          type: 'date'
        },
        active: {
          type: 'boolean'
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migrateEnrollmentApiKeysToV7100
    }
  },
  [_constants.OUTPUT_SAVED_OBJECT_TYPE]: {
    name: _constants.OUTPUT_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        type: {
          type: 'keyword'
        },
        is_default: {
          type: 'boolean'
        },
        hosts: {
          type: 'keyword'
        },
        ca_sha256: {
          type: 'keyword',
          index: false
        },
        fleet_enroll_username: {
          type: 'binary'
        },
        fleet_enroll_password: {
          type: 'binary'
        },
        config: {
          type: 'flattened'
        },
        config_yaml: {
          type: 'text'
        }
      }
    }
  },
  [_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE]: {
    name: _constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        description: {
          type: 'text'
        },
        namespace: {
          type: 'keyword'
        },
        enabled: {
          type: 'boolean'
        },
        policy_id: {
          type: 'keyword'
        },
        output_id: {
          type: 'keyword'
        },
        package: {
          properties: {
            name: {
              type: 'keyword'
            },
            title: {
              type: 'keyword'
            },
            version: {
              type: 'keyword'
            }
          }
        },
        inputs: {
          type: 'nested',
          enabled: false,
          properties: {
            type: {
              type: 'keyword'
            },
            enabled: {
              type: 'boolean'
            },
            vars: {
              type: 'flattened'
            },
            config: {
              type: 'flattened'
            },
            compiled_input: {
              type: 'flattened'
            },
            streams: {
              type: 'nested',
              properties: {
                id: {
                  type: 'keyword'
                },
                enabled: {
                  type: 'boolean'
                },
                data_stream: {
                  properties: {
                    dataset: {
                      type: 'keyword'
                    },
                    type: {
                      type: 'keyword'
                    }
                  }
                },
                vars: {
                  type: 'flattened'
                },
                config: {
                  type: 'flattened'
                },
                compiled_stream: {
                  type: 'flattened'
                }
              }
            }
          }
        },
        revision: {
          type: 'integer'
        },
        updated_at: {
          type: 'date'
        },
        updated_by: {
          type: 'keyword'
        },
        created_at: {
          type: 'date'
        },
        created_by: {
          type: 'keyword'
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migratePackagePolicyToV7100,
      '7.11.0': _security_solution.migratePackagePolicyToV7110,
      '7.12.0': _security_solution.migratePackagePolicyToV7120
    }
  },
  [_constants.PACKAGES_SAVED_OBJECT_TYPE]: {
    name: _constants.PACKAGES_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        version: {
          type: 'keyword'
        },
        internal: {
          type: 'boolean'
        },
        removable: {
          type: 'boolean'
        },
        es_index_patterns: {
          enabled: false,
          type: 'object'
        },
        installed_es: {
          type: 'nested',
          properties: {
            id: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            }
          }
        },
        installed_kibana: {
          type: 'nested',
          properties: {
            id: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            }
          }
        },
        package_assets: {
          type: 'nested',
          properties: {
            id: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            }
          }
        },
        install_started_at: {
          type: 'date'
        },
        install_version: {
          type: 'keyword'
        },
        install_status: {
          type: 'keyword'
        },
        install_source: {
          type: 'keyword'
        }
      }
    }
  },
  [_constants.ASSETS_SAVED_OBJECT_TYPE]: {
    name: _constants.ASSETS_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        package_name: {
          type: 'keyword'
        },
        package_version: {
          type: 'keyword'
        },
        install_source: {
          type: 'keyword'
        },
        asset_path: {
          type: 'keyword'
        },
        media_type: {
          type: 'keyword'
        },
        data_utf8: {
          type: 'text',
          index: false
        },
        data_base64: {
          type: 'binary'
        }
      }
    }
  }
});

function registerSavedObjects(savedObjects, encryptedSavedObjects) {
  const savedObjectTypes = getSavedObjectTypes(encryptedSavedObjects);
  Object.values(savedObjectTypes).forEach(type => {
    savedObjects.registerType(type);
  });
}

function registerEncryptedSavedObjects(encryptedSavedObjects) {
  // Encrypted saved objects
  encryptedSavedObjects.registerType({
    type: _constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['api_key']),
    attributesToExcludeFromAAD: new Set(['name', 'type', 'api_key_id', 'policy_id', 'created_at', 'updated_at', 'expire_at', 'active'])
  });
  encryptedSavedObjects.registerType({
    type: _constants.OUTPUT_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['fleet_enroll_username', 'fleet_enroll_password']),
    attributesToExcludeFromAAD: new Set(['name', 'type', 'is_default', 'hosts', 'ca_sha256', 'config', 'config_yaml'])
  });
  encryptedSavedObjects.registerType({
    type: _constants.AGENT_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['default_api_key']),
    attributesToExcludeFromAAD: new Set(['type', 'active', 'enrolled_at', 'access_api_key_id', 'version', 'user_provided_metadata', 'local_metadata', 'policy_id', 'policy_revision', 'last_updated', 'last_checkin', 'last_checkin_status', 'updated_at', 'current_error_events', 'unenrolled_at', 'unenrollment_started_at', 'packages', 'upgraded_at', 'upgrade_started_at'])
  });
  encryptedSavedObjects.registerType({
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['data']),
    attributesToExcludeFromAAD: new Set(['agent_id', 'type', 'sent_at', 'created_at'])
  });
}