import { Log } from "../Tools/Log";


const { ccclass, property } = cc._decorator;

/**
 * 本地资源加载类
 * @example 
 * ResourceManager.Instance.loadResources('prefabs/role_item', cc.Prefab, this.loadComplete.bind(this));
 * ResourceManager.Instance.loadResourceDir('props', cc.SpriteFrame, this.loadComplete.bind(this));
 * loadComplete(obj:any){  }
 */
export class ResourceManager{
    private static instance;

    private constructor() {}

    public static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    /**
     * 加载resource里的文件
     * @param _url 文件路径
     * @param _type 文件类型
     * @param _callback 回调函数，参数类型为any
     */
    public loadResources(_url: string, _type:typeof cc.Asset, _callback?: (obj) => any,loadingProgress?:any) {
        
        cc.loader.loadRes(_url,_type,loadingProgress,(err,obj)=>{
            if(err){
                console.error("!!! load _url:"+_url+" error.......");
            }
            else{
                Log.Info('load '+_url+' res complete...'+obj);
                if(obj==null) console.error('the obj:',_url,' is null!!!');
                if(typeof _callback !='undefined' && _callback instanceof Function)
                {
                    _callback(obj);
                }
            }
        });
    }

    /**
     * 加载resource里的整个文件夹内指定类型的所有资源
     * @param _url 文件夹路径
     * @param _type 文件类型
     * @param _callback 回调函数 参数类型为any
     *
     */
    public loadResourceDir(_url:string , _type: typeof cc.Asset,_callback?:(obj)=>any){
        cc.loader.loadResDir(_url,_type,this.loadingProgress,function(err,arr){
            if(err){
                console.error('!!! load error.....'+_url+','+err);
            }
            else{
                Log.Info('load '+_url+' res complete....'+arr.length);
                if(typeof _callback !='undefined' && _callback instanceof Function){
                    _callback(arr);
                }
            }
        });
    }


    loadingProgress(_completeCount:Number,_totalCount:Number,_item:any){

    }

    /**
     * 从远程下载图片
     * @param _url 路径要带后缀
     * @param _callback 返回有SpriteFrame参数的函数
     */
    public loadSpriteFrameRemote(_url:string,_callback:(_spriteFrame)=>any)
    {
        cc.loader.load(_url,function(err,pic){
            if(err)
            {
                Log.Error('load fail '+err);
            }
            else
            {
                Log.Info('load success!');

                //let sf:cc.SpriteFrame=new cc.SpriteFrame(pic,new cc.Rect(0,0,pic.width,pic.height));
                if(typeof _callback !='undefined' && _callback instanceof Function){
                    _callback(pic);
                }
            }
        });
    }

    /**
     * 释放已加载的资源
     * @param _path 资源路径（包括资源名字）
     */
    public unLoadRes(_path:string)
    {
        cc.loader.releaseRes(_path)
    }

    /**
     * 释放所有资源
     */
    public unLoadAllRes()
    {
        cc.loader.releaseAll();
    }

    public unLoadAsset(_path:string)
    {
        cc.loader.releaseRes(_path);
    }

    public unLoadAllAsset(_dirPath:string)
    {
        cc.loader.releaseResDir(_dirPath);
    }

    
    // update (dt) {}
}
