import INewUser from "@/interface/Players/INewUser";
import PlayerItemModel from "@/models/Players/PlayerItemModel";

export default class PlayersModel {
     private playersArray: PlayerItemModel[];

     public constructor(data: INewUser[]) {
          this.playersArray = [];
          data.forEach(players => this.playersArray.push(new PlayerItemModel(players)))
     }

     public getPlayers(): PlayerItemModel[] {
          return this.playersArray
     }
}