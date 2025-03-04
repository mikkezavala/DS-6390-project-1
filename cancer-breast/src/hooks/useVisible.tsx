import {RefObject, useEffect, useState} from "react";

export const useIsVisible = (ref: RefObject<any>) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);

    return isVisible;
};