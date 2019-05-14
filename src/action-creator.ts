import { action, ActionType, FSA } from './action'

export function createAction(type: ActionType): () => FSA
export function createAction<P>(type: ActionType): (payload: P) => FSA<P>
export function createAction<P, M>(
  type: ActionType,
): (payload: P, meta: M) => FSA<P, M>

export function createAction<P = undefined, M = undefined>(type: ActionType) {
  const actionCreator = (payload?: P, meta?: M) => action(type, payload, meta)
  actionCreator.toString = () => type.toString()
  return actionCreator
}
