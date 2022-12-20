import Styles from '../styles/Footer.module.css'
import { AiFillFacebook, AiFillGithub, AiFillYoutube } from 'react-icons/ai'
import {BsNewspaper} from 'react-icons/bs'

const Footer = () => {
  return (
    <div class={Styles.container}>
      <hr />
      <div class={Styles.row}>


        <div class={Styles.column}>
          <h4>Services</h4>
          <p>Web Design</p>
          <p>Development</p>
          <p>Hosting</p>
        </div>


        <div class={Styles.column}>
          <h4>About</h4>
          <p>Company</p>
          <p>Team</p>
          <p>Legacy</p>
        </div>
        

        <div class={Styles.column}>
          <div class={Styles.iconList}>
          <h4>Follow us here too!</h4>
            <AiFillFacebook class={Styles.icon}/>
            <AiFillGithub class={Styles.icon}/>
            <AiFillYoutube class={Styles.icon}/>
          </div>
        </div>


      </div>
      <div class={Styles.footer}>
        MCI (P) 076/10/2022, MCI (P) 077/10/2022. Published by Josh Maximus. Copyright © 2022 Josh Washington's Post Limited. All rights reserved.
      </div>


    </div>







  )
}

export default Footer