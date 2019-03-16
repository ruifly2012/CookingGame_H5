
const { ccclass, property } = cc._decorator;

@ccclass
export default class panel extends cc.Component {

   
    static instance:panel;
    @property([cc.Node])
    nodeArrVar: Array<cc.Node> = [];

    onLoad() {
        panel.instance=this;
    }

}
