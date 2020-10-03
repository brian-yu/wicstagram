# Wicstagram 📸

Today, we're going to build a simple Instagram clone in just 45 minutes! We'll learn how to use React to build a dynamic web application that can communicate with a backend API.

You can view a finished demo [here](http://wicstagram.netlify.app/).
You can also view an interactive code sample [here](https://repl.it/@brian_yu/Wicstagram#src/App.js).

# 0. Prerequisites 🔜
To get started make sure you have the following installed:
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

# 1. Getting started ➡️

First, let's create a starter app.

```
$ npx create-react-app wicstagram
```

Next, let's install our dependencies:

```
$ cd wicstagram
$ yarn add react-bootstrap bootstrap react-webcam
```

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

After that, run `yarn start` to start the development server!

React uses JSX, which is a language that mixes HTML and JavaScript. It's confusing at first but it will make a lot of sense after you use it for a bit.

# 2. Listing posts 🖼️

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

Next, we'll download our data from our backend API. We can use [`useEffect()`](https://reactjs.org/docs/hooks-effect.html) to perform an action on page load. With `useEffect`, we can also specify a variable for which `useEffect` will run if that variable changes. If the value of `reload` changes, we'll refresh our posts. This `reload` variable will come in handy later.

We'll use `fetch()`, which is JavaScript's built in function to make web requests. You can think of it as a function that loads the URL given to it and returns whatever data it gets back.

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

# 3. Taking pictures 📸

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

Let's also hook this up into our App in `src/App.js`:

`src/App.js`
```jsx
import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Feed from "./Feed.js";
import Upload from "./Upload.js";
import "./App.css";

function App() {
  const [reload, setReload] = useState(false);

  return (
    <div className="App">
      <h1>Wicstagram</h1>
      <Upload reload={reload} setReload={setReload} />
      <Feed reload={false} />
    </div>
  );
}

export default App;

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

Now, we're going to create a button and a modal so that we can open and close our upload form. Our modal will be open when `showModal == true` and closed when `showModal == false`. We'll also define two functions: `handleCloseModal` will set `showModal = false` and `handleShowModal` will set `showModal = true`.

We'll once again use React Bootstrap to easily create some pretty looking web components.

`src/Upload.js`
```jsx
function Upload({reload, setReload}) {

  // ...

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShowModal}>
        Post
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="create-post-modal"
      >

        <Modal.Header closeButton>
          <Modal.Title>Create post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Upload form will go here!
        </Modal.Body>

        <Modal.Footer>
          <Button>
            Post
          </Button>
        </Modal.Footer>

      </Modal>
    </div>
  );
}
```

Next, we're going to hook into our laptops' webcams via [react-webcam](https://github.com/mozmorris/react-webcam), a React package that makes it super easy to take screenshots from our webcams.

We'll use React's [`useRef()`](https://reactjs.org/docs/hooks-reference.html#useref) function to hold a pointer to our Webcam component. Using that pointer, we can take screenshots with the webcam. We'll also use React's [`useCallback()`](https://reactjs.org/docs/hooks-reference.html#usecallback) function to create function that will be executed when the user wants to take a picture.

`src/Upload.js`
```jsx
function Upload({reload, setReload}) {
  // ...

  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  
  // ...
}
```

Next, we'll actually create our Webcam component and enable it to take pictures.

We'll also want to set up some logic to handle either showing the live webcam video or the picture that the use just took. If `imgSrc === null && showModal === true`, meaning we haven't taken a picture yet and the modal is open, we'll show the webcam feed and a button prompting the user to take a picture. Otherwise, we'll show the image that the user just captured and a photo retake button.

`src/Upload.js`
```html
function Upload({reload, setReload}) {
  
  // ...
  
  return (
    <div>

      // ...

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="create-post-modal"
      >

        // ...

        <Modal.Body>
          <div className="camera">
            {imgSrc === null && showModal === true ? (
              <div>
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/webp"
                  />
                </div>
                <Button onClick={capture}>Take photo</Button>
              </div>
            ) : (
              <div>
                <img src={imgSrc} />
                <Button onClick={() => setImgSrc(null)}>Clear photo</Button>
              </div>
            )}
          </div>
        </Modal.Body>

        // ...

      </Modal>
    </div>
  );
}
```

Awesome! We can now take and store pictures.

# 4. Uploading posts 📤

Now, Instagram does not have just pictures -- we need to add captions and usernames too. We'll go ahead and do that now.

We're creating two form fields and specifying their `onChange` and `value` properties. When the value inside of a field changes, it'll fire the specified `onChange` function. In our case, the `onChange` function will update our state variable. The `value` property sets the value of the form field, ensuring that the form and our state variables stay in sync.

`src/Upload.js`

```html
function Upload({reload, setReload}) {
  
  // ...
  
  return (
    <div>

      // ...

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="create-post-modal"
      >

        // ...

        <Modal.Body>
        
          <div className="camera">
            // ... camera stuff ...
          </div>

          <Form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Caption</Form.Label>
              <Form.Control
                onChange={(event) => setCaption(event.target.value)}
                value={caption}
                placeholder="Enter caption"
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        // ...

      </Modal>
    </div>
  );
}
```

Great! So now we can take pictures and record users' captions and usernames. All that's left to do is upload this data to our backend API so that it can be saved and shown to other people.

We'll do this using `fetch()`, sort of like how we retrieved all the posts in the beginning.

After we finish uploading, we'll also clear `imgSrc` and `caption` (because users will want to make new posts), close the modal, and change the value of `reload`, causing the feed to refresh.

`src/Upload.js`
```jsx
function Upload({reload, setReload}) {
  
  // ...

  const uploadPost = () => {
    // We want to upload username, caption, and image in .webp format.
    const body = {
      username: username,
      caption: caption,
      image: imgSrc.replace("data:image/webp;base64", ""),
    };

    fetch(
      "https://9wr63b62h3.execute-api.us-east-1.amazonaws.com/default/wicstagram",
      {
        method: "POST", // This means upload data instead of download.
        body: JSON.stringify(body), // Convert object into string.
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setImgSrc(null);
        setCaption(null);
        setShowModal(false);
        setReload(!reload);
      });
  };

  return (
    // ...
  );
}
```

Now, let's actually call this function when users press a button. We'll disable this button when either the caption, username, or image, has not yet been filled out by the user.

`src/Upload.js`
```html
function Upload({reload, setReload}) {
  
  // ...

  return (
    <div>
      
      // ...

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="create-post-modal"
      >
        // ...

        <Modal.Body>
          // Webcam and form stuff ...
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={uploadPost}
            disabled={imgSrc == null || caption == null || caption === '' || username == null || username === ''}
          >
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
```

Now, if you try pressing the button, your post will be uploaded to the server! Your feed should also reload and show your new post.


# Congratulations!! 🥳 🎉 🎉

You've just built a dynamic web application that reproduces the core functionality of Instagram. You should feel pretty dang proud of yourselves right now :).

We just covered a LOT of material in a very short amount of time and you shouldn't expect to understand everything right away. It took quite a bit of confusion and playing around for me to learn React. Things will start to make a lot more sense as you start playing around and building your own kickass projects in React.

Nonetheless, I hope this was a good introduction to the power and flexibility of React and I hope that you will put these learnings to good use during the Hackathon. Good luck out there!