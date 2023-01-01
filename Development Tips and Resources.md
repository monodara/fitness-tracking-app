[TOC]

# General

* Always ask questions if you have confusion.
* Discuss your ideas with your teammates before you start to code.

# Coding Style

* Always format your code. This can save you a lot of time.
* Make your code easy to read. Readability does matter because you will read your code a few weeks later and you will read your teammates' code. Reduce the # of "fuck"s you and your teammates saying.

# Git

* Fully understand the [introduction to git](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners). This will be your fundamentals of understanding the whole development process.

* Select a merge tool. This is used to merge your code and other's code when there are some conflicts in the code. 

  * I recommend VS Code. This is my merge configuration of git(`/Users/jiaju/.gitconfig` on `MacOS`)

    ```
    # vscode as default merge tool
    [diff]
            tool = vscode-diff
    [difftool "vscode-diff"]
            cmd = code --wait --diff $LOCAL $REMOTE
    [merge]
            tool = vscode-merge
    [mergetool "vscode-merge"]
            cmd = code --wait $MERGED
    ```


# Bootstrap in React

[Beginner to bootstrap on react](https://react-bootstrap.github.io/getting-started/introduction)

# React

[React Get Started](https://reactjs.org/docs/getting-started.html)
