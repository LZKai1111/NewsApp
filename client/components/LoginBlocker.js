import React from 'react'
import Link from "next/link"
import Style from '../styles/LoginBlocker.module.css'
import Btn from './Button'

const CheckLogin = () => {
  return (
    <div className={Style.overlay}>
        <div className={Style.text}>
            <h1>You have not logged in</h1>
            <Link href='/login'>
                <Btn context={'Login Now!'}/>
            </Link>
        </div>
    </div>
  )
}

export default CheckLogin