
const { ccclass, property } = cc._decorator;
/**
 * 播放音效脚本
 * 脚本挂在全局初始化的物体上
 */
@ccclass
export default class AudioManage extends cc.Component {


    @property([cc.Asset])
    clipArray: Array<cc.AudioClip> = [];

    audioSourceMap: cc.AudioSource;

    public static _instance: AudioManage = null;

    onLoad() {
        AudioManage._instance = this;
        if (this.audioSourceMap == null) {
            this.audioSourceMap = this.node.addComponent(cc.AudioSource)
        }
    }

    Play(num: number) {
        if (num < this.clipArray.length) {
            this.audioSourceMap.clip = this.clipArray[num];
            this.audioSourceMap.play();
        }
    }


}
