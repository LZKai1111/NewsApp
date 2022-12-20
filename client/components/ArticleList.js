import ArticleItem from './ArticleItem'
import ArticleHead from './ArticleHead'
import articleStyles from '../styles/Article.module.css'

const ArticleList = ({articles}) => {

  const ids = articles.map((article) => parseInt(article.code))
  const max = ids.reduce((a, b) => Math.max(a, b), -Infinity)

  return (
    <div class={articleStyles.grid}>
        {articles.slice().reverse().map((article) => (
        // {articles.map((article) => (
          parseInt(article.code) === max 
          ? 
          <>
            <ArticleHead article={article} />
            {console.log('omg burger')}
          </> 
          : 
          <>
            <ArticleItem article={article} />
          </>
        ))}
    </div>
  )
}

export default ArticleList