import { Log } from "./Log";


/**
 * @example
 * ObjectTool.getInstance().createNode(name,sprite,parentNode);
 * ObjectTool.getInstance().InstanceWithPrefab(name,prefab,parent);
 */
export class ObjectTool {

    private constructor(){}

  

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }

    

    /**
     * 创建空节点
     * @param _name 节点名字
     * @param _parent 父节点
     */
    public static createNode(_name,_parent,_pos:cc.Vec2=new cc.Vec2(0,0)):cc.Node
    {
        var _node=new cc.Node(_name);
        if(_parent!=null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        return _node;
    }
    
    /**
     * 复制对象节点，指定其父对象
     * @param _name 名字
     * @param _node 复制的节点
     * @param _parent 父对象
     * @param _pos 位置
     */
    public static createNodeWithParent(_name:string,_node:cc.Node,_parent:cc.Node,_pos:cc.Vec2=new cc.Vec2(0,0)):cc.Node
    {
        var _node=cc.instantiate(_node);
        _node.name=_name;
        if(_parent!=null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        _node.setPosition(_pos);
        return _node;
    }

    /**
     * 创建精灵节点，设置图片
     * @param _name 实例化的命名
     * @param _sprite 图片资源spriteFrame object
     * @param _parent 要挂载到的父节点
     */
    public static createSpriteNode(_name:string,_sprite:cc.SpriteFrame,_parent?:cc.Node):cc.Node
    {
        var _node=new cc.Node(_name);
        var sp=_node.addComponent(cc.Sprite);
        sp.spriteFrame=_sprite;
        if(_parent!=null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        return _node
    }

    /**
     * 实例化预制体节点对象
     * @param _name 实例化的命名
     * @param _prefab 实例化的预制体
     * @param _parent(可选) 要挂载到的父节点
     * @param _pos(可选) 位置
     */
    public static instanceWithPrefab(_name:string,_prefab:cc.Prefab,_parent?:cc.Node,_pos:cc.Vec2=new cc.Vec2(0,0)):cc.Node
    {
        var _node=cc.instantiate(_prefab);
        if(_node==null) console.error('the _prefab '+_name+',_prefab name:'+_prefab+' is null!!!');
        _node.name=_name;
        if(_parent!=null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        _node.setPosition(_pos);
        return _node;
    }

    /**
     * 全局查找节点
     * 从Canvas开始
     * @param _url 路径不包含'Canvas/'
     */
    public static GlobalFindObj(_url:string):cc.Node
    {
        let _node:cc.Node=cc.find('Canvas/'+_url);
        if(_node==null) Log.Error('！！！the find node is null------------------------');
        return _node;
    }

    /**
     * 根据父节点向下查找节点
     * @param _url 节点路径
     * @param _parent 节点父对象
     * @example 在Panel节点下有a->a1->a2,b->b1,c->c1。要获得a2则传入路径: 'a/a1/a2'
     */
    public static FindObjWithParent(_url:string,_parent:cc.Node):cc.Node {
        let _node:cc.Node=cc.find(_url,_parent);
        if(_node==null) Log.Error('！！！the find '+_url+' node is null------------------------');
        return _node;
    }

    public static GetCanvas():cc.Node
    {
        return cc.find('Canvas');
    }

    public static GetMainCamera():cc.Node
    {
        return cc.find('Canvas/Main Camera');
    }
    
    /**
     * 遍历对象的各个属性及其值
     * @param obj 对象
     */
    public static forEachObject(obj:any)
    {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                console.log('obj key:'+key+',value :'+element);
            }
        }
    }

    // update (dt) {}
}
