import { SimpleCommand } from "../Patterns/Command/SimpleCommand";
import { INotification } from "../Interfaces/INotification";
import TestProxy from "./TestProxy ";
import { Facade } from "../Patterns/Facade/Facade";

export default class TestCommand extends SimpleCommand {
   static NAME: string = 'TestCommand';
   execute(notification: INotification) {
      console.log ('_________________________'+notification.getName());
      var p = <TestProxy>Facade.getInstance().retrieveProxy(TestProxy.NAME);
      p.change(notification.getName());
   }
}
