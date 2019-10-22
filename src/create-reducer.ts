import {
  ActionCreator,
  FSA,
  HandlerCreator,
  Handlers,
  HandlerTuple,
  Reducer,
} from './types'

export const on = <S, P = undefined, M = undefined>(
  action: ActionCreator<P, M>,
  reducer: Reducer<S, FSA<P, M>>,
): HandlerTuple<S, P, M> => {
  return [action.getType(), reducer]
}

export function createReducer<S = undefined>(
  createHandlers: (on: HandlerCreator<S>) => HandlerTuple<S>[],
  initialState?: S,
) {
  const actionHandlersMap = createHandlers(on).reduce(
    (actionMap, [actionType, actionHandler]) => {
      actionMap[actionType] = actionHandler
      return actionMap
    },
    {} as Handlers<S>,
  )

  const reducer = <Action extends FSA>(
    state: S = initialState as S,
    action?: Action,
  ) => {
    if (action) {
      const handler = action && actionHandlersMap[action.type]
      return handler ? handler(state, action) : state
    }
    return state
  }

  reducer.on = <P = undefined, M = undefined>(
    action: ActionCreator<P, M>,
    handleAction: Reducer<S, FSA<P, M>>,
  ) => {
    const [type, handler] = on(action, handleAction)
    actionHandlersMap[type] = handler
    return reducer
  }

  return reducer
}

export function createReducerWithState<S>(initialState?: S) {
  const actionMap: Handlers<S> = {}

  const reducer = <Action extends FSA>(
    state: S = initialState as S,
    action?: Action,
  ) => {
    if (action) {
      const handler = action && actionMap[action.type]
      return handler ? handler(state, action) : state
    }
    return state
  }

  reducer.on = <P = undefined, M = undefined>(
    action: ActionCreator<P, M>,
    handleAction: Reducer<S, FSA<P, M>>,
  ) => {
    const [type, handler] = on(action, handleAction)
    actionMap[type] = handler
    return reducer
  }

  return reducer
}
