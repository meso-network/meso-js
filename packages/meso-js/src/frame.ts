import type { SerializedTransferIframeParams } from "./types";

const MODAL_ONBOARDING_PATH_PREFIX = "/modal/onboarding";

export const setupFrame = (
  apiHost: string,
  params: SerializedTransferIframeParams,
  containerElement: Element | null = null,
) => {
  const pathname = containerElement ? "/inline" : "/app";
  const url = `${apiHost}${pathname}?${new URLSearchParams(params).toString()}`;

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

// Render the iframe for the "embedded" flow (full viewport modal)
const renderIframe = (src: string, containerElement: Element | null) => {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.setAttribute("allowtransparency", "true");

  iframe.style.border = "none";
  iframe.style.boxSizing = "border-box";
  iframe.style.backgroundColor = "transparent";
  iframe.style.colorScheme = "auto";
  iframe.style.width = "100%";
  iframe.style.height = "100%";

  if (containerElement) {
    containerElement.appendChild(iframe);
  } else {
    iframe.style.position = "fixed";
    iframe.style.left = "0";
    iframe.style.top = "0";
    iframe.style.zIndex = "9999";

    document.body.appendChild(iframe);
  }

  return iframe;
};

// Render an iframe for Onboarding in a modal experience
export const renderModalOnboardingFrame = ({
  apiHost,
  pathname,
}: {
  apiHost: string;
  pathname: string;
}) => {
  const route = pathname.startsWith(MODAL_ONBOARDING_PATH_PREFIX)
    ? pathname
    : `${MODAL_ONBOARDING_PATH_PREFIX}/${pathname}`;

  const src = `${apiHost}${route.replaceAll("//", "/")}`;

  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.setAttribute("allowtransparency", "true");

  iframe.style.border = "none";
  iframe.style.boxSizing = "border-box";
  iframe.style.backgroundColor = "transparent";
  iframe.style.colorScheme = "auto";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.position = "fixed";
  iframe.style.left = "0";
  iframe.style.top = "0";
  iframe.style.zIndex = "9999";

  document.body.appendChild(iframe);

  return iframe;
};
