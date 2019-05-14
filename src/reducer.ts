import {ActionType, FSA, PlainAction} from './action'

type Reducer<S, A extends FSA> = (state: S, action: A) => S

type HandlerTuple<S, P = undefined, M = undefined> = [
  ActionType,
  Reducer<S, FSA<P, M>>
]

type Handler<S> = <P = undefined, M = undefined>(
  action: (payload: P, meta: M) => FSA<P, M>,
  reducer: Reducer<S, FSA<P, M>>,
) => HandlerTuple<S>

const on = <S, P = undefined, M = undefined>(
  action: (payload: P, meta: M) => FSA<P, M>,
  reducer: Reducer<S, FSA<P, M>>,
): HandlerTuple<S> => {
  return [action.toString(), reducer] as HandlerTuple<S>
}

type HandlerMap<State> = {
  [key: string]: Reducer<State, PlainAction>
}

export function createReducer<S = undefined>(
  createHandlers: (on: Handler<S>) => HandlerTuple<S>[],
  initialState?: S,
) {
  const actionPairs = createHandlers(on)
  const actionMap = actionPairs.reduce(
    (actionMap, actionPair) => {
      actionMap[actionPair[0].toString()] = actionPair[1]
      return actionMap
    },
    {} as HandlerMap<S>,
  )
  return (state: S = initialState as S, action?: FSA) => {
    if (action) {
      const handler = action && actionMap[action.type.toString()]
      return handler ? handler(state, action) : state
    }
    return state
  }
}
