import cdn from '@q/qcdn'

class Cdn {
  constructor () {

  }

  codeMin (code, type) {
    return cdn.min(code, type)
  }

  upload (files) {
    return cdn.upload(files)
  }

}

export {
  Cdn
}