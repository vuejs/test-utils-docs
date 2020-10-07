# Migration

A review of changes VTU 1 -> VTU 2, and some code snippets to showcase required modifications.

## Changes

### `propsData` is now `props`

In VTU v1, you would pass props using the `propsData` mounting option. This was confusing, because you declare props inside of the `props` option in your Vue components. Now you can pass `props` using the `props` mounting option. `propsData` is and will continue to be supported for backwards compatibility.

**Before**:

```js
const App = { 
  props: ['foo']
}

const mount(App, {
  propsData: {
    foo: 'bar'
  }
}
```

**After**:

```js
const App = { 
  props: ['foo']
}

const mount(App, {
  props: {
    foo: 'bar'
  }
}
```

### No more `createLocalVue`

In Vue 2, it was common for plugins to mutate the global Vue instance and attach various methods to the prototype. As of Vue 3, this is no longer the case - you create a new Vue app using `createApp` as opposed to `new Vue`. Each app created with `createLocalVue` has it's own Vue instance.

In practice, most cases where you would previously use `createLocalVue` and the `localVue` mounting option, you now use the [`global` mounting option](/v2/api/#global-components). Here is an example of a component and test that used `localVue`, and how it now looks (using `global.plugins`, since Vuex is a plugin):

**Before**:

```js
import Vuex from 'vuex'
import { createLocalVue, mount } from '@vue/test-utils'

const App = {
  computed: {
    count() {
      return this.$state.count
    } 
  }
}

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store({
  state: {
    return { count: 1 }
  }
})

const wrapper = mount(App, {
  store
  localVue
})
```

**After**:

```js
import { createStore } from 'vuex'
import { createLocalVue, mount } from '@vue/test-utils'

const App = {
  computed: {
    count() {
      return this.$state.count
    } 
  }
}

const store = createStore({
  state() {
    return { count: 1 }
  }
})

const wrapper = mount(App, {
  global: {
    plugins: [store]
  }
})
```

### `mocks` and `stubs` are now in `global`

`mocks` and `stubs` are applied to all components, not just the one you are passing to `mount`. To reflect this, `mocks` and `stubs` are in the new `global` mounting option:

**Before**:

```js
const $route = {
  params: {
    id: '1'
  }
}

const mount(App, {
  stubs: {
    Foo: true
  },
  mocks: {
    $route
  }
}
```

**After**:

```js
const $route = {
  params: {
    id: '1'
  }
}

const mount(App, {
  global: {
    stubs: {
      Foo: true
    },
    mocks: {
      $route
    }
  }
}
```

### renderDefaultStub

TODO: Write about this

### `destroy` is now `unmount` to match Vue 3 

TODO: Write about this

### `scopedSlots` is now merged with `slots` 

TODO: Write about this
