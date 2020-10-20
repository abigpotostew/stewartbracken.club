title: 'Guide: Free Encrypted Blog with a Custom Domain'
author: Stewart Bracken
date: 2019-05-25 18:27:54
tags:
---
Here's a guide to setup your own blog like mine with free hosting and a custom domain name. Github Pages also provide free HTTPS certificate for your blog as a very nice bonus.


### You will need:
- Computer with terminal access (I'm using a mac)
- (optional) Custom domain (more on this later)
- Github.com account
- A couple hours to setup this up



### Step 1 - (optional) Purchase a custom domain
If you want your blog to be hosted at it's own domain name such as `example.com` or `stewartbracken.club` then you need to purchase a domain. I got mine from [Google Domains](www.domains.google/‎), but there are many other domain providers on the web. Domains range from $9-$100+ per year depending on the top level domain.

Purchase your domain now or use the github.io URL provided by github. You can always add the custom domain later.

### Step 2 - Configure a New Github Repo
Log in to [GitHub.com](github.com) and create a new repository with default settings. If using a custom domain, then the repo name doesn't matter. If you're using the github.io URL for your blog then choose a name that you want to be in your blog URL.

Add your SSH key to your Github account by opening the Account settings > SSH and GPG keys > New SSH key. Paste in the contents of `~/.ssh/id_rsa.pub` in the text box. If you don't have an SSH key follow the [first section here](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) to generate a new one.


### Step 3 - Create a Hexo Blog

1. Open `Terminal.app` on a mac or equivalent.
2. Clone your git repository `git clone https://github.com/[your github username]/[your repo name].git`
3. `cd [your repo name]`
4. Create a blog directory within the repository: `mkdir [your repo name]`
6. Install Hexo `npm install -g hexo-cli`
7. Create a new hexo blog: 
```
hexo init [your repo name]
cd [your repo name]
npm install
```
8. Install necessary plugins:
```
npm install hexo-deployer-git --save
npm install hexo-server --save
npm install --save hexo-admin
```


### Step 4 - Configure Your Blog

Open `_config.yml` in the blog directory with a text editor and override the `deploy` config block the following settings:
```
deploy:
  type: git
  repo: git@github.com:[your github username]/[your repo name].club.git
  branch: gh-pages
  message: "Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}"
  name: [your github username]
  email: [your github email]
```

You can also modify any of the other settings here as your see fit, or later. Next we will deploy the blog to github.


### Step 5 - Deploy the Blog
```
hexo generate
hexo deploy
```

Generate creates the static files for your blog. Deploy pushes the blog files to the `gh-pages` branch in your repository. Run these two commands whenever you want to update your blog on the internet.


### Step 6 - Configure Github Pages Hosting
Open Github.com and navigate to your repo settings. Under Options > GitHub Pages > Source select `gh-pages branch`

At this point, your blog is viewable. Open the link shown right above the GitHub Pages settings to view it.


### Step 7 - Configure the Domain
In your local blog's `_config.yml`, set the `url` field to your blog URL. If using the github pages url, ie. [github username].github.io/[repository name]/, set it here. If using a custom domain set that in the `url` field instead, ie `example.com` or `stewartbracken.club` for my own domain.

If you're not using a custom domain, skip ahead to step 8.

If you are using a custom domain, enter your domain in the Custom Domain field on the repository settings under GitHub Pages. For reference, mine contains `stewartbracken.club`.

Next, create a new text file in the blog's `source` directory called `CNAME` with contents containing your custom domain name. For example my CNAME file contains:
```
stewartbracken.club
```

Generate and deploy your blog again with
```
hexo generate
hexo deploy
```

Configure your Custom domain DNS to point to the github page [https://help.github.com/en/articles/setting-up-an-apex-domain](https://help.github.com/en/articles/setting-up-an-apex-domain). To summarize these instructions, you need to create a type `A` DNS record that points to four github IPv4 addresses:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

To verify this is working you can run a dig command:
```
dig +noall +answer [your custom domain]
 ```
The four IPs you configured should show up in the dig response.
 

Now go back to your Github repository setting and verify the custom domain settings have taken. You may need to re-enter the custom domain.

At this point you can select `Enforce HTTPS` to tell Github to create your own certificate for your site. This will allow web browsers to use encrypted traffic which is a modern requirement to be listed in search results these days. The checkbox might be unavailable for up to 24 hours. For me, I was able to select it after a few minutes.

### Step 8 - Push Your Blog Source to Github

Now you can store your blog source code to the same repository with the following commands.
```
cd [repository root directory]
git add .
git commit -am "initial commit"
git remote add origin https://github.com/[your github username]/[your repository name].git
git push --set-upstream origin master
```
The git commands should be invoked in the root directory of the repository.

Now you have a clean way to store your blog's source code and host the blog from the same repo. If you ever need to update your blog from a different computer, you can clone the master branch of this repository and update it it. You will need to install the hexo software and plugins again from step 3 if you don't commit these.

### Step 9 - Blog Maintainence
This concludes the setup of your blog. The remaining instructions are the necessary terminal commands to configure and maintain your blog going forward.

To add new pages and blog posts you can either edit the blog directly on the filesystem or you can use the hexo-admin plugin to edit your blog with a GUI:
```
cd [your blog directory]
&hexo server -d
open http://localhost:4000/admin/
```
 You can view the unpublished changes to your blog by opening this URL in a browser: [http://localhost:4000/](http://localhost:4000/)
 
 After you're satisfied with the changes, redeploy the blog with the familiar commands:
 ```
 hexo generate
 hexo deploy
 ```
 
 Now feel free to change the blog theme and any other settings.
 
 And finally, when you're done for the day, save the blog's source code with:
 ```
 cd [repository root directory]
 git add .
 git commit -am "blog updates"
 git push
 ```
 
### Conclusion
I hope this guide will help you setup your own website. Hexo is very good and flexible software.
