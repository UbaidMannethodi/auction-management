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

export interface TeamStatus {
  availableAmount: number;
  balanceAmount: number;
  selectedPositions: {[key: string]: Player[]};
  PositionToSelect: {[key: string]: Player[]};
}

