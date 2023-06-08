import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom/cjs/react-router-dom'
import {
  fetchPosts,
  selectAllPosts,
  selectPostById,
  selectPostIds,
} from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { Spinner } from '../../components/Spinner'
import { useGePostsQuery } from '../api/apiSlice'

let PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
  //   const dispatch = useDispatch()
  //   const orderedPostIds = useSelector(selectPostIds)
  //   const postStatus = useSelector((state) => state.posts.status)
  //   const error = useSelector((state) => state.posts.error)

  //   useEffect(() => {
  //     if (postStatus === 'idle') {
  //       dispatch(fetchPosts())
  //     }
  //   }, [postStatus, dispatch])
  const {
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGePostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts
      .slice()
      .sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="loading" />
  } else if (isSuccess) {
    content = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (isError) {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
