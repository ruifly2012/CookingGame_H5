import { Log } from "../Tools/Log";


/**
 * 
 */
export class NetManager
{
    private static instance;
    
    public constructor(){}

    public static getInstance():NetManager{
        if(!NetManager.instance){
            NetManager.instance=new NetManager();
        }
        return NetManager.instance;
    }

    public download()
    {
        
    }
}
