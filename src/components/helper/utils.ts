import React from "react";

// Fixes bug with useMemo + generic types:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087#issuecomment-542793243
export const typedMemo: <T>(c: T) => T = React.memo;
// TODO : buna hala gerek var mi belki Typescript surumunu yukselttigim icin gerek kalmamistir.