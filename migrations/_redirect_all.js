const RedirectAll = artifacts.require("RedirectAll");
const SuperfluidSDK = require("@superfluid-finance/ethereum-contracts");

module.exports = async (deployer) => {
  const version = "preview-20200928";

  const sf = new SuperfluidSDK.Framework({
    chainId: 5,
    version: version,
    web3Provider: web3.currentProvider,
  });

  await sf.initialize();

  const owner = "0x9D3a930E48740501c94978Df634cbB40a1874D26";
  const daiAddress = await sf.resolver.get("tokens.fDAI");
  const dai = await sf.contracts.TestToken.at(daiAddress);
  const daixWrapper = await sf.getERC20Wrapper(dai);
  const daix = await sf.contracts.ISuperToken.at(daixWrapper.wrapperAddress);

  await deployer.deploy(
    RedirectAll,
    sf.host.address,
    sf.agreements.cfa.address,
    daix.address,
    owner
  );
};
