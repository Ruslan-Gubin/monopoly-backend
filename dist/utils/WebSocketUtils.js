export function handleWebSocketMessage(ws, handlers, msg) {
    const message = JSON.parse(msg);
    const method = message.method;
    if (handlers[method]) {
        handlers[method].forEach((handler) => handler(ws, message));
    }
}
