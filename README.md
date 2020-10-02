# Wicstagram

Today, we're going to build a simple Instagram clone in just 45 minutes! We'll learn how to use React to build a dynamic web application that can communicate with a backend API.

You can view a finished demo [here](http://wicstagram.netlify.app/).
You can also view an interactive code sample [here](https://repl.it/@brian_yu/Wicstagram#src/App.js).

## 0. Prerequisites
To get started make sure you have the following installed:
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

## 1. Getting started
First, let's install our dependencies:

`$ yarn add react-bootstrap bootstrap react-webcam`

Next, let's create a starter app.

`$ npx create-react-app wicstagram`

After that, let's delete everything we don't need from `src/App.js` and add our imports. It should now look like this:

`src/App.js`
```jsx
import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

function App() {
  const [reload, setReload] = useState(false);

  return (
    <div className="App">
      <h1>Wicstagram</h1>
    </div>
  );
}

export default App;
```

After that, run `$ yarn start` to start the development server!

React uses JSX, which is a language that mixes HTML and JavaScript. It's confusing at first but it will make a lot of sense after you use it for a bit.

## 2. Listing posts

Cool! So we've decided to make an Instagram clone. What's the first thing we need to do? If you're like me, you scroll through Instagram way more than you post, so let's start of by making a feed.

Let's make a new file called `Feed.js` in `src/`. It should look like this to start:

`src/Feed.js`
```jsx
import React from "react";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

function Feed({reload}) {
  return (
    <div>
    </div>
  );
}

export default Feed;
```

We'll also plug it into our app by editing `src/App.js`:

`src/App.js`
```jsx
import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Feed from "./Feed.js";
import "./App.css";

function App() {

  return (
    <div className="App">
      <h1>Wicstagram</h1>
      <Feed reload={false} />
    </div>
  );
}

export default App;
```

We need to store our post data in a special variable that React will know how to handle. To do this, we'll use [`useState()`](https://reactjs.org/docs/hooks-state.html):

```jsx
function Feed({reload}) {

  const [posts, setPosts] = useState([]);

  return (
    <div>
    </div>
  );
}
```

This code initializes `posts` to be an empty array. `setPosts` is a function that we can use to update the value of `posts`.

Next, we'll need to fetch our data from our API. We can use [`useEffect()`](https://reactjs.org/docs/hooks-effect.html) to perform an action on page load. With `useEffect`, we can also specify a variable for which `useEffect` will run if that variable changes. If the value of `reload` changes, we'll refresh our posts. This will come in handy later.

```jsx
function Feed({reload}) {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      "https://9wr63b62h3.execute-api.us-east-1.amazonaws.com/default/wicstagram"
    )
    .then((response) => response.json())
    .then((data) => {
      // update posts!
      setPosts(data.Items);
    });
  }, [reload]);

  return (
    <div>
    </div>
  );
}
```

Awesome, we now have our post data stored in the `posts` variable. The contents of `posts` is an object that looks like this:

```json
{
    "Items": [
        {
            "username": "brian",
            "image_url": "https://wicstagram.s3.us-east-1.amazonaws.com/76bc460f-8a5d-4feb-9a7b-244ac6d0f5a7.webp",
            "caption": "hello, world!",
            "timestamp": 1601650984.4848373
        },
        {
            "username": "rachel",
            "image_url": "https://wicstagram.s3.us-east-1.amazonaws.com/2406b634-3b0a-4aef-892b-86c27f025d76.webp",
            "caption": "hi!",
            "timestamp": 1601618138.4489233
        },
        ...
    ],
    ...
}
```

Each post has a username, caption, image URL, and timestamp associated with it.

Next, we need to display our posts!

We'll create a _functional component_ to render a post. This component will take our data and turn it into something pretty that we can look at! We'll use [React Bootstrap Cards](https://react-bootstrap.github.io/components/cards/) to make this pretty.

```jsx
function Feed({reload}) {

  // ... useState() and useEffect stuff ...

  const Post = (post) => {
    // convert timestamp to Date.
    const date = new Date(post.timestamp * 1000);
    // get readable date string.
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    });

    return (
      <Card
        style={{
          width: "60vw",
          marginTop: "20px",
          marginBottom: "20px",
          textAlign: "left",
        }}
      >
        <Card.Header>{post.username}</Card.Header>
        <Card.Img variant="top" src={post.image_url} />
        <Card.Body>
          <Card.Text>
            {post.caption}
            <br></br>
            <small>{dateStr}</small>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
    </div>
  );
}
```

Now that we have the component, we need to plug our data into it so that it'll actually show use useful stuff. In order to do this, we'll iterate through `posts` and plug each post into our component! We can do that like so:

```jsx
function Feed({reload}) {
  
  // ...

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      // Plug each element in `posts` into our `Post` component.
      { posts.map(Post) }
    </div>
  );
}
```

And there's our feed! You can look at [`src/Feed.js`](https://github.com/brian-yu/wicstagram/blob/main/src/Feed.js) for the full code.

## 3. Making a Form

What's the use of Wicstagram if nobody can post anything? Let's get started on uploading new images. Let's start by creating some new files-- `src/Upload.js` and `src/Upload.css`.

`src/Upload.js`
```jsx
import React from "react";
import { useState, useRef, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Webcam from "react-webcam";
import Form from "react-bootstrap/Form";

import "./Upload.css";

function Upload({reload, setReload}) {

  return (
    <div>
    </div>
  );
}

export default Upload;
```

`src/Upload.css`
```css
.create-post-modal {
    width: 768px;
    max-width: none!important;
}

.camera {
    text-align: center;
}
```

We're going to use a [React Bootstrap Modal](https://react-bootstrap.github.io/components/modal/) to display our form. We're going to need to keep track of 4 state variables:

- `showModal` is a `boolean` that will keep track of whether we're showing the form or not.
- `imgSrc` will hold the newly uploaded image data
- `caption` will hold the new post's caption
- `username` will hold the new post's author

`src/Upload.js`
```jsx
function Upload({reload, setReload}) {
  
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [caption, setCaption] = useState(null);
  const [username, setUsername] = useState(null);

  return (
    <div>
    </div>
  );
}
```