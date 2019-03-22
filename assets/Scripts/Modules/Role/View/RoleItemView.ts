import { System_Event } from "../../../Events/EventType";
import { Log } from "../../../Tools/Log";

const { ccclass, property } = cc._decorator;

/**
 * 人物头像Item
 */
@ccclass
export default class RoleItemView extends cc.Component {
    @property(cc.Sprite)
    roleHead: cc.Sprite = null;
    @property(cc.Sprite)
    professionSprite: cc.Sprite = null;
    @property(cc.Label)
    levelTxt: cc.Label = null;
    @property(cc.Node)
    selected: cc.Node = null;
    @property(cc.Node)
    exploreing:cc.Node=null;

    //筛选显示属性
    @property(cc.Node)
    attrNode:cc.Node=null;
    @property(cc.Sprite)
    attricon:cc.Sprite=null;
    @property(cc.Label)
    attrNumTxt:cc.Label=null;


    public ID: number = 0;
    timeout: any = 0;
    clickHandle:any=null;
    pressHandle: any = null;
    ispress:boolean=false;
    public clickEvent:any=null;

    onLoad() {
        this.selected.active = false;
        this.attrNode.active=false;
        this.node.on(System_Event.TOUCH_START, this.downHandle, this);
        this.node.on(System_Event.TOUCH_END, this.endHandle, this);
        this.node.on(System_Event.TOUCH_CANCEL, this.endHandle, this);
        this.node.on(System_Event.TOUCH_MOVE,this.moveHandle,this);
    }

    endHandle(data: cc.Event.EventTouch): any {
        
        if(!this.ispress) 
        {
            console.log('click ');
            if(this.clickHandle!=null) this.clickHandle(this.ID);
            if(this.clickEvent!=null) this.clickEvent(data);
        }
        clearTimeout(this.timeout);
        this.ispress=false;
    }

    downHandle(data: cc.Event.EventTouch): any {
        let self=this;
        this.timeout = setTimeout(() => {
            self.ispress=true;
            if(self.pressHandle!=null) self.pressHandle(self.ID);    
        }, 500);
    }

    moveHandle(data:cc.Event.EventTouch)
    {
        if(data.getDelta().y>0.1) clearTimeout(this.timeout);
    }

    /**
     * 
     * @param id 人物ID
     * @param _roleSprite 人物ICON 
     * @param _level 等级
     * @param _attrSprite 人物职业图标 
     */
    public setInfo(id:number,_roleSprite: cc.SpriteFrame, _level: number, _attrSprite: cc.SpriteFrame=null) {
        this.ID=id;
        this.roleHead.spriteFrame = _roleSprite;
        if(_attrSprite!=null) this.professionSprite.spriteFrame = _attrSprite;
        else this.professionSprite.node.active=false;
        this.levelTxt.string = "Lv." + _level;
    }

    showFilterInfo(_icon:cc.SpriteFrame,num:number)
    {
        this.attrNode.active=true;
        this.attricon.spriteFrame=_icon;
        this.attrNumTxt.string=String(num);
    }

    hideFilterAttr()
    {
        this.attrNode.active=false;
    }

    start() {

    }

    update(dt) {

    }
}
