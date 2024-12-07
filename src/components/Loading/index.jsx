import PropTypes from 'prop-types';
import { classnames } from '../utils';
import styles from "./loading.module.less";

export function Loading({ text = null, type = 'circle', color }) {
  return (
    <div className={classnames(styles.loading)}>
      <div className={classnames(styles.n, styles[type])}>
        <div className={classnames(styles.line)}>
          {[1, 2, 3, 4].map(item => (
            <div
              key={item}
              className={classnames(styles.bar, styles[`bar-${item}`])}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        {text && <div className={styles.text}>{text}</div>}
      </div>
    </div>
  );
}

Loading.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(['normal', 'circle']),
  color: PropTypes.string
};
