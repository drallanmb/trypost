import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createSSRApp, defineComponent, h, reactive } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { nodeComponent } from '../../resources/js/lib/automationNodeComponent.ts';

test('the adapter forwards node data, selection, and callbacks unchanged', async () => {
    const data = { title: 'Scheduled post' };
    const update = () => {};
    let received;
    const node = defineComponent({
        props: ['data', 'selected'],
        setup(props, { attrs }) {
            received = { data: props.data, selected: props.selected, ...attrs };
            return () => h('div');
        },
    });

    await renderToString(
        createSSRApp(nodeComponent(node), {
            id: 'node-1',
            data,
            selected: true,
            onUpdateNodeInternals: update,
        }),
    );

    assert.equal(received.id, 'node-1');
    assert.equal(received.data, data);
    assert.equal(received.selected, true);
    assert.equal(received.onUpdateNodeInternals, update);
});

test('the adapter renders the same attributes as the original node', async () => {
    const node = defineComponent({
        props: ['selected'],
        setup: (props) => () =>
            h('div', { class: props.selected ? 'selected' : '' }, 'Node'),
    });
    const props = {
        selected: true,
        class: 'canvas-node',
        style: { color: 'red' },
        'data-node': 'node-1',
    };

    const direct = await renderToString(createSSRApp(node, props));
    const adapted = await renderToString(
        createSSRApp(nodeComponent(node), props),
    );

    assert.equal(adapted, direct);
});

test('the node registry retains raw renderer identity in reactive state', () => {
    const renderer = nodeComponent(defineComponent({ render: () => h('div') }));
    assert.equal(reactive({ renderer }).renderer, renderer);
});
