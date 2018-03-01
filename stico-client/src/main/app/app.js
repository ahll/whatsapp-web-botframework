var Bot = require("./whatsapp/Bot");
var Whatsapp = require("./whatsapp/Whatsapp");
var MessageQueue = require("./whatsapp/MessageQueue");
var bot = new Bot("87a_i8CGCL8.cwA.lm0.I2UDp1B3tiAYojYBxMSMufnY_Qhl72ex2sarUL8qib0", "ButlerPre");
var whatsapp = new Whatsapp();
var messageQueue = new MessageQueue();

const userSentMessage = {

};

const namedChatMap = {

};

const replayUserMap = {

};

var chats = whatsapp.getAllChats();

chats.forEach(function (element) {
    var userName = whatsapp.getChatName(element);
    bot.subscribeChannel(userName, function (text, replayId) {
        if (replayId) {
            console.log("get message: " + text);
            messageQueue.create(replayId);
            messageQueue.add(replayId, text);
        }
    });
    namedChatMap[userName] = element;
});

var processMessage = function () {

    var element = messageQueue.tryGetElement();
    
    if (element && element.name) {
        console.log(element);
        var userName = replayUserMap[element.name];
        var chat = namedChatMap[userName];
        if (chat) {

            whatsapp.selectChat(chat);
            whatsapp.sendMessage(chat, element.item);
        }
        //make sure to read all message
        setTimeout(processMessage, 3000);
        return;
    }

    var chats = whatsapp.getUnreadChats();

   if(chats.length > 0){
        var chat = chats[0];
        whatsapp.selectChat(chat);
        var userName = whatsapp.getChatName(chat);
        var lastMessage = whatsapp.getLastMsg();
        if (lastMessage && userSentMessage[userName] !== lastMessage) {
            console.log("get user message:" + lastMessage);
            bot.send(userName, lastMessage, function (replayId) {
                replayUserMap[replayId] = userName;
            });
            userSentMessage[userName] = lastMessage;
        }
   }

    setTimeout(processMessage, 3000);

};

processMessage();

