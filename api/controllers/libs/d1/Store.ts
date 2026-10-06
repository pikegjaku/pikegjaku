import { AsyncLocalStorage } from 'node:async_hooks'

const Store = new AsyncLocalStorage<D1DatabaseSession>()

export default Store