import { AppInitialProps } from "next/app";
import { Unit, is } from "effector";

import { AppType, Enhancer, RenderPage, PageContext } from "../types";

import { START_UNIT_KEY } from "./constants";

type StartUnits = Array<Unit<PageContext>>;

export function getStartUnits(originalRenderPage: RenderPage) {
  const units: StartUnits = [];

  originalRenderPage({ enhanceApp: getStartUnit(units) });

  return units.filter(is.unit);
}

function getStartUnit<P extends AppInitialProps>(units: StartUnits): Enhancer<AppType<P>> {
  return () => (props) => {
    if (START_UNIT_KEY in props) {
      units.push(props[START_UNIT_KEY]);
    }

    if (START_UNIT_KEY in props.pageProps) {
      units.push(props.pageProps[START_UNIT_KEY]);
    }

    return null;
  };
}
