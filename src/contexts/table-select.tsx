"use client";

import React, { createContext, useCallback, useRef, useState } from "react";

export const TableSelectContext = createContext<any>({});

export const TableSelectProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const draggedIds = useRef<Set<string>>(new Set()); // {rowid}-{colid}

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // setDragStartValue(null);
    draggedIds.current.clear();
    document.body.style.userSelect = "";
  }, []);

  return (
    <TableSelectContext.Provider
      value={{
        isDragging,
        setIsDragging,
        handleMouseUp,
        draggedIds,
      }}
    >
      {children}
    </TableSelectContext.Provider>
  );
};
