import SideContent from './SideContent'
import ArticleList from './ArticleList'
import Styles from '../styles/Content.module.css'

const Content = ({ articles }) => {
  return (
    <div class={Styles.container}>
        <div class={Styles.left}>
          <SideContent />
        </div>
        <div class={Styles.right}>
          <ArticleList articles={articles} />
        </div>
    </div>
  )
}

export default Content