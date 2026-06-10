import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Team {
  _id: string
  name_en: string
  name_fa: string
  flag: string
  fifa_code: string
  iso2: string
  groups: string // E.g. "A"
  id: string
}

export interface Game {
  _id: string
  id: string
  home_team_id: string
  away_team_id: string
  home_score: string
  away_score: string
  home_scorers: string
  away_scorers: string
  group: string
  matchday: string
  local_date: string
  persian_date: string
  stadium_id: string
  finished: string // "TRUE" or "FALSE"
  time_elapsed: string
  type: string
  home_team_name_en?: string
  home_team_name_fa?: string
  away_team_name_en?: string
  away_team_name_fa?: string
  home_team_label?: string
  away_team_label?: string
  slug?: string
}

export interface TeamsResponse {
  teams: Team[]
}

export interface GamesResponse {
  games: Game[]
}

export interface Stadium {
  _id: string
  id: string
  name_en: string
  name_fa: string
  fifa_name: string
  city_en: string
  city_fa: string
  country_en: string
  country_fa: string
  capacity: number
  region: string
}

export interface StadiumsResponse {
  stadiums: Stadium[]
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getTeams: builder.query<TeamsResponse, void>({
      query: () => "/api/teams",
    }),
    getGames: builder.query<GamesResponse, void>({
      query: () => "/api/games",
    }),
    getStadiums: builder.query<StadiumsResponse, void>({
      query: () => "/api/stadiums",
    }),
  }),
})

export const { useGetTeamsQuery, useGetGamesQuery, useGetStadiumsQuery } = apiSlice

export function getGameSlug(game: Game) {
  if (game.slug) return game.slug
  const home = (game.home_team_name_en || game.home_team_label || "tbd")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  const away = (game.away_team_name_en || game.away_team_label || "tbd")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return `${home}-vs-${away}-${game.id || game._id}`
}

