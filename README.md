## Boat Tracking App

### About

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Track your boat's movement from any device with a web browser. Create or read records of position data with a press of a button.

The application uses WebSocket connections to efficiently deal with real-time events across multiple clients.

#### MockApp

A simple mock application written in **Python** that streams boat position data to connected clients over socket.io in JSON format.

The program runs an `asyncio` event loop until its task is finished. The provided CSV files are processed into JSON "messages" and sent to the server at 1 Hz rate. API:

```json
{
  "lat": "48.21339894",
  "lon": "20.73998593",
  "heading": "3.470315226"
}
```

####

An Express.js server that listens to ...

### Tech used / Dependencies

- Add-on packages include:
  - [Express](https://www.npmjs.com/package/express)
  - [socket.io](https://www.npmjs.com/package/socket.io)
  - [OpenLayers](https://www.npmjs.com/package/ol)
  - [TypeScript](https://www.npmjs.com/package/typescript)
  - [asyncio](https://pypi.org/project/asyncio/)

![Demo image](./demo-image.png)
