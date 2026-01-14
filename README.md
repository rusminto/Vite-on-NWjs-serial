# Vite on NW.js Template

https://github.com/user-attachments/assets/a15261e5-4ecd-4628-af6e-023650715da7

This is a template for building desktop applications using [NW.js](https://nwjs.io/) and [Vite](https://vitejs.dev/). It provides a basic setup to get you started with developing your application with a fast development and an efficient build process.

This template is inspired by [nw-vue3-boilerplate](https://github.com/nwutils/nw-vue3-boilerplate) , but it is framework-agnostic and uses only Vite for the web part.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/rusminto/Vite-on-NWjs.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Vite-on-NWjs
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Copy the app.config.sample.js into app.config.js in `src_background/config`

### Development

To run the application in development mode, execute the following command. This will start the Vite development server and launch the NW.js application.

```bash
npm start
```

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create a distributable application in the `dist` directory for the platforms specified in `package.json`.

## Further Information

For more details on configuring the NW.js build, refer to the [nw-builder documentation](https://github.com/nwutils/nw-builder).
