import Styles from "../styles/Navbar.module.css"
import Link from "next/link"
import Image from 'next/image'
import React, { useState, useContext } from 'react'
import AuthContext from "../context/AuthProvider"
import { AiFillFacebook, AiFillGithub, AiFillYoutube } from 'react-icons/ai'

const AccountBtn = () => {
  const { auth, setAuth } = useContext(AuthContext);
  
  return (
    <div class={Styles.main}>
        <div class={Styles.container}>
            <div class={Styles.text}>
                <Link href='/' >
                    Home
                </Link>
            </div>
            <div class={Styles.right}>
                {/* <Link>
                    <AiFillFacebook class={Styles.icon}/>
                </Link>
                <Link>
                    <AiFillGithub class={Styles.icon}/>
                </Link>
                <Link>
                    <AiFillYoutube class={Styles.icon}/>
                </Link> */}

                <AiFillFacebook class={Styles.icon}/>
                <AiFillGithub class={Styles.icon}/>
                <AiFillYoutube class={Styles.icon}/>

                <Link href='/login' onClick={()=> 
                {
                    localStorage.removeItem('token')
                    localStorage.removeItem('loginStatus')
                    localStorage.removeItem('email')
                    localStorage.removeItem('roles')
                    localStorage.removeItem('userCode')
                    setAuth(null)
                }
                }>Logout</Link>
            </div>
        </div>
    </div>
  )
}





export default AccountBtn