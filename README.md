# Project 2: ListMaker 3000
**SI669 Fall 2020**

## Video Walkthrough
See the [Demo Video](https://youtu.be/krvpIWtWB2s).

## Learning Goals
This project will give you practice working with CRUD and Firebase, as well as different input components. You will be working with “2-level” CRUD by building an app that allows a user to create, update, and delete checklists, as well as the items contained in those checklists.

## Project Goals
Starting from scratch (and borrowing from your previous work on HW4 and in lectures), you will create an app that allows users to create, update, and delete checklists.

## What to Do
1. Accept the GitHub Classroom invitation.
2. Clone this repo to your local machine.
3. `cd` into the directory that was created when you cloned the repo (it should be called `proj2-listmaker3000-<your-github-id>`).
4. Run `expo init lm3k` to create a new expo project
5. cd into your new expo directory.
6. remove the .git directory that was created by expo (`rm -rf .git`)
7. Install (`yarn add` or `expo install`) all packages needed for React Navigation, Firebase, and React Native Elements (needed for the CheckBox component).
8. Integrate a firebase project that you “own” into the app (this can be the project you created in week8 or a new one). Keep Firebase config information in a separate file that you import, and modify your .gitignore to make sure that Firebase config information is not pushed to GitHub.
9. Implement all required functionality--test early and often!
10. Push your final changes to GitHub before the deadline.
11. Create a screencast video and submit the link to Canvas before the deadline.
    * Please make sure to demonstrate how your app meets each requirement as clearly as you possibly can. 
12. Indicate in your Canvas comments which requirements (including extra credit) you believe you met.


## Notes
* Be sure to show that the effects of all types of data modification (create, update, delete of both lists and items) persist across app launches.
* It is easier, and acceptable, to only commit changes to Firebase when a list is saved. That is, it is OK if changes to lists (list name, items) are lost if the app shuts down before they are explicitly saved. 
* You will need to read the docs for how to use the [React Native Elements CheckBox](https://reactnativeelements.com/docs/checkbox/), as well as for how to [Get Started with React Native Elements](https://reactnativeelements.com/docs).
* To make the Switch appear smaller than its default size (as is done in the demo video--the Switch is shrunk by 50%), read [this StackOverflow post](https://stackoverflow.com/questions/39613439/how-to-change-the-switch-components-size-in-react-native). However, changing the Switch size is not a requirement. It is also not necessary to make the Switch and Checkbox match your theme colors, but the docs will tell you how to do this if you’d like.
* It is not necessary to make the “Show Completed” toggle retain its state across app launches, or even after repeated visits to the same screen.


## Grading (up to 300 points)
| No. | Requirement  | Points |
| --- | ------------- | ------------- |
| 1 | User can create new lists and specify the list name | 10  |
| 2 | User can modify existing list names | 10 |
| 3 | User can delete existing lists | 10 |
| 4 | User can create new list items | 20 |
| 5 | User can modify list items | 20 |
| 6 | User can delete list items | 20 |
| 7 | User can mark list items “complete” (checked) or “incomplete” (unchecked) | 15 |
| 8 | New list items are “incomplete” by default | 10 |
| 9 | User can toggle “Show Completed” in the list detail view, and list items are shown or hidden accordingly | 20 |
| 10 | Newly created lists reappear after app reload | 15 |
| 11 | Modifications to existing lists reappear after app reload | 20 |
| 12 | Deleted lists remain deleted after app reload | 15 |
| 13 | Newly created list items reappear after app reload | 20 |
| 14 | Modifications to existing list items reappear after app reload | 20 |
| 15 | Deleted list items remain deleted after app reload | 20 |
| 16 | List items retain their complete/incomplete status after app reload | 20 |
| 17 | All screen styles look approximately like the screens in the video (or better) and do not have display bugs such as truncated lines, overlapping components, components running off the screen, etc. | 20 |
| 18 | Firebase API keys and other secret information is kept out of GitHub. | 15 |
|   | **Total** | **300**|

*Note: there is no extra credit for projects. Sorry!*