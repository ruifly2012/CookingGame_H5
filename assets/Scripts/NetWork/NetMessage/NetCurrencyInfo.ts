import { NetHead } from "./NetHead";

/**
 * 
 */
export class NetCoinChangeInfo 
{
    /** 变化数值，减少就为负数 */  
    changeValue:number=0;  
}

export class NetDiamondChangeInfo 
{
    /** 变化数值，减少就为负数 */  
    changeValue:number=0;  
}

export class CurrencyInfo
{
    id:number=0;
    goldCoin:number=0;
    diamonds:number=0;
    playerId:number=0;

    constructor()
    {
        
    }
}