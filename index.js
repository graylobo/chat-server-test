const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get("/test",(req,res)=>{
  res.send("완료",process.env.PORT)
})
let totalCount =0;
io.on('connection', (socket) => {
  totalCount++;
  let name =""
  const dateFormat = "YYYY-MM-DD HH:mm:ss"
  socket.on("joinRoom",(userName)=>{
    name = userName;
    io.emit('chat message', `${userName}님이 입장했습니다. 현재 접속유저수:${totalCount}`);
})
  socket.on('chat message', msg => {
    io.emit('chat message', `${name}: ${msg} at ${moment(new Date()).format(dateFormat)}`);
  });

  socket.on("disconnect",()=>{
    totalCount--;
    io.emit('chat message', `${name}님이 나갔습니다. 현재 접속유저수:${totalCount}`);
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


