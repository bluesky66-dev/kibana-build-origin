"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeneratedPolicies = exports.POLICY_WITH_KNOWN_AND_UNKNOWN_FIELDS = exports.POLICY_WITH_NODE_ROLE_ALLOCATION = exports.POLICY_WITH_NODE_ATTR_AND_OFF_ALLOCATION = exports.getDefaultHotPhasePolicy = exports.DELETE_PHASE_POLICY = exports.POLICY_WITH_INCLUDE_EXCLUDE = exports.POLICY_WITH_MIGRATE_OFF = exports.NEW_SNAPSHOT_POLICY_NAME = exports.SNAPSHOT_POLICY_NAME = exports.POLICY_NAME = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

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


const POLICY_NAME = 'my_policy';
exports.POLICY_NAME = POLICY_NAME;
const SNAPSHOT_POLICY_NAME = 'my_snapshot_policy';
exports.SNAPSHOT_POLICY_NAME = SNAPSHOT_POLICY_NAME;
const NEW_SNAPSHOT_POLICY_NAME = 'my_new_snapshot_policy';
exports.NEW_SNAPSHOT_POLICY_NAME = NEW_SNAPSHOT_POLICY_NAME;
const POLICY_WITH_MIGRATE_OFF = {
  version: 1,
  modified_date: Date.now().toString(),
  policy: {
    name: 'my_policy',
    phases: {
      hot: {
        min_age: '0ms',
        actions: {
          rollover: {
            max_age: '30d',
            max_size: '50gb'
          }
        }
      },
      warm: {
        actions: {
          migrate: {
            enabled: false
          }
        }
      }
    }
  },
  name: 'my_policy'
};
exports.POLICY_WITH_MIGRATE_OFF = POLICY_WITH_MIGRATE_OFF;
const POLICY_WITH_INCLUDE_EXCLUDE = {
  version: 1,
  modified_date: Date.now().toString(),
  policy: {
    name: 'my_policy',
    phases: {
      hot: {
        min_age: '123ms',
        actions: {
          rollover: {
            max_age: '30d',
            max_size: '50gb'
          }
        }
      },
      warm: {
        actions: {
          allocate: {
            include: {
              abc: '123'
            },
            exclude: {
              def: '456'
            }
          }
        }
      }
    }
  },
  name: 'my_policy'
};
exports.POLICY_WITH_INCLUDE_EXCLUDE = POLICY_WITH_INCLUDE_EXCLUDE;
const DELETE_PHASE_POLICY = {
  version: 1,
  modified_date: Date.now().toString(),
  policy: {
    phases: {
      hot: {
        min_age: '0ms',
        actions: {
          rollover: {
            max_age: '30d',
            max_size: '50gb'
          },
          set_priority: {
            priority: 100
          }
        }
      },
      delete: {
        min_age: '0ms',
        actions: {
          wait_for_snapshot: {
            policy: SNAPSHOT_POLICY_NAME
          },
          delete: {
            delete_searchable_snapshot: true
          }
        }
      }
    },
    name: POLICY_NAME
  },
  name: POLICY_NAME
};
exports.DELETE_PHASE_POLICY = DELETE_PHASE_POLICY;

const getDefaultHotPhasePolicy = policyName => ({
  version: 1,
  modified_date: Date.now().toString(),
  policy: {
    name: policyName,
    phases: {
      hot: {
        min_age: '0ms',
        actions: {
          rollover: {
            max_age: '30d',
            max_size: '50gb'
          }
        }
      }
    }
  },
  name: policyName
});

exports.getDefaultHotPhasePolicy = getDefaultHotPhasePolicy;
const POLICY_WITH_NODE_ATTR_AND_OFF_ALLOCATION = {
  version: 1,
  modified_date: Date.now().toString(),
  policy: {
    phases: {
      hot: {
        min_age: '0ms',
        actions: {
          rollover: {
            max_size: '50gb'
          }
        }
      },
      warm: {
        actions: {
          allocate: {
            require: {},
            include: {
              test: '123'
            },
            exclude: {}
          }
        }
      },
      cold: {
        actions: {
          migrate: {
            enabled: false
          }
        }
      }
    },
    name: POLICY_NAME
  },
  name: POLICY_NAME
};
exports.POLICY_WITH_NODE_ATTR_AND_OFF_ALLOCATION = POLICY_WITH_NODE_ATTR_AND_OFF_ALLOCATION;
const POLICY_WITH_NODE_ROLE_ALLOCATION = {
  version: 1,
  modified_date: Date.now().toString(),
  policy: {
    phases: {
      hot: {
        min_age: '0ms',
        actions: {
          rollover: {
            max_size: '50gb'
          }
        }
      },
      warm: {
        min_age: '0ms',
        actions: {}
      }
    },
    name: POLICY_NAME
  },
  name: POLICY_NAME
};
exports.POLICY_WITH_NODE_ROLE_ALLOCATION = POLICY_WITH_NODE_ROLE_ALLOCATION;
const POLICY_WITH_KNOWN_AND_UNKNOWN_FIELDS = {
  version: 1,
  modified_date: Date.now().toString(),
  policy: {
    foo: 'bar',
    phases: {
      hot: {
        min_age: '0ms',
        actions: {
          rollover: {
            unknown_setting: 123,
            max_size: '50gb'
          }
        }
      },
      warm: {
        actions: {
          my_unfollow_action: {},
          set_priority: {
            priority: 22,
            unknown_setting: true
          }
        }
      },
      delete: {
        wait_for_snapshot: {
          policy: SNAPSHOT_POLICY_NAME
        },
        delete: {
          delete_searchable_snapshot: true
        }
      }
    },
    name: POLICY_NAME
  },
  name: POLICY_NAME
};
exports.POLICY_WITH_KNOWN_AND_UNKNOWN_FIELDS = POLICY_WITH_KNOWN_AND_UNKNOWN_FIELDS;

const getGeneratedPolicies = () => {
  const policy = {
    phases: {
      hot: {
        min_age: '0s',
        actions: {
          rollover: {
            max_size: '1gb'
          }
        }
      }
    }
  };
  const policies = [];

  for (let i = 0; i < 105; i++) {
    policies.push({
      version: i,
      modified_date: (0, _momentTimezone.default)().subtract(i, 'days').toISOString(),
      linkedIndices: i % 2 === 0 ? [`index${i}`] : undefined,
      name: `testy${i}`,
      policy: { ...policy,
        name: `testy${i}`
      }
    });
  }

  return policies;
};

exports.getGeneratedPolicies = getGeneratedPolicies;