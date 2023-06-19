import { useDispatch } from 'react-redux'
import { reactionAdded } from './postsSlice'
import { useAddReactionMutation } from '../api/apiSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionsButtons = ({ post }) => {
  //   const dispatch = useDispatch()
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button"
        onClick={() => addReaction({ postId: post.id, reaction: name })}
      >
        {emoji} {post.reactionButtons[name]}
      </button>
    )
  })
  return <div>{reactionButtons}</div>
}
