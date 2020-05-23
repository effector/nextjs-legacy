import { forward, createEvent, createStore, createEffect } from "effector-next";

export const pageLoaded = createEvent();
export const buttonClicked = createEvent();

const effect = createEffect({
  handler(value) {
    return Promise.resolve({ value });
  },
});

export const $data = createStore(null);

$data.on(effect.done, (_, { result }) => result);

forward({
  from: pageLoaded.map(() => "value-from-server"),
  to: effect,
});

forward({
  from: buttonClicked.map(() => "value-from-client"),
  to: effect,
});
