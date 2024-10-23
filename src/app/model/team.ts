import {Manager} from "./manager";
import {Player} from "./player";

export interface Team {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  manager?: any;
  players?: any[];
}
