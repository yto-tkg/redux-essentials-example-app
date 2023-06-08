import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom/cjs/react-router-dom'
import { selectPostById, useGetPostQuery } from './postsSlice'
import { Spinner } from '../../components/Spinner'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  //   const post = useSelector((state) => selectPostById(state, postId))
  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  //   if (!post) {
  //     return (
  //       <section>
  //         <h2>Post not found!</h2>
  //       </section>
  //     )
  //   }

  let content

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    )
  }

  return <section>{content}</section>
}
