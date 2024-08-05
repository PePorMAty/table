import { createSlice } from "@reduxjs/toolkit";
import { initalStateTableInterface } from "./tableTypes";
import { RootState } from "../../app/store";

const mockData = [
  {
    id: 1,
    company: "2ГИС",
    address: "​Площадь Карла Маркса, 7",
  },
  {
    id: 2,
    company: "АКОРТ",
    address: "Красная Пресня д. 24",
  },
  {
    id: 3,
    company: "БЕЛОЕ ЯБЛОКО",
    address: "Советская, 12",
  },
  {
    id: 4,
    company: "Вилка-Ложка",
    address: "Ленина, 1",
  },
  {
    id: 5,
    company: "Золотая корона",
    address: "Ленина, 1",
  },
  {
    id: 6,
    company: "Российские мясопродукты",
    address: "Иванова, 31/6",
  },
  {
    id: 7,
    company: "СДЭК",
    address: "Ветлужская, 6",
  },
  {
    id: 8,
    company: "Топ-книга",
    address: "Ленина, 100",
  },
  {
    id: 9,
    company: "Урса банк",
    address: "Максима Горького, 3,",
  },
  {
    id: 10,
    company: "Фуд-мастер",
    address: "Островского, 69а ",
  },
  {
    id: 11,
    company: "Холидей",
    address: "Дзержинского, 2/2",
  },
  {
    id: 12,
    company: "Элсиб",
    address: "Сибиряков-Гвардейцев, 56",
  },
  {
    id: 13,
    company: "Entensys",
    address: "​Достоевского, 11",
  },
  {
    id: 14,
    company: "Kuzina",
    address: "​Красный проспект, 80",
  },
  {
    id: 15,
    company: "New York Pizza",
    address: "Красный проспект, 101",
  },
  {
    id: 16,
    company: "Rich Family",
    address: "Королёва, 40",
  },
  {
    id: 17,
    company: "SoftLab-NSK",
    address: "​Проспект Академика Коптюга, 1",
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
