export type CharacterConfig = {
 headWidth:number; headHeight:number; helmetWidth:number; helmetHeight:number;
 torsoWidth:number; torsoLength:number;
 leftUpperArm:number; leftForearm:number; leftArmThickness:number; leftHand:number;
 rightUpperArm:number; rightForearm:number; rightArmThickness:number; rightHand:number;
 leftLeg:number; leftLegThickness:number; leftFoot:number;
 rightLeg:number; rightLegThickness:number; rightFoot:number;
};
export type Parameter = keyof CharacterConfig;
export type Point = {x:number;y:number};
export type Preset = {id:string;name:string;config:CharacterConfig};
