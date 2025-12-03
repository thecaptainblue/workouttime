import ProfilingHelper from "../helper/ProfilingHelper";
import { useEffect } from "react";
import { LogService } from "../services/Log/LogService";

export function useMeasureRender(compName: string) {
    const startTime = ProfilingHelper.createTs();

    useEffect(() => {
        LogService.info('useMeasureRender useEffect ', ProfilingHelper.getDifference(startTime, compName));
        // console.error('useMeasureRender useEffect ', ProfilingHelper.getDifference(startTime, compName));
    }, [])

    LogService.debug('useMeasureRender rerender ', compName);
}