# My Discord Bot

A powerful and feature-rich Discord bot built with  [discord.js](https://discord.js.org/) ecosystem.

## Features

- **Modern Stack:** Built  for type safety and modern JavaScript features.
- **Scalable Structure:** Organized folder structure for commands, events, and utilities.
- **Configuration Ready:** Uses `dotenv` for easy management of environment variables.
- **Ready to Deploy:** Includes scripts for both development and production environments.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v16.9.0 or newer recommended)
- npm or yarn
- A Discord Bot Token. You can learn how to create a bot application and get a token from the discord.js guide.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/DiscordBot.git
    cd DiscordBot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```

    Now, open the `.env` file and add your specific credentials.

    ```env
    # .env
    DISCORD_TOKEN=your_bot_token_here
    CLIENT_ID=your_bot_client_id_here
    GUILD_ID=your_development_server_id_here
    Production=mode_for_register_slash_commands
    
    ```

    - `DISCORD_TOKEN`: The token for your bot from the Discord Developer Portal.
    - `CLIENT_ID`: The client ID of your bot application.
    - `GUILD_ID`: The ID of your development/test server. This is used for instantly registering slash commands during development.
    - `Production`: The mode for register slash commands to your development server or globally

## Usage

### Running the Bot

-   To start the bot for production:
    ```bash
    npm start
    ```
    This will compile the  JavaScript (if needed) and run the bot.

-   To registering slash commands:
    ```bash
    npm run commands
    ```
   This will register slash commands to your development server or globally to all servers, depending on the `Production` setting in your .env file.


  
