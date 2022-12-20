import '../styles/globals.css'
import Layout from '../components/Layout'
import { AuthProvider } from '../context/AuthProvider'
import AuthContext from '../context/AuthProvider'
import Footer from '../components/Footer'


function MyApp({ Component, pageProps }) {
  

  return (
      <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Footer />
      </AuthProvider>
  )
}

export default MyApp
