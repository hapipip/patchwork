'use strict';

const RequireYml = require('require-yml');
const Masks = require('masks');
const Hoek = require('hoek');
const Joi = require('joi');

const internals = {};

internals.Pellmell = module.exports = {};

internals.Pellmell.patch = (pieces, options) => {

  if (!Array.isArray(pieces))
    pieces = [pieces];

  Joi.assert(pieces, Joi.array().items(Joi.string(), Joi.object(), Joi.func()).required(), 'Invalid "pieces" parameter');

  options = Joi.attempt(options, Joi.object({
    sanitize: Joi.object().label('sanitize'),
    bindValue: Joi.object().label('bindValue').default(null),
    isNullOverride: Joi.any().valid(true).default(false).label('isNullOverride')
  }).default(), 'Invalid "options" parameter');

  const merged = pieces.reduce((before, piece, i) => {

    if (typeof piece == 'function')
      piece = piece.call(options.bindValue);

    if (typeof piece == 'string')
      piece = RequireYml(piece, config => {

        if (typeof config == 'function')
          config = config.call(options.bindValue);

        return config;
      });


    Joi.assert(piece, Joi.object().required(), 'Invalid piece at '+i);

    return Hoek.applyToDefaults(before, piece, options.isNullOverride);
  }, {});

  if (!options.sanitize)
    return merged;

  return Masks.sanitize(merged, options.sanitize);

};
