# @featherweight/actions-reducer

### Install

`npm install --save @featherweight/actions-reducer`

### Usage

Supports Typescript.

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

const reducer = createReducer<State>(
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
```
