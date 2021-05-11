"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeTaskDefinitions = sanitizeTaskDefinitions;
exports.TaskTypeDictionary = void 0;

var _task = require("./task");

let _Symbol$iterator;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

_Symbol$iterator = Symbol.iterator;

class TaskTypeDictionary {
  constructor(logger) {
    _defineProperty(this, "definitions", new Map());

    _defineProperty(this, "logger", void 0);

    this.logger = logger;
  }

  [_Symbol$iterator]() {
    return this.definitions.entries();
  }

  getAllTypes() {
    return [...this.definitions.keys()];
  }

  getAllDefinitions() {
    return [...this.definitions.values()];
  }

  has(type) {
    return this.definitions.has(type);
  }

  get(type) {
    this.ensureHas(type);
    return this.definitions.get(type);
  }

  ensureHas(type) {
    if (!this.has(type)) {
      throw new Error(`Unsupported task type "${type}". Supported types are ${this.getAllTypes().join(', ')}`);
    }
  }
  /**
   * Method for allowing consumers to register task definitions into the system.
   * @param taskDefinitions - The Kibana task definitions dictionary
   */


  registerTaskDefinitions(taskDefinitions) {
    const duplicate = Object.keys(taskDefinitions).find(type => this.definitions.has(type));

    if (duplicate) {
      throw new Error(`Task ${duplicate} is already defined!`);
    }

    try {
      for (const definition of sanitizeTaskDefinitions(taskDefinitions)) {
        this.definitions.set(definition.type, definition);
      }
    } catch (e) {
      this.logger.error('Could not sanitize task definitions');
    }
  }

}
/**
 * Sanitizes the system's task definitions. Task definitions have optional properties, and
 * this ensures they all are given a reasonable default.
 *
 * @param taskDefinitions - The Kibana task definitions dictionary
 */


exports.TaskTypeDictionary = TaskTypeDictionary;

function sanitizeTaskDefinitions(taskDefinitions) {
  return Object.entries(taskDefinitions).map(([type, rawDefinition]) => {
    return _task.taskDefinitionSchema.validate({
      type,
      ...rawDefinition
    });
  });
}