# CCD Transfer with Age Check

![](https://ccd.tiluckdave.in/project.png)

The objective of this project, developed for the SheBuilds Hackathon under the Blockchain track, is to facilitate successful ConCordium Coin (CCD) transfers using Concordium's ID layer, but only for individuals who are over the age of 18. In addition, the application updates a smart contract with counters tracking both valid and invalid transaction requests.

The Project is hosted on - [CCD Transfer with Age Check](htpps://ccd.tiluckdave.in/)

The Backend Smart Contract Code can be found in [count-tracker](https://github.com/tiluckdave/ccd-shebuilds-hack/tree/main/count-tracker) directory.

## Technologies Used

- Concordium
- Rust & Cargo for Smart Contract Development.
- React for frontend

## How to Install & Execute

- Clone the repository and run the `yarn` command to install the node_modules for the frontend project.
- Make sure you have all the setup for smart contract developemt. I followed concordium documentation to do that.
- Install the concordium browser wallet, create and identity and account.
- Next, go to `count-tracker` folder and build the wasm module for the deployment.

  ```
  cargo concordium build module --out /dist/module.wasm.v1 --schema-out /dist/schema.bin
  ```

- Next, deploy the wasm module on the testnet. and initialize it.
- Now run the react app and test it out!
