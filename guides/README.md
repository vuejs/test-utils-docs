# Guides

Todo: Write useful guides. See [this issue](https://github.com/lmiller1990/vue-testing-framework/issues/11) for some guidance and inspiration. Remember, we are not just teaching people "this is how to use Vue Test Utils" but "this is how to test your Vue.js components".

## A Crash Course

Let's jump write into it, and learn Vue Test Utils (VTU) by building a simple Todo app, and writing tests as we go. This guide will cover:

- mounting components
- finding elements
- filling out forms
- triggering events

## Getting Started

We will start off with a simple `TodoApp` component with a single todo:

```vue
<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'TodoApp',

  data() {
    return {
      todos: [
        {
          id: 1,
          text: 'Learn Vue.js 3',
          completed: false
        }
      ]
    }
  }
}
</script>
```

## The first test - a todo is rendered

The first test we will write verifies a todo is rendered. Let's see the test first, then discuss each part:

```js
import { mount } from '@vue/test-utils-next'

import TodoApp from './TodoApp.vue'

test('renders a todo', () => {
  const wrapper = mount(TodoApp)

  expect(wrapper.find('[data-test="todo"]').text()).toBe('Learn Vue.js 3')
})
```

We start off by importing `mount` - this is the main way to render a component in VTU. You declare a test by using the `test` function with a short description of the test. The `test` function is globally available in most test runners (this example uses Jest). 

Next, we call `mount` and pass the component as the first argument - this is something almost every test you write will do. By convention, we assign the result to a variable called `wrapper`, since `mount` provides a simple "wrapper" around the app with some convinient methods for testing.

Finally, we use another global function common to many tests runner - Jest included - `expect`. The idea is we are asserting, or *expecting*, the actual output to match what we think it should be. In this case, we are finding an element with the selector `data-test="todo"` - in the DOM, this will look like `<div data-test="todo">...</div>`. We then call the `text` method to get the content, which we expect to be `'Learn Vue.js 3'`.

> Using `data-test` selectors is not required, but it can make your tests less brittle. classes and ids tend to change or move around as an application grows - by using `data-test`, it's clear to other developers which elements are used in tests, and should not be changed.

## Making the test pass

If we run this test now, it fails with the following error message: `Cannot call text on an empty wrapper.`. That's because we aren't rendering any todos, so the `find` call is failing to return a wrapper (remember, VTU wraps all components, and DOM elements, in a "wrapper" with some convinient methods). Let's update `<template>` in `TodoApp.vue` to render the `todos` array:

```vue
<template>
  <div>
    <div v-for="todo in todos" :key="todo.id" data-test="todo">
      {{ todo.text }}
    </div>
  </div>
</template>
```

With this change, the test is passing. Congratulations! You wrote your first component test.

## Adding a new todo

The next feature we will be adding is for the uesr to be able to create a new todo. To do so, we will have a `<form>` element with a `<input>` for the user to type some text. When the user submits the form, we expect the new todo to be rendered. Let's take a look at the test:

```js
test('creates a todo', () => {
  const wrapper = mount(TodoApp)
  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(1)

  wrapper.find('[data-test="new-todo"]').element.value = 'New todo'
  wrapper.find('[data-test="form"]').trigger('submit')

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2)
})
```

As usual, we start of by using `mount` to render the element. We are also asseting that only 1 todo is rendered - this makes it clear that we are adding an additional todo, as the final line of the test suggests. 

To update the `<input>`, we use `element` - this accesses the original DOM element wrapper, which is returned by `find`. `element` is useful to manipulate a DOM element in a manner that VTU does not provide any methods for.

After updating the `<input>`, we use the `trigger` method to simulate the user submitting the form. Finally, we assert the number of todos has increased from 1 to 2. 

Let's update `TodoApp.vue` to have the `<form>` and `<input>` described in the test:

```vue
<template>
  <div>
    <div v-for="todo in todos" :key="todo.id" data-test="todo">
      {{ todo.text }}
    </div>

    <form data-test="form" @submit.prevent="createTodo">
      <input data-test="new-todo" v-model="newTodo" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'TodoApp',

  data() {
    return {
      newTodo: '',
      todos: [
        {
          id: 1,
          text: 'Learn Vue.js 3',
          completed: false
        }
      ]
    }
  },

  methods: {
    createTodo() {
      this.todos.push({
        id: 2,
        text: this.newTodo,
        completed: false
      })
    }
  }
}
</script>
```

We are using `v-model` to bind to the `<input>` and `@submit` to listen for the form submission. When the form is submitted, `createTodo` is called and inserts a new todo into the `todos` array.

While this looks good, running the test showsn an error:

```
expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 1
    Received array:  [{"element": <div data-test="todo">Learn Vue.js 3</div>}]
```

The number of todos has no increased. The problem is that Jest executes tests in a synchronous manner, ending the test as soon as the final function is called. Vue, however, updates the DOM asynchronously. We need to mark the test `async`, and call `await` on any methods that might cause the DOM to change. `trigger` is one such method - we can simply prepend `await` to the `trigger` call:

```js
test('creates a todo', async () => {
  const wrapper = mount(TodoApp)

  wrapper.find('[data-test="new-todo"]').element.value = 'New todo'
  await wrapper.find('[data-test="form"]').trigger('submit')

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2)
})
```

Now the test is passing.

## Completing a todo with `setChecked`

- introduce `setChecked`
- introduce `await`, discuss async updating of the DOM
