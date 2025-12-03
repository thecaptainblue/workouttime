
export default class ProfilingHelper {

  static createTs(): number {
    return Date.now();
  }

  static getDifference(initialTs: number | undefined, name?: string): string {
    const currentTs = Date.now();
    // console.log('getDifference, name', name)
    let result = 'NAN';
    if (initialTs != null) {
      const dif = currentTs - initialTs;
      result = name != null ? name + ":" + dif.toFixed(2) + "ms" : dif.toFixed(2) + "ms";
    }
    return result;
  }
}
