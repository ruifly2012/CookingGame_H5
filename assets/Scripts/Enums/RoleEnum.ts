

/**
 * 人物属性
 */
export enum AttributeEnum
{
    /**
     * 敏捷
     */
    Agility='agility',
    /**
     * 厨技
     */
    Cooking='cooking',
    /**
     * 幸运
     */
    Luck='luck',
    /**
     * 力量
     */
    Power='power',
    /**
     * 体力
     */
    PhysicalPower='physicalPower',
    /**
     * 悟性
     */
    Savvy='savvy',
    /**
     * 精力
     */
    Vigor='vigor',
    /**
     * 意志
     */
    Will='will',   
}

/**
 * 人物职业
 */
export enum ProfessionEnum
{
    /**
     * 品尝家
     */
    Taster='taster',
    /**
     * 狩猎者
     */
    Hunter='hunter',
    /**
     * 探险家
     */
    Explorer='explorer',
    /**
     * 料理家
     */
    Spencer='spencer',
}

export enum PropTypes{
    /**货币 */
    Currency=1,
    /**菜谱 */
    Menu=2,
    /**食材 */
    Food=3,
    /**材料 */
    Materials=4,
}

/**人物当前状态的枚举 */
export enum FigureStatus{
    /**空闲 */
    Leisure=0,
    /**在厨房 */
    Cook=1,
    /**在探险 */
    Explore=2,
    /**在挂机 */
    OnHook=3
}

/**任务状态 */
export enum TaskStatus{
    /**未开始 */
    NotStarted='未开始',
    /**进行中 */
    Underway='进行中',
    /**已完成 */
    Done='已完成',
}