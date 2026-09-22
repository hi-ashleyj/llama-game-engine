import type { Component, ComponentProps } from "svelte";
import Wrapper, { type ChildProps } from "./vite/Wrapper.svelte";

export const wrap = (target: Component<ChildProps>, options: Omit<ComponentProps<typeof Wrapper>, "Client">) => {
    return ((internals, props) => {
        return Wrapper(internals, { ...props, ...options, Client: target });
    }) satisfies Component;
}