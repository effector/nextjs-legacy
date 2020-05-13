import { IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";

export interface PageContext<C extends Object = {}> {
  cookies: C;
  pathname: string;
  res: ServerResponse;
  req: IncomingMessage;
  query: ParsedUrlQuery;
}
