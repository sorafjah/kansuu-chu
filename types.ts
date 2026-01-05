export enum FunctionType {
  PROPORTIONAL = 'proportional', // y = ax
  INVERSE = 'inverse',           // y = a/x
  LINEAR = 'linear',             // y = ax + b
  QUADRATIC = 'quadratic',       // y = ax^2
}

export interface FunctionConfig {
  type: FunctionType;
  label: string;
  formula: string;
  description: string;
  hasB: boolean; // Does it use the 'b' coefficient?
}

export const FUNCTION_DEFS: Record<FunctionType, FunctionConfig> = {
  [FunctionType.PROPORTIONAL]: {
    type: FunctionType.PROPORTIONAL,
    label: '比例',
    formula: 'y = ax',
    description: '原点を通る直線です。aの値によって傾きが変わります。',
    hasB: false,
  },
  [FunctionType.INVERSE]: {
    type: FunctionType.INVERSE,
    label: '反比例',
    formula: 'y = a/x',
    description: '双曲線を描きます。xが0のときは定義されません。',
    hasB: false,
  },
  [FunctionType.LINEAR]: {
    type: FunctionType.LINEAR,
    label: '一次関数',
    formula: 'y = ax + b',
    description: '直線のグラフです。aは傾き、bは切片を表します。',
    hasB: true,
  },
  [FunctionType.QUADRATIC]: {
    type: FunctionType.QUADRATIC,
    label: '二次関数',
    formula: 'y = ax²',
    description: '放物線を描きます。aの正負で開き方が変わります。',
    hasB: false,
  },
};