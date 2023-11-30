import {
  Environment,
  TransferInstance,
  TransferConfiguration,
} from "@meso-network/types";
import { validateConfiguration } from "./validation";
import { setupBus } from "./bus";
import { setupFrame } from "./frame";
import { version } from "../package.json";

const apiHosts: { readonly [key in Environment]: string } = {
  [Environment.LOCAL]: "http://localhost:5173",
  [Environment.LOCAL_PROXY]: "http://localhost:4001",
  [Environment.DEV]: "https://api.dev.meso.plumbing",
  [Environment.PREVIEW]: "https://api.preview.meso.plumbing",
  [Environment.SANDBOX]: "https://api.sandbox.meso.network",
  [Environment.PRODUCTION]: "https://api.meso.network",
};

export const transfer = (
  configuration: TransferConfiguration,
): TransferInstance => {
  if (!validateConfiguration(configuration)) return { destroy: () => {} };

  const {
    sourceAmount,
    network,
    walletAddress,
    destinationAsset,
    environment,
    partnerId,
    position,
    onSignMessageRequest,
    onEvent,
  } = configuration;

  const apiHost = apiHosts[environment];
  const frame = setupFrame(apiHost, {
    partnerId,
    network,
    walletAddress,
    sourceAmount,
    destinationAsset,
    position,
    version,
  });
  const bus = setupBus(apiHost, frame, onSignMessageRequest, onEvent);

  return {
    destroy: () => {
      frame.remove();
      bus.destroy();
    },
  };
};
