import { DocumentContext } from "next/document";
import { NextComponentType } from "next";
import { Unit } from "effector";

import { PageContext } from "../types";

import { START_UNIT_KEY } from "./constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

type StartUnits = Array<Unit<PageContext>>;
type RenderPage = DocumentContext["renderPage"];
type Enhancer<C extends NextComponentType = NextComponentType<any, any, any>> = (Component: C) => C;

export function getStartUnits(originalRenderPage: RenderPage) {
  const units: StartUnits = [];

  originalRenderPage({ enhanceApp: getStartUnit(units) });
  originalRenderPage({ enhanceComponent: getStartUnit(units) });

  return units;
}

function getStartUnit(units: StartUnits): Enhancer {
  return (Component) => () => {
    if (START_UNIT_KEY in Component) {
      units.push(Component[START_UNIT_KEY]);
    }

    return null;
  };
}
