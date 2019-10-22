import {action} from '../src/action'

it('creates action', () => {
  const type = 'plain action'
  expect(action(type)).toEqual({type})
})

it('creates action with payload', () => {
  const payload = 42
  const type = 'action with payload'
  expect(action(type, payload)).toEqual({type, payload})
})

it('creates action with payload and meta', () => {
  const meta = {ts: new Date()}
  const payload = 42
  const type = 'action with payload and meta'
  expect(action(type, payload, meta)).toEqual({type, payload, meta})
})

it('creates action with payload and error', () => {
  const error = true
  const payload = new Error('wow!')
  const type = 'action with payload and error'
  expect(action(type, payload)).toEqual({type, payload, error})
})

it('creates action with payload, meta and error', () => {
  const error = true
  const meta = {ping: 'pong'}
  const payload = new Error('wow!')
  const type = 'action with payload'
  expect(action(type, payload, meta)).toEqual({type, payload, meta, error})
})
