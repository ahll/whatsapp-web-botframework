class Whatsapp {

    constructor() {
        this.elementConfig = {
            "chats": [1, 0, 5, 2, 0, 3, 0, 0, 0],
            "chat_icons": [0, 0, 1, 1, 1, 0],
            "chat_title": [0, 0, 1, 0, 0, 0],
            "chat_lastmsg": [0, 0, 1, 1, 0, 0],
            "chat_active": [0, 0],
            "selected_title": [1, 0, 5, 3, 0, 1, 1, 0, 0, 0]
        };
    }

    getElement(id, parent) {
        if (!this.elementConfig[id]) {
            return false;
        }
        var elem = !parent ? document.body : parent;
        var elementArr = this.elementConfig[id];
        for (var x in elementArr) {
            var pos = elementArr[x];
            if (isNaN(pos * 1)) { //dont know why, but for some reason after the last position it loops once again and "pos" is loaded with a function WTF. I got tired finding why and did this
                continue;
            }
            if (!elem.childNodes[pos]) {
                return false;
            }
            elem = elem.childNodes[pos];
        }
        return elem;
    }

    getChatUnreadMessageInfo(chat) {
        return {
            unreadNumber: new Number(chat.querySelector("span.OUeyt").innerHTML),
            lastMessage: chat.querySelector("span[dir='ltr']").innerHTML
        };
    }

    getUnreadChats() {
        var unreadchats = [];
        var chats = this.getElement("chats");
        if (chats) {
            chats = chats.childNodes;
            for (var i in chats) {
                if (!(chats[i] instanceof Element)) {
                    continue;
                }
                var icons = this.getElement("chat_icons", chats[i]).childNodes;
                if (!icons) {
                    continue;
                }
                for (var j in icons) {
                    if (icons[j] instanceof Element) {
                        if (!(icons[j].childNodes[0].getAttribute('data-icon') == 'muted' || icons[j].childNodes[0].getAttribute('data-icon') == 'pinned')) {
                            unreadchats.push(chats[i]);
                            break;
                        }
                    }
                }
            }
        }
        return unreadchats;
    }
    
    getAllChats() {
        var chats = this.getElement("chats");
        if (chats) {
            chats = chats.childNodes;
            for (var i in chats) {
                if (!(chats[i] instanceof Element)) {
                    continue;
                }
                var icons = this.getElement("chat_icons", chats[i]).childNodes;
                if (!icons) {
                    continue;
                }
                
            }
        }
        
        return chats;
    }

    eventFire(el, etype) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(etype, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        el.dispatchEvent(evt);
    }

    sendMessage(chat, message) {
        //avoid duplicate sending
        var title;

        if (chat) {
            title = this.getElement("chat_title", chat).title;
        } else {
            title = this.getElement("selected_title").title;
        }

        var messageBox = document.querySelectorAll("[spellcheck='true']")[0];

        //add text into input field
        messageBox.innerHTML = message;

        //Force refresh
        var event = document.createEvent("UIEvents");
        event.initUIEvent("input", true, true, window, 1);
        messageBox.dispatchEvent(event);

        //Click at Send Button
        this.eventFire(document.querySelector('span[data-icon="send"]'), 'click');
    }

    selectChat(chat) {
        
        this.eventFire(chat.firstChild.firstChild, 'mousedown');
    }

    getChatName(chat) {
        return this.getElement("chat_title", chat).title;
    }
    getLastMsg() {
        var messages = document.querySelectorAll('.msg');
        var pos = messages.length - 1;

        while (messages[pos] && (messages[pos].classList.contains('msg-system') || messages[pos].querySelector('.message-out'))) {
            pos--;
            if (pos <= -1) {
                return null;
            }
            
        }
        if (messages[pos] && messages[pos].querySelector('.selectable-text')) {
            return messages[pos].querySelector('.selectable-text').innerText;
        } else {
            return null;
        }
    }
}

module.exports=Whatsapp;