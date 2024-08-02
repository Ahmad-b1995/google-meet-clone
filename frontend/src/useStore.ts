import create from "zustand";
import { IApiResponse } from "./types";

interface AppState {
  teacherApiResponse: IApiResponse | null;
  studentApiResponse: IApiResponse | null;
  setTeacherApiResponse: (response: IApiResponse) => void;
  setStudentApiResponse: (response: IApiResponse) => void;
}

export const useStore = create<AppState>((set) => ({
  teacherApiResponse: null,
  studentApiResponse: null,
  setTeacherApiResponse: (response) => set({ teacherApiResponse: response }),
  setStudentApiResponse: (response) => set({ studentApiResponse: response }),
}));
