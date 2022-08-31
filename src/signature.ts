import { createHmac } from 'crypto';
import { encodes } from './helpers/paramsEncoder';
import { ParamsTypes } from './types/paramsTypes';

export const secureCompare = (a: string, b: string) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  var mismatch = a.length === b.length ? 0 : 1;
  if (mismatch) {
    b = a;
  }

  for (var i = 0, il = a.length; i < il; ++i) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
};

/*
 * Generate a signature from the different part of the request.
 *
 * @param {string} secret - The secret used to sign the request.
 * @param {string|undefined} algorithm - algorithm to use - Default to sha512
 * @param {ParamType} params - params to sign
 * @param {string} verb - http verb
 * @param {string} path - path to sign
 * @returns {string} - The generated signature
 */
export const sign = ({
  secret,
  algorithm = 'sha512',
  params,
  verb,
  path,
}: {
  secret: string;
  algorithm: string;
  params: ParamsTypes;
  verb: string;
  path: string;
}) => {
  const hmac = createHmac(algorithm, secret);

  hmac.update(`${verb.toUpperCase()}${path}${encodes(params)}`);

  return hmac.digest('hex');
};

/*
 * Validate the signature of a request.
 *
 * @param {string} secret - The secret used to sign the request.
 * @param {string|undefined} algorithm - algorithm to use - Default to sha512
 * @param {ParamType} params - params to sign
 * @param {string} verb - http verb
 * @param {string} path - path to sign
 * @param {string} signature - signature to check against
 * @returns {boolean} - Is signature is valid
 */
export const validate = ({
  secret,
  algorithm = 'sha512',
  params,
  verb,
  path,
  signature,
}: {
  secret: string;
  algorithm: string;
  params: ParamsTypes;
  verb: string;
  path: string;
  signature: string;
}) => {
  return secureCompare(
    sign({ secret, algorithm, params, verb, path }),
    signature
  );
};
