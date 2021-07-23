import {getData, leadingZeros} from './help.js'


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
  var formData = {'limit': limit}
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
  var formData = {'limit':limit}
  getData('log',formData).then((res)=>{
    document.getElementById('read_log').innerHTML = ''
    for (var i of res){
      var cont = document.createElement('div') // container
      cont.id = 'log_cont_'+i._id
      cont.classList.add('log-row')
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