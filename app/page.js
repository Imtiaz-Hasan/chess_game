import styles from './page.module.css'
import Chessboard from './components/Chessboard'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Chess Game</h1>
      <Chessboard />
    </main>
  )
}
