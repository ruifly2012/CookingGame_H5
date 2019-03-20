import { ResourceManager } from "./ResourceManager";
import { Log } from "../Tools/Log";
import { GlobalPath } from "../Common/GlobalPath";
import { UIPanelEnum } from "../Enums/UIPanelEnum";
import { UIManager } from "./UIManager";
import { ObjectTool } from "../Tools/ObjectTool";
import { ConfigManager } from "./ConfigManager";


/**
 * 资源加载管理，把游戏开始前需要加载的资源（resources文件夹里的）放到这里保存
 */
export class AssetManager {

    private static instance;

    prefabMap:Map<string,cc.Prefab>=new Map();
    attrMap:Map<string,cc.SpriteFrame>=new Map();
    FigureMap:Map<string,cc.SpriteFrame>=new Map();
    roleIconMap:Map<string,cc.SpriteFrame>=new Map();

    spriteAtlas:cc.SpriteAtlas=null;
    private atlasUrls:string[]=[];
    private prefabPaths:string[]=[];
    public get urlsLength():number
    {
        return this.atlasUrls.length+this.prefabPaths.length;
    }
    private completeIndex:number=0;
    public get CompleteIndex():number
    {
        return this.completeIndex;
    }

    private constructor(){

    }

    public static getInstance():AssetManager{
        if(!AssetManager.instance){
            AssetManager.instance=new AssetManager();
        }
        return AssetManager.instance;
    }

    PreInit()
    {
        this.atlasUrls=[GlobalPath.UI_ATLAS_PATH,GlobalPath.ROLE_BIG_MAP];
        this.prefabPaths=Array.from(ConfigManager.getInstance().prefabPathMap.values());
        for (let j = 0; j < this.prefabPaths.length; j++) {
            ResourceManager.getInstance().loadResources(this.prefabPaths[j],cc.Prefab,this.loadedPrefabs.bind(this));
        }
        ResourceManager.getInstance().loadResourceDir(GlobalPath.ROLE_BIG_MAP,cc.SpriteFrame,this.FigureSprite.bind(this));
        ResourceManager.getInstance().loadResources(GlobalPath.UI_ATLAS_PATH,cc.SpriteAtlas,this.completeAtlas.bind(this));
        
    }

    completeAtlas(atlas:cc.SpriteAtlas)
    { 
        let spriteFrames:cc.SpriteFrame[]=atlas.getSpriteFrames();
        if(atlas!=null) this.spriteAtlas=atlas;
        this.completeIndex++;
    }

    loadedPrefabs(prefab:cc.Prefab)
    {
        this.prefabMap.set(prefab.name,prefab);
        this.completeIndex++;
    }

    /**
     * 人物大图加载完成
     * @param args 加载完成的精灵数组
     */
    public FigureSprite(args:cc.SpriteFrame[]) {
        for(let i=0;i<args.length;i++)
        {
            this.FigureMap.set(args[i].name,args[i]);
        }
        this.completeIndex++;
    }


    public getSpriteFromAtlas(_name:string):cc.SpriteFrame
    {
        let sprite:cc.SpriteFrame=this.spriteAtlas.getSpriteFrame(_name);
        if(sprite==null) Log.Error('!!! the sprite '+_name+' is null');
        
        return sprite;
    }
    
}
