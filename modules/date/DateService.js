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
            const isNewDay  = today.isGreaterThan(lastDate)
            const countdown = this.#convertMillisecondsToString(lastDate.millisecondsUntilNextDate())
            super.notifyAll({countdown, isNewDay })
            if(isNewDay) {
                lastDate = today
            }
        }, 100)
    }
    #convertMillisecondsToString(ms) {
        const seconds = ms / 1000;
        const hours = seconds / 3600
        const minutes = (hours - Math.floor(hours)) * 60
        return `${LocalDate.pad(Math.floor(hours))}:${LocalDate.pad(Math.floor(minutes))}`
      }
}
