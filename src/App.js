import {
  AccountTransactionType,
  CcdAmount,
  AccountAddress,
  IdStatementBuilder
} from '@concordium/web-sdk';
import { ResultAsync } from 'neverthrow';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import { useState, useEffect } from 'react';

// user imports
import './App.css';
import { valid, invalid, getStats } from './Contract';

function App() {
  const [ connectedAccount, setConnectedAccount ] = useState("Connect");
  const [ client, setClient ] = useState();
  const [ valid, setValid ] = useState(0);
  const [ invalid, setInvalid ] = useState(0);
  const [ total, setTotal ] = useState(0);

  // Checking if browser wallet is available && getting most recently selected account
  useEffect(() => {
    ResultAsync.fromPromise(
      detectConcordiumProvider().then((client) => {
        client.getMostRecentlySelectedAccount().then(setConnectedAccount("Connect"));
        return client;
      }),
      () => 'browser wallet did not initialize in time' // promise rejects without message
    ).then(setClient);
  }, []);

  async function connect(client) {
    await client.connect().then((accountAddress) => {
      setConnectedAccount(accountAddress);
    });

    // Getting the smart contract data
    setValid(await getStats(client, "valid"))
    setInvalid(await getStats(client, "invalid"))
    setTotal(await getStats(client, "total"))
  }

  async function send(client, amount, address) {
    amount = BigInt(amount);
    const statementBuilder = new IdStatementBuilder().addMinimumAge(18);
    const statement = statementBuilder.getStatement();
    const challenge = "AAAAAAAA"

    // Requesting ID proff to check if user is 18 years old
    client.requestIdProof(connectedAccount, statement, challenge)
      .then((proof) => {
        // User is 18 year old, sending transaction
        client.sendTransaction(connectedAccount, AccountTransactionType.Transfer, {
          amount: new CcdAmount(amount),
          toAddress: new AccountAddress(address)
        })
          .then(() => {
            // Incrementing valid tracsaction counter in the smart contract
            valid(client, connectedAccount)
          })
          .catch(() => {
            // Transaction could not be sent
            alert("Something went wrong! Try again...")
          })
      })
      .catch(() => {
        // User is not 18 years old
        // incrementing invalid transaction counter in the smart contract
        invalid(client, connectedAccount)
        alert("You are not 18 years old!")
      })
  }

  return (
    <>
      <main className="main">
        <div className="description">
          {client?.match(
            (c) => (
              <p onClick={() => connect(c, setConnectedAccount).catch(console.error)}>
                {connectedAccount.length < 10 ?
                  <code className="code">{connectedAccount}</code> :
                  <code className="code flexx">{connectedAccount.slice(0, 4)}...{connectedAccount.slice(-4)}
                    <img src="/refresh.svg" width={16} />
                  </code>}

              </p>
            ),
            (e) => (
              <p>
                <code className="code">Browser Wallet is not available</code>
              </p>
            )
          )}

          <div>
            <a
              href="https://shebuilds.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              For{' '}SheBuilds Hackathon
            </a>
          </div>
        </div>

        <div className="center">
          <h1><code className='code'>Transfer some CCD!</code></h1>
          <div>

            <input type="number" placeholder="Enter amount to transfer" />
            <input type="text" placeholder="Enter recipient address" />
            {client?.match(
              (c) => (
                <button onClick={() => send(c,
                  document.querySelector('input[type="number"]').value,
                  document.querySelector('input[type="text"]').value)
                  .catch(console.error)}>
                  <code className='code'>1..2..3.. Send</code>
                </button>
              ),
              (e) => (
                <code className="code">Connect Wallet First...</code>
              )
            )}
          </div>
        </div>
        <div className="grid">
          <div className="card">
            <p>
              Valid Transactions <span>{valid}</span>
            </p>
          </div>
          <div className="card">
            <p>
              Invalid Transactions <span>{invalid}</span>
            </p>
          </div>
          <div className="card">
            <p>
              Total Transactions <span>{total}</span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
