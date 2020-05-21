import * as React from "react";
import { fork, hydrate, Scope } from "effector/fork";
import { Provider } from "effector-react/ssr";
import NextApp, { AppProps } from "next/app";

import { domain } from "./domain";
import { INITIAL_STATE_KEY } from "./lib";

declare global {
  interface Window {
    __NEXT_DATA__: Object;
  }
}

interface AppState {
  scope: Scope;
}

export function withHydrate() {
  const isServer = typeof window === "undefined";

  return (App: typeof NextApp) =>
    class WithHydrateApp extends React.Component<AppProps, AppState> {
      static origGetInitialProps = App.origGetInitialProps;
      static getInitialProps = App.getInitialProps;

      constructor(props: AppProps) {
        super(props);

        if (isServer) return;

        hydrate(domain, { values: window.__NEXT_DATA__[INITIAL_STATE_KEY] });

        const scope = fork(domain);

        this.state = { scope };
      }

      render() {
        const app = <App {...this.props} />;

        if (isServer) return app;

        // eslint-disable-next-line react/destructuring-assignment
        return <Provider value={this.state.scope}>{app}</Provider>;
      }
    };
}
