import React from 'react';
import classNames from 'classnames';

/** */
const translations = {
    ingredients: 'Ingredients:'
}

/** */
export default class TextField extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: ''
        }
        this.inputRef = React.createRef();
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onBlur = this.onBlur.bind(this);
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
    setValue(value) {
        this.setState((prevState) => ({
            ...prevState,
            value
        }));
    }

    /** */
    focus() {
        this.inputRef.current.focus();
    }

    /** */
    select() {
        this.setState((prevState) => ({
            ...prevState,
            select: true
        }));
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
    onKeyDown(event) {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(event);
        }
    }

    /** */
    onKeyPress(event) {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(event);
        }
    }

    /** */
    onBlur(event) {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    /** */
    componentDidUpdate() {
        if (this.state.select) {
            this.inputRef.current.select();
            this.setState((prevState) => ({
                ...prevState,
                select: false
            }));
        }
    }

    /** */
    render() {
        const textFieldClasses = classNames('text-field',
            {'text-field-error': this.state.error});
        return (
            <div className={textFieldClasses}>
                <input ref={this.inputRef}
                    className="text-field-input"
                    value={this.state.value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    onKeyPress={this.onKeyPress}
                    onBlur={this.onBlur}/>
            </div>
        );
    }
}