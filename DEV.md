
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
│   ├───tui.js
│   ├───tui/
│   │   ├───add-session.js
│   │   ├───bulk-message.js
│   │   ├───export-results.js
│   │   ├───header.js
│   │   ├───import-numbers.js
│   │   ├───index.js
│   │   ├───results.js
│   │   ├───settings.js
│   │   ├───start-checker.js
│   │   └───test.js
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

## Lib Directory

The `lib` directory contains the core logic of the application.

*   **`config-manager.js`:** Manages the application's configuration, including the country code and total digits for number formatting.
*   **`file-handler.js`:** Handles file import and export operations.
*   **`validator.js`:** Provides functions for validating and formatting WhatsApp numbers.

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

To test the application, you can run the interactive CLI and test the different commands.

```bash
node index.js
```

Select the "Interactive CLI" option and test the following commands:

*   **Start Checker:** Starts the number checking process.
*   **Sessions:** Manage your WhatsApp sessions (add, list, remove).
*   **Import Numbers:** Import numbers from a text file.
*   **Export Results:** Export the results of the number check to a file (TXT, CSV, or XLSX).
*   **Bulk Message:** Send a message to all valid numbers.
*   **Settings:** Configure the country code and total digits for number formatting.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
