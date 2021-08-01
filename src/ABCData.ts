export interface ComingData {
  date: string;
  contestName: string;
}

export interface ErrorData {
  error: {
    message: string;
  };
}

export const isErrorData = (arg: unknown): arg is ErrorData =>
  typeof arg === 'object' &&
  arg !== null &&
  typeof (arg as ErrorData).error?.message === 'string';

export class ABCData {
  constructor(e: ComingData) {
    this.contestName = e.contestName;
    this.date = new Date(e.date);
  }

  contestName: string;
  date: Date;
}
