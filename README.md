post http://localhost:8081/api/signup

{
"username": "integrate36",
"email": "integrate36@gmail.com",
"password": "integrate36"
}

{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjM4ODBlYjcyMWJkODA5NTQzNWQ3ZDUiLCJpYXQiOjE3MTQ5NzkwNTF9.0p86Kvm-oTTzbJaBcO5yfaJVmAXOV0i0FX0XWZbJavo",
"user": {
"teamId": [],
"leagueId": [],
"\_id": "663880eb721bd8095435d7d5",
"username": "integrate36",
"email": "integrate36@gmail.com",
"password": "$2b$10$Yu9itxKrNVtN.CAn.m5uFeyy6QgLqMZ/nsoJH0Xai/UMx9hhxjoli",
"\_\_v": 0
}
}



post http://localhost:8081/api/login

{
    "email": "integrate36@gmail.com",
    "password": "integrate36"
}


{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjM4ODBlYjcyMWJkODA5NTQzNWQ3ZDUiLCJpYXQiOjE3MTQ5NzkzOTN9.u5aerntakPVFhaGZ9xlU01iWiuXOZbxwT-MKnC9cEfw",
    "user": {
        "teamId": [],
        "leagueId": [],
        "_id": "663880eb721bd8095435d7d5",
        "username": "integrate36",
        "email": "integrate36@gmail.com",
        "password": "$2b$10$Yu9itxKrNVtN.CAn.m5uFeyy6QgLqMZ/nsoJH0Xai/UMx9hhxjoli",
        "__v": 0
    }
}



post http://localhost:8081/api/makeFavoriteTeam

{
    "userId": "663880eb721bd8095435d7d5",
    "teamId": "662f4f7b9e7c4a1af86b6a10"
}
{
    "message": "Favorite team added successfully",
    "user": {
        "teamId": [
            "662f4f7b9e7c4a1af86b6a10"
        ],
        "leagueId": [],
        "_id": "663880eb721bd8095435d7d5",
        "username": "integrate36",
        "email": "integrate36@gmail.com",
        "password": "$2b$10$Yu9itxKrNVtN.CAn.m5uFeyy6QgLqMZ/nsoJH0Xai/UMx9hhxjoli",
        "__v": 1
    }
}


get http://localhost:8081/api/getFavoriteTeams/663880eb721bd8095435d7d5

{
    "favoriteTeams": [
        {
            "_id": "662f4f7b9e7c4a1af86b6a10",
            "image": "https://example.com/team1.png",
            "name": "Arsenal",
            "__v": 0
        }
    ]
}


post http://localhost:8081/api/unmakeFavoriteTeam

{
    "userId": "663880eb721bd8095435d7d5",
    "teamId": "662f4f7b9e7c4a1af86b6a10"
}

{
    "message": "Favorite team removed successfully",
    "user": {
        "teamId": [],
        "leagueId": [],
        "_id": "663880eb721bd8095435d7d5",
        "username": "integrate36",
        "email": "integrate36@gmail.com",
        "password": "$2b$10$Yu9itxKrNVtN.CAn.m5uFeyy6QgLqMZ/nsoJH0Xai/UMx9hhxjoli",
        "__v": 2
    }
}


post http://localhost:8081/api/createTeam

{
    "image": "https://example.com/team1.png",
    "name": "Arsenal"
}

{
    "_id": "66388c3acb411c16bc61d6c4",
    "image": "https://example.com/team1.png",
    "name": "Arsenal",
    "__v": 0
}



get http://localhost:8081/api/getAllTeams

[
    {
        "_id": "662f4f7b9e7c4a1af86b6a10",
        "image": "https://example.com/team1.png",
        "name": "Arsenal",
        "__v": 0
    },
    {
        "_id": "662f4f859e7c4a1af86b6a12",
        "image": "https://example.com/team1.png",
        "name": "Madrid",
        "__v": 0
    },
    {
        "_id": "662f4f8b9e7c4a1af86b6a14",
        "image": "https://example.com/team1.png",
        "name": "Barcelona",
        "__v": 0
    },
    {
        "_id": "662f4f9c9e7c4a1af86b6a16",
        "image": "https://example.com/team1.png",
        "name": "Manchester United",
        "__v": 0
    },
    {
        "_id": "662f4fa69e7c4a1af86b6a18",
        "image": "https://example.com/team1.png",
        "name": "Liverpool",
        "__v": 0
    },
    {
        "_id": "66388c3acb411c16bc61d6c4",
        "image": "https://example.com/team1.png",
        "name": "Arsenal",
        "__v": 0
    }
]


post http://localhost:8081/api/createLeague


{
    "image": "https://example.com/team1.png",
    "name": "Premier League2"
}


{
    "_id": "66388cd9cb411c16bc61d6c7",
    "image": "https://example.com/team1.png",
    "name": "Premier League2",
    "__v": 0
}


get http://localhost:8081/api/getAllLeagues

[
    {
        "_id": "662f538e93a981303c77a3ff",
        "image": "https://example.com/league.png",
        "name": "Premier League",
        "teamId": "662f4f7b9e7c4a1af86b6a10",
        "__v": 0
    },
    {
        "_id": "662f539f93a981303c77a401",
        "image": "https://example.com/league.png",
        "name": "Premier League1",
        "teamId": "662f4f859e7c4a1af86b6a12",
        "__v": 0
    },
    {
        "_id": "662f53aa93a981303c77a403",
        "image": "https://example.com/league.png",
        "name": "Premier League2",
        "teamId": "662f4f8b9e7c4a1af86b6a14",
        "__v": 0
    },
    {
        "_id": "662f53b893a981303c77a405",
        "image": "https://example.com/league.png",
        "name": "Premier League3",
        "teamId": "662f4f9c9e7c4a1af86b6a16",
        "__v": 0
    },
    {
        "_id": "662f53c993a981303c77a407",
        "image": "https://example.com/league.png",
        "name": "Premier League4",
        "teamId": "662f4fa69e7c4a1af86b6a18",
        "__v": 0
    },
    {
        "_id": "66388cd9cb411c16bc61d6c7",
        "image": "https://example.com/team1.png",
        "name": "Premier League2",
        "__v": 0
    }
]


post http://localhost:8081/api/favorite

{
    "userId": "662f3bde6471311db07fd92b",
    "leagueId": "662f538e93a981303c77a3ff"
}
{
    "message": "Favorite team added successfully",
    "user": {
        "teamId": [
            "662f4f859e7c4a1af86b6a12",
            "662f4f8b9e7c4a1af86b6a14",
            "662f4f7b9e7c4a1af86b6a10"
        ],
        "leagueId": [
            "662f538e93a981303c77a3ff",
            "662f53b893a981303c77a405"
        ],
        "_id": "662f3bde6471311db07fd92b",
        "dob": "1970-01-02T17:55:01.996Z",
        "username": "Vinod",
        "email": "vinodku@gmail.com",
        "password": "$2b$10$TVakQKZJ6d6cjg4rn8fer.ZnY5kxEYTmaRaWKoqmi1X3VAy8.JGSG",
        "__v": 10
    }
}



get http://localhost:8081/api/favorite/662f3bde6471311db07fd92b

{
    "favoriteleagueId": [
        {
            "_id": "662f538e93a981303c77a3ff",
            "image": "https://example.com/league.png",
            "name": "Premier League",
            "teamId": "662f4f7b9e7c4a1af86b6a10",
            "__v": 0
        },
        {
            "_id": "662f53b893a981303c77a405",
            "image": "https://example.com/league.png",
            "name": "Premier League3",
            "teamId": "662f4f9c9e7c4a1af86b6a16",
            "__v": 0
        }
    ]
}


delete http://localhost:8081/api/favorite

{
    "userId": "662f3bde6471311db07fd92b",
    "leagueId": "662f538e93a981303c77a3ff"
}

{
    "message": "Favorite team removed successfully",
    "user": {
        "teamId": [
            "662f4f859e7c4a1af86b6a12",
            "662f4f8b9e7c4a1af86b6a14",
            "662f4f7b9e7c4a1af86b6a10"
        ],
        "leagueId": [
            "662f53b893a981303c77a405"
        ],
        "_id": "662f3bde6471311db07fd92b",
        "dob": "1970-01-02T17:55:01.996Z",
        "username": "Vinod",
        "email": "vinodku@gmail.com",
        "password": "$2b$10$TVakQKZJ6d6cjg4rn8fer.ZnY5kxEYTmaRaWKoqmi1X3VAy8.JGSG",
        "__v": 11
    }
}