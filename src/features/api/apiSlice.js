import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'fakeApi/' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts',
    }),
    getPost: builder.query({
      query: (id) => `posts/${id}`,
    }),
  }),
})

export const { useGePostsQuery, useGetPostQuery } = apiSlice
