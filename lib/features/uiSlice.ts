import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface UiState {
  language: "en" | "fa"
  searchQuery: string
  filterStatus: "all" | "finished" | "upcoming"
  activeTab: "matches" | "teams"
  selectedGroup: string // "all" or specific group name "A" - "L"
  selectedTeamId: string | null
  selectedGameId: string | null
}

const initialState: UiState = {
  language: "en",
  searchQuery: "",
  filterStatus: "all",
  activeTab: "matches",
  selectedGroup: "all",
  selectedTeamId: null,
  selectedGameId: null,
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"en" | "fa">) => {
      state.language = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setFilterStatus: (state, action: PayloadAction<"all" | "finished" | "upcoming">) => {
      state.filterStatus = action.payload
    },
    setActiveTab: (state, action: PayloadAction<"matches" | "teams">) => {
      state.activeTab = action.payload
    },
    setSelectedGroup: (state, action: PayloadAction<string>) => {
      state.selectedGroup = action.payload
    },
    setSelectedTeamId: (state, action: PayloadAction<string | null>) => {
      state.selectedTeamId = action.payload
    },
    setSelectedGameId: (state, action: PayloadAction<string | null>) => {
      state.selectedGameId = action.payload
    },
    resetFilters: (state) => {
      state.searchQuery = ""
      state.filterStatus = "all"
      state.selectedGroup = "all"
      state.selectedTeamId = null
      state.selectedGameId = null
    },
  },
})

export const {
  setLanguage,
  setSearchQuery,
  setFilterStatus,
  setActiveTab,
  setSelectedGroup,
  setSelectedTeamId,
  setSelectedGameId,
  resetFilters,
} = uiSlice.actions

export default uiSlice.reducer


