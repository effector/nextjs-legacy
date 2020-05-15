import { NextPage } from "next";
import { Unit } from "effector";
import App from "next/app";

import { PageContext } from "./types";
import { START_UNIT_KEY } from "./lib";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function withStart(unit: Unit<PageContext>) {
  return (component: typeof App | NextPage<any>) => {
    const originalGetInitialProps = component.getInitialProps;

    // We cancel static optimization for a component
    component.getInitialProps = async (ctx: any) => {
      let initialProps = {};

      if (originalGetInitialProps) {
        initialProps = await originalGetInitialProps(ctx);
      }

      return initialProps;
    };

    component[START_UNIT_KEY] = unit;

    return component;
  };
}
