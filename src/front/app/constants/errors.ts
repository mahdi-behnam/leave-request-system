export class MissingAccessTokenError extends Error {
  constructor() {
    super("Access token is missing. Please log in.");
    this.name = "MissingAccessTokenError";
  }
}
