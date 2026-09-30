import type { Component } from "svelte";
import Wrapper, { type ChildProps, type Props } from "./Wrapper.svelte";

export const wrap = (target: Component<ChildProps>, options: Omit<Props, "Client">): Component => {
    return ((internals, props) => {
        return Wrapper(internals, { ...props, ...options, Client: target });
    });
}