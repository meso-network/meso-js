import { version } from "../package.json";
import { setupBus } from "./bus";
import { renderModalOnboardingFrame, setupFrame } from "./frame";
import {
  InlineCashOutConfiguration,
  InlineTransferConfiguration,
  MessageKind,
  TransferExperienceMode,
  TransferInstance,
} from "./types";
import { frameStore } from "./frameStore";
import { apiHosts, NOOP_TRANSFER_INSTANCE } from "./utils";
import { validateInlineTransferConfiguration } from "./validateConfiguration";

export const inlineTransfer = (
  configuration: InlineTransferConfiguration,
): TransferInstance => {
  // eslint-disable-next-line no-console
  console.warn(
    "[meso.js]: `inlineTransfer` is currently in beta and may change in the future.",
  );

  if (!validateInlineTransferConfiguration(configuration)) {
    return NOOP_TRANSFER_INSTANCE;
  }

  const {
    sourceAmount,
    network,
    walletAddress,
    environment,
    container,
    partnerId,
    authenticationStrategy,
    sourceAsset,
    destinationAsset,
    onSignMessageRequest,
    onEvent,
  } = configuration;

  const apiHost = apiHosts[environment];

  const containerElement: Element | null = document.querySelector(container);

  if (!containerElement) {
    throw new Error(
      `Invalid container: No element found for selector ${container}`,
    );
  }

  const frame = setupFrame(
    apiHost,
    {
      partnerId,
      network,
      walletAddress,
      sourceAmount,
      destinationAsset,
      sourceAsset: sourceAsset!,
      version,
      authenticationStrategy: authenticationStrategy!,
      mode: TransferExperienceMode.INLINE,
    },
    containerElement,
  );

  const bus = setupBus({
    apiHost,
    frame,
    onEvent,
    onSignMessageRequest,
    onSendTransactionRequest: (configuration as InlineCashOutConfiguration)
      .onSendTransactionRequest,
  });

  bus.on(MessageKind.INITIATE_MODAL_ONBOARDING, (message) => {
    if (message.kind !== MessageKind.INITIATE_MODAL_ONBOARDING) return;

    const modalOnboardingIframe = renderModalOnboardingFrame({
      apiHost,
      pathname: message.payload.initialPathname,
    });

    frameStore.modalOnboardingIframe = modalOnboardingIframe;
  });

  bus.on(MessageKind.RESUME_INLINE_FRAME, (message, reply) => {
    if (message.kind !== MessageKind.RESUME_INLINE_FRAME) return;

    if (frameStore.modalOnboardingIframe) {
      frameStore.modalOnboardingIframe.parentNode?.removeChild(
        frameStore.modalOnboardingIframe,
      );

      delete frameStore.modalOnboardingIframe;

      reply({
        kind: MessageKind.RESUME_INLINE_FRAME,
        payload: message.payload,
      });
    }
  });

  return {
    destroy: () => {
      frame.remove();
      // Remove each frame in the story
      Object.values(frameStore).forEach((frame) => {
        if (typeof frame === "object" && "parentNode" in frame) {
          frame.parentNode?.removeChild(frame);
        }
      });

      bus.destroy();
    },
  };
};
