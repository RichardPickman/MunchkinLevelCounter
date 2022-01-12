import { useState } from "react";

export const useLocalStorage = (key) => {
    const [value] = useState(() => {
        // почитай про globalThis, это новая фича языка
        return globalThis.localStorage && globalThis.localStorage.getItem(key)
    });

    return value;
}

