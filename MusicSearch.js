import { Component } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import SearchBar from './SearchBar';
import spotify_search from "./api/spotify_search";

const Container = styled.View`
background: ${THEME.Music.primary_color};
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
            query: '',
            isFetching: false,
            isEmpty: false,
            spotify_token: null,
            isTokenFetching: false,
        };
    }

    async componentDidMount() {
        await this.refreshToken();
        await this.loadNextPage();
    }

    async componentWillMount() {
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
                    <Header title="Music" />
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