import * as React from "react";
import Document, { DocumentContext, DocumentProps } from "next/document";
import { allSettled, fork, serialize } from "effector/fork";
import { ParsedUrlQuery } from "querystring";
import cookies from "next-cookies";
import { Unit } from "effector";

import { domain } from "./domain";
import { renderPageWithScope, INITIAL_STATE_KEY } from "./lib";

/* eslint-disable no-console, complexity */

type DocumentType = typeof Document;
type NextData = DocumentProps["__NEXT_DATA__"];
type InitialStateKey = typeof INITIAL_STATE_KEY;
type InitialState = ReturnType<typeof serialize>;
type ExtendedNextData = NextData & { [key in InitialStateKey]: InitialState };

interface WrappedDocumentProps extends DocumentProps {
  initialState: InitialState;
  __NEXT_DATA__: ExtendedNextData;
}

export interface ServerPayload<C extends Object = {}> {
  cookies: C;
  pathname: string;
  query: ParsedUrlQuery;
}

export interface WithForkConfig {
  debug?: boolean;
  unit: Unit<ServerPayload>;
}

export function withFork({ unit, debug }: WithForkConfig) {
  return (Component: DocumentType): DocumentType =>
    class WrappedDocument extends React.Component<WrappedDocumentProps> {
      static renderDocument = Component.renderDocument;
      static headTagsMiddleware = Component.headTagsMiddleware;
      static bodyTagsMiddleware = Component.bodyTagsMiddleware;
      static htmlPropsMiddleware = Component.htmlPropsMiddleware;

      static async getInitialProps(ctx: DocumentContext) {
        const originalRenderPage = ctx.renderPage;

        if (debug) console.time("1.Domain forked");

        const scope = fork(domain);

        if (debug) console.timeEnd("1.Domain forked");

        ctx.renderPage = renderPageWithScope(scope, originalRenderPage);

        if (debug) console.time("2.All units settled");

        await allSettled<ServerPayload>(unit, {
          scope,
          params: {
            query: ctx.query,
            cookies: cookies(ctx),
            pathname: ctx.pathname,
          },
        });

        if (debug) console.timeEnd("2.All units settled");

        const initialState = serialize(scope);

        if (debug) console.log("3.Received initial state", initialState);

        if (debug) console.time("4.Component.getInitialProps called");

        const initialProps = await Component.getInitialProps(ctx);

        if (debug) console.timeEnd("4.Component.getInitialProps called");

        return {
          ...initialProps,
          initialState,
        };
      }

      constructor(props: WrappedDocumentProps) {
        super(props);

        props.__NEXT_DATA__[INITIAL_STATE_KEY] = props.initialState;
      }

      render() {
        return <Component {...this.props} />;
      }
    };
}
