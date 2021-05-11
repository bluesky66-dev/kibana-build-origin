"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.summarizeWorkpads = summarizeWorkpads;
exports.workpadCollector = exports.workpadSchema = void 0;

var _lodash = require("lodash");

var _constants = require("../../common/lib/constants");

var _collector_helpers = require("./collector_helpers");

var _common = require("../../../../../src/plugins/expressions/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const workpadSchema = {
  workpads: {
    total: {
      type: 'long'
    }
  },
  pages: {
    total: {
      type: 'long'
    },
    per_workpad: {
      avg: {
        type: 'float'
      },
      min: {
        type: 'long'
      },
      max: {
        type: 'long'
      }
    }
  },
  elements: {
    total: {
      type: 'long'
    },
    per_page: {
      avg: {
        type: 'float'
      },
      min: {
        type: 'long'
      },
      max: {
        type: 'long'
      }
    }
  },
  functions: {
    total: {
      type: 'long'
    },
    in_use: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    },
    per_element: {
      avg: {
        type: 'float'
      },
      min: {
        type: 'long'
      },
      max: {
        type: 'long'
      }
    }
  },
  variables: {
    total: {
      type: 'long'
    },
    per_workpad: {
      avg: {
        type: 'float'
      },
      min: {
        type: 'long'
      },
      max: {
        type: 'long'
      }
    }
  }
};
/**
  Gather statistic about the given workpads
  @param workpadDocs a collection of workpad documents
  @returns Workpad Telemetry Data
*/

exports.workpadSchema = workpadSchema;

function summarizeWorkpads(workpadDocs) {
  const functionSet = new Set();

  if (workpadDocs.length === 0) {
    return {};
  } // make a summary of info about each workpad


  const workpadsInfo = workpadDocs.map(workpad => {
    let pages = {
      count: 0
    };

    try {
      pages = {
        count: workpad.pages.length
      };
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err, workpad);
    }

    const elementCounts = workpad.pages.reduce((accum, page) => accum.concat(page.elements.length), []);
    const functionCounts = workpad.pages.reduce((accum, page) => {
      return page.elements.map(element => {
        const ast = (0, _common.parseExpression)(element.expression);
        (0, _collector_helpers.collectFns)(ast, cFunction => {
          functionSet.add(cFunction);
        });
        return ast.chain.length; // get the number of parts in the expression
      });
    }, []);
    const variableCount = workpad.variables && workpad.variables.length ? workpad.variables.length : 0;
    return {
      pages,
      elementCounts,
      functionCounts,
      variableCount
    };
  }); // combine together info from across the workpads

  const combinedWorkpadsInfo = workpadsInfo.reduce((accum, pageInfo) => {
    const {
      pages,
      elementCounts,
      functionCounts,
      variableCount
    } = pageInfo;
    return {
      pageMin: pages.count < accum.pageMin ? pages.count : accum.pageMin,
      pageMax: pages.count > accum.pageMax ? pages.count : accum.pageMax,
      pageCounts: accum.pageCounts.concat(pages.count),
      elementCounts: accum.elementCounts.concat(elementCounts),
      functionCounts: accum.functionCounts.concat(functionCounts),
      variableCounts: accum.variableCounts.concat([variableCount])
    };
  }, {
    pageMin: Infinity,
    pageMax: -Infinity,
    pageCounts: [],
    elementCounts: [],
    functionCounts: [],
    variableCounts: []
  });
  const {
    pageCounts,
    pageMin,
    pageMax,
    elementCounts,
    functionCounts,
    variableCounts
  } = combinedWorkpadsInfo;
  const pageTotal = (0, _lodash.sum)(pageCounts);
  const elementsTotal = (0, _lodash.sum)(elementCounts);
  const functionsTotal = (0, _lodash.sum)(functionCounts);
  const variableTotal = (0, _lodash.sum)(variableCounts);
  const pagesInfo = workpadsInfo.length > 0 ? {
    total: pageTotal,
    per_workpad: {
      avg: pageTotal / pageCounts.length,
      min: pageMin,
      max: pageMax
    }
  } : undefined;
  const elementsInfo = pageTotal > 0 ? {
    total: elementsTotal,
    per_page: {
      avg: elementsTotal / elementCounts.length,
      min: (0, _lodash.min)(elementCounts) || 0,
      max: (0, _lodash.max)(elementCounts) || 0
    }
  } : undefined;
  const functionsInfo = elementsTotal > 0 ? {
    total: functionsTotal,
    in_use: Array.from(functionSet),
    per_element: {
      avg: functionsTotal / functionCounts.length,
      min: (0, _lodash.min)(functionCounts) || 0,
      max: (0, _lodash.max)(functionCounts) || 0
    }
  } : undefined;
  const variableInfo = {
    total: variableTotal,
    per_workpad: {
      avg: variableTotal / variableCounts.length,
      min: (0, _lodash.min)(variableCounts) || 0,
      max: (0, _lodash.max)(variableCounts) || 0
    }
  };
  return {
    workpads: {
      total: workpadsInfo.length
    },
    pages: pagesInfo,
    elements: elementsInfo,
    functions: functionsInfo,
    variables: variableInfo
  };
}

const workpadCollector = async function (kibanaIndex, esClient) {
  const searchParams = {
    size: 10000,
    // elasticsearch index.max_result_window default value
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.canvas-workpad', '-hits.hits._source.canvas-workpad.assets'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: _constants.CANVAS_TYPE
            }
          }
        }
      }
    }
  };
  const {
    body: esResponse
  } = await esClient.search(searchParams);

  if ((0, _lodash.get)(esResponse, 'hits.hits.length') > 0) {
    const workpads = esResponse.hits.hits.map(hit => hit._source[_constants.CANVAS_TYPE]);
    return summarizeWorkpads(workpads);
  }

  return {};
};

exports.workpadCollector = workpadCollector;