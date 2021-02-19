import asyncio
import socketio
import aiofiles
from aiocsv import AsyncDictReader
import json

uri = "ws://localhost:5678"
csv_path = "./data/line1.csv"

sio = socketio.AsyncClient()
queue = asyncio.Queue()


@sio.event
async def connect():
    print("Connection established")


@sio.event
async def disconnect():
    print("Disconnected from the server")


async def main():
    await sio.connect(uri)

    try:
        async with aiofiles.open(csv_path, mode="r", encoding="utf-8", newline="") as afp:
            async for row in AsyncDictReader(afp):
                await queue.put(row)
    except FileNotFoundError as err:
        print(f"File '{err.filename}' does not exist.")

    # Fake a client-side track recording
    await sio.emit("recordingStatusMessage", "start")

    while True:
        try:
            head = await asyncio.wait_for(queue.get(), 3)
            json_data = json.dumps(head)

            await sio.send(json_data)
            print(f"Message sent: {json_data}")

            await asyncio.sleep(1)
        except asyncio.exceptions.TimeoutError:
            print("Queue is empty, shutting down")
            quit()

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
    asyncio.get_event_loop().run_forever()
