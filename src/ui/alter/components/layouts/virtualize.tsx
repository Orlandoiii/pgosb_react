import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';

interface VirtualizeProps {
  fatherRef: MutableRefObject<HTMLDivElement | undefined>,
  children: React.ReactNode[]
}

export function Virtualize({ fatherRef, children }: VirtualizeProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [itemHeight, setItemHeight] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const overScan = 12;

  useEffect(() => {
    if (!fatherRef.current || children.length === 0 || itemHeight === null) return;
    const scrollContainer = fatherRef.current.closest(".overflow-y-auto");
    setContainerHeight(scrollContainer?.clientHeight ?? 0);

    fatherRef.current.style.height = `${children.length * itemHeight}px`;

    const handleScroll = (e: Event) => {
      const height = (e.currentTarget as HTMLElement)?.scrollTop ?? 0;
      setStartIndex(Math.max(0, Math.floor((height / itemHeight)) - overScan));
    };

    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [fatherRef.current, children.length, itemHeight]);

  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null && itemHeight == null) {
      setItemHeight(node.clientHeight);
    }
  }, []);

  const visibleItems = itemHeight ? Math.floor((containerHeight / itemHeight) + (overScan * 2)) : 0;

  if (itemHeight === null) {
    const node = children[0];
    if (React.isValidElement(node)) {
      return React.cloneElement(node as any, { key: 0, ref: measureRef });
    }
    return null;
  }

  return <>
    {children.map((node, index) => {
      if (index >= startIndex && index < startIndex + visibleItems) {
        if (React.isValidElement(node)) {
          return React.cloneElement(node as any, {
            key: index,
            style: { position: 'absolute', left: 0, top: index * itemHeight, ...node.props.style },
          });
        }
      }
      return null;
    })}
  </>;
}