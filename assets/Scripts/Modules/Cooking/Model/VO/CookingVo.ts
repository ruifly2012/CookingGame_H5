import { RoleVo } from "../../../Role/Model/RoleVO";
import { CookMenuVo } from "./CookMenuVo";
import PresonDataBase from "../../../../Common/VO/PresonDataBase";
import { MenuProxy } from "../MenuProxy";
import { Facade } from "../../../../MVC/Patterns/Facade/Facade";
import { CookingEvent } from "../../../../Events/CookingEvent";
import { MathTool } from "../../../../Tools/MathTool";


export class CookingVo {
    /**  */
    public ID: number = 0;
    public role: PresonDataBase;
    /** 根据阶级来觉得人物菜品数量，1阶一个*/
    public menu: Array<CookMenuVo> = new Array();

    /** 每个菜的制作数量 */
    public menuNum: any = [0, 0, 0];
    /** 菜的总数量 */
    allMenuAmount:number=0;
    
    private acutalMenuList:Array<CookMenuVo>=new Array();
    public set MenuList(list:Array<CookMenuVo>)
    {
        this.acutalMenuList=list;
    }
    /** 实际做菜列表，数组不为空，menu数组可能存在空元素 */
    public get MenuList():Array<CookMenuVo>
    {
        return this.acutalMenuList;
    }
    price:number=0;
    time:number=0;

    public constructor(_id:number) {
        this.ID=_id;
    }

    setRoleMenu(role:PresonDataBase,_menu:CookMenuVo,price:number,time:number,amount:number)
    {
        this.role=role;
        this.menu.push(_menu);
        this.MenuList.push(_menu);
        this.price=price;
        this.time=time;
        this.allMenuAmount+=amount;

    }

    /**
     * 上架人物
     * @param _role 人物
     */
    public setRole(_role: PresonDataBase) {
        if(this.role!=null)
        {
            this.clearRole();
        }
        this.role = _role;
        this.menu=new Array(this.role._AdvanceLevel);
    }


    /**
     * 上架菜
     * @param _location 菜的位置
     * @param _menu 要上的菜
     */
    public setMenu(_location: number, _menu: CookMenuVo) {
        if (this.menu[_location] != null) {
            this.clearTheMenu(_location);
        }
        //console.log('上架菜',_menu._Name);
        this.acutalMenuList.push(_menu);
        this.menu[_location] = _menu;
    }

    /**
     * 设置菜的数量
     * @param _location 菜的位置
     * @param _amount 菜的数量
     */
    public setMenuAmount(_location:number,_amount:number){
        if (this.menu[_location] == null) {
            console.info('the ' + _location + ' menu is null ,' + this.menu[_location]);
            return null;
        }
        //if(this.menu[_location]._Amount!=0) this.allMenuAmount-=this.menu[_location]._Amount;
        this.allMenuAmount=MathTool.Abs(this.allMenuAmount);
        //this.allMenuAmount+=Number(_amount);
        this.menu[_location]._Amount=Number(_amount);
        this.allMenuAmount=0;
        this.menu.forEach((_menu) => {
            console.log(_menu._Amount);
            this.allMenuAmount += _menu._Amount;
        });
        console.log('上架: '+this.allMenuAmount);
    }

    /**
     * 获取人物
     */
    getRole(): PresonDataBase {
        if (this.role == null || this.role == undefined) {
            console.info('the role is ' + this.role);
            return null;
        }
        return this.role;
    }

    /** 获取人物ID */
    getRoleID():number
    {
        if (this.role == null || this.role == undefined) {
            console.info('the role is ' + this.role);
            return null;
        }
        return this.role._ID;
    }

    /**
     * 获取该人物所有要做的菜
     */
    getMenuArr(): CookMenuVo[] {
        let tempArr: Array<CookMenuVo> = new Array();
        this.menu.forEach((_menu) => {
            if (_menu != null) tempArr.push(_menu);
        });
        return tempArr;
    }

    /**
     * 获取指定位置的菜
     * @param _location 菜的位置，0，1，2
     */
    getLocationMenu(_location: number): CookMenuVo {
        if (this.menu[_location] == null) {
            console.info('the ' + _location + ' menu is null ,' + this.menu[_location]);
            return null;
        }
        return this.menu[_location];
    }

    /**
     * 获取指定菜的数量
     * @param _location 菜的位置，0，1，2
     */
    getLocationMenuAmount(_location): number {
        if (this.menu[_location] == null) {
            console.info('the ' + _location + ' menu is null ,' + this.menu[_location]);
            return null;
        }
        return this.menu[_location]._Amount;
    }

    /**
     * 获取所有菜的总数量
     */
    getMenusAmount(): number {
        let _amount: number = 0;
        this.menu.forEach((_menu) => {
            console.log(_menu._Amount);
            if (_menu != null) _amount += _menu._Amount;
        });
        return _amount;
    }

    calculateManage()
    {
        this.menu.forEach((_menu,_key)=>{
            if(_menu==null || _menu._Amount==0) return ;
            _menu.menuGrade(this.role.CookingSkillVals);
            
        });
    }

    /**
     * 清除人物
     */
    public clearRole() {
        //console.info('清除人物', this.role._Name);
        this.clearAllMenu();
        let id:number=this.role._ID;
        this.role = null;
        //这个脚本要放在这里吗 
        Facade.getInstance().sendNotification(CookingEvent.SOLDOUT_ROLE,id);
    }

    /**
     * 清除指定位置的菜
     * @param _location 菜的位置
     */
    public clearTheMenu(_location: number) {
        if (this.menu[_location] == null) {
            console.info('the ' + _location + ' menu is null ,' + this.menu[_location]);
            return ;
        }
        
        //这个脚本要放在这里吗 
        this.resetFoodMaterial(this.menu[_location]);
        let id:number=this.menu[_location]._ID;
        this.allMenuAmount-=this.menu[_location]._Amount;
        this.acutalMenuList.splice(this.acutalMenuList.indexOf(this.menu[_location]),1);
        this.menu[_location] = null;
        console.log('清除指定位置的菜'+this.allMenuAmount);
        Facade.getInstance().sendNotification(CookingEvent.SOlDOUT_MENU,id);

    }

    /**
     * 清除这个人物所有的菜
     */
    public clearAllMenu() {
        for (let i = 0; i < this.menu.length; i++) {
            this.clearTheMenu(i);
        }
        this.menu = [];
        this.menu = new Array(this.role._AdvanceLevel);
    }

    /**
     * 下架菜的时候，食材数量要增加回去
     * @param _menu 菜
     */
    resetFoodMaterial(_menu: CookMenuVo) {
        let proxy: MenuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        //console.log('下架菜的时候，食材数量要增加回去'+_menu._Name);
        _menu._FoodMaterialMap.forEach((_materialVal, _id) => {
            proxy.getFoodMaterial(_id).Amount += _menu._Amount * _materialVal;
        });
    }



}
