import { useCallback, useEffect, useRef, useState } from "react";

export const useOnScreen = (options, refUpdate) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const callbackFunction = useCallback(
        (entries) => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
        },
        [containerRef, setIsVisible]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFunction, options);
        if (containerRef.current) observer.observe(containerRef?.current);

        return () => {
            if (containerRef.current) observer.unobserve(containerRef?.current);
        };
    }, [containerRef, options, refUpdate]);

    return { isVisible, container: containerRef };
};
