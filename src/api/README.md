# API Reference

## Mounting Options

When using `mount`, you can predefine the component's state using mounting options.

### `props`

Used to set props on a component when mounted.

`Component.vue`:

```vue
<template>
  <span>Count: {{ count }}</span>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true
    }
  }
}
</script>
```

`Component.spec.js`:

```js
test('props', () => {
  const wrapper = mount(Component, {
    props: {
      count: 5
    }
  })

  console.log(wrapper.html()) //=> '<span>Count: 5</span>'
})
```

### `data`

Overrides a component's default `data`. Must be a function:

`Component.vue`

```vue
<template>
  <div>Foo is {{ foo }}</div>
</template>

<script>
export default {
  data() {
    return {
      foo: 'foo'
    }
  }
}
</script>
```

`Component.spec.js`:

```js
test('overrides data', () => {
  const wrapper = mount(Component, {
    data() {
      return {
        foo: 'bar'
      }
    }
  })

  console.log(wrapper.html()) //=> '<div>Foo is bar</div>'
})
```

### `slots`

Provide values for slots on a component. Slots can be a component imported from a `.vue` file or a render function. Currently providing an object with a `template` key is not supported. This may be supported in the future.

`Component.vue`:

```vue
<template>
  <slot name="foo" />
  <slot />
  <slot name="bar" />
</template>
```

`Component.spec.js`:

```js
import Bar from './Bar.vue'

test('slots - default and named', () => {
  const wrapper = mount(Component, {
    slots: {
      default: 'Default',
      foo: h('h1', {}, 'Named Slot'),
      bar: Bar
    }
  })

  console.log(wrapper.html()) //=> '<h1>Named Slot</h1>Default<div>Bar</div>'
})
```

## Global

You can provide properties to the App instance using the properties under the `global` mount property.

### `global.provide`

Provides data to be received in a `setup` function via `inject`.

`Component.vue`:

```vue
<template>
  <div>Theme is {{ theme }}</div>
</template>

<script>
import { inject } from 'vue'

export default {
  setup() {
    const theme = inject('Theme')
    return {
      theme
    }
  }
}
</script>
```

`Component.spec.js`:

```js
test('injects dark theme via provide mounting option', () => {
  const wrapper = mount(Component, {
    global: {
      provide: {
        'Theme': 'dark'
      }
    }
  })

  console.log(wrapper.html()) //=> <div>Theme is dark</div>
})
```

Note: If you are using a ES6 `Symbol` for your provide key, you can use it as a dynamic key:

`Component.spec.js`:

```js
const ThemeSymbol = Symbol()

mount(Component, {
  global: {
    provide: {
      [ThemeSymbol]: 'value'
    }
  }
})
```

### `global.mixins`

Applies mixins via `app.mixin(...)`.

`Component.vue`:

```vue
<template>
  <div />
</template>

<script>
export default {}
</script>
```

`Component.spec.js`:

```js
test('adds a lifecycle mixin', () => {
  const mixin = {
    created() {
      console.log('Component was created!')
    }
  }

  const wrapper = mount(Component, {
    global: {
      mixins: [mixin]
    }
  })

  // 'Component was created!' will be logged
})
```

### `global.plugins`

Installs plugins on the component.

`Component.vue`:

```vue
<template>
  <div />
</template>

<script>
export default {}
</script>
```

`Component.spec.js`:

```js
test('installs a plugin via `plugins`', () => {
  const installed = jest.fn()
  class Plugin {
    static install() {
      installed()
    }
  }

  mount(Component, {
    global: {
      plugins: [Plugin]
    }
  })

  expect(installed).toHaveBeenCalled()
})
```

### `global.components`

Registers components globally to all components

`Component.spec.js`:

```js
test('installs a component globally', () => {
  import GlobalComponent from '@/components/GlobalComponent'

  const Component = {
    template: '<div><global-component/></div>'
  }
  const wrapper = mount(Component, {
    global: {
      components: {
        GlobalComponent
      }
    }
  })

  expect(wrapper.find('.global-component').exists()).toBe(true)
})
```

### `global.directives`

Registers a directive globally to all components

`Component.spec.js`:

```js
test('installs a directive globally', () => {
  import Directive from '@/directives/Directive'

  const Component = {
    template: '<div v-bar>Foo</div>'
  }
  const wrapper = mount(Component, {
    global: {
      directives: {
        Bar: Directive
      }
    }
  })

  expect(wrapper.classes()).toContain('added-by-bar')
})
```

### `global.mocks`

Mocks a global instance property. Can be used for mocking out `this.$store`, `this.$router` etc.

> Note: this is designed to mock variables injected by third party plugins, not Vue's native properties such as $root, $children, etc.

`Component.vue`:

```vue
<template>
  <p>{{ count }}</p>
  <button @click="increment" />
</template>

<script>
export default {
  computed: {
    count() {
      return this.$store.state.count
    }
  },

  methods: {
    increment() {
      this.$store.dispatch('inc')
    }
  }
}
</script>
```

`Component.spec.js`:

```js
test('mocks a vuex store', async () => {
  const $store = {
    state: {
      count: 1
    },
    dispatch: jest.fn()
  }

  const wrapper = mount(Component, {
    global: {
      mocks: {
        $store
      }
    }
  })

  expect(wrapper.html()).toContain('count: 1')

  await wrapper.find('button').trigger('click')

  expect($store.dispatch).toHaveBeenCalledWith('inc')
})
```


## Wrapper

When you use `mount`, a `VueWrapper` is returned with a number of useful methods for testing. A `VueWrapper` is a thin wrapper around your component instance. Methods like `find` return a `DOMWrapper`, which is a thin wrapper around the DOM nodes in your component and it's children. Both implement a similar same API.


### `html`

Returns the HTML (via `outerHTML`) of an element. Useful for debugging.

`Component.vue`:

```vue
<template>
  <div>
    <p>Hello world</p>
  </div>
</template>
```

`Component.spec.js`:

```js
test('html', () => {
  const wrapper = mount(Component)

  console.log(wrapper.html()) //=> <div><p>Hello world</p></div>
})
```

### `text`

Returns the text (via `textContent`) of an element.

`Component.vue`:

```vue
<template>
  <div>
    <p>Hello world</p>
  </div>
</template>
```

`Component.spec.js`:

```js
test('text', () => {
  const wrapper = mount(Component)

  expect(wrapper.find('p').text()).toBe('Hello world')
})
```

### `find`

Finds an element and returns a `DOMWrapper` if one is found. You can use the same syntax `querySelector` implements - `find` is basically an alias for `querySelector`.

`Component.vue`:

```vue
<template>
  <div>
    <span>Span</span>
    <span data-test="span">Span</span>
  </div>
</template>
```

`Component.spec.js`:

```js
test('find', () => {
  const wrapper = mount(Component)

  wrapper.find('span') //=> found; returns DOMWrapper
  wrapper.find('[data-test="span"]') //=> found; returns DOMWrapper
  wrapper.find('p') //=> nothing found; returns ErrorWrapper
})
```

### `findAll`

Similar to `find`, but instead returns an array of `DOMWrapper`.

`Component.vue`:

```vue
<template>
  <div>
    <span
      v-for="number in [1, 2, 3]"
      :key="number"
      data-test="number"
    >
      {{ number }}
    </span>
  </div>
</template>
```

`Component.spec.js`:

```js
test('findAll', () => {
  const wrapper = mount(Component)

  wrapper.findAll('[data-test="number"]') //=> found; returns array of DOMWrapper
})
```

### `trigger`

Triggers an event, for example `click`, `submit` or `keyup`. Since events often cause a re-render, `trigger` returns `Vue.nextTick`. If you expect the event to trigger a re-render, you should use `await` when you call `trigger` to ensure that Vue updates the DOM before you make an assertion.

`Component.vue`:

```vue
<template>
  <div>
    <span>Count: {{ count }}</span>
    <button @click="count++">Greet</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>
```

`Component.spec.js`:

```js
test('trigger', async () => {
  const wrapper = mount(Component)

  await wrapper.find('button').trigger('click')

  expect(wrapper.find('span').text()).toBe('Count: 1')
})
```

### `classes`

Returns an array of classes on an element (via `classList`).

`Component.vue`:

```vue
<template>
  <div>
    <span class="my-span" />
  </div>
</template>
```

`Component.spec.js`:

```js
test('classes', () => {
  const wrapper = mount(Component)

  expect(wrapper.find('.my-span').classes()).toContain('my-span')
})
```

### `exists`

Verify whether or not an element found via `find` exists or not.

`Component.vue`:

```vue
<template>
  <div>
    <span />
  </div>
</template>
```

`Component.spec.js`:

```js
test('exists', () => {
  const wrapper = mount(Component)

  expect(wrapper.find('span').exists()).toBe(true)
})
```

### `attributes`

Returns attributes on a DOM node (via `element.attributes`).

`Component.vue`:

```vue
<template>
  <div id="foo" :class="className" />
</template>

<script>
export default {
  data() {
    return {
      className: 'bar'
    }
  }
}
</script>
```

`Component.spec.js`:

```js
test('attributes', () => {
  const wrapper = mount(Component)

  expect(wrapper.attributes('id')).toBe('foo')
  expect(wrapper.attributes('class')).toBe('bar')
})
```

### `emitted`

A function that returns an object mapping events emitted from the `wrapper`. The arguments are stored in an array, so you can verify which arguments were emitted each time the event is emitted.

`Component.vue`:

```vue
<template>
  <div />
</template>

<script>
export default {
  created() {
    this.$emit('greet', 'hello')
    this.$emit('greet', 'goodbye')
  }
}
</script>
```

`Component.spec.js`:

```js
test('emitted', () => {
  const wrapper = mount(Component)

  console.log(wrapper.emitted())
  // {
  //   greet: [ ['hello'], ['goodbye'] ]
  // }

  expect(wrapper.emitted().greet[0]).toEqual(['hello'])
  expect(wrapper.emitted().greet[1]).toEqual(['goodbye'])
})
```

### `setProps`

Updates component props.

`setProps` returns `Vue.nextTick`, so you will have to call it with `await` to ensure the DOM has been updated before making an assertion.

`Component.vue`:

```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  props: ['message'],
}
</script>
```

`Component.spec.js`

```js
test('updates prop', async () => {
  const wrapper = mount(Component, {
    props: {
      message: 'hello'
    }
  })
  expect(wrapper.html()).toContain('hello')

  await wrapper.setProps({ message: 'goodbye' })
  expect(wrapper.html()).toContain('goodbye')
})
```

### `setValue`

Sets a value on DOM element, including:
- `<input>`
  - `type="checkbox"` and `type="radio"` are detected and will have `element.checked` set
- `<select>`
  - `<option>` is detected and will have `element.selected` set

Since this will often result in a DOM re-render, `setValue` returns `Vue.nextTick`, so you will often have to call this with `await` to ensure the DOM has been updated before making an assertion.

`Component.vue`:

```vue
<template>
  <input type="checkbox" v-model="checked" />
  <div v-if="checked">Checked</div>
</template>

<script>
export default {
  data() {
    return {
      checked: false
    }
  }
}
</script>
```

`Component.spec.js`:

```js
test('checked', async () => {
  const wrapper = mount(Component)

  await wrapper.find('input').setValue(true)
  expect(wrapper.find('div')).toBeTruthy()

  await wrapper.find('input').setValue(false)
  expect(wrapper.find('div')).toBeFalsy()
})
```
