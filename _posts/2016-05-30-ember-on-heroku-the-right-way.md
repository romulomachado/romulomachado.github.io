---
layout: post
title: 'Ember on Heroku: the right way'
comments: true
---

I love Heroku because it saves me a lot of time. Instead of spend time managing servers (which I know nothing about), I can deploy things with something as simple as a `git push`.

When learning Ember, my thought was "Where should I deploy this to? Does Heroku work with Ember?". Did my research, there was a buildpack, but that wasn't working for me. Talked with some people from the community and Amazon S3 was what people were using the most.

Heroku has an official Ember buildpack now (Fastboot supported) and it is really simple to deploy an app with it:

{% highlight bash %}
$ heroku create
$ heroku buildpacks:set https://codon-buildpacks.s3.amazonaws.com/buildpacks/heroku/emberjs.tgz
$ git push heroku master
$ heroku open
{% endhighlight %}

#### How does it work?

The buildpack is composed of three other buildpacks: `heroku-buildpack-nodejs`, `heroku-buildpack-ember-cli-deploy` and `heroku-buildpack-static`.

##### heroku-buildpack-nodejs

The Node.js buildpack provides support for node and npm. The buildpack will install and setup the ember-cli toolchain as well as run the ember-fastboot-server as if it was any other Node.js application.

##### heroku-buildpack-ember-cli-deploy

The ember-cli-deploy buildpack requires the ember app to be using ember-cli. In addition, you can customize your build on Heroku by using the ember-cli-deploy build pipeline. The buildpack will build the assets, install any fastboot dependencies, and setup a default web process type to get you going quickly.

#### What if I'm not using fastboot? `heroku-buildpack-static` has your back.

When not using fastboot, the static buildpack uses nginx to efficiently serve static assets while also handling HTML5 pushState, proxying, and other [common frontend hosting configurations](https://github.com/heroku/heroku-buildpack-static#configuration).

Add a **static.json** with the following content:

{% highlight json %}
{
  "root": "dist",
  "routes": {
    "/**": "index.html"
  }
}
{% endhighlight %}

This is specifying a different asset root for the directory of your application (by default this is set to `public_html`) and mapping all routes to use the Ember router.

That's a wrap! What do you think? Are you excited to use Heroku with your Ember apps? Let me know in the comments.
