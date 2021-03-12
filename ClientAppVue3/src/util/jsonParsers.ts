export const positionMessageParser = (msg: string) => {
  try {
    return JSON.parse(msg, (k, v) => {
      return (typeof v === "object" || isNaN(v)) ? v : parseFloat(v)
    })
  } catch (err) {
    if (!(err.name === 'SyntaxError')) {
      throw Error(err.message)
    }
  }
}
