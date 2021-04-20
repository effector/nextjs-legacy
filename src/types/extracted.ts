import { AppContext, AppInitialProps } from "next/app";
import { DocumentContext } from "next/document";
import { NextComponentType } from "next";

export type Enhancer<C> = (Component: C) => C;
export type RenderPage = DocumentContext["renderPage"];
export type TargetComponentType<C> = NextComponentType<C, any, any>;
export type AppProps = AppInitialProps & { Component: NextComponentType };
export type AppType<P extends AppProps> = NextComponentType<AppContext, AppInitialProps, P>;
