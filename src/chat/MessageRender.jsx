import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useGlobal } from './context';
import { memo } from 'react';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import PropTypes from 'prop-types';
import './style/markdown.less';
import {Img} from 'react-image'

const IMG_SIZE = 600;
const RenderImage = ({ children }) => (
  <Img src={children} height={IMG_SIZE} width={IMG_SIZE} alt="img" loading='lazy' />
);

RenderImage.propTypes = {
  children: PropTypes.string.isRequired 
};

const MessageRender = memo(({ type, children }) => {
  const { options } = useGlobal();
  const style = options.general.theme === 'dark' ? oneDark : oneLight;

  if (type !== 'image') {
    return (
      <ReactMarkdown
        className="z-ui-markdown"
        remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
        components={{
          code({ node, inline, className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...rest}
                children={String(children).replace(/\n$/, '')} // Remove the last newline
                style={style}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code {...rest} className={`code-line ${className}`}>
                {children}
              </code>
            );
          }
        }}
      >
        {children}
      </ReactMarkdown>
    );
  } else {
    return <RenderImage key={Math.random(5000)}>{children}</RenderImage>;
  }
});

MessageRender.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

MessageRender.displayName = 'MessageRender';

export default MessageRender;