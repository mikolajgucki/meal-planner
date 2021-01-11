import React from 'react';
import classNames from 'classnames';
import TextField from '../TextField';
import ItemSelectorEntry from './ItemSelectorEntry';

/** The number of characters that must be entered in order to match items. */
const MIN_MATCH_LENGTH = 2;

/** */
const MAX_PRODUCTS = 6;

/** */
const SELECTION_LANG = 'en';

/** */
function clearMatchedProducts(self,name) {
    self.setState(() => ({
        matches: null,
        name
    }));
}

/** */
function matchProducts(self,searchValue) {
    searchValue = searchValue.trim();
    if (searchValue.length < MIN_MATCH_LENGTH) {
        clearMatchedProducts(self);
        return;
    }

    const matches = self.props.matchByName(searchValue);
    if (matches.length == 0) {
        clearMatchedProducts(self, searchValue);
        return;
    }

    self.setState(() => ({
        index: 0,
        matches
    }));
}

/** */
function selectProduct(self) {
    const index = self.state.index;
    const matches = self.state.matches;
    if (index >= 0 && matches) {
        const item = matches[index];
        self.textFieldRef.current.setValue(item.name[SELECTION_LANG]);
        if (self.props.onItemSelect) {
            self.props.onItemSelect(item);
        }
    }
    else {
        if (self.props.onItemNameSelect) {
            self.props.onItemNameSelect(self.state.name);
        }
    }
}

/** */
function renderMatchedItems(self) {
    if (!self.state.matches || !self.state.hasFocus) {
        return null;
    }
    const items = [];
    for (let index = 0; index < self.state.matches.length; index++) {
        const selected = index === self.state.index;
        items.push(<ItemSelectorEntry
            itemMatch={self.state.matches[index]}
            selected={selected}
            index={index}
            onClick={self.onProductClick}
            onMouseEnter={self.onProductEnter} />);
        if (index === MAX_PRODUCTS) {
            break;
        }
    }
    return (
        <div className="item-selector-items">
            {items}
        </div>
    );
}

/** */
function setHasFocus(self,hasFocus) {
    self.setState((prevState) => ({
        ...prevState,
        hasFocus
    }));
    if (!hasFocus) {
        self.textFieldRef.current.blur();
    }
}

/** */
export default class ItemSelector extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            hasFocus: false,
        };
        this.value = '';
        this.textFieldRef = React.createRef();
        this.onValueChange = this.onValueChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onTextFieldFocus = this.onTextFieldFocus.bind(this);
        this.onTextFieldBlur = this.onTextFieldBlur.bind(this);
        this.onProductClick = this.onProductClick.bind(this);
        this.onProductEnter = this.onProductEnter.bind(this);
        this.onMaskClick = this.onMaskClick.bind(this);
    }

    /** */
    focus() {
        this.textFieldRef.current.focus();
        setHasFocus(this,true);
    }

    /** */
    blur() {
        this.textFieldRef.current.blur();
        setHasFocus(this,false);
    }

    /** */
    onTextFieldFocus() {
        this.value = this.textFieldRef.current.getValue();
        setHasFocus(this,true);
        matchProducts(this,this.value);
    }

    /** */
    onTextFieldBlur() {
        // setHasFocus(this,false);
    }

    /** */
    setValue(value) {
        this.textFieldRef.current.setValue(value);
        this.textFieldRef.current.select();
        matchProducts(this,value);
    }

    /** */
    cancel() {
        this.textFieldRef.current.setValue(this.value);
        setHasFocus(this,false);
        if (this.props.onCancel) {
            this.props.onCancel();
        }
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
            this.cancel();
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
            if (matches && index < matches.length - 1) {
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
    onMaskClick() {
        this.cancel();
    }

    /** */
    render() {
        const maskHidden =
            !this.state.hasFocus ||
            !this.state.matches ||
            this.props.noMask;
        const maskClassNames = classNames(
            'item-selector-mask',
            { 'item-selector-mask-hidden': maskHidden });
        return (
            <div className="item-selector">
                <div className="item-selector-fields">
                    <TextField ref={this.textFieldRef}
                        onValueChange={this.onValueChange}
                        onKeyDown={this.onKeyDown}
                        onFocus={this.onTextFieldFocus}
                        onBlur={this.onTextFieldBlur} />
                    {renderMatchedItems(this)}
                </div>
                <div className={maskClassNames} onClick={this.onMaskClick}>
                </div>
            </div>
        );
    }
}