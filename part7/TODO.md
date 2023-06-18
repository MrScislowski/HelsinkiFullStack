[ ] 7.13: React Query and context step4
Add display management using useReducer/context

([ ]) add nice methods to clear database and populate it with test info for testing purposes. It gets pretty unwieldy to keep all the info I've ever added to it.



Views
The rest of the tasks are common to both the Redux and React Query versions.

[ ] 7.14: Users view
Implement a view to the application that displays all of the basic information related to users:

browser blogs with users table showing blogs created
[ ] 7.15: Individual user view
Implement a view for individual users that displays all of the blog posts added by that user:

browser blogs showing users added blogs
You can access the view by clicking the name of the user in the view that lists all users:

browser blogs showing clickable users
NB: you will almost certainly stumble across the following error message during this exercise:

browser TypeError cannot read property name of undefined
The error message will occur if you refresh the page for an individual user.

The cause of the issue is that, when we navigate directly to the page of an individual user, the React application has not yet received the data from the backend. One solution for fixing the problem is to use conditional rendering:

const User = () => {
const user = ...
if (!user) {
return null
}

return (
<div>
// ...
</div>
)
}copy
[ ] 7.16: Blog view
Implement a separate view for blog posts. You can model the layout of your view after the following example:

browser blogs showing single blog via URL /blogs/number
Users should be able to access the view by clicking the name of the blog post in the view that lists all of the blog posts.

browser showing blogs are clickable
After you're done with this exercise, the functionality that was implemented in exercise 5.7 is no longer necessary. Clicking a blog post no longer needs to expand the item in the list and display the details of the blog post.

[ ] 7.17: Navigation
Implement a navigation menu for the application:

browser blogs navigation navigation menu
[ ] 7.18: comments, step1
Implement the functionality for commenting on blog posts:

browser blogs showing list of comments for a blog
Comments should be anonymous, meaning that they are not associated with the user who left the comment.

In this exercise, it is enough for the frontend to only display the comments that the application receives from the backend.

An appropriate mechanism for adding comments to a blog post would be an HTTP POST request to the api/blogs/:id/comments endpoint.

[ ] 7.19: comments, step2
Extend your application so that users can add comments to blog posts from the frontend:

browser showing comments added via frontend
[ ] 7.20: Styles, step1
Improve the appearance of your application by applying one of the methods shown in the course material.

[ ] 7.21: Styles, step2
You can mark this exercise as finished if you use an hour or more for styling your application.
