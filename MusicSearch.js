import { Component } from "react";
import { SafeAreaView } from "react-native";



const PAGE = 20;

class MusicSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            offset: 0,
            query: '',
            isFetching: false,
            isEmpty: false,
            spotify_token: null,
            isTokenFetching: false,
        };
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

    render() {
        return (
            <Container>
                <SafeAreaView>
                    <Header title="Music" />
                    <SearchBar
                        onChange={text => this.handleSearchChange(text)}
                        text={query}
                    />
                    <SongQueue>

                    </SongQueue>
                </SafeAreaView>
            </Container>
        )
    }
}

export default MusicSearch;