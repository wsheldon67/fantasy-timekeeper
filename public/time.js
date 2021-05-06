import {leadingZeros,parseJSON} from './help.js'

export class Time{
  /**
   * Create fantasy date/time object
   * @param {Number} months_in_year 
   * @param {Number} days_in_month 
   * @param {Number} hours_in_day 
   * @param {Number|Boolean} pm_switch At what hour the clock swtiches to PM.  If false, military style time will be used.
   * @param {Boolean} one_based If true, months & days start at one instead of zero.
   */
  constructor(months_in_year,days_in_month,hours_in_day,pm_switch,one_based){
    this.types = ['year','month','day','hour','minute','second']
    this.year = {'value':0,'overflow':Infinity,'next':null}
    this.month = {'value':0,'overflow':months_in_year,'next':'year'}
    this.day = {'value':0,'overflow':days_in_month,'next':'month'}
    this.hour = {'value':0,'overflow':hours_in_day,'next':'day'}
    this.minute = {'value':0,'overflow':60,'next':'hour'}
    this.second = {'value':0,'overflow':60,'next':'minute'}
    this.pm_switch = pm_switch
    this.one_based = one_based
  }
  add(q,type){
    if (typeof(q) == 'object'){this.add_obj(q)}
    else {this.add_num(q,type)}
  }
  add_num(q,type){
    try{if (type.slice(-1) == 's'){type = type.slice(0,-1)}}
    catch{
      console.log('Created a negative number')
      for (var i of this.types){this[i].value = 0}
      return
    }
    this[type].value += q
    if (this[type].value >= this[type].overflow || this[type].value < 0){
      // subtract the number of things that fit into value
      var quotient = Math.floor(this[type].value/this[type].overflow)
      this[type].value -= quotient * this[type].overflow
      // add the number of times you did that to next
      this.add(quotient,this[type].next)
    }
  }
  con_log(){
    console.log(this.year.value,this.month.value,this.day.value,this.hour.value,this.minute.value,this.second.value)
  }
  add_obj(obj,subtract){
    if (subtract){var sign = -1}else{var sign = 1}
    this.add(obj.year.value * sign,'year')
    this.add(obj.month.value * sign,'month')
    this.add(obj.day.value * sign,'day')
    this.add(obj.hour.value * sign,'hour')
    this.add(obj.minute.value * sign,'minute')
    this.add(obj.second.value * sign,'second')
  }
  next(q,type,obj){
    this.add(q,type) // add q of type
    var change = {}
    change[type] = q
    for (var i of this.types){
      if (this.types.indexOf(i) > this.types.indexOf(type)){
        change[i] = obj[i].value - this[i].value
        this[i].value = obj[i].value // for each type less than the set type, set value
      }
    }
    return change
  }
  /**
   * Set a date/time
   * @param {String} type 'year' 'month' 'day' 'hour' 'minute' 'second' 
   * @param {Number} q number to set the unit to
   * @param {Boolean} pm Only used with type='hour', true means hours set are in the PM
   */
  set(type,q,pm){
    if (this.one_based){
      if(type == 'month' || type == 'day'){q--}
    }
    if (pm == ' PM' && type == 'hour' && q != this.pm_switch){
      q += this.pm_switch
    }
    this[type].value = q
  }
  get(type){
    if (this.pm_switch){
      if (this.hour.value == this.pm_switch){
        this.dumb_hour = leadingZeros(this.hour.value,2)
        this.suffix = ' PM'
      } else if (this.hour.value > this.pm_switch){
        this.dumb_hour = leadingZeros(this.hour.value - this.pm_switch,2)
        this.suffix = ' PM'
      } else {
        this.dumb_hour = leadingZeros(this.hour.value,2)
        this.suffix = ' AM'
      }
    } else {
      this.dumb_hour = leadingZeros(this.hour.value,2)
      this.suffix = ''
    }
    if (this.one_based){
      this.dumb_month = leadingZeros(this.month.value + 1, 2)
      this.dumb_day = leadingZeros(this.day.value + 1, 2)
    } else {
      this.dumb_month = leadingZeros(this.month.value, 2)
      this.dumb_day = leadingZeros(this.day.value,2)
    }
    return {
      'year':leadingZeros(this.year.value,4),'month':this.dumb_month,'day':this.dumb_day,
      'hour':this.dumb_hour,'minute':leadingZeros(this.minute.value,2),'second':leadingZeros(this.second.value,2),'suffix':this.suffix
    }[type]
  }
}

export class AllTimers{
  constructor(){
    this.timers = []
  }
  addTimer(name,months_in_year,days_in_month,hours_in_day,pm_switch,one_based){
    var timer = new Time(months_in_year,days_in_month,hours_in_day,pm_switch,one_based)
    timer.name = name
    this.timers.push(timer)
  }
  removeTimer(id){
    this.timers.splice(id,1)
  }
  fromJSON(json){
    var arry = parseJSON(json)
    for (var i of arry){
      // i = timer object
      this.addTimer()
      for (var k in i){
        // k = key
        this.timers[this.timers.length-1][k] = i[k]
      }
    }
  }
  toJSON(){
    var res = []
    var toSave = ['year','month','day','hour','minute','second','name','one_based','pm_switch','name','id']
    for (var i of this.timers){
      // i = timer object
      var data = {}
      for (var k of toSave){
        // k = 'year', 'month', etc
        data[k] = i[k]
      }
      res.push(data)
    }
    return JSON.stringify(res)
  }
  add(q,type){
    for (var i of this.timers){
      i.add(q,type)
    }
  }
  next(q,type,obj,id){
    var change = this.timers[id].next(q,type,obj)
    for (var i of this.timers){
      // i = timer obj
      if (this.timers.indexOf(i) == id){continue}
      for (var k in change){
        // k = 'year' etc
        i.add(change[k],k)
      }
    }
  }
}