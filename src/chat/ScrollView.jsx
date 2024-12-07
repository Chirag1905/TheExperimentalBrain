import { useRef, useState, useEffect } from 'react'
import { classnames } from '../components/utils'
import { useGlobal } from './context'
import PropTypes from 'prop-types'; 
import styles from './style/style.module.less'

const ScrollView = (props) => {
  const { children, className, ...rest } = props;
  const scrollRef = useRef(null);
  const { is } = useGlobal();
  const [height, setHeight] = useState(0);

  const handleScroll = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottom = () => {
    const currentHeight = scrollRef.current.scrollHeight;
    if (currentHeight - height > 60) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setHeight(currentHeight);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [is.thinking]);

  useEffect(() => {
    window.requestAnimationFrame(handleScroll);
    setHeight(scrollRef.current.scrollHeight);
  }, [scrollRef.current]);

  return (
    <div ref={scrollRef} className={classnames(styles.scroll, className)} {...rest}>
      {children}
    </div>
  );
};

ScrollView.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default ScrollView;
