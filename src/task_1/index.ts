export class Currency {
    public readonly name: string;
    public readonly unit: string;
    public readonly type: CurrencyType;
    private _value: number;

    public get value (): number {
        return this._value;
    }
    public set value (val: number) {
        if (val === undefined || val < 0) {
            throw new Error('Invalid params')
        }
        this._value = val;
    }


    constructor(name: keyof typeof CurrencyType, value: number, unit: string) {
        if (!name || value < 0 || !unit || value === undefined) {
            throw new Error('Invalid params');
        }
        this.name = name;
        this._value = value;
        this.unit = unit;
        this.type = CurrencyType[name];
    }
}

export enum CurrencyType {
    'Dollar' = 'Material',
    'Ruble' = 'Material',
    'XRP' = 'Crypto',
    'Etherium' = 'Crypto',
    'Gold' = 'Metal',
    'ru' = 'Material',
    'alpha' = 'Crypto'
}
