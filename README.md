# Effector Next

A HOCs that brings Effector and Next.js together

[![npm version](https://badge.fury.io/js/effector-next.svg)](https://www.npmjs.com/package/effector-next)

## Installation

```bash
npm install effector-next
```

or yarn

```bash
yarn add effector-next
```

**effector-next** requires `effector`, `effector-react` to be installed

**effector/babel-plugin** is necessary if you do not want to manually name the units

## Settings

1. To load the initial state on the server, you must attach `withFork` wrapper to your `_document` component

   <details>
   <summary>pages/_document.jsx</summary>

   ```jsx
   import Document from "next/document";
   import { withFork } from "effector-next";

   const enhance = withFork({ debug: false });

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

3. To bind events/stores on the server to the scope, add aliases from `effector-react` to `effector-react/ssr` in `next.config.js`

   <details>
   <summary>next.config.js</summary>

   ```js
   const { withEffectoReactAliases } = require("effector-next/tools");

   const enhance = withEffectoReactAliases();

   module.exports = enhance({});
   ```

   </details>

4. Replace imports from `"effector"` to `"effector-next"`

   ```diff
   - import { createEvent, forward } from "effector"
   + import { createEvent, forward } from "effector-next"
   ```

5. Connect the `effector/babel-plugin`

   <details>
   <summary>.babelrc</summary>

   ```json
   {
     "presets": ["next/babel"],
     "plugins": ["effector/babel-plugin"]
   }
   ```

   </details>

6. Configure what event will be triggered when the page is requested from the server using `withStart`

   <details>
   <summary>pages/index.js</summary>

   ```jsx
   import React from "react";
   import { withStart } from "effector-next";
   import { useStore } from "effector-react";

   import { pageLoaded } from "../model";

   const enhance = withStart(pageLoaded);

   function HomePage() {
     return (
       <div>
         <h1>Hello World</h1>
       </div>
     );
   }

   export default enhance(HomePage);
   ```

   </details>

### Example

1. Declare our model

   <details>
   <summary>models/index.js</summary>

   ```jsx
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
     from: pageLoaded.map(() => "nameFromPageLoaded"),
     to: effect,
   });

   forward({
     from: buttonClicked.map(() => "nameFromButtonClicked"),
     to: effect,
   });
   ```

   </details>

2. Connect the page to the store (all units must be wrapped in hooks - this is necessary in order to associate units with scope on the server)

   <details>
   <summary>pages/index.jsx</summary>

   ```jsx
   import React from "react";
   import { useStore, useEvent } from "effector-react";

   import { $data, buttonClicked } from "../models";

   export default function HomePage() {
     const data = useStore($data);
     const handleClick = useEvent(buttonClicked);

     return (
       <div>
         <h1>HomePage</h1>
         <h2>Store state: {JSON.stringify({ data })}</h2>
         <button onClick={handleClick}>click to change store state</button>
       </div>
     );
   }
   ```

   </details>

3. Bind an event that will be called on the server when the page is requested

   <details>
   <summary>pages/index.jsx</summary>

   ```diff
   import React from "react";
   import { useStore, useEvent } from "effector-react";
   +import { withStart } from "effector-next";

   -import { $data, buttonClicked } from "../models";
   +import { $data, pageLoaded, buttonClicked } from "../models";

   +const enhance = withStart(pageLoaded);

   -export default function HomePage() {
   +function HomePage() {
     const data = useStore($data);
     const handleClick = useEvent(buttonClicked);

     return (
       <div>
         <h1>HomePage</h1>
         <h2>Store state: {JSON.stringify({ data })}</h2>
         <button onClick={handleClick}>click to change store state</button>
       </div>
     );
   }

   +export default enhance(HomePage);
   ```

   </details>

## Configuration

The `withFork` accepts a config object as a parameter:

- `debug` (optional, boolean) : enable debug logging

## Server payload

When the unit passed to `withStart` is called, the object will be passed as a payload:

- `req` : incoming request
- `res` : serever response
- `cookies` : parsed cookies
- `pathname` : path section of `URL`
- `query` : query string section of `URL` parsed as an object.
