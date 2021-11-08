import { Currency } from "../task_1";

export class Dollar extends Currency {
    constructor (value: number) {
        super('Dollar', value, 'usd')
    }
}

export class Ruble extends Currency {
    constructor (value: number) {
        super('Ruble', value, 'rub')
    }
}

export class XRP extends Currency {
    constructor (value: number) {
        super('XRP', value, 'coin')
    }
}

export class Etherium extends Currency {
    constructor (value: number) {
        super('Etherium', value, 'coin')
    }
}

export class Gold extends Currency {
    constructor (value: number) {
        super('Gold', value, 'carat')
    }
}