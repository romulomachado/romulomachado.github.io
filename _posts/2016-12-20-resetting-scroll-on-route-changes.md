---
layout: post
title: "Ember: Resetting Scroll on Route Changes"
comments: true
---

Ember retains the current scroll position as you navigate between pages and if you have an Ember app, you have an ugly hack to fix this (I used to have one too). I can't think of a situation where this is useful, but that's default behaviour. ¯\\\_(ツ)\_/¯

There's a very old [cookbook recipe](https://guides.emberjs.com/v1.10.0/cookbook/user_interface_and_interaction/resetting_scroll_on_route_changes/) that recommends creating a Mixin to solve this problem. You need create the Mixin and apply it to all the routes on the app or create a `BaseRoute` and extend it all the time.

That's not a great solution. If you create a `BaseRoute`, all your routes will have to extend it and if you don't, you'll have to apply the Mixin to all routes. If you have lots of them, that'll be hard to maintain/update.

##### Solving the problem at its root

`Ember.Router` has a `didTransition` hook. It handles updating paths and notifying any listeners of the URL change. That seems a perfect place for resetting our scroll position.

On the `app/router.js`, we'll override `didTransition`:

{% highlight javascript %}
// app/router.js
const Router = Ember.Router.extend({
  ...

  didTransition() {
    this._super(...arguments);
    window.scrollTo(0, 0);
  }
});

...
{% endhighlight %}

Now is the time you say: *"But, Rômulo, that won't work with Fastboot because `window` is not available!"*

![](https://s-media-cache-ak0.pinimg.com/originals/d1/d7/77/d1d7775cc8389d17eb63180acaed194b.jpg)

To make this Fastboot-compatible, you just need to check whether you're running Fastboot or not:

{% highlight javascript %}
// app/router.js

const { service } = Ember.inject;

const Router = Ember.Router.extend({
  ...
  fastboot: service(),

  didTransition() {
    this._super(...arguments);
    if (!this.get('fastboot.isFastBoot')) {
      window.scrollTo(0, 0);
    }
  }
});

...
{% endhighlight %}

That's it! No more hacky Mixins or `BaseRoute`s, just a simple line to a router function. Way better! :sunglasses:

I hope this helps!
