import { useState } from 'react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useOptions } from '../hooks'
import EmptyImg from './EmptyImg'
import styles from './style/style.module.less'

export default function EmptyChat() {
  const { setModel } = useOptions()
  const [apiKey, setApiKey] = useState('');
  return (
    <div className={styles.empty}>
      <EmptyImg />
      <div className={styles.empty_inner}>
        <Input onChange={(val) => setApiKey(val)} placeholder="OpenAI API key" className={styles.empty_input} />
        <Button onClick={() => setModel({ apiKey })}>Save</Button>
      </div>
      <div className={styles.empty_text}>API key is stored locally. Create one on OpenAI</div>
    </div>
  )
}
