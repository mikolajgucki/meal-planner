import React from 'react';
import classNames from 'classnames';
import ProductSelector from './ProductSelector';

/** */
const translations = {
    'select.product': 'Select product:'
}

/** */
export default class FloatingProductSelector extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.productSelectorRef = React.createRef();
        this.onCancel = this.onCancel.bind(this);
        this.onProductSelect = this.onProductSelect.bind(this);
        this.onProductNameSelect = this.onProductNameSelect.bind(this);
        this.onMaskClick = this.onMaskClick.bind(this);
    }

    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    show(value) {
        this.setState((prevState) => ({
            ...prevState,
            wasVisible: false,
            visible: true
        }));
        this.productSelectorRef.current.focus();
        this.productSelectorRef.current.setValue(value);
    }

    /** */
    hide() {
        this.setState((prevState) => ({
            ...prevState,
            wasVisble: true,
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
    onProductSelect(product) {
        this.hide();
        if (this.props.onProductSelect) {
            this.props.onProductSelect(product);
        }
    }

    /** */
    onProductNameSelect(productName) {
        this.hide();
        if (this.props.onProductNameSelect) {
            this.props.onProductNameSelect(productName);
        }
    }

    /** */
    onMaskClick() {
        this.onCancel();
    }

    /** */
    componentDidUpdate() {
        if (!this.state.wasVisible && this.state.visible) {
            if (this.productSelectorRef.current) {
                this.productSelectorRef.current.focus();
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
            'floating-product-selector',
            {'floating-product-selector-hidden': !this.state.visible});
        return (
            <div className={floatingClassNames}>
                <div className="product-selector-box">
                    <div>{this.translate('select.product')}</div>
                    <ProductSelector ref={this.productSelectorRef}
                        onCancel={this.onCancel}
                        onProductSelect={this.onProductSelect}
                        onProductNameSelect={this.onProductNameSelect}/>
                </div>
                <div className="floating-product-selector-mask"
                    onClick={this.onMaskClick}/>
            </div>
        );
    }
}
