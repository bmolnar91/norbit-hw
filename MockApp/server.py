import websockets
import asyncio
import aiofiles
from aiocsv import AsyncDictReader


csv_path = "./data/line1.csv"
queue = asyncio.Queue()


async def stream_data(websocket, _):
    try:
        async with aiofiles.open(csv_path, mode="r", encoding="utf-8", newline="") as afp:
            async for row in AsyncDictReader(afp):
                await queue.put(row)
    except FileNotFoundError as err:
        print(f"File '{err.filename}' does not exist.")

    while True:
        try:
            head = await asyncio.wait_for(queue.get(), 3)
            await websocket.send(str(head))
            await asyncio.sleep(1)
        except asyncio.exceptions.TimeoutError:
            print("Queue is empty, shutting down...")
            quit()

if __name__ == '__main__':
    start_server = websockets.serve(stream_data, "127.0.0.1", 5678)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
