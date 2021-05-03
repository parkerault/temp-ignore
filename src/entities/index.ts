import { ActionTypes } from "config/types";
import { OverviewActions } from "./Overview";
import { SymbolActions } from "./Symbol";

export type EntityActions =
  | ActionTypes<typeof SymbolActions>
  | ActionTypes<typeof OverviewActions>
