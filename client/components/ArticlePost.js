import { useState, useEffect } from "react"
import Button from "./Button"
import Styles from '../styles/Article.module.css'
import axios from "axios"
import {server} from '../config'
import AuthContext from "../context/AuthProvider"

const ArticlePost = () => {

    const [ admin, setAdmin ] = useState(false)
    const [ display, setDisplay ] = useState(false)

    const [ name, setName ] = useState('')
    const [ image, setImage ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ content, setContent ] = useState('')

    const token = (localStorage.getItem('token')).toString()
    const userCode = parseInt(localStorage.getItem('userCode'))
    const roles = (localStorage.getItem('roles')).toString()

    useEffect(() => {
        if(roles==='admin') {
            setAdmin(true)
        }
    })

    const postArticle = (e) => {
        // e.preventDefault()
        
        setDisplay()

        setName('')
        setImage('')
        setDescription('')
        setContent('')

        var config = {
            method: 'post',
            url: `${server}/api/v1/admin/article`,
            headers: {
                'token': token,
            },
            data: {
                name,
                image,
                description,
                content
            }
        }

        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        })
    };

    // Create function to check if user is admin

    if(admin){
        return (
            <div>
                {display ? 
                <>
                    <form>
                        <p>Name</p>
                        <input 
                            type='text' 
                            className={Styles.APfield}
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                        />

                        <p>Image URL</p>
                        <input 
                            type='text' 
                            className={Styles.APfield}
                            value={image} 
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="URL"
                        />

                        <p>Description</p>
                        <input 
                            type='text' 
                            className={Styles.APfield}
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                        />

                        <p>Content</p>
                        <textarea 
                            type='text' 
                            className={Styles.APtextarea}
                            oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
                            value={content} 
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content"
                        />

                        <button className={Styles.APBtn} onClick={postArticle}>
                            Create
                        </button>
                        <button className={Styles.APBtn} onClick={() => setDisplay(!display)}>
                            Cancel
                        </button>
                    </form>
                </>
                :
                <>
                    <button className={Styles.APBtn} onClick={() => setDisplay(!display)}>Create article</button>
                </> 
                }
            </div>
        )
    }
}

export default ArticlePost