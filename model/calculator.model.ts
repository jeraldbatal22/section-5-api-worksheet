export interface Calculator {
  id?: string;
  num1: number;
  num2: number;
  operation: '+' | '-' | '*' | '/';
  result: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export class CalculatorModel implements Calculator {
  id?: string;
  num1!: number;
  num2!: number;
  operation!: '+' | '-' | '*' | '/';
  result!: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: Calculator) {
    Object.assign(this, data);
  }

  toJSON(): Calculator {
    return { ...this };
  }
}

export default CalculatorModel;
