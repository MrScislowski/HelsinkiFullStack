https://fullstackopen.com/en/part8/fragments_and_subscriptions#exercises-8-23-8-26

[ ] why does ex8.1 subscriptions not work, while parta subscriptions do work? -> OMG, it works in chrome... maybe the new apollo server just isn't compatible with safari in some way...? exhausting.

8.24: Subscriptions - client, part 1
Start using subscriptions in the client, and subscribe to bookAdded. When new books are added, notify the user. Any method works. For example, you can use the window.alert function.

8.25: Subscriptions - client, part 2
Keep the application's book view updated when the server notifies about new books (you can ignore the author view!). You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.

8.26: n+1
Solve the n+1 problem of the following query using any method you like.

query {
allAuthors {
name
bookCount
}
}
