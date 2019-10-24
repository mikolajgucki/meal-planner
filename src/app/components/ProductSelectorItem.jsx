import React from 'react';
import classNames from 'classnames';

/** */
const productNameLangs = ['en','pl'];

/** */
function renderMatchedName(name,indexes,searchValue) {
    if (!indexes || !searchValue) {
        return name;
    }

// mask
    const mask = [];
    for (let chIndex = 0; chIndex < name.length; chIndex++) {
        let matched = false;
        for (let index of indexes) {
            if (chIndex >= index && chIndex < index + searchValue.length) {
                matched = true;
                break;
            }
        }
        mask.push(matched ? 1 : 0);
    }

// lengths
    const lengths = [];
    let index = 0;
    while (index < mask.length) {
        const value = mask[index];
        let length = 0;
        while (mask[index] === value && index < mask.length) {
            length++;
            index++;
        }
        lengths.push(length);
    }

// name
    const renderedName = [];
    let matched = !!mask[0];
    let start = 0;
    for (const length of lengths) {
        const sub = name.substring(start,start + length);
        if (matched) {
            renderedName.push(<u>{sub}</u>);
        }
        else {
            renderedName.push(<span>{sub}</span>);
        }
        matched = !matched;
        start += length;
    }

    return renderedName;
}

/** */
function renderProductName(product) {
    const name = [];

    for (const lang of productNameLangs) {
        const separator = name.length > 0 ? ' / ' : '';
        const match = product.matches.find((match) => {
            return match.lang === lang;
        });
        const indexes = match ? match.indexes: null;
        name.push(<span>{separator}</span>);
        name.push(renderMatchedName(
            product.name[lang],indexes,product.searchValue));
    }

    name.push(
        <span className="product-selector-item-energy">
            {' / ' + product.energyPer100 + 'kcal'}
        </span>
    );
    return name;
}

/** */
export default class ProductSelectorItem extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
    }

    /** */
    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.index);
        }
    }

    /** */
    onMouseEnter() {
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(this.props.index);
        }
    }

    /** */
    render() {
        const productClassNames = classNames(
            'product-selector-item',
            { 'product-selector-item-selected': this.props.selected });
        return (
            <div className={productClassNames}
                onClick={this.onClick}
                onMouseEnter={this.onMouseEnter}>
                <div className="product-selector-item-name">
                    {renderProductName(this.props.productMatch)}
                </div>
            </div>
        );
    }
}