import { formatDistance, formatDistanceToNow, parseISO } from 'date-fns'
import { selectAllUsers } from '../users/userSlice'
import {
  allNotificationsRead,
  selectAllNotifications,
} from './notificationsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useLayoutEffect } from 'react'
import classNames from 'classnames'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderdNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }

    const notificationClassname = classNames('notifiaction', {
      new: notification.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b>
          {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notificaions</h2>
      {renderdNotifications}
    </section>
  )
}
