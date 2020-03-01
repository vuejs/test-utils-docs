# API Reference

## Mounting Options

When using `mount`, you can predefine the component's state using mounting options.

### `props`

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

### `slots`

```vue
<template>
  <slot name="foo" />
  <slot />
</template>
```

```js
test('slots - default and named', () => {
  const wrapper = mount(Component, {
    slots: {
      default: 'Default',
      foo: h('h1', {}, 'Named Slot')
    }
  })

  console.log(wrapper.html()) //=> '<h1>Named Slot</h1>Default'
})
```

## Wrapper

When you use `mount`, a `VueWrapper` is returned with a number of useful methods for testing. Methods like `find` return a `DOMWrapper`. Both implement the same API.


### `html`

Returns the HTML (via `outerHTML`) of an element. Useful for debugging.

```vue
<template>
  <div>
    <p>Hello world</p>
  </div>
</template>
```

```js
test('html', () => {
  const wrapper = mount(Component)

  console.log(wrapper.html()) //=> <div><p>Hello world</p></div>
})
```

### `text`

Find the text (via `textContent`) of an element.

```vue
<template>
  <div>
    <p>Hello world</p>
  </div>
</template>
```

```js
test('text', () => {
  const wrapper = mount(Component)

  expect(wrapper.find('p').text()).toBe('Hello world')
})
```

### `find`

Finds an element and returns a `DOMWrapper` if one is found. You can use the same syntax `querySelector` implements - `find` is basically an alias for `querySelector`.

```vue
<template>
  <div>
    <span>Span</span>
    <span data-test="span">Span</span>
  </div>
</template>
```

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

```js
test('findAll', () => {
  const wrapper = mount(Component)

  wrapper.findAll('[data-test="number"]') //=> found; returns array of DOMWrapper
})
```

### `trigger`

Simulates an event, for example `click`, `submit` or `keyup`. Since events often cause a re-render, `trigger` returs `Vue.nextTick`. If you expect the event to trigger a re-render, you should use `await` when you call `trigger` to ensure that Vue updates the DOM before you make an assertion.

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

```js
test('trigger', async () => {
  const wrapper = mount(Component)

  await wrapper.find('button').trigger('click')

  expect(wrapper.find('span').text()).toBe('Count: 1')
})
```

### `classes`

Returns an array of classes on an element (via `classList`).

```vue
<template>
  <div>
    <span class="my-span" />
  </div>
</template>
```

```js
test('classes', () => {
  const wrapper = mount(Component)

  expect(wrapper.find('.my-span').classes()).toContain('my-span')
})
```

### `exists`

Verify whether or not an element found via `find` exists or not.

```vue
<template>
  <div>
    <span />
  </div>
</template>
```

```js
test('exists', () => {
  const wrapper = mount(Component)

  expect(wrapper.find('span').exists()).toBe(true)
})
```

### `emitted`

Returns an object mapping events emitted from the `wrapper`. The arguments are stored in an array, so you can verify which arguments were emitted each time the event is emitted.

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
```

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

### `setChecked`

Set an input (either `type="checkbox" or `type="radio"`) to be checked or not checked. Since this will often result in a DOM re-render, `setChecked` returns `Vue.nextTick`, so you will often have to call this with `await` to ensure the DOM has been updated before making an assertion. 

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
```

```js
test('checked', async () => {
  const wrapper = mount(Component)

  await wrapper.find('input').setChecked(true)
  expect(wrapper.find('div')).toBeTruthy()

  await wrapper.find('input').setChecked(false)
  expect(wrapper.find('div')).toBeFalsy()
})
```
