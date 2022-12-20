import Link from 'next/link'
import buttonStyle from '../styles/Button.module.css'

const Button = ({context}) => {
  return (
    <div className={buttonStyle.button}>
        <div>
            {context}
        </div>
    </div>
  )
}

export default Button