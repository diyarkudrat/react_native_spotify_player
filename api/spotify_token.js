import base64 from 'react-native-base64'
const apiPrefix = 'https://accounts.spotify.com/api';

const clientId = 'a26a6acae9184ea8bd9acc1a9742defa';
const clientSecret = '614c403bc6f44c7f988c60451948202b';

const base64credentials = base64.encode(clientId + ':' + clientSecret)

export default async () => {
    console.log('token begin');
    const res = await fetch(`${apiPrefix}/token`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${base64credentials}`,
            'Content Type': 'application/x-www-form-urlencoded'
        },

        body: 'grant_type=client_credentials',
    });
    const json = await res.json();
    const newToken = json.access_token;
    console.log('token is', newToken);
    return newToken
}