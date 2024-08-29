import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import NewBlogForm from "./NewBlogForm";
import Blog from "./Blog";

import blogService from "../services/blogs";

test("calls event handler with correct parameters ", async () => {
  blogService.postNew = vi
    .fn()
    .mockResolvedValue({ title: "...", author: "..." });

  const voidFn = () => false;

  render(<NewBlogForm blogs={[]} setBlogs={voidFn} />);

  const title = "abc";
  const author = "def";
  const url = "ghi";

  const user = userEvent.setup();

  const newBlogButton = screen.getByRole("button", { name: /new blog/i });
  await user.click(newBlogButton);

  const titleInput = screen.getByRole("textbox", { name: /title/i });
  await user.type(titleInput, title);

  const authorInput = screen.getByRole("textbox", { name: /author/i });
  await user.type(authorInput, author);

  const urlInput = screen.getByRole("textbox", { name: /url/i });
  await user.type(urlInput, url);

  const submitButton = screen.getByRole("button", { name: /create/i });
  await user.click(submitButton);

  expect(blogService.postNew).toHaveBeenCalledWith({ title, author, url });
});
