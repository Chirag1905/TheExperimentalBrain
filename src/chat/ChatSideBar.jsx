import { Suspense } from 'react';
import { Avatar, Icon } from '../components';
import { useGlobal } from './context';
import { classnames } from '../components/utils';
import { useOptions } from '../hooks';

import Loadding from './Loadding';
import imageUrl from '../assets/images/avatar.png'
import styles from './style/chatsidebar.module.less';

export default function ChatSideBar() {
    const { is, setState, options } = useGlobal();
    const { setGeneral } = useOptions();
    // const { options.general.theme } = props;
    return (
        <Suspense fallback={<Loadding />}>
            <div className={classnames(styles.sider, 'flex-c-sb flex-column')}>
                <Avatar src={options.general.theme !== 'dark' && imageUrl} />
                <div className={classnames(styles.tool, 'flex-c-sb flex-column')}>
                    {/* <Icon
                    className={styles.icon}
                    type='apps'
                    onClick={() => setState({ is: { ...is, apps: true } })}
                /> */}
                    <Icon
                        className={styles.icon}
                        type='push-right'
                        onClick={() => {
                            setState({ is: { ...is, config: false, ChatRegister: false, ChatApi: false, ChatInstitution: false } });
                            localStorage.removeItem("userData");
                            localStorage.removeItem('currentChat');
                            location.reload();
                            // setState({ is: { ...is, config: !is.config, register: false } })
                        }}
                    />
                    {/* <Icon
                        className={styles.icon}
                        type='history'
                        onClick={() => setState({ is: { ...is, apps: false } })}
                    /> */}
                    <Icon
                        className={styles.icon}
                        type={options.general.theme}
                        onClick={() =>
                            setGeneral({
                                theme:
                                    options.general.theme === 'light'
                                        ? 'dark'
                                        : 'light',
                            })
                        }
                    />
                    <Icon
                        className={styles.icon}
                        type='config'
                        onClick={() =>
                            setState({ is: { ...is, config: !is.config, ChatRegister: false, ChatApi: false, ChatInstitution: false } })
                        }
                    />
                    {/*<Icon
                    className={styles.icon}
                    type={`${is.fullScreen ? 'min' : 'full'}-screen`}
                    onClick={() =>
                        setState({ is: { ...is, fullScreen: !is.fullScreen } })
                    }
                />*/}
                </div>
            </div>
        </Suspense>
    );
}
