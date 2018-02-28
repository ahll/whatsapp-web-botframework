var DirectLine = require("botframework-directlinejs").DirectLine;

class Bot {

    constructor(secret, name) {
        this.secret = secret;
        this.name = name;
        this.userChannelMap = {};
    }

    subscribeChannel(userName, callback) {
        if (!this.userChannelMap[userName]) {
            this.userChannelMap[userName] = new DirectLine({
                secret: "87a_i8CGCL8.cwA.lm0.I2UDp1B3tiAYojYBxMSMufnY_Qhl72ex2sarUL8qib0"
            });

            this.userChannelMap[userName].activity$
                    .filter(activity => activity.from.name === this.name)
                    .subscribe(
                            activity => {
                                console.log("received activity ", activity);
                        
                               if(activity.text){
                                callback(activity.text);
                               } else {
                                 callback(JSON.stringify(activity.attachments));
                               }
                            }
                    );

        }
    }
    
    send(userName, text){
        
        var directLine = this.userChannelMap[userName];
        
        if(!directLine){
           alert("channel  not created");
           return;
        }
        
        directLine.postActivity({
         from: { id: userName, name: userName }, // required (from.name is optional)
             type: 'message',
             text: text
          }).subscribe(
                  
                id => {
                    console.log("Posted activity, assigned ID ", id);
                },
                
                error => console.log("Error posting activity", error)
          );
    }
    
}

module.exports=Bot;

