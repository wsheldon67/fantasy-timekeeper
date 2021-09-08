export function getData(url,params){
  return new Promise((resolve,reject)=>{
    var req = new XMLHttpRequest()
    req.open('POST',url)
    req.onload = ()=>{
      try{if (req.status === 200){resolve(JSON.parse(req.responseText))}
      else {reject(Error(req.statusText))}}
      catch (err){
        console.error('Server sent',req.responseText,'and JSON didnt like it.')
        reject()
      }
    }
    req.onerror = ()=>{reject(Error('Network Error'))}
    var formData = new FormData()
    const url_args = new URLSearchParams(window.location.search)
    url_args.forEach((val, key)=>{
      formData.append(key, val)
    })
    for (var i in params){
      formData.append(i,params[i])
    }
    req.send(formData)
  })
}

export function getID(){return Number(new URLSearchParams(window.location.search).get('id'))}

export function alignment(law,good){
  const lawt = {'-1':'C','0':'N','1':'L'}
  const goodt = {'-1':'E','0':'N','1':'G'}
  if (!law&&!good){return 'N'}
  else {return lawt[law]+goodt[good]}
}
export function mod(score){return Math.floor((score-10)/2)}

/**
 * Rolls any quantity of any-sided dice.
 * @param {Number} q Quantity of dice to roll.
 * @param {Number} d Number of sides on each die.
 * @returns {Number} The sum of the dice roll.
 */
export function dice(q,d){
  var result = 0;
  for (var i=0; i<q; i++){
      result = result + Math.floor(Math.random() * d) + 1;
  };
  return result;
};
/**
 * Rolls any quantity of any-sided dice.
 * @param {Text} t The quantity of dice and number of sides on each written in standard notation i.e. 1d20 or 6d6.
 * @returns {Number} The sum of the dice roll.
 */
export function diceText (t){
  var ar = t.split("d");
  var q = ar[0];
  var d = ar[1];
  var result = 0;
  for (var i=0; i<q; i++){
      result = result + Math.floor(Math.random() * d) + 1;
  };
  return result;
};
/**
 * @param {Number} l low, inclusive 
 * @param {Number} h high, inclusive
 */
export function randBetween(l,h){
  return Math.floor(Math.random()*(h+1-l)+l);
}
/**
 * The average roll for these dice
 * @param {Number} q Quantity of dice to roll.
 * @param {Number} d Number of sides on each die.
 */
export function averageDice(q,d){
  var max = q*d;
  var diff = max - q;
  return max - (diff/2);
}
/**
 * 
 * @param {Number} num The number
 * @param {Number} digits The number of digits the number should have
 */
export function leadingZeros(num,digits){
  var numString = num.toString()
  var diff = digits-numString.length;
  if (diff < 0){diff = 0};
  while (diff > 0){
      numString = '0' + numString;
      diff--;
  }
  return numString;
}

export function parseJSON(json){
  try {return JSON.parse(json)}
  catch (err){
    console.error(err)
    console.log(json)
  }
}

function copy(txt){
  var t = document.createElement('textarea')
  t.value = txt
  document.body.appendChild(t)
  t.select()
  document.execCommand('copy')
  document.body.removeChild(t)
}