import { Suspense } from 'react';
import ChatMessage from './ChatMessage.jsx';
import ChatSideBar from './ChatSideBar.jsx';
import ChatOptions from './ChatOptions.jsx';
import ChatRegister from "./ChatRegister.jsx";
import ChatApi from './ChatApi.jsx';
import ScrollView from './ScrollView.jsx';
import { useGlobal } from './context/index.jsx';
import { ChatList } from './ChatList.jsx';
import { classnames } from '../components/utils/index.js';
import { Search } from '../components/Search';
// import { Apps } from './apps/index'
import Loadding from './Loadding.jsx';
import styles from './style/chat.module.less';
import './style/style.less';
import ChatInstitution from './ChatInstitution.jsx';

export default function Chat() {
  const { is, setSearch } = useGlobal();
  const chatStyle = is.fullScreen ? styles.full : styles.normal;

  const onSearch = (e) => {
    setSearch(e);
  };

  return (
    <Suspense fallback={<Loadding />}>
      <div className={classnames(styles.chat, chatStyle)}>
        <div className={styles.chat_inner}>
          <ChatSideBar />
          {is.ChatRegister ? (
            <ChatRegister />
          ) : is.ChatApi ? (
            <ChatApi />
          ) : is.ChatInstitution ? (
            <ChatInstitution />
          ) : is.config ? (
            <ChatOptions />
          ) : (
            <>
              {is.sidebar && (
                <div className={styles.sider}>
                  <div className={styles.search}>
                    <Search onSearch={onSearch} />
                  </div>
                  <ScrollView>
                    <ChatList />
                  </ScrollView>
                </div>
              )}
              <ChatMessage />
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}
