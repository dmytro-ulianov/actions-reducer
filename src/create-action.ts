import {action} from './action'
import {ActionCreator, ActionType} from './types'

export function createAction(type: ActionType): ActionCreator

export function createAction<P>(type: ActionType): ActionCreator<P>

export function createAction<P, M>(type: ActionType): ActionCreator<P, M>

export function createAction<P = undefined, M = undefined>(type: ActionType) {
  const actionCreator = (payload?: P, meta?: M) => action(type, payload, meta)
  const getType = () => type
  actionCreator.getType = getType
  actionCreator.toString = getType
  return actionCreator
}
