module.exports = function(io){
    //io~~ => emit:듣는것, on:말하기
    io.on("connection", async(socket)=>{
        console.log("client is connected", socket.id);
        
    });
};