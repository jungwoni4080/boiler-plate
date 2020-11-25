const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => res.send('Hello World!~~¾È³óÇÏ¼¼¿ä~~'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
