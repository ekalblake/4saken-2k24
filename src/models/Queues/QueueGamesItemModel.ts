import helpers from "@/utils/Dateformat";
import { MatchFoundImages } from "@/constants/constants";
export class QueueGamesItemModel {

     private gamestarted: string | Date;
     private ip:         string;
     private map:        string;
     private room:       string;
     private region:     number;
     private status:     number;
     private teamA:      string;
     private teamB:      string;

     constructor(data: IQueueGames) {
          this.gamestarted    = data.gamestarted;
          this.ip             = data.ip;
          this.map            = data.map;
          this.room           = data.room;
          this.region         = data.region;
          this.status         = data.status;
          this.teamA          = data.teamA;
          this.teamB          = data.teamB;
     }

     public getGameStarted(): string | Date {
          return helpers.timeago(this.gamestarted);
     }
     public getIp(): string {
          return this.ip;
     }
     public getMap(): string {
          return this.map;
     }
     public getRoom(): string {
          return this.room;
     }
     public getStatus(): number {
          return this.status;
     }
     public getTeamA(): string {
          return this.teamA;
     }
     public getTeamB(): string {
          return this.teamB;
     }

     /*
      * TODO: Traer la región de la base de datos
     */
     public getRegion(): string {
          return this.region === 1 ? 'Scout' :
                 this.region === 2 ? 'Adept' :
                 this.region === 3 ? 'Veteran' :
                 'Unranked';
     }

     public getMmrImage(): string {
          return this.region === 1 ? MatchFoundImages.FOUND_SCOUT :
                 this.region === 2 ? MatchFoundImages.FOUND_ADEPT :
                 this.region === 3 ? MatchFoundImages.FOUND_VETERAN :
                 MatchFoundImages.FOUND_UNRANKED;
     }

}

export default QueueGamesItemModel;