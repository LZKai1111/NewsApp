import styles from '../styles/SideContent.module.css'

const SideContent = () => {
  return (  
    <>
            <div class={styles.container_column}>
                <div>
                    <img class={styles.container_image} src="https://images.unsplash.com/photo-1586339949216-35c2747cc36d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"></img>
                    <h4><b class={styles.image_text}>Just In...</b></h4>
                </div>
                <div class={styles.card}>
                    <div class={styles.container_card}>
                        <h4><b>Pelosi arrives in Jordan with bipartisan congressional delegation</b></h4>
                        <p>HOUSE - 1M AGO</p>
                    </div>
                </div>
                <div class={styles.card}>
                    <div class={styles.container_card}>
                        <h4><b>Trump says his Doral resort will no longer host G-7 after backlash</b></h4>
                        <p>ADMINISTRATION - 1H 19M AGO</p>
                    </div>
                </div>
                <div class={styles.card}>
                    <div class={styles.container_card}>
                        <h4><b>CNN's Anderson Cooper mocks WH press secretary over Fox News interview</b></h4>
                        <p>MEDIA - 1H 23M AGO</p>
                    </div>
                </div>
                <div class={styles.card}>
                    <div class={styles.container_card}>
                        <h4><b>Trump accuses media, Democrats of going 'crazy' over G-7 at his Miami resort</b></h4>
                        <p>ADMINISTRATION - 1H 33M AGO</p>
                    </div>
                </div>
                <div class={styles.card}>
                    <div class={styles.container_card}>
                        <h4><b>Chick-Fil-A closing first UK restaurant after protests</b></h4>
                        <p>BLOG BRIEFING ROOM - 1H 47M AGO</p>
                    </div>
                </div>
                <div class={styles.card}>
                    <div class={styles.container_card}>
                        <h4><b>Young cautions Democrats: Impeachment might not be 'successful'</b></h4>
                        <p>CAMPAING - 2H 6M AGO</p>
                    </div>
                </div>
            </div>
    </>
  )
}

export default SideContent