import { useSelector } from 'react-redux'
import { selectUserById } from './userSlice'
import { selectAllPosts, selectPostByUser } from '../posts/postsSlice'
import { Link } from 'react-router-dom/cjs/react-router-dom'
import { useMemo } from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useGePostsQuery } from '../api/apiSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => selectUserById(state, userId))

  const selectPostsForUser = useMemo(() => {
    const emptyArray = []
    return createSelector(
      (res) => res.data,
      (res, userId) => userId,
      (data, userId) =>
        data?.filter((post) => post.user === userId) ?? emptyArray
    )
  }, [])

  //   const postForUser = useSelector((state) => selectPostByUser(state, userId))
  const { postsForUser } = useGePostsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      postsForUser: selectPostsForUser(result, userId),
    }),
  })

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
