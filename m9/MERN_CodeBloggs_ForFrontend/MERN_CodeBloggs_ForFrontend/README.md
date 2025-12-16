# CodeBoxx_9_MERN_Codeblogg
---

## Configuration

- Create .env
- Copy Paste the key=value received from the admin 


- NPM install in /server folder
- `npm start` in /server folder to start the server side


- NPM install in /client folder
- `npm run dev` in /client folder to start the client side
---

## Color Palette
```
#403E6B (Delft Blue)
#D3D1EE (Lavender (web))
#8D88EA (Tropical indigo)
#B1ADFF (Periwinkle
#5F5E6B (Dim gray)
#6E6AB8 (Slate blue)
```
---

## Research Document:
- What, if any **DATA** is required from the backend to render the wireframe?
    - If no dynamic data are required, indicate that.
    - Generate documentation for any required API.


- What, if any, **ACTIONS** is this wireframe responsible for?
    - Button clicks and form submissions often trigger logic that leverages the API layer.
    - If no actions are required, indicate that.
    - Generate documentation for any required API.

```
METHOD /route/{path_param}?query_param=param_value

Parameters

TYPE	NAME	        Description
Path	path_param	    Brief description
Query	query_param	    Brief description
Body	body_param	    Brief description

Sample Response:
{
  status:"ok",
  data:{
    key:value
  },
  message:"descriptive message"
}
```

Here is a sample API documentation for getting user information via user id
```
GET /user/{user_id}

Parameters

TYPE	NAME	    DESCRIPTTION
Path	user_id	    Corresponds to _id from MongoDB User collection

Sample Response:
{     
status:"ok",     
  data:{
    user:{
      first_name:"Brutus",
      last_name:"Conway",
      birthday:"1980-04-20T18:25:43.511Z",
      email:"brutus@happy.com",
      password:"Test123!",
      status:"I am loving living life!!!",
      auth_level:"basic"
    }
  },
  message:null
}	
```
---

## CodeBlogg - Login

#### What, if any DATA is required from the backend to render the wireframe?
None

#### What, if any, ACTIONS is this wireframe responsible for?
The login Wireframe has 2 buttons, are login button, and a link to redirect towards, the register page. The login buttons fetches logs you in while creating a session, since if you need to log in, it is without an active session.

POST /session/login
Parameters Name
Body       email,password 
Sample Response:
{
    "id": "68b769fe5fdf07261272770c",
    "first_name": "Aaron",
    "last_name": "snow",
    "auth_level": "admin",
    "status": "J'aime la neige!"
}
```
```
---

## CodeBlogg - Register

#### What, if any DATA is required from the backend to render the wireframe?
None

#### What, if any, ACTIONS is this wireframe responsible for?
This Wireframe is responsible for creating an account to use this platform
POST /user/register 
Parameters Name
Body       email,password, userData
Sample Response:
{
    "status": "ok",
    "data": {
        "id": "68c432d5ea3fa6f196780c76"
    },
    "message": "User created successfully"
}

```

```
---

## CodeBlogg - Base Frames and dropdown

#### What, if any DATA is required from the backend to render the wireframe?
UserName is required from backend to display on the menu dropdown 

#### What, if any, ACTIONS is this wireframe responsible for?
This Wireframe is responsible for both logging out and redirecting towards the account settings page. 
POST /session/logout 
Parameters Name
Query      token
Sample Response 
{
  Status: "ok",
  "message" : "successfully logged out"
}

```

```
---

## CodeBlogg - Post Modal

#### What, if any DATA is required from the backend to render the wireframe?
No data is required to render the Modal 

#### What, if any, ACTIONS is this wireframe responsible for?
This modal is responsible for making and posting information onto the website.
POST /post
Parameters Name 
Body       content, user_id, likes
Sample Response
{            
  status: 'ok',
  data: 
  {
    _id: 32498534756897346,
    content: "hi",
    user_id: 3498573498593876,
    likes: "0"",
    createdAt: 0000-00-00,
    comments: []
  },
  message: 'Post created successfully'   
}
```

```
---

## Main - User View

#### What, if any DATA is required from the backend to render the wireframe?
You need to access posts and user information such as username, status, and more
#### What, if any, ACTIONS is this wireframe responsible for?
This Wireframe is responsible for displaying information vital to the browsing experience of the user. The Initials, user status, user information and user posts are all reunited in a single page for easy access
GET /posts
Parameters Name
Sample Reponse:
{
    "status": "ok",
    "data": [
        {
            "_id": "68bc4ee18e243f691ade012c",
            "content": "balls",
            "user_id": "68b769fe5fdf07261272770c",
            "likes": 4,
            "createdAt": "2025-09-06T15:10:25.534Z",
            "comments": [
                {
                    "_id": "68c0349e2f8db55aeaa0c968",
                    "content": "is this a banger",
                    "post_id": "68bc4ee18e243f691ade012c",
                    "user_id": "68b99ba6603961e84e804d47",
                    "likes": 0,
                    "createdAt": "2025-09-09T14:07:26.587Z",
                    "updatedAt": "2025-09-09T14:07:26.587Z"
                }
            ]
        },
        {
            "_id": "68bc57fc8e243f691ade012d",
            "content": "67",
            "user_id": "68b99ba6603961e84e804d47",
            "likes": 67,
            "createdAt": "2025-09-06T15:49:16.311Z",
            "comments": []
        },
    ],
    "message": "Posts retrieved successfully"
}

```

```
---

## Main - Bloggs View

#### What, if any DATA is required from the backend to render the wireframe?
Bloggs information and user information
Get POST (same as above)

#### What, if any, ACTIONS is this wireframe responsible for?
you can like posts here
PATCH /post/:id
Parameters
params id
body content, user_id, likes
Sample Response:
{
    "status": "ok",
    "data": {
        "_id": "68bc4ee18e243f691ade012c",
        "content": "balls",
        "user_id": "68b769fe5fdf07261272770c",
        "likes": 67,
        "createdAt": "2025-09-06T15:10:25.534Z",
        "comments": []
    },
    "message": "Post updated successfully"
}
```

```
---

## Main - Network View

#### What, if any DATA is required from the backend to render the wireframe?
User information
GET /users
{
    "status": "ok",
    "data": [
        {
            "_id": "68b769fe5fdf07261272770c",
            "first_name": "Aaron",
            "last_name": "snow",
            "birthday": "2013-05-12",
            "status": "J'aime la neige!",
            "location": "North",
            "occupation": "King",
            "auth_level": "admin",
            "email": "123@123.com",
            "createdAt": "2025-09-02T22:04:46.086Z",
            "updatedAt": "2025-09-02T22:04:46.086Z"
        },
        {
            "_id": "68b99ba6603961e84e804d47",
            "first_name": "Aaron",
            "last_name": "Calkins",
            "birthday": "2007-01-26",
            "occupation": "Student",
            "location": "At home",
            "auth_level": "basic",
            "status": "penuts",
            "email": "mewhewn@gmail.com",
            "createdAt": "2025-09-04T14:01:10.327Z",
            "updatedAt": "2025-09-04T14:01:10.327Z"
        },
    ],
    "message": "Users retrieved successfully"
}
#### What, if any, ACTIONS is this wireframe responsible for?
None
```

```
---

## Main Admin view

#### What, if any DATA is required from the backend to render the wireframe?
It needs to check if a user is admin auth or not
#### What, if any, ACTIONS is this wireframe responsible for?
No actions yet

```

```
---
## CodeBlogg - Admin view

#### What, if any DATA is required from the backend to render the wireframe?
The information needed is whether the user has admin authorization 

#### What, if any, ACTIONS is this wireframe responsible for?
This wireframe is useful for managing content and user information from one single location making it conveniant and accessible 


```

```
What are reactive and responsive design?

In web design, taking on a reactive method simplu means that depending on the width of the device or the screen, the app will serve a different version of the application. For example, on CodeBloggs, if the window or device isn't wide enough to accomodate the large sidelocked navigation bar, it moves up to the top. The app is reactive as a result of the width or screen size, basically creating a version tailored to the needs of different users.

Responsive design is a bit similar, it's when you will have a single web page designed that can change to accomodate many users. For example, in Codebloggs admin pages there are a lot of longs lists of posts, users, comments, etc. If this were to be a reactive design, we would simply adjust the number of responses of screen depending on the screen size, but in responsive design, we add a filter to select how many you want to have.


The reason for the chosen reactive width being 1366 pixels is the following. One of the largest mobile devices is 1366 pixels wide and I want all mobile devices to have the sidebar on the top. 



```
---