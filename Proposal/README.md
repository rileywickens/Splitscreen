Splitscreen Social App

## Problem Statement

When looking at video game platforms, people love to congregate there and share reviews and general community thoughts and feelings. Online interaction has become a core part of modern gaming culture, as players increasingly value not just playing games but also discussing them, comparing progress, and building friendships through shared experiences. That's why platforms like PlayStation, Xbox, and Steam have builtin social systems that fulfill this desire through features such as profiles, friend lists, forums, and review sections. However, because these platforms are siloed off from one another, people who play on multiple platforms don't have a central place to discuss games and show off their reivews across ecosystems in a unified way. This fragmentation can make the overall gaming experience feel disconnected, especially for players who invest time and identity into multiple gaming communities. Additionally, some older platforms don't have these social hubs anymore, so users must look for other websites that don't feel connected to the original gaming experience or player identity to have these discussions. As a result, conversations become scattered across different spaces, reducing the sense of cohesion and making it harder to build long lasting cross platform communities.

## Feature Description

#### Profile Features
Our application will provide users with a profile that aggregates all of their gaming activity across multiple platforms. This will allow users to showcase their gaming history, reviews, and activity in one location.
Users can:
- Display favorite games
- Track game status
- View personal review history
- Manage account settings and preferences

#### Game Review System
Users will be able to rate and review video games using a structured rating system. This feature supports discussion and shared community experiences, which are very important to modern gaming culture.
Core components:
- Star-based rating system
- Written reviews
- Viewing community reviews

#### Social Activity
To replicate the feeling found on platforms like Steam, Xbox, and Playstation this app will include an activity feed. When signed in users will see real-time friend activity.
The feed will display:
- Friend reviews
- Recently played games
- Game progress updates

#### Friend System 
This feature will include a built-in friend system to enable community interaction. This feature strengthens community building, which is something that has been used in major gaming ecosystems.
Users can:
- Send and accept friend requests
- View friend profiles
- Track friends' gaming activity

#### Game Discovery
A searchable game catalog will allow users to explore games across platforms. This addresses the issue of games being fragmented across different gaming services.
Filters for the search will include:
- Genre
- Ratings
- Platform
- Age ratings

#### PWA Functionality
As a PWA, the application will support offline interaction. When connectivity is restored, user content will automatically sync to the server, ensuring uninterrupted engagement.
Features include:
- Viewing previously loaded pages
- Accessing past reviews without internet
- Writing reviews offline

#### Account Settings
Users will be able to customize their experience through an account settings page. This allows personalization and increases identity within the platform.
Settings include:
- Username and profile management
- Content visibility preferences
- Favorite game selection
- Privacy controls

---

### PWA Capabilities

Our application is a perfect fit for a progressive web application because we are trying to build a social media application where users can discuss about video games that appear on different platforms. Modern users have little patience for slow or unresponsive platforms, especially when interacting in social spaces where  quickly and intuitive interactions with the application is central to the user experience. That's why having our application as an installable app that allows for content to load faster through caching and background data synchronization is a must have. By leveraging PWA features such as service workers, push notifications, and home-screen installation, we can create an experience that feels comparable to a native mobile application while still maintaining the accessibility of the web.

For example, in order for our platform to be successful, users will have to want to come to our app to communicate with other users. This requires seamless interactions and a sense of being a part of a community. If our platform causes users to struggle while waiting for content to load or refresh, then they will naturally migrate to other platforms that facilitate community interactions better, even if our platform offers more content. In a competitive social media landscape, performance and responsiveness often matter just as much as features themselves. Another feature that is a must have is allowing users to use the application offline. Sometimes users will want to log their own reviews for video games offline and then once their back online, they will want their reviews to be uploaded automatically. Further more, some users will want to review their past video game reviews to compare them to the current game they are playing, while not being connected to the internet. Without this feature, these users will feel friction from needing constant internet connectivity, which can discourage consistent engagement and content creation. By enabling offline functionality and automatic background syncing, our PWA ensures continuity, reliability, and a smoother overall user experience.

## Wireframes

### Mobile Views

![Top Half Mobile View Wireframes](Wireframes/Splitscreen-Phone-top-wireframe.png)
![Bottom Half Mobile View Wireframes](Wireframes/Splitscreen-Phone-bottom-wireframe.png)

Figma Link: https://www.figma.com/design/uPYV69kbb4RVqpyomXhSlL/Splitscreen-Wireframes?node-id=0-1&p=f&t=V4FG0s3l0ho9oN0G-0 

### Desktop Views

![Desktop View Wireframes](Wireframes/Splitscreen_Website_Wireframe.png)

Figma Link: https://www.figma.com/design/2jU7hkhojJmDua7A6JK25W/Splitscreen-Web-Wireframe?node-id=0-1&m=dev&t=DDDlYHxz6stKJogG-1

## Sources of Data Needed

To support discovery, game pages, filtering, and reviews, the application will need video game metadata, including game identity (title, cover art, summaries), release information, categorization, ratings, age guidance, and developer information. We will use the IGDB videogame database API as our single source for game data. The backend will make a call to IGDB every time a user searches for a game, opens a game page, browses lists, and filters content. IGDB requests will be made from  the backend to protect API credentials, validate data before sending it to the client, and to allow caching. IGDB provides coverage across platforms, making this the perfect option for an app that wants community interaction from all platforms.

## Team Member Contributions

#### Razvan Braha

* Feature Description
* Sources of Data
* Reviewed Wireframes

#### Morgan Sawyer

* Problem Statement
* PWA Capabilities
* Reviewed Wireframes

#### Riley Wickens

* Website Wireframes
* Mobile Wireframes
  
#### Milestone Effort Contribution

Razvan Braha  | Morgan Sawyer | Riley Wickens
------------- | ------------- | --------------
33.33%        | 33.33%        | 33.33%
