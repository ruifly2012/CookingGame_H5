import { NetProps } from "./NetCommonality";

/**背包面板信息（服务端 -> 客户端）
 * WareHouseList=113  //背包道具列表
 */
export class NetWarehouseInfo{
    /**玩家所拥有的菜谱数据 */
    FoodMenuArray:Array<NetProps>=[];
    /**玩家所拥有的食材数据 */
    FoodMaterialsArray:Array<NetProps>=[];
    /**玩家所拥有的材料数据 */
    MaterialsArray:Array<NetProps>=[];
}
