import { forward, createEvent, createStore, createEffect } from "effector-next";

export const pageLoaded = createEvent();
export const buttonClicked = createEvent();

const effect = createEffect({
  handler(name) {
    return Promise.resolve({ name });
  },
});

export const $data = createStore(null);

$data.on(effect.done, (_, { result }) => result);

forward({
  from: pageLoaded.map(() => "name-from-pageLoaded"),
  to: effect,
});

forward({
  from: buttonClicked.map(() => "name-from-buttonClicked"),
  to: effect,
});
