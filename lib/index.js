'use strict';

const RequireYml = require('require-yml');
const Masks = require('masks');
const Hoek = require('hoek');
const Joi = require('joi');

const internals = {};

internals.Pellmell = module.exports = {};

internals.Pellmell.patch = (paths, options) => {

  if (!Array.isArray(paths))
    paths = [paths];

  Joi.assert(paths, Joi.array().items(Joi.string()).required(), 'Invalid "paths" parameter');

  options = Joi.attempt(options, Joi.object({
    sanitize: Joi.object(),
    isNullOverride: Joi.any().valid(true).default(false)
  }).default(), 'Invalid "options" parameter');

  const merged = paths.reduce((before, path) => {

    return Hoek.applyToDefaults(before, RequireYml(path), options.isNullOverride);
  }, {});

  if (!options.sanitize)
    return merged;

  return Masks.sanitize(merged, options.sanitize)

};
