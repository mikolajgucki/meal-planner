import React from 'react';
import classNames from 'classnames';
import ItemSelector from './ItemSelector';

/** */
export default class FloatingItemSelector extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.itemSelectorRef = React.createRef();
        this.onCancel = this.onCancel.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.onItemNameSelect = this.onItemNameSelect.bind(this);
        this.onMaskClick = this.onMaskClick.bind(this);
    }

    /** */
    show(value) {
        this.setState((prevState) => ({
            ...prevState,
            wasVisible: false,
            visible: true
        }));
        this.itemSelectorRef.current.focus();
        this.itemSelectorRef.current.setValue(value);
    }

    /** */
    hide() {
        this.setState((prevState) => ({
            ...prevState,
            wasVisible: true,
            visible: false
        }));
    }

    /** */
    onCancel() {
        this.hide();
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    /** */
    onItemSelect(item) {
        this.hide();
        if (this.props.onItemSelect) {
            this.props.onItemSelect(item);
        }
    }

    /** */
    onItemNameSelect(itemName) {
        this.hide();
        if (this.props.onItemNameSelect) {
            this.props.onItemNameSelect(itemName);
        }
    }

    /** */
    onMaskClick() {
        this.onCancel();
    }

    /** */
    componentDidUpdate() {
        if (!this.state.wasVisible && this.state.visible) {
            if (this.itemSelectorRef.current) {
                this.itemSelectorRef.current.focus();
            }
            this.setState((prevState) => ({
                ...prevState,
                wasVisible: true,
                visible: true
            }));
        }
    }

    /** */
    render() {
        const floatingClassNames = classNames(
            'floating-item-selector',
            {'floating-item-selector-hidden': !this.state.visible});
        return (
            <div className={floatingClassNames}>
                <div className="item-selector-box">
                    <div>{this.props.title}</div>
                    <ItemSelector ref={this.itemSelectorRef}
                        matchByName={this.props.matchByName}
                        onCancel={this.onCancel}
                        onItemSelect={this.onItemSelect}
                        onItemNameSelect={this.onItemNameSelect}
                        noMask/>
                </div>
                <div className="floating-item-selector-mask"
                    onClick={this.onMaskClick}>
                </div>
            </div>
        );
    }
}
