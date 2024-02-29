/*
 # Asset Diskominfo Jabar network Hyperledger Fabric 
 # asset diskominfo jabar ledger blockchain network
 # Author: PJ
 # PartsupplierService -partsupplierDistribute:
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const DskinfoLedgerContract = require('../../contract/lib/dskinfoledgercontract.js');
class PartsupplierService {
  /**
  * 1. Select an identity from a wallet
  * 2. Connect to network gateway
  * 3. Access asset diskominfo jabar ledger blockchain network
  * 4. Construct request to partsupplierDistribute
  * 5. Submit invoke partsupplierDistribute transaction
  * 6. Process response
  **/
   async partsupplierDistribute(userName, materialNumber, ownerName) {
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/'+userName+'/wallet');
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    try {
      // Load connection profile; will be used to locate a gateway
      let connectionProfile = yaml.safeLoad(fs.readFileSync('../../../organizations/peerOrganizations/org2.example.com/connection-org2.json', 'utf8'));
      // Set connection options; identity and wallet
      let connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled:true, asLocalhost: true }
      };
      // Connect to gateway using application specified parameters
      console.log('Connect to Fabric gateway.');
      await gateway.connect(connectionProfile, connectionOptions);
      // Access asset diskominfo jabar ledger blockchain network
      console.log('Use network channel: dskinfochannel.');
      const network = await gateway.getNetwork('dskinfochannel');
      // Get addressability to asset diskominfo jabar ledger blockchain network contract
      console.log('Use org.dskinfo.DskinfoLedgerContract smart contract.');
      const contract = await network.getContract('dskinfoLedgerContract', 'org.dskinfo.DskinfoLedgerContract');
      // createMaterial
      console.log('Submit dskinfoledger createMaterial transaction.');
      const response = await contract.submitTransaction('partsupplierDistribute', materialNumber, ownerName);
      console.log('MakeMaterial Transaction complete.');
      return response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      throw ({ status: 500,  message: `Error adding to wallet. ${error}` });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
  }
}
// Main program function
module.exports = PartsupplierService;
