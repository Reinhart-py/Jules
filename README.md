# Jules - High-performance WhatsApp Number Checker

Jules is a high-performance WhatsApp number checker that provides two interfaces for interacting with the application: a Terminal User Interface (TUI) and an interactive Command Line Interface (CLI).

## Features

*   **TUI & CLI:** Choose between a graphical terminal interface or a command-line interface.
*   **Session Management:** Add, list, and manage multiple WhatsApp sessions.
*   **Number Checking:** Check numbers for validity on WhatsApp.
*   **Bulk Messaging:** Send messages to all valid numbers from the last check.
*   **Import/Export:** Import numbers from a file and export results to TXT, CSV, or XLSX.
*   **Anti-Ban Features:** Set a delay and limit for number checking to reduce the risk of being banned.
*   **Preset Country Code:** Set a default country code and total number of digits for automatic number formatting.

## Fixes

*   **Fixed `cli.js`:** Resolved issues with missing imports, variable scope, and error handling.
*   **Added `file-handler.js`:** Created a new file to handle file import and export operations.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/reinhart-py/Jules.git
    ```
2.  Install the dependencies:
    ```bash
    cd Jules
    npm install
    ```

## Usage

To start the application, run the following command:

```bash
npm start
```

This will prompt you to choose between the TUI Dashboard and the Interactive CLI.

### Interactive CLI

The interactive CLI provides a set of commands to manage sessions, check numbers, and send messages.

*   **Start Checker:** Starts the number checking process.
*   **Sessions:** Manage your WhatsApp sessions (add, list, remove).
*   **Import Numbers:** Import numbers from a text file.
*   **Export Results:** Export the results of the number check to a file (TXT, CSV, or XLSX).
*   **Bulk Message:** Send a message to all valid numbers.
*   **Settings:** Configure the country code and total digits for number formatting.
*   **Logs:** View logs (not yet implemented).
*   **Exit:** Exit the application.

### TUI Dashboard

The TUI dashboard provides a more visual way to interact with the application.

## Development

For development instructions, please see the [Developer Guide](DEV.md).

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## GitHub Repository

The GitHub repository for this project can be found at [https://github.com/reinhart-py/Jules](https://github.com/reinhart-py/Jules).