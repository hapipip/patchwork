'use strict';

const RequireYml = require('require-yml');
const Masks = require('masks');
const Hoek = require('hoek');
const Fs = require('fs');
const Joi = require('joi');

const internals = {
  isPlainObject: require('lodash.isplainobject')
};

internals.callFactory = (config, args) => {
  if (!(args instanceof Array)) {
    args = [];
  }

  if (typeof config === 'function') {
    config = config.apply(null, args);
  }
  return config;
};

internals.Pellmell = module.exports = {};

internals.Pellmell.load = (piece, options = {}) => {

  const sanitizeSchema = Joi.alternatives(Joi.boolean(), Joi.object().pattern(/^.*$/, Joi.lazy(() => sanitizeSchema)));

  const {factory, assert} = Joi.attempt(options, Joi.object({
    factory: Joi.alternatives(Joi.array(), Joi.boolean()),
    assert: Joi.boolean().default(true),
    sanitize: sanitizeSchema
  }).label('options'));

  if (factory) {
    piece = internals.callFactory(piece, factory);
  }

  if (typeof piece === 'string') {

    if (piece.slice(-1) === '/') {
      piece = piece.slice(0, -1);
    }

    if (!Fs.existsSync(piece)) {

      const errorMessage = `Invalid "piece" param: "${piece}" does not exists`;

      if (!assert) {
        console.error(errorMessage);
        return {};
      }

      throw new Error(errorMessage);
    }

    piece = RequireYml(piece, config => {

      if (factory) {
        config = internals.callFactory(config, factory);
      }

      return config;
    }) || {};
  }

  if (!internals.isPlainObject(piece)) {
    throw new Error('"piece" is not an object');
  }

  return piece;
};

internals.Pellmell.patch = (pieces, options = {}) => {

  if (!pieces) {
    throw new Error('Nothing to patch');
  }

  if (!Array.isArray(pieces)) {
    pieces = [pieces];
  }

  const {sanitize, isNullOverride} = options;

  let merged = pieces.reduce((merged, piece, i) => {

    try {
      piece = internals.Pellmell.load(piece, options);
    } catch(err) {
      console.error(`Invalid "pieces" param: Invalid piece n°${i+1}: ${err.message}`);
      return merged;
    }

    return Hoek.applyToDefaults(merged, piece, !!isNullOverride);
  }, {});

  if (!sanitize) {
    return merged;
  }

  try {
    merged =  Masks.sanitize(merged, sanitize);
  } catch (err) {
    throw new Error(`Invalid "sanitize" options: ${err.message}`);
  }

  return merged;
};
