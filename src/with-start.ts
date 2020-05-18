import { NextPageContext, NextComponentType } from "next";
import { AppContext } from "next/app";
import { Unit } from "effector";

import { PageContext } from "./types";
import { START_UNIT_KEY } from "./lib";

/* eslint-disable @typescript-eslint/no-explicit-any */

type TargetComponentType<C> = NextComponentType<C, any, any>;

export function withStart(unit: Unit<PageContext>) {
  return (component: TargetComponentType<AppContext> | TargetComponentType<NextPageContext>) => {
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
