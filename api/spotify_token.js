import base64 from 'react-native-base64'
const apiPrefix = 'https://accounts.spotify.com/api';

const clientId = '4eb00dc779e145f19d20810ced481278';
const clientSecret = '332b65ac9bb04f4cbc6ec43077290db9';

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