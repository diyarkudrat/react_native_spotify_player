const apiPrefix = 'https://api.spotify.com/v1';

export default async ({
    offset,
    limit,
    q,
    spotify_token,
}) => {
        const uri = `${apiPrefix}/search?type=album,artist,track,playlist&limit=${limit}&offset=${offset}&q=${encodeURIComponent(q)}`;
        console.log('Begin Search, uri=', uri, 'token=', spotify_token);

        const res = await fetch(uri, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${spotify_token}`,
            },
            mode: 'cors',
        });

        const json = await res.json;
        console.log(res.json)

        if (!res.ok) {
            return [];
        }

        const {
            tracks: {
                items
            }
        } = json;

        return items.map(item => ({
            id: item.id,
            title: item.name,
            popularity: item.popularity,
            artist: item.artists
                ? item.artists[0].name
                : undefined,
            albums: item.album.name,
            is_playable: is_playable,
            preview_url: preview_url,
            imageUri: item.album.images
                ? item.album.images[0].url
                : undefined
        }));
};