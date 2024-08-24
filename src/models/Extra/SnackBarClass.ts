import ISnackBar from "@/interface/Extras/ISnackBar";

export default class SnackBarClass{
     private model   : boolean;
     private message : string;
     private color   : string;
     private status  : number;

     public constructor(data : ISnackBar){
         this.message = data.message 
         this.model   = data.model
         this.color   = data.color 
         this.status  = data.status
     }

     public getMessage() : string{
          return this.message
     }
     public getModel() : boolean{
          return this.model
     }
     public getColor() : string{
          return this.color
     }

     public getStatus() :number{
          return this.status
     }

     setSnackbar(message : string, color : string, model : boolean, status : number) {
          this.message   = message;
          this.color     = color;
          this.model     = model;
          this.status    = status;

          setTimeout( () =>{
               this.model = false
          }, 4000)
        }

     closeSnackBar(){
          this.model = false
     }
}

