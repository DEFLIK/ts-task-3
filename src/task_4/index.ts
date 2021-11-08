import { Currency } from "../task_1";
import { ISecureVaultRequisites } from "../task_3";

export class Contract implements IContract {
    public readonly id: number;
    public readonly value: Currency;
    public readonly sender: ISecureVaultRequisites;
    public readonly receiver: ISecureVaultRequisites;
    public promise: Promise<ContractState>; // наверное, стоило сделать приватным и вынести только метод finally наружу, но я устал и хочу спать(
    private _delay: number;
    private _state: ContractState;
    private resolve: (param: ContractState) => void;

    public get state () {
        return this._state;
    }

    constructor(delay: number, sender: ISecureVaultRequisites, receiver: ISecureVaultRequisites, currency: Currency) {
        if (sender.id === receiver.id) {
            throw new Error('Cant create contract between one person')
        }

        this._delay = delay;
        this.sender = sender;
        this.receiver = receiver;
        this.value = currency;
        this._state = ContractState.pending;
        this.id = this.getHashCode(31239);
    }

    public signAndTransfer(): void {
        this._state = ContractState.transfer;
        this.promise = new Promise<ContractState>(resolve => {
            this.resolve = resolve;

            setTimeout(() => {
                resolve(ContractState.close);
            }, this._delay);
        }).then(result => this._state = result);
    }

    public closeTransfer(): void {
        this.applyResolving(ContractState.close);
    }

    public rejectTransfer(): void {
        this.applyResolving(ContractState.rejected);
    }

    private applyResolving(result: ContractState) {
        if (this.promise === undefined) {
            throw new Error('Сontract hasn\'t been signed yet');
        }
        if (this._state === ContractState.transfer) { // Компенсирую задержку промиса в callback очереди
            this._state = result; 
        }
        this.resolve(result);
    }

    private getHashCode(startHash: number): number {
        const fnvPrime = 25348;
        const value = this.sender.id.toString() 
            + this.receiver.id.toString() 
            + new Date().getTime().toString();

        for (const char of value) {
            startHash = (startHash * fnvPrime) ^ char.charCodeAt(0);
        }

        return startHash;
    }
}


export class SmartContract extends Contract {
    constructor(sender: ISecureVaultRequisites, receiver: ISecureVaultRequisites, currency: Currency) {
        super(3000, sender, receiver, currency);
    }
}

export class BankingContract extends Contract {
    constructor(sender: ISecureVaultRequisites, receiver: ISecureVaultRequisites, currency: Currency) {
        super(0, sender, receiver, currency);
    }
}

export class LogisticContract extends Contract {
    constructor(sender: ISecureVaultRequisites, receiver: ISecureVaultRequisites, currency: Currency) {
        super(6000, sender, receiver, currency);
    }
}


export interface IContract{
    /**
     * Уникальный номер контракта
     */
    id: number,
    /**
     * Текущее состояние контракта
     */
    state: ContractState,
    /**
     * Предмет контракта
     */
    value: Currency,
    /**
     * Реквизиты отправителя
     */
    sender: ISecureVaultRequisites,
    /**
     * Реквизиты получателя
     */
    receiver: ISecureVaultRequisites,
    /**
     * Promise выполнения (добавлено лично)
     */
    promise: Promise<ContractState>,
    /**
     * Начало исполнения контракта
     */
    signAndTransfer: () => void,
    /**
     * Успешное завершение контракта
     */
    closeTransfer: () => void,
    /**
     * Отмена исполнения контракта
     */
    rejectTransfer: () => void
}

export enum ContractState{
    /**
     * Контракт находится в ожидании исполнения
     */
    pending,
    /**
     * Контракт находится в исполнении
     */
    transfer,
    /**
     * Контракт исполнен успешно
     */
    close,
    /**
     * Контракт отменен, либо отклонен
     */
    rejected
}


