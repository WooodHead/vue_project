const store = require('storejs')

export default {
  set(key, value) {
    if (value && typeof value === 'object') {
      value = JSON.stringify(value)
    }
    if (store.has(key)) {
      this.remove(key)
    }
    store.set(key, value)
  },
  get(key) {
    var str = store.get(key)
    if (str && str.length > 0 && (str.indexOf('{') > -1 || str.indexOf('[') > -1)) {
      return JSON.parse(str)
    }
    return str
  },
  remove(key) {
    store.remove(key)
  },
  clear() {
    store.clear()
  }
}
