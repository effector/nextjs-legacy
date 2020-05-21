import * as React from "react";
import { Provider } from "effector-react/ssr";
import { AppInitialProps } from "next/app";
import { Scope } from "effector/fork";

import { AppType, Enhancer, RenderPage } from "../types";

export function renderPageWithScope(scope: Scope, originalRenderPage: RenderPage): RenderPage {
  return (params) => {
    // For backwards compatibility
    const enhanceApp = typeof params === "function" ? undefined : params?.enhanceApp;
    const enhanceComponent = typeof params === "function" ? params : params?.enhanceComponent;

    const options = {
      enhanceComponent,
      enhanceApp: createEnhanceApp(scope, enhanceApp),
    };

    return originalRenderPage(options);
  };
}

function createEnhanceApp<P extends AppInitialProps>(
  scope: Scope,
  enhancer?: Enhancer<AppType<P>>,
): Enhancer<AppType<P>> {
  return (Component) => (props) => {
    const App = enhancer ? enhancer(Component) : Component;

    return (
      <Provider value={scope}>
        <App {...props} />
      </Provider>
    );
  };
}
