# EcoTrack: Environmental Monitoring and Reporting Platform

The goal of EcoTrack, an innovative environmental monitoring and reporting platform, is to completely transform the gathering, handling, and dissemination of environmental data. EcoTrack, a backend API, was created with the goal of meeting the increasing demand for all-encompassing solutions in the environmental sector by offering a strong framework for user interaction, data aggregation, and informative reporting.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Vision](#vision)

## Introduction

EcoTrack serves as a robust backend API designed to handle environmental data collection, user profile management, environmental alerts, community reporting, sustainability scoring, educational resources provision, and open data access for researchers and organizations. It's a platform aimed at promoting environmental awareness, facilitating data sharing, and encouraging sustainable practices.

## Features

### Main Features:

1. **Data Collection:** Enables users to submit environmental data from various sources like IoT sensors, manual observations, or data uploads.
2. **User Profiles:** Users can create and manage profiles to track contributions and connect with others.
3. **Environmental Alerts:** Notification system for significant changes or concerning trends in environmental data.
4. **Community Reporting:** Allows users to report environmental issues such as pollution, deforestation, or wildlife endangerment.
5. **Sustainability Score:** A scoring system assessing users' environmental contributions and sustainability efforts.
6. **Educational Resources:** Provides articles and guides on environmental topics to raise awareness and educate users.
7. **Open Data Access:** Offers APIs for researchers, scientists, and organizations to access aggregated environmental data for research and analysis.

### Additional Features:

- **Socket.IO Integration:** Implemented for real-time alerts feature.
- **External API Integration:** Utilized to enhance functionality and supplement data collection.

## Technologies Used

- **Node.js:** Backend development platform.
- **Socket.IO:** Real-time communication for alerts.
- **MySQL:** Database for CRUD operations.
- **Postman:** API building, testing and documentation tool.
- **Git:** Version control system.

## Getting Started

To get started with EcoTrack API, follow these steps:

1. Clone the repository: `git clone https://github.com/AdvancedSoftwareTeam/EcoTrack.git` 
2. Install dependencies: `npm install`
3. Configure environment variables.
4. Run the application: `npm start`

## API Documentation

The API is fully documented using Postman. Access the documentation [here](https://documenter.getpostman.com/view/29528140/2s9YkuZyR9).

## Testing

#### Postman Testing Strategy

We have employed Postman for comprehensive API testing to ensure the functionality, reliability, and accuracy of the EcoTrack platform. Our testing strategy involves:

- **Automated Tests:** Writing automated test scripts within Postman to perform API endpoint testing, covering scenarios for data submission, user profile management, environmental alerts, community reporting, and more.
- **Environment Setup:** Configuring different environments within Postman to simulate various conditions and perform thorough testing.
- **Collection Runs:** Executing collection runs in Postman to validate endpoints, data validations, authentication mechanisms, and error handling.

**Instructions for Testing Using Postman:**

1. Import the provided Postman collection.
2. Set up the necessary environment variables, choose the *EcoTrack Env*.
3. Run collection tests individually or perform a collection run to test various API endpoints.

#### Demo 

click on the following link to watch the testing [demo video](https://drive.google.com/file/d/1IhVZ-JUvbNWw50SRC-YMC2zegsws5C2s/view?usp=sharing).

## Vision

EcoTrack strives to be more than a data platform—it's a catalyst for change. Through collaboration, awareness, and informed decisions, it spearheads environmental initiatives, empowering global communities and organizations.






