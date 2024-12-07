import { useEffect } from 'react'
import { useGlobal } from './context'
import styles from './style/style.module.less'
import { toast, ToastContainer } from "react-toastify";

export default function Error() {
  const { currentChat, chat } = useGlobal()
  const chatError = chat[currentChat]?.error || {}

  useEffect(()=>{
    toast(`${chatError.message}`, "error");
  }, [chatError])
  return (
   <>
    {/* <div className={styles.error}>
      {chatError.code}<br />
      {chatError.message}<br />
      {chatError.type}<br />
      {chatError.param}<br />
    </div> */}
   </>
  )
}
