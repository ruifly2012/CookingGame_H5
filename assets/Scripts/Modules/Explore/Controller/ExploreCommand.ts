import { SimpleCommand } from "../../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../../MVC/Interfaces/INotification";

export default class ExploreCommand extends SimpleCommand {
    execute(nc: INotification) {
        console.log('_______________________ExploreCommand:' + nc.getName());
    }
}
