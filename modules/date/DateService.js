import { LocalDate } from "./LocalDate.js";

export default class DateService {
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
}
