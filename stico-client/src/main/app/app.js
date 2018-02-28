var Bot = require("./whatsapp/Bot");
var Whatsapp = require("./whatsapp/Whatsapp");
var MessageQueue = require("./whatsapp/MessageQueue");
var bot = new Bot("87a_i8CGCL8.cwA.lm0.I2UDp1B3tiAYojYBxMSMufnY_Qhl72ex2sarUL8qib0", "ButlerPre");
var whatsapp = new Whatsapp();
var messageQueue = new MessageQueue();

const userSentMessage ={
    
};

const namedChatMap ={
    
};


var chats = whatsapp.getAllChats();

chats.forEach(function(element) {
   var userName = whatsapp.getChatName(element);
   messageQueue.create(userName);
    
    bot.subscribeChannel(userName, function(text){
      console.log("get message: " +  text);
      messageQueue.add(userName, text);
    });
    namedChatMap[userName]=element;
});

var processMessage= function(){
    
    console.log("starting to send message");
    var element = messageQueue.tryGetElement();
    
    while(element){
       var chat = namedChatMap[element.name];
       whatsapp.selectChat(chat);
       whatsapp.sendMessage(chat, element.item);
       element = messageQueue.tryGetElement();
    }

    console.log("starting to read message");
    var chats = whatsapp.getUnreadChats();
    
    chats.forEach(function(chat) {

        whatsapp.selectChat(chat);
        var userName = whatsapp.getChatName(chat);
        var lastMessage = whatsapp.getLastMsg();
        if(lastMessage && userSentMessage[userName] !== lastMessage){
            console.log("get user message:" + lastMessage);
            bot.send(userName, lastMessage);
            userSentMessage[userName] = lastMessage;
        }

     });
     
    setTimeout(processMessage, 3000);
    
};

processMessage();

