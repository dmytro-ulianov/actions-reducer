export type ActionType = string | Symbol

export type PlainAction = { type: ActionType }
export type ActionWithPayload<P> = PlainAction & { payload: P }
export type ActionWithPayloadAndMeta<P, M> = ActionWithPayload<P> & { meta: M }

export type FSA<P = undefined, M = undefined> = P extends undefined
  ? PlainAction
  : M extends undefined
  ? ActionWithPayload<P>
  : ActionWithPayloadAndMeta<P, M>

export function action(type: ActionType): FSA
export function action<P>(type: ActionType, payload: P): FSA<P>
export function action<P, M>(type: ActionType, payload: P, meta: M): FSA<P, M>
export function action<P = undefined, M = undefined>(
  type: ActionType,
  payload?: P,
  meta?: M,
) {
  return { type, payload, meta }
}
