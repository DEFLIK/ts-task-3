import { Currency } from "../src/task_1";
import { Contract, ContractState } from "../src/task_4";

test("Contract instance", () => {
    expect(
         new Contract(100, {id: 1}, {id: 2}, new Currency("Dollar", 0, "usd"))
    ).toBeInstanceOf(Contract);
})

test("Contract instance of big values", () => {
    expect(
         new Contract(100000, {id: 14324324324234}, {id: 21235244326453624352}, new Currency("Dollar", 0, "usd"))
    ).toBeInstanceOf(Contract);
})

test("Contract instance between 1 person", () => {
    expect(() => {
         new Contract(100, {id: 1}, {id: 1}, new Currency("Dollar", 0, "usd"));}
    ).toThrow();
})

test("Try close transfer before sign", () => {
    const contract = new Contract(5000, {id: 5}, {id: 10}, new Currency("Dollar", 0, "usd"));
    expect(() => {
        contract.closeTransfer();}
    ).toThrow();
})

test("Try reject transfer before sign", () => {
    const contract = new Contract(5000, {id: 5}, {id: 10}, new Currency("Dollar", 0, "usd"));
    expect(() => {
        contract.rejectTransfer();}
    ).toThrow();
})

test("Try reject transfer and check pending state", () => {
    const contract = new Contract(200, {id: 5}, {id: 10}, new Currency("Dollar", 0, "usd"));

    expect(
        contract.state
    ).toBe(ContractState.pending);

    contract.signAndTransfer();

    expect(
        contract.state
    ).toBe(ContractState.transfer);

    contract.rejectTransfer();

    expect(
        contract.state
    ).toBe(ContractState.rejected);
})

test("Try close transfer and check pending state", () => {
    const contract = new Contract(200, {id: 5}, {id: 10}, new Currency("Dollar", 0, "usd"));

    expect(
        contract.state
    ).toBe(ContractState.pending);

    contract.signAndTransfer();

    expect(
        contract.state
    ).toBe(ContractState.transfer);

    contract.closeTransfer();

    expect(
        contract.state
    ).toBe(ContractState.close);
})

test("Check for closing after delay", () => {
    const contract = new Contract(100, {id: 5}, {id: 10}, new Currency("Dollar", 0, "usd"));

    contract.signAndTransfer();

    expect(
        contract.state
    ).toBe(ContractState.transfer);

    setTimeout(() => {
        expect(
            contract.state
        ).toBe(ContractState.close);
    }, 200);
})