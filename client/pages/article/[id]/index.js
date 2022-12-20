import Link from 'next/link'
import { useState, useEffect } from 'react'
import {server} from '../../../config'
import axios from 'axios'
import styles from '../../../styles/SingleArticle.module.css'
import Header from '../../../components/Header'
import Button from '../../../components/Button'
import Navbar from '../../../components/Navbar'
import CommentList from '../../../components/CommentList'
import CommentInput from '../../../components/CommentPost'
import Blocker from '../../../components/LoginBlocker'

const article = ({ article, comments }) => {
  const BtnText = '< Go Back'

  const [ CheckLoggedIn, setCheckLoggedIn ] = useState(false)

  useEffect(() => {
    if(localStorage.getItem('loginStatus')===null){
      setCheckLoggedIn(false)
    } else {
      setCheckLoggedIn(true)
    }
  }, [])

  if(CheckLoggedIn){
    return (
      <div className={styles.container}>
        <Navbar />
        <Header />
        <Link href='/'><Button context={BtnText} /></Link>
        <div>
          <h1>{article.result.name}</h1>
        </div>
        <div>
          <img className={styles.image} src={article.result.image} />
        </div>
        <div>
          <h4>{article.result.description}</h4>
        </div>
        <div className={styles.content}>
          <p>{article.result.content}</p>
        </div>
        <div>
          <hr />
          <h2>Comments</h2>
          <CommentInput ArticleID={article.result.code}/>
          <CommentList comments={comments} />  
        </div>    
      </div>    
      )
  } else {
    return (
      <Blocker />
    )
  }
}



// getServerSideProps is used because it gets data at request time, not needed for SEO

export const getServerSideProps = async (context) => {


  const allres = await axios.get(`${server}/api/v1/article`)

  const articles = await allres.data

  const ids = articles.map((article) => article.code)
  const paths = ids.map((id) => ({ params: { id: id.toString() } }))


  // ------------------------------------------------------------------------

  const res = await axios.get(`${server}/api/v1/article/${context.params.id}`)
  const article = await res.data

  const commentRes = await axios.get(`${server}/api/v1/articlecomment/${article.result.code}`)
  const comments = await commentRes.data
  
  return {
    props: {
      article,
      comments,
    },
  }
}


// export const getStaticPaths = async () => {
//   const res = await axios.get(`${server}/api/v1/article`)

//   const articles = await res.data

//   const ids = articles.map((article) => article.code)
//   const paths = ids.map((id) => ({ params: { id: id.toString() } }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

export default article