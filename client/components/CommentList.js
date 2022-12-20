import { useEffect } from 'react'
import CommentStyles from '../styles/Comment.module.css'
import CommentItem from './CommentItem'
import {server} from '../config'

const CommentList = ({comments}) => {
    const commentResult = comments.result

    return (
        <div class={CommentStyles.grid}>
            {commentResult.slice(0).reverse().map((comment) => (
                <CommentItem comment={comment}/>
            ))}
        </div>
      )
}

export default CommentList