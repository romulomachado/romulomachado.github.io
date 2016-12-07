---
layout: post
title: Creating a multi-step form with Ember
comments: true
---

Form usability is incredibly important. As one of the primary input interfaces, the usability of a form is essential to a good user experience.

When a form has very distinct sections, it may be worth separating them into multiple parts.
 Checkout processes are a common example of this. They're usually separated in personal info, shipping info, payment info and confirmation.

 We're going to create a checkout form and see how easy it is to deal with multi-step forms with Ember.

##### Model

We'll create an `Order` model to use as an example.

{% highlight bash %}
$ ember generate model order name:string email:string address:string zipCode:string cardNumber:string cardVerification:string cardExpiration:string
{% endhighlight %}

(I know that model is not great, a lot of data could go into other models, but for the sake of the example, that'll do.)

The `Order` model looks like this:

{% highlight javascript %}
// app/models/order.js
import DS from 'ember-data';

export default DS.Model.extend({
  // personal info
  name: DS.attr('string'),
  email: DS.attr('string'),

  // shipping info
  address: DS.attr('string'),
  zipCode: DS.attr('string'),

  // payment info
  cardNumber: DS.attr('string'),
  cardVerification: DS.attr('string'),
  cardExpiration: DS.attr('string')
});

{% endhighlight %}

##### The parent route

Now, we'll generate a `checkout` route.

{% highlight bash %}
$ ember generate route checkout
{% endhighlight %}

We'll edit the checkout template and add a title.

{% highlight html %}
{% raw %}
<!-- app/templates/checkout.hbs -->
<h1>Checkout</h1>

{{outlet}}
{% endraw %}
{% endhighlight %}
__Make sure you don't remove the {% raw %}{{outlet}}{% endraw %}. It is crucial here.__

On the route's model, we'll create and return a new `Order`.

{% highlight javascript %}
// app/routes/checkout.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('order');
  }
});
{% endhighlight %}

If we spin up the server and go to `localhost:4200/checkout`, we'll see:

![screenshot]({{site.url}}/public/images/blog/2016-12-06-multi-step-form-with-ember/01-title-and-order.png)

We can see the title on the page and an object `order` in store with Ember Inspector (if you don't have it installed, you should). Nothing too stupendous.

##### The child routes

Now, we'll make the magic happen. We need to generate four child routes (`checkout/personal-info`, `checkout/shipping-info`, `checkout/payment-info` and `checkout/confirmation`).

{% highlight bash %}
$ ember generate route checkout/personal-info
$ ember generate route checkout/shipping-info
$ ember generate route checkout/payment-info
$ ember generate route checkout/confirmation
{% endhighlight %}

The `app/router.js` should look like this:

{% highlight javascript %}
Router.map(function() {
  this.route('checkout', function() {
    this.route('personal-info');
    this.route('shipping-info');
    this.route('payment-info');
    this.route('confirmation');
  });
});
{% endhighlight %}

We'll edit the templates so we can locate ourselves and navigate between them.

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/personal-info.hbs -->
<h2>Personal Info</h2>

{{#link-to 'checkout.shipping-info'}}Next{{/link-to}}
{% endraw %}
{% endhighlight %}

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/shipping-info.hbs -->
<h2>Shipping Info</h2>

{{#link-to 'checkout.personal-info'}}Previous{{/link-to}}
{{#link-to 'checkout.payment-info'}}Next{{/link-to}}
{% endraw %}
{% endhighlight %}

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/payment-info.hbs -->
<h2>Payment Info</h2>

{{#link-to 'checkout.shipping-info'}}Previous{{/link-to}}
{% endraw %}
{% endhighlight %}

The `payment-info` template won't have a next link. It'll have a submit button and after saving, we'll redirect to confirmation.

{% highlight html %}
<!-- app/templates/checkout/confirmation.hbs -->
<h2>Confirmation</h2>
{% endhighlight %}

Our navigation works and the checkout process looks like:

![Navigation example]({{site.url}}/public/images/blog/2016-12-06-multi-step-form-with-ember/02-navigation.gif)

##### All together now :notes:

Now, we need to create our form and make it work seamlessly with our navigation. Each step of the checkout should edit only one `order` object. As we have already returned one in the parent route's model, we only need to reuse that model in the child routes.

Update all child routes (`app/routes/checkout/personal-info.js`, `app/routes/checkout/shipping-info.js`, `app/routes/checkout/payment-info.js` and `app/routes/checkout/confirmation.js`) to look like the following:

{% highlight javascript %}
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('checkout');
  }
});
{% endhighlight %}

We told Ember we're using the same model from the parent route in all child routes. Now we're dealing with the same object in all child routes and we can split our form into them.

The `personal-info` template will have all "personal" fields:

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/personal-info.hbs -->
<h2>Personal Info</h2>

{{input name='name' value=model.name placeholder='Enter your name'}}
{{input name='email' value=model.email placeholder='Enter your email'}}

{{#link-to 'checkout.shipping-info'}}Next{{/link-to}}
{% endraw %}
{% endhighlight %}

The `shipping-info` template will have all shipping fields:

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/shipping-info.hbs -->
<h2>Shipping Info</h2>

{{input name='address' value=model.address placeholder='Enter the address'}}
{{input name='zipCode' value=model.zipCode placeholder='ZIP Code'}}

{{#link-to 'checkout.personal-info'}}Previous{{/link-to}}
{{#link-to 'checkout.payment-info'}}Next{{/link-to}}
{% endraw %}
{% endhighlight %}

The `payment-info` template will have all payment fields:

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/payment-info.hbs -->
<h2>Payment Info</h2>

{{input name='cardNumber' value=model.cardNumber placeholder='Card number'}}
{{input name='cardVerification' value=model.cardVerification placeholder='CVC' maxlength=4}}
{{input name='cardExpiration' value=model.cardExpiration placeholder='Card Expiration: XX/XXXX'}}

{{#link-to 'checkout.shipping-info'}}Previous{{/link-to}}
{% endraw %}
{% endhighlight %}

![Navigation example]({{site.url}}/public/images/blog/2016-12-06-multi-step-form-with-ember/03-checkout.gif)

:white_check_mark: Our multi-step form is working and we're editing only one order with it.

We now only need to submit the form, persist the data and to redirect the user to the confirmation page. We'll use a controller to handle this for us.

{% highlight bash %}
$ ember generate controller checkout
{% endhighlight %}

Now we tell `app/routes/checkout/payment-info.js` to use the controller we just generated. (It's the route that will have the button that triggers the action.)

{% highlight javascript %}
...

export default Ember.Route.extend({
  controllerName: 'checkout',

  ...
});

{% endhighlight %}

Add a button to the template:

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/payment-info.hbs -->
...

<button {{action 'submitForm'}}>Buy!</button>
{% endraw %}
{% endhighlight %}

And create the action on `app/controllers/checkout.js`:

{% highlight javascript %}
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    submitForm() {
      // persist data to back-end here
      console.log('Order placed!');
      this.transitionToRoute('checkout.confirmation');
    }
  }
});
{% endhighlight %}

Because we don't have a back-end set up, I just console logged `Order placed!` and transitioned to the confirmation route. If we had the back-end, a simple `this.get('model').save()` would do the job.

And finally, we can confirm some data on `app/templates/checkout/confirmation.hbs`:

{% highlight html %}
{% raw %}
<!-- app/templates/checkout/confirmation.hbs -->

<h2>Confirmation</h2>

<h3>Your order had just been placed!</h3>

<h4>Personal Info</h4>

<ul>
  <li><b>Name:</b> {{model.name}}</li>
  <li><b>Email:</b> {{model.email}}</li>
</ul>

<h4>Shipping Info</h4>

<ul>
  <li><b>Address:</b> {{model.address}}</li>
  <li><b>ZIP Code:</b> {{model.zipCode}}</li>
</ul>

<h4>Payment Info</h4>

<ul>
  <li><b>Card number:</b> {{model.cardNumber}}</li>
  <li><b>CVC:</b> {{model.cardVerification}}</li>
  <li><b>Expiration date:</b> {{model.cardExpiration}}</li>
</ul>

{% endraw %}
{% endhighlight %}

And now our multi-step form works! :tada:

![Final form with confirmation]({{site.url}}/public/images/blog/2016-12-06-multi-step-form-with-ember/04-confirmation.gif)

That's wrap! Another long post, but I hope you learned how to make multi-step forms with Ember. If you have something to say, hit me up on Twitter, I'm <a href="http://twitter.com/romulomachado_">@romulomachado_</a> there. If you'd like to see the complete solution, it's on [GitHub](https://github.com/romulomachado/blog-examples/tree/master/2016-12-06-multi-step-form-with-ember).
