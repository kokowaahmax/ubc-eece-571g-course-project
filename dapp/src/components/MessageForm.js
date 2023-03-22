import React, { useState } from "react";

function MessageForm({ addMessage }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    addMessage({ text, author });
    setText("");
    setAuthor("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <input
        type="text"
        placeholder="Your message"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageForm;
