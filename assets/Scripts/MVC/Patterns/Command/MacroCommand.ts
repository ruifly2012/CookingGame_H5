import { ICommand } from "../../Interfaces/ICommand";
import { INotification } from "../../Interfaces/INotification";
import { INotifier } from "../../Interfaces/INotifier";
import { Notifier } from "../Observer/Notifier";

/**
	 * 执行其他ICommand的基本ICommand实现。
	 *
	 * 宏命令维护一个名为子命令的ICommand构造函数引用列表。
	 *
	 * 当执行被调用时，宏命令实例化并调用在它的每个子命令上执行。每个子命令都将被传递到传递给宏命令的执行方法的原始INotification的引用。
	 *
	 * 与SimpleCommand不同，您的子类不应重写execute，
	 * 但是，应该重写initializeMacroCommand方法，调用
	 * 为每个要执行的子命令添加子命令一次。
	 */
export class MacroCommand
    extends Notifier
    implements ICommand, INotifier {
    /**
     * 一个icommand数组。
     *
     * @protected
     */
    subCommands: Function[] = null;

    /**
     * 构建一个宏命令实例。
     *
     * 您不应该需要在子类中定义构造函数，而应该重写initializeMacroCommand方法。
     *
     * 如果子类确实定义了构造函数，请确保调用super()。
     */
    constructor() {
        super();

        this.subCommands = [];
        this.initializeMacroCommand();
    }

    /**
     * 初始化宏命令。
     * 
     * 在子类中，使用ICommand类引用重写此方法，以初始化宏命令的子命令列表，如下所示:
     * 
     * <pre>
     *		// 初始化MyMacroCommand
     *		initializeMacroCommand():void
     *		{
     *			this.addSubCommand( FirstCommand );
     *			this.addSubCommand( SecondCommand );
     *			this.addSubCommand( ThirdCommand );
     *		}
     * </pre>
     * 
     * 注意，子命令可以是任何ICommand实现程序，因此宏命令或simplecom曼德命令都是可接受的。
     *
     * @protected
     */
    initializeMacroCommand(): void {

    }

    /**
     * 向子命令列表中添加一个条目。
     * 
     * 子命令将按先进先出(FIFO)顺序调用。
     * 
     * @param commandClassRef
     * 对ICommand构造函数的引用。
     *
     * @protected
     */
    addSubCommand(commandClassRef: Function): void {
        this.subCommands.push(commandClassRef);
    }

    /** 
     * 执行这个宏命令的子命令。
     *
     * 子命令将按先进先出(FIFO)顺序调用。
     * 
     * @param notification
     * 要传递给列表的每个子命令的INotification对象。
     *
     * @final
     */
    execute(notification: INotification): void {
        var subCommands: Function[] = this.subCommands.slice(0);
        var len: number = this.subCommands.length;
        for (var i: number = 0; i < len; i++) {
            /*
             * 在这里输入any而不是Function(如果设置为Function则不会编译，因为现在编译器认为该函数是不可更新的，并且没有类类型)
             */
            var commandClassRef: any = subCommands[i];
            var commandInstance: ICommand = <ICommand> /*</>*/ new commandClassRef();
            commandInstance.execute(notification);
        }

        this.subCommands.splice(0);
    }
}