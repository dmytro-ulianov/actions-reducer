import { PlainAction, FSA } from './action'

export const bindActions = <
  ActionsMap extends { [k: string]: Function },
  P = undefined,
  M = undefined
>(
  dispatch: (action: PlainAction) => any,
  actions: ActionsMap,
): ActionsMap => {
  const keys = Object.keys(actions)
  keys.forEach(key => {
    actions[key] = ((...args: [P, M]) => dispatch(actions[key](...args))) as (
      payload: P,
      meta: M,
    ) => FSA<P, M>
  })
  return actions
}
