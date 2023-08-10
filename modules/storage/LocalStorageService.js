import { StorageService } from "./StorageService.js";

export default class LocalStorageService extends StorageService {
    #key
    constructor() {
        super()
        this.#key = "TEST-giffish"
    }
    async save(data) {
        const stats = await this.read()
        stats[data.date] = data
        localStorage.setItem(this.#key, JSON.stringify(stats))
    }
    async read() {
        const dataString = localStorage.getItem(this.#key) || "{}"
        return JSON.parse(dataString)
    }
}