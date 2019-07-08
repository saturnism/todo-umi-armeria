import {grpc} from "@improbable-eng/grpc-web";

const transport = grpc.CrossBrowserHttpTransport({ withCredentials: true });
grpc.setDefaultTransport(transport);

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
    },
  },
};


