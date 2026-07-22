import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Player', 'Club', 'Match', 'Season', 'Ranking'],
  endpoints: (builder) => ({
    getSoloRankings: builder.query({
      query: (seasonId) => `/rankings/players?seasonId=${seasonId}`,
      providesTags: ['Ranking'],
    }),
    getClubRankings: builder.query({
      query: (seasonId) => `/rankings/clubs?seasonId=${seasonId}`,
      providesTags: ['Ranking'],
    }),
    getSeasons: builder.query({
      query: () => `/seasons`,
      providesTags: ['Season'],
    }),
    // Add more endpoints as needed...
  }),
});

export const {
  useGetSoloRankingsQuery,
  useGetClubRankingsQuery,
  useGetSeasonsQuery,
} = apiSlice;
