export class SettingItem {
    key: string;
    keyText: string;
    value: any;
    valueText: string;

    constructor(key: string, keyText: string, value: any, valueText: string) {
        this.key = key;
        this.value = value;
        this.keyText = keyText;
        this.valueText = valueText;
    }
}