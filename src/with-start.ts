import { NextComponentType } from "next";
import { Unit } from "effector";

import { PageContext } from "./types";
import { START_UNIT_KEY } from "./lib";

/* eslint-disable @typescript-eslint/no-explicit-any */

type TargetComponentType<P> = NextComponentType<any, any, P>;

export function withStart(unit: Unit<PageContext>) {
  return <P = {}>(component: TargetComponentType<P>) => {
    const originalGetInitialProps = component.getInitialProps;

    // We cancel static optimization for a component
    component.getInitialProps = async (ctx) => {
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
