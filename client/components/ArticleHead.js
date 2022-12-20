import styles from '../styles/ArticleHead.module.css'
import Link from 'next/link'

const ArticleHead = ({ article }) => {
  return (
    <Link href={`/article/${article.code}`} className={styles.container}>
        <img className={styles.image} src={article.image} />  
        <div className={styles.text}>{article.name}</div>
    </Link>
  )
}

export default ArticleHead