import { LocalDate } from "./LocalDate.js";
import { Observable } from "./../utility/Observable.js"

export default class DateService extends Observable {
    constructor() {
        super()
        this.#startPolling()
    }
    daysSince(startDate) {
        // How many days since start date?
        const today = LocalDate.today()
        let nextDay = startDate.clone()
        let counter = 0
        while(today.isGreaterThan(nextDay)) {
            nextDay = nextDay.next()
            counter++;
        }
        return counter
    }
    #startPolling() {
        let lastDate = LocalDate.today()
        setInterval(() => {
            const today = LocalDate.today()
            if(today.isGreaterThan(lastDate)) {
                super.notifyAll(true)
                lastDate = today
            }
        }, 60_000)
    }
}
