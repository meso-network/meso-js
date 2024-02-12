import {
  Asset,
  AuthenticationStrategy,
  Environment,
  EventKind,
  Network,
  TransferConfiguration,
} from "./types";
import { validateLayout } from "./validateLayout";

/** The values from the `Network` enum. */
type NetworkValue = `${Network}`;

const isValidNetwork = (network: NetworkValue) =>
  Object.values(Network).some((value) => value === network);

export const validateTransferConfiguration = ({
  sourceAmount,
  network,
  walletAddress,
  destinationAsset,
  environment,
  partnerId,
  layout,
  onSignMessageRequest,
  onEvent,
  authenticationStrategy,
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
      kind: EventKind.UNSUPPORTED_NETWORK_ERROR,
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
      kind: EventKind.UNSUPPORTED_ASSET_ERROR,
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
  } else if (
    authenticationStrategy &&
    !Object.values(AuthenticationStrategy).includes(authenticationStrategy)
  ) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: {
          message: `\`authenticationStrategy\` must be one of ${Object.values(
            AuthenticationStrategy,
          ).join(", ")}`,
        },
      },
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

  const validateLayoutResult = validateLayout(layout);

  if (!validateLayoutResult.isValid) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: { error: { message: validateLayoutResult.message } },
    });

    return false;
  }

  return true;
};
