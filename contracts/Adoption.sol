pragma solidity ^0.4.17;
contract Adoption {

    address cooAddress=0x000;
    address ceoAddress=0x000;
    address cfoAddress=0x000;

    uint256 public secondsPerBlock = 15;

    mapping (address => uint) balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function MetaCoin() internal{
        balances[msg.sender] = 1000000000000000000;
    }

    function sendCoin(address receiver, uint amount) internal returns(bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        Transfer(msg.sender, receiver, amount);
        return true;
    }

  /*uint256[] cooldowns;
  cooldowns = new uint[](7);
  cooldowns[0]=0;
  function setSecondsPerBlock(uint256 secs) external onlyCLevel {
      require(secs < cooldowns[0]);
      secondsPerBlock = secs;
  }*/
  /// @dev Set the cooldownEndTime for the given Kitty, based on its current cooldownIndex.
  ///  Also increments the cooldownIndex (unless it has hit the cap).
  /// @param _kitten A reference to the Kitty in storage which needs its timer started.
  /*function _triggerCooldown(Kitty storage _kitten) internal {
      // Compute an estimation of the cooldown time in blocks (based on current cooldownIndex).
      _kitten.cooldownEndBlock = uint64((cooldowns[_kitten.cooldownIndex]/secondsPerBlock) + block.number);
      // Increment the breeding count, clamping it at 13, which is the length of the
      // cooldowns array. We could check the array size dynamically, but hard-coding
      // this as a constant saves gas. Yay, Solidity!
      if (_kitten.cooldownIndex < 13) {
          _kitten.cooldownIndex += 1;
      }
  }*/
  /**cooldown是通过最小时间戳实现的，和公鱼的冷却时间有关系，鱼的基因直接由父母双亲的基因截取移位操作获得
   * @dev Throws if called by any account other than the owner.
   */

  modifier onlyOwner(uint256 tmpFishId) {
    require(msg.sender == genFish[tmpFishId].owner);
    _;
  }
  //ceo、cfo、coo权限
  modifier onlyCLevel() {
      require(
          msg.sender == cooAddress ||
          msg.sender == ceoAddress ||
          msg.sender == cfoAddress
      );
      _;
  }
    struct Fish {
        uint256 FishId;
        uint256 motherId;
        uint256 fatherId;
        uint gen;
        uint256 genes;
        address owner;  //拥有者的地址
        uint256 price;
        bool ifSelling; //是否售卖状态
    }
    mapping(uint => Fish) public genFish;
    uint256 lastGen0FishId = 0;
    // Adopting a Fish
    function adopt(uint FishId,address owner) public payable returns (bool) {
      bool success = false;
      require(FishId >= 0 && FishId <= 15); // 获取FishID
      adopters[FishId] = msg.sender;
      owner.transfer(this.balance);
      return success;

      //价格需要和鱼绑定
      /*success = false;
      address seller=genFish[tmpFishId].owner;
      require(genFish[tmpFishId].owner!=msg.sender);
      if(forsale(tmpFishId)){
        sendCoin(seller, genFish[tmpFishId].price);
        genFish[tmpFishId].owner=msg.sender;
        genFish[tmpFishId].ifSelling=false;
        success=true;
      }
      return success;*/

    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16]) {
      return adopters;
    }

    //生成初代鱼基因,暂时只需14位(10)即可
    function setgenes() public view returns (uint256 base){
        base=(uint256(block.coinbase))%100000000000000;
    }

    //设置初代鱼价格
    uint bettergen_1 = 6;
    uint bettergen_2 = 2;
    uint bettergen_3 = 3;
    function setprice(uint256 tmpFishId)  internal returns (uint256){
      uint256 price;
      if(genFish[tmpFishId].owner==ceoAddress){
          price=getgenes(tmpFishId);
          if(price%bettergen_2==0){
              price*=bettergen_2;
          }
          else{
              price*=bettergen_3;
          }
          if((price%10)%bettergen_3==0){
              price*=bettergen_1;
          }
          if((price/10000)%10==bettergen_1||(price/100000)%10==bettergen_1){
              price*=10;
          }
          if((price/1000000)%10==bettergen_1||(price/100000000)%10==bettergen_1){
              price*=10;
          }
        genFish[tmpFishId].price=price*100;
        return genFish[tmpFishId].price;
      }
      else
        return;
    }

    //初始化初代鱼
    function generateFish() internal onlyCLevel{
          genFish[lastGen0FishId]=Fish(lastGen0FishId,0,0,0,setgenes(),0,0,true);
          genFish[lastGen0FishId].price=setprice(lastGen0FishId);
          lastGen0FishId++;
    }


    function breed(uint256 fatherId,uint256 motherId) public returns (uint256){
       genFish[lastGen0FishId]=Fish(lastGen0FishId,motherId,fatherId,genFish[fatherId].gen++,
       genFish[fatherId].genes/3%10000000*10000000+genFish[motherId].genes/4%10000000,genFish[motherId].owner,0,true);
       return genFish[lastGen0FishId].genes;
    }

    //获取鱼父Id
    function getfather(uint256 tmpFishId) public view returns (uint256){
        return genFish[tmpFishId].fatherId;
    }
    //获取鱼母Id
    function getmother(uint256 tmpFishId) public view returns (uint256){
        return genFish[tmpFishId].motherId;
    }
    //获取鱼基因
    function getgenes(uint256 tmpFishId) public view returns (uint256){
        return genFish[tmpFishId].genes;
    }

    //获取鱼price
    function getprice(uint256 tmpFishId) public view returns (uint256){
        return genFish[tmpFishId].price;
    }

    //获取鱼主人
    function getowner(uint256 tmpFishId) public view returns (address){
        return genFish[tmpFishId].owner;
    }
    //拍卖即更新价格
    function setauction(uint256 tmpFishId,uint256 aucprice) public returns (uint256)
    {
        genFish[tmpFishId].price=aucprice;
        return genFish[tmpFishId].price;
    }

    //在售状态
    function forsale(uint256 tmpFishId) internal view returns (bool){
      if(!genFish[tmpFishId].ifSelling) return false;
      else return true;
    }


  address public seller;
  address[16] public adopters;


  //获取鱼拥有数量
  function getFishNums() public view returns(uint FishNums) {
    FishNums = 0;
    address myAddress = msg.sender;
    for(uint256 tmp = 0;tmp<=lastGen0FishId;tmp++){
            if(genFish[tmp].owner == myAddress){
               FishNums++;
            }
          }
  }
}
