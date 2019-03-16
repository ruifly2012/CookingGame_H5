
/**
 * 公共类脚本
 */
export class NetCommonality {
    constructor() {

    }
}

/**道具（道具ID and 道具数量） 
*/
export class NetProps{
    /**道具ID */
    PropsID:number=0;
    /**道具数量 */
    PropsNum:number=0;

    id:number=0;
    propsId:number=0;
    propsValue:number=0;
    propsType:number=0;
    playerId:number=0;

    constructor(){

    }
}

/**任务信息过关条件 */
export class NetTaskInfo{
    /**图片资源名字*/
    ImageName:string='';
    /**需要满足的条件，例如：>=50*/
    Value:string='';
}
