import {
  Asset,
  AuthenticationStrategy,
  CashOutConfiguration,
  CryptoAsset,
  Environment,
  EventKind,
  FiatAsset,
  InlineCashOutConfiguration,
  InlineTransferConfiguration,
  Network,
  TransferConfiguration,
} from "./types";
import { validateLayout } from "./validateLayout";

/** The values from the `Network` enum. */
type NetworkValue = `${Network}`;

const isValidNetwork = (network: NetworkValue) =>
  Object.values(Network).some((value) => value === network);

export const validateTransferConfiguration = (
  transferConfig: TransferConfiguration,
): boolean => {
  if (!validateSharedConfiguration(transferConfig)) return false;

  const { onEvent, sourceAsset } = transferConfig;

  const validateLayoutResult = validateLayout(transferConfig.layout);
  if (!validateLayoutResult.isValid) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: { error: { message: validateLayoutResult.message } },
    });

    return false;
  }

  if (transferConfig.destinationAsset in FiatAsset) {
    // Validate CashOutConfiguration specific configs
    if (!sourceAsset || !(sourceAsset in CryptoAsset)) {
      onEvent({
        kind: EventKind.UNSUPPORTED_ASSET_ERROR,
        payload: {
          error: {
            message: `"sourceAsset" must be a supported CryptoAsset for Cash-out: ${Object.values(
              CryptoAsset,
            )}.`,
          },
        },
      });
      return false;
    } else if (
      typeof (transferConfig as CashOutConfiguration)
        .onSendTransactionRequest !== "function"
    ) {
      onEvent({
        kind: EventKind.CONFIGURATION_ERROR,
        payload: {
          error: {
            message: '"onSendTransactionRequest" must be a valid function.',
          },
        },
      });
      return false;
    }
  } else {
    // Validate CashInConfiguration specific configs
    if (sourceAsset && !(sourceAsset in FiatAsset)) {
      onEvent({
        kind: EventKind.UNSUPPORTED_ASSET_ERROR,
        payload: {
          error: {
            message: `"sourceAsset" must be a supported FiatAsset for Cash-in: ${Object.values(
              FiatAsset,
            )}.`,
          },
        },
      });
      return false;
    }
  }

  return true;
};

export const validateInlineTransferConfiguration = (
  transferConfig: InlineTransferConfiguration,
): boolean => {
  if (!validateSharedConfiguration(transferConfig)) return false;
  const { onEvent, sourceAsset } = transferConfig;

  if (transferConfig.destinationAsset in FiatAsset) {
    // Validate CashOutConfiguration specific configs
    if (!sourceAsset || !(sourceAsset in CryptoAsset)) {
      onEvent({
        kind: EventKind.UNSUPPORTED_ASSET_ERROR,
        payload: {
          error: {
            message: `"sourceAsset" must be a supported CryptoAsset for Cash-out: ${Object.values(
              CryptoAsset,
            )}.`,
          },
        },
      });
      return false;
    } else if (
      typeof (transferConfig as InlineCashOutConfiguration)
        .onSendTransactionRequest !== "function"
    ) {
      onEvent({
        kind: EventKind.CONFIGURATION_ERROR,
        payload: {
          error: {
            message: '"onSendTransactionRequest" must be a valid function.',
          },
        },
      });
      return false;
    }
  } else {
    // Validate CashInConfiguration specific configs
    if (sourceAsset && !(sourceAsset in FiatAsset)) {
      onEvent({
        kind: EventKind.UNSUPPORTED_ASSET_ERROR,
        payload: {
          error: {
            message: `"sourceAsset" must be a supported FiatAsset for Cash-in: ${Object.values(
              FiatAsset,
            )}.`,
          },
        },
      });
      return false;
    }
  }

  return true;
};

const validateSharedConfiguration = ({
  authenticationStrategy,
  destinationAsset,
  environment,
  network,
  onEvent,
  onSignMessageRequest,
  partnerId,
  sourceAmount,
  destinationAmount,
  walletAddress,
}: TransferConfiguration | InlineTransferConfiguration): boolean => {
  if (typeof onEvent !== "function") {
    throw new Error("[meso-js] An onEvent callback is required.");
  } else if (!sourceAmount && !destinationAmount) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: {
          message: '"sourceAmount" or "destinationAmount" must be specified.',
        },
      },
    });
    return false;
  } else if (sourceAmount && !/^\d*\.?\d+$/.test(sourceAmount)) {
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
  } else if (destinationAmount && !/^\d*\.?\d+$/.test(destinationAmount)) {
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: {
        error: {
          message:
            '"destinationAmount" must be a valid stringified number including optional decimals.',
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
  } else if (!(destinationAsset in Asset)) {
    onEvent({
      kind: EventKind.UNSUPPORTED_ASSET_ERROR,
      payload: {
        error: {
          message: `"destinationAsset" must be a supported Asset: ${Object.values(
            Asset,
          )}.`,
        },
      },
    });
    return false;
  }

  return true;
};
