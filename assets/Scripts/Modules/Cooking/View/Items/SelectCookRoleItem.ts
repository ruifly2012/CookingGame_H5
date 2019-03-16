import { System_Event } from "../../../../Events/EventType";
import { CookingEvent } from "../../../../Events/CookingEvent";
import { Log } from "../../../../Tools/Log";
import { SelectVo } from "../../Model/VO/SelectVo";

const { ccclass, property } = cc._decorator;

/**
 * 已选择的做菜角色
 */
@ccclass
export default class SelectCookRoleItem extends cc.Component {
    @property(cc.Node)
    addRoleBtn: cc.Node = null;
    @property([cc.Node])
    addCookBtns: cc.Node[] = [];
    /** 已经选择的角色 */
    @property(cc.Node)
    selectedRole: cc.Node = null;
    private currSeatNum:number=0;
    private currMenuNum:number=0;

    onLoad() {
        this.node.on(System_Event.TOUCH_START,this.AddRoleHandle,this);
        this.addRoleBtn.on(System_Event.TOUCH_START, this.AddChildRoleHandle, this);

        for (let i = 0; i < this.addCookBtns.length; i++) {

            this.addCookBtns[i].getComponent(cc.Button).normalColor = cc.Color.prototype.fromHEX('#363333');
            this.addCookBtns[i].on(System_Event.TOUCH_START, this.addRoleMenuHandle, this);
            this.addCookBtns[i].active=false;
            this.addCookBtns[i].getChildByName('icon_'+(i+1)).active=false;
        }
        this.currSeatNum=Number(this.node.name.split('_')[1])-1;
        this.node.dispatchEvent(new CookingEvent(CookingEvent.SELECT_COOKING_SEAT, true, 0));
    }
    
    AddChildRoleHandle(data: cc.Event.EventTouch): any {
        let num = data.currentTarget.parent.name.split('_')[1];
        this.currSeatNum=num-1;
        this.node.dispatchEvent(new CookingEvent(CookingEvent.SELECT_COOKING_SEAT, true, (num - 1)));
    }

    /**
     * 点击，选择做菜人物
     * @param data 点击的目标
     */
    AddRoleHandle(data: cc.Event.EventTouch): any {
        //Log.Info('点击添加人物.................');
        let num = data.currentTarget.name.split('_')[1];
        this.currSeatNum=num-1;
        this.node.dispatchEvent(new CookingEvent(CookingEvent.SELECT_COOKING_SEAT, true, (num - 1)));
        
    }
    /**
     * 点击，选择添加菜谱
     * @param data 点击的目标
     */
    addRoleMenuHandle(data: cc.Event.EventTouch): any {
        //Log.Info('点击添加菜谱.................');
        let btn: cc.Button = data.currentTarget.getComponent(cc.Button);
        btn.normalColor = cc.Color.WHITE;
        let num = data.currentTarget.name.split('_')[1];
        this.currMenuNum=num-1;
        //Log.Info(this.node.name);
        //this.currSeatNum=Number(this.node.name.split('_')[1]);
        this.updateAddMenuBtnStatus(data.currentTarget);
        this.node.dispatchEvent(new CookingEvent(CookingEvent.ADD_MENU_BTN, true, new SelectVo(0,this.currSeatNum,(num-1))));
    }

    /**
     * 设置显示做菜的人物属性
     * @param roleicon 人物头像ICON
     * @param attrArr 属性数组（对象属性：spriteFrame:属性ICON，val：属性值）
     */
    public showSeatRole(roleicon: cc.SpriteFrame, attrArr: any, menuNum: number) {
        this.selectedRole.active = true;
        this.selectedRole.getComponent(cc.Sprite).spriteFrame = roleicon;
        for (let i = 1; i <= this.selectedRole.childrenCount; i++) {
            let element: cc.Node = this.selectedRole.getChildByName('attr_' + i);
            element.getComponentInChildren(cc.Sprite).spriteFrame = attrArr[i-1].spriteFrame;
            element.getComponentInChildren(cc.Label).string = attrArr[i-1].val;
        }
        for (let i = 0; i < this.addCookBtns.length; i++) {
            const element = this.addCookBtns[i];
            if (i < menuNum) {
                element.active = true;
            }
            else element.active = false;
        }
    }

    /**
     * 设置该位置上的增加菜单的按钮的状态
     */
    updateAddMenuBtnStatus(_node:cc.Node) {
        for (let i = 0; i < this.addCookBtns.length; i++) {
            const element:cc.Node = this.addCookBtns[i];
            element.getChildByName(element.name).active=false;
            if(element!=_node)
            {
                element.getComponent(cc.Button).normalColor=cc.Color.GRAY;
            }
        }
    }

    reset(){
        for (let i = 0; i < this.addCookBtns.length; i++) {
            this.addCookBtns[i].color = cc.Color.GRAY;
            this.addCookBtns[i].on(System_Event.TOUCH_START, this.addRoleMenuHandle, this);
            this.addCookBtns[i].active=false;
            this.addCookBtns[i].children[0].active=true;
            this.addCookBtns[i].children[1].active=false;
        }
    }

    /**
     * 添加 添加菜单按钮上的菜谱ICON
     * @param data 
     * @param num 菜数量
     */
    public setCookingMenuBtnIcon(data:any,num:number)
    {
        //Log.Info('执行图片',this.currMenuNum,this.getChildNode(this.currMenuNum).name,this.addCookBtns[this.currMenuNum].children[0].name);
        this.getChildNode(this.currMenuNum).active=true;
        this.getChildNode(this.currMenuNum).getComponent(cc.Sprite).spriteFrame=data;
        this.getChildNode(this.currMenuNum).getComponentInChildren(cc.Label).string=String(num);
    }

    public setMenuNum(num:number)
    {
        this.getChildNode(this.currMenuNum).getComponentInChildren(cc.Label).string=String(num);
    }

    public HideMenuBtnIcon()
    {
        //Log.Info('隐藏下架的菜sprite');
        this.getChildNode(this.currMenuNum).active=false;
    }
    
    public hideMenuBtnIconWithNum(num:number)
    {
        this.addCookBtns[num].getChildByName('icon_'+(num+1)).active=false;
    }

    getChildNode(num:number):cc.Node
    {
        return this.addCookBtns[this.currMenuNum].getChildByName('icon_'+(num+1));
    }

    start() {

    }

    update(dt) {

    }
}
