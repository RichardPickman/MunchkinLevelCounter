export const useLocalStorage = {
    value: '',
    setItem(key, value) {
        this.value = globalThis.localStorage.setItem(key, value)

        return this.value
    },
    getItem(key) {
        this.value = globalThis.localStorage.getItem(key)

        if (!this.value) return ''
        else return this.value
    }
}
