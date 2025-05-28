import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DEFAULT_GAS_LIMIT = 5_000_000;

const PaymasterModule = buildModule("PaymasterModule", (m) => {
  const entryPoint = m.getParameter(
    "entryPoint",
    "0xD333403Fd54d3be299bD7b39Fdf394bb7B7B065e"
  );

  const gasLimit = m.getParameter("gasLimit", DEFAULT_GAS_LIMIT);

  // Pass deployer address via deployment params
  const initialOwner = m.getParameter(
    "initialOwner",
    "0x1D434f1b7a3F009366621330c9ba61118598b40b"
  );

  const paymaster = m.contract("Paymaster", [
    entryPoint,
    gasLimit,
    initialOwner,
  ]);

  return { paymaster };
});

export default PaymasterModule;
