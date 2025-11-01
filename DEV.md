
# Developer Guide

This document provides instructions for developers working on the Jules project.

## Project Structure

```
Jules/
├───.git/
├───lib/
│   ├───config-manager.js
│   ├───file-handler.js
│   └───validator.js
├───node_modules/
├───sessions/
├───src/
│   ├───cli.js
│   ├───tui/
│   │   ├───add-session.js
│   │   ├───bulk-message.js
│   │   ├───export-results.js
│   │   ├───header.js
│   │   ├───import-numbers.js
│   │   ├───index.js
│   │   ├───logger.js
│   │   ├───main.js
│   │   ├───menu.js
│   │   ├───results.js
│   │   ├───settings.js
│   │   └───start-checker.js
│   └───whatsapp.js
├───.gitignore
├───config.json
├───index.js
├───numbers.txt
├───package-lock.json
├───package.json
├───README.md
└───start.sh
```

## Development

To get started with development, you will need to have Node.js and npm installed.

1.  Clone the repository:
    ```bash
    git clone https://github.com/reinhart-py/Jules.git
    ```
2.  Install the dependencies:
    ```bash
    cd Jules
    npm install
    ```
3.  Run the application:
    ```bash
    npm start
    ```

## Testing

To run the application in test mode, you can use the `--test-session` flag:

```bash
node src/tui/index.js --test-session
```

This will automatically start a test session and allow you to test the TUI features without manual interaction.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
