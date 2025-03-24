import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";

declare module "react-router" {
  interface AppLoadContext {
    EXPRESS_CONTEXT_EXAMPLE: string;
  }
}

export const app = express();

const getContextValue = () => {
  return `Example from Express and Node@${process.version}`;
};

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        EXPRESS_CONTEXT_EXAMPLE: getContextValue(),
      };
    },
  })
);
