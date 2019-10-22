import {createAction} from '../src/create-action'
import {createReducer, createReducerWithState} from '../src/create-reducer'
import {HandlerOf} from '../src/types'

type State = {count: number; flag: boolean}

const initialState: State = {count: 0, flag: false}

const actions = {
  add: createAction<number>('add'),
  inc: createAction('inc'),
  mul: createAction<number, {toggle: boolean}>('mul'),
}

it('handles actions', () => {
  const reducer = createReducer(
    on => [
      on(actions.add, (state, action) => {
        return {...state, count: state.count + action.payload}
      }),
      on(actions.inc, state => {
        return {...state, count: state.count + 1}
      }),
      on(actions.mul, (state, action) => {
        return {
          ...state,
          count: state.count * action.payload,
          flag: action.meta.toggle ? !state.flag : state.flag,
        }
      }),
    ],
    initialState,
  )

  expect(reducer()).toEqual(initialState)

  const addAction = actions.add(10)
  expect(reducer(initialState, addAction)).toEqual({
    ...initialState,
    count: initialState.count + addAction.payload,
  })

  const mulAction = actions.mul(2, {toggle: true})
  expect(reducer(initialState, mulAction)).toEqual({
    ...initialState,
    count: initialState.count * mulAction.payload,
    flag: !initialState.flag,
  })

  const skippedAction = {type: 'unknown'}
  expect(reducer(initialState, skippedAction)).toEqual(initialState)
})

it('accepts handlers dynamically', () => {
  const reducer = createReducerWithState<State>()

  const skippedAddAction = actions.add(10)
  expect(reducer(initialState, skippedAddAction)).toEqual(initialState)

  const addHandler: HandlerOf<State, typeof actions.add> = (state, action) => {
    return {...state, count: state.count + action.payload}
  }
  reducer.on(actions.add, addHandler)

  const addAction = actions.add(100)
  expect(reducer(initialState, addAction)).toEqual({
    ...initialState,
    count: initialState.count + addAction.payload,
  })
})
