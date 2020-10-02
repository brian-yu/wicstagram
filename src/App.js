import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import Webcam from "react-webcam";
import Form from "react-bootstrap/Form";

import "./App.css";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [caption, setCaption] = useState(null);
  const [username, setUsername] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleShowModal = () => setShowModal(true);

  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const uploadPost = () => {
    const body = {
      username: username,
      caption: caption,
      image: imgSrc.replace("data:image/webp;base64", ""),
    };

    fetch(
      "https://9wr63b62h3.execute-api.us-east-1.amazonaws.com/default/wicstagram",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setImgSrc(null);
        setCaption(null);
        setShowModal(false);
        setReload(!reload);
      });
  };

  useEffect(() => {
    // Update the document title using the browser API
    fetch("https://9wr63b62h3.execute-api.us-east-1.amazonaws.com/default/wicstagram")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.Items);
      });
  }, [reload]);

  const Post = (post) => {
    const date = new Date(post.timestamp * 1000);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long', hour: 'numeric', minute: 'numeric'
    })
    return (
      <Card style={{ width: '60vw', marginTop: '20px', marginBottom: '20px', textAlign: 'left' }}>
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
    )
  };

  return (
    <div className="App">
      <h1>Wicstagram</h1>

      <Button variant="primary" onClick={handleShowModal}>
        Post
      </Button>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        { posts.map(Post) }
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="create-post-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create post</Modal.Title>
        </Modal.Header>
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

          <Form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={(x) => setUsername(x.target.value)}
                value={username}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Caption</Form.Label>
              <Form.Control
                onChange={(x) => setCaption(x.target.value)}
                value={caption}
                placeholder="Enter caption"
              />
            </Form.Group>
          </Form>
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

export default App;
