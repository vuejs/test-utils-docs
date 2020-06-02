# Making HTTP requests

Vue Test Utils does not offer any unique feature when it comes to handling HTTP requests. However, it is an important feature to test, and there are a few gotchas we want to highlight.

In this section, we explore some possibilities to perform, mock, and assert HTTP requests.

## A list of blog posts

Let's start with a basic use case. The following `PostList` component renders a list of blog posts fetched from an external API. To get these posts, the component features a `button` element that triggers the request:

```vue
<template>
  <div>
    <button @click="getPosts">Get posts</button>

    <ul>
      <li v-for="post in posts" :key="post.id" data-test="post">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      posts: null
    }
  },
  methods: {
    async getPosts() {
      this.posts = await axios.get('/api/posts')
    }
  }
}
</script>
```

There are several things we need to do to test this component properly.

Our first goal is to test this component **without actually hitting the API**. This would create a fragile and potentially slow test. You should be able to run your test suite while being offline.

Secondly, we need to assert that the component made the right call with the appropriate parameters. We won't be getting posts from that API, but we still need to ensure we requested the right resources.

Also, we need to make sure that the DOM has updated accordingly and displays the data. We do so by using `flushPromises()` from the npm package [flush-promises](https://github.com/kentor/flush-promises).

```js
import { mount } from '@vue/test-utils'
import axios from 'axios'
import flushPromises from 'flush-promises'
import PostList from './PostList.vue'

const fakePostList = [
  { id: 1, title: 'title1' },
  { id: 2, title: 'title2' }
]

// This tells Jest to mock any call to `axios.get` – and that it should return
// `fakePostList` instead
jest.mock('axios', () => ({
  get: jest.fn(() => fakePostList)
}))

test('loads posts on button click', async () => {
  const wrapper = mount(PostList)

  await wrapper.get('button').trigger('click')

  // Let's assert that we've called axios.get the right amount of times and
  // with the right parameters
  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get).toHaveBeenCalledWith('/api/posts')

  // Wait until the DOM updates
  await flushPromises()

  // Finally, we make sure we've rendered the content from the API
  const posts = wrapper.findAll('[data-test="post"]')

  expect(posts).toHaveLength(2)
  expect(posts[0].text()).toContain('title1')
  expect(posts[1].text()).toContain('title2')
})
```

Notice how we awaited `flushPromises` before asserting that the Component updated with the content from the API.

:::tip Alternatives to jest.mock()
There are several ways of setting mocks in Jest. The one used in the example above is the simplest. For more powerful alternatives, you might want to check out [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) or [msw](https://github.com/mswjs/msw), among others.
:::

### Asserting loading state

Now, this `PostList` component is pretty useful, but it lacks some other awesome features. Let's expand it to make it display a fancy message while loading our posts!

Also, let's disable the `<button>` element while loading, too. We don't want users to keep sending requests while fetching!

```vue {2,4,19,24,28}
<template>
    <button :disabled="loading" @click="getPosts">Get posts</button>

    <p v-if="loading" role="alert" aria-busy="true">Loading your posts…</p>
    <ul v-else>
      <li v-for="post in posts" :key="post.id" data-test="post">
        {{ post.title }}
      </li>
    </ul>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      posts: null,
      loading: false
    }
  },
  methods: {
    async getPosts() {
      this.loading = true

      this.posts = await axios.get('/api/posts')

      this.loading = false
    }
  }
}
</script>
```

Let's write a test to assert that all the loading-related elements are rendered on time.


```js
test('displays loading state on button click', async () => {
  const wrapper = mount(PostList)

  // Initially, we're in a state where the button has not triggered the API call,
  // so the component should not render any loading-related element.
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.get('button').attributes()).not.toHaveProperty('disabled')

  // Now let's trigger it as usual
  await wrapper.get('button').trigger('click')

  // We assert for "Loading state" before flushing all promises
  expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  expect(wrapper.get('button').attributes()).toHaveProperty('disabled')

  await flushPromises()

  // After flushing promises, we're back at "Loaded state"
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.get('button').attributes()).not.toHaveProperty('disabled')
})
```

## HTTP requests from Vuex

A typical scenario for more complex applications is to trigger a Vuex action that performs the HTTP request.

This is no different from the example outlined above. We might want to load the store as is and mock services such as `axios`. This way, we're mocking our system's boundaries, thus achieving a higher degree of confidence in our tests.

You can check out the [Testing Vuex](../guide/vuex.md) docs for more information on testing Vuex with Vue Test Utils.

## Conclusion

- Vue Test Utils does not require special tools to test HTTP requests. The only thing to take into account is that we're testing asynchronous behavior.
- Tests must not depend on external services. Use mocking tools such as `jest.mock` to avoid it.
- `flushPromises()` is a useful tool to make sure the DOM updates after an async operation.
- Directly triggering HTTP requests by interacting with the component makes your test more resilient.