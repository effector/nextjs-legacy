import * as React from "react";
import { AppContext, AppInitialProps } from "next/app";
import { DocumentContext } from "next/document";
import { Provider } from "effector-react/ssr";
import { NextComponentType } from "next";
import { Scope } from "effector/fork";

type Enhancer<C> = (Component: C) => C;
type RenderPage = DocumentContext["renderPage"];
type AppType<P extends AppInitialProps> = NextComponentType<AppContext, AppInitialProps, P>;

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
