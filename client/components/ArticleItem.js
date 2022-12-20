import Link from 'next/link'
import articleStyle from '../styles/Article.module.css'
import Button from './Button'


const ArticleItem = ({ article }) => {
  const ReadMoreBtn = 'Read more ->'

  return (
    <div className={articleStyle.card}>
      <h3 className={articleStyle.title}>{article.name} </h3>
      <img className={articleStyle.image} src={article.image} />
      <p>{article.description}</p>
      <br />  
      <Link href={`/article/${article.code}`}>
        <Button context={ReadMoreBtn}  class={articleStyle.btn}/>
      </Link>
    </div>
  )
}

export default ArticleItem