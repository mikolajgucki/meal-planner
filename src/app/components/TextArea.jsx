import React from 'react';
import classNames from 'classnames';

/** */
function split(value) {
    const tokens = value.split('\n');
    const lines = [];
    let offset = 0;
    for (const token of tokens) {
        lines.push({
            text: token,
            start: offset,
            end: offset + token.length
        });
        offset += token.length + 1;
    }
    return lines;
}


/** */
export default class TextArea extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: ''
        }
        this.textareaRef = React.createRef();

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    /** */
    focus() {
        this.textareaRef.current.focus();
    }

    /** */
    setError(error = true) {
        this.setState((prevState) => ({
            ...prevState,
            error: error
        }));
    }

    /** */
    clearError() {
        this.setError(false);
    }

    /** */
    getLines() {
        const lines = split(this.textareaRef.current.value);
        return lines;
    }

    /** */
    getCursorPosition() {
        const lines = this.getLines();
        const offset = this.textareaRef.current.selectionStart;

        let x = 0;
        let y = 0;
        for (let line of lines) {
            if (offset >= line.start && offset <= line.end) {
                x = offset - line.start;
                break;
            }
            y++;
        }
        var text;
        if (y < lines.length) {
            text = lines[y].text;
        }
        return { x, y };
    }

    /** */
    focus() {
        this.textareaRef.current.focus();
    }

    /** */
    setCursorPosition(position) {
        this.textareaRef.current.setSelectionRange(position,position);
    }

    /** */
    replaceLine(lineNo,text) {
        const lines = this.textareaRef.current.value.split('\n');
        if (lineNo >= 0 && lineNo < lines.length) {
            lines[lineNo] = text;
            const value = lines.join('\n');
            this.textareaRef.current.value = value;

            if (this.props.onValueChange) {
                this.props.onValueChange(value);
            }
        }
    }

    /** */
    onChange(event) {
        const value = event.target.value;
        this.setState((prevState) => ({
            ...prevState,
            value: value
        }));
        if (this.props.onValueChange) {
            this.props.onValueChange(value);
        }
    }

    /** */
    onBlur() {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    /** */
    onKeyUp(event) {
        if (this.props.onKeyUp) {
            this.props.onKeyUp(event);
        }
    }

    /** */
    onKeyPress(event) {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(event);
        }
    }

    /** */
    onClick(event) {
        if (this.props.onClick) {
            this.props.onClick(event);
        }        
    }

    /** */
    render() {
        const textAreaClasses = classNames('text-area',
            {'text-area-error': this.state.error});
        return (
            <div className={textAreaClasses}>
                <textarea className="text-area-input"
                    ref={this.textareaRef}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyUp={this.onKeyUp}
                    onKeyPress={this.onKeyPress}
                    onClick={this.onClick}/>
            </div>
        );
    }

}