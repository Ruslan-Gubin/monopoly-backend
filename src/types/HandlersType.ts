import WebSocket from 'ws';

export type HandlersType = { [key: string]: ((ws: WebSocket, message: any) => void | Promise<void>)[] };
