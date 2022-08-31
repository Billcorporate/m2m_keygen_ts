// Type for parameters
export type ParamsTypes =
  | undefined
  | null
  | {
      [key: string]: ParamsValueType | undefined | null;
    };

// Type for parameters cleaned from undefined and null values
export type ParamsHashNotNilType = { [key: string]: ParamsValueType };

// Type for parameters values
export type ParamsValueType =
  | number
  | string
  | Array<ParamsValueType>
  | { [key: string]: ParamsValueType };
