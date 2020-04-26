## Plugins

Plugins add global-level functionality to Vue Test Utils' API. This is the
 official way to extend Vue Test Utils' API with custom logic, methods, or
   functionality.

 If you're missing a bit of functionality, consider writing a plugin to
  extend Vue Test Utils' API.

 Some use cases for plugins:
 1. Aliasing existing public methods
 1. Attaching matchers to the Wrapper instance
 1. Attaching functionality to the Wrapper or WrapperArray

## Using a plugin

Install plugins by calling the `config.plugins.VueWrapper.install()`  method
. This has to be done before you call `mount`.

 The `install()` method will receive an instance of `WrapperAPI` containing both
  public and private properties of the instance.

 ```js
// Jest's setup.js file
import { config } from '@vue/test-utils'

// locally defined plugin, see "Writing a Plugin"
import MyPlugin from './myPlugin'

// Install a plugin onto VueWrapper
config.plugins.VueWrapper.install(MyPlugin)
```

You can optionally pass in some options:
```js
config.plugins.VueWrapper.install(MyPlugin, { someOption: true })
```

Your plugin should be installed once. In Jest this should be in your Jest
 config's `setupFiles` or `setupFilesAfterEnv` file.

Some plugins automatically call `config.plugins.VueWrapper.install()` when
 they're imported. This is common if they're extending multiple interfaces at
  once. Follow the instructions of the plugin you're installing.

Check out [awesome-vue-test]() for a collection of community-contributed
 plugins and libraries.

## Writing a Plugin

A Vue Test Utils plugin is simply a function that receives the mounted
 `VueWrapper` or `DomWrapper` instance and can modify it.

Below is a simple plugin to add a convenient alias to map `wrapper.element` to `wrapper.$el`

```js
// setup.js
import { config, WrapperAPI} from '../../src'

const myAliasPlugin = (wrapper: WrapperAPI) => {
  return {
    $el: wrapper.element // simple aliases
  }
}

// Call install on the type you want to extend
// You can write a plugin for any value inside of config.plugins
config.plugins.VueWrapper.install(myAliasPlugin)
```

And in your spec, you'll be able to use your plugin after mount.
```js
// component.spec.js
const wrapper = mount({ template: `<h1>🔌 Plugin</h1>` })
console.log(wrapper.$el.innerHTML) // 🔌 Plugin
```

## Featuring your Plugin

If you're missing functionality, consider writing a plugin to extend Vue Test Utils and submit it to be featured at [awesome-vue-test]()
