import { AppContext, AppInitialProps } from "next/app";
import { DocumentContext } from "next/document";
import { NextComponentType } from "next";

export type Enhancer<C> = (Component: C) => C;
export type RenderPage = DocumentContext["renderPage"];
export type AppType<P extends AppInitialProps> = NextComponentType<AppContext, AppInitialProps, P>;
