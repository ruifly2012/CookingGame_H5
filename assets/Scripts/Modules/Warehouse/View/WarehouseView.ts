
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Integer)
    intVar: number = 0;

    @property(cc.Float)
    floatVar: number = 0;

    @property(cc.Boolean)
    boolVar: boolean = false;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Prefab)
    prefabVar: cc.Prefab = null;

    @property(cc.Vec2)
    vec2Var: cc.Vec2 = cc.v2();

    @property([cc.Node])
    nodeArrVar: Array<cc.Node> = [];

    onLoad() {

    }

    start() {

    }

    update(dt) {

    }
}
