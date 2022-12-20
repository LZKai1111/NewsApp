import Styles from '../styles/Comment.module.css'
import { server } from '../config'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const CommentItem = ({ comment }) => {

    const router = useRouter()

    const commentTime = (comment.createdAt.toString()).slice(0,10)
    const commentID = comment.code
    const name = localStorage.getItem('email').toString()

    const [ isUser, setIsUser ] = useState(false)

    const [ edit, setEdit ] = useState(false)
    const [ userComment, setEditComment ] = useState('') 

    useEffect(() => {
        if(localStorage.getItem('email')===comment.name){
          setIsUser(true)
    }}, [])

    const deleteComment = () => {
        axios.delete(`${server}/api/v1/comment/${commentID}`)
        .then(res => {
            console.log('Delete comment', res)
            router.reload(window.location.pathname);
        }).catch(err => console.log(err))
    }

    const toggleEdit = (e) => {
        e.preventDefault()
        setEdit(!edit)
    }

    const updateComment = async (e) => {

        await axios.patch(`${server}/api/v1/comment/${comment.code}`, {
            name,
            userComment
        })
        .then(res => {
            console.log('Update data for comment', res)
            router.reload(window.location.pathname);
        })
        .catch(err=> console.log(err))
        setEditComment('')

    }




    return (
        <>
            <div className={Styles.container}>
                    <h4 className={Styles.head}>{comment.name}</h4>
                    <p className={Styles.time}>{commentTime}</p>
                    {isUser ? <button className={Styles.delete} onClick={deleteComment}>Delete</button> : '' }
                    {isUser ? (!edit ? <>
                        <button className={Styles.delete} onClick={toggleEdit}>Edit</button>
                        <p className={Styles.comment}>{comment.userComment}</p>
                    </> : <>
                        <textarea 
                            className={Styles.CPinput}
                            defaultValue={comment.userComment} 
                            onChange={(e) => setEditComment(e.target.value)}
                        />
                        <button className={Styles.CPBtn} onClick={updateComment}>Edit</button>
                        <button className={Styles.CPBtn} onClick={toggleEdit}>Cancel</button>
                    
                    </>) : ''}
                    
            </div>
            <hr />
        </>
      )
}

export default CommentItem