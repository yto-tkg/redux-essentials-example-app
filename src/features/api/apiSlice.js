import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'fakeApi/' }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts',
      providesTags: ['Posts'],
    }),
    getPost: builder.query({
      query: (id) => `posts/${id}`,
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: 'posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Posts'],
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
    }),
  }),
})

export const {
  useGePostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
} = apiSlice
