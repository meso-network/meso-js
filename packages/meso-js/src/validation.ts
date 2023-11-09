import {
  Asset,
  Environment,
  EventKind,
  Network,
  TransferConfiguration,
} from "@meso-network/types";

/** The values from the `Network` enum. */
type NetworkValue = `${Network}`;

const isValidNetwork = (network: NetworkValue) =>
  Object.values(Network).some((value) => value === network);

export const validateConfiguration = ({
  sourceAmount,
  network,
  walletAddress,
  destinationAsset,
  environment,
  partnerId,
  onSignMessageRequest,
  onEvent,
}: TransferConfiguration): boolean => {
  if (typeof onEvent !== "function") {
    throw new Error("[meso-js] An onEvent callback is required.");
  } else if (!/^\d*\.?\d+$/.test(sourceAmount)) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: {
          message:
            '"sourceAmount" must be a valid stringified number including optional decimals.',
        },
      },
    });
    return false;
  } else if (!isValidNetwork(network)) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: {
          message: `"network" must be a supported network: ${Object.values(
            Network,
          )}.`,
        },
      },
    });
    return false;
  } else if (
    !walletAddress ||
    typeof walletAddress !== "string" ||
    walletAddress.length === 0
  ) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: { error: { message: `"walletAddress" must be provided.` } },
    });
    return false;
  } else if (!(destinationAsset in Asset)) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: {
          message: `"destinationAsset" must be a supported asset: ${Object.values(
            Asset,
          )}.`,
        },
      },
    });
    return false;
  } else if (!(environment in Environment)) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: {
          message: `"environment" must be a supported environment: ${Object.values(
            Environment,
          )}.`,
        },
      },
    });
    return false;
  } else if (
    !partnerId ||
    typeof partnerId !== "string" ||
    partnerId.length === 0
  ) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: { error: { message: `"partnerId" must be provided.` } },
    });
    return false;
  } else if (typeof onSignMessageRequest !== "function") {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: { message: '"onSignMessageRequest" must be a valid function.' },
      },
    });
    return false;
  }

  return true;
};
