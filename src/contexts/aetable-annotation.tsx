"use client";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
} from "react";

interface AETableAnnotationContextType {
  tabName: string;
}
