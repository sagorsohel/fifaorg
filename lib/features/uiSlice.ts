import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LanguageCode } from "../i18n"

export interface UiState {
  language: LanguageCode
  searchQuery: string
  filterStatus: "all" | "finished" | "upcoming"
  activeTab: "matches" | "teams"
  selectedGroup: string // "all" or specific group name "A" - "L"
  selectedTeamId: string | null
  selectedGameId: string | null
  detectedTimezone: string | null
}

const initialState: UiState = {
  language: "en",
  searchQuery: "",
  filterStatus: "all",
  activeTab: "matches",
  selectedGroup: "all",
  selectedTeamId: null,
  selectedGameId: null,
  detectedTimezone: null,
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
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
    setDetectedTimezone: (state, action: PayloadAction<string | null>) => {
      state.detectedTimezone = action.payload
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
  setDetectedTimezone,
  resetFilters,
} = uiSlice.actions

export default uiSlice.reducer


