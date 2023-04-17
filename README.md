# zaun.js

### Installation (NodeJS only)
```
$ npm i @zaunchat/client
```

### Example Usage
```ts
import { Client } from '@zaunchat/client'

const client = new Client()

client.on('messageCreate', (msg) => {
    if (msg.content === '!ping') {
        msg.reply('Pong!')
    }
})

client.login('your-token-here')
```


### Resources
- [Docs](https://docs.zaun.chat/zaun.js)
