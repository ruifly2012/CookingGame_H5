import { GlobalPath } from "../Common/GlobalPath";
import { Log } from "../Tools/Log";


/**
 * 
 */
export class ConfigManager {

    private static instance;

    private constructor(){}

    public static getInstance():ConfigManager{
        if(!ConfigManager.instance){
            ConfigManager.instance=new ConfigManager();
        }
        return ConfigManager.instance;
    }

    configMap:Map<string,string>=new Map();
    prefabPathMap:Map<string,string>=new Map();

    init()
    {
        let self=this;
        this.loadTxtFile(GlobalPath.CONFIG_PATH,function(map){
            self.configMap=map;
        });
        this.loadTxtFile(GlobalPath.PREFAB_PATH,function(map){
            self.prefabPathMap=map;
        });
    }

    loadTxtFile(_path:string,_completeCallback:any)
    {
        let self=this;
        let keyvalue:Map<string,string>=new Map();
        cc.loader.loadRes(_path,cc.TextAsset,function(err,file){
            let str:string=file.text;
            let lines:string[]=file.text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if(lines[i].split(',')[1]!=null && lines[i].split(',')[1]!=undefined) keyvalue.set(lines[i].split(',')[0],lines[i].split(',')[1]);
            }
            _completeCallback(keyvalue);
        });
        
    }

    
}
