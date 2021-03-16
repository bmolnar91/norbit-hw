import { PositionRecord } from '@/common/positionRecord'

export const rawPositionMessageParser = (msg: string): object | undefined => {
  try {
    return JSON.parse(msg, (k, v) => {
      return typeof v === 'object' || isNaN(v) ? v : parseFloat(v)
    })
  } catch (err) {
    if (!(err.name === 'SyntaxError')) {
      throw Error(err.message)
    }
  }
}

export const positionMessageParser = (
  message: PositionMessage
): PositionRecord => {
  return {
    lat: parseFloat(message.lat),
    lon: parseFloat(message.lon),
    heading: parseFloat(message.heading)
  } as PositionRecord
}

export const positionMessagesParser = (
  messages: PositionMessage[]
): PositionRecord[] => {
  return messages.map(message => {
    return positionMessageParser(message)
  })
}

export type PositionMessage = {
  lat: string
  lon: string
  heading: string
}
