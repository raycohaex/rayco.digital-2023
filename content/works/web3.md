---
title: "Web3"
description: "I delved into the world of Web3 by developing a variety of projects utilizing smart contracts and token economics."
date: 2022-08-29T21:03:13+02:00
type: work
thumbnail: eth2.webp
skills: ["Solidity", "Python", "DeFi", "Tokenomics"]
github: https://github.com/raycohaex/arbitrage-trading-web3
slug: web-3
introduction: "I delved into the world of Web3 by developing a variety of projects utilizing smart contracts and token economics."
---
## Arbitrage trading strategy using Flash Loans
### Triangular arbitrage trading
With triangular arbitrage trading we take advantage of the price differences between three different assets. The idea is to buy one asset, sell it for another and then sell the second asset for the first. This way we can make a profit without having to hold any of the assets for a long period of time. Though this is highly competative, I wanted to create a smart contract that takes out a flash loan to make the trade.

### Flash Loans
Flash Loans allows us to borrow a large amount of an asset without collateral. Collateral being the value of the asset that is used to secure the loan. However the trade-off is that the loan must be paid back in the same transaction. Otherwise it's rolled back. This allows us to take advantage of the price differences between assets without having to worry about the price moving against us.

### Technical details
The smart contract is written in Solidity and aimed for the Binace Smart Chain. It uses the PancakeSwap router to swap the assets. Some of the files are from OpenZeppelin and form a foundation for the smart contract. I used hardhat to compile, test and deploy the smart contract.

### The contract
The first function is called from an interface. The function will loop through the array of tokens and approve them for transfer. It will then get the pair address and check if it exists. If it does exist it will find which token holds the amount and encode the data so we can pass it to the swap function. Lastly it will get the loan.
```solidity 
/**
* @dev Receive loan to engage in arbitrage
* @param borrow user who initiated the flash loan
*/
function startArbitrage(address borrow, uint256 amount) external {
    // Define an array of token addresses

    // Loop through the array and approve each token for transfer
    for (uint256 i = 0; i < tokens.length; i++) {
        IERC20(tokens[i]).safeApprove(address(PANCAKE_ROUTER), MAX_INT);
    }

    // Get the pair address
    address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(borrow, WBNB);
    require(pair != address(0), "Pair does not exist");

    // Find which token holds the amount
    address token0 = IUniswapV2Pair(pair).token0();
    address token1 = IUniswapV2Pair(pair).token1(); 
    uint256 amount0Out = borrow == token0 ? amount : 0;
    uint256 amount1Out = borrow == token1 ? amount : 0;

    // encode the data so we can pass it to the swap function
    bytes memory data = abi.encode(borrow, amount, msg.sender);

    // Get loan
    IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
}
```
\
Now the contract has to continue making the trade. There are 2 private functions involved into doing so. The first is to place the trade.
```solidity
/**
* @dev Receive loan to engage in arbitrage
* @param borrow user who initiated the flash loan
*/
function placeTrade(address from, address to, uint256 amount) private returns (uint256) {
    address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(from, to);
    require(pair != address(0), "Pair does not exist");

    // amount out
    address[] memory path = new address[](2);
    path[0] = from;
    path[1] = to;

    uint256 amountRequired = IUniswapV2Router01(PANCAKE_ROUTER).getAmountsOut(amount, path)[1];

    // execute arbitrage
    uint amountReceived = IUniswapV2Router01(PANCAKE_ROUTER).swapExactTokensForTokens(amount, amountRequired, path, address(this), deadline)[1];

    require(amountReceived > 0, "Exit: trade failed");
    return amountReceived;
}
```
\
And the second is to simply calculate if the trade would be profitable.
```solidity
function isProfitable(uint256 input, uint256 output) private returns (bool) {
    return output > input;
}
```
\
The actual code for doing the arbitrage itself will retrieve the token pair which is being swapped. It will proceed to do some checks throughout, for example an 'auth' check. It will decode the data from the startArbitrage function and then try to do the trade. If the trade is not profitable it will fail. At last, it will repay the loan within the same transaction.

```solidity
/**
* @dev Swap tokens on pancakeswap
* @param sender user who initiated the swap 
*/
function pancakeCall(address sender, uint256 amount0, uint256 amount1, bytes calldata data) external {
    address token0 = IUniswapV2Pair(msg.sender).token0();
    address token1 = IUniswapV2Pair(msg.sender).token1();
    address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(token0, token1);

    require(pair != address(0), "Pair does not exist");
    require(pair == msg.sender, "Unauthorized");
    require(sender == address(this), "Unauthorized");

    // Decode the data we encoded in the swap function
    (address borrow, uint256 amount, address destination) = abi.decode(data, (address, uint256, address));

    // Calculate the fee to pay back
    uint256 fee = ((amount * 3) / 997) + 1;
    uint256 repayAmount = amount + fee;

    uint256 loanAmount = amount0 > 0 ? amount0 : amount1;

    // Try to place arbitrage trades, as long as we are profitable
    uint256 tradedCoin1 = placeTrade(tokens[0], tokens[1], loanAmount);
    uint256 tradedCoin2 = placeTrade(tokens[1], tokens[2], tradedCoin1);
    uint256 tradedCoin3 = placeTrade(tokens[2], tokens[0], tradedCoin2);
    bool profitable = isProfitable(loanAmount, tradedCoin3);
    require(profitable, "unprofitable trade");

    IERC20 other = IERC20(BUSD);
    other.safeTransfer(destination, tradedCoin3 - repayAmount);

    // Pay back loan
    IERC20(borrow).safeTransfer(pair, repayAmount);
}
```

### Deployment
I deployed the smart contract to the testnet, also using hardhat. The contract is deployed at `0x0a716555a126b35E127522E32C75482c85cA22e6` and can be found on BSCScan [here](https://testnet.bscscan.com/address/0x0a716555a126b35E127522E32C75482c85cA22e6#code).


### Improvements
The contract is not perfect and can be improved in many ways. For example, the contract is not very flexible and has a lot of things hardcoded. Also there is no interface at the moment, it would be especially great if there was one which also shows arbitrage opportunities. It is only able to do arbitrage on the 3 tokens that are defined in the contract. It could also be optimised though I would say it's more relevant for ETH than BSC due to the gas fees. With this project I only scratched the surface.
