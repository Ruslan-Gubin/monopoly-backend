class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}
export class CacheManager {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new Node('head', null);
        this.tail = new Node('tail', null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    getValueInKey(key) {
        const node = this.cache.get(key);
        if (!node) {
            return null;
        }
        this.moveToFront(node);
        return node.value;
    }
    addKeyInCache(key, value) {
        const node = this.cache.get(key);
        if (node) {
            node.value = value;
            this.moveToFront(node);
            return;
        }
        this.checkLength();
        const newNode = new Node(key, value);
        this.addToFront(newNode);
        this.cache.set(key, newNode);
    }
    removeKeyFromCache(key) {
        const node = this.cache.get(key);
        if (node) {
            this.removeNode(node);
            this.cache.delete(key);
        }
    }
    checkLength() {
        if (this.cache.size === this.capacity) {
            this.removeLast();
        }
    }
    moveToFront(node) {
        this.removeNode(node);
        this.addToFront(node);
    }
    addToFront(node) {
        node.next = this.head.next;
        if (node.next) {
            node.next.prev = node;
        }
        node.prev = this.head;
        this.head.next = node;
    }
    removeNode(node) {
        if (!node.next || !node.prev)
            return;
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    removeLast() {
        const lastNode = this.tail.prev;
        if (!lastNode || !lastNode.key)
            return;
        this.cache.delete(lastNode.key);
        this.removeNode(lastNode);
    }
}
export const nodeCache = new CacheManager(500);
