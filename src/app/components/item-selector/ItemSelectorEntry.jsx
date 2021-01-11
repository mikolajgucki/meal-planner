import React from 'react';
import classNames from 'classnames';

/** */
const NAME_LANGS = ['en','pl'];

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
function renderItemName(itemMatch) {
    const name = [];

    for (const lang of NAME_LANGS) {
        const separator = name.length > 0 ? ' / ' : '';
        const match = itemMatch.matches.find((match) => {
            return match.lang === lang;
        });
        const indexes = match ? match.indexes: null;
        name.push(<span>{separator}</span>);
        name.push(renderMatchedName(
            itemMatch.name[lang],indexes,itemMatch.searchValue));
    }

    if (itemMatch.details) {
        name.push(
            <span className="item-selector-item-details">
                {' / ' + itemMatch.details}
            </span>
        );
    }
    return name;
}

/** */
export default class ItemSelectorEntry extends React.Component {
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
        const itemClassNames = classNames(
            'item-selector-item',
            { 'item-selector-item-selected': this.props.selected });
        return (
            <div className={itemClassNames}
                onClick={this.onClick}
                onMouseEnter={this.onMouseEnter}>
                <div className="item-selector-item-name">
                    {renderItemName(this.props.itemMatch)}
                </div>
            </div>
        );
    }
}