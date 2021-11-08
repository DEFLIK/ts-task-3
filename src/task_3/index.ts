import { Currency } from "../task_1";

export class Vault implements ISecureVaultRequisites{
	public id: number;
	public store: Set<Currency> = new Set<Currency>()

	public deposit(curr: Currency): void {
		let doneFlag = false;

		this.store.forEach(element => {
			if (element.name === curr.name) {
				element.value += curr.value;
				doneFlag = true;

				return;
			}
		});

		if (!doneFlag) {
			this.store.add(curr);
		}
	}

	public withdraw(curr: Currency): void {
		let doneFlag = false;

		this.store.forEach(element => {
			if(element.name === curr.name && element.value >= curr.value) {
				element.value -= curr.value;
				doneFlag = true;

				return;
			}
		});

		if (!doneFlag) {
			throw new Error('There is no such currency amount in your vault');
		}
	}

	public transfer(curr: Currency, vault: Vault) {
		this.withdraw(curr);
		vault.deposit(curr);
	}
}


export interface ISecureVaultRequisites{
	id: number
}
