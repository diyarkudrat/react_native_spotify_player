import React, { Component } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

import ListItem from './ListItem';

// import Header from '../feeatures/Header';
// import Separator from '../features/Separator'

const NoSongs = styled.Text`
font-size: 18PX;
font-weight: bold;
color: #fff;
`;


export default ({ item, onEndReached }) => (
    <FlatList
        data={item}
        renderItem={({ item }) => <ListItem item={ item}/>}
        keyExtractor={( item, index) => index.toString()}
        ItemsSeparatorComponent={() => <Separator />}
        onEndReached={onEndReached}
        ListEmptyComponent={() => <NoSongs>No songs found</NoSongs>}
    />
)