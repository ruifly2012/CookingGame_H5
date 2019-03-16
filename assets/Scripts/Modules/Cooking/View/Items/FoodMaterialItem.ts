
const {ccclass, property} = cc._decorator;

@ccclass
export default class FoodMaterialItem extends cc.Component 
{

    @property(cc.Sprite)
    icon:cc.Sprite=null;
    @property(cc.Label)
    foodMaterialNameTxt:cc.Label=null;
    @property(cc.Label)
    numTxt:cc.Label=null;

    ID:number=0;

    onLoad () 
	{

    }

    /**
     * 
     * @param id 食材ID
     * @param iconSprite 食材ICON
     * @param name 名称
     * @param num 拥有数量
     */
    showInfo(id:number,iconSprite:cc.SpriteFrame,name:string,num:string)
    {
        this.ID=id;
        this.icon.spriteFrame=iconSprite;
        this.foodMaterialNameTxt.string=name;
        this.numTxt.string=num;
    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }
}
