import type { SerializedTransferIframeParams } from "./types";

const MODAL_ONBOARDING_PATH_PREFIX = "/modal/onboarding";

export const setupFrame = (
  apiHost: string,
  params: SerializedTransferIframeParams,
  containerElement: Element | null = null,
) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined),
  );
  const pathname = containerElement ? "/inline" : "/app";
  const url = `${apiHost}${pathname}?${new URLSearchParams(
    filteredParams,
  ).toString()}`;

  const iframe = renderIframe(url, containerElement);

  return {
    kind: containerElement ? "inline" : "embedded",
    element: iframe,
    remove: () => iframe.parentElement?.removeChild(iframe),
    hide: () => {
      iframe.style.display = "none";
      iframe.style.zIndex = "0";
    },
  };
};

const configureFrameCommonStyles = (iframe: HTMLIFrameElement) => {
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("referrerPolicy", "origin");
  iframe.setAttribute("allow", "payment");

  iframe.style.border = "none";
  iframe.style.boxSizing = "border-box";
  iframe.style.backgroundColor = "transparent";
  iframe.style.colorScheme = "auto";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
};

const configureFramePositioningStyles = (iframe: HTMLIFrameElement) => {
  iframe.style.position = "fixed";
  iframe.style.left = "0";
  iframe.style.top = "0";
  // https://x.com/wesbos/status/1796201727529513377
  // "It’s the largest integer that fits in 32 bits, so it’s the highest z-index you can give something in CSS" – https://x.com/wesbos/status/1796209959509578212
  iframe.style.zIndex = "2147483647";
};

// Render the iframe for the "embedded" flow (full viewport modal)
const renderIframe = (src: string, containerElement: Element | null) => {
  const iframe = document.createElement("iframe");
  iframe.src = src;

  configureFrameCommonStyles(iframe);

  if (containerElement) {
    containerElement.appendChild(iframe);
  } else {
    configureFramePositioningStyles(iframe);

    document.body.appendChild(iframe);
  }

  return iframe;
};

// Render an iframe for Onboarding in a modal experience
export const renderModalOnboardingFrame = ({
  apiHost,
  pathname,
  search,
}: {
  apiHost: string;
  pathname: string;
  search?: `?${string}`;
}) => {
  const route = pathname.startsWith(MODAL_ONBOARDING_PATH_PREFIX)
    ? pathname
    : `${MODAL_ONBOARDING_PATH_PREFIX}/${pathname}`;

  const src = `${apiHost}${route.replaceAll("//", "/")}${search ?? ""}`.trim();

  const iframe = document.createElement("iframe");
  iframe.src = src;

  configureFrameCommonStyles(iframe);
  configureFramePositioningStyles(iframe);

  document.body.appendChild(iframe);

  return iframe;
};
