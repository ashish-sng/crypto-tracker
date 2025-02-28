# Crypto Tracker App

This project is a cryptocurrency tracking application built with [Create React App](https://github.com/facebook/create-react-app). It allows users to monitor real-time cryptocurrency prices, view historical trends, and track their favorite coins.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and medium deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Features

- Real-time cryptocurrency price updates.
- Historical price charts for major coins.
- Add and track your favorite cryptocurrencies.
- Responsive design for mobile and desktop users.

## Running with Docker

To containerize and run this application using Docker, follow these steps:

### Build the Docker Image

```sh
docker build -t crypto-tracker .
```

This command builds the Docker image and tags it as `crypto-tracker`.

### Run the Docker Container

```sh
docker run -d -p 3000:80 crypto-tracker
```

This command runs the container in detached mode (`-d`), mapping port `3000` on the host to port `80` inside the container (where Nginx serves the app).

### Stopping the Container

```sh
docker ps  # Find the container ID
docker stop <container_id>
```

### Removing the Container

```sh
docker rm <container_id>
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
