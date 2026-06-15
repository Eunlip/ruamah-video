"use client";

import React, { useCallback, useRef } from "react";

type LongPressEvent = React.PointerEvent | React.MouseEvent | React.TouchEvent | Event;

export function useLongPress(
    onLongPress: (e?: LongPressEvent) => void,
    onClick: (e?: LongPressEvent) => void,
    options: { delay?: number } = {}
) {
    const { delay = 500 } = options;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    const start = useCallback(
        (e: LongPressEvent) => {
            isLongPress.current = false;
            timerRef.current = setTimeout(() => {
                isLongPress.current = true;
                onLongPress(e);
            }, delay);
        },
        [onLongPress, delay]
    );

    const stop = useCallback((e: LongPressEvent) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent | React.TouchEvent | Event) => {
            if (isLongPress.current) {
                // If it was a long press, we prevent the normal click action
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            onClick(e as LongPressEvent);
        },
        [onClick]
    );

    return {
        onPointerDown: start,
        onPointerUp: stop,
        onPointerLeave: stop,
        onPointerCancel: stop,
        onContextMenu: (e: React.MouseEvent | React.TouchEvent | Event) => e.preventDefault(), // Mencegah menu konteks bawaan browser muncul di PC
        onClick: handleClick,
    };
}
