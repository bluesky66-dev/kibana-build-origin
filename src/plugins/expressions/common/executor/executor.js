"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Executor = exports.FunctionsRegistry = exports.TypesRegistry = void 0;

var _lodash = require("lodash");

var _container = require("./container");

var _expression_functions = require("../expression_functions");

var _execution = require("../execution/execution");

var _expression_type = require("../expression_types/expression_type");

var _specs = require("../expression_types/specs");

var _specs2 = require("../expression_functions/specs");

var _util = require("../util");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TypesRegistry {
  constructor(executor) {
    this.executor = executor;
  }

  register(typeDefinition) {
    this.executor.registerType(typeDefinition);
  }

  get(id) {
    return this.executor.state.selectors.getType(id);
  }

  toJS() {
    return this.executor.getTypes();
  }

  toArray() {
    return Object.values(this.toJS());
  }

}

exports.TypesRegistry = TypesRegistry;

class FunctionsRegistry {
  constructor(executor) {
    this.executor = executor;
  }

  register(functionDefinition) {
    this.executor.registerFunction(functionDefinition);
  }

  get(id) {
    return this.executor.state.selectors.getFunction(id);
  }

  toJS() {
    return this.executor.getFunctions();
  }

  toArray() {
    return Object.values(this.toJS());
  }

}

exports.FunctionsRegistry = FunctionsRegistry;

class Executor {
  static createWithDefaults(state) {
    const executor = new Executor(state);

    for (const type of _specs.typeSpecs) executor.registerType(type);

    for (const func of _specs2.functionSpecs) executor.registerFunction(func);

    return executor;
  }

  constructor(state) {
    _defineProperty(this, "state", void 0);

    _defineProperty(this, "functions", void 0);

    _defineProperty(this, "types", void 0);

    this.state = (0, _container.createExecutorContainer)(state);
    this.functions = new FunctionsRegistry(this);
    this.types = new TypesRegistry(this);
  }

  registerFunction(functionDefinition) {
    const fn = new _expression_functions.ExpressionFunction(typeof functionDefinition === 'object' ? functionDefinition : functionDefinition());
    this.state.transitions.addFunction(fn);
  }

  getFunction(name) {
    return this.state.get().functions[name];
  }

  getFunctions() {
    return { ...this.state.get().functions
    };
  }

  registerType(typeDefinition) {
    const type = new _expression_type.ExpressionType(typeof typeDefinition === 'object' ? typeDefinition : typeDefinition());
    this.state.transitions.addType(type);
  }

  getType(name) {
    return this.state.get().types[name];
  }

  getTypes() {
    return { ...this.state.get().types
    };
  }

  extendContext(extraContext) {
    this.state.transitions.extendContext(extraContext);
  }

  get context() {
    return this.state.selectors.getContext();
  }
  /**
   * Execute expression and return result.
   *
   * @param ast Expression AST or a string representing expression.
   * @param input Initial input to the first expression function.
   * @param context Extra global context object that will be merged into the
   *    expression global context object that is provided to each function to allow side-effects.
   */


  async run(ast, input, params = {}) {
    const execution = this.createExecution(ast, params);
    execution.start(input);
    return await execution.result;
  }

  createExecution(ast, params = {}) {
    const executionParams = {
      executor: this,
      params: { ...params,
        // for canvas we are passing this in,
        // canvas should be refactored to not pass any extra context in
        extraContext: this.context
      }
    };
    if (typeof ast === 'string') executionParams.expression = ast;else executionParams.ast = ast;
    const execution = new _execution.Execution(executionParams);
    return execution;
  }

  walkAst(ast, action) {
    for (const link of ast.chain) {
      const {
        function: fnName,
        arguments: fnArgs
      } = link;
      const fn = (0, _util.getByAlias)(this.state.get().functions, fnName);

      if (fn) {
        // if any of arguments are expressions we should migrate those first
        link.arguments = (0, _lodash.mapValues)(fnArgs, (asts, argName) => {
          return asts.map(arg => {
            if (typeof arg === 'object') {
              return this.walkAst(arg, action);
            }

            return arg;
          });
        });
        action(fn, link);
      }
    }

    return ast;
  }

  inject(ast, references) {
    return this.walkAst((0, _lodash.cloneDeep)(ast), (fn, link) => {
      link.arguments = fn.inject(link.arguments, references);
    });
  }

  extract(ast) {
    const allReferences = [];
    const newAst = this.walkAst((0, _lodash.cloneDeep)(ast), (fn, link) => {
      const {
        state,
        references
      } = fn.extract(link.arguments);
      link.arguments = state;
      allReferences.push(...references);
    });
    return {
      state: newAst,
      references: allReferences
    };
  }

  telemetry(ast, telemetryData) {
    this.walkAst((0, _lodash.cloneDeep)(ast), (fn, link) => {
      telemetryData = fn.telemetry(link.arguments, telemetryData);
    });
    return telemetryData;
  }

  migrate(ast, version) {
    return this.walkAst((0, _lodash.cloneDeep)(ast), (fn, link) => {
      if (!fn.migrations[version]) return link;
      const updatedAst = fn.migrations[version](link);
      link.arguments = updatedAst.arguments;
      link.type = updatedAst.type;
    });
  }

  fork() {
    const initialState = this.state.get();
    const fork = new Executor(initialState);
    /**
     * Synchronize registry state - make any new types, functions and context
     * also available in the forked instance of `Executor`.
     */

    this.state.state$.subscribe(({
      types,
      functions,
      context
    }) => {
      const state = fork.state.get();
      fork.state.set({ ...state,
        types: { ...types,
          ...state.types
        },
        functions: { ...functions,
          ...state.functions
        },
        context: { ...context,
          ...state.context
        }
      });
    });
    return fork;
  }

}

exports.Executor = Executor;