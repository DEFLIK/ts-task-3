import { Currency } from "../src/task_1";
import { Vault, ISecureVaultRequisites } from "../src/task_3";
import { Contract, ContractState } from "../src/task_4";
import { BankController } from "../src/task_5"

test("Check for singleton", () => {
    const s1 = BankController.getInstance();
    const s2 = BankController.getInstance();
    expect(
        s1 === s2
    ).toBe(true);
});

test("Try proceed valid contract", () => {
    const vault1 = new Vault();
    vault1.id = 1;
    vault1.deposit(new Currency("Dollar", 100, "usd"));
    const vault2 = new Vault();
    vault2.id = 2;
    vault2.deposit(new Currency("Dollar", 50, "usd"));
    BankController.vaultStore = [vault1, vault2]
    const contract = new Contract(50, {id: 1}, {id: 2}, new Currency("Dollar", 100, "usd"));
    BankController.proceedContract(contract);

    setTimeout(() => {
        expect(() => {
            vault1.withdraw(new Currency("Dollar", 100, "usd"));}
        ).toThrow();
        expect(
            vault2.withdraw(new Currency("Dollar", 150, "usd"))
        ).toBe(undefined);
    },100);
})

test("Try proceed invalid contract", () => {
    const vault1 = new Vault();
    vault1.id = 1;
    vault1.deposit(new Currency("Dollar", 50, "usd"));
    const vault2 = new Vault();
    vault2.id = 2;
    vault2.deposit(new Currency("Dollar", 100, "usd"));
    BankController.vaultStore = [vault1, vault2];
    const contract = new Contract(100, {id: 1}, {id: 2}, new Currency("Dollar", 100, "usd"));

    expect(
        contract.state
    ).toBe(ContractState.pending);

    BankController.proceedContract(contract);

    expect(
        contract.state
    ).toBe(ContractState.rejected);
})
