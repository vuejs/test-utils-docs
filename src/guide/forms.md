# Form handling

Forms in Vue can be as simple as plain HTML forms to complicated nested trees of custom Vue component form elements. 
We will gradually go through the ways to handle simpler forms to the more complicated ones. 

The methods we will be using the most are `setValue()` and `trigger()`. 

## Interacting with form elements

Lets take a look at a basic form with a few input types.

```vue
<template>
  <div>
    <input type="email" v-model="form.email">

    <textarea v-model="form.description"/>

    <select v-model="form.city">
      <option value="new-york">New York</option>
      <option value="moscow">Moscow</option>
    </select>

    <input type="checkbox" v-model="form.subscribe"/>

    <input type="radio" value="weekly" v-model="form.interval"/>
    <input type="radio" value="monthly" v-model="form.interval"/>
    
    <button @click="submit">Submit</button>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return { 
      form: { 
        email: '',
        description: '',
        city: '',
        subscribe: false,
        interval: ''
      }
    }
  },
  methods: {
    async submit() {
      await axios.post('somePath', { email: this.email })
      console.log('success')
    }
  }
}
</script>
```

### Setting element values

The most common way to bind an input to data in Vue is by using `v-model`. As you know it takes care of what events each form element emits,
and the props it accepts, making it easy for us to work with form elements.

To change the value of an input in VTU, you can use the `setValue()` method. It accepts a parameter, most often a `string` or a `boolean`, and returns a `Promise`, which resolves when the change is applied to the DOM.

```js
wrapper.find('input').setValue('VueTestUtils')
```

The same way we can set the values in all the inputs on the form.

```js
import { mount } from '@vue/test-utils'
import FormComponent from './FormComponent.vue'

test('submits a form', async () => {
  const wrapper = mount(FormComponent)
  await wrapper.find('input[type=email]').setValue('name@mail.com')
  await wrapper.find('textarea').setValue('Lorem ipsum dolor sit amet')
  await wrapper.find('select').setValue('moscow')
  await wrapper.find('input[type=checkbox]').setValue()
  await wrapper.find('input[type=radio][value=monthly]').setValue()
})
```

As you can see, `setValue` is a very versatile method, it can work with all types of form elements.

We are using `await` to make sure that each change has been applied before we set the next. This is a good practice to follow,
that can save you time later on, if you do assertions but changes are not applied to the DOM yet.

::: tip
If you dont pass a parameter, for `OPTION`, `CHECKBOX` or `RADIO` inputs, it will set them as `checked`. 
:::

### Triggering complex event listeners

- focus
- blur
- passing data to trigger
- keydown and similar complicated events 

## Asserting form data is set

* Dont assert vm.form if possible
* Assert the outcome (submitted data, emitted event, conditional elements etc)

## Asserting form validations

* Assert validation status in DOM via text and classes
* Without external libs
* Async validators (mock them)
* Using a library (Vuelidate) - simple example

## Interacting with Vue Component inputs

* Find their inputs, use setValue
* in complex cases use a stub to simplify input
* findComponent().vm.$emit() to emit the expected input value from the component
* `setValue` on `vueWrapper` (TODO: explore implementation with `v-model` and `emits` property)
    * `setValue(value)` can alias `$emit('update:modelValue', value)`
    * `setValue('prop', value)` can alias `$emit('update:prop', value)`
