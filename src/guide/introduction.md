## Introduction

Welcome to Vue Test Utils! This is the documentation for the `vue-test-utils-next` repository, found [here](https://github.com/vuejs/vue-test-utils-next/), which targets Vue.js 3 (aka `vue-next`, found [here](https://github.com/vuejs/vue-next/)).

## What is Vue Test Utils?

Vue Test Utils (VTU) is a set of utility functions that aim to simplify the process of testing Vue.js components. It provides some methods to render and interact with your components in an isolated manner. Let's see an example:

```js
import { mount } from 'vue-test-utils-next'

const Hello = {
  template: '<div>{{ msg }}</div>',
  props: {
    msg: {
      type: String
    }
  }
}

test('it renders a message', () => {
  const wrapper = mount(Hello, {
    props: {
      msg: 'Hello world'
    }
  })
  
  expect(wrapper.html()).toContain('Hello world')
})
```

We use the `mount` method to render the `<Hello>` component. The first argument is the component we want to render - in this case, the `<Hello>` component. The second argument is an object of options. We use the `props` mounting option to set the `msg` prop. 

`mount` returns a "wrapper" - a thin layer around your Vue component, with useful methods such as `html`, which we use to assert that the `msg` prop is rendered correctly.

## What Next?

If you want to see what else Vue Test Utils can do, take the crash course [here](/guide/a-crash-course/), where we use Test Driven Development (TDD) and Vue Test Utils to build a simple Todo app.

Alternatively, explore the full API [here](/api/).
