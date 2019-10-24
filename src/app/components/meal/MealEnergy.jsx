import React from 'react';
import { parseInteger } from '../../util/util';
import TextField from '../TextField';

/** */
const translations = {
    energy: 'Energy (kcal):'
}

/** */
export default class MealEnergy extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            energy: null
        }
        this.textFieldRef = React.createRef();
        this.onValueChange = this.onValueChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    /** */
    translate(key) {
        return translations[key] ? translations[key] : key;
    }

    /** */
    focus() {
        this.textFieldRef.current.focus();
    }

    /** */
    onValueChange(value) {
        let energy = parseInteger(value);
        if (isNaN(energy) || energy <= 0) {
            energy = null;
            this.textFieldRef.current.setError();
            this.setState(() => ({ energy: null }))
        }
        else {
            this.textFieldRef.current.clearError();
            this.setState(() => ({ energy: energy }));
        }
        if (this.props.onEnergyChange) {
            this.props.onEnergyChange(energy);
        }
    }

    /** */
    onKeyPress(event) {
        if (event.charCode === 13) {
            if (this.props.onEnergyEnter) {
                this.props.onEnergyEnter();
            }
        }
    }

    /** */
    render() {
        return (
            <div class="meal-energy">
                <div class="meal-energy-label">
                    {this.translate('energy')}
                </div>
                <TextField ref={this.textFieldRef}
                    onValueChange={this.onValueChange}
                    onKeyPress={this.onKeyPress}/>
            </div>
        );
    }
}