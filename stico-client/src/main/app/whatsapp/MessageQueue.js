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
        console.log(name + ":" + item);
        this.namedMessageQueueMap[name].push(item);
    }
    
    all(name){
       var array = this.namedMessageQueueMap[name].slice(); 
       this.namedMessageQueueMap[name]=[];
       return array;
    }
    
    tryGetElement(){
        for(var key in this.namedMessageQueueMap){
           if(this.namedMessageQueueMap[key].length>0){
               return {
                   name : key,
                   item : this.all(key)
               };
           }
        }
        return null;
    }
}

module.exports=MessageQueue;




