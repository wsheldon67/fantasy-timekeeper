const express = require('express')
const app = express()
const formidable = require('express-formidable')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://wsheldon:5FnJsnasstGDuz2Q@pathfinder.7k1k9.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try {
    await client.connect()
    console.log('Connected to Atlas')
    
    const db = client.db('timer')
    const col = db.collection('timers')

    let timer_doc = {
      'camp':1,
      'notes':'wefff'
    }

    const p = await col.insertOne(timer_doc)
    const myDoc = await col.findOne()

    console.log(myDoc)
  } catch (err){
    console.log(err.stack)
  } finally {
    await client.close()
  }
}

run().catch(console.dir)

let port = process.env.PORT;
if (port == null || port == ""){port = 3003}

app.use(formidable())

app.use(express.static('public'))

app.listen(port, ()=>{
  console.log(`Server started at port ${port}`)
})