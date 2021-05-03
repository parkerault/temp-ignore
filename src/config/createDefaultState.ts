import { RouterState } from "connected-react-router";
import { OverviewDefaultState } from "entities/Overview";
import { SymbolDefaultState } from "entities/Symbol";
import { SymbolSearchDefaultState } from "features/SymbolSearch";
import {} from "history";

export default function createDefaultState() {
  return {
    router: (undefined as unknown) as RouterState<never>,
    overviews: OverviewDefaultState,
    symbols: SymbolDefaultState,
    views: {
      symbolSearch: SymbolSearchDefaultState,
    },
  };
}
