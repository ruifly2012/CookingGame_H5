import { Proxy } from "../../../MVC/Patterns/Proxy/Proxy";
import { DataManager } from "../../../Managers/DataManager";
import { CookMenuVo } from "./VO/CookMenuVo";
import { Log } from "../../../Tools/Log";
import { AssetManager } from "../../../Managers/AssetManager";
import { FoodMaterialVo } from "./VO/FoodMaterialVo";
import { AttributeEnum } from "../../../Enums/RoleEnum";
import { RoleProxy } from "../../Role/Model/RoleProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { CookingProxy } from "./CookingProxy";
import { GameStorage } from "../../../Tools/GameStorage";
import { MenuTypeEnum } from "../../../Enums/CookingEnum";
import { Menu } from "./VO/Menu";
import { PropVo } from "../../../Common/VO/PropVo";
import { VisitorDataBase } from "../../../Common/VO/VisitorDataBase";
import { VisitorVo } from "./VO/VisitorVo";
import { MaterialDataBase } from "../../../Common/VO/RuneDataBase";

/**
 * 
 */
export class MenuProxy extends Proxy {
    cookMenuMap: Map<number, CookMenuVo> = new Map();
    foodMateials: Array<FoodMaterialVo> = null;
    originMaterialValue:Map<number,number>=new Map();


    /**
    * 
    */
    public constructor() {
        super(MenuProxy.name);
        //this.configCookMenu();
    }

    configCookMenu() {
        this.cookMenuMap = DataManager.getInstance().baseMenuMap;
        this.foodMateials = new Array();
        let foodMataial: FoodMaterialVo = null;
        DataManager.getInstance().PropVoMap.forEach((value, key) => {
            if (String(key).substr(0, 2) == '30') {
                var obj = value;
                foodMataial = new FoodMaterialVo();
                foodMataial.ID = value._ID;
                foodMataial.Name = value._Name;
                foodMataial.Description = value._Description;
                foodMataial.Type = value._Type;
                foodMataial.ResouceName = value._ResourceName;
                foodMataial.Amount=value._Amount;
                this.foodMateials.push(foodMataial);
                this.originMaterialValue.set(foodMataial.ID,foodMataial.Amount);
            }
        });

        //console.dir(this.cookMenuMap.get(20001)['GradeNum']);
        //this.typeSort(MenuTypeEnum.Drinks);   
    }

    getLocalData()
    {
        this.foodMateials.forEach((material)=>{
           // material.Amount=GameStorage.getItem(material.ID.toString());
            //DataManager.getInstance().savePropNum(material.ID, Math.abs(material.Amount));
        });
    }

    getMenuFromID(id: number): CookMenuVo {
        let menu: CookMenuVo = this.cookMenuMap.get(id);
        if (menu == null) Log.Error('!!!the menu id:' + id + ' is null!');
        return menu;
    }

    getMenuList(): CookMenuVo[] {
        return Array.from(this.cookMenuMap.values());
    }

    

    getCookMenuVo(id: number): CookMenuVo {
        return this.cookMenuMap.get(id);
    }

    getFoodMaterial(id: number): FoodMaterialVo {
        return this.foodMateials.find(o => o.ID == id);
    }
    
    updateFoodMaterial()
    {
        this.foodMateials.forEach((material)=>{
            if(Number(GameStorage.getItem(material.ID.toString())-this.originMaterialValue.get(material.ID))>0)
                material.Amount+=Number(GameStorage.getItem(material.ID.toString()))-this.originMaterialValue.get(material.ID);
        });
    }

    /**
     * 
     * @param id 菜谱ID
     */
    getFoodMaterials(id: number): FoodMaterialVo[] {
        let vo: FoodMaterialVo = new FoodMaterialVo();
        let arr: any = [];
        this.cookMenuMap.get(id)._FoodMaterialMap.forEach((value, key) => {
            vo = this.foodMateials.filter(o => o.ID == key)[0];
            if (vo != null) arr.push(vo);
        });
        return arr;
    }

    saveFoodMaterial()
    {
        this.foodMateials.forEach((material)=>{
            DataManager.getInstance().savePropNum(material.ID, Math.abs(material.Amount));
            this.originMaterialValue.set(material.ID,material.Amount);
        });
    }

    configFoodMaterial() {

    }

    public getMenuItemPrefab(): cc.Prefab {
        let p: cc.Prefab = AssetManager.getInstance().prefabMap.get('menuSelectItem');
        if (p == null) Log.Error('!!!the p ', 'menuSelectItem', ' is null!');
        return p;
    }

    public getFoodMaterialPrefab(): cc.Prefab {
        let p: cc.Prefab = AssetManager.getInstance().prefabMap.get('foodMateialItem');
        if (p == null) Log.Error('!!!the p ', 'foodMateialItem', ' is null!');
        return p;
    }

    /**
     * 获取菜谱ICON
     * @param _resourceName 资源名
     */
    public getMenuSprite(_resourceName: string): cc.SpriteFrame {
        let sprite: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(_resourceName);
        return sprite;
    }

    /**
     * 根据菜谱ID获取其能力类型的ICON及其值
     * @param id 菜谱ID
     */
    public getAttrSprite(id: number): any {
        let menu: CookMenuVo = this.getCookMenuVo(id);
        let arr: any = [];
        let keyArr = Array.from(menu._skillMap.keys());
        let valueArr = Array.from(menu._skillMap.values());
        let attr1: cc.SpriteFrame = this.getCookSkillSpriteFromID(keyArr[0]);
        let attr2: cc.SpriteFrame = null;
        arr.push({ spriteFrame: attr1, val: valueArr[0] });
        if (keyArr.length == 2 && keyArr[1] != 0) {
            attr2 = this.getCookSkillSpriteFromID(keyArr[1]);
            arr.push({ spriteFrame: attr2, val: valueArr[1] });
        }

        return arr;
    }

    /**
     * 根据做菜技能类型ID返回做菜技能名称
     * @param id 做菜技能类型ID
     */
    public getSkillFromID(id: number): string {
        switch (id) {
            case 1:
                return AttributeEnum.Cooking;
                break;
            case 2:
                return AttributeEnum.Vigor;
                break;
            case 3:
                return AttributeEnum.Savvy;
                break;
            case 4:
                return AttributeEnum.Luck;
                break;
            default:
                return null;
                break;
        }
    }

    typeSort(_type:MenuTypeEnum=MenuTypeEnum.Appetizer)
    {
        let list=Array.from(this.cookMenuMap.values());
        let frontArr=list.filter(menu=>menu.getType()==_type);
        let backArr=list.filter(menu=>menu.getType()!=_type);
        list=frontArr.concat(backArr);
        console.dir(list);
    }

    /**
     * 根据做菜技能类型ID返回做菜技能类型图标
     * @param id 做菜技能类型ID
     */
    public getCookSkillSpriteFromID(id: number): cc.SpriteFrame {
        return AssetManager.getInstance().getSpriteFromAtlas(this.getSkillFromID(id));
    }

    compareSkill(skillID, value): boolean {
        let role: PresonDataBase = (<CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name)).getCurrSeatCookVo().role;
        switch (skillID) {
            case 1:
                return role._Cooking < value;
                break;
            case 2:
                return role._Vigor < value;
                break;
            case 3:
                return role._Savvy < value;
                break;
            case 4:
                return role._Luck < value;
                break;
            default:
                return true;
                break;
        }
    }

    /**
     * 获取菜的详细数据，用于显示详情页
     * @param menuId 
     */
    getMenuData(menuId:number):Menu
    {
        let menuView:Menu=new Menu();
        let name:string='';
        let sprite:cc.SpriteFrame=null;
        let val:string='';
        //this.foodMateials.find()
        let _menuVo:CookMenuVo=this.cookMenuMap.get(menuId);
        menuView._ID=_menuVo._ID;
        menuView._Name=_menuVo._Name;
        menuView._Star=_menuVo._Star;
        menuView._Icon=AssetManager.getInstance().getSpriteFromAtlas(_menuVo._ResourceName);
        menuView._Grade=AssetManager.getInstance().getSpriteFromAtlas(_menuVo._Grade);
        menuView._Origin=_menuVo._Origin;
        let _foodmateril:FoodMaterialVo=new FoodMaterialVo();
        _menuVo._FoodMaterialMap.forEach((value,materialId)=>{
            _foodmateril=this.foodMateials.find(o=>o.ID==materialId);
            name=_foodmateril.Name;
            sprite=AssetManager.getInstance().getSpriteFromAtlas(this.foodMateials.find(o=>o.ID==materialId).ResouceName);
            val=_foodmateril.Amount+'/'+value;
            menuView._FoodMaterialArr.push({_ID:materialId,_name:name,_sprite:sprite,_val:val});
        });
        _menuVo._skillMap.forEach((value,id)=>{
            sprite=AssetManager.getInstance().getSpriteFromAtlas(this.getSkillFromID(id));
            val=value.toString();
            menuView._AttrArr.push({_sprite:sprite,_val:val});
        });
        if(_menuVo._RuneID!=0)
        {
            let rune:PropVo=DataManager.getInstance().PropVoMap.get(_menuVo._RuneID);
            if(rune!=undefined && rune!=null)
            {
                sprite=AssetManager.getInstance().getSpriteFromAtlas(rune._ResourceName);
                val=rune._Name;
                menuView._OutputRuneArr.push({_ID:rune._ID,_sprite:sprite,_val:val});
            }
        }

        return menuView;
    }

    /**
     * 获取访客详情数据，用于显示访客详情页
     * @param id 访客ID
     */
    getVisitorVoData(id:number):VisitorVo
    {
        let visitor: VisitorDataBase = DataManager.getInstance().VisitorMap.get(id);
        let vo:VisitorVo=new VisitorVo();
        vo._ID=visitor._ID;
        vo._Name=visitor._Name;
        vo._Desc=visitor._Intro;
        vo._VisitorImg=AssetManager.getInstance().FigureMap.get(visitor._Icon);
        let sprite:any=null;
        let val:string=null;
        visitor._MenuIDs.forEach((menuId)=>{
            let _menu:CookMenuVo=this.cookMenuMap.get(menuId);
            sprite=AssetManager.getInstance().getSpriteFromAtlas(_menu._ResourceName);
            val=_menu._Name;
            vo._Menus.push({_ID:menuId,_sprite:sprite,_val:val});

            let _rune:MaterialDataBase=DataManager.getInstance().MaterialMap.get(_menu._RuneID);
            sprite=AssetManager.getInstance().getSpriteFromAtlas(_rune._ResourceName);
            val=_rune._Name;
            vo._Runes.push({_ID:_rune._ID,_sprite:sprite,_val:val});
        });
        return vo;
    }

    /**
     * 
     * @param data 
     */
    setData(data: any): void {

    }

    /**
     * 
     */
    getData() {

    }

    /**
     * 
     */
    onRegister(): void {

    }

    /**
     * 
     */
    onRemove(): void {

    }


}
