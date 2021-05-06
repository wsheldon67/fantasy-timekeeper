import {getData,parseJSON} from './help.js'
import {Time, AllTimers} from './time.js'

var timers = new AllTimers()
window.timers = timers

var quick_adds = {
  'Round':[6,'second'],
  'Minute':[1,'minute'],
  '10 Minutes':[10,'minute'],
  '30 Minutes':[30,'minute'],
  'Hour':[1,'hour'],
}
// quick adds
{
  var quick_area = document.createElement('div')
  quick_area.classList.add('quick_area')
  for (var i in quick_adds){
    var row = document.createElement('div') // row
    row.classList.add('row','space')
    var label = document.createElement('label') // label
    label.innerHTML = i;
    row.appendChild(label)
    var buttons = document.createElement('div') // button area
    buttons.classList.add('row')
    var plus = document.createElement('button') // plus
    plus.innerHTML = '+'
    plus.classList.add('plus','small_button')
    plus.addEventListener('click',addTime)
    plus.value = i
    buttons.appendChild(plus)
    var minus = document.createElement('button') // minus
    minus.innerHTML = '-'
    minus.classList.add('minus','small_button')
    minus.addEventListener('click',subTime)
    minus.value = i
    buttons.appendChild(minus)
    row.appendChild(buttons)
    quick_area.appendChild(row)
  }
  document.getElementById('timer').appendChild(quick_area)
}
// timer area
{
  var settings = `
  <div id='timer_settings' class='hidden'>
  <div class='row space'><label>Months per Year:</label><input type='number' id='months_in_year' value='12'></div>
  <div class='row space'><label>Days per Month:</label><input type='number' id='days_in_month' value='32'></div>
  <div class='row space'><label>Hours per Day:</label><input type='number' id='hours_in_day' value='24'></div>
  <div class='row space'><label>PM Switch:</label><input type='number' id='pm_switch' value='12'></div>
  <div class='row space'>
    <label>One Based:</label>
    <select id='one_based'><option value='1'>True</option><option value='0'>False</option></select>
  </div>
  <div>
  `
  var timer_area = document.createElement('div') // timer area
  timer_area.classList.add('col')
  timer_area.id = 'timer_area'
  timer_area.innerHTML = settings
  var button = document.createElement('button') // add button
  button.innerHTML = 'Add Timer'
  button.addEventListener('click',addTimerQ)
  timer_area.appendChild(button)
  document.getElementById('timer').appendChild(timer_area)
  document.getElementById('months_in_year').addEventListener('keydown',timer_keydown)
  document.getElementById('days_in_month').addEventListener('keydown',timer_keydown)
  document.getElementById('hours_in_day').addEventListener('keydown',timer_keydown)
  document.getElementById('pm_switch').addEventListener('keydown',timer_keydown)
}

function timer_keydown(evt){
  if (evt.keyCode == 13){
    addTimer()
    document.getElementById('timer_settings').classList.add('hidden')
  }
}

var morning = new Time(12,32,24,12,true)
morning.add(8,'hour')
function addTime(){
  timers.add(...quick_adds[this.value])
  postTime()
}
function subTime(){
  t.add(-quick_adds[this.value][0],quick_adds[this.value][1])
  postTime()
}

function addTimerQ(){
  if (document.getElementById('timer_settings').classList.contains('hidden')){
    document.getElementById('timer_settings').classList.remove('hidden')
    document.getElementById('months_in_year').select()
    return
  } else {
    addTimer()
    document.getElementById('timer_settings').classList.add('hidden')
  }
}
// Timer area
function addTimer(){
  var cont = document.createElement('div') // container
  if (timers.timers.length%2 == 1){var cont_class = 'one'}else{var cont_class = 'two'}
  cont.classList.add('timer_row',cont_class)
  var label_row = document.createElement('div')
  label_row.classList.add('row','space')
  var label = document.createElement('input') // label
  label.classList.add('timer',cont_class)
  label.id = 'name_' + timers.timers.length
  label.addEventListener('input',updateLabel)
  label_row.appendChild(label)
  var del = document.createElement('button') // delete button
  del.innerHTML = 'x'
  del.id = 'del_'+timers.timers.length
  del.addEventListener('click',removeTimer)
  var next_day = document.createElement('button') // next day
  next_day.innerHTML = '+Day'
  next_day.classList.add('plus')
  next_day.id = 'next_'+timers.timers.length
  next_day.addEventListener('click',nextDay)
  label_row.appendChild(next_day)
  label_row.appendChild(del)
  cont.appendChild(label_row)
  var row = document.createElement('div') // row for time data
  function addThing(div,type,val){
    var year = document.createElement('input') // year
    year.value = val
    year.id = type + '_' + timers.timers.length
    year.classList.add('timer'+val)
    year.addEventListener('input',updateTime)
    div.appendChild(year)
  }
  addThing(row,'year','0000')
  row.appendChild(document.createTextNode('-'))
  addThing(row,'month','00')
  row.appendChild(document.createTextNode('-'))
  addThing(row,'day','00')
  row.appendChild(document.createTextNode(' '))
  addThing(row,'hour','00')
  row.appendChild(document.createTextNode(':'))
  addThing(row,'minute','00')
  row.appendChild(document.createTextNode(':'))
  addThing(row,'second','00')
  var suffix = document.createElement('select') // suffix
  suffix.addEventListener('input',updateSuffix)
  suffix.id = 'suffix_' + timers.timers.length
  var none = document.createElement('option')
  none.value = ''
  suffix.appendChild(none)
  var am = document.createElement('option')
  am.innerHTML = ' AM'
  am.value = ' AM'
  suffix.appendChild(am)
  var pm = document.createElement('option')
  pm.innerHTML = ' PM'
  pm.value = ' PM'
  suffix.appendChild(pm)
  row.appendChild(suffix)
  cont.appendChild(row)
  document.getElementById('timer_area').appendChild(cont)
  document.getElementById('year_'+timers.timers.length).select()
  function n(id){return Number(document.getElementById(id).value)}
  if (document.getElementById('one_based').value == '1'){var one_based = true}else{var one_based = false}
  timers.addTimer('',n('months_in_year'),n('days_in_month'),n('hours_in_day'),n('pm_switch'),one_based)
}

function nextDay(){
  var options = this.id.split('_')
  var id = Number(options[1])
  timers.next(1,'day',morning,id)
  postTime()
}

function updateTime(){
  var options = this.id.split('_')
  var type = options[0]
  var id = Number(options[1])
  var suffix = document.getElementById('suffix_'+id).value
  timers.timers[id].set(type,Number(this.value),suffix)
}

function updateSuffix(){
  var options = this.id.split('_')
  var id = Number(options[1])
  var hour = Number(document.getElementById('hour_'+id).value)
  timers.timers[id].set('hour',hour,this.value)
}

function updateLabel(){
  var options = this.id.split('_')
  var id = Number(options[1])
  timers.timers[id].name = this.value
}

function postTime(){
  var toGet = ['year','month','day','hour','minute','second','suffix']
  for (var i of timers.timers){
    var id = timers.timers.indexOf(i)
    for (var k of toGet){
      try{document.getElementById(k+'_'+id).value = i.get(k)}
      catch (err){
        console.error(err)
        console.log(k+'_'+id)
      }
    }
    document.getElementById('name_'+id).value = i.name
  }
  var formData = new FormData()
  formData.append('json',timers.toJSON())
  getData('set-timer',formData)
}

function removeTimer(){
  if (!confirm('Are you sure you want to delete this timer?')){return}
  var options = this.id.split('_')
  var id = Number(options[1])
  timers.removeTimer(id)
  var formData = new FormData()
  formData.append('json',timers.toJSON())
  getData('set-timer',formData).then(location.reload())
}


getData('timer').then((res)=>{
  var arry = parseJSON(res.value)
  for (var i of arry){
    addTimer()
  }
  timers.timers = []
  timers.fromJSON(res.value)
  postTime()
  document.getElementById('del_0').setAttribute('disabled','disabled')
})