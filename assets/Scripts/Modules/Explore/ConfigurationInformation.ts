/**
 * 参数配置脚本
 */



 /**
  * 
  */
export default class ConfigurationInformation {
  /**任务配额。用于当前任务ID+该配额 */
  static Quota_Str:string='Quota';

  /**prefab commonitem 路径 */
  static Prefab_commonItem_Pach:string='prefabs/commonItem/';
  
  /**食材或者道具图片路径 */
  static Explore_Stage_Pach:string='UI/Stage_Property/FoodMaterial/';

  /**人物资源图片地址 */
  static ExploreGrid_UI_Path:string='UI/Stage_Property/roleHeadIcon/';

  /**主属性图片文件夹 */
  static Explore_Attribute_pach:string ='UI/Stage_Property/Attribute/';

  /**探索界面人物格子预制体 */
  static ExplorePanel_FigureGrid_Prefab: string = 'prefabs/ui_panel/Figure_Grid';

  /**探索界面收获物体图标 */
  static ExporePanel_MaterialsGrid_prefab:string='prefabs/ui_panel/Materials_Grid';

  /**探索界面获得奖励预制体名字 */
  static ExplorePanel_Award_Prefab: string = 'Award_Grid';

  /**探索界面探索按钮（出战）改变UI */
  static ExplorePanel_Change_SpriteFrame: string = 'UI/Explore_Panel/shangchang';

  /**探索界面探索按钮（+号）原本UI */
  static ExplorePanel_Original_SpriteFrame: string = 'UI/Explore_Panel/01';

  /**探索界面属性已选UI */
  static ExplorePanel_Attribute_SpriteFrame: string = 'UI/Explore_Panel/04';

  /** 菜谱所需食材prefab*/
  static Warehouse_Particulars_Prefab:string='prefabs/ui_panel/Warehouse_Food';

  /** 食材格子prefab*/
  static Warehouse_FoodGrid_Prefab:string='prefabs/ui_panel/Food_Grid';

  /**探索面板 */
  static ExplorPanel_ExplorePanel_Prefab='prefabs/ui_panel/Explore_panel';

  /**探索详情界面 */
  static Select_Panel_Prefab='prefabs/ui_panel/Select_Panel';
}
