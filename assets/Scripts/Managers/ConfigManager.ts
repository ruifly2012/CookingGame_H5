import { GlobalPath } from "../Common/GlobalPath";


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

    loadConfigFile()
    {
        let keyvalue:Map<string,string>=new Map();
        cc.loader.loadRes(GlobalPath.CONFIG_PATH,cc.TextAsset,function(err,file){
            let str:string=file.text;
            let lines:string[]=file.text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                keyvalue.set(lines[i].split(',')[0],lines[i].split(',')[1]);
                
            }
        });
    }

    
}
