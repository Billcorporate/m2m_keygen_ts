import { ParamsTypes, ParamsValueType } from '../types/paramsTypes';

export const translateParamsToQuery = (params: {
  [key: string]:
    | null
    | boolean
    | number
    | string
    | Array<boolean | number | string>
    | { [key: string]: boolean | number | string };
}) => {
  if (Object.keys(params).length === 0) return '';

  return `?${Object.entries(params)
    .reduce<Array<string>>((current, [nextKey, nextItem]) => {
      let value: Array<string> = [];
      switch (typeof nextItem) {
        case 'boolean':
          value = [`${nextKey}=${nextItem ? 'true' : 'false'}`];
          break;

        case 'number':
          value = [`${nextKey}=${nextItem}`];
          break;

        case 'string':
          value = [`${nextKey}=${nextItem}`];
          break;

        case 'object':
          if (nextItem === null) {
            value = [`${nextKey}=false`];
          } else if (Array.isArray(nextItem)) {
            value = nextItem.reduce<Array<string>>(
              (currStrArr, nextArrValue) => [
                ...currStrArr,
                `${nextKey}[]=${nextArrValue}`,
              ],
              []
            );
          } else {
            value = Object.entries(nextItem).reduce<Array<string>>(
              (currStrHash, [nextHashKey, nextHashValue]) => [
                ...currStrHash,
                `${nextKey}[${nextHashKey}]=${nextHashValue}`,
              ],
              []
            );
          }
          break;

        default:
          break;
      }
      return [...current, ...value];
    }, [])
    .join('&')}`;
};

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
