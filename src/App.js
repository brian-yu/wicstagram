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
