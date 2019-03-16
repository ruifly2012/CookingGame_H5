

export class ButtonSetting 
{
    

    public constructor(){

    }

    public static SetLabel(_btn:cc.Node,_labelName:string,_str:string)
    {
        _btn.getChildByName(_labelName).getComponent(cc.Label).string=_str;
    }
}
