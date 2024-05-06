// Define a simple PriorityQueue class for Dijkstra's algorithm
class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(element, priority) {
      this.queue.push({ element, priority });
      this.sort();
    }
  
    dequeue() {
      if (!this.isEmpty()) {
        return this.queue.shift().element;
      }
      return null;
    }
  
    sort() {
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  
    changePriority(element, newPriority) {
      const index = this.queue.findIndex(item => item.element === element);
      if (index !== -1) {
        this.queue[index].priority = newPriority;
        this.sort();
      }
    }
  }