const globalData = {
  navbar_current: 0,
  user: {}
}

export function set(key, val) {
  globalData[key] = val
}

export function get(key) {
  return globalData[key]
}