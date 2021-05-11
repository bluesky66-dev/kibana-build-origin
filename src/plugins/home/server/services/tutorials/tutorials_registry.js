"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TutorialsRegistry = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _tutorial_schema = require("./lib/tutorial_schema");

var _register = require("../../tutorials/register");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TutorialsRegistry {
  constructor() {
    _defineProperty(this, "tutorialProviders", []);

    _defineProperty(this, "scopedTutorialContextFactories", []);
  }

  setup(core) {
    const router = core.http.createRouter();
    router.get({
      path: '/api/kibana/home/tutorials',
      validate: false
    }, async (context, req, res) => {
      const initialContext = {};
      const scopedContext = this.scopedTutorialContextFactories.reduce((accumulatedContext, contextFactory) => {
        return { ...accumulatedContext,
          ...contextFactory(req)
        };
      }, initialContext);
      return res.ok({
        body: this.tutorialProviders.map(tutorialProvider => {
          return tutorialProvider(scopedContext); // All the tutorialProviders need to be refactored so that they don't need the server.
        })
      });
    });
    return {
      registerTutorial: specProvider => {
        const emptyContext = {};

        const {
          error
        } = _joi.default.validate(specProvider(emptyContext), _tutorial_schema.tutorialSchema);

        if (error) {
          throw new Error(`Unable to register tutorial spec because its invalid. ${error}`);
        }

        this.tutorialProviders.push(specProvider);
      },
      unregisterTutorial: specProvider => {
        this.tutorialProviders = this.tutorialProviders.filter(provider => provider !== specProvider);
      },
      addScopedTutorialContextFactory: scopedTutorialContextFactory => {
        if (typeof scopedTutorialContextFactory !== 'function') {
          throw new Error(`Unable to add scoped(request) context factory because you did not provide a function`);
        }

        this.scopedTutorialContextFactories.push(scopedTutorialContextFactory);
      }
    };
  }

  start() {
    // pre-populate with built in tutorials
    this.tutorialProviders.push(..._register.builtInTutorials);
    return {};
  }

}
/** @public */


exports.TutorialsRegistry = TutorialsRegistry;