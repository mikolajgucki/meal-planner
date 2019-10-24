import React from 'react';
import classNames from 'classnames';
import Products from '../db/Products';
import TextField from './TextField';
import ProductSelectorItem from './ProductSelectorItem';

/** The number of characters that must be entered in order to match products. */
const productMatchLength = 2;

/** */
const maxProducts = 6;

/** */
const selectionLang = 'en';

/** */
function clearMatchedProducts(self,name) {
    self.setState(() => ({
        visible: false,
        matches: null,
        name
    }));
}

/** */
function matchProducts(self,searchValue) {
    searchValue = searchValue.trim();
    if (searchValue.length < 2) {
        clearMatchedProducts(self);
        return;
    }

    const matches = Products.matchByName(searchValue);
    if (matches.length == 0) {
        clearMatchedProducts(self,searchValue);
        return;
    }

    self.setState(() => ({
        visible: true,
        index: 0,
        matches
    }));
}

/** */
function selectProduct(self) {
    const index = self.state.index;
    const matches = self.state.matches;
    if (index >= 0 && matches) {
        const product = matches[index];
        self.textFieldRef.current.setValue(product.name[selectionLang]);
        if (self.props.onProductSelect) {
            self.props.onProductSelect(product);
        }
    }
    else {
        if (self.props.onProductNameSelect) {
            self.props.onProductNameSelect(self.state.name);
        }
    }
}

/** */
function renderMatchedProducts(self) {
    if (!self.state.visible) {
        return null;
    }
/*    if (!self.state.matches) {
        return null;
    }*/
    const products = [];
    for (let index = 0; index < self.state.matches.length; index++) {
        const selected = index === self.state.index;
        products.push(<ProductSelectorItem
            productMatch={self.state.matches[index]}
            selected={selected}
            index={index}
            onClick={self.onProductClick}
            onMouseEnter={self.onProductEnter}/>);
        if (index === maxProducts) {
            break;
        }
    }
    return (
        <div className="product-selector-products">
            {products}
        </div>
    );
}

/** */
export default class ProductSelector extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.textFieldRef = React.createRef();
        this.onValueChange = this.onValueChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onProductClick = this.onProductClick.bind(this);
        this.onProductEnter = this.onProductEnter.bind(this);
    }

    /** */
    focus() {
        this.textFieldRef.current.focus();
    }

    /** */
    setValue(value) {
        this.textFieldRef.current.setValue(value);
        this.textFieldRef.current.select();
        matchProducts(this,value);
    }

    /** */
    onValueChange(value) {
        matchProducts(this,value);
    }

    /** */
    onKeyDown(event) {
        if (event.keyCode == 27) {
            event.stopPropagation();
            event.preventDefault();
            if (this.props.onCancel) {
                this.props.onCancel();
            }
        }
        if (event.keyCode == 13) {
            event.stopPropagation();
            event.preventDefault();
            selectProduct(this);
        }
        if (event.keyCode == 38) {
            event.stopPropagation();
            event.preventDefault();
            const index = this.state.index;
            if (index > 0) {
                this.setState((prevState) => ({
                    ...prevState,
                    index: index - 1
                }));
            }
        }
        if (event.keyCode == 40) {
            event.stopPropagation();
            event.preventDefault();
            const index = this.state.index;
            const matches = this.state.matches;
            if (index < matches.length - 1) {
                this.setState((prevState) => ({
                    ...prevState,
                    index: index + 1
                }));
            }
        }
    }

    /** */
    onProductClick() {
        selectProduct(this);
    }

    /** */
    onProductEnter(index) {
        this.setState((prevState) => ({
            ...prevState,
            index
        }));
    }

    /** */
    render() {
        return (
            <div className="product-selector">
                <TextField ref={this.textFieldRef}
                    onValueChange={this.onValueChange}
                    onKeyDown={this.onKeyDown}/>
                {renderMatchedProducts(this)}
            </div>
        );
    }
}