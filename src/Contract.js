import {
    AccountTransactionType,
    CcdAmount,
} from '@concordium/web-sdk';

export async function valid(client, connectedAccount) {
    await client.sendTransaction(connectedAccount, AccountTransactionType.Update, {
        amount: new CcdAmount(0n),
        address: {
            index: 2435n,
            subindex: 0n,
        },
        receiveName: 'count_tracker.validincrement',
        maxContractExecutionEnergy: 30000n,
    })
}

export async function invalid(client, connectedAccount) {
    await client.sendTransaction(connectedAccount, AccountTransactionType.Update, {
        amount: new CcdAmount(0n),
        address: {
            index: 2435n,
            subindex: 0n,
        },
        receiveName: 'count_tracker.invalidincrement',
        maxContractExecutionEnergy: 30000n,
    })
}

export async function getStats(client, str) {
    const res = await client.getJsonRpcClient().invokeContract({
        method: 'count_tracker.view',
        contract: { index: 2435n, subindex: 0n },
    });
    if (str === "valid") {
        return res.returnValue.substring(0, 2);
    }
    else if (str === "invalid") {
        return res.returnValue.substring(2, 4);
    }
    else if (str === "total") {
        return res.returnValue.substring(4, 6);
    }
}