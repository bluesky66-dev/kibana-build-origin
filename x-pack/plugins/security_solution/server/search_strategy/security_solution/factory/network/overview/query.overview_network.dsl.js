"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildOverviewNetworkQuery = void 0;

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildOverviewNetworkQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    track_total_hits: false,
    body: {
      aggregations: {
        unique_flow_count: {
          filter: {
            term: {
              type: 'flow'
            }
          }
        },
        unique_dns_count: {
          filter: {
            term: {
              type: 'dns'
            }
          }
        },
        unique_suricata_count: {
          filter: {
            term: {
              'service.type': 'suricata'
            }
          }
        },
        unique_zeek_count: {
          filter: {
            term: {
              'service.type': 'zeek'
            }
          }
        },
        unique_socket_count: {
          filter: {
            term: {
              'event.dataset': 'socket'
            }
          }
        },
        unique_filebeat_count: {
          filter: {
            term: {
              'agent.type': 'filebeat'
            }
          },
          aggs: {
            unique_netflow_count: {
              filter: {
                term: {
                  'input.type': 'netflow'
                }
              }
            },
            unique_panw_count: {
              filter: {
                term: {
                  'event.module': 'panw'
                }
              }
            },
            unique_cisco_count: {
              filter: {
                term: {
                  'event.module': 'cisco'
                }
              }
            }
          }
        },
        unique_packetbeat_count: {
          filter: {
            term: {
              'agent.type': 'packetbeat'
            }
          },
          aggs: {
            unique_tls_count: {
              filter: {
                term: {
                  'network.protocol': 'tls'
                }
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      size: 0
    }
  };
  return dslQuery;
};

exports.buildOverviewNetworkQuery = buildOverviewNetworkQuery;