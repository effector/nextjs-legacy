import { NextPageContext } from "next";
import { AppContext } from "next/app";
import { Unit } from "effector";

import { START_UNIT_KEY } from "./lib";
import { PageContext, TargetComponentType } from "./types";

export function withStart(unit: Unit<PageContext>) {
  return (component: TargetComponentType<AppContext> | TargetComponentType<NextPageContext>) => {
    const originalGetInitialProps = component.getInitialProps;

    // We cancel static optimization for a component
    component.getInitialProps = async (ctx: any) => {
      let initialProps = {};

      if (typeof originalGetInitialProps === "function") {
        initialProps = await originalGetInitialProps(ctx);
      }

      return Object.assign({}, initialProps, { [START_UNIT_KEY]: unit });
    };

    return component;
  };
}
