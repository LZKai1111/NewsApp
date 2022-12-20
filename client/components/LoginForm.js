import Link from 'next/link'
import { useRouter } from "next/router"
import styles from '../styles/LoginRegister.module.css'
import Button from './Button'
import axios from "axios"
import {server} from '../config'
import { useState, useContext } from 'react'
import AuthContext from "../context/AuthProvider"


const LoginForm = () => {

  const back_btn_text = '< back'

  const router = useRouter()

  const { auth, setAuth } = useContext(AuthContext);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const postLogin = async (e) => {
    e.preventDefault()

    try {
      const req = await axios.post(`${server}/api/v1/user/login`, {
        email,
        password
      })
      const res = req.data
      if(!res.errCode){

        const token = res.result.account.token
        const roles = res.result.account.userRole

        setAuth({ email, roles, token  })
        // useContext loses it's data when you refresh the page, thus causing issues

        localStorage.setItem('token', res.result.account.token)
        localStorage.setItem('email', res.result.account.email)
        localStorage.setItem('userCode', res.result.account.code)
        localStorage.setItem('roles', res.result.account.userRole)
        localStorage.setItem('loginStatus', true)


        router.push('/')

        
      } else {
        setErrMsg(res.errDetail)
        setEmail('')
        setPassword('')
      }

    } catch (err) {
      setErrMsg(err)
    }
  }



  return (
<>  
  <div class={styles.container}>

    <div class={styles.screen}>

      <p>{errMsg}</p>
      <form>
        <div class={styles.content}>

          <div class={styles.field}>
            <h5 class={styles.text}>Email</h5>

            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              class={styles.input} 
            />

          </div>

          <br />

          <div class={styles.field}>
            <h5 class={styles.text}>Password</h5>

            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              class={styles.input}
            />

          </div>

          <button class={styles.submit} onClick={postLogin}>
            Log In Now
          </button>	
        
          <div class={styles.switchBtn}>
            <Link href='/registration'>
              Signup
            </Link>
          </div>

        </div>
        </form>

        
		
    </div>
  </div>
</>
  )
}

export default LoginForm