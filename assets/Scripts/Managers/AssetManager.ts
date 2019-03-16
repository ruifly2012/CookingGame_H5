import { ResourceManager } from "./ResourceManager";
import { Log } from "../Tools/Log";
import { GlobalPath } from "../Common/GlobalPath";
import { UIPanelEnum } from "../Enums/UIPanelEnum";
import { UIManager } from "./UIManager";
import { ObjectTool } from "../Tools/ObjectTool";


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
    private prefabUrls:string[]=[];
    public get urlsLength():number
    {
        return this.prefabUrls.length;
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
        this.prefabUrls=[GlobalPath.UI_ATLAS_PATH,GlobalPath.ITEM_PREFAB_DIR,GlobalPath.TREASURE_ITEM_DIR,GlobalPath.ROLE_ATTRIBUTE_ICON_PATH
                        ,GlobalPath.STAGE_PROPERTY_Path+'Figure/',GlobalPath.UI_PANEL_DIR + UIPanelEnum.LobbyPanel];

        ResourceManager.getInstance().loadResourceDir(GlobalPath.TREASURE_ITEM_DIR,cc.Prefab,this.loadedPrefabs.bind(this));
        ResourceManager.getInstance().loadResourceDir(GlobalPath.ROLE_ATTRIBUTE_ICON_PATH,cc.SpriteFrame,this.completeAttributeSprite.bind(this));
        ResourceManager.getInstance().loadResourceDir(GlobalPath.STAGE_PROPERTY_Path+'Figure/',cc.SpriteFrame,this.FigureSprite.bind(this));
        ResourceManager.getInstance().loadResourceDir(GlobalPath.ITEM_PREFAB_DIR,cc.Prefab,this.loadedPrefabs.bind(this));
        ResourceManager.getInstance().loadResources(GlobalPath.UI_ATLAS_PATH,cc.SpriteAtlas,this.completeAtlas.bind(this));

        let self=this;
        ResourceManager.getInstance().loadResources(GlobalPath.UI_PANEL_DIR + UIPanelEnum.LobbyPanel, cc.Prefab, function (obj: cc.Prefab)
        {
            if (obj != null)
            {
                let _node: cc.Node = ObjectTool.instanceWithPrefab(obj.name, obj, UIManager.getInstance().uiRoot);
                UIManager.getInstance().setUIPanel(UIPanelEnum.LobbyPanel, _node);
                _node.active=false;
                self.completeIndex++;
            }
        });
        
    }

    completeAtlas(atlas:cc.SpriteAtlas)
    { 
        let spriteFrames:cc.SpriteFrame[]=atlas.getSpriteFrames();
        if(atlas!=null) this.spriteAtlas=atlas;
        this.completeIndex++;
    }

    loadedPrefabs(prefabs:cc.Prefab[])
    {
        for (let i = 0; i < prefabs.length; i++) {
            this.prefabMap.set(prefabs[i].name,prefabs[i]);
        }
        this.completeIndex++;
    }

    //#region  临时test，后面再优化
    //#endregion
    /**
     * 加载属性ICON完成
     * @param args 加载完成的精灵数组
     */
    completeAttributeSprite(args:cc.SpriteFrame[]): any {
        for(let i=0;i<args.length;i++)
        {
            this.attrMap.set(args[i].name,args[i]);
        }
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
