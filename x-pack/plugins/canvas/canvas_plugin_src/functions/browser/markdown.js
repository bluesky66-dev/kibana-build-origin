"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdown = markdown;

var _i18n = require("../../../i18n");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function markdown() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().markdown;
  return {
    name: 'markdown',
    aliases: [],
    type: 'render',
    help,
    inputTypes: ['datatable', 'null'],
    args: {
      content: {
        aliases: ['_', 'expression'],
        types: ['string'],
        help: argHelp.content,
        default: '""',
        multi: true
      },
      font: {
        types: ['style'],
        help: argHelp.font,
        default: '{font}'
      },
      openLinksInNewTab: {
        types: ['boolean'],
        help: argHelp.openLinksInNewTab,
        default: false
      }
    },
    fn: async (input, args) => {
      // @ts-expect-error untyped local
      const {
        Handlebars
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('../../../common/lib/handlebars')));
      const compileFunctions = args.content.map(str => Handlebars.compile(String(str), {
        knownHelpersOnly: true
      }));
      const ctx = {
        columns: [],
        rows: [],
        type: null,
        ...input
      };
      return {
        type: 'render',
        as: 'markdown',
        value: {
          content: compileFunctions.map(fn => fn(ctx)).join(''),
          font: args.font,
          openLinksInNewTab: args.openLinksInNewTab
        }
      };
    }
  };
}