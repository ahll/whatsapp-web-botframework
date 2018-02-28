class MessageQueue {
    constructor(){
       this.namedMessageQueueMap = {
           
       };
    }
    create(name){
       if(!this.namedMessageQueueMap[name]){
          this.namedMessageQueueMap[name]=[];
       }
    }
    
    add(name, item){
        this.namedMessageQueueMap[name].push(item);
    }
    
    first(name){
       var item = null; 
       if(this.namedMessageQueueMap[name].length >0){
            item = this.namedMessageQueueMap[name][0];
            this.namedMessageQueueMap[name].shift();
       }
       return item;
    }
    
    tryGetElement(){
        for(var key in this.namedMessageQueueMap){
           if(this.namedMessageQueueMap[key].length>0){
               return {
                   name : key,
                   item : this.first(key)
               };
           }
        }
        return null;
    }
}

module.exports=MessageQueue;




