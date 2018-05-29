# whatsapp-web-botframework
A test bot, that connected whatsapp web to microsoft botframework

## Installation
Git clone
Npm install

## Compilation

gulp clean
gulp build

## Ejecution

1.install disable content security plugin in chrome

https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden?hl=en-GB

2. disable content security

3. copy the content of  main.js in the target/web/assets into  web.whatsapp.com console. 
If has error of socket, refresh the page, and retry 1 and 2.

## Architecture

Bot.js	the interface of botframework directline
MessageQueue.js	named message queue
Timer.js	timer to put execution in sequence
Whatsapp.js  web whatsapp interface
App.js application

## Code example

//use interface

var Bot = require("./whatsapp/Bot");
var Whatsapp = require("./whatsapp/Whatsapp");
var Timer = require("./whatsapp/Timer");
var MessageQueue = require("./whatsapp/MessageQueue");

//could use our bot for testing or change your bot of bot framework
var bot = new Bot("87a_i8CGCL8.cwA.lm0.I2UDp1B3tiAYojYBxMSMufnY_Qhl72ex2sarUL8qib0", "ButlerPre"); 
var whatsapp = new Whatsapp();
var messageQueue = new MessageQueue();


//user last message recieved
const userSentMessage = {

};

//user name and chat map
const namedChatMap = {

};

//message replay id and user name map
const replayUserMap = {

};

var chats = whatsapp.getAllChats();

var randomChat = function (chatList) {
    return chatList[Math.floor((Math.random() * chatList.length))];
};

// suscribe all chats to directline streaming
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

// simulation of web of sending message
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
          //do nothing, just wait select chat done
        }, 1000);
        element.item.forEach(function (text) {
            //send message and wait 500 ms
            timer.waitThen(
                    function () {
                        console.log(userName + ": recive from bot :" + text);
                        if(userName) {
                            whatsapp.sendMessage(chat, text);
                        }
                    }
            , 500);
        });
        // wait 500ms, and goto read message
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
        )).waitThen(function () {
          //do nothing, just wait select chat done
        }, 1000)
        .waitThen(
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



# The next thing
Do a bot as middleware, that could send message cross platform. For example, facebook messager to whatsapp, whatsapp to skype,  and so on
