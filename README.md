# Featherweight actions reducer

## Setup

`npm install --save @featherweight/actions-reducer`

## Usage

```ts
import {createAction, createReducer} from '@featherweight/actions-reducer'

/* Define your actions */
const increment = createAction('counter: increment')
const add = createAction<number>('counter: add')

/* Create reducer */
const initialCounter = 0
const reducer = createReducer(
  on => [
    on(increment, state => state + 1),
    on(add, ((state, action) = state + action.payload)),
  ],
  initialCounter,
)

/* All set, you can use reducer */
const reduxStore = createStore(reducer)

/* Also you can define your handlers outside of reducer using HandlerOf type */
const decrement = createAction('counter: decrement')
const decrementHandler: HandlerOf<
  typeof initialState,
  typeof decrement
> = state => state - 1

/* And you can attach handlers to your reducer dynamically */
reducer.on(decrement, decrementHandler)

/* It supports meta and error fields as well */
const allInOne = createAction<string | Error, {flag: boolean}>('all in one')
allInOne(new Error('nope'), {flag: true})
```

## API

### `action`

Flux Standard Action compatible action.

##### `<P, M>(type: ActionType, payload: P, meta: M) => FSA<P, M>`

```ts
import {action} from '@featherweight/actions-reducer'

action('plain action')
// {type: 'plain action'}

action('with payload', {ping: 'pong'})
// {type: 'with payload', payload: {ping: 'pong'}}

action('with meta', 42, {hi: 'there'})
// {type: 'with payload', payload: 42, meta: {hi: 'there'}}
```

### `createAction`

Action creator factory.

##### `<P, M>(type: ActionType) => (payload?: P, meta?: M) => FSA<P, M>`

```ts
import {createAction} from '@featherweight/actions-reducer'

const ping = createAction('ping')
ping()
// {type: 'ping'}

const setValue = createAction<number>('set value')
setValue(300)
// {type: 'set value', payload: 300}

const fetchUser = createAction<string, {ts: Date}>('fetch user')
fetchUser('user-id', {ts: new Date()})
// {type: 'fetch user', payload: 'user-id', meta: {ts: Date}}
```

### `createReducer`

Reducer creator with type inference.

##### `<S>(createHandlers: (on: Handler<S>) => HandlerTuple<S>[], initialState?: S) => Reducer`

```ts
import {createAction, createReducer} from '@featherweight/actions-reducer'

const actions = {
  ping: createAction('ping'),
  setValue: createAction<number>('set value'),
}

const initialState = {pinged: false, value: 0}

const reducer = createReducer(
  on => [
    on(actions.ping, (state, action) => {
      return {...state, pinged: true}
    }),
    on(actions.setValue, (state, action) => {
      return {...state, value: action.payload}
    }),
  ],
  initialState,
)

// you can omit initialState if you want to provide it later
// like using React.useReducer hook: useReducer(reducer, initialState)
// but you might want to provide State as a type parameter to have type checking
type State = {pinged: boolean}
const reducer = createReducer<State>(on => [
  on(actions.ping, (state, action) => ({...state, pinged: true})),
  /* ... */
])
```

### `createReducerWithState`

The same as `createReducer` but you can only attach handlers dynamically.

##### `<S>(initialState?: S) => Reducer & {on: Handler<S>}`

```ts
import {
  createAction,
  createReducerWithState,
} from '@featherweight/actions-reducer'

const initialState = {pinged: false, value: 0}

const reducer = createReducerWithState(initialState)

const ping = createAction('ping')
reducer.on(ping, (state, action) => ({...state, pinged: true}))

const setValue = createAction<number>('set value')
reducer.on(setValue, (state, action) => ({...state, value: action.payload}))

// you can use createReducerWithState without providing initialState
// (the same way as createReducer)
type State = {pinged: boolean}
const reducer = createReducerWithState<State>()
```

### `helpful types`

This package also includes some types, that might be useful in some situations.

`HandlerOf` type is useful when you want to define your handler outside of reducer

```ts
import {
  createAction,
  createReducer,
  HandlerOf,
} from '@featherweight/actions-reducer'

type State = {count: number}
const add = createAction<number>('add')
const addHandler: HandlerOf<State, typeof add> = (state, action) => {
  return {...state, count: state.count + action.payload}
}

// you can use it later in reducer
const reducer = createReducer(on => [on(add, addHandler)], {count: 0})
```

`ActionOf` type is useful when you want to use your action creator return type

```ts
import {ActionOf, createAction} from '@featherweight/actions-reducer'
import {takeLatest} from 'redux-saga/effects'

type FetchUserPayload = {id: string; search: Record<string, string>}
const fetchUser = createAction<FetchUserPayload>('fetch user')

function* rootSaga() {
  yield takeLatest(fetchUser, fetchUserSaga)
}
function* fetchUserSaga(action: ActionOf<typeof fetchUser>) {
  action.payload.id // string
  action.paylaod.search // Record<string, string>
  /* ... */
}
```
