# Write components that are easy to test

Vue Test Utils helps you write tests for Vue components. However, there's only so much VTU can do.

Following is a list of suggestions to write code that is easier to test, and to write tests that are meaningful and simple to maintain.

The following list provide general guidance. It might come in handy in common scenarios.

## Do not test implementation details

Think in terms of inputs and outputs. Roughly, this is everything you should take into account when writing a test for a Vue component:

### Inputs

**Props**: the provided prop values.

**User inputs**: user interactions such as clicking, scrolling, typing…

**Data streams**: data incoming from API calls, data subscriptions…

### Outputs

**DOM elements**: anything the component renders to the DOM.

**events**: emitted events (using `$emit`).

**side effects**: any other *observable* side effect, such as `console.log`, cookies, API calls…

### Everything else is implementation details

Notice how this list does not include elements such as internal methods, or intermediate states or data.

The rule of thumb is that **a test should not break on a refactor**, that is, when we change its internal implementation without changing its public API. If that happens, it might mean the test relies on implementation details.


## Build smaller components

A general rule of thumb is that if a component does less, then it will be easier to test.

That being said


### Extract API calls

:::tip
 Check out the [Making HTTP requests](../guide/http-requests.md) guide if you are unfamiliar with testing API calls.
:::

Usually, you will perform several HTTP requests throughout your application. From a testing perspective, HTTP requests provide inputs to the component, and a component can also send HTTP requests.


### Extract complex methods

Sometimes a component might feature a complex method, with heavy calculations or several dependencies.

The suggestion here is to extract this method and import it to the component. This way, you can test the method in isolation (if necessary), and you can mock the import when testing your component.

## Write tests before writing the component

There's no way you write untestable code if you write tests before!

Our [Crash Course](../guide/a-crash-course.md) offers an example of how writing tests before code leads to testable components. It also helps you detect and test edge cases.