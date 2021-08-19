import { ComponentProps ,useEffect,useMemo,useState} from "react";
import Name from '../atoms/name';
import Icon from '../atoms/icon';
import ToolTip from './toolTip';
import DivButton from "../atoms/divButton";
import ToolBar from "./toolBar"
export interface ItoolBar{
    title:string;
    buttons:any[];
}
export default function imgBtn(props:ComponentProps<any>){
    const onBtnEvent=props.onBtnEvent??null;
    const onWatchDetail=props.onWatchDetail??null;
    const onUnEquipEvent=props.onUnEquipEvent??null;
    const src=props.code??null;
    const name=props.name;
    const type=props.type;
    const info=props.info;
    const rarity=props.rarity??"커먼";
    const originalSlot=props.slot;
    const ready=originalSlot==="장신구ALL"?true:false;
    const[slot,setSlot]=useState(props.slot);
    const[On,setOn]=useState("OFF");
    
    let mouseFlag=false;
    let mouseInterval=null;
    let startTime=0;
    let currentTime=0;
    const tapTime= 1000;
    
    const toolBarButtons=makeToolBar();
    const toolBarTitle=originalSlot=="장신구ALL"?"슬롯 선택":null;
    const toolBar:ItoolBar=originalSlot=="장신구ALL"?{
        title:toolBarTitle,
        buttons:toolBarButtons,
    }:null;
    const [toolBarTimeOut,setToolBarTimeOut]=useState(null);
   

    function toolBarOn(){
        
        setToolBarTimeOut(clearTimeout(toolBarTimeOut));
        const on=On=="ON"?"OFF":"ON";
        setToolBarTimeOut(setTimeout(()=>{setOn("OFF")},3000));
        return setOn(on);
    }
    function makeToolBar(){
        
        const Buttons=originalSlot==="장신구ALL"?makeButtons():null;
        return Buttons   
    }
    function makeButtons(){
        const Buttons=[]
        for(let i=1;i<5;i++){
            Buttons.push(<DivButton key={name+originalSlot+i} onBtnClick={async function(){makeEquipUnEquip(`장신구${i}`),toolBarOn();} }>{`${i}`}</DivButton>);
        }
        return Buttons;    
    }   
    function mouseCapture(){
        startTime=Date.now();
        if(mouseFlag!=false)
            return;
        mouseFlag=true;  
        mouseInterval= setInterval(()=>howLongMouseTap(),20);       
    } 
    function howLongMouseTap(){
        currentTime=Date.now();
        const howLongTime=currentTime-startTime;
        
        howLongTime>tapTime?longTap():function(){return null};
    }
    function mouseUp(){ 
        if(mouseFlag==false){
            clearInterval(mouseInterval);
        }else{        
            shortTap();
        }    
    }
    function shortTap(){
        return originalSlot=="장신구ALL"?toolBarOn():makeEquipUnEquip();
    }
    function longTap(){
        return seeDetail();
    }
    function makeEquipUnEquip(slot=originalSlot){
        if(slot=="장신구ALL")
            return;
        onBtnEvent?onBtnEvent(name,src,info,rarity,slot,ready):onUnEquipEvent(slot);
        mouseFlag=false;
        startTime=0; 
        return clearInterval(mouseInterval);
    }
    function seeDetail(){
        onWatchDetail?onWatchDetail(name,src,info,rarity,slot):null;
        mouseFlag=false;
        startTime=0; 
        return clearInterval(mouseInterval);  
    }

  
    return(
 
        <ToolTip info={info} type={type} name={name} rarity={rarity} >    
            <div className={type} 
            onClick={function(e){e.preventDefault();} }
            onMouseDown={()=>{mouseCapture()}}
            onMouseUp={(e)=>{e.preventDefault();mouseUp()}}
            onTouchStart={()=>{mouseCapture()}}
            onTouchEnd={(e)=>{e.preventDefault();mouseUp()}}
            onTouchCancelCapture={(e)=>{e.preventDefault(); return;}}
          
            >
            <Icon src={src} alt={name} ></Icon>
            {type!="itemicon"&&<Name name={name} rarity={rarity}></Name>}
            </div> 
            {toolBar&&<ToolBar on={On} title={toolBar.title} buttons={toolBar.buttons}/>
            }
        </ToolTip>
       
    )
}