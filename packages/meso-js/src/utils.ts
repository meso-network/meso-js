import { Environment } from "./types";

export const apiHosts: { readonly [key in Environment]: string } = {
  [Environment.LOCAL]: "http://localhost:5173",
  [Environment.LOCAL_PROXY]: "http://localhost:4001",
  [Environment.DEV]: "https://transfer.dev.meso.plumbing",
  [Environment.PREVIEW]: "https://transfer.preview.meso.plumbing",
  [Environment.SANDBOX]: "https://transfer.sandbox.meso.network",
  [Environment.PRODUCTION]: "https://transfer.meso.network",
};

export const NOOP_TRANSFER_INSTANCE = { destroy: () => {} };
