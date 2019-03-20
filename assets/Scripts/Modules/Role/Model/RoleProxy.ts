import { Proxy } from "../../../MVC/Patterns/Proxy/Proxy";
import { RoleVo } from "./RoleVO";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { IProxy } from "../../../MVC/Interfaces/IProxy";
import { Log } from "../../../Tools/Log";
import { DataManager } from "../../../Managers/DataManager";
import { TableName } from "../../../Common/TableName";
import { AttributeEnum, ProfessionEnum } from "../../../Enums/RoleEnum";
import { AssetManager } from "../../../Managers/AssetManager";
import { GameCommand } from "../../../Events/GameCommand";
import { UpgradeAttributeVo } from "../../../Common/VO/UpgradeAttributeVo";
import { UpgradeCostVo } from "../../../Common/VO/UpgradeCostVo";
import { RoleInfoEvent } from "../../../Events/RoleInfoEvent";
import { RoleAdvanceVo } from "../../../Common/VO/RoleAdvanceVo";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import { GameStorage } from "../../../Tools/GameStorage";
import { MathTool } from "../../../Tools/MathTool";
import { CookingEvent } from "../../../Events/CookingEvent";
import { ServerSimulator } from "../../Missions/ServerSimulator";
import { DevelopTask } from "../../Missions/MissionManager";
import { NetRoleInfo } from "../../../NetWork/NetMessage/NetRoleInfo";
import { PropVo } from "../../../Common/VO/PropVo";
import { RequestType } from "../../../NetWork/NetDefine";
import { HttpRequest } from "../../../NetWork/HttpRequest";


/**
 * 
 */
export class RoleProxy extends Proxy implements IProxy
{
    public roleData: Map<number, PresonDataBase> = new Map();
    public roleList: Array<PresonDataBase> = new Array();


    /**
     * 
     */
    public constructor()
    {
        super(RoleProxy.name);
        //let vo: RoleVo = new RoleVo();
        //this.roleData = vo.roleData;
    }

    InitProxy()
    {

        this.roleData = DataManager.getInstance().baseRoleMap;

        this.roleData.forEach((value, key) =>
        {
            this.roleList.push(value);
        });

    }

    initRole(info: NetRoleInfo[])
    {
        this.roleData = new Map();
        this.roleList = new Array();
        let role: PresonDataBase = new PresonDataBase();
        DataManager.getInstance().baseRoleMap = new Map();
        for (let i = 0; i < info.length; i++)
        {
            let _info: NetRoleInfo = info[i];
            role = DataManager.getInstance().TableRoleMap.get(_info.characterId);
            role._ID = Number(_info.characterId);
            role._Level = Number(_info.level);
            role._AdvanceLevel = Number(_info.advanceLevel);
            role._Power = Number(_info.power);
            role._Agility = Number(_info.agility);
            role._PhysicalPower = Number(_info.physicalPower);
            role._Will = Number(_info.will);
            role._Cooking = Number(_info.cooking);
            role._Vigor = Number(_info.vigor);
            role._Savvy = Number(_info.savvy);
            role._Luck = Number(_info.luck);
            role._NowState = Number(_info.characterState);
            DataManager.getInstance().baseRoleMap.set(role._ID, role);
        }
        this.roleData = DataManager.getInstance().baseRoleMap;
        this.roleData.forEach((value, key) =>
        {
            this.roleList.push(value);
        });
    }

    updateRole(_info: NetRoleInfo)
    {
        let role: PresonDataBase = this.roleData.get(Number(_info.characterId));
        role._ID = Number(_info.characterId);
        role._Level = Number(_info.level);
        role._AdvanceLevel = Number(_info.advanceLevel);
        role._Power = Number(_info.power);
        role._Agility = Number(_info.agility);
        role._PhysicalPower = Number(_info.physicalPower);
        role._Will = Number(_info.will);
        role._Cooking = Number(_info.cooking);
        role._Vigor = Number(_info.vigor);
        role._Savvy = Number(_info.savvy);
        role._Luck = Number(_info.luck);
        role._NowState = Number(_info.characterState);
    }

    addRole(roleID: number)
    {
        this.roleData.set(roleID, DataManager.getInstance().TableRoleMap.get(roleID));
        this.roleList.push(this.roleData.get(roleID));
    }

    public getOwnerRole()
    {
        this.sendNotification(CookingEvent.INIT_OWNER_ROLE);
    }

    /**
     * 根据人物ID获取人物
     * @param _id 人物ID
     */
    public GetRoleFromID(_id: any): PresonDataBase
    {
        return this.roleData.get(_id);
    }

    /**
     * 根据人物名字获取一个人物
     * @param _name 人物名字
     */
    public GetRoleFromName(_name: string): PresonDataBase
    {
        return this.roleList.filter(p => p._Name === _name)[0];
    }

    /**
     * 根据角色名字获取一组此名字的人物（ID唯一，人物名不唯一，可能有重名）
     * @param _name 角色名字
     * @returns 返回PresonDataBase数组
     */
    public getRolesFromname(_name: string): PresonDataBase[]
    {
        return this.roleList.filter(p => p._Name === _name);
    }

    /**
     * 
     * @param id 职业编号
     */
    public getProfession(id: number): string
    {
        switch (id)
        {
            case 1:
                return '品尝家';
                break;
            case 2:
                return '狩猎者';
                break;
            case 3:
                return '探险者';
                break;
            case 4:
                return '料理家';
                break;
            default:
                break;
        }
    }

    public getPrefabWithName(_name: string): cc.Prefab
    {
        return AssetManager.getInstance().prefabMap.get(_name);
    }

    public getProfessionSprite(profeesionID: number): cc.SpriteFrame
    {
        let atlasName = this.getProfessionResourceName(profeesionID);

        return AssetManager.getInstance().getSpriteFromAtlas(atlasName);
    }

    public getSpriteFromAtlas(_name: string): cc.SpriteFrame
    {
        return AssetManager.getInstance().getSpriteFromAtlas(_name);

    }

    //#region 属性排序

    /**
         * 战斗属性排序
         * @param attrValArr 战斗属性值 1.力量 2.敏捷 3.体力 4.意志
         */
    public SortBattleAttr(attrValArr: any): any
    {
        let data: PresonDataBase = null;
        let attrArr = [];
        attrArr.push({ id: AttributeEnum.Power, val: attrValArr[0], index: 0 });
        attrArr.push({ id: AttributeEnum.Agility, val: attrValArr[1], index: 1 });
        attrArr.push({ id: AttributeEnum.PhysicalPower, val: attrValArr[2], index: 2 });
        attrArr.push({ id: AttributeEnum.Will, val: attrValArr[3], index: 3 });

        let sortArr = attrArr.sort((a, b) =>
        {
            return b.val - a.val;
        });

        let arr = [];
        for (let index = 0; index < sortArr.length; index++)
        {
            let element = sortArr[index];
            let _sprite: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(element.id);
            arr.push({ spriteFrame: _sprite, val: element.val });
        }
        return arr;
    }

    /**
     * 做菜属性排序
     * @param attrValArr 做菜属性值 1.厨技 2.幸运 3.悟性 4.精力
     */
    public sortCookingAttr(attrValArr: any): any
    {
        let data: PresonDataBase = null;
        let attrArr = [];
        attrArr.push({ id: AttributeEnum.Cooking, val: attrValArr[0], index: 0 });
        attrArr.push({ id: AttributeEnum.Luck, val: attrValArr[1], index: 1 });
        attrArr.push({ id: AttributeEnum.Savvy, val: attrValArr[2], index: 2 });
        attrArr.push({ id: AttributeEnum.Vigor, val: attrValArr[3], index: 3 });


        let sortArr = attrArr.sort((a, b) =>
        {
            return b.val - a.val;
        });
        let arr = [];
        for (let index = 0; index < sortArr.length; index++)
        {
            let element = sortArr[index];
            let _sprite: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(element.id);
            arr.push({ spriteFrame: _sprite, val: element.val });
        }
        return arr;
    }

    //#endregion



    /** 检查是否有足够的金币升一级 */
    public upgradeLevelCost(id: number): number
    {
        let costVo: UpgradeCostVo = this.getUpgradeCostVo(id);
        return costVo._CoinCost;
    }

    /** 检查是否有足够的金币升满级 */
    public upgradeFullCost(id: number): number
    {
        let role: PresonDataBase = this.roleData.get(id);
        let num = 0;
        DataManager.getInstance().UpgradeCostMap.forEach((value, key) =>
        {
            if (value._UpgradeCost == role._UpgradeCost && value._AdvanceLevel == role._AdvanceLevel && value._Level >= role._Level)
            {
                num += value._CoinCost;
            }
        });
        return num;
    }

    public upgradeLevel(id: number)
    {
        HttpRequest.getInstance().requestPost(RequestType.character_uplevel, null, '{"type":1,"characterId":' + id + '}');
        this.upgradeAttr(id);
    }

    /**
     * 升级属性
     */
    public upgradeAttr(id: number)
    {
        let role: PresonDataBase = this.roleData.get(id);
        CurrencyManager.getInstance().Coin -= this.upgradeLevelCost(role._ID);

        let attrVo: UpgradeAttributeVo = this.getUpgradeAttributeVo(id);
        role._Power += Number(attrVo._Power);
        role._Agility += Number(attrVo._Agility);
        role._PhysicalPower += Number(attrVo._PhysicalPower);
        role._Will += Number(attrVo._Will);
        role._Cooking += Number(attrVo._Cooking);
        role._Vigor += Number(attrVo._Vigor);
        role._Savvy += Number(attrVo._Savvy);
        role._Luck += Number(attrVo._Luck);
        role._Level += 1;
        ServerSimulator.getInstance().upLoadRole(DevelopTask.TaskRoleLevel, role._ID);
        if (role._Level == 21 || role._Level == 41)
        {
            role._AdvanceLevel += 1;
            ServerSimulator.getInstance().upLoadRole(DevelopTask.TaskRoleAdvanceLevel, role._ID);
        }
        DataManager.getInstance().changeRoleAttr(role._ID, role);
        if (role._Level == 20 || role._Level == 40) this.sendNotification(RoleInfoEvent.ADVANCE_UP);
        else if (role._Level == 60) this.sendNotification(RoleInfoEvent.FULL_LEVEL_ADVANCE);
        else this.sendNotification(RoleInfoEvent.LEVELT_UP);
    }

    /**
     * 升满级
     */
    public fullUpgradeAttr(id: number)
    {
        HttpRequest.getInstance().requestPost(RequestType.character_uplevel, null, '{"type":2,"characterId":' + id + '}');
        let role: PresonDataBase = this.roleData.get(id);
        let costAmount: number = 0;
        DataManager.getInstance().UpgradeAttrMap.forEach((value, key) =>
        {
            if (value._Level >= role._Level && role._Level != 20 && role._Level != 40 && role._Level != 60)
            {
                if (value._UpgradeAttribute == role._UpgradeAttribute && value._AdvanceLevel == role._AdvanceLevel)
                {
                    costAmount += this.upgradeLevelCost(role._ID);
                    //CurrencyManager.getInstance().Coin -= this.upgradeLevelCost(role._ID);
                    role._Power += Number(value._Power);
                    role._Agility += Number(value._Agility);
                    role._PhysicalPower += Number(value._PhysicalPower);
                    role._Will += Number(value._Will);
                    role._Cooking += Number(value._Cooking);
                    role._Vigor += Number(value._Vigor);
                    role._Savvy += Number(value._Savvy);
                    role._Luck += Number(value._Luck);
                    role._Level += 1;
                    ServerSimulator.getInstance().upLoadRole(DevelopTask.TaskRoleLevel, role._ID);
                    //Log.Info('升级。。。。', role._AdvanceLevel, role._UpgradeAttribute, role._Level);
                }
            }
        });

        CurrencyManager.getInstance().Coin -= costAmount;
        DataManager.getInstance().changeRoleAttr(role._ID, role);
        if (role._Level == 20 || role._Level == 40) this.sendNotification(RoleInfoEvent.ADVANCE_UP);
        else if (role._Level == 60) this.sendNotification(RoleInfoEvent.FULL_LEVEL_ADVANCE);
    }

    getAdvanceVo(id: number): RoleAdvanceVo
    {
        let role: PresonDataBase = this.roleData.get(id);
        let key = Number(role._AdvancedCost.toString() + role._AdvanceLevel.toString());
        let vo: RoleAdvanceVo = DataManager.getInstance().UpgradeAdvanceMap.get(key);
        return vo;
    }

    /**
     * 升级消耗道具
     * @param id 
     */
    takeoutAdvanceProp(id: number)
    {
        HttpRequest.getInstance().requestPost(RequestType.character_upadvance_level, null, '{"characterId":' + id + '}');
        let role: PresonDataBase = this.roleData.get(id);
        let key = Number(role._AdvancedCost.toString() + (role._AdvanceLevel - 1).toString());
        let vo: RoleAdvanceVo = DataManager.getInstance().UpgradeAdvanceMap.get(key);
        //Log.Info(DataManager.getInstance().PropVoMap.get(vo._PropID)._Amount, '----', vo._PropNum);
        let prop: PropVo = DataManager.getInstance().PropVoMap.get(vo._PropID);
        prop._Amount -= vo._PropNum;
        prop._Amount = MathTool.Abs(prop._Amount);
        DataManager.getInstance().savePropNum(vo._PropID, prop._Amount);
    }

    getUpgradeAttributeVo(id: number): UpgradeAttributeVo
    {
        let role: PresonDataBase = this.roleData.get(id);
        let key1 = Number(role._UpgradeAttribute.toString() + role._AdvanceLevel.toString() + role._Level.toString());
        let attrVo: UpgradeAttributeVo = DataManager.getInstance().UpgradeAttrMap.get(key1);
        return attrVo;
    }

    getUpgradeCostVo(id: number): UpgradeCostVo
    {
        let role: PresonDataBase = this.roleData.get(id);
        let key2 = Number(role._UpgradeCost.toString() + role._AdvanceLevel.toString() + role._Level.toString());
        let costVo: UpgradeCostVo = DataManager.getInstance().UpgradeCostMap.get(key2);
        return costVo;
    }


    /**
     * 
     * @param data 
     */
    setData(data: any): void
    {

    }

    /**
     * 
     */
    getData()
    {

    }
    /**
     * 根据职业类型ID返回职业名称
     * @param id 职业类型ID
     */
    getProfessionResourceName(id: number)
    {
        switch (id)
        {
            case 1:
                return ProfessionEnum.Taster;
                break;
            case 2:
                return ProfessionEnum.Hunter;
                break;
            case 3:
                return ProfessionEnum.Explorer;
                break;
            case 4:
                return ProfessionEnum.Spencer;
                break;
            default:
                break;
        }
    }

    /**
     * 根据做菜技能类型ID返回做菜技能名称
     * @param id 做菜技能类型ID
     */
    public getSkillFromID(id: number): string
    {
        switch (id)
        {
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
                break;
        }
    }

    /**
     * 根据做菜技能类型ID返回做菜技能类型图标
     * @param id 做菜技能类型ID
     */
    public getCookSkillSpriteFromID(id: number): cc.SpriteFrame
    {
        return this.getSpriteFromAtlas(this.getSkillFromID(id));
    }


    /**
     * 
     */
    onRegister(): void
    {

    }

    /**
     * 
     */
    onRemove(): void
    {

    }


}
