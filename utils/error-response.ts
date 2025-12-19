// export class ErrorResponse extends Error {
//   public statusCode: number;
//   public errorData?: unknown;

//   constructor(statusCode: number, message: string, data?: unknown) {
//     super(message);
//     this.statusCode = statusCode;
//     this.errorData = data;
//     Object.setPrototypeOf(this, ErrorResponse.prototype);
//   }
// }