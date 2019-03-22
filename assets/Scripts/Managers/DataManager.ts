
import { Log } from "../Tools/Log";
import { TableName } from "../Common/TableName";
import { JsonHelper } from "../Tools/JsonHelper";
import { GlobalPath } from "../Common/GlobalPath";
import { PropVo } from "../Common/VO/PropVo";
import { CookMenuVo } from "../Modules/Cooking/Model/VO/CookMenuVo";
import PresonDataBase from "../Common/VO/PresonDataBase";
import { UpgradeAttributeVo } from "../Common/VO/UpgradeAttributeVo";
import { UpgradeCostVo } from "../Common/VO/UpgradeCostVo";
import { RoleAdvanceVo } from "../Common/VO/RoleAdvanceVo";
import LevelDataBase from "../Common/VO/LevelDataBase";
import GlobalVarBase from "../Common/VO/GlobalVarBase";
import { GameStorage } from "../Tools/GameStorage";
import { CookingVo } from "../Modules/Cooking/Model/VO/CookingVo";
import { CookingEvent } from "../Events/CookingEvent";
import { FigureStatus, ProfessionEnum, PropTypes } from "../Enums/RoleEnum";
import { MathTool } from "../Tools/MathTool";
import SkillDataBase from "../Common/VO/SkillDataBase";
import { MaterialDataBase } from "../Common/VO/RuneDataBase";
import { CarDataBase } from "../Common/VO/CarDataBase";
import { VisitorDataBase } from "../Common/VO/VisitorDataBase";
import { FoodMaterialVo } from "../Modules/Cooking/Model/VO/FoodMaterialVo";
import { Mission } from "../Common/VO/Mission";
import OnHook from "../Common/VO/OnHook";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { GameCommand } from "../Events/GameCommand";
import { TreasureVo } from "../Common/VO/TreasureVo";
import { EquipDataBase } from "../Common/VO/EquipDataBase";
import { EquipmentTable } from "../Common/Tables/EquipmentTable";
import { NetWorkManager } from "../NetWork/NetWorkManager";
import { RoleTable } from "../Common/Tables/BaseRoleTable";
import { RoleLevelTable } from "../Common/Tables/RoleLevelTable";
import { RoleLevelCostTable } from "../Common/Tables/RoleLevelCostTable";
import { RoleAdvanceCostTable } from "../Common/Tables/RoleAdvanceCostTable";
import { MenuTable } from "../Common/Tables/MenuTable";
import { PropTable } from "../Common/Tables/PropTable";
import { MaterialTable } from "../Common/Tables/MaterialTable";
import { VisitorTable } from "../Common/Tables/VisitorTable";
import { FoodMaterialTable } from "../Common/Tables/FoodMaterialTable";
import { MissionTable } from "../Common/Tables/MissionTable";
import { TreasureTable } from "../Common/Tables/TreasureTable";
import { OnHookTable } from "../Common/Tables/OnHookTable";
import { GlobalVarTable } from "../Common/Tables/GlobalVarTable";
import { LevelTable } from "../Common/Tables/LevelTable";
import { SkillTable } from "../Common/Tables/SkillTable";
import { CarTable } from "../Common/Tables/CarTable";
import { ITable } from "../Common/Tables/ITable";
import Game from "../Game";
import { HttpRequest } from "../NetWork/HttpRequest";
import { RequestType } from "../NetWork/NetDefine";


/**
 * 数据加载类
 * 从服务器加载表，读取表数据（json数据）
 * 获取数据DataManager.getInstance().getDataWithName(TableName.Character);
 */
export class DataManager
{
    private static instance;

    private configData: Map<string, string> = new Map();
    private configTableName: string[] = [];

    private tableRoleMap: Map<number, PresonDataBase> = new Map();
    public get TableRoleMap(): Map<number, PresonDataBase>
    {
        return this.tableRoleMap;
    }
    public baseRoleMap: Map<number, PresonDataBase> = new Map();

    private upgradeAttrMap: Map<number, UpgradeAttributeVo> = new Map();
    /** 
     * 人物升级属性数据
     * @param key:这里的key是升级属性方案+阶级+等级连接而成的ID
     */
    public get UpgradeAttrMap(): Map<number, UpgradeAttributeVo>
    {
        return this.upgradeAttrMap;
    }

    private upgradeCostMap: Map<number, UpgradeCostVo> = new Map();
    /**
     *  人物升级消耗表数据 
     * @param key:这里的key是升级消耗方案+阶级+等级连接而成的ID
    */
    public get UpgradeCostMap(): Map<number, UpgradeCostVo>
    {
        return this.upgradeCostMap;
    }

    private upgradeAdvanceMap: Map<number, RoleAdvanceVo> = new Map();
    /**
     * 人物升阶消耗表
     * @param key：这里的key是升阶消耗方案+阶级连接而成的ID
     */
    public get UpgradeAdvanceMap(): Map<number, RoleAdvanceVo>
    {
        return this.upgradeAdvanceMap;
    }
    /** 菜谱 map */
    private tableMenuMap: Map<number, CookMenuVo> = new Map();
    /** 获取菜谱vo map */
    public get TableMenuMap(): Map<number, CookMenuVo>
    {
        return this.tableMenuMap;
    }
    public baseMenuMap: Map<number, CookMenuVo> = new Map();

    private propVoMap: Map<number, PropVo> = new Map();
    /** 获取道具VO Map 映射ID->PropVo */
    public get PropVoMap(): Map<number, PropVo>
    {
        return this.propVoMap;
    }
    public basePropVoMap: Map<number, PropVo> = new Map();

    /**根据前置id获取当前关卡数据 */
    private levelMap: Map<number, LevelDataBase> = new Map();
    /**根据前置id获取当前关卡数据 */
    public get levelTableMap(): Map<number, LevelDataBase>
    {
        return this.levelMap;
    }
    /**全局变量值 */
    private GlobalVarMap: Map<number, GlobalVarBase> = new Map();
    /**获取全局变量值 */
    public get GlobaVar(): Map<number, GlobalVarBase>
    {
        return this.GlobalVarMap;
    }

    private SkillMap: Map<number, SkillDataBase> = new Map();
    /**技能表 ID->技能数据 */
    public get SkillVarMap(): Map<number, SkillDataBase>
    {
        return this.SkillMap;
    }

    /** 材料数据 */
    private materialMap: Map<number, MaterialDataBase> = new Map();
    /** 材料数据 */
    public get MaterialMap(): Map<number, MaterialDataBase>
    {
        return this.materialMap;
    }

    /** 车数据 */
    private carMap: Map<number, CarDataBase> = new Map();
    /** 车数据 */
    public get CarMap(): Map<number, CarDataBase>
    {
        return this.carMap;
    }
    /** 挂机表数据 */
    private OnHookMap: Map<number, OnHook> = new Map();
    /** 挂机表数据 */
    public get OnhookMap(): Map<number, OnHook>
    {
        return this.OnHookMap;
    }

    /** 食材数据 */
    private foodMaterialMap: Map<number, FoodMaterialVo> = new Map();
    /** 食材数据 */
    public get FoodMaterialMap(): Map<number, FoodMaterialVo>
    {
        return this.foodMaterialMap;
    }
    public baseFoodMaterialMap:Map<number,FoodMaterialVo>=new Map();

    /** 访客数据 */
    private visitorMap: Map<number, VisitorDataBase> = new Map();
    /** 访客数据 */
    public get VisitorMap(): Map<number, VisitorDataBase>
    {
        return this.visitorMap;
    }
    /** 任务数据 */
    private missionMap: Map<number, Mission> = new Map();
    public get MissionMap(): Map<number, Mission>
    {
        return this.missionMap;
    }

    private treasureMap: Map<number, TreasureVo> = new Map();
    public get TreasureMap(): Map<number, TreasureVo>
    {
        return this.treasureMap;
    }

    private equipTableMap: Map<number, EquipDataBase> = new Map();
    public get EquipTableMap(): Map<number, EquipDataBase>
    {
        return this.equipTableMap;
    }


    public isDone: boolean = false;
    private iTable: ITable = null;

    private constructor()
    {


    }

    public static getInstance(): DataManager
    {
        if (!DataManager.instance)
        {
            DataManager.instance = new DataManager();
        }
        return DataManager.instance;
    }

    /**
     * 游戏开始时加载所需要的数据表
     */
    init()
    {
        this.isDone = false;
        this.configTableName.push(TableName.Role);
        this.configTableName.push(TableName.Skill);
        this.configTableName.push(TableName.CharacterLevelAttribute);
        this.configTableName.push(TableName.CharacterProgression);
        this.configTableName.push(TableName.CharacterUpgradeConsumption);
        this.configTableName.push(TableName.CookMenu);
        this.configTableName.push(TableName.GlobalVar);
        this.configTableName.push(TableName.Level);
        this.configTableName.push(TableName.Prop);
        this.configTableName.push(TableName.Material);
        this.configTableName.push(TableName.Car);
        this.configTableName.push(TableName.Visitor);
        this.configTableName.push(TableName.FoodMaterial);
        this.configTableName.push(TableName.OnHook);
        this.configTableName.push(TableName.Mission);
        this.configTableName.push(TableName.TreasureBox);
        this.configTableName.push(TableName.Equipment);

        console.log('load config: platform:', cc.sys.platform);
        let root: string = GlobalPath.SERVER_PATH + 'data/';
        for (let i = 0; i < this.configTableName.length; i++)
        {
            let url = root + this.configTableName[i] + '';
            url = 'datas/baseTable/' + this.configTableName[i];
            this.readJsonWithLocal(this.configTableName[i], url);
            /* if(NetWorkManager.getInstance().IsConnect)
            {
                url = root + this.configTableName[i] + '.json';
                this.readJsonWithHttp(this.configTableName[i],url);
            }
            else
            {
                url='datas/'+this.configTableName[i]+'.json';
                this.readJsonWithLocal(this.configTableName[i],url);
            } */

        }
    }

    index: number = 0;
    readJsonWithHttp(_tableName: string, _url: string)
    {
        var self = this;
        JsonHelper.ReadJsonWithHttp(_url, function (str: string)
        {
            self.index++;
            self.configData.set(_tableName, str);
            if (self.index == self.configTableName.length) self.loadComplete();
        });
    }

    readJsonWithLocal(_tableName: string, _url: string)
    {
        var self = this;
        JsonHelper.ReadJson(_url, function (str: string)
        {
            self.index++;
            self.configData.set(_tableName, str);
            if (self.index == self.configTableName.length) self.loadComplete();
        });
    }

    /**
     * 数据全部读取完毕的操作
     */
    private loadComplete()
    {
        Log.Info('------------表数据加载完成----------');
        this.isDone = true;
        this.parseGlobalVarTable();
        this.parseBaseRoleVo();
        this.parseMenuVo();
        this.parsePropVo();
        this.parseRoleLevelAttribute();
        this.parseRoleUpgradeCost();
        this.parseAdvanceCost();
        this.parseLevelTable();
        this.parseEquipTable();
        this.ParseSkillCost();
        this.ParseRune();
        this.ParseCar();
        this.ParseVisitor();
        this.ParseFoodMaterial();
        this.ParseMission();
        this.ParseTreasure();


        //this.updateRoleData();
        //this.updateMenuData();
        //this.updateBaseProp();
        //this.updateFoodMaterial();
        //this.updateMaterial();
        this.parseOnHook();

        Facade.getInstance().sendNotification(GameCommand.DATA_TABLE_COMPLETE);
        //Log.mapValsWithTable(this.PropVoMap);
    }

    //#region 解析表数据 

    /**解析挂机表 */
    private parseOnHook()
    {
        this.iTable = new OnHookTable();
        this.OnHookMap = this.iTable.parse(this.getDataWithName(TableName.OnHook));
    }
    /**
    * 根据表名获取相应表数据
    * @param _tableName 表名字，可通过TableName类去得到表名传入到这里获取数据
    */
    getDataWithName(_tableName: string): string
    {
        if (!this.isDone) Log.Error('the table is not load complete');
        let str: string = this.configData.get(_tableName);
        if (str == null)
        {
            Log.Error('the table is null');
            return null;
        }
        return str;
    }

    /**
     * 解析人物基本表
     */
    private parseBaseRoleVo()
    {
        this.iTable = new RoleTable();
        this.tableRoleMap = this.iTable.parse(this.getDataWithName(TableName.Role));
    }

    /**解析全局变量表 */
    private parseGlobalVarTable()
    {
        this.iTable = new GlobalVarTable();
        this.GlobalVarMap = this.iTable.parse(this.getDataWithName(TableName.GlobalVar));
    }
    /**
     * 解析人物关卡表
     */
    private parseLevelTable()
    {
        this.iTable = new LevelTable();
        this.levelMap = this.iTable.parse(this.getDataWithName(TableName.Level));
    }


    /**
     * 解析菜谱表
     */
    private parseMenuVo()
    {
        this.iTable = new MenuTable();
        this.tableMenuMap = this.iTable.parse(this.getDataWithName(TableName.CookMenu));
    }

    /**
     * 解析道具表
     */
    private parsePropVo()
    {
        this.iTable = new PropTable();
        this.propVoMap = this.iTable.parse(this.getDataWithName(TableName.Prop));
    }

    /**
     * 解析人物升级属性表
     */
    private parseRoleLevelAttribute()
    {
        this.iTable = new RoleLevelTable();
        this.upgradeAttrMap = this.iTable.parse(this.getDataWithName(TableName.CharacterLevelAttribute));
    }

    /**
     * 解析人物升级消耗表
     */
    private parseRoleUpgradeCost()
    {
        this.iTable = new RoleLevelCostTable();
        this.upgradeCostMap = this.iTable.parse(this.getDataWithName(TableName.CharacterUpgradeConsumption));
    }

    private parseEquipTable()
    {
        this.iTable = new EquipmentTable();
        this.equipTableMap = this.iTable.parse(this.getDataWithName(TableName.Equipment));

    }

    /**
     * 解析人物升阶表
     */
    private parseAdvanceCost()
    {
        this.iTable = new RoleAdvanceCostTable();
        this.upgradeAdvanceMap = this.iTable.parse(this.getDataWithName(TableName.CharacterProgression));
    }

    /**解析技能表 */
    private ParseSkillCost()
    {
        this.iTable = new SkillTable();
        this.SkillMap = this.iTable.parse(this.getDataWithName(TableName.Skill));
    }

    private ParseRune()
    {
        this.iTable = new MaterialTable();
        this.materialMap = this.iTable.parse(this.getDataWithName(TableName.Material));
    }

    private ParseCar()
    {
        this.iTable = new CarTable();
        this.carMap = this.iTable.parse(this.getDataWithName(TableName.Car));
    }

    private ParseVisitor()
    {
        this.iTable = new VisitorTable();
        this.visitorMap = this.iTable.parse(this.getDataWithName(TableName.Visitor));
    }

    private ParseFoodMaterial()
    {
        this.iTable = new FoodMaterialTable();
        this.foodMaterialMap = this.iTable.parse(this.getDataWithName(TableName.FoodMaterial));
    }

    private ParseMission()
    {
        this.iTable = new MissionTable();
        this.missionMap = this.iTable.parse(this.getDataWithName(TableName.Mission));
    }

    private ParseTreasure()
    {
        this.iTable = new TreasureTable();
        this.treasureMap = this.iTable.parse(this.getDataWithName(TableName.TreasureBox));
        this.treasureMap.forEach((_treasure, _id) =>
        {
            _treasure._TreasureType = this.PropVoMap.get(_treasure._PropID)._Type;
            if (_treasure._TreasureType == 6) _treasure._Icon = this.TableRoleMap.get(_treasure._PropID)._ResourceName;
            else _treasure._Icon = this.PropVoMap.get(_treasure._PropID)._ResourceName;
        });

    }


    //#endregion

    public updateRoleData()
    {
        let role: PresonDataBase = new PresonDataBase();
        let roleOriginData: string[] = this.GlobalVarMap.get(2)._Value.split(',');
        for (let i = 0; i < roleOriginData.length; i++)
        {
            const element = roleOriginData[i];
            if (GameStorage.getItemJson(element) != null)
            {
                role = Object.assign(new PresonDataBase(), GameStorage.getItemJson(element));
                this.TableRoleMap.set(Number(element), role);
            }
            else
            {
                GameStorage.setItemJson(element, this.tableRoleMap.get(Number(element)));
                role = this.tableRoleMap.get(Number(element));
            }
        }
        this.TableRoleMap.forEach((_role, _id) =>
        {
            if (GameStorage.getItemJson(_id.toString()) == 0) GameStorage.remove(_id.toString());
            if (GameStorage.getItemJson(_id.toString()) != null && GameStorage.getItemJson(_id.toString()) != 0)
            {
                role = Object.assign(new PresonDataBase(), GameStorage.getItemJson(_id.toString()));
                if (GameStorage.getItemJson(_id.toString())._Equip != null) role._Equip = this.EquipTableMap.get(Number(GameStorage.getItemJson(_id.toString())._Equip._ID));
                //role.initIncrementMap();
                //role.initEquipAttr();
                this.baseRoleMap.set(_id, role);
            }
        });
    }

    public updateMenuData()
    {
        if (Game.Instance.isConnectServer)
        {
        }
        else
        {
            //从全局变量表里获取初始菜单
            let menuOriginData: string[] = this.GlobalVarMap.get(3)._Value.split(',');
            for (let i = 0; i < menuOriginData.length; i++)
            {
                const element = menuOriginData[i];
                GameStorage.setItem(element, 1);
            }

            let _map: Map<number, number> = GameStorage.getAllTypeStage(PropTypes.Menu);
            _map.forEach((_num, _id) =>
            {
                this.baseMenuMap.set(_id, this.TableMenuMap.get(_id));
            });
        }

    }

    updateBaseProp()
    {

        if (Game.Instance.isConnectServer)
        {
            this.basePropVoMap.forEach((value, id) =>
            {
                GameStorage.setItem(id.toString(), value._Amount);
                
                if(value._Type==2)
                {
                    this.baseMenuMap.set(id,this.TableMenuMap.get(id));
                }
                if(value._Type==3)
                {
                    this.baseFoodMaterialMap.set(id,this.FoodMaterialMap.get(id));
                }
            });
        }
        /* this.basePropVoMap=this.PropVoMap;
        this.basePropVoMap.forEach((value,id)=>{
            value._Amount=1000;
            GameStorage.setItem(id.toString(), value._Amount);
        }); */
    }

    public updateFoodMaterial()
    {
        if (GameStorage.getAllTypeStage(PropTypes.Food).size == 0)
        {
            this.PropVoMap.forEach((prop, id) =>
            {

                if (prop._Type == PropTypes.Food)
                {
                    GameStorage.setItem(id.toString(), 1000);
                    prop._Amount = 1000;
                }
            });
        }
        else
        {
            this.PropVoMap.forEach((prop, id) =>
            {
                if (prop._Type == PropTypes.Food)
                {
                    prop._Amount = GameStorage.getItem(id.toString());
                }

            });
        }
    }

    public updateMaterial()
    {
        if (GameStorage.getAllTypeStage(PropTypes.Materials).size == 0)
        {
            this.PropVoMap.forEach((prop, id) =>
            {
                if (prop._Type == PropTypes.Materials)
                {
                    GameStorage.setItem(id.toString(), 1000);
                    prop._Amount = 1000;
                }
            });
        }
        else
        {
            this.PropVoMap.forEach((prop, id) =>
            {
                if (prop._Type == PropTypes.Materials)
                {
                    prop._Amount = GameStorage.getItem(id.toString());
                }
            });
        }
    }

    public updateCookingData(): Map<number, CookingVo>
    {
        //GameStorage.remove(CookingEvent.COOKING_DATA_ID+'0');
        let dict: Map<number, CookingVo> = new Map();
        for (let i = 0; i < 3; i++)
        {
            let obj = GameStorage.getItemJson(CookingEvent.COOKING_DATA_ID + i);
            let temp: CookingVo = new CookingVo(i);
            if (obj != undefined)
            {
                obj = Object.assign(new CookingVo(i), obj);
                temp.ID = obj.ID;
                temp.role = Object.assign(new PresonDataBase(), obj.role);
                for (let i = 0; i < obj.menu.length; i++)
                {
                    if (obj.menu[i] != null || obj.menu[i] != undefined) 
                    {
                        temp.menu.push(this.tableMenuMap.get(obj.menu[i]._ID));
                        temp.MenuList.push(this.tableMenuMap.get(obj.menu[i]._ID));
                    }
                }
                temp.menuNum = obj.menuNum;
                for (let i = 0; i < obj.menuNum.length; i++)
                {
                    temp.setMenuAmount(i, Number(obj.menuNum[i]));
                }
                //console.dir(Object.assign(new CookingVo(),obj));
                dict.set(i, temp);
                //return GameStorage.getItemJson(CookingEvent.COOKING_DATA_ID+i);
            }
        }
        //console.dir(dict);
        return dict;
    }

    /**
     * 该用户增加新人物
     * 来源1：宝箱抽取
     * @param _id 人物ID
     */
    addRole(_id: number)
    {
        let _role: PresonDataBase = this.TableRoleMap.get(_id);
        GameStorage.setItemJson(_id.toString(), _role);
        this.baseRoleMap.set(_id, _role);
        HttpRequest.getInstance().requestPost(RequestType.character_addcharacter,null,'{"characterId":'+_id+'}');
    }

    /**
     * 改变人物属性值后，把本地人物数据更新
     * @param _id 人物ID
     * @param _role 人物类
     */
    changeRoleAttr(_id: number, _role: PresonDataBase)
    {
        //此处没加ID判断
        GameStorage.setItemJson(_id.toString(), _role);

    }

    /**
     * 增加该用户新菜谱
     * 来源1：宝箱抽取
     * @param _id 菜谱ID
     */
    addMenu(_id: number)
    {
        GameStorage.setItem(_id.toString(), 1);
        this.baseMenuMap.set(_id, this.TableMenuMap.get(_id));
    }

    /**
     * 增加道具的数量
     * @param _id 道具ID
     * @param addNum 增加的数量
     */
    addPropNum(_id: number, addNum: number)
    {
        if (this.PropVoMap.get(_id)._Type == 2 || this.PropVoMap.get(_id)._Type == 6) return;
        let origin: number = 0;
        if (GameStorage.getItem(_id.toString()) != null) origin = Number(GameStorage.getItem(_id.toString()));

        origin += Number(addNum);
        this.PropVoMap.get(_id)._Amount = Number(origin);
        GameStorage.setItem(_id.toString(), origin);
    }

    /**
     * 保存道具id 的总数量
     * @param _id 道具ID
     * @param _amount 总数，会抹去之前点记录。保存现在的
     */
    savePropNum(_id: number, _amount: number)
    {
        //num=this.PropVoMap.get(_id)._Amount;
        _amount = MathTool.Abs(_amount);
        GameStorage.setItem(_id.toString(), _amount);
        this.PropVoMap.get(_id)._Amount = _amount;
        // Log.Info('prop id',_id,',name:',this.PropVoMap.get(_id)._Name,',num:',GameStorage.getItem(_id.toString()));
    }

    saveCookingData()
    {

    }

    /**设置指定ID关卡信息 */
    saveLevelData(id: string, value: any)
    {
        GameStorage.setItem(TableName.Level + id, value);
    }

    /**获取指定ID关卡信息 */
    getLevelData(id: string): any
    {
        return GameStorage.getItem(TableName.Level + id);
    }
    /**设置或者获取挂机表数据 */
    saveGetOnHookData(id: number, value: any = null): any
    {
        if (value == null)
        {
            return GameStorage.getItem(TableName.OnHook + id.toString());
        } else
        {
            return GameStorage.setItem(TableName.OnHook + id.toString(), value);
        }
    }

    changRoleStatus(id: number, _status: FigureStatus)
    {
        this.baseRoleMap.get(id)._NowState = _status;
        this.baseRoleMap.get(id)._CurrMission = _status;
        let role: PresonDataBase = Object.assign(new PresonDataBase(), GameStorage.getItemJson(id.toString()));
        role._NowState = _status;
        role._CurrMission = _status;
        GameStorage.setItemJson(id.toString(), role);
    }

    /**
   * 关卡表条件id返回对应的图标名称
   * @param key 条件值
   */
    GetConditionValue(key: number, value: number): string
    {
        switch (key)
        {
            case 0:
                return '';
            case 1:
                return 'power';
            case 2:
                return 'agility';
            case 3:
                return 'physicalPower';
            case 4:
                return 'will';
            case 5:
                return 'people';
            case 6:
                switch (value)
                {
                    case 1:
                        return ProfessionEnum.Taster;
                    case 2:
                        return ProfessionEnum.Hunter;
                    case 3:
                        return ProfessionEnum.Explorer;
                    case 4:
                        return ProfessionEnum.Spencer;
                }
                break;
        }
    }

}

