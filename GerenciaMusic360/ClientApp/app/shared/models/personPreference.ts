import { IPreference } from "./preference";
import { IPreferenceSubType } from "./preferenceSubType";

export interface IPersonPreference {
    preferenceTypeId: number;
    preferenceTypeName: string;
    preferences?: IPreferenceSubType[]
}