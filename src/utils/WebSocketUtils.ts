import WebSocket from 'ws';

export function handleWebSocket(
  ws: WebSocket,
  handlers: { [key: string]: ((ws: WebSocket, message: any) => void | Promise<void>)[] },
  msg: string
): void {
  const message: any = JSON.parse(msg);
  const method = message.method;

  if (handlers[method]) {
    handlers[method].forEach((handler) => handler(ws, message));
  }
}