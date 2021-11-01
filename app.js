
//var ws = new WebSocket("wss://168.235.86.101:9996/ws")
var ws = new WebSocket("wss://ics32distributedsocial.com/ws")
var last_timestamp = ""

function convertTimestamp(ts){
  var date = new Date(parseFloat(ts)*1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  hours = (hours < 10)? "0" + hours :hours  
  minutes = (minutes < 10)? "0" + minutes : minutes
  seconds = (seconds < 10)? "0" + seconds : seconds 

  var formattedTime = (date.getMonth()+1) + '/' + date.getDate() + '/' + (date.getYear()-100) + ' at ' + hours + ':' + minutes + ':' + seconds;
  return formattedTime
}

function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/'/g, "&#039;");
 }


function create_post(user, post, timestamp){
  var html = ' \
    <div class="post-preview"> \
      <a href="user/' + escapeHtml(user) + '"> \
        <h3 class="post-subtitle"> \
          ' + escapeHtml(post) + ' \
        </h3> \
      </a> \
      <p class="post-meta">Posted by \
        <a href="user/'+ user + '">' + user + '</a> \
        on ' + convertTimestamp(timestamp) + '</p> \
    </div> \
    <hr></hr> \
    ';
  return html;
}

ws.onopen = () => {
  ws.send(JSON.stringify({connected: 'web'}))
}

ws.onmessage = (msg) => {
  var data;
  try {
    data = JSON.parse(msg.data)
  } catch (error) {
    console.log("Unable to parse JSON: " + msg.data)
    return;
  }
  last_timestamp = data.timestamp
  var posts = document.getElementById("posts")
  var container = document.createElement("div");
  //if (data.response.type == "error") 
//	return;
  //Don't show my account.
  if(data.user != "STOP_HACKING"){
    container.innerHTML = create_post(data.user, data.post, data.timestamp);
    posts.insertBefore(container,posts.firstChild);
  }
} 

var timer

function start () {
  console.log('starting up')
  console.log('If you are my student, you should not be here. This is a Python class, not JavaScript!')
  setInterval(function () {
    ws.send(JSON.stringify({update: last_timestamp}))
  }, 10000)
}

start()
