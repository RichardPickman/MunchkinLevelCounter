import { useState } from "react";

export const useLocalStorage = (type: string, key: string, value?: string) => {
    switch (type) {
        case 'get': {
            const [value] = useState(() => {
                // почитай про globalThis, это новая фича языка
                return globalThis.localStorage && globalThis.localStorage.getItem(key)
            });

            return value
        }
        case 'set':
            globalThis.localStorage && globalThis.localStorage.setItem(key, value)
    }
}

