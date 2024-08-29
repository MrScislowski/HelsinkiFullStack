import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import Blog from "./Blog";

test("renders blog title and author, but not URL / number of likes", () => {
  const titleText = "abc";
  const authorText = "def";
  const urlText = "ghi";
  const likesValue = 19;
  const userName = "jkl";

  const blog = {
    id: "000",
    user: { id: "000", username: "000", name: userName },
    title: titleText,
    author: authorText,
    url: urlText,
    likes: likesValue,
  };

  render(<Blog blog={blog} blogs={[]} setBlogs={() => false} />);

  const foundTitle = screen.getByText(titleText, { exact: false });
  expect(foundTitle).toBeTruthy();

  const foundAuthor = screen.getByText(authorText, { exact: false });
  expect(foundAuthor).toBeTruthy();

  const foundUrl = screen.queryByText(urlText, { exact: false });
  expect(foundUrl).toBeNull();

  const foundLikes = screen.queryByText(likesValue, { exact: false });
  expect(foundLikes).toBeNull();
});

test("URL and number of likes shown once button is clicked", async () => {
  const titleText = "abc";
  const authorText = "def";
  const urlText = "ghi";
  const likesValue = 19;
  const userName = "jkl";

  const blog = {
    id: "000",
    user: { id: "000", username: "000", name: userName },
    title: titleText,
    author: authorText,
    url: urlText,
    likes: likesValue,
  };

  render(<Blog blog={blog} blogs={[]} setBlogs={() => false} />);

  const user = userEvent.setup();

  const button = screen.getByRole("button", { name: /show/i });
  await user.click(button);

  const foundUrl = screen.queryByText(urlText, { exact: false });
  expect(foundUrl).toBeTruthy();

  const foundLikes = screen.queryByText(likesValue, { exact: false });
  expect(foundLikes).toBeTruthy();
});

// NOTE: I got help from chatGPT, because I wasn't passing in the handleLikes function (and I didn't want to refactor because I liked it this way... it felt encapsulated). I wouldn't have come up with mocking the service myself. Also, it showed me the .toHaveBeenCalledTimes() method, which I'm going to use from here on.

import blogService from "../services/blogs";

test('clicking "like" button twice causes two "setBlogs" event handler calls', async () => {
  const titleText = "abc";
  const authorText = "def";
  const urlText = "ghi";
  const likesValue = 19;
  const userName = "jkl";

  const blog = {
    id: "000",
    user: { id: "000", username: "000", name: userName },
    title: titleText,
    author: authorText,
    url: urlText,
    likes: likesValue,
  };

  const mockHandler = vi.fn();

  const amendedBlog = { ...blog, likes: likesValue + 1 };
  blogService.putAmended = vi.fn().mockResolvedValue(amendedBlog);

  render(<Blog blog={blog} blogs={[]} setBlogs={mockHandler} />);

  const user = userEvent.setup();

  const showButton = screen.getByRole("button", { name: /show/i });
  await user.click(showButton);

  const likeButton = screen.getByRole("button", { name: /like/i });
  await user.click(likeButton);
  await user.click(likeButton);

  expect(blogService.putAmended).toHaveBeenCalledTimes(2);
  expect(mockHandler).toHaveBeenCalledTimes(2);
});
