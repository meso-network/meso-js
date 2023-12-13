import {
  Environment,
  TransferInstance,
  TransferConfiguration,
  Position,
  Layout,
} from "@meso-network/types";
import { validateTransferConfiguration } from "./validateTransferConfiguration";
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

export const DEFAULT_LAYOUT: Required<Layout> = {
  position: Position.TOP_RIGHT,
  offset: "0",
};

export const transfer = ({
  sourceAmount,
  network,
  walletAddress,
  destinationAsset,
  environment,
  partnerId,
  layout = DEFAULT_LAYOUT,
  onSignMessageRequest,
  onEvent,
}: TransferConfiguration): TransferInstance => {
  const mergedLayout = { ...DEFAULT_LAYOUT, ...layout };
  const configuration = {
    sourceAmount,
    network,
    walletAddress,
    destinationAsset,
    environment,
    partnerId,
    layout: mergedLayout,
    onSignMessageRequest,
    onEvent,
  };
  if (!validateTransferConfiguration(configuration))
    return { destroy: () => {} };

  const apiHost = apiHosts[environment];
  const frame = setupFrame(apiHost, {
    partnerId,
    network,
    walletAddress,
    sourceAmount,
    destinationAsset,
    layoutPosition: mergedLayout.position,
    layoutOffset:
      typeof mergedLayout.offset === "string"
        ? mergedLayout.offset
        : JSON.stringify(mergedLayout.offset),
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
