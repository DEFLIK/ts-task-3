/**
 * Задание 5 - Власть банков
 * В этой задаче вам нужно реализовать класс контроллер
 * 1. registerVault(): ISecureVaultRequisites - регистрирует хранилище в банке
 * 2. proceedContract(IContract): void - проводит договор между счетами
 * 3. Класс контроллера должен быть реализацией паттерна Singleton
 *
 * Хранилища должны быть сохранены в массив vaultStore: Vault[]
 */
import { ContractState, IContract } from "../task_4";
import { ISecureVaultRequisites, Vault } from "../task_3";

export class BankController {
    private static instance: BankController;
    public static vaultStore: Array<Vault> = [];

    private constructor() {
        return;
    }

    public static getInstance(): BankController {
        if (!BankController.instance) {
            BankController.instance = new BankController();
        }

        return BankController.instance;
    }

    public static registerVault(): ISecureVaultRequisites {
        const vault = new Vault();
        BankController.vaultStore.push(vault);

        return vault;
    }

    public static proceedContract(contract: IContract): void {
        const senderVault = BankController.vaultStore.find(vault => vault.id === contract.sender.id);
        const receiverVault = BankController.vaultStore.find(vault => vault.id === contract.receiver.id);
        
        contract.signAndTransfer();
        try { 
            senderVault.withdraw(contract.value);
            senderVault.deposit(contract.value);
        } catch (exception) {
            contract.rejectTransfer();
        }

        contract.promise.finally(() => {
            if (contract.state === ContractState.close) {
                senderVault.transfer(contract.value, receiverVault);
            }
        });
    }
}

