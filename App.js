import { Component } from "react";
import React from 'react';
import { SafeAreaView, ActivityIndicator } from "react-native";
import styled from 'styled-components/native';
import SearchBar from './SearchBar';
import Listing from './Listing';
import spotify_search from "./api/spotify_search";
import spotify_token from './api/spotify_token';

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
            query: 'Revenge',
            isFetching: false,
            isEmpty: false,
            spotify_token: "BQBZjME0qCO-oIs5_82xzyN_xq0_Nk8ZWuBQOHDkHkPZZp7lddWFqMuq-_RL1cyIQ9QZmFBA7SkfkJgurDOt8ZzE2qdurMV3T4JNbhpw-OSse6Xpn3KWT0AKQNV6wEY_krWO5TuqeMGtZESz",
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
