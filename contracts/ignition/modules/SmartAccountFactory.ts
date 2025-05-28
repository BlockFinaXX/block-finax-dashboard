import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SmartAccountFactoryModule = buildModule("SmartAccountModule", (m) => {
  const entryPointAddress = m.getParameter(
    "entryPoint",
    "0xD333403Fd54d3be299bD7b39Fdf394bb7B7B065e"
  );

  // Deploy SmartAccountFactory with entryPoint param
  const factory = m.contract("SmartAccountFactory", [entryPointAddress]);

  return { factory };
});

export default SmartAccountFactoryModule;
