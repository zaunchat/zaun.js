# ItChat.js

### Installation (NodeJS only)
```
$ npm i @itchatapp/client
```

### Example Usage
```ts
import { Client } from '@itchatapp/client'

const client = new Client()

client.on('messageCreate', (msg) => {
    if (msg.content === '!ping') {
        msg.reply('Pong!')
    }
})

client.login('your-token-here')
```


### Resources
- [Docs](https://docs.itchat.world/itchat.js)