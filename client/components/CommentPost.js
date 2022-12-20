import axios from "axios"
import { useState, useContext, useEffect } from "react"
import {server} from '../config'
import Styles from '../styles/Comment.module.css'
import { useRouter } from 'next/router'

const CommentPost = ({ ArticleID }) => {

    const router = useRouter()
   
    const [userComment, setUserComment] = useState('')

    const name = (localStorage.getItem('email')).toString()

    const postComment = async (e) => {

       await axios.post(`${server}/api/v1/comment`, {
            articleCode: ArticleID,
            name,
            userComment,
        })
        .then(res => {
          console.log('Posting data for comment', res)
          router.replace(router.asPath)
        })
        .catch(err=> console.log(err))
        setUserComment('')
    }
    
  return (
    <div className={Styles.CPcontainer}>
        <div>
            Write comment
        </div>
        <form>
          <div>
                <textarea 
                  type="text" 
                  className={Styles.CPinput} 
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Write a comment"
                  />
          </div>
          <div>
              <button onClick={postComment} className={Styles.CPBtn}>comment</button>
          </div>
        </form>
    </div>
  )
}

export default CommentPost