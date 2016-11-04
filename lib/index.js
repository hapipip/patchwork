'use strict';

const RequireYml = require('require-yml');
const Masks = require('masks');
const Hoek = require('hoek');
const Joi = require('joi');

const internals = {};

internals.Pellmell = module.exports = {};

internals.Pellmell.patch = (pieces, options) => {

  if (!Array.isArray(pieces)) {
    pieces = [pieces];
  }

  Joi.assert(pieces, Joi.array().items(Joi.string(), Joi.object(), Joi.func()).required(), 'Invalid "pieces" parameter');

  options = Joi.attempt(options, Joi.object({
    sanitize: Joi.object().label('sanitize'),
    bindValue: Joi.object().label('bindValue').default(null),
    isNullOverride: Joi.any().valid(true).default(false).label('isNullOverride')
  }).default(), 'Invalid "options" parameter');

  const merged = pieces.reduce((before, piece) => {
    let res = piece;

    if (typeof piece == 'function') {
      res = piece.call(options.bindValue);
    }

    if (typeof piece == 'string') {
      if (piece.slice(-1) === '/') {
        piece = piece.slice(0, -1);
      }
      res = RequireYml(piece, config => {

        if (typeof config == 'function') {
          config = config.call(options.bindValue);
        }

        return config;
      });
    }

    Joi.assert(res, Joi.object().required(), 'Invalid piece at ' + piece);

    return Hoek.applyToDefaults(before, res, options.isNullOverride);
  }, {});

  if (!options.sanitize) {
    return merged;
  }

  return Masks.sanitize(merged, options.sanitize);

};
