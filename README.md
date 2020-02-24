# Effector Next

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```bash
npm install effector-next
```

or yarn

```bash
yarn add effector-next
```

**effector-next** requires `effector, effector-react` to be installed

**@effector/babel-plugin** is necessary if you do not want to manually name the units

## Usage

1. To load the initial state on the server, you must attach `withFork` wrapper to your `_document` component

   <details>
       <summary>pages/_document.jsx</summary>

   ```jsx
   import Document from "next/document";
   import { withFork } from "effector-next";

   import { serverStarted } from "../model";

   const enhance = withFork({ debug: false, unit: serverStarted });

   export default enhance(Document);
   ```

   </details>

2. To get the initial state on the client and drop it into the application, you must attach `withHydrate` wrapper to your `_app` component

   <details>
       <summary>pages/_app.jsx</summary>

   ```jsx
   import { withHydrate } from "effector-next";
   import App from "next/app";

   const enhance = withHydrate();

   export default enhance(App);
   ```

   </details>

3. To bind events/stores on the server to the scope, add aliases from `effector-react` to`effector-react/ssr` in `next.config.js`

   <details>
       <summary>next.config.js</summary>

   ```js
   const { withEffectoReactAliases } = require("effector-next/tools");

   const enhance = withEffectoReactAliases();

   module.exports = enhance({});
   ```

   </details>

4. Replace import from `"effector"` to `"effector-next"`

   ```diff
   - import { createEvent, forward } from "effector"
   + import { createEvent, forward } from "effector-next"
   ```

### Example

```jsx
// model.js
import { forward, createEvent, createStore, createEffect } from "effector-next";

export const serverStarted = createEvent();

const effect = createEffect({
  handler() {
    return Promise.resolve({ name: "someServerName" });
  },
});

export const $data = createStore(null);

$data.on(effect.done, (_, { result }) => result);

forward({
  from: serverStarted,
  to: effect,
});
```

```jsx
// pages/index.jsx
import React from "react";
import { useStore } from "effector-react";

import { $data } from "../model";

export default function HomePage() {
  const data = useStore($data);

  return (
    <div>
      <h1>Data preloaded on the server:</h1>
      {JSON.stringify(data)}
    </div>
  );
}

export default enhance(MyDocument);
```

## Configuration

The `withFork` accepts a config object as a parameter:

- `unit` : unit called on the server to set the initial state
- `debug` (optional, boolean) : enable debug logging
