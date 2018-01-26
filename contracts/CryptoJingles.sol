pragma solidity ^0.4.18;

import './zeppelin/ownership/Ownable.sol';
import './Jingle.sol';
import './Sample.sol';

contract CryptoJingles is Ownable {
    
    struct Purchase {
        address user;
        uint blockNumber;
        bool revealed;
        uint numSamples;
        bool exists;
    }
    
    event Purchased(address indexed user, uint blockNumber, uint numJingles, uint numOfPurchases);
    event JinglesOpened(address byWhom, address jingleOwner, uint currBlockNumber);
    
    mapping (uint => bool) public isAlreadyUsed;
    
    uint numOfPurchases;
    
    uint MAX_SAMPLES_PER_PURCHASE = 10;
    uint SAMPLE_PRICE = 1000000000000000;
    uint SAMPLES_PER_SONG = 5;
    uint NUM_SAMPLE_TYPES = 20;
    
    Sample public sampleContract;
    Jingle public jingleContract;
    
    function CryptoJingles() public {
        numOfPurchases = 0;
        sampleContract = new Sample();
        jingleContract = new Jingle();
        
        sampleContract.setCryptoJinglesContract(this);
        jingleContract.setCryptoJinglesContract(this);
    }
    
    function buyJingle(uint numSamples) public payable {
        require(numSamples <= MAX_SAMPLES_PER_PURCHASE);
        require(msg.value >= (SAMPLE_PRICE * numSamples));
        
         for (uint i = 0; i < numSamples; ++i) {
            
            bytes32 blockHash = block.blockhash(block.number - 1);
            
            uint randomNum = randomGen(blockHash, block.timestamp);
            sampleContract.mint(msg.sender, randomNum);
        }
        
        
        
        Purchased(msg.sender, block.number, numSamples, numOfPurchases);
        
        numOfPurchases++;
    }
    
    function composeJingle(uint[5] samples) public {
        require(samples.length == SAMPLES_PER_SONG);
        require(jingleContract.uniqueJingles(keccak256(samples)) == false);
        
        //check if you own all the 5 samples 
        for (uint i = 0; i < SAMPLES_PER_SONG; ++i) {
            bool isOwner = sampleContract.isTokenOwner(samples[i], msg.sender);
            
            require(isOwner == true && isAlreadyUsed[samples[i]] == false);
            
            isAlreadyUsed[samples[i]] = true;
        }
        
        // remove all the samples from your Ownership
        for (uint j = 0; j < SAMPLES_PER_SONG; ++j) {
            sampleContract.removeSample(msg.sender, samples[j]);
        }
        
        //create a new song containing those 5 samples
        jingleContract.composeJingle(msg.sender, samples);
    }
    
    function randomGen(bytes32 blockHash, uint seed) constant public returns (uint randomNumber) {
        return (uint(keccak256(blockHash, seed )) % NUM_SAMPLE_TYPES);
    }
    
    // Owner functions 
    function changeJingleCost(uint newCost) public onlyOwner {
        SAMPLE_PRICE = newCost;
    }
    
    function changeNumJingleTypes(uint newNum) public onlyOwner {
        NUM_SAMPLE_TYPES = newNum;
    }
    
    
    function withdraw(uint _amount) public onlyOwner {
        require(_amount <= this.balance);
        
        msg.sender.transfer(_amount);
    }
    
}