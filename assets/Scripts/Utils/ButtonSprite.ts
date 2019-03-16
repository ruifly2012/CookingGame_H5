
const {ccclass, property} = cc._decorator;

/**
 * 点击按钮需要更换btn sprite的工具
 */
@ccclass
export default class ButtonSprite extends cc.Component 
{
    @property(cc.SpriteFrame)
    defaultSprite:cc.SpriteFrame=null;
    @property(cc.SpriteFrame)
    changeSprite:cc.SpriteFrame=null;

    onLoad () 
	{

    }

    start () 
	{

    }

    /**
     * 默认为false ，更改为true
     * @param selectStatus 按钮状态
     */
    changeSpriteStatus(_default:boolean=false)
    {
        this.node.getComponent(cc.Sprite).spriteFrame=_default?this.changeSprite:this.defaultSprite;
    }
}
