import headerStyles from '../styles/Header.module.css'

const Header = () => {

  return (
    <div className={headerStyles.container}>
        <h1 className={headerStyles.title}>
            <span>Josh Washington's Post</span>
        </h1>
        <p className={headerStyles.description}>Find your latest news here</p>
    </div>
  )
}

export default Header