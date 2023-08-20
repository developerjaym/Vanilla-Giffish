class ToastMoods {
    static get HAPPY() {
        return "happy"
    }
    static get SAD() {
        return "sad"
    }
    static get NEUTRAL() {
        return "neutral"
    }
}

class ToastService {
    static DURATION = 4_000
    push(message, mood = ToastMoods.HAPPY) {
        const toast = document.createElement("dialog")
        toast.classList.add("toast")
        toast.classList.add(`toast--${mood}`)
        toast.textContent = message
        document.body.appendChild(toast)
        toast.show()
        window.setTimeout(() => {
            toast.remove()
        }, ToastService.DURATION)
    }
}

export {ToastMoods, ToastService}