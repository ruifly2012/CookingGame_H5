
    /**关卡表 */
export default class LevelDataBase {
    /**ID  */
    public _ID: number;
    /**名称 */
    public _Name: string = '';
    /**描述 */
    public _Describe: string = '';
    /**挂机时间*/
    public _HangTime: number;
    /**前置ID  */
    public _FrontID: number;
    /**解锁ID  */
    public _UnlockID: number;
    /**任务条件->条件完成值 */
    public _ConditionMap:Map<number,number>=new Map();
    /**产出 */
    public _Output: string;
    /**构造函数 */
    constructor(){

    }
}
