import React, { Component } from 'react';
import { Searchbar } from 'react-native-paper';

export default class MyComponent extends Component {
    constructor({ text }) {
        super();

        this.state = {
            text: text || '',
        };
    }

    handleChangeText(newText) {
        const { onChange } = this.props;

        this.setState({
            text: newText,
        }, () => {
            onChange && onChange(newText);
        });
    }

    render() {
        const { text } = this.state;
        return (
            <Searchbar
                placeholder="Search for a song"
                onChangeText={newText => this.handleChangeText(newText)}
                value={text}
            />
        );
    }
}