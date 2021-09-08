import {getData, leadingZeros, getID} from './help.js'


export function render_save(){
  const name = document.createElement('input')
  name.placeholder = 'Name'
  name.id = 'player_name'
  document.getElementById('enter_log').appendChild(name)
  var textarea = document.createElement('textarea') // textarea
  textarea.addEventListener('keydown',keyDown)
  textarea.id = 'log_text'
  textarea.setAttribute('cols','50')
  textarea.setAttribute('rows','8')
  document.getElementById('enter_log').appendChild(textarea)
  var button = document.createElement('button') // submit
  button.innerHTML = 'Submit'
  button.addEventListener('click',saveLog)
  document.getElementById('enter_log').appendChild(button)
}

function keyDown(evt){
  if (evt.keyCode == 13 && !evt.shiftKey){saveLog()}
}

function saveLog(){
  getData('global-time').then((res)=>{
    var formData = {
      'text': document.getElementById('log_text').value,
      'timestamp':JSON.stringify(res),
      'player':document.getElementById('player_name').value
    }
    getData('set-log',formData).then(()=>{
      document.getElementById('log_text').value = ''
      readLog(20)
    })
  })
}

// TODO these chew up a lot of data, fix that
export function readLog(limit){
  var formData = {limit}
  getData('log',formData).then((res)=>{
    document.getElementById('read_log').innerHTML = ''
    for (var i of res){
      var cont = document.createElement('div')
      cont.innerHTML = i.text
      document.getElementById('read_log').appendChild(cont)
    }
  })
}

export function readLogTime(limit){
  var formData = {limit}
  getData('log',formData).then((res)=>{
    document.getElementById('read_log').innerHTML = ''
    for (var i of res){
      if (!i.timestamp) {
        console.log(i._id,'no timestamp object')
        continue
      }
      var cont = document.createElement('div') // container
      cont.id = 'log_cont_'+i._id
      cont.classList.add('log-row')
      //cont.classList.add(`color${i.timestamp.day.value % 4}`)
      const t = i.timestamp
      const huepday = 32
      const hue = (t.month.value * t.day.overflow * huepday + t.day.value * huepday + t.hour.value) % 360
      cont.style.backgroundColor = `hsl(${hue}, 100%, 95%)`

      var del = document.createElement('button') // delete item
      del.value = i._id
      del.innerHTML = 'x'
      del.addEventListener('click',deleteLog)
      del.classList.add('x')
      cont.appendChild(del)

      var time = document.createElement('div') // timestamp
      time.innerHTML = pretty_time(i.timestamp)
      cont.appendChild(time)

      const player = document.createElement('div') // player
      player.innerHTML = i.player
      player.classList.add('left-pad')
      cont.appendChild(player)

      var text = document.createElement('text') // text
      text.innerHTML = i.text
      text.classList.add('left-pad')
      cont.appendChild(text)

      const tags = document.createElement('div') // tag cont
      tags.classList.add('tags')
      const loop_tags = i.tags || []
      for (let tag of loop_tags) {
        const el = document.createElement('a') // tag link
        el.href = `./whole-log.html?id=${getID()}&tags=${tag}`
        el.innerHTML = tag
        tags.appendChild(el)
      }
      cont.appendChild(tags)

      const add = document.createElement('input') // tag adder
      add.setAttribute('list','taglist')
      const id4tag = JSON.parse(JSON.stringify(i._id))
      add.addEventListener('keydown', e => add_tag(e, id4tag, tags))
      cont.appendChild(add)
      
      document.getElementById('read_log').appendChild(cont)
    }
  })
}

function deleteLog(){
  if (!confirm('Are you sure you want to delete this log item?')){return}
  document.getElementById('log_cont_'+this.value).remove()
  getData('delete-log',{'_id':this.value})
}

function pretty_time(i){
  var result = leadingZeros(i.year.value,4) + '-' + leadingZeros(i.month.value,2) + '-'
  result += leadingZeros(i.day.value,2) + ' ' + leadingZeros(i.hour.value,2) + ':'
  result += leadingZeros(i.minute.value,2) + ':' + leadingZeros(i.second.value,2)
  return result
}

async function add_tag(e, _id, tags) {
  if (e.keyCode !== 13){return}
  if (e.target.value == ''){return}
  const params = {tag: e.target.value, _id}
  getData('add-tag',params)
  getData('tag-to-log',params)
  const el = document.createElement('a') // tag link
  el.href = `./whole-log.html?id=${getID()}&tags=${e.target.value}`
  el.innerHTML = e.target.value
  tags.appendChild(el)
  e.target.value = ''
}