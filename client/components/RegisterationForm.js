import Link from "next/link"
import styles from "../styles/LoginRegister.module.css"


const RegisterationForm = () => {
    const back_btn_text = '< back'

  return (
    <div class={styles.container}>
        <div class={styles.screen}>
            <div class={styles.content}>
                <div class={styles.field}>
                    <h5 class={styles.text}>Email</h5>
                    <input type="text" class={styles.input} />
                </div>

                <br />

                <div class={styles.field}>
                    <h5 class={styles.text}>Password</h5>
                    <input type="password" class={styles.input}/>
                </div>

                <button class={styles.submit}>
                    Create an account   
                </button>


                <div class={styles.switchBtn}>
                    <Link href='/login'>Log in</Link>
                </div>

            </div>
        </div>
    </div>
  )
}

export default RegisterationForm