import React from "react";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

function Feed({reload}) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    fetch(
      "https://9wr63b62h3.execute-api.us-east-1.amazonaws.com/default/wicstagram"
    )
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.Items);
      });
  }, [reload]);

  const Post = (post) => {
    const date = new Date(post.timestamp * 1000);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {posts.map(Post)}
    </div>
  );
}

export default Feed;
