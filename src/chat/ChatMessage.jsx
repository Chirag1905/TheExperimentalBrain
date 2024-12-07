import { Suspense, useEffect, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { Textarea } from '../components/Textarea';
import { Loading } from '../components/Loading';
import { Tooltip } from '../components/Tooltip';
import { Button } from '../components/Button';
// import { Popover } from '../components/Popover';
import CopyIcon from './CopyIcon';
import ChatHelp from './ChatHelp'
import ScrollView from './ScrollView';
import Error from './Error'
import MessageRender from './MessageRender';
// import EmptyChat from './EmptyChat'
// import ConfigInfo from './ConfigInfo';
import { useGlobal } from './context';
import { useMesssage, useSendKey, useOptions } from '../hooks';
import { dateFormat } from './utils';
import { classnames } from '../components/utils';
import avatar from '../assets/images/avatar-gpt.png';
import axios from 'axios';
import PropTypes from 'prop-types';
import styles from './style/chatmessage.module.less';

export function MessageHeader() {
    const { is, setIs, clearMessage, options } = useGlobal();
    const { message } = useMesssage();
    const { messages = [] } = message || {};
    const columnIcon = is.sidebar ? 'column-close' : 'column-open';
    // const { setGeneral } = useOptions();

    return (
        <div className={classnames(styles.header)}>
            <Button
                type='icon'
                icon={columnIcon}
                onClick={() => setIs({ sidebar: !is.sidebar })}
            />
            <div className={styles.header_title}>
                {messages?.title}
                <div className={styles.length}>{messages.length} messages</div>
            </div>
            <div className={styles.header_bar}>
                {/* <Icon
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
                /> */}
                {/*<Icon
                    className={styles.icon}
                    type='clear'
                    onClick={clearMessage}
                />*/}
                {/*<Popover position="bottom" content={<ConfigInfo />}>
          <Icon className={styles.icon} type="more" />
        </Popover>*/}


                {/* <div className='searchbx2'>
                    <Icon type='search' className={styles.icon} />
                    <input type="text" placeholder='Search' className='search2' />
                </div> */}
                {/* <div className='grade'>
                    <select name="" id="" className='grade-dropdown'>
                        <option value="">Azure OpenAI GPT 3.5-Turbo</option>
                        <option value="">Azure OpenAI GPT 4-Turbo</option>
                    </select>
                </div> */}
                {/* <div className='icon-section-header'>
                    <Icon type='share' className={styles.icon} />
                </div> */}
            </div>
        </div>
    );
}

export function EditorMessage() {
    return (
        <div>
            <Textarea rows='3' />
        </div>
    );
}

export function MessageItem(props) {
    const { content, sentTime, role, type } = props;
    const { removeMessage } = useGlobal();

    return (
        <div className={classnames(styles.item, styles[role])}>
            <Avatar className="userpic" src={role !== 'user' ? null : avatar} />
            <div
                className={classnames(
                    styles.item_content,
                    styles[`item_${role}`],
                )}
            >
                <div className={styles.item_inner}>
                    <div className={styles.item_tool}>
                        <div className={styles.item_date}>
                            {dateFormat(sentTime)}
                        </div>
                        <div className={styles.item_bar}>
                            <Tooltip text='Remove Messages'>
                                <Icon
                                    className={styles.icon}
                                    type='trash'
                                    onClick={removeMessage}
                                />
                            </Tooltip>
                            {role === 'user' ? (
                                <>
                                    <Icon
                                        className={styles.icon}
                                        type='reload'
                                    />
                                    {/* <Icon
                                        className={styles.icon}
                                        type='editor'
                                    /> */}
                                </>
                            ) : (
                                <CopyIcon value={content} />
                            )}
                        </div>
                    </div>
                    <MessageRender type={type}>{content.replace("OpenAI", "The Experimental Brain")}</MessageRender>
                </div>
            </div>
        </div>
    );
}

MessageItem.propTypes = {
    content: PropTypes.string.isRequired,
    sentTime: PropTypes.instanceOf(Date).isRequired,
    role: PropTypes.oneOf(['user', 'admin']).isRequired,
    type: PropTypes.string.isRequired
};

export function MessageBar() {
    const {
        sendMessage,
        setMessage,
        is,
        options,
        setIs,
        typeingMessage,
        clearTypeing,
        stopResponse,
        selected_grade,
        setGrade,
        setAttachment,
        selected_attachment,
    } = useGlobal();

    useSendKey(sendMessage, options.general.command);

    const onChangeGrade = (event) => {
        // console.log(event.target.value)
        const value = event.target.value;
        setGrade(value)
    }
    const onChangeAttachment = (event) => {
        // console.log(event.target.value)
        const value = event.target.value;
        setAttachment(value)
    }

    return (
        <div className={styles.bar}>
            {is.thinking && (
                <div className={styles.bar_tool}>
                    <div className={styles.bar_loading}>
                        <div className='flex-c'>
                            <span>Thinking</span> <Loading />
                        </div>
                        <Button
                            size='min'
                            className={styles.stop}
                            onClick={stopResponse}
                            icon='stop'
                        >
                            Stop Response
                        </Button>
                    </div>
                </div>
            )}
            <div className={styles.bar_inner}>
                <div className='sendtextarea'>
                    <div className={styles.bar_type}>
                        <button className='mic-action'>
                            <Icon className={styles.icon} type='mic' />
                        </button>
                        <Textarea
                            style={{}}
                            transparent={true}
                            rows='1'
                            value={typeingMessage?.content || ''}
                            onFocus={() => setIs({ inputing: true })}
                            onBlur={() => setIs({ inputing: false })}
                            placeholder='Ask Question...'
                            onChange={setMessage}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            id={"searchBar"}
                        />

                    </div>
                    <div className='msgaction'>
                        <div className='grade'>
                            <select value={selected_grade} onChange={onChangeGrade} name="grade" id="" className='grade-dropdown'>
                                <option value={""}>Select Grade</option>
                                <option value="Nursery">Nursery</option>
                                <option value="Junior KG">Junior KG</option>
                                <option value="Senior KG">Senior KG</option>
                                <option value="...I am in grade 1">Grade 1</option>
                                <option value="...I am in grade 2">Grade 2</option>
                                <option value="...I am in grade 3">Grade 3</option>
                                <option value="...I am in grade 4">Grade 4</option>
                                <option value="...I am in grade 5">Grade 5</option>
                                <option value="...I am in grade 6">Grade 6</option>
                                <option value="...I am in grade 7">Grade 7</option>
                                <option value="...I am in grade 8">Grade 8</option>
                                <option value="...I am in grade 9">Grade 9</option>
                                <option value="...I am in grade 10">Grade 10</option>
                                <option value="...I am in grade 11">Grade 11</option>
                                <option value="...I am in grade 12">Grade 12</option>
                            </select>
                        </div>
                        {/* <div className="attach">
                            <Icon className={styles.icon} type='link' />
                            <label>Attach</label>
                        </div> */}
                        <form className='radioform'>
                            <div className="radio">
                                <label>
                                    <input onChange={onChangeAttachment} type="radio" name='attachment' value="" checked={selected_attachment == ""} />
                                    <span>Text</span>
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input onChange={onChangeAttachment} type="radio" name='attachment' value="image" checked={selected_attachment == "image"} />
                                    <span>Image</span>
                                </label>
                            </div>
                            {/* <div className="radio">
                                <label>
                                    <input onChange={onChangeAttachment} type="radio" name='attachment' value="video" checked={selected_attachment == "video"} />
                                    <span>Video</span>
                                </label>
                            </div> */}
                        </form>

                        {/* <div className={styles.bar_icon}>
                            {typeingMessage?.content && (
                                <Tooltip text='clear'>
                                    <Icon
                                        className={styles.icon}
                                        type='cancel'
                                        onClick={clearTypeing}
                                    />
                                </Tooltip>
                            )}
                            <Tooltip text='history'>
                                <Icon className={styles.icon} type='history' />
                            </Tooltip>
                        </div> */}
                    </div>
                </div>
                <div className='icon_area'>
                    <Icon
                        className={styles.icon}
                        type='send'
                        onClick={sendMessage}
                    />
                </div>

            </div>
        </div>
    );
}

export function MessageContainer() {
    const { options, currentChat } = useGlobal();
    const { message } = useMesssage();
    const { messages = [] } = message || {};
    const { setModel } = useOptions();
    const [apiKey, setApiKey] = useState('');
    const apiUrl = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                // const response = await axios.get('http://localhost:8000/api');
                const response = await axios.get(`${apiUrl}/api`);
                setApiKey(response.data[0].apiKey);
                // console.log(response.data[0].apiKey);
            } catch (error) {
                console.error('Error fetching API key', error);
            }
        };
        fetchApiKey();
    }, []);

    if (options?.openai?.apiKey) {
        return (
            <>
                {messages.length && currentChat !== -1 ? (
                    <div className={styles.container}>
                        {messages?.map((item, index) => (
                            <MessageItem key={index} {...item} />
                        ))}
                        {message?.error && <Error />}
                    </div>
                ) : (
                    <ChatHelp />
                )}
            </>
        );
    } else {
        // return <EmptyChat />

        if (!options?.openai?.apiKey && apiKey) {
            setModel({ apiKey });
        }
    }
}

export default function ChatMessage() {
    const { is } = useGlobal();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className={styles.message}>
                <MessageHeader />
                <ScrollView>
                    <MessageContainer />
                    {is.thinking && <Loading />}
                </ScrollView>
                <MessageBar />
            </div>
        </Suspense>
    );
}
