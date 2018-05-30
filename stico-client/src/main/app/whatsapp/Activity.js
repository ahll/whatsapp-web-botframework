
class Activity {

    constructor(activity) {
        this.activity = activity;
    }

    activityToText() {

        var messages = [];
          
        if(this.activity.text) {
            messages.push(this.activity.text);
        }

        if(this.activity.attachments !== undefined) {
            this.activity.attachments.forEach(item => messages = messages.concat(this.attachmentToText(item)));
        }
        
        return messages;
    }

    attachmentToText(attachment) {
        var messages = [];
        
        messages.push(attachment.content.title || attachment.content.text);
        if(attachment.content.buttons !== undefined) {
            attachment.content.buttons.forEach( button=> messages.push(button.title + " : " + button.value));
        }
        return messages;
    }

}
module.exports = Activity;

