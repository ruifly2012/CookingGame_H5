

export class TestScript
{
    

    public constructor(){
//let regColorNum:RegExp=new RegExp('[0-9]','g'); //匹配数字
        //let reg:RegExp=new RegExp('\[[0-9]+\]','g');  //匹配[1],[2],[3]
        //let regColor:RegExp=new RegExp('\[[0-9]+\][0-9\u4e00-\u9fa5]*','g'); //匹配[1]+中文
        let desc:string='累计制作[1]单价[-]30以上的[2]良[-]品菜15份';
        
        let regColor:RegExp=new RegExp('[0-9\u4e00-\u9fa5]+','g');
        
       // let arr=desc.match(reg);
        let colorTxtNum=desc.match(regColor);
        //let n:number=Number(colorTxtNum[0]);
        //if(isNaN(n)) console.log('is number========'+n);
        //console.dir(colorTxtNum);
        //HttpRequest.getInstance().requestHttpData(NetDefine.TEST_INFO_IP,HttpRequest.POST,34);
    }
}
