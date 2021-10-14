import * as React from "react";
import NextApp, { AppContext, AppProps } from "next/app";
import { hydrate } from "effector";

import { domain } from "./domain";
import { INITIAL_STATE_KEY } from "./lib";
import { TargetComponentType } from "./types";

declare global {
  interface Window {
    // @ts-ignore
    __NEXT_DATA__: Object;
  }
}

type HydratedApp = TargetComponentType<AppContext> & { origGetInitialProps?: any };

export function withHydrate() {
  const isServer = typeof window === "undefined";

  return (App: HydratedApp) => {
    const WithHydrateApp = class WithHydrateApp extends React.Component<AppProps> {
      static origGetInitialProps = App.origGetInitialProps || NextApp.origGetInitialProps;
      static getInitialProps = NextApp.getInitialProps;

      constructor(props: AppProps) {
        super(props);

        if (isServer) return;

        hydrate(domain, { values: window.__NEXT_DATA__[INITIAL_STATE_KEY] });
      }

      render() {
        return <App {...this.props} />;
      }
    };

    if (App.getInitialProps) {
      WithHydrateApp.getInitialProps = async (ctx: any) => {
        const [nextAppProps, hydratedAppProps] = await Promise.all([
          NextApp.getInitialProps(ctx),
          App.getInitialProps!(ctx),
        ]);

        return {
          ...nextAppProps,
          ...hydratedAppProps,
          pageProps: Object.assign({}, nextAppProps?.pageProps, hydratedAppProps?.pageProps),
        };
      };
    }

    return WithHydrateApp;
  };
}
