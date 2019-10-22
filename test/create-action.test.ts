import {createAction} from '../src/create-action'

it('returns correct type via getType()', () => {
  const type = 'ping'
  expect(createAction(type).getType()).toBe(type)
})

it('returns correct type via toString()', () => {
  const type = 'ping'
  expect(createAction(type).toString()).toBe(type)
})

it('creates action', () => {
  const type = 'ping'
  expect(createAction(type)()).toEqual({type})
})

it('creates action with payload', () => {
  const payload = 42
  const type = 'add'
  expect(createAction<number>(type)(payload)).toEqual({type, payload})
})

it('creates action with payload and meta', () => {
  const meta = {ts: new Date()}
  const payload = 'new value'
  const type = 'update'
  expect(createAction<string, {ts: Date}>(type)(payload, meta)).toEqual({
    meta,
    payload,
    type,
  })
})

it('creates action with payload and error', () => {
  const error = true
  const payload = new Error('fail')
  const type = 'update'
  expect(createAction<string | Error>(type)(payload)).toEqual({
    error,
    payload,
    type,
  })
})

it('creates action with payload, meta and error', () => {
  const error = true
  const meta = {ts: new Date()}
  const payload = new Error('fail')
  const type = 'update'

  expect(createAction<string | Error, {ts: Date}>(type)(payload, meta)).toEqual(
    {error, meta, payload, type},
  )
})
