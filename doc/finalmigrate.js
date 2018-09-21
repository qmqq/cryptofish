networks: {
  "development": {
  host: "localhost",
  port: 8545,
  network_id: "*" // match any network
  },
  "live": {
  host: "39.104.65.63",
  port: 80,
  network_id: 1,
  }
}


 $truffle migrate –network live

 //////////////////设置
 if (typeof web3 !== 'undefined') {
   web3 = new Web3(web3.currentProvider);    //当前客户端已成功安装web3Login
 } else {
   // set the provider you want from Web3.providers
   web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 }

set a provider (HttpProvider using http basic authentication)
web3.setProvider(new web3.providers.HttpProvider('http://host.url', 0, BasicAuthUsername, BasicAuthPassword))

var coinbase = web3.eth.coinbase;     //coinbase一般表示的是一个地址变量
var balance = web3.eth.getBalance(coinbase);

//////////////////使用回调
web3.eth.getBlock(48, function(error, result){
    if(!error)
        console.log(JSON.stringify(result));
    else
        console.error(error);
})

//////////////////批量处理
var batch = web3.createBatch();
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(web3.eth.Contract(abi).at(address).balance.request(address, callback2));
batch.execute();

/////////////////大数处理
var balance = new BigNumber('131242344353464564564574574567456');
// or var balance = web3.eth.getBalance(someAddress);
balance.plus(21).toString(10); // toString(10) converts it to a number string
// "131242344353464564564574574567477"

///////////////network id
main network : 1
ropsten network: 3
kovan network: 42
rinkeby network: 4
private network: (eg)1519966096599
