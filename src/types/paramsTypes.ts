// Type for parameters
export type ParamsTypes =
  | undefined
  | null
  | {
      [key: string]: ParamsValueType | undefined | null;
    };

// Type for parameters values
export type ParamsValueType =
  | number
  | string
  | Array<ParamsValueType>
  | { [key: string]: ParamsValueType };
