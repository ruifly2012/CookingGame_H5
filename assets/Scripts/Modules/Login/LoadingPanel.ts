import { AssetManager } from "../../Managers/AssetManager";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { LoadingMediator } from "./LoadingMediator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingPanel extends cc.Component 
{
    @property(cc.ProgressBar)
    progressBar:cc.ProgressBar=null;
    @property(cc.Label)
    progressLabel:cc.Label=null;

    isloading:boolean=false;
    public loadingCompleted:any=null;

    onLoad () 
	{
        this.progressBar.progress=0;
        Facade.getInstance().registerMediator(new LoadingMediator(this));
    }

    start () 
	{

    }

    update (dt) 
	{
        if(this.isloading)
        {
            this.progressBar.progress=AssetManager.getInstance().CompleteIndex/AssetManager.getInstance().urlsLength;
            //console.log(this.progressBar.progress);
            if(this.progressBar.progress<0.2) this.progressBar.progress=0.2;
            this.progressLabel.string=((this.progressBar.progress*100).toFixed(0)).toString()+'%';
            if(this.progressBar.progress>=1)
            {
                this.isloading=false;
                if(this.loadingCompleted!=null) this.loadingCompleted();
                this.node.destroy();
            }
        }
       
    }
}
