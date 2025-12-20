export interface I_Calculator {
  id?: string;
  num1: number;
  num2: number;
  operation: '+' | '-' | '*' | '/';
  result: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export class CalculatorModel implements I_Calculator {
  id?: string;
  num1!: number;
  num2!: number;
  operation!: '+' | '-' | '*' | '/';
  result!: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: I_Calculator) {
    Object.assign(this, data);
  }

  toJSON(): I_Calculator {
    return { ...this };
  }
}

export default CalculatorModel;
