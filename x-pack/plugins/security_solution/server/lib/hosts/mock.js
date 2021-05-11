"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockEndpointMetadata = exports.mockGetHostLastFirstSeenResult = exports.mockGetHostLastFirstSeenDsl = exports.mockGetHostLastFirstSeenResponse = exports.mockGetHostLastFirstSeenRequest = exports.mockGetHostLastFirstSeenOptions = exports.mockGetHostOverviewResult = exports.mockGetHostOverviewRequestDsl = exports.mockGetHostOverviewResponse = exports.mockGetHostOverviewRequest = exports.mockGetHostOverviewOptions = exports.mockGetHostsResult = exports.mockGetHostsQueryDsl = exports.mockGetHostsResponse = exports.mockGetHostsRequest = exports.mockGetHostsOptions = void 0;

var _constants = require("../../../common/constants");

var _types = require("../../graphql/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mockGetHostsOptions = {
  defaultIndex: _constants.DEFAULT_INDEX_PATTERN,
  sourceConfiguration: {
    fields: {
      container: 'docker.container.name',
      host: 'beat.hostname',
      message: ['message', '@message'],
      pod: 'kubernetes.pod.name',
      tiebreaker: '_doc',
      timestamp: '@timestamp'
    }
  },
  timerange: {
    interval: '12h',
    to: '2019-04-09T15:37:54.610Z',
    from: '2019-04-08T15:37:54.610Z'
  },
  sort: {
    field: _types.HostsFields.lastSeen,
    direction: _types.Direction.asc
  },
  pagination: {
    activePage: 0,
    cursorStart: 0,
    fakePossibleCount: 10,
    querySize: 2
  },
  filterQuery: {},
  fields: ['totalCount', '_id', 'host.id', 'host.name', 'host.os.name', 'host.os.version', 'edges.cursor.value', 'pageInfo.activePage', 'pageInfo.fakeTotalCount', 'pageInfo.showMorePagesIndicator']
};
exports.mockGetHostsOptions = mockGetHostsOptions;
const mockGetHostsRequest = {
  body: {
    operationName: 'GetHostsTableQuery',
    variables: {
      sourceId: 'default',
      timerange: {
        interval: '12h',
        from: 1554737729201,
        to: 1554824129202
      },
      pagination: {
        activePage: 0,
        cursorStart: 0,
        fakePossibleCount: 10,
        querySize: 2
      },
      sort: {
        field: _types.HostsFields.lastSeen,
        direction: _types.Direction.asc
      },
      filterQuery: ''
    },
    query: 'query GetHostsTableQuery($sourceId: ID!, $timerange: TimerangeInput!, $pagination: PaginationInput!, $sort: HostsSortField!, $filterQuery: String) {\n  source(id: $sourceId) {\n    id\n    Hosts(timerange: $timerange, pagination: $pagination, sort: $sort, filterQuery: $filterQuery) {\n      totalCount\n      edges {\n        node {\n          _id\n          host {\n            id\n            name\n            os {\n              name\n              version\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        cursor {\n          value\n          __typename\n        }\n        __typename\n      }\n      pageInfo {\n        endCursor {\n          value\n          __typename\n        }\n        hasNextPage\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n'
  }
};
exports.mockGetHostsRequest = mockGetHostsRequest;
const mockGetHostsResponse = {
  took: 1695,
  timed_out: false,
  _shards: {
    total: 59,
    successful: 59,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: {
      value: 4018586,
      relation: 'eq'
    },
    max_score: null,
    hits: []
  },
  aggregations: {
    host_data: {
      doc_count_error_upper_bound: -1,
      sum_other_doc_count: 3082125,
      buckets: [{
        key: 'beats-ci-immutable-centos-7-1554823376629262884',
        doc_count: 991,
        lastSeen: {
          value: 1554823916544,
          value_as_string: '2019-04-09T15:31:56.544Z'
        },
        host_os_version: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: '7 (Core)',
            doc_count: 991,
            timestamp: {
              value: 1554823916544,
              value_as_string: '2019-04-09T15:31:56.544Z'
            }
          }]
        },
        firstSeen: {
          value: 1554823396740,
          value_as_string: '2019-04-09T15:23:16.740Z'
        },
        host_os_name: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: 'CentOS Linux',
            doc_count: 991,
            timestamp: {
              value: 1554823916544,
              value_as_string: '2019-04-09T15:31:56.544Z'
            }
          }]
        },
        host_name: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: 'beats-ci-immutable-centos-7-1554823376629262884',
            doc_count: 991,
            timestamp: {
              value: 1554823916544,
              value_as_string: '2019-04-09T15:31:56.544Z'
            }
          }]
        },
        host_id: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: 'f85edea1973c34f862c376cac4ebc777',
            doc_count: 991,
            timestamp: {
              value: 1554823916544,
              value_as_string: '2019-04-09T15:31:56.544Z'
            }
          }]
        }
      }, {
        key: 'beats-ci-immutable-centos-7-1554823376629299914',
        doc_count: 571,
        lastSeen: {
          value: 1554823916302,
          value_as_string: '2019-04-09T15:31:56.302Z'
        },
        host_os_version: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: '7 (Core)',
            doc_count: 571,
            timestamp: {
              value: 1554823916302,
              value_as_string: '2019-04-09T15:31:56.302Z'
            }
          }]
        },
        firstSeen: {
          value: 1554823398628,
          value_as_string: '2019-04-09T15:23:18.628Z'
        },
        host_os_name: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: 'CentOS Linux',
            doc_count: 571,
            timestamp: {
              value: 1554823916302,
              value_as_string: '2019-04-09T15:31:56.302Z'
            }
          }]
        },
        host_name: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: 'beats-ci-immutable-centos-7-1554823376629299914',
            doc_count: 571,
            timestamp: {
              value: 1554823916302,
              value_as_string: '2019-04-09T15:31:56.302Z'
            }
          }]
        },
        host_id: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [{
            key: 'f85edea1973c34f862c376cac4ebc777',
            doc_count: 571,
            timestamp: {
              value: 1554823916302,
              value_as_string: '2019-04-09T15:31:56.302Z'
            }
          }]
        }
      }]
    },
    host_count: {
      value: 1627
    }
  }
};
exports.mockGetHostsResponse = mockGetHostsResponse;
const mockGetHostsQueryDsl = {
  mockGetHostsQueryDsl: 'mockGetHostsQueryDsl'
};
exports.mockGetHostsQueryDsl = mockGetHostsQueryDsl;
const mockGetHostsResult = {
  inspect: {
    dsl: [JSON.stringify(mockGetHostsQueryDsl, null, 2)],
    response: [JSON.stringify(mockGetHostsResponse, null, 2)]
  },
  edges: [{
    node: {
      _id: 'beats-ci-immutable-centos-7-1554823376629262884',
      host: {
        id: 'f85edea1973c34f862c376cac4ebc777',
        name: 'beats-ci-immutable-centos-7-1554823376629262884',
        os: {
          name: 'CentOS Linux',
          version: '7 (Core)'
        }
      }
    },
    cursor: {
      value: 'beats-ci-immutable-centos-7-1554823376629262884',
      tiebreaker: null
    }
  }, {
    node: {
      _id: 'beats-ci-immutable-centos-7-1554823376629299914',
      host: {
        id: 'f85edea1973c34f862c376cac4ebc777',
        name: 'beats-ci-immutable-centos-7-1554823376629299914',
        os: {
          name: 'CentOS Linux',
          version: '7 (Core)'
        }
      }
    },
    cursor: {
      value: 'beats-ci-immutable-centos-7-1554823376629299914',
      tiebreaker: null
    }
  }],
  totalCount: 1627,
  pageInfo: {
    activePage: 0,
    fakeTotalCount: 10,
    showMorePagesIndicator: true
  }
};
exports.mockGetHostsResult = mockGetHostsResult;
const mockGetHostOverviewOptions = {
  sourceConfiguration: {
    fields: {
      container: 'docker.container.name',
      host: 'beat.hostname',
      message: ['message', '@message'],
      pod: 'kubernetes.pod.name',
      tiebreaker: '_doc',
      timestamp: '@timestamp'
    }
  },
  timerange: {
    interval: '12h',
    to: '2019-04-09T15:37:54.610Z',
    from: '2019-04-08T15:37:54.610Z'
  },
  defaultIndex: _constants.DEFAULT_INDEX_PATTERN,
  fields: ['_id', 'agent.id', 'host.architecture', 'host.id', 'host.ip', 'host.mac', 'host.name', 'host.os.family', 'host.os.name', 'host.os.platform', 'host.os.version', 'host.os.__typename', 'host.type', 'host.__typename', 'cloud.instance.id', 'cloud.instance.__typename', 'cloud.machine.type', 'cloud.machine.__typename', 'cloud.provider', 'cloud.region', 'cloud.__typename', '__typename'],
  hostName: 'siem-es'
};
exports.mockGetHostOverviewOptions = mockGetHostOverviewOptions;
const mockGetHostOverviewRequest = {
  body: {
    operationName: 'GetHostOverviewQuery',
    variables: {
      sourceId: 'default',
      hostName: 'siem-es'
    },
    query: 'query GetHostOverviewQuery($sourceId: ID!, $hostName: String!, $timerange: TimerangeInput!) {\n  source(id: $sourceId) {\n    id\n    HostOverview(hostName: $hostName, timerange: $timerange) {\n      _id\n      agent {\n        id\n      }\n      host {\n        architecture\n        id\n        ip\n        mac\n        name\n        os {\n          family\n          name\n          platform\n          version\n          __typename\n        }\n        type\n        __typename\n      }\n      cloud {\n        instance {\n          id\n          __typename\n        }\n        machine {\n          type\n          __typename\n        }\n        provider\n        region\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n'
  }
};
exports.mockGetHostOverviewRequest = mockGetHostOverviewRequest;
const mockGetHostOverviewResponse = {
  took: 2205,
  timed_out: false,
  _shards: {
    total: 59,
    successful: 59,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: {
      value: 611894,
      relation: 'eq'
    },
    max_score: null,
    hits: []
  },
  aggregations: {
    host_mac: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: []
    },
    host_ip: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: []
    },
    cloud_region: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'us-east-1',
        doc_count: 4308,
        timestamp: {
          value: 1556903543093,
          value_as_string: '2019-05-03T17:12:23.093Z'
        }
      }]
    },
    cloud_provider: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'gce',
        doc_count: 432808,
        timestamp: {
          value: 1556903543093,
          value_as_string: '2019-05-03T17:12:23.093Z'
        }
      }]
    },
    cloud_instance_id: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: '5412578377715150143',
        doc_count: 432808,
        timestamp: {
          value: 1556903543093,
          value_as_string: '2019-05-03T17:12:23.093Z'
        }
      }]
    },
    cloud_machine_type: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'n1-standard-1',
        doc_count: 432808,
        timestamp: {
          value: 1556903543093,
          value_as_string: '2019-05-03T17:12:23.093Z'
        }
      }]
    },
    host_os_version: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: '9 (stretch)',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    },
    host_architecture: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'x86_64',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    },
    host_os_platform: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'debian',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    },
    host_os_name: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'Debian GNU/Linux',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    },
    host_os_family: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'debian',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    },
    host_name: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'siem-es',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    },
    host_id: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: 'b6d5264e4b9c8880ad1053841067a4a6',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    },
    agent_id: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [{
        key: '9f48a9ab-749a-4ff0-b4e2-7e53910a985',
        doc_count: 611894,
        timestamp: {
          value: 1554826117972,
          value_as_string: '2019-04-09T16:08:37.972Z'
        }
      }]
    }
  }
};
exports.mockGetHostOverviewResponse = mockGetHostOverviewResponse;
const mockGetHostOverviewRequestDsl = {
  mockGetHostOverviewRequestDsl: 'mockGetHostOverviewRequestDsl'
};
exports.mockGetHostOverviewRequestDsl = mockGetHostOverviewRequestDsl;
const mockGetHostOverviewResult = {
  inspect: {
    dsl: [JSON.stringify(mockGetHostOverviewRequestDsl, null, 2)],
    response: [JSON.stringify(mockGetHostOverviewResponse, null, 2)]
  },
  _id: 'siem-es',
  agent: {
    id: '9f48a9ab-749a-4ff0-b4e2-7e53910a985'
  },
  host: {
    architecture: 'x86_64',
    id: 'b6d5264e4b9c8880ad1053841067a4a6',
    ip: [],
    mac: [],
    name: 'siem-es',
    os: {
      family: 'debian',
      name: 'Debian GNU/Linux',
      platform: 'debian',
      version: '9 (stretch)'
    }
  },
  cloud: {
    instance: {
      id: ['5412578377715150143']
    },
    machine: {
      type: ['n1-standard-1']
    },
    provider: ['gce'],
    region: ['us-east-1']
  },
  endpoint: {
    endpointPolicy: 'demo',
    policyStatus: 'success',
    sensorVersion: '7.9.0-SNAPSHOT'
  }
};
exports.mockGetHostOverviewResult = mockGetHostOverviewResult;
const mockGetHostLastFirstSeenOptions = {
  defaultIndex: _constants.DEFAULT_INDEX_PATTERN,
  sourceConfiguration: {
    fields: {
      container: 'docker.container.name',
      host: 'beat.hostname',
      message: ['message', '@message'],
      pod: 'kubernetes.pod.name',
      tiebreaker: '_doc',
      timestamp: '@timestamp'
    }
  },
  hostName: 'siem-es'
};
exports.mockGetHostLastFirstSeenOptions = mockGetHostLastFirstSeenOptions;
const mockGetHostLastFirstSeenRequest = {
  body: {
    operationName: 'GetHostLastFirstSeenQuery',
    variables: {
      sourceId: 'default',
      hostName: 'siem-es'
    },
    query: 'query GetHostLastFirstSeenQuery($sourceId: ID!, $hostName: String!) {\n  source(id: $sourceId) {\n    id\n    HostLastFirstSeen(hostName: $hostName) {\n      firstSeen\n      lastSeen\n      __typename\n    }\n    __typename\n  }\n}\n'
  }
};
exports.mockGetHostLastFirstSeenRequest = mockGetHostLastFirstSeenRequest;
const mockGetHostLastFirstSeenResponse = {
  took: 60,
  timed_out: false,
  _shards: {
    total: 59,
    successful: 59,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: {
      value: 612092,
      relation: 'eq'
    },
    max_score: null,
    hits: []
  },
  aggregations: {
    lastSeen: {
      value: 1554826692178,
      value_as_string: '2019-04-09T16:18:12.178Z'
    },
    firstSeen: {
      value: 1550806892826,
      value_as_string: '2019-02-22T03:41:32.826Z'
    }
  }
};
exports.mockGetHostLastFirstSeenResponse = mockGetHostLastFirstSeenResponse;
const mockGetHostLastFirstSeenDsl = {
  mockGetHostLastFirstSeenDsl: 'mockGetHostLastFirstSeenDsl'
};
exports.mockGetHostLastFirstSeenDsl = mockGetHostLastFirstSeenDsl;
const mockGetHostLastFirstSeenResult = {
  inspect: {
    dsl: [JSON.stringify(mockGetHostLastFirstSeenDsl, null, 2)],
    response: [JSON.stringify(mockGetHostLastFirstSeenResponse, null, 2)]
  },
  firstSeen: '2019-02-22T03:41:32.826Z',
  lastSeen: '2019-04-09T16:18:12.178Z'
};
exports.mockGetHostLastFirstSeenResult = mockGetHostLastFirstSeenResult;
const mockEndpointMetadata = {
  metadata: {
    '@timestamp': '2020-07-13T01:08:37.68896700Z',
    Endpoint: {
      policy: {
        applied: {
          id: '3de86380-aa5a-11ea-b969-0bee1b260ab8',
          name: 'demo',
          status: 'success'
        }
      },
      status: 'enrolled'
    },
    agent: {
      build: {
        original: 'version: 7.9.0-SNAPSHOT, compiled: Thu Jul 09 07:56:12 2020, branch: 7.x, commit: 713a1071de475f15b3a1f0944d3602ed532597a5'
      },
      id: 'c29e0de1-7476-480b-b242-38f0394bf6a1',
      type: 'endpoint',
      version: '7.9.0-SNAPSHOT'
    },
    data_stream: {
      dataset: 'endpoint.metadata',
      namespace: 'default',
      type: 'metrics'
    },
    ecs: {
      version: '1.5.0'
    },
    elastic: {
      agent: {
        id: ''
      }
    },
    event: {
      action: 'endpoint_metadata',
      category: ['host'],
      created: '2020-07-13T01:08:37.68896700Z',
      dataset: 'endpoint.metadata',
      id: 'Lkio+AHbZGSPFb7q++++++2E',
      kind: 'metric',
      module: 'endpoint',
      sequence: 146,
      type: ['info']
    },
    host: {
      architecture: 'x86_64',
      hostname: 'DESKTOP-4I1B23J',
      id: 'a4148b63-1758-ab1f-a6d3-f95075cb1a9c',
      ip: ['172.16.166.129', 'fe80::c07e:eee9:3e8d:ea6d', '169.254.205.96', 'fe80::1027:b13d:a4a7:cd60', '127.0.0.1', '::1'],
      mac: ['00:0c:29:89:ff:73', '3c:22:fb:3c:93:4c'],
      name: 'DESKTOP-4I1B23J',
      os: {
        Ext: {
          variant: 'Windows 10 Pro'
        },
        family: 'windows',
        full: 'Windows 10 Pro 2004 (10.0.19041.329)',
        kernel: '2004 (10.0.19041.329)',
        name: 'Windows',
        platform: 'windows',
        version: '2004 (10.0.19041.329)'
      }
    },
    message: 'Endpoint metadata'
  },
  host_status: 'error'
};
exports.mockEndpointMetadata = mockEndpointMetadata;