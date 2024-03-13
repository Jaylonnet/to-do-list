const storageManager = () => {
    const populateStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    }

    const retrieveStorage = (key) => {
        return JSON.parse(localStorage.getItem(key))
    }

    return { populateStorage, retrieveStorage }
};

export default storageManager;