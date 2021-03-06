"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicCompositePreviewResponse = exports.repeatingMetricPreviewResponse = exports.alternateMetricPreviewResponse = exports.basicMetricPreviewResponse = exports.changedSourceIdResponse = exports.compositeEndResponse = exports.alternateCompositeResponse = exports.basicCompositeResponse = exports.emptyRateResponse = exports.emptyMetricResponse = exports.alternateMetricResponse = exports.basicMetricResponse = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bucketsA = [{
  doc_count: 2,
  aggregatedValue: {
    value: 0.5,
    values: [{
      key: 95.0,
      value: 0.5
    }]
  }
}, {
  doc_count: 3,
  aggregatedValue: {
    value: 1.0,
    values: [{
      key: 95.0,
      value: 1.0
    }]
  },
  key_as_string: new Date(1577858400000).toISOString()
}];
const bucketsB = [{
  doc_count: 4,
  aggregatedValue: {
    value: 2.5,
    values: [{
      key: 99.0,
      value: 2.5
    }]
  }
}, {
  doc_count: 5,
  aggregatedValue: {
    value: 3.5,
    values: [{
      key: 99.0,
      value: 3.5
    }]
  }
}];
const bucketsC = [{
  doc_count: 2,
  aggregatedValue: {
    value: 0.5
  }
}, {
  doc_count: 3,
  aggregatedValue: {
    value: 16.0
  }
}];
const previewBucketsA = Array.from(Array(60), (_, i) => bucketsA[i % 2]); // Repeat bucketsA to a total length of 60

const previewBucketsB = Array.from(Array(60), (_, i) => bucketsB[i % 2]);
const previewBucketsWithNulls = [...Array.from(Array(10), (_, i) => ({
  aggregatedValue: {
    value: null
  }
})), ...previewBucketsA.slice(10)];
const previewBucketsRepeat = Array.from(Array(60), (_, i) => bucketsA[Math.max(0, i % 3 - 1)]);
const basicMetricResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: bucketsA
    }
  }
};
exports.basicMetricResponse = basicMetricResponse;
const alternateMetricResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: bucketsB
    }
  }
};
exports.alternateMetricResponse = alternateMetricResponse;
const emptyMetricResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: []
    }
  }
};
exports.emptyMetricResponse = emptyMetricResponse;
const emptyRateResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: [{
        doc_count: 2,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        aggregatedValue_max: {
          value: null
        }
      }]
    }
  }
};
exports.emptyRateResponse = emptyRateResponse;
const basicCompositeResponse = {
  aggregations: {
    groupings: {
      after_key: {
        groupBy0: 'foo'
      },
      buckets: [{
        key: {
          groupBy0: 'a'
        },
        aggregatedIntervals: {
          buckets: bucketsA
        }
      }, {
        key: {
          groupBy0: 'b'
        },
        aggregatedIntervals: {
          buckets: bucketsB
        }
      }]
    }
  },
  hits: {
    total: {
      value: 2
    }
  }
};
exports.basicCompositeResponse = basicCompositeResponse;
const alternateCompositeResponse = {
  aggregations: {
    groupings: {
      after_key: {
        groupBy0: 'foo'
      },
      buckets: [{
        key: {
          groupBy0: 'a'
        },
        aggregatedIntervals: {
          buckets: bucketsB
        }
      }, {
        key: {
          groupBy0: 'b'
        },
        aggregatedIntervals: {
          buckets: bucketsA
        }
      }]
    }
  },
  hits: {
    total: {
      value: 2
    }
  }
};
exports.alternateCompositeResponse = alternateCompositeResponse;
const compositeEndResponse = {
  aggregations: {},
  hits: {
    total: {
      value: 0
    }
  }
};
exports.compositeEndResponse = compositeEndResponse;
const changedSourceIdResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: bucketsC
    }
  }
};
exports.changedSourceIdResponse = changedSourceIdResponse;
const basicMetricPreviewResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: previewBucketsA
    }
  }
};
exports.basicMetricPreviewResponse = basicMetricPreviewResponse;
const alternateMetricPreviewResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: previewBucketsWithNulls
    }
  }
};
exports.alternateMetricPreviewResponse = alternateMetricPreviewResponse;
const repeatingMetricPreviewResponse = {
  aggregations: {
    aggregatedIntervals: {
      buckets: previewBucketsRepeat
    }
  }
};
exports.repeatingMetricPreviewResponse = repeatingMetricPreviewResponse;
const basicCompositePreviewResponse = {
  aggregations: {
    groupings: {
      after_key: {
        groupBy0: 'foo'
      },
      buckets: [{
        key: {
          groupBy0: 'a'
        },
        aggregatedIntervals: {
          buckets: previewBucketsA
        }
      }, {
        key: {
          groupBy0: 'b'
        },
        aggregatedIntervals: {
          buckets: previewBucketsB
        }
      }]
    }
  },
  hits: {
    total: {
      value: 2
    }
  }
};
exports.basicCompositePreviewResponse = basicCompositePreviewResponse;