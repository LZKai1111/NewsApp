import { server } from "../config";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Blocker from "../components/LoginBlocker";
import ArticlePost from "../components/ArticlePost";
import ArticleStyles from "../styles/Article.module.css";
import Content from '../components/Content.js'
import { useRouter } from 'next/router'

export default function Home({ articles }) {
  const [CheckLoggedIn, setCheckLoggedIn] = useState(false);

  const [AdminMode, setAdminMode] = useState(false);

  const [adminArticles, setAdminArticles] = useState([]);
 
  const allArticle = () => {
    setAdminMode(false)
  }

  const adminArticle = () => {
    setAdminMode(true)
    getArticles()
  }

  useEffect(() => {
    if (localStorage.getItem("loginStatus") === null) {
      setCheckLoggedIn(false);
    } else {
      setCheckLoggedIn(true);
    }
  }, []);

  const getArticles = async () => {
    const token = localStorage.getItem("token").toString();
    var config = {
      method: "get",
      url: `${server}/api/v1/adminarticle`,
      headers: {
        token: token,
      },
    };

    await axios(config)
      .then(function (res) {
        setAdminArticles(res.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  let myComponent;

  if (CheckLoggedIn) {
    return (
      <div>
        <Head>
          <title>Josh Washington News</title>
          <meta name="keywords" content="news article social media" />
        </Head>

        <Navbar />
        <Header />
        <br />

        <div class={ArticleStyles.indexContainer}>
          {/* <button class={ArticleStyles.APBtn} onClick={getArticles}>
            Refresh
          </button> */}
          <ArticlePost />

          <button class={ArticleStyles.APBtn} onClick={allArticle}>
            All
          </button>
          
          <button class={ArticleStyles.APBtn} onClick={adminArticle}>
            Admin
          </button>
        </div>

        {!AdminMode ? 
        <>
          <Content articles={articles}/>
        </> 
        : 
        <>
          <Content articles={adminArticles}/>
        </>
        }

        {typeof articles === 'undefined' ? 
        <>
          <Content articles={articles}/>
        </> 
        : 
        <>
        
        </>}



      </div>
    );
  } else {
    return <Blocker />;
  }
}

// Axios more like adios amigos

export const getStaticProps = async () => {
  const req = await axios.get(`${server}/api/v1/article`);
  const articles = req.data
  return {
    props: {
      articles
    }
  }
}

// Now that new requirement requires token authentication, data can only be generated
// at request time, so getServerSideProps will be used.

// export const getServerSideProps = async () => {

//   // const token = (localStorage.getItem('token')).toString()

//   const token = typeof window !== 'undefined' ? (localStorage.getItem('token')).toString() : null

//   var config = {
//     method: 'get',
//     url: `${server}/api/v1/adminarticle`,
//     headers: {
//       'token': token,
//     }
//   }

//   const req = await axios(config)
//   const articles = req.data

//   console.log('articles', articles)

//   return {
//     props: {
//       articles
//     }
//   }
// }

// const getData = async () => {
//   const [ data, setData ] = useState([])
//   const [ token, setToken ] = useState('')
//   useEffect(() => {
//     setToken((localStorage.getItem('token')).toString())
//   })

//   var config = {
//     method: 'get',
//     url: `${server}/api/v1/adminarticle`,
//     headers: {
//       'token': token,
//     }
//   }

//   const req = await axios(config)
//   const articles = req.data

//   return articles
// }




// export const getServerSideProps = async () => {

//   // const token = typeof window !== 'undefined' ? (localStorage.getItem('token')).toString() : null

//   const res = await axios.get(`${server}/api/v1/usertoken`);
//   const tokens = res.data

//   const token = tokens[1].token

//   var config = {
//     method: "get",
//     url: `${server}/api/v1/adminarticle`,
//     headers: {
//       token: token,
//     },
//   }

//   const req = await axios(config)
//   const articles = req.data.result


//   return {
//     props: {
//       articles
//     }
//   }
// }