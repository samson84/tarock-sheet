export class ApplicationError extends Error {
  userMessage: string;
  constructor(message?: string, userMessage?: string) {
    super(message);
    this.userMessage =
      userMessage === undefined ? "Ooops. Someting went wrong!" : userMessage;
  }
}
