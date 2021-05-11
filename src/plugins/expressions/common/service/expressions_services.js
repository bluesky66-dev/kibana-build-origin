"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsService = void 0;

var _executor2 = require("../executor");

var _expression_renderers = require("../expression_renderers");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * `ExpressionsService` class is used for multiple purposes:
 *
 * 1. It implements the same Expressions service that can be used on both:
 *    (1) server-side and (2) browser-side.
 * 2. It implements the same Expressions service that users can fork/clone,
 *    thus have their own instance of the Expressions plugin.
 * 3. `ExpressionsService` defines the public contracts of *setup* and *start*
 *    Kibana Platform life-cycles for ease-of-use on server-side and browser-side.
 * 4. `ExpressionsService` creates a bound version of all exported contract functions.
 * 5. Functions are bound the way there are:
 *
 *    ```ts
 *    registerFunction = (...args: Parameters<Executor['registerFunction']>
 *      ): ReturnType<Executor['registerFunction']> => this.executor.registerFunction(...args);
 *    ```
 *
 *    so that JSDoc appears in developers IDE when they use those `plugins.expressions.registerFunction(`.
 */
class ExpressionsService {
  constructor({
    executor: _executor = _executor2.Executor.createWithDefaults(),
    renderers: _renderers = new _expression_renderers.ExpressionRendererRegistry()
  } = {}) {
    _defineProperty(this, "executor", void 0);

    _defineProperty(this, "renderers", void 0);

    _defineProperty(this, "registerFunction", functionDefinition => this.executor.registerFunction(functionDefinition));

    _defineProperty(this, "registerType", typeDefinition => this.executor.registerType(typeDefinition));

    _defineProperty(this, "registerRenderer", definition => this.renderers.register(definition));

    _defineProperty(this, "run", (ast, input, params) => this.executor.run(ast, input, params));

    _defineProperty(this, "getFunction", name => this.executor.getFunction(name));

    _defineProperty(this, "getFunctions", () => this.executor.getFunctions());

    _defineProperty(this, "getRenderer", name => this.renderers.get(name));

    _defineProperty(this, "getRenderers", () => this.renderers.toJS());

    _defineProperty(this, "getType", name => this.executor.getType(name));

    _defineProperty(this, "getTypes", () => this.executor.getTypes());

    _defineProperty(this, "execute", (ast, input, params) => {
      const execution = this.executor.createExecution(ast, params);
      execution.start(input);
      return execution.contract;
    });

    _defineProperty(this, "fork", () => {
      const executor = this.executor.fork();
      const renderers = this.renderers;
      const fork = new ExpressionsService({
        executor,
        renderers
      });
      return fork;
    });

    _defineProperty(this, "telemetry", (state, telemetryData = {}) => {
      return this.executor.telemetry(state, telemetryData);
    });

    _defineProperty(this, "extract", state => {
      return this.executor.extract(state);
    });

    _defineProperty(this, "inject", (state, references) => {
      return this.executor.inject(state, references);
    });

    _defineProperty(this, "migrate", (state, version) => {
      return this.executor.migrate(state, version);
    });

    this.executor = _executor;
    this.renderers = _renderers;
  }
  /**
   * Register an expression function, which will be possible to execute as
   * part of the expression pipeline.
   *
   * Below we register a function which simply sleeps for given number of
   * milliseconds to delay the execution and outputs its input as-is.
   *
   * ```ts
   * expressions.registerFunction({
   *   name: 'sleep',
   *   args: {
   *     time: {
   *       aliases: ['_'],
   *       help: 'Time in milliseconds for how long to sleep',
   *       types: ['number'],
   *     },
   *   },
   *   help: '',
   *   fn: async (input, args, context) => {
   *     await new Promise(r => setTimeout(r, args.time));
   *     return input;
   *   },
   * }
   * ```
   *
   * The actual function is defined in the `fn` key. The function can be *async*.
   * It receives three arguments: (1) `input` is the output of the previous function
   * or the initial input of the expression if the function is first in chain;
   * (2) `args` are function arguments as defined in expression string, that can
   * be edited by user (e.g in case of Canvas); (3) `context` is a shared object
   * passed to all functions that can be used for side-effects.
   */


  /**
   * Returns Kibana Platform *setup* life-cycle contract. Useful to return the
   * same contract on server-side and browser-side.
   */
  setup() {
    return this;
  }
  /**
   * Returns Kibana Platform *start* life-cycle contract. Useful to return the
   * same contract on server-side and browser-side.
   */


  start() {
    return this;
  }

  stop() {}

}

exports.ExpressionsService = ExpressionsService;