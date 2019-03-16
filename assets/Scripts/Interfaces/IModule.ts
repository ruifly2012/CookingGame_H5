

export interface IModule 
{
    /**
     * Manager初始化模块
     */
    Init();
    /**
     * Manager开始模块
     */
    Start();
    /**
     * Manager退出模块
     */
    Exit();
}
