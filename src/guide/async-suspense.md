# Asynchronous Behavior

You may have noticed some other parts of the guide using `await` when calling some methods on `wrapper`, such as `trigger` and `setValue`. What's that all about?

By now you know Vue updates reactively; when you change a value, the DOM is automatically updated to reflect the latest value. What you might not have known is that Vue does this *asynchronously*. This is in contrast to a test runner, like Jest, which runs *synchronously*. This can cause some surprsingly results in tests. Let's look at some strategies to ensure Vue is updating the DOM as expected when we run our tests.

## A Simple Example - Updating with `trigger`

Let's re-use the `<Counter>` component from [event handling](/guide/event-handling) with one change; we now render the `count` in the `template`.

```js
const Counter = {
  template: `
    Count: {{ count }}
    <button @click="handleClick">Increment</button>
  `,
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count += 1
    }
  }
}
```

Let's write a test to verify the `count` is increasing:

```js
test('increments by 1', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')

  expect(wrapper.html()).toContain('Count: 1')
})
```

Surprisingly, this fails! The reason is although `count` is increased, Vue will not update the DOM until the next "tick" or "render cycle". For this reason, the assertion will be called before Vue updates the DOM. This has to do with the concept of "marcotasks", "microtasks" and the JavaScript Event Loop. You can read more details and see a simple example [here](https://javascript.info/event-loop#macrotasks-and-microtasks).

Implementation details aside, how can we fix this? Vue actually provides a way for us to wait until the DOM is updated: `nextTick`:

```js {7}
import { nextTick } from 'vue'

test('increments by 1', async () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  await nextTick()

  expect(wrapper.html()).toContain('Count: 1')
})
```

Now the test will pass, because we ensure the next "tick" has executed updated the DOM before the assertion runs. Since `await nextTick()` is common, VTU provides a shortcut. Methods than cause the DOM to update, such as `trigger` and `setValue` return `nextTick`! So you can just `await` those directly:

```js {4}
test('increments by 1', async () => {
  const wrapper = mount(Counter)

  await wrapper.find('button').trigger('click')

  expect(wrapper.html()).toContain('Count: 1')
})
```

## Resolving Other Asynchronous Behavior

`nextTick` is useful to ensure some change in reactivty data is reflected in the DOM before continuing the test. However, sometimes you may want to ensure other, non Vue-related asynchronous behavior is completed, too. A common example is a function that returns a `Promise` that will lead to a change in the DOM. Perhaps you mocked your `axios` HTTP client using `jest.mock`:

```js
jest.mock('axios', () => ({
  get: () => Promise.resolve({ data: 'some mocked data!' })
}))
```

In this case, Vue and `nextTick` has no knowledge of the unresolved promise, so calling `nextTick` will not work - your assertion may run before the `Promise` is resolved. For scenarios like this, you can use `[flush-promises](https://www.npmjs.com/package/flush-promises)`, will causes all outstanding promises to resolve immediately. For example:

```js
import flushPromises from 'flush-promises'

jest.mock('axios', () => ({
  get: () => new Promise(resolve => {
    resolve({ data: 'some mocked data!' })
  })
}))


test('uses a mocked axios HTTP client and flush-promises', async () => {
  // some component that makes a HTTP called in `created` using `axios`
  const wrapper = mount(AxiosComponent)

  await flushPromses() // axios promise is resolved immediately!
  
  // assertions!
})

```

## Conclusion

- Vue updates the DOM asynchronously; tests runner execute code synchronously.
- Use `await nextTick()` to ensure the DOM has updated before the test continues
- Functions that might update the DOM, like `trigger` and `setValue` return `nextTick`, so you may prepend `await` instead of importing and using `nextTick`.
- Use `flush-promises` to resolve any unresolved promises from non-Vue dependencies. 