var Bot = require("./whatsapp/Bot");
var Whatsapp = require("./whatsapp/Whatsapp");
var Timer = require("./whatsapp/Timer");
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

var randomChat = function (chatList) {
    return chatList[Math.floor((Math.random() * chatList.length))];
};


chats.forEach(function (element) {
    var userName = whatsapp.getChatName(element);
    alert(userName);
    bot.subscribeChannel(userName, function (text, replayId) {
        if (replayId) {
            console.log(replayId + "get message: " + text);
            messageQueue.create(replayId);
            messageQueue.add(replayId, text);
        }
    });
    namedChatMap[userName] = element;
});

var sendMessage = function () {
    var element = messageQueue.tryGetElement();
    if (element && element.name) {
    
        var userName = replayUserMap[element.name];
        var chat = namedChatMap[userName];
   
        var timer = new Timer(
                function () {
                    whatsapp.selectChat(chat);
                }
        ).waitThen(function () {

        }, 1000);
        element.item.forEach(function (text) {
            timer.waitThen(
                    function () {
                        console.log(userName + ": recive from bot :" + text);
                        if(userName) {
                            whatsapp.sendMessage(chat, text);
                        }
                    }
            , 500);
        });
        timer.waitThen(readMessage, 500)
                .do();
    } else {
        readMessage();
    }

};

var readMessage = function () {

    var chats = whatsapp.getUnreadChats();
    if (chats.length > 0) {
        var chat = randomChat(chats);
        
        new Timer(
                function () {
                    whatsapp.selectChat(chat);
                }
        ).waitThen(
                function () {

                    var userName = whatsapp.getChatName(chat);
                    var lastMessage = whatsapp.getLastMsg();
                    if (lastMessage && userSentMessage[userName] !== lastMessage) {
                        console.log("sending to bot " + lastMessage);
                        bot.send(userName, lastMessage, function (replayId) {
                           if(userName && replayId){
                                replayUserMap[replayId] = userName;
                            }
                        });

                        userSentMessage[userName] = lastMessage;
                    }
                }, 500)
                .waitThen(sendMessage, 1000)
                .do();

    } else {
        new Timer(
                function () {
                    whatsapp.changeChat();
                }
        ).waitThen(sendMessage, 1000)
                .do();
    }
};

var processMessage = function () {
    sendMessage();
};

processMessage();

