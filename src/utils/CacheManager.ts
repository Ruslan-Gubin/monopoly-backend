
class Node<T> {
  key: string;
  value: T | null;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(key: string, value: T | null ) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class CacheManager<T> {
  capacity: number;
  cache: Map<string, Node<T>>
  head: Node<T>;
  tail: Node<T>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new Node<T>('head', null);
    this.tail = new Node<T>('tail', null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public getValueInKey(key: string): T | null {
    const node: Node<T> | undefined = this.cache.get(key);

    if (!node) {
      return null;
    }

    this.moveToFront(node);
    return node.value;
  }

 public addKeyInCache(key: string, value: T): void {
    const node = this.cache.get(key) as Node<T> | undefined;
    
    if (node) {
      node.value = value;
      this.moveToFront(node);
      return;
    }

    this.checkLength();
    const newNode = new Node<T>(key, value);
    this.addToFront(newNode);
    this.cache.set(key, newNode);
  }

  public removeKeyFromCache(key: string): void {
    const node = this.cache.get(key) as Node<T> | undefined;
    
    if (node) {
      this.removeNode(node);
      this.cache.delete(key);
    }
  }

  private checkLength(): void {
    if (this.cache.size === this.capacity) {
      this.removeLast(); 
    }
  }

  private moveToFront(node: Node<T>): void {
    this.removeNode(node);
    this.addToFront(node);
  }

  private addToFront(node: Node<T>): void {
    node.next = this.head.next;
    if (node.next) {
      node.next.prev = node;
    }
    node.prev = this.head;
    this.head.next = node;
  }

  private removeNode(node: Node<T>): void {
    if (!node.next || !node.prev) return;

    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  private removeLast(): void {
    const lastNode = this.tail.prev;
    if (!lastNode || !lastNode.key) return;

    this.cache.delete(lastNode.key);
    this.removeNode(lastNode);
  }
}

export const nodeCache = new CacheManager<any>(500)
