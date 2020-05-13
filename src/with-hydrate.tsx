import * as React from "react";
import { AppProps, AppContext } from "next/app";
import { NextComponentType } from "next";
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

  return (App: NextComponentType<AppContext>) =>
    class WithEffectorHydrate extends React.Component<AppProps> {
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
