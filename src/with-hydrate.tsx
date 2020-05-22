import * as React from "react";
import NextApp, { AppProps } from "next/app";
import { hydrate } from "effector/fork";

import { domain } from "./domain";
import { INITIAL_STATE_KEY } from "./lib";

declare global {
  interface Window {
    __NEXT_DATA__: Object;
  }
}

export function withHydrate() {
  const isServer = typeof window === "undefined";

  return (App: typeof NextApp) =>
    class WithHydrateApp extends React.Component<AppProps> {
      static origGetInitialProps = App.origGetInitialProps;
      static getInitialProps = App.getInitialProps;

      constructor(props: AppProps) {
        super(props);

        if (isServer) return;

        hydrate(domain, { values: window.__NEXT_DATA__[INITIAL_STATE_KEY] });
      }

      render() {
        return <App {...this.props} />;
      }
    };
}
