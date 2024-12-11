import { createSlice } from "@reduxjs/toolkit";
import { Building } from "../../../models/Building";

interface BuildingsData {
  buildings: Building[];
  totalPages: number;
  search: string;
}

export const buildingSlice = createSlice({
  name: "buildings",
  initialState: null as BuildingsData | null,
  reducers: {
    setBuildings: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setBuildings } = buildingSlice.actions;
export default buildingSlice.reducer;
