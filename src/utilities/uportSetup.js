import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('uPort Demo', {
  clientId: '35DDXwF6Hdr6dQQo1BRwQru7W3d54avzBwk',
  signer: SimpleSigner('8418af6ec2c33b30ef28b699172e36197892bd53e3b96e88c599b7edf80cae30'),
  network: 'kovan'
})

const web3 = uport.getWeb3()
export { web3, uport }
