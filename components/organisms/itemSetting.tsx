
import { ComponentProps,memo,useReducer,useState } from "react";
import ItemList from "../molecules/itemList";
import ItemSlot from "../molecules/itemSlot";
class slotInfo{
    name:string;
    src:string;
    info:string;
    rarity:string;
    part:string;
    constructor(value,src,info,part){
        this.name=value;
        this.src=src;
        this.info=info;
        this.part=part;
    }
}
class slotParts {
    "손(공격)":slotInfo=null;
    "머리(치명)":slotInfo=null;
    "가슴(체력)":slotInfo=null;
    "허리(회피)":slotInfo=null;
    "다리(방어)":slotInfo=null;
    "발(이동)":slotInfo=null;
    "장신구1":slotInfo=null;
    "장신구2":slotInfo=null;
    "회복킷":slotInfo=null;
    "가속킷":slotInfo=null;
    "공격킷":slotInfo=null;
    "방어킷":slotInfo=null;
    "특수킷":slotInfo=null;
    "목":slotInfo=null;
    "장신구3":slotInfo=null;
    "장신구4":slotInfo=null;  
}
export interface Islot{
    idx:number;
    current:boolean;
    title:string;
    items:slotParts; 
    isMaxmize:boolean;
    isFloat:boolean;
}
const ItemSetting=(props:ComponentProps<any>)=>{
    const onStateChangeEvent=props.onStateChangeEvent??null;
    const defaultSlotParts=new slotParts();
    let defaultSlot:Islot=
    {
        idx:0,
        current:true,
        title:props.name,
        items:defaultSlotParts,
        isMaxmize:false,
        isFloat:false,
    }
    const [slots,setSlots]=useReducer(actionSlot,[defaultSlot]);
    function actionSlot(slots,action){
        let newSlots=Array.from(slots);
        if(action[0]==="CREATE")
            newSlots.push(action[1]);
        if(action[0]==="DELETE")
        {

        }
        if(action[0]==="EQUIP")
        {   
            newSlots=equipItem(newSlots,action[1],action[2],action[3],action[4],action[5])
        }
        if(action[0]==="UNEQUIP"){
            newSlots=unEquipItem(newSlots,action[1])
        }
        if(action[0]==="SELECT")
        {
            newSlots= selectSlot(newSlots,action[1])
        }
        
        return newSlots;
    }    
    function selectSlot(state,item){
        for(const slot of state){
            if(slot.current==true){
                slot.current=false;
                break;
            }   
        }   
        state[item].current=true;
        return state;
    }
    function equipItem(state,value,src,info,rarity,slot){
        let current=null;
      
        for(const currentSlot of state){
            if(currentSlot.current==true){
                current=currentSlot;
            }   
        }
        const newSlotInfo:slotInfo={
            name:value,
            src:src,
            info:info,
            rarity:rarity,
            part:slot,
        }
        current.items[slot]=newSlotInfo;
        return state;
    }
    function unEquipItem(state,slot){ 
        let current=null;
        for(const currentSlot of state){
            if(currentSlot.current==true){
                current=currentSlot;
            }
        }
        current.items[slot]=null;
        return state;
    }
  
    return(
        <div className="itemSetting">
            <div className="subtitle"><h1>{props.name }{"#"+props.index}</h1></div>
            <div className="subtitle"><h2>결과</h2></div>
            {slots.map(value=>(<ItemSlot key={value} slot={value} onListEvent={function(slot){
                return setSlots(["UNEQUIP",slot]);
            }} onStateChangeEvent={function(Action,slot){onStateChangeEvent(Action,slot)}}></ItemSlot>))}
            <ItemList key={props.name+props.index} data={props.data} onListEvent={function(value,src,info,rarity,slot){
                return  setSlots(["EQUIP",value,src,info,rarity,slot]);
            }}></ItemList>
        </div>
    )
}
export default memo(ItemSetting)