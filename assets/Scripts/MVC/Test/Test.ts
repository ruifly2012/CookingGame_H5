import TestFacade from "./TestFacade ";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    /**
     * 初始化
     */
    onLoad() {
        new TestFacade();
       
    }
}
