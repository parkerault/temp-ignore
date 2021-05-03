# Affinipay Tech Assessment

## How to use

First, rename `.env.local.copy` to `env.local` and provide an api key for alphavantage.

```bash
yarn # or npm install
yarn start # or npm start
```

## Notes on the implementation

I've used a library called [razzle], which uses the project templates from `create-react-app` but exposes the webpack and babel configurations. It's a toolchain that I already have a bunch of custom code generators built for, so I used it for ease of development.

I missed the scss requirement until I was nearly finished, so the project uses vanilla css. I've used sass/scss off and on over the last 10 years, but lately I rarely come across a problem that calls for it.

I'm a proponent of the react/redux-style architecture. In my experience it works very well for almost any problem domain. I typically use redux-saga for all async/effectful business logic because the effect modelling pattern it uses is easy to run in a test environment without having to worry about extensive mocking or side effects. You'll also notice that I put all view state into the redux store. Because of this, and because the execution of all async/effectful operations are delegated to redux-saga, there are no side effects in any of the application code. This makes the codebase extremely reliable and easy to test. In this case I skipped unit testing because of time constraints, but I usually practice TDD.

I've settled on this toolchain after a few years of trial and error. It requires some planning and configuration (see `src/config/types.ts`), but it provides total type safety for the entire stack, from view to state. Conventional redux leaks type data all over the place, and if you constantly have to cast `any` to your application types you might as well not use typescript.

I use a few conventions in my react applications:
  - All UI components should be pure functions. React hooks are technically impure but are generally safe in practice, so long as all side-effectful code is kept outside of the component.
  - There should never be any business logic in the UI components. Only data transformation.
  - Accessing values in the global state tree should be abstracted into selectors for maintainability and performance. Frequently used selectors that return a complex, derived value should always be memoized.
  - Any business logic that requires async operations should be handled in a "task". View components should never contain asynchronous code. You'll notice that in this example all network requests are performed by dispatching an action that gets intercepted by a saga.
  - React components with complex presentation logic should be seperated from the view and moved up the component tree.
  - I prefer to use the Flux Standard Action convention for increased flexibility when writing redux middleware.
  - Selectors should always use the same `(state, props: object) => value` signature. Selectors that use a `props` parameter that isn't a plain object can't be composed as their signatures aren't compatible.
  - Lastly, if not using typescript, all types should be annotated in JSDoc comment blocks for use with the `checkJS` feature of the typescript compiler. This has excellent integration with VSCode.

[razzle]:https://razzlejs.org/
