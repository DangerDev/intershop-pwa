<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Migrations

## 0.22 to 0.23

We removed deprecated exports related to the NgRx testing refactorings introduced in version 0.21.

We switched our main development to the new headless REST application type provided by ICM 7.10.21.0.
If you are upgrading and want to continue using the Responsive Starter Store application types, do not cherry-pick the [commits that switch application types](https://github.com/intershop/intershop-pwa/compare/a63d2a2fc1ffdb404e6b1fe8ffb79310fa2ef60f...741454c8c839dd001a3943236172d75ffd05541d).

## 0.20 to 0.21

We deprecated and reworked the way of testing with NgRx.
The old format using `ngrxTesting` with `combineReducers` is now deprecated and replaced by the [new approach](./state-management.md#testing-ngrx-artifacts).
The old testing mechanism will be removed in version 0.23.

We introduced a way to do [shallow testing with feature toggles](../concepts/configuration.md#unit-testing-with-feature-toggles) and used it in the tests.

We [reorganized the core store](../concepts/state-management.md#core-store-structure):

- new `customer`
  - store/addresses => store/**customer**/addresses
  - store/checkout/basket => store/**customer**/basket
  - store/orders => store/**customer**/orders
  - store/restore => store/**customer**/restore
  - store/user => store/**customer**/user
- new `core`
  - store/configuration => store/**core**/configuration
  - store/error => store/**core**/error
  - store/messages => store/**core**/messages
  - store/router => store/**core**/router
  - store/viewconf => store/**core**/viewconf
- new `general`
  - store/contact => store/**general**/contact
  - store/countries => store/**general**/countries
  - store/regions => store/**general**/regions

TSLint rules are set up to automatically fix imports, so run `npm run check` after upgrading.

In this version, we decided to start using the ngrx creator introduced in ngrx v8: [createAction](https://ngrx.io/api/store/createAction), [createReducer](https://ngrx.io/api/store/createReducer) and [createEffect](https://ngrx.io/api/effects/createEffect).
This means that the old way of writing action classes, reducer switch statements and @Effect() decorators is deprecated from 0.21 onwards.

Using these creator functions simplifies code and removes a lot of boiler plate from store files while providing type safety out-of-the-box.

You can automatically migrate your existing code by executing `node schematics/migration/0.20-to-0.21`.
Doing this will set related ts-lint rules and update each store or notify you of work previously needed.

## 0.19.1 to 0.20

We upgraded from Angular 8 to version 9 and activated the new rendering engine Ivy with this (following the [official upgrade guide](https://update.angular.io/#8.0:9.0l3)).
This was a major upgrade and comes with some changes:

- The following changes are available for cherry-picking in one commit:

  - Angular no longer supports the previously deprecated string syntax for lazy loaded modules. Change it to the [dynamic import format](https://angular.io/guide/deprecations#loadchildren-string-syntax).

  - `server.ts` was partially rewritten to support SSR dev-server and serverless deployments. Building SSR is now supported by Angular CLI and explicit `webpack` builds were removed.

  - `core-js` had a major upgrade to version 3, so `polyfill.ts` imports have changed.

  - We temporarily replaced `@ngx-utils/cookies` with `ngx-utils-cookies-port` due to a [bug](https://github.com/ngx-utils/cookies/issues/20) when using Angular 9.1.

  - `angular2-cookie-law` was replaced by `ngx-cookie-banner` for compatibility reasons. This comes with a styling overhaul.

- Further commits contain necessary refactoring:

  - `TestBed.get` in tests was deprecated in favor of the new type-safe `TestBed.inject`.

  - The empty generic type for NgRx `Store` is now the default and does not have to be supplied. The TSLint rule `ngrx-use-empty-store-type` was adapted to apply this refactoring.

  - We removed lazy loading with `@wishtack/reactive-component-loader` and replaced it with the native Angular 9 approach. If you have customized or created extensions, you will have to adapt the following:

    - Extension export modules are no longer imported and exported in `SharedModule`, instead export them in `ShellModule`.

    - Instead of pointing to the extension module with `ReactiveComponentLoaderModule` in the extension exports module, use the new provider for `LAZY_FEATURE_MODULE` pointing to the _extension store module_, if available. All further lazy loading is done by lazy components and lazy loaded pages. With this, the extension module should no longer import the extension store module.

    - Lazy components should no longer be part of the repository as they can be auto-generated on `npm install`. Use the new decorator `@GenerateLazyComponent()` via the `lazy-component` schematic to generate lazy components. We currently do not support creating lazy components for components with `@Output()` decorated fields.

    - Previous work-arounds in `<extension>-store.ts` and `<extension>-store.module.ts` for adding reducers of selecting the feature state are no longer necessary and can be refactored to standard approaches.

  - We performed a major upgrade to `prettier` which comes with new code formatting for parts of the code.

  - We replaced VSCode extension `stylelint-plus` with the official extension. Update the recommended extensions.

  - We overhauled the integration of utility libraries for our custom schematics and TSLint rules. These libraries now get built when `npm install`ing the PWA and transpiled JavaScript sources are no longer part of version control. Also, they mainly reuse libraries from the project root now.

## 0.18 to 0.19

We migrated from using [ngrx-router](https://github.com/amcdnl/ngrx-router) to the official and better supported [@ngrx/router-store](https://ngrx.io/guide/router-store).
This means that throughout the code all usage of the `ofRoute` operator and `RouteNavigation` actions are no longer available.

As some of these implementations were very specific, we cannot provide a migration script.

## 0.16 to 0.17

In this version change, we decided to no longer recommend the container-component-pattern and therefore changed the folder structure of the project.

We did this because the previously introduced facades provide a more convenient way to interact with the state management and more and more logic was moved out of containers, hence removing all ngrx-related imports there.

You can run the migration by executing `node schematics/migration/0.16-to-0.17`.

The script will check if all your components can be moved to the new folder structure and will then perform the migration or notify you of work previously needed.
