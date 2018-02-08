DirectLine = require("botframework-directlinejs").DirectLine;

directLine = new DirectLine({
    secret: "87a_i8CGCL8.cwA.lm0.I2UDp1B3tiAYojYBxMSMufnY_Qhl72ex2sarUL8qib0"
   });

//
// GLOBAL VARS AND CONFIGS
//
//const whitelist = ['Fotos salvass', 'Teste ignore']
var lastMessageOnChat = false;
var ignoreLastMsg = {};
var activityMap = {};

//
// FUNCTIONS
//

// Get random value between a range
function rand(high, low = 0) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function getSelectedTitle() {
    var chats = document.querySelectorAll('.chat-drag-cover');
    var selectedTitle;
    for (var i = 0; i < chats.length; i++) {
        if (chats[i]) {
            if (chats[i].querySelector('.active')) {
                selectedTitle = chats[i].querySelector('.emojitext').title;
            }
        }
    }
    return selectedTitle;
}

function getLastMsg() {
    var messages = document.querySelectorAll('.msg');
    var pos = messages.length - 1;

    while (messages[pos] && (messages[pos].classList.contains('msg-system') || messages[pos].querySelector('.message-out'))) {
        pos--;
        if (pos <= -1) {
            return false;
        }
    }
    if (messages[pos] && messages[pos].querySelector('.emojitext.selectable-text')) {
        return messages[pos].querySelector('.emojitext.selectable-text').innerText;
    } else {
        return false;
    }
}

function didYouSendLastMsg() {
    var messages = document.querySelectorAll('.msg');
    if (messages.length <= 0) {
        return false;
    }
    var pos = messages.length - 1;

    while (messages[pos] && messages[pos].classList.contains('msg-system')) {
        pos--;
        if (pos <= -1) {
            return -1;
        }
    }
    if (messages[pos].querySelector('.message-out')) {
        return true;
    }
    return false;
}

// Call the main function again
const goAgain = (fn, sec) => {
    // const chat = document.querySelector('div.chat:not(.unread)')
    // selectChat(chat)
    setTimeout(fn, sec * 1000)
}

// Dispath an event (of click, por instance)
const eventFire = (el, etype) => {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(etype, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    el.dispatchEvent(evt);
}

// Select a chat to show the main box
const selectChat = (chat, cb) => {
    const title = chat.querySelector('.emojitext').title;
    eventFire(chat, 'mousedown');

    if (!cb) return;

    const loopFewTimes = () => {
        setTimeout(() => {
            const titleMain = getSelectedTitle();

            if (titleMain != title) {
                console.log('not yet');
                return loopFewTimes();
            }

            return cb();
        }, 300);
    }

    loopFewTimes();
}

// Send a message
const sendMessage = (chat, message) => {
    //avoid duplicate sending
    var title;

    if (chat) {
        title = chat.querySelector('.emojitext').title;
    } else {
        title = getSelectedTitle();
    }
    ignoreLastMsg[title] = message;

    //add text into input field
    document.querySelector('.pluggable-input-body').innerHTML = message.replace(/  /gm, '');

    //Force refresh
    event = document.createEvent("UIEvents");
    event.initUIEvent("input", true, true, window, 1);
    document.querySelector('.pluggable-input-body').dispatchEvent(event);

    //Click at Send Button
    eventFire(document.querySelector('.compose-btn-send'), 'click');

}

const sendMessageToBot = (chat, message, cb) => {
    //avoid duplicate sending
    var title;

    if (chat) {
        title = chat.querySelector('.emojitext').title;
    } else {
        title = getSelectedTitle();
    }

    for(var key in activityMap){
        if(key.indexOf(title) >-1){
            var activity = activityMap[key];
            console.log(activity);
            
            if(activity.type = "message"){
                console.log(activity);
                sendMessage(chat, activity.text);
            }
        }
        delete activityMap[key];
    }

    directLine.postActivity({
         from: { id: title, name: title }, // required (from.name is optional)
             type: 'message',
             text: message
          }).subscribe(
                id => console.log("Posted activity, assigned ID ", id),
                error => console.log("Error posting activity", error)
          );
    cb();
};


//
// MAIN LOGIC
//
const start = (_chats, cnt = 0) => {
    // get next unread chat
    const chats = _chats || document.querySelectorAll('.unread.chat');
    const chat = chats[cnt];

    var processLastMsgOnChat = false;
    var lastMsg;

    if (!lastMessageOnChat) {
        if (false === (lastMessageOnChat = getLastMsg())) {
            lastMessageOnChat = true; //to prevent the first "if" to go true everytime
        } else {
            lastMsg = lastMessageOnChat;
        }
    } else if (lastMessageOnChat != getLastMsg() && getLastMsg() !== false && !didYouSendLastMsg()) {
        lastMessageOnChat = lastMsg = getLastMsg();
        processLastMsgOnChat = true;
    }

    if (!processLastMsgOnChat && (chats.length == 0 || !chat)) {
        return goAgain(start, 3);
    }

    // get infos
    var title;
    if (!processLastMsgOnChat) {
        title = chat.querySelector('.emojitext').title + '';
        lastMsg = (chat.querySelectorAll('.emojitext.ellipsify')[1] || {
            innerText: ''
        }).innerText; //.last-msg returns null when some user is typing a message to me
    } else {
        title = getSelectedTitle();
    }
    // avoid sending duplicate messaegs
    if (ignoreLastMsg[title] && (ignoreLastMsg[title]) == lastMsg) {
        console.log(new Date(), 'nothing to do now... (2)', title, lastMsg);
        return goAgain(() => {
            start(chats, cnt + 1)
        }, 0.1);
    }

    // select chat and send message
    if (!processLastMsgOnChat) {
        selectChat(chat, () => {
            sendMessageToBot(chat, lastMsg, () => {
                goAgain(() => {
                    start(chats, cnt + 1)
                }, 0.1);
            });
        })
    } else {
        sendMessageToBot(null, lastMsg, () => {
            goAgain(() => {
                start(chats, cnt + 1);
            }, 0.1);
        });
    }
};

global.XMLHttpRequest = require("xhr2");
directLine.activity$
.subscribe(
    activity => {
        
        console.log("received activity ", activity);
        var id = activity.from.id + new Date().getTime();
        alert(JSON.stringify(activity));
        activityMap[id]=activity;
    }
);
start();

