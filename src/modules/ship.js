const Ship = function (length) {
    if (length < 1) length = 1
    if (length > 5) length = 5
    const Section = function () {
      const status = 'ok'
      return { status }
    }
    const makeBody = function (length) {
      const body = []
      for (let i = 0; i < length; i++) {
        body.push(Section())
      }
      return body
    }
    const body = makeBody(length)
    const hit = function (index) {
      body[index].status = 'hit'
    }
    const isSunk = function () {
      return body.every((x) => x.status === 'hit')
    }
  
    return { length, body, hit, isSunk }
  }
  
  export default Ship