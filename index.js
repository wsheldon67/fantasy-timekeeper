const express = require('express')
const app = express()
const formidable = require('express-formidable')

let port = process.env.PORT;
if (port == null || port == ""){port = 3003}

app.use(formidable())

app.use(express.static('public'))

app.listen(port, ()=>{
  console.log(`Server started at port ${port}`)
})