"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workpadWithGroupAsElement = exports.elements = exports.workpads = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BaseWorkpad = {
  '@created': '2019-02-08T18:35:23.029Z',
  '@timestamp': '2019-02-08T18:35:23.029Z',
  assets: {
    'asset-ada763f1-295e-4188-8e08-b5bed9e006a1': {
      id: 'asset-ada763f1-295e-4188-8e08-b5bed9e006a1',
      '@created': '2018-01-17T19:13:09.185Z',
      type: 'dataurl',
      value: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4='
    }
  },
  name: 'base workpad',
  id: 'base-workpad',
  width: 0,
  height: 0,
  css: '',
  page: 1,
  pages: [],
  colors: [],
  isWriteable: true,
  variables: []
};
const BasePage = {
  id: 'base-page',
  style: {
    background: 'white'
  },
  transition: {},
  elements: [],
  groups: []
};
const BaseElement = {
  position: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    angle: 0,
    parent: null
  },
  id: 'base-id',
  type: 'element',
  expression: 'render',
  filter: ''
};
const BaseVariable = {
  name: 'my-var',
  value: 'Hello World',
  type: 'string'
};
const workpads = [{ ...BaseWorkpad,
  pages: [{ ...BasePage,
    elements: [{ ...BaseElement,
      expression: `
            demodata |
            ply by=age fn={rowCount | as count} |
            staticColumn total value={math 'sum(count)'} |
            mapColumn percentage fn={math 'count/total * 100'} |
            sort age |
            pointseries x=age y=percentage |
            plot defaultStyle={seriesStyle points=0 lines=5}`
    }]
  }],
  variables: [{ ...BaseVariable
  }]
}, { ...BaseWorkpad,
  pages: [{ ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'filters | demodata | markdown "hello" | render'
    }]
  }],
  variables: [{ ...BaseVariable
  }]
}, { ...BaseWorkpad,
  pages: [{ ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'demodata | pointseries | getCell | repeatImage | render'
    }, { ...BaseElement,
      expression: 'demodata | pointseries | getCell | repeatImage | render'
    }, { ...BaseElement,
      expression: 'demodata | pointseries | getCell | repeatImage | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | markdown "hello" | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | pointseries | pie | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'filters | demodata | table | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'image | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'image | render'
    }]
  }],
  variables: [{ ...BaseVariable
  }]
}, { ...BaseWorkpad,
  pages: [{ ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'filters | demodata | markdown "hello" | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | markdown "hello" | render'
    }, { ...BaseElement,
      expression: 'image | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'demodata | pointseries | getCell | repeatImage | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | markdown "hello" | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | pointseries | pie | render'
    }, { ...BaseElement,
      expression: 'image | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'filters | demodata | pointseries | pie | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | pointseries | plot defaultStyle={seriesStyle points=0 lines=5} | render'
    }]
  }],
  variables: [{ ...BaseVariable
  }]
}, { ...BaseWorkpad,
  pages: [{ ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'demodata | render as=debug'
    }, { ...BaseElement,
      expression: 'filters | demodata | pointseries | plot | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | table | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | table | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'demodata | pointseries | getCell | repeatImage | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | pointseries | pie | render'
    }, { ...BaseElement,
      expression: 'image | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'demodata | pointseries | getCell | repeatImage | render'
    }, { ...BaseElement,
      expression: 'demodata | render as=debug'
    }, { ...BaseElement,
      expression: 'shape "square" | render'
    }]
  }],
  variables: [{ ...BaseVariable
  }, { ...BaseVariable
  }, { ...BaseVariable
  }]
}, { ...BaseWorkpad,
  pages: [{ ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'demodata | pointseries | getCell | repeatImage | render'
    }, { ...BaseElement,
      expression: 'filters | demodata | markdown "hello" | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'image | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'image | render'
    }]
  }, { ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'filters | demodata | table | render'
    }]
  }]
}];
exports.workpads = workpads;
const elements = [{ ...BaseElement,
  expression: 'demodata | pointseries | getCell | repeatImage | render'
}, { ...BaseElement,
  expression: 'filters | demodata | markdown "hello" | render'
}, { ...BaseElement,
  expression: 'filters | demodata | pointseries | pie | render'
}, { ...BaseElement,
  expression: 'image | render'
}];
exports.elements = elements;
const workpadWithGroupAsElement = { ...BaseWorkpad,
  pages: [{ ...BasePage,
    elements: [{ ...BaseElement,
      expression: 'image | render'
    }, { ...BaseElement,
      id: 'group-1234'
    }]
  }]
};
exports.workpadWithGroupAsElement = workpadWithGroupAsElement;