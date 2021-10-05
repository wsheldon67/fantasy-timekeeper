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
    {$set: {timers: JSON.parse(req.fields.json)}},
    'timers'
  )
  .then((doc)=>{res.send(doc)})
})

app.post('/get-timer',(req,res)=>{
  get({id: req.fields.id},'timers')
  .then((doc)=>{
    if (doc){res.send(JSON.stringify(doc.timers))}
    else {res.send({})}
  })
})

app.post('/set-log',(req,res)=>{
  const to_in = {
    'id': req.fields.id,
    'text':req.fields.text,
    'timestamp':JSON.parse(req.fields.timestamp),
    'player':req.fields.player,
    'tags':req.fields.tags || []
  }
  insert(to_in,'logs')
  .then((doc)=>{res.send({})})
})

app.post('/global-time',(req,res)=>{
  get({id: req.fields.id},'timers')
  .then((doc)=>{
    res.send(JSON.stringify(doc.timers[0]))
  })
})

app.post('/log',(req,res)=>{
  console.log(req.fields)
  const options = {
    'timestamp.year.value':-1,
    'timestamp.month.value':-1,
    'timestamp.day.value':-1,
    'timestamp.hour.value':-1,
    'timestamp.minute.value':-1,
    'timestamp.second.value':-1,
    '_id':-1
  }
  const query = {id: req.fields.id}
  const tags = req.fields.tags
  if (tags && tags != 'undefined') {query.tags = {$in: tags.split('-')}}
  get_many( query, options, Number(req.fields.limit),'logs')
  .then((doc)=>{
    res.send(JSON.stringify(doc))
  })
})

app.post('/delete-log',(req,res)=>{
  del({_id: new ObjectId(req.fields._id)},'logs')
  .then((doc)=>{res.send({})})
})

async function del(query, collection){
  const db = client.db('timer')
  const col = db.collection(collection)
  const p = await col.deleteOne(query)
  return p
}
async function get_many(query, options, limit, collection){
  const db = client.db('timer')
  const col = db.collection(collection)
  const cursor = col.find(query).sort(options).limit(limit)
  const p = await cursor.toArray()
  return p
}
async function update(search, set, collection){
  const db = client.db('timer')
  const col = db.collection(collection)
  const p = await col.updateOne(search, set, {upsert: true})
  return p
}
async function get(search, collection){
  const db = client.db('timer')
  const col = db.collection(collection)
  const p = await col.findOne(search)
  return p
}
async function insert(doc, collection){
  const db = client.db('timer')
  const col = db.collection(collection)
  const p = await col.insertOne(doc)
}

app.post('/add-tag',(req,res)=>{
  update({id: req.fields.id},{$addToSet: {tags: req.fields.tag}},'tags')
  .then((doc)=>{res.send({})})
})
app.post('/tag-to-log',(req,res)=>{
  const search = {
    id: req.fields.id,
    _id: new ObjectId(req.fields._id)
  }
  update(search, {$addToSet:{tags: req.fields.tag}},'logs')
  .then((doc)=>{res.send({})})
})

app.post('/get-tags',(req,res)=>{
  get({id: req.fields.id},'tags')
  .then((doc)=>{res.send(JSON.stringify(doc))})
})

client.connect()
.then(()=>{app.listen(port, ()=>{
  console.log(`Server started at port ${port}`)
})})