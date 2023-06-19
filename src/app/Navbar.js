import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom/cjs/react-router-dom'
import {
  fetchNotifications,
  fetchNotificationsWebsocket,
  selectAllNotifications,
  selectNotificationsMetadata,
  useGetNotificationsQuery,
} from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const dispatch = useDispatch()
  useGetNotificationsQuery()
  const notificationsMetadata = useSelector(selectNotificationsMetadata)
  const numUnreadNotifications = notificationsMetadata.filter(
    (n) => !n.read
  ).length

  const fetchNewNotifications = () => {
    dispatch(fetchNotificationsWebsocket())
  }

  let unreadNotificationsBadge

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notificaions {unreadNotificationsBadge}
            </Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notificaions
          </button>
        </div>
      </section>
    </nav>
  )
}
