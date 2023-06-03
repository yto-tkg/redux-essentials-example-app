import { useSelector } from 'react-redux'
import { selectUserById } from './userSlice'
import { selectAllPosts, selectPostByUser } from '../posts/postsSlice'
import { Link } from 'react-router-dom/cjs/react-router-dom'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => selectUserById(state, userId))

  const postForUser = useSelector((state) => selectPostByUser(state, userId))

  const postTitles = postForUser.map((post) => (
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
