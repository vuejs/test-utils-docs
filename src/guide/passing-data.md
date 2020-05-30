# Passing Data to Components

Vue Test Utils provides several ways to set data and props on a component, to allow you to fully test the component's behavior in different scenarios.

In this section, we explore the `data` and `props` mounting options, as well as `VueWrapper.setProps()` to dynamically update the props a component receives.

## The Password Component

We will demonstrate the above features by building a `<Password>` component. This component verifies a password means certain criteria, such as length and complexity. We will start with the following and add features, as well as tests to make sure the features are working correctly:

```js
const Password = {
  template: `
    <div>
      <input v-model="password">
    </div>
  `,
  data() {
    return {
      password: ''
    }
  }
}
```

The first requirement we will add is a minimum length.

## Using `props` to set a minimum length

We want to reuse this component in all our projects, each of which may have different requirements. For this reason, we will make the `minLength` a **prop** which we pass to `<Password>`:

```js
props: {
  minLength: {
    type: Number
  }
}
```

We will show an error is `password` is less than `minLength`. We can do this by creating an `error` computed property, and conditionally rendering it using `v-if`:

```js
computed: {
  error() {
    if (this.password.length < this.minLength) {
      return `Password must be at least ${this.minLength} characters.`
    }
    return
  }
}
```

Finally, use `v-if` to render it:

```js
template: `
  <div>
    <input v-model="password">
    <div v-if="error">{{ error }}</div>
  </div>
`
```

To test this, we need to set the `minLength`, as well as a `password` that is less than that number. We can do this using the `data` and `props` mounting options. Finally, we will assert the correct error message is rendered:

```js
test('renders an error if length is too short', () => {
  const wrapper = mount(Password, {
    props: {
      minLength: 10
    },
    data() {
      return {
        password: 'short'
      }
    }
  })

  expect(wrapper.html()).toContain('Password must be at least 10 characters')
})
```

Writing a test for a `maxLength` rule is left as an exercise for the reader!

## Using `setProps`

Sometimes you may need to write a test for a side effect of a prop changing. This simple `<Post>` component renders a `postId` prop. Using `watch`, it fetches a resource using the `axios` HTTP client:

```vue
<template>
  <div>{{ postId }}</div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    postId: {
      type: Number
    }
  },
  watch: {
    postId(id) {
      axios.get(`/api/posts/${id}`)
    }
  }
}
</script>
```

To test this fully, we might want to verify the original `postId` prop is rendered, and when the `postId` prop changes, the `axios` request is triggered, the new `propId` is rendered in the DOM. We are able to update a prop using `setProps()`:

```js
import { mount } from '@vue/test-utils'
import axios from 'axios'
import Post from './Post.vue'

jest.mock('axios', () => ({
  get: jest.fn()
}))

test('fetches a post when postId changes', async () => {
  const wrapper = mount(Post, {
    props: {
      postId: 1
    }
  })
  expect(wrapper.html()).toContain(1)

  await wrapper.setProps({ postId: 2 })

  expect(wrapper.html()).toContain(2)
  expect(axios.get).toHaveBeenCalledWith('/api/posts/2')
})
```

We also use the `await` keyword when calling `setProps()`, to ensure that the DOM has been updated before the assertions run. We also used `jest.mock` to mock the `axios` module. This let's us easily verify that `axios.get()` was called with the correct URL, as well as avoid needing a real HTTP server to run the test.

## Conclusion

- use the `props` and `data` mounting options to pre-set the state of a component.
- Use `setProps()` to update a prop during a test.
- Use the `await` keyword before `setProps()` to ensure the Vue will update the DOM before the test continues.
