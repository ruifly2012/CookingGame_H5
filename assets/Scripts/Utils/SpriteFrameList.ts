
const {ccclass, property} = cc._decorator;

@ccclass
export default class SpriteFrameList extends cc.Component 
{
    @property(cc.SpriteFrame)
    public sprites:cc.SpriteFrame[]=[];

    onLoad () 
	{

    }

    setSprite(_index:number)
    {
        this.node.getComponent(cc.Sprite).spriteFrame=this.sprites[_index];
    }

    
}
