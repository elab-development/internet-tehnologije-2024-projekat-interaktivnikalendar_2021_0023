import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(form);
  };

  return (
    <div>
      <h1>Contact Page</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          name="name"
        />
        <InputField
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          name="email"
        />
        <InputField
          type="text"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          name="message"
        />
        <Button type="submit" text="Submit" />
      </form>
    </div>
  );
};

export default Contact;