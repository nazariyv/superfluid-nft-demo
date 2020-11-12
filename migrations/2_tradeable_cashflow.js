const TradeableCashflow = artifacts.require("TradeableCashflow");
const SuperfluidSDK = require("@superfluid-finance/ethereum-contracts");

// ! TODO: extract, make a util out of this
const getNetwork = (network) => {
  switch (network) {
    case "live":
      return 1;
    case "goerli":
      return 5;
    default:
      throw new Error("unknown network");
  }
};

module.exports = async (deployer, network) => {
  console.error("network", network);
  const version = "preview-20200928";

  const sf = new SuperfluidSDK.Framework({
    chainId: getNetwork(network),
    version: version,
    web3Provider: web3.currentProvider,
  });
  await sf.initialize();

  const owner = "0x9D3a930E48740501c94978Df634cbB40a1874D26";
  const name = "StreamableCashflow";
  const symbol = "SCF";
  const daiAddress = await sf.resolver.get("tokens.fDAI");
  const dai = await sf.contracts.TestToken.at(daiAddress);
  const daixWrapper = await sf.getERC20Wrapper(dai);
  const daix = await sf.contracts.ISuperToken.at(daixWrapper.wrapperAddress);

  await deployer.deploy(
    TradeableCashflow,
    owner,
    name,
    symbol,
    sf.host.address,
    sf.agreements.cfa.address,
    daix.address
  );
};
