# EscapeRoom Server

## API Documentation

### Description

This api allows you to use GET and POST methods to read and submit highscores to Escape Room!

#### *[LIVE APP](https://theescaperoom.vercel.app/)*

#### *[FRONTEND REPO](https://github.com/JakelTheDeveloper/EscapeRoom)*

#### Version

-1.0.0

## Servers

### HighScore Server

#### URL: 

```
                    https://desolate-dusk-00206.herokuapp.com/api/scores
```

#### DESCRIPTION:

 

``` 
                    method: 'GET' 
```

```
                    fetch(`${config.URL}/api/scores`, {headers: {
                        'authorization': `Bearer ${config.API_KEY}`,
                    }})
```


#### DESCRIPTION: 



``` 
                    method: 'POST'
```

``` 
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                    }),
                    headers: { 'Content-Type': 'application/json',
                    'authorization': `Bearer ${config.API_KEY}` }

                    expect(201)
```      
```