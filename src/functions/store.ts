const store: { [key: string]: string} = {};

interface Keys {
    baseUrl: string;
    apiKey: string;
}

export const storeKeys: Keys = {
    baseUrl: "baseUrl",
    apiKey: "apiKey"
};

store[storeKeys.baseUrl] = "http://localhost:8080/api/v1";

export const getStoreValue = (key: string) => {
    return store[key];
}