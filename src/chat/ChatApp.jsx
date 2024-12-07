import React, { Suspense } from 'react'
import { ChatProvider } from './context'
import Loadding from './Loadding'
const Chat = React.lazy(() => import("./Chat"))
import './style/style.less'

export default function ChatApp() {
  return (
    <Suspense fallback={<Loadding/>}>
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </Suspense>
  )
}