import { Proxy } from "../Patterns/Proxy/Proxy";
import CharacterInfo from "./CharacterInfo";
import { Notification } from "../Patterns/Observer/Notification";
import NotificationConstant from "./NotificationConstant ";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestProxy extends Proxy {
    static NAME:string ='TestProxy';
    char: CharacterInfo;
    constructor() {
        super(TestProxy.NAME);
        this.char = new CharacterInfo();
    }

    change(str: string) {
        this.sendNotification(str);
    }

}
