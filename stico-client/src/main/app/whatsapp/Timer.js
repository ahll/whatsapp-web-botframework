class Timer{
   constructor(func){
      this.func = func;
   }

   waitThen(next, time){
     var funcNow = this.func;
     this.func = function(){
         try{
            funcNow();
         } catch(ex){
           console.log(ex);
         }
         setTimeout(next, time);
     };
     return this;
   }

   then(next){
     var funcNow = this.func;
     this.func = function(){
         try{
           funcNow();
           next();
         } catch(ex){
           console.log(ex);
         }
     };
     return this;
   }

   do(){
     this.func();
   }

}

module.exports=Timer;