const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { ValidationError } = require('../helpers/response');
const schemas = require('../schema');

const ajv = new Ajv({ coerceTypes: true, useDefaults: true, multipleOfPrecision: 2 });
addFormats(ajv);
Object.entries(schemas).forEach(([name, schema]) => ajv.addSchema(schema, name));

const formatError = ({ instancePath, keyword, params, message }) => {
  if (keyword === 'required') return `${params.missingProperty} is required`;
  if (keyword === 'additionalProperties') return `${params.additionalProperty} is not allowed`;
  const field = instancePath.replace(/^\//, '').replace(/\//g, '.');
  return field ? `${field} ${message}` : message;
};

module.exports = sources => (req, res, next) => {
  const map = typeof sources === 'string' ? { body: sources } : sources;

  for (const [source, name] of Object.entries(map)) {
    const validate = ajv.getSchema(name);
    if (!validate(req[source])) return next(ValidationError(formatError(validate.errors[0])));
  }

  return next();
};
