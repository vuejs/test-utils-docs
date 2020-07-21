## Testing Vuex

Vuex is just an implementation detail; no special treatment is required for testing components using Vuex. That said, there are some techniques that might make your tests easier to read and write. We will look at those here.

This guide you assumed you are familiar with Vuex. Vuex 4 is the version that works with Vue.js 3. Read the docs [here](https://vuex.vuejs.org/).

## A Simple Example

Here is a simple Vuex store, and a component that relies on a Vuex store been present:

```js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      count: 0
    }
  },
  mutations: {
    increment(state: any) {
      state.count += 1
    }
  }
})
```

The store simply stores a count, increasing it when the `increment` mutation is committed. This is the component we will be testing:

```js
const App = {
  template: `
    <div>
      <button @click="increment" />
      Count: {{ count }}
    </div>
  `,
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment')
    }
  }
}
```

## Testing with a Real Vuex Store

To full test this component (and the Vuex store) are working, we will click on the `<button>` and assert the count is increased. In your Vue applications, usually in `main.js`, you install Vuex like this:

```js
const app = createApp(App)
app.use(store)
```

This is because Vuex is a plugin. Plugins are applied by calling `app.use` and passing in the plugin.

Vue Test Utils allows you to install plugins as well, using the `global.plugins` mounting option.

```js
test('vuex', async () => {
  const wrapper = mount(App, {
    global: {
      plugins: [store]
    }
  })

  await wrapper.find('button').trigger('click')

  expect(wrapper.html()).toContain('Count: 1')
})
```

After installing the plugin, we use `trigger` to click the button and assert that `count` is increased. This kind of test, that fully covers the entire system, is known as an integration test. 

## Testing with a Mock Store

In contrast, a unit test might isolate and test the component and the store separately. This can be useful if you have a very large application with a complex store. For this use case, you can just mock the parts of the store you are interested in using `global.mocks`:

```js
test('vuex using a mock store', async () => {
  const $store = {
    state: {
      count: 1
    },
    commit: jest.fn()
  }

  const wrapper = mount(App, {
    global: {
      mocks: {
        $store
      }
    }
  })

  expect(wrapper.html()).toContain('Count: 1')
  await wrapper.find('button').trigger('click')
  expect($store.commit).toHaveBeenCalled()
})
```

Instead of using a real Vuex store and installing it via `global.plugins`, we instead created our own mock store, only implementing the parts of Vuex used in the component (the `state` and `commit` function). While this might seem more convenient, it won't give you any warning if you break your Vuex store. Consider carefully if you want to mock the Vuex store, or use a real one, and understand the trade-offs.

## Testing Vuex in Isolation

You may want to test your Vuex mutations or actions in total isolation, especially if they are complex. You don't need Vue Test Utils for this, since a Vuex store is just regular JavaScript. Here's how you might test `increment` mutation without Vue Test Utils:

```js
test('increment mutation', () => {
  const store = createStore({
    state: {
      count: 0
    },
    mutations: {
      increment(state) {
        state.count += 1
      }
    }
  })

  store.commit('increment')
  
  expect(store.state.count).toBe(1)
})
```

## Presetting the Vuex State

Sometimes it can be useful to have the Vuex store in a specific state for a test. One useful technique you can use, other that `global.mocks`, is to simply allow your `createStore` function to take an argument that seeds the initial state:

```js
test('increment mutation', () => {
  const createVuexStore = (initialState) => createStore({
    state: {
      count: 0,
      ...initialState
    },
    mutations: {
      increment(state) {
        state.count += 1
      }
    }
  })

  const store = createVuexStore({ count: 20 })
  store.commit('increment')
  
  expect(store.state.count).toBe(21)
})
```

The [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/testing-vuex.html) has more examples for testing Vuex. Note: the examples pertain to Vue.js 2 and Vue Test Utils v1. The ideas and concepts are the same, and the Vue Testing Handbook will be updated for Vue.js 3 and Vue Test Utils 2 in the near future.

## Conclusion

- Use `global.plugins` to install a plugin
- Use `global.mocks` to mock a global object, such as Vuex, for advanced use cases
- Consider testing complex Vuex mutations and actions in isolation 
- Allow your `createStore` function to take an `initialState` argument to set up specific test scenarios
