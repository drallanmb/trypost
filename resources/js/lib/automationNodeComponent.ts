import type { NodeProps } from '@vue-flow/core';
import { h, markRaw, type Component, type FunctionalComponent } from 'vue';

export const nodeComponent = (
    component: Component,
): FunctionalComponent<NodeProps> => {
    const renderer: FunctionalComponent<NodeProps> = (props) =>
        h(component, { ...props });
    renderer.inheritAttrs = false;

    return markRaw(renderer);
};
