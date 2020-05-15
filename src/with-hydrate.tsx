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

  return function (App: typeof NextApp) {
    return class WithHydrateApp extends App {
      constructor(props: AppProps) {
        super(props);

        if (isServer) return;

        hydrate(domain, { values: window.__NEXT_DATA__[INITIAL_STATE_KEY] });
      }
    };
  };
}
