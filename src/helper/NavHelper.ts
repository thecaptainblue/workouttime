import { NavigationState, PartialState } from "@react-navigation/native";

// TODO : yukseltme ; bunlar 6 icin yazilmisti 7de calismayabilir kontrol edecegim.
type SimpleState = {
    routeName: string;
    type?: string;
}

export type routeIdentity = {
    routeNames: string[];
    type: string
}

export class NavHelper {

    static isThereRoute(state: NavigationState | PartialState<NavigationState>) {
        let result = false
        if (state.routes !== null && state.index != null && state.routes.length > state.index) {
            result = true;
        }
        // console.log('isThereRoute: ', result);
        return result;
    }


    static getSimpleState(state: NavigationState | PartialState<NavigationState>): SimpleState | null {
        let simpleState: SimpleState | null = null;
        if (state !== null && state !== undefined) {
            let routeName = null;
            if (NavHelper.isThereRoute(state)) {
                routeName = state.routes[state.index!].name;

                simpleState = { type: state.type, routeName: routeName };
            }
        }
        return simpleState
    }

    static getCurrentSimpleState(state: NavigationState | PartialState<NavigationState>): SimpleState | null {
        let result: SimpleState | null = null;
        if (this.isThereRoute(state)) {
            const currentRoute = state.routes[state.index!];
            // console.log('getCurrentSimpleState: route: ', currentRoute);
            if (currentRoute.state !== null && currentRoute.state !== undefined) {
                result = this.getCurrentSimpleState(currentRoute.state);
            } else {
                result = this.getSimpleState(state);
            }
        }
        return result;
    }

    static isThereMatch(state: SimpleState | null, routeids: routeIdentity[]) {
        let result = false;
        if (routeids != null && state != null) {
            for (let routeId of routeids) {
                const { routeNames: routeName, type } = routeId;
                if (routeName != null && routeName.includes(state.routeName) && type === state.type) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    /* 
    ayni sayfa farkli navigatorlarla gosterilebiliyor garip bir sekilde.
    acilista ilk navigatorin ismi cikiyor (tab => main)
    sonrasinda o navigatorin icinde navigator varsa onun ismi cikmaya basliyor (stack => home, workoutAddEdit) 
    bunun icin routeIndentityleri olusturdum ki  hem  ilk navigator hem de nested navigator kontrol kontrol edilebilsin
    */
    static isCurrentRoute(state: NavigationState | PartialState<NavigationState>, routeids: routeIdentity[]) {
        let result = false;
        // console.log("isCurrentRoute state: ", state.routes[state.index!]);
        const currentState = this.getCurrentSimpleState(state);
        if (NavHelper.isThereMatch(currentState, routeids)) {
            result = true;
        }
        console.log("isCurrentRoute; route: ", currentState?.routeName);
        return result;
    }
}