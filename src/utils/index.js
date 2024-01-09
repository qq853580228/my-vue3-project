export default {
  uniqueSlash: path => path.replace(/(https?:\/)|(\/)+/g, '$1$2'),
  simpleDebounce(fn, delay = 300) {
    let timer = null
    return function () {
      let args = arguments
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  },
}