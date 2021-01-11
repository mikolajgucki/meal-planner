import React from 'react';
import IngredientsParser from '../../../common/meal/IngredientsParser';
import ProductsDB from '../../db/ProductsDB';
import TextArea from '../TextArea';
import FloatingItemSelector from '../item-selector/FloatingItemSelector';

/** */
const translations = {
    'select.product': 'Select product:'
}

/** */
function updateCursorAndLines(self) {
    const lines = self.textAreaRef.current.getLines();
    const cursor = self.textAreaRef.current.getCursorPosition()
    self.setState((prevState) => ({
        ...prevState,
        lines, cursor
    }));
}

/** */
function showFloatingItemSelector(self) {
    let name = '';
    if (self.state.parsedLine) {
        name = self.state.parsedLine.name;
    }
    self.floatingItemSelectorRef.current.show(name);
}

/** */
function productSelected(self,productName) {
    if (productName && self.state.cursor) {
        let line = productName;
        const parsedLine = self.state.parsedLine;
        if (parsedLine && parsedLine.amountStr) {
            line += ' ' + parsedLine.amountStr;
        }
        else {
            line += ' ';
        }

        const y = self.state.cursor.y;
        self.textAreaRef.current.replaceLine(y,line);
        self.textAreaRef.current.focus();

        const lines = self.textAreaRef.current.getLines();
        self.textAreaRef.current.setCursorPosition(lines[y].end);
    }
}

/** */
function searchProducts(searchValue) {
    return ProductsDB.matchByName(searchValue).map(product => {
        return {
            name: product.name,
            details: product.energyPer100 + 'kcal',
            matches: product.matches,
            searchValue
        }
    });
}

/** */
export default class MealIngredientsArea extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            cursor: null,
            lines: null,
            parsedLine: null
        };

        this.textAreaRef = React.createRef();
        this.floatingItemSelectorRef = React.createRef();

        this.onValueChange = this.onValueChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onProductSelectCancel = this.onProductSelectCancel.bind(this);
        this.onProductSelect = this.onProductSelect.bind(this);
        this.onProductNameSelect = this.onProductNameSelect.bind(this);
    }

    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }
    
    /** */
    focus() {
        this.textAreaRef.current.focus();
    }

    /** */
    showItemSelector() {
        showFloatingItemSelector(this);
    }

    /** */
    onValueChange(value) {
        const lines = this.textAreaRef.current.getLines();
        const cursor = this.textAreaRef.current.getCursorPosition();

        this.setState((prevState) => ({
            ...prevState,
            lines, cursor
        }));

        if (this.props.onIngredientsChange) {
            this.props.onIngredientsChange(value);
        }
    }

    /** */
    onKeyUp(event) {
    // ctrl + space
        if (event.keyCode === 32 && event.ctrlKey === true) {
            showFloatingItemSelector(this);
            return;
        }
        updateCursorAndLines(this);
    }

    /** */
    onKeyPress(event) {
    // ctrl + enter
        if (event.charCode === 13 && event.ctrlKey === true) {
            showFloatingItemSelector(this);
            return;
        }
    }

    /** */ 
    onClick() {
        updateCursorAndLines(this);
    }

    /** */
    onProductSelectCancel() {
        this.textAreaRef.current.focus();
    }

    /** */
    onProductSelect(product) {
        const matchLang = product.matches[0].lang;
        productSelected(this,product.name[matchLang]);
    }

    /** */
    onProductNameSelect(productName) {
        productSelected(this,productName);
    }

    /** */
    componentDidMount() {
        this.state.lines = this.textAreaRef.current.getLines();
        this.state.cursor = this.textAreaRef.current.getCursorPosition();
    }

    /** */
    componentDidUpdate() {
        const y = this.state.cursor.y;
        const lines = this.state.lines;
        this.state.parsedLine = IngredientsParser.parseLine(lines[y].text);
    }

    /** */
    render() {
        return (
            <div className="meal-ingredients-area">
                <TextArea ref={this.textAreaRef}
                    onValueChange={this.onValueChange}
                    onKeyUp={this.onKeyUp}
                    onKeyPress={this.onKeyPress}
                    onClick={this.onClick}/>
                <FloatingItemSelector
                    ref={this.floatingItemSelectorRef}
                    title={this.translate('select.product')}
                    matchByName={searchProducts}
                    onCancel={this.onProductSelectCancel}
                    onItemSelect={this.onProductSelect}
                    onItemNameSelect={this.onProductNameSelect}/>
            </div>
        );
    }
}