# @featherweight/actions-reducer

### Install

`npm install --save @featherweight/actions-reducer`

### Usage

Supports Typescript, so you will have powerful autocomplete in your handlers.

```typescript
import {createAction, createReducer} from '@featherweight/actions-reducer'

type State = {
  count: number
  name: string
}

const initialState: State = {
  count: 0,
  name: 'Ryan Gosling',
}

const actions = {
  add: createAction<number>('add'),
  reset: createAction('reset'),
  update: createAction<Partial<State>>('update-all'),
}

const simpleReducer = createReducer<State>(
  on => [
    on(actions.reset, () => initialState),
    on(actions.add, (state, {payload}) => ({
      ...state,
      count: state.count + payload,
    })),
    on(actions.update, (state, {payload}) => ({...state, ...payload})),
  ],
  initialState,
)

import {add, always, evolve, merge} from 'ramda'

const fancyReducerWithRamda = createReducer<State>(
  on => [
    on(actions.reset, always(initialState)),
    on(actions.add, (s, a) => evolve({count: add(a.payload)}, s)),
    on(actions.update, (s, a) => merge(s, a.payload)),
  ],
  initialState,
)
```

If you want to use your reducer with React `useReducer` hook you can omit initialState in `createReducer`
```typescript
const reducer = createReducer<State>(on => [
  on(actions.reset, always(initialState)),
  on(actions.add, (s, a) => evolve({count: add(a.payload)}, s)),
  on(actions.update, (s, a) => merge(s, a.payload)),
])

const useMyReducer = () => {
  return React.useReducer(reducer, initialState)
}
```
