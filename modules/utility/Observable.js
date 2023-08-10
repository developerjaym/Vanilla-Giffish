export class Observable {
    #observers
    constructor() {
        this.#observers = []
    }
    subscribe(observer) {
        this.#observers.push(observer)
    }
    notifyAll(event) {
        event = structuredClone(event)
        this.#observers.forEach(observer => observer(event))
    }
}