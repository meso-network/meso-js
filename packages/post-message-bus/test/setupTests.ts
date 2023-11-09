export const PARTNER_APP_ORIGIN = "http://partner.app";
export const MESO_IFRAME_ORIGIN = "http://meso.iframe";

beforeAll(() => {
  const ancestorWindow = Object.create(window);
  Object.defineProperty(ancestorWindow, "location", {
    value: {
      origin: PARTNER_APP_ORIGIN,
    },
  });

  global.window = Object.create(window);
  const url = MESO_IFRAME_ORIGIN;
  Object.defineProperty(window, "location", {
    value: {
      href: url,
      ancestorOrigins: [ancestorWindow.location.origin],
    },
    writable: true,
  });
});
