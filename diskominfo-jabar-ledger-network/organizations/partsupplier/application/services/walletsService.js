/*
 # Asset Diskominfo Jabar network Hyperledger Fabric 
 # asset diskominfo jabar ledger blockchain network
 # Author: PJ
 # WalletService -addToWallet:
 # handle partsupplier org2 wallet
 */
'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { Wallets } = require('fabric-network');
const path = require('path');
const fixtures = path.resolve(__dirname, '../../../../organizations');

class WalletService {
  async addToWallet(user) {
    try {
      if(!user || user.length<1) {
          throw ({ status: 500,  message: 'User is not defined.' });
      }
        // A wallet stores a collection of identities
        const wallet = await Wallets.newFileSystemWallet('../identity/user/'+user+'/wallet');
        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, '/peerOrganizations/org2.example.com/users/User1@org2.example.com');
        const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org2.example.com-cert.pem')).toString();
        const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();
        // Load credentials into wallet
        const identityLabel = user;
        const identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        }
        const response = await wallet.put(identityLabel, identity);
        console.log(`addToWallet mspId:Org2MSP response: ${response}`);
        return response?JSON.parse(response):response;
    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
        throw ({ status: 500,  message: `Error adding to wallet. ${error}` });
    }
  }
}
module.exports = WalletService;
