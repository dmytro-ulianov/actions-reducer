import {
  action,
  createAction,
  createReducer,
  createReducerWithState,
} from '../src'

describe('action()', () => {
  it('creates action', () => {
    const type = 'plain action'
    expect(action(type)).toEqual({type})
  })
  it('creates action with payload', () => {
    const type = 'action with payload'
    const payload = 42
    expect(action(type, payload)).toEqual({type, payload})
  })
  it('creates action with payload and meta', () => {
    const type = 'action with payload'
    const payload = 42
    const meta = {ts: new Date()}
    expect(action(type, payload, meta)).toEqual({type, payload, meta})
  })
  it('creates action with error and meta', () => {
    const type = 'action with payload'
    const payload = new Error('wow!')
    const error = true
    expect(action(type, payload)).toEqual({type, payload, error})
  })
  it('creates action with error and meta', () => {
    const type = 'action with payload'
    const payload = new Error('wow!')
    const meta = {ping: 'pong'}
    const error = true
    expect(action(type, payload, meta)).toEqual({type, payload, meta, error})
  })
})

describe('createAction()', () => {
  it('returns type via getType()', () => {
    const type = 'ping'
    const ping = createAction(type)
    expect(ping.getType()).toBe(type)

    const symbol = 'pong'
    const pong = createAction(Symbol(symbol))
    expect(pong.getType()).toBe(`Symbol(${symbol})`)
  })
  it('returns type via toString()', () => {
    const type = 'ping'
    const ping = createAction(type)
    expect(ping.toString()).toBe(type)

    const symbol = 'pong'
    const pong = createAction(Symbol(symbol))
    expect(pong.toString()).toBe(`Symbol(${symbol})`)
  })
  it('creates action', () => {
    const type = 'ping'
    const ping = createAction(type)
    expect(ping()).toEqual({type})
  })
  it('creates action with payload', () => {
    const type = 'add'
    const payload = 42
    const add = createAction<number>(type)
    expect(add(payload)).toEqual({type, payload})
  })
  it('creates action with payload and meta', () => {
    const type = 'update'
    const payload = 'new value'
    const meta = {ts: new Date()}
    const update = createAction<string, {ts: Date}>(type)
    expect(update(payload, meta)).toEqual({type, payload, meta})
  })
  it('creates action with error', () => {
    const type = 'update'
    const payload = new Error('fail')
    const update = createAction<string | Error>(type)
    expect(update(payload)).toEqual({type, payload, error: true})
  })
  it('creates action with error and meta', () => {
    const type = 'update'
    const payload = new Error('fail')
    const meta = {ts: new Date()}
    const update = createAction<string | Error, {ts: Date}>(type)
    expect(update(payload, meta)).toEqual({type, payload, meta, error: true})
  })
})

describe('createReducer()', () => {
  type State = {count: number}

  const initialState: State = {count: 0}

  const actions = {
    add: createAction<number>('add'),
    inc: createAction('inc'),
  }

  it('handles actions', () => {
    const reducer = createReducer(
      on => [
        on(actions.add, (state, action) => {
          return {...state, count: state.count + action.payload}
        }),
      ],
      initialState,
    )

    expect(reducer()).toEqual(initialState)

    expect(reducer(initialState, actions.add(10))).toEqual({
      ...initialState,
      count: initialState.count + 10,
    })

    expect(reducer(initialState, {type: 'unknown'})).toEqual(initialState)
  })

  it('attaches handlers dynamically', () => {
    const reducer = createReducer<State>(() => [])

    expect(reducer(initialState, actions.inc())).toEqual(initialState)

    reducer
      .on(actions.inc, state => ({...state, count: state.count + 1}))
      .on(actions.add, (state, action) => ({
        ...state,
        count: state.count + action.payload,
      }))

    expect(reducer(initialState, actions.inc())).toEqual({
      ...initialState,
      count: initialState.count + 1,
    })
    expect(reducer(initialState, actions.add(100))).toEqual({
      ...initialState,
      count: initialState.count + 100,
    })
  })
})

describe('createReducerWithState()', () => {
  type State = {count: number}

  const initialState: State = {count: 0}

  const actions = {
    add: createAction<number>('add'),
    inc: createAction('inc'),
  }

  it('handles actions', () => {
    const reducer = createReducerWithState<State>()

    expect(reducer(initialState, actions.inc())).toEqual(initialState)

    reducer
      .on(actions.inc, state => ({...state, count: state.count + 1}))
      .on(actions.add, (state, action) => ({
        ...state,
        count: state.count + action.payload,
      }))

    expect(reducer(initialState, actions.inc())).toEqual({
      ...initialState,
      count: initialState.count + 1,
    })
    expect(reducer(initialState, actions.add(100))).toEqual({
      ...initialState,
      count: initialState.count + 100,
    })
  })
})
