import './App.css';
import { AccountTransactionType, CcdAmount, AccountAddress, IdStatementBuilder, verifyIdstatement } from '@concordium/web-sdk';
import { ResultAsync } from 'neverthrow';
import { detectConcordiumProvider, WalletApi } from '@concordium/browser-wallet-api-helpers';
import { useState, useEffect } from 'react';

function App() {
  const [ connectedAccount, setConnectedAccount ] = useState("Connect");
  const [ client, setClient ] = useState();

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
  }

  async function send(client, amount, address) {
    const statementBuilder = new IdStatementBuilder().addMinimumAge(18);
    const statement = statementBuilder.getStatement();
    const challenge = "AAAAAAAA"
    client.requestIdProof(connectedAccount, statement, challenge)
      .then((proof) => {
        console.log(proof);
        client.sendTransaction(connectedAccount, AccountTransactionType.Transfer, {
          amount: new CcdAmount(amount),
          toAddress: new AccountAddress(address)
        })
          .then(alert)
          .catch(alert)
      })
      .catch(alert);


  };



  return (
    <>
      <main className="main">
        <div className="description">
          {client?.match(
            (c) => (
              <p onClick={() => connect(c, setConnectedAccount).catch(console.error)}>
                {connectedAccount.length < 10 ?
                  <code className="code">{connectedAccount}</code> :
                  <code className="code">{connectedAccount.slice(0, 4)}...{connectedAccount.slice(-4)}</code>}
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

            <input type="text" placeholder="Receiver's Address" />
            {client?.match(
              (c) => (
                <button onClick={() => send(c, 50000n, "4ehzsMnNnFv6HF43RrzU2KqMLTUt1Wb5L11FtQvTYHUWrXYYvg").catch(console.error)}><code className='code'>1..2..3.. Send</code></button>
              ),
              (e) => (
                <code className="code">Connect Wallet First...</code>
              )
            )}

          </div>
        </div>
      </main>
    </>
  );
}

export default App;
