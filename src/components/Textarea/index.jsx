import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { classnames } from '../utils';
import styles from './textarea.module.less';

export const Textarea = forwardRef((props, ref) => {
    const {
        onChange,
        placeholder,
        className,
        showClear,
        disable,
        rows,
        maxHeight,
        transparent,
        onClear,
        ...rest
    } = props;

    const [content, setContent] = useState(props.value); 

    useEffect(() => {
        setContent(props.value);
    }, [props.value]);

    const [height, setHeight] = useState('auto');

    function handleChange(event) {
        setHeight('auto');
        setHeight(`${event.target.scrollHeight}px`);
        setContent(event.target.value);
        onChange && onChange(event.target.value);
    }

    function handleClear() {
        onChange && onChange('');
        onClear && onClear();
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
        if (event.shiftKey && event.key === 'Enter') {
            setContent(content + '\n');
            event.preventDefault();
        }
    };

    return (
        <div className={classnames(styles.textarea_box, className)}>
            <div className={styles.inner}>
                <textarea
                    ref={ref}
                    rows={rows}
                    style={{ height }}
                    onChange={handleChange}
                    placeholder={placeholder}
                    onKeyDown={handleKeyPress}
                    className={classnames(styles.textarea, transparent && styles.transparent)}
                    value={content} 
                    {...rest}
                />
            </div>
            {showClear && <Button className={styles.clear} type="icon" onClick={handleClear} icon="cancel" />}
        </div>
    );
});

Textarea.defaultProps = {
    showClear: false,
    disable: false,
    maxHeight: 200,
    placeholder: '',
    rows: '1',
    transparent: false,
    value: '',
};

Textarea.propTypes = {
    showClear: PropTypes.bool,
    transparent: PropTypes.bool,
    onClear: PropTypes.func,
    className: PropTypes.string,
    onChange: PropTypes.func,
    disable: PropTypes.bool,
    placeholder: PropTypes.string,
    maxHeight: PropTypes.number,
    rows: PropTypes.string,
    value: PropTypes.string,
};
