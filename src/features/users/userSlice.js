import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { apiSlice } from '../api/apiSlice'

// const usersAdapter = createEntityAdapter()
// const initialState = usersAdapter.getInitialState()

// export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
//   const response = await client.get('/fakeApi/users')
//   return response.data
// })

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()
const emptyUsers = []

export const selectAllUsers = createSelector(
  selectUsersResult,
  (usersResult) => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
  selectAllUsers,
  (state, userId) => userId,
  (users, userId) => users.find((user) => user.id === userId)
)

// const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
//   },
// })

// export default usersSlice.reducer
// export const selectAllUsers = (state) => state.users
// export const selectUserById = (state, userId) =>
//   state.users.find((user) => user.id === userId)
// export const { selectAll: selectAllUsers, selectById: selectUserById } =
//   usersAdapter.getSelectors((state) => state.users)
