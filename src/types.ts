export type ActionType = string

export type FSA<P = undefined, M = undefined> = P extends undefined
  ? (M extends undefined ? {type: ActionType} : {type: ActionType; meta: M})
  : P extends Error
  ? (M extends undefined
      ? {type: ActionType; payload: P; error: true}
      : {type: ActionType; payload: P; meta: M; error: true})
  : (M extends undefined
      ? {type: ActionType; payload: P}
      : {type: ActionType; payload: P; meta: M})

export type Typed = {getType: () => string}

export type ActionCreator<P = undefined, M = undefined> = (P extends undefined
  ? () => FSA
  : (M extends undefined
      ? (payload: P) => FSA<P>
      : (payload: P, meta: M) => FSA<P, M>)) &
  Typed

export type Reducer<S, A extends FSA<any, any> = FSA<any, any>> = (
  state: S,
  action: A,
) => S

export type Handlers<S, A extends FSA = any> = Record<string, Reducer<S, A>>

export type HandlerTuple<S, P = any, M = any> = readonly [
  ActionType,
  Reducer<S, FSA<P, M>>,
]

export type HandlerCreator<S> = <P = undefined, M = undefined>(
  action: ActionCreator<P, M>,
  reducer: Reducer<S, FSA<P, M>>,
) => HandlerTuple<S, P, M>

type Fn = (...args: any) => any

export type ActionOf<Action extends Fn> = ReturnType<Action>

export type HandlerOf<State, Action extends Fn> = (
  state: State,
  action: ActionOf<Action>,
) => State
