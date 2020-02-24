import { domain } from "./domain";

const { createDomain, createStore, createEffect, createEvent } = domain;

export * from "effector";

export { domain, createDomain, createStore, createEffect, createEvent };
export * from "./with-hydrate";
export * from "./with-fork";
