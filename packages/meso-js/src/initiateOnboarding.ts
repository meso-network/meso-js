// TODO: Find a better name for this module/export
export const initiateOnboarding = () => {
  // TODO: Dynamically set the host
  const src = `http://localhost:4001/onboarding`;

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
