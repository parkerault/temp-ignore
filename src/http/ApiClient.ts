import { formatValidationErrors } from "io-ts-reporters";
import * as qs from "qs";

const apiRoot = process.env.RAZZLE_API_ROOT;
const apikey = process.env.RAZZLE_API_KEY;

export async function request<RT>(init: RequestInit & { query: object }) {
  if (apikey === undefined) {
    throw new APIKeyError();
  }
  const query = qs.stringify(
    { ...init.query, apikey },
    { addQueryPrefix: true }
  );
  const response = await fetch(apiRoot + query);
  const raw = await response.text()
  let data: RT;
  try {
    data = JSON.parse(raw)
  } catch (error) {
    const responseBody = await response.text();
    throw new JSONDecodeError(responseBody);
  }
  if (!response.ok) {
    throw new HTTPError(response);
  }
  return data;
}

export class HTTPError extends Error {
  name = "HTTPError";
  constructor(response: Response) {
    super();
    this.message = `${response.status}: ${response.statusText}`;
  }
}

export class JSONDecodeError extends Error {
  name = "JSONDecodeError";
  constructor(responseBody: string) {
    super();
    this.message = `Invalid JSON encountered:

    ${responseBody}
    `;
  }
}

export class APIKeyError extends Error {
  name = "APIKeyError";
  message = "An API key must be provided before running the application.";
}

export class ValidationError extends Error {
  name = "ValidationError"
  constructor(errors: any[]) {
    super();
    this.message = formatValidationErrors(errors).join("\n")
  }
}

export type APIError = HTTPError | JSONDecodeError | APIKeyError | ValidationError;

export type RequestState =
  | { status: "pending" }
  | { status: "success" }
  | { status: "failure"; error?: any}
  | null;
