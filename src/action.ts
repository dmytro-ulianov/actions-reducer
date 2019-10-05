import {ActionType, FSA} from './types'

export function action(type: ActionType): FSA

export function action<P>(type: ActionType, payload: P): FSA<P>

export function action<P, M>(type: ActionType, payload: P, meta: M): FSA<P, M>

export function action<P = undefined, M = undefined>(
  type: ActionType,
  payload?: P,
  meta?: M,
) {
  const action: any = {type}
  if (payload) action.payload = payload
  if (meta) action.meta = meta
  if (payload instanceof Error) action.error = true
  return action
}
