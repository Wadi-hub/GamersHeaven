# GamersHeaven
This is a full stack project including frontend in React and backend in SQL server

Abstract
The goal of this project is to develop a platform that integrates three core perspectives: user interaction for browsing and searching games, a robust bidding system for developers and publishers, and a multi-tier admin management system. Users can search and view detailed game information, while developers and publishers collaborate through an efficient bidding system. Admins, categorized into senior and junior managers, can perform specific roles such as updating, inserting, deleting, and monitoring change logs.

1.	Introduction
o	Objective: Include a focus on users interacting with a game-centric landing page.
o	Overview: Mention the differentiated functionalities of senior and junior admin roles.
2.	Problem Statement
o	Highlight the lack of platforms catering to users browsing games alongside developer-publisher collaboration.
3.	Requirements Analysis
o	Functional Requirements:
User Side:
	Landing page to browse and search for games with details like price, platform, and ratings fetched from the database.
	Admin Side:
	Senior Admin: Update, insert, delete game records; view change logs.
	Junior Admin: Update game records only.
4.	System Design
o	Add a new section in Front-End Design for User Pages, focusing on the home/landing page and game search functionalities.
o	Expand Admin Pages to distinguish between senior and junior roles, explicitly listing actions allowed for each role.
5.	Implementation
o	Detail specific procedures and triggers implemented to manage admin access control and maintain a change log for senior admin actions.
6.	Testing
o	Add Test Cases for:
	Searching for games by keyword or filter.
	Validating role-based admin permissions.
	Fetching accurate change logs for senior admins.




