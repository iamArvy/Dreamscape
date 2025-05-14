// types/socket.d.ts
import type { Socket } from "socket.io-client";

declare module "#app" {
  interface NuxtApp {
    $socket: Socket;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $socket: Socket;
  }
}
