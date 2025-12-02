## High level overview 
1. owner visits the home page clicks - Get Started -> redirects to sign up
2. after signup user are redirected to checkout 
3. user choose a plan and pay
4. redirects to the dashboard

## workspace now he is an owner of the workspace
owner can send invitation link to a user with the role for the member

## invited user
1. gets a link in the email
2. clicks on it to be assigned to a workspace  /workspace/name?token (token must contain the rule)
3. server checks the link and the token if it exists 
4. check if ther user already exists auto sign up 
   else redirects the user to sign up page
5. check if the owner subscribtion didnot passed the due time activate workspace team membership 
6. redirect to the workspace dashboard



