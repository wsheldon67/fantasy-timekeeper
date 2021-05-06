function get_data(url,params){
  return new Promise((resolve,reject)=>{
    var req = new XMLHttpRequest()
    req.open('POST',url)
    req.onload = ()=>{
      try{if (req.status == 200){resolve(JSON.parse(req.responseText))}
      else {reject(Error(req.statusText))}}
      catch (err){
        console.error('Server sent',req.responseText,'and JSON didnt like it.')
        reject()
      }
    }
    req.onerror = ()=>{reject(Error('Network Error'))}
    var formData = new FormData()
    for (var i in params){
      formData.append(i,params[i])
    }
    req.send(formData)
  })
}
/*
export function save_time(){

}
export function get_time(){

}
export function save_log(){

}
export function get_log(){

}
*/