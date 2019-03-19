
/**
 * type 1.十连抽 2.单抽  drawType 奖池类型1.金币池
 */
export class NetDrawOutInfo 
{
    gold:number=0;
    diamonds:number=0;
    drawOut:any=null;

    public constructor(){

    }
}

/** 
 *  type 1.金币池
 */
export class NetTreasureInfo
{
    propId:number=0;
}

export class DrawParam
{
    /** 1.十连抽 2.单抽 */
    type:number=0;
    /** 奖池类型1.金币池 */
    drawType:number=0;

    
}
