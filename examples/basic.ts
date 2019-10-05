import {
  createAction,
  createReducer,
  createReducerWithState,
  HandlerOf,
} from '../src'

type Status = 'idle' | 'loading' | 'succeded' | 'failed'

type User = {
  age: number
  name: string
  surname: string
}

type State = {
  value: User | undefined
  status: Status
}

const initialState: State = {
  status: 'idle',
  value: undefined,
}

const reducer = createReducerWithState(initialState)

const setUser = createAction<User>('set user')
reducer.on(setUser, (state, action) => {
  return {...state, user: action.payload}
})

const setStatus = createAction<Status>('set status')
const onSetStatus: HandlerOf<State, typeof setStatus> = (state, action) => {
  return {...state, status: action.payload}
}
reducer.on(setStatus, onSetStatus)

export const allInOneReducer = createReducer(
  on => [
    on(setUser, (s, a) => ({...s, user: a.payload})),
    on(setStatus, (s, a) => ({...s, status: a.payload})),
  ],
  initialState,
)

export const reactHookReducer = createReducer<State>(on => [
  on(setUser, (s, a) => ({...s, user: a.payload})),
  on(setStatus, (s, a) => ({...s, status: a.payload})),
])
