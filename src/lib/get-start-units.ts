import { is, Unit } from "effector";

import { AppType, AppProps, Enhancer, RenderPage, PageContext } from "../types";

import { START_UNIT_KEY } from "./constants";

type StartUnits = Array<Unit<PageContext>>;

export function getStartUnits(originalRenderPage: RenderPage) {
  const units: StartUnits = [];

  originalRenderPage({ enhanceApp: getStartUnit(units) });

  return units.filter(is.unit);
}

function getStartUnit<P extends AppProps>(units: StartUnits): Enhancer<AppType<P>> {
  return () => (props) => {
    if (props?.[START_UNIT_KEY]) {
      units.push(props[START_UNIT_KEY]);
    }

    if (props?.pageProps?.[START_UNIT_KEY]) {
      units.push(props.pageProps[START_UNIT_KEY]);
    }

    return null;
  };
}
