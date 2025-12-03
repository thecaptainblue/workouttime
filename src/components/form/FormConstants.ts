import { OverlayState, StateOpacityArray } from "../OverlayView";

let formButtonOverlayOpacitiesTmp: StateOpacityArray = [];
formButtonOverlayOpacitiesTmp[OverlayState.Activated] = 0.15;
export const FormButtonOverlayOpacities: StateOpacityArray = formButtonOverlayOpacitiesTmp;