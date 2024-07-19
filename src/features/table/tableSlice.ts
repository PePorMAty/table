import { createSlice } from "@reduxjs/toolkit";
import { initalStateTableInterface } from "./tableTypes";
import { RootState } from "../../app/store";

const mockData = [
  {
    id: 1,
    company: "Адепт",
    address: "Нижний новгород",
  },
  {
    id: 2,
    company: "Компания 2",
    address: "Адрес 2",
  },
  {
    id: 3,
    company: "Компания 3",
    address: "Адрес 3",
  },
  {
    id: 4,
    company: "Компания 4",
    address: "Адрес 4",
  },
];

const initialState: initalStateTableInterface = {
  data: mockData,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    deleteCompany: (state, { payload }) => {
      state.data = state.data.filter(
        (company) => !payload.includes(company.id)
      );
    },
    saveChanges: (state, { payload }) => {
      const { id, value, field } = payload;
      state.data = state.data.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
    },
    addCompany: (state, { payload }) => {
      state.data.push({
        id:
          state.data.length !== 0
            ? Math.max(...state.data.map((item) => item.id)) + 1
            : 1,
        ...payload,
      });
    },
  },
});

export const { deleteCompany, saveChanges, addCompany } = tableSlice.actions;

export const getData = (state: RootState) => state.table.data;

export default tableSlice.reducer;
