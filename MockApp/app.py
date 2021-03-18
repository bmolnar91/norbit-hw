import sys
import random
import asyncio
import socketio
from aiohttp import web
import aiofiles
from aiocsv import AsyncDictReader
import json


sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)


@sio.event
async def connect(sid, environ):
    print(sid, 'connected')


@sio.event
async def disconnect(sid):
    print(sid, 'disconnected')


async def process_and_emit_data():
    random_line_number = random.randint(1, 3)
    csv_path = f'./data/line{random_line_number}.csv'

    if len(sys.argv) > 1:
        csv_path = f'./data/line{sys.argv[1]}.csv'

    queue = asyncio.Queue()
    
    try:
        async with aiofiles.open(csv_path, mode='r', encoding='utf-8', newline='') as afp:
            async for row in AsyncDictReader(afp):
                await queue.put(row)
    except FileNotFoundError as err:
        print(f'File "{err.filename}" does not exist.')

    while True:
        try:
            head = await asyncio.wait_for(queue.get(), 3)
            json_data = json.dumps(head)

            await sio.send(json_data)
            print(f'Message sent: {json_data}')

            await asyncio.sleep(1)
        except asyncio.exceptions.TimeoutError:
            print('Queue is empty, shutting down')
            quit()

def main():
    loop = asyncio.get_event_loop()
    handler = app.make_handler()
    coroutine = loop.create_server(handler, '0.0.0.0', 8765)
    server = loop.run_until_complete(coroutine)

    print('Serving on http://%s:%s' % server.sockets[0].getsockname())

    try:
        loop.run_until_complete(process_and_emit_data())
        loop.run_forever()
    except KeyboardInterrupt:
        quit()


if __name__ == '__main__':
    main()
