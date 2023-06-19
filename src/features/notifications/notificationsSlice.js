import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createAction,
  isAnyOf,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { apiSlice } from '../api/apiSlice'
import { createSelector } from '@reduxjs/toolkit'
import { forceGenerateNotifications } from '../../fakeApi'

const notificationsReceived = createAction('notifications/notificationReceived')

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const ws = new WebSocket('ws://localhost')
        try {
          await cacheDataLoaded

          const listener = (event) => {
            const message = JSON.parse(event.data)
            switch (message.type) {
              case 'notification': {
                updateCachedData((draft) => {
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }
          ws.addEventListener('message', listener)
        } catch {}
        await cacheEntryRemoved
        ws.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = extendedApi

export const selectNoticationsResult = extendedApi.endpoints.getNotifications

const emptyNotifications = []

const selectNotificationsData = createSelector(
  selectNoticationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.data ?? ''
  forceGenerateNotifications(latestTimestamp)
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?slece=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsAdapter = createEntityAdapter()
const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(matchNotificationsReceived, (state, action) => {
      const notificationsMetadata = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))
      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      notificationsAdapter.upsertMany(state, notificationsMetadata)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions
export default notificationsSlice.reducer
// export const selectAllNotifications = (state) => state.notifications
export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = notificationsAdapter.getSelectors((state) => state.notifications)
