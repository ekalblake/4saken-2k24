import {QueueItemModel} from "@/models/Queues/QueueItemModel";
import IQueue from "@/interface/Queue/IQueue";

export default class QueueModel {
    private queuesArray : QueueItemModel[];

    public constructor(data: IQueue[]) {
     this.queuesArray = [];
     data.forEach(queue => this.queuesArray.push(new QueueItemModel(queue)))
    }

    public getQueue() : QueueItemModel[]{
        return this.queuesArray
    }
}