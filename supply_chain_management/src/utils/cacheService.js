// src/utils/cacheService.js

export const CacheService = {
    /**
     * 
     * @param {string} key 
     * @param {any} data 
     * @param {number} ttlMinutes 
     */
    set(key, data, ttlMinutes = 15) {
        const now = new Date()
        const item = {
            data: data,

            expiry: now.getTime() + (ttlMinutes * 60 * 1000)
        }
        localStorage.setItem(key, JSON.stringify(item))
    },

    /**
     *
     * 
     * @param {string} key 
     * @returns {any|null}
     */
    get(key) {
        const itemStr = localStorage.getItem(key)

        if (!itemStr) return null

        const item = JSON.parse(itemStr)
        const now = new Date()

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }

        return item.data
    },

    /**
     * Create/Update/Delete
     * @param {string} key 
     */
    remove(key) {
        localStorage.removeItem(key)
    },


    clearAll() {
        localStorage.clear()
    }
}