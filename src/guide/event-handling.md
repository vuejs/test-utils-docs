# Event Handling

Vue components interact with each other via props and by emitting events by calling `$emit`. In this guide, we look at how to verify events are correctly emitted using the `emitted()` function.

## The Counter component

Here is a simple `<Counter>` component. It features a button that, when clicked, increments an internal count variable and emits its value:

```js
const Counter = {
  template: '<button @click="handleClick">Increment</button>',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count += 1
      this.$emit('increment', this.count)
    }
  }
}
```

To fully test this component, we should verify that when the button is clicked, the `count` shown in the template is updated. We can also verify that an `increment` event with the latest `count` value is emitted. We will start with the latter.

## Asserting the emitted events

`VueWrapper` has an `emitted()` method. It returns an object with all the events the component has emitted, and their arguments in an array. Let's see how it works:

```js
test('emits an event with count when clicked', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')

  console.log(wrapper.emitted()) // { increment: [ [ 1 ], [ 2 ], [ 3 ] ] }
})
```

> If you haven't seen `trigger()` before, don't worry. It's used to simulate user interaction. You can learn more in [Forms](/guide/forms).

The output of `emitted()` might be a little confusing at first. In this test, we are only interested in the `increment` event, so we can access that with `wrapper.emitted('increment')`. This would return `[ [ 1 ], [ 2 ], [ 3 ] ]`. Let's format it a bit more nicely to see what's going on:

```js
// console.log(wrapper.emitted('increment'))
[
  [ 1 ], // first time it is called, `count` is 1
  [ 2 ], // second time it is called, `count` is 2
  [ 3 ], // third time it is called, `count` is 3
]
```

Each entry in the array represents one `increment` event that was emitted. Each entry in the array represents an argument to `this.$emit()`. For example, if the code was `this.$emit('increment, this.count, { status: 'success' })`, and the button was clicked twice, `emitted('increment')` would be:

```js
[
  [                       // first `increment` event
    1,                    // first argument
    { status: 'success' } // second argument
  ],
  [                       // second `increment` event
    2,                    // first argument
    { status: 'success' } // second argument
  ]
]
```

 Each element in the array corresponds to an argument in `this.$emit`.

## Writing a Test

Now we know that `emitted('eventName')` captures the events, we can write a simple test to assert an `increment` event is emitted:

```js
test('emits and event with count when clicked', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')

  // Assert emitted() returns an object with the 'increment' key
  expect(wrapper.emitted()).toHaveProperty('increment')
})
```

This is good - but we can do better. With the knowledge that `increment` will return an array, where each element represents an event and its arguments, we can fully test the component by making assertions against the arguments passed when `this.$emit('increment')` is called:

```js
test('emits and event with count when clicked', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')

  // We clicked three times, so `increment` should contain 3 items
  expect(wrapper.emitted('increment')).toHaveLength(3)

  expect(wrapper.emitted('increment')[0]).toEqual([1])
  expect(wrapper.emitted('increment')[1]).toEqual([2])
  expect(wrapper.emitted('increment')[2]).toEqual([3])
})
```

## Composition API

If you are using the Composition API, you will be calling `context.emit()` instead of `this.$emit()`. `emitted()` captures events from both, so you can test your component using the same techniques described here.

## Conclusion

- Use `emitted()` to access the events emitted from a Vue component.
- `emitted(eventName)` returns an array, where each element represents one event emitted.
- Arguments are stored in `emitted(eventName)[index]` in an array in the same order they are emitted.
