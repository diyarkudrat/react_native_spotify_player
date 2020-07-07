import { Component } from "react";
import React from 'react';
import { SafeAreaView, ActivityIndicator, Text, Linking } from "react-native";
import styled from 'styled-components/native';
import SearchBar from './SearchBar';
import Listing from './Listing';
import spotify_search from "./api/spotify_search";
import spotify_token from './api/spotify_token';
import { authEndpoint, clientId, redirectUri, scopes } from "./api/config";



const Container = styled.View`
	height: 100%;
  padding: 0px 15px;
`;

const SongQueue = styled.View`
margin-top: 20px;
`;



const PAGE = 20;

class MusicSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            offset: 0,
            query: 'Turks',
            isFetching: false,
            isEmpty: false,
            spotify_token: "BQAduBri-Ys-MZpVXJiQBI2BKVmWXv0kYjHcCt_1LgnNcEEdNzx6GEWL4ztMZBWVdtlhYgK8FSkuN1nJHQvH5OQ1rwizbUFsOkV0_GJJJ31BAdDHLgjndAcjpi4uxtYP5O_o7GaBTQf2JlTcAvSjH2khENxmf1JLaoiz9yW9oz6kFRp6v-nhiIpPA5_hHjjJz_4kfhxh7pUWJH34F1O5qvcjdIqfyUpdji0j10S4q94woFwu6EnU8xY9Skl1QhdaB-09wKVCJmfGgUl0NA",
            isTokenFetching: false,
        };
    }

    async componentDidMount() {
        await this.refreshToken();
        await this.loadNextPage();
    }

    async UNSAFE_componentWillMount() {
        this.refreshToken();
        this.loadNextPage();
    }

    handleSearchChange(text) {
        this.setState(
            {
                isEmpty: false,
                query: text,
                offset: 0,
                songs: []
            },
            () => {
                this.loadNextPage();
            }
        );
    }

    async loadNextPage() {
        const {
            songs,
            offset,
            query,
            spotify_token,
            isFetching,
            isEmpty
        } = this.state;

        if (isFetching || isEmpty) {
            return;
        }

        this.setState({ isFetching: true });

        const newSongs = await spotify_search({
            offset: offset,
            limit: PAGE,
            q: query,
            spotify_token
        });

        if (newSongs.length === 0) {
            console.log('no songs found. Error might have ocurred')
            this.setState({ isEmpty: true });
        }

        this.setState({
            isFetching: false,
            songs: [...songs, ...newSongs],
            offset: offset + PAGE
        });
    }

    async refreshToken() {
        this.setState({
            isTokenFetching: true
        });

        const newToken = await spotify_token();

        this.setState({
            spotify_token: newToken,
            isTokenFetching: false
        });
    }

    async handleEndReached() {
        await this.loadNextPage();
    }


    render() {
        const { query, songs, isFetching } = this.state;
        return (
            <Container>
                <SafeAreaView>
                <Text style={{color: 'blue'}}
                    onPress={() => Linking.openURL(`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                        "%20"
                    )}&response_type=token&show_dialog=true`)}>
                Login to Spotify
                </Text>

                    <SearchBar
                        onChange={text => this.handleSearchChange(text)}
                        text={query}
                    />
                    <SongQueue>
                    {isFetching && songs.length === 0 ? (
                        <ActivityIndicator />
                    ) : (
                        <Listing
                            items={songs}
                            onEndReached={() => this.handleEndReached()}
                        />
                    )}

                    </SongQueue>
                </SafeAreaView>
            </Container>
        )
    }
}

export default MusicSearch;
