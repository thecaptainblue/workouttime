
export class StringHelper {

    static isEmpty(text: string): boolean {
        let result = false;
        if (text === '' || text === undefined || text === null) {
            result = true;
        }
        return result;
    }

}