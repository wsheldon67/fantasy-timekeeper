const express = require('express')
const app = express()
const formidable = require('express-formidable')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://wsheldon:5FnJsnasstGDuz2Q@pathfinder.7k1k9.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectID

let port = process.env.PORT;
if (port == null || port == ""){port = 3003}

app.use(formidable())

app.use(express.static('public'))

app.post('/set-timer',(req,res)=>{
  update(
    {id: req.fields.id},
    {$set: {timers: JSON.parse(req.fields.json)}}
  )
  .then((doc)=>{res.send(doc)})
})

app.post('/get-timer',(req,res)=>{
  get({id: req.fields.id})
  .then((doc)=>{
    if (doc){res.send(JSON.stringify(doc.timers))}
    else {res.send({})}
  })
})

app.post('/set-log',(req,res)=>{
  const to_in = {
    'id': req.fields.id,
    'text':req.fields.text,
    'timestamp':JSON.parse(req.fields.timestamp)
  }
  insert(to_in)
  .then((doc)=>{res.send({})})
})

app.post('/global-time',(req,res)=>{
  get({id: req.fields.id})
  .then((doc)=>{
    res.send(JSON.stringify(doc.timers[0]))
  })
})

app.post('/log',(req,res)=>{
  const options = {
    'timestamp.year.value':-1,
    'timestamp.month.value':-1,
    'timestamp.day.value':-1,
    'timestamp.hour.value':-1,
    'timestamp.minute.value':-1,
    'timestamp.second.value':-1
  }
  get_many({id: req.fields.id}, options)
  .then((doc)=>{
    res.send(JSON.stringify(doc))
  })
})

app.post('/delete-log',(req,res)=>{
  del({_id: new ObjectId(req.fields._id)})
  .then((doc)=>{res.send({})})
})

async function del(query){
  const db = client.db('timer')
  const col = db.collection('logs')
  const p = await col.deleteOne(query)
  return p
}
async function get_many(query, options){
  const db = client.db('timer')
  const col = db.collection('logs')
  const cursor = col.find(query).sort(options)
  const p = await cursor.toArray()
  return p
}
async function update(search, set){
  const db = client.db('timer')
  const col = db.collection('timers')
  const p = await col.updateOne(search, set, {upsert: true})
  return p
}
async function get(search){
  const db = client.db('timer')
  const col = db.collection('timers')
  const p = await col.findOne(search)
  return p
}
async function insert(doc){
  const db = client.db('timer')
  const col = db.collection('logs')
  const p = await col.insertOne(doc)
}

client.connect()
.then(()=>{app.listen(port, ()=>{
  console.log(`Server started at port ${port}`)
})})