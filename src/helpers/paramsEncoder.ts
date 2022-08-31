import {
  ParamsHashNotNilType,
  ParamsTypes,
  ParamsValueType,
} from '../types/paramsTypes';

const jsonifyValue = (value: ParamsValueType): string | number => {
  if (typeof value !== 'object') return value;
  return JSON.stringify(value);
};

const encodeValue = (value: ParamsValueType): ParamsValueType => {
  if (typeof value === 'object' && !Array.isArray(value))
    return encodeHashValue(value);
  return value;
};

const encodeHashValue = (value: ParamsValueType): ParamsValueType => {
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
      .sort(([keyA, _vA], [keyB, _vB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => [key, encodeValue(value)])
  );
};

export const encodes = (params: ParamsTypes): string => {
  if (params === null || params === undefined) return '';

  return Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
    .sort(([keyA, _vA], [keyB, _vB]) => keyA.localeCompare(keyB))
    .map(
      ([key, value]) =>
        `${key}=${jsonifyValue(encodeValue(value as ParamsValueType))}`
    )
    .join('&');
};
