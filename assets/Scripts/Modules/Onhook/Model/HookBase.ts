import FigureGridData from "../../Explore/FigureGridData";
import { GameManager } from "../../../Managers/GameManager";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import { GameStorage } from "../../../Tools/GameStorage";
import HookDataBase from "./HookDataBase";
import { RoleProxy } from "../../Role/Model/RoleProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { DataManager } from "../../../Managers/DataManager";
import { AssetManager } from "../../../Managers/AssetManager";
import { ObjectTool } from "../../../Tools/ObjectTool";
import VisitorView from "../../Cooking/View/Panel/VisitorView";
import { VisitorDataBase } from "../../../Common/VO/VisitorDataBase";
import { ServerSimulator } from "../../Missions/ServerSimulator";
import { HookLevelInfo, OnHookProtocal } from "../../Missions/MissionManager";
import OnHookProxy from "./OnHookProxy";

/**挂机数据操作类 */
export default class HookBase {

    /**挂机地图ID*/
    OnHookID: number = 0;
    /**计算属性值总和回调函数（type:number） */
    TotalHandle: any = null;
    /**挂机数据类*/
    HB:HookDataBase;
    /**属性总和 */
    total: number = 0;
    constructor(name:string) {
        this.HB=new HookDataBase(name);
    }
    /**
     * 返回指定类型属性总和，若有回调，则执行一遍回调
     * @param type 属性类型 1为力量,2为敏捷,3为体力,4为意志
     */
    TotalAttribute(type: number): number {
        this.total = 0;
        var roleproxy = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
        for (let i = 0; i < this.HB._IDArray.length; i++) {
            var r=roleproxy.GetRoleFromID(this.HB._IDArray[i])
            var tr = (type == 1 ? r._Power : type == 2 ? r._Agility : type == 3 ? r._PhysicalPower : type == 4 ? r._Will : 0);
            this.total = this.total + tr;
        }
        if (this.TotalHandle != null) this.TotalHandle(this.total);
        return this.total;
    }

    /**获取所有挂机人物的ID */
    TotalAllID(): Array<number> {
        return this.HB._IDArray;
    }

    /**判断当前挂机地图属性满足多少档食材条件(0为不满足)*/  
    FoodStall(): number {
        var dalt = GameManager.getInstance().GetOnHook(Math.floor(this.OnHookID / 10000), true);//获取当前地图所有等级数据
        var stall = 0;
        // console.log ('  ID:'+Math.floor(this.OnHookID/10000)+'   dalt.length:'+dalt.length+'  dalt[0]:'+dalt[0]+'  this.total:'+this.total);
        for (let i = 0; i < dalt.length; i++) {
            if (this.total >= Number(dalt[i]._ConditionValue)) {
                stall = i + 1;
            }
        }
        return stall;
    }

    /**删除一个已选择的人物 */
    remove(fb: FigureGridData) {
        for (let i = 0; i < this.HB._IDArray.length; i++) {
            if (this.HB._IDArray[i] == fb.PresonDate._ID) {
                this.HB._IDArray.splice(i, 1);
            }
        }
    }

    /**完成挂机获取奖励 */
    AwardFood() {
        var dalt = GameManager.getInstance().GetOnHook(Math.floor(this.OnHookID / 10000), true);//获取当前地图所有等级数据
        var _LevelInfo:HookLevelInfo[]=[];
        for (let i = 0; i < dalt.length; i++) {
            if (this.total >= Number(dalt[i]._ConditionValue)&&i<this.HB._Level) {
                if (dalt[i]._FoodMaterial == 10001) {
                    CurrencyManager.getInstance().Coin += Number(dalt[i]._FoodNumber * this.HB._Time*(this.HB._Quadruple?2:1));
                } else if (dalt[i]._FoodMaterial == 10002) {
                    CurrencyManager.getInstance().Money += Number(dalt[i]._FoodNumber *  this.HB._Time);
                } else {
                    var original=Number(GameStorage.getItem(dalt[i]._FoodMaterial.toString()));//原有食材数
                    var r=dalt[i]._FoodNumber ;//挂机一小时获得的基数
                    var time=this.HB._Time;//挂机时长
                    var Quadruple=this.HB._Quadruple?2:1;//翻倍
                    var Roadster=DataManager.getInstance().FoodMaterialMap.get(dalt[i]._FoodMaterial).Type==DataManager.getInstance().CarMap.get(this.HB._Roadster)._Skill?1+DataManager.getInstance().CarMap.get(this.HB._Roadster)._Value/100:1;//当前食材是否获得车加成
                    var hf=new HookLevelInfo(i+1,dalt[i]._FoodMaterial,Math.ceil( r*time*Quadruple*Roadster));
                    _LevelInfo.push(hf);
                    GameStorage.setItem(dalt[i]._FoodMaterial.toString(),Math.ceil( original+ ( r*time*Quadruple*Roadster)));
                    // console.log ('食材ID：'+dalt[i]._FoodMaterial+'  原有食材数：'+original+'  基数:'+r+ '  挂机时长：'+time+'  倍率：'+Quadruple+'  车加成：'+Roadster);
                }
            }
        }
        var probability=(Number(dalt[this.HB._Level-1]._Probability)/100)*this.HB._Time;//挂机获得符石概率
        var ra=Math.random();
        console.log ('当前获得符石的概率为：'+probability+'  当前随机数为：'+ra);
        if(ra<=probability){
            var _itemData=new VisitorDataBase();
            _itemData._Name='获得符文';
            _itemData._Dialog='真幸运';
            _itemData._RuneID=dalt[this.HB._Level-1]._Rune;
            let visitorPrefab:cc.Prefab=AssetManager.getInstance().prefabMap.get('VisitorView');
            var parent = cc.find('Canvas/Main Camera/onhookPanel');
            let runeIcon:cc.SpriteFrame=null;
                var _item=ObjectTool.instanceWithPrefab('',visitorPrefab,parent).getComponent(VisitorView);
                runeIcon=AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().PropVoMap.get(Number(dalt[this.HB._Level-1]._Rune))._ResourceName);
                _item.showInfo(_itemData,_itemData._Name,null,runeIcon,_itemData._Intro,_itemData._Dialog);
        }
        ServerSimulator.getInstance().updateOnHook(new OnHookProtocal(dalt[this.HB._Level-1]._ID,_LevelInfo));
    }

    /**判断某id人物是否存在 */
    contain(id: number): boolean {
        var isOn: boolean = false;
        for (let i = 0; i <  this.HB._IDArray.length; i++) {
            if (this.HB._IDArray[i] == id) {
                isOn = true;
                break;
            }
        }
        return isOn;
    }
    
}

