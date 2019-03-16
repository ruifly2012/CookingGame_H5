
const {ccclass, property} = cc._decorator;

/**
 * 全局单例类
 * @example 
 * Singleton.Instance.test();
 * Singleton.Instance.node
 */
@ccclass
export default class NotificationView extends cc.Component {
    public static Instance:NotificationView;
    isCompleted:boolean=true;

     onLoad () {
        //Singleton.Instance=this;
        NotificationView.Instance=this;
    }


    showNotify(_title:string,_content:string)
    {
        if(!this.isCompleted) return ;
        this.isCompleted=false;
        this.node.getComponentInChildren(cc.RichText).string='<color=#00ff00>'+_title+': </c><color=#0fffff>'+_content+'</color>';
        this.moveToDis(-100);
        let self=this;
        setTimeout(() => {
            self.moveToDis(100);
            this.isCompleted=true;
        }, 2000);
    }

    moveToDis(distance:number)
    {
        //移动指定的距离	
        var moveUpBy = cc.moveBy(0.5, cc.v2(0, distance)).easing(cc.easeBackIn());
        //var seq=cc.sequence(moveUpTo,cc.callFunc(this.callback.bind(this)));
        this.node.runAction(moveUpBy);
    }

    public test()
    {

    }

    // update (dt) {}
}
